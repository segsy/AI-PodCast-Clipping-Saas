import * as FileSystem from "expo-file-system";
import * as Linking from "expo-linking";
import { ResizeMode, Video } from "expo-av";
import { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";

import { CaptionOverlay } from "./CaptionOverlay";
import { ProgressBar } from "./ProgressBar";
import {
  enqueueDownload,
  pauseDownload,
  removeDownload,
  resumeDownload
} from "../lib/downloadQueue/manager";
import { loadDownloads } from "../lib/downloadQueue/storage";
import type { DownloadItem, TranscriptSegment } from "../lib/downloadQueue/types";
import type { Clip } from "../types/api";

type Props = {
  clip: Clip;
  onOpen?: () => void;
  onOfflineChanged?: () => Promise<void> | void;
};

export function ClipCard({ clip, onOpen, onOfflineChanged }: Props) {
  const [downloadItem, setDownloadItem] = useState<DownloadItem | null>(null);
  const [segments, setSegments] = useState<TranscriptSegment[]>([]);
  const [timeSec, setTimeSec] = useState(0);

  const refreshDownload = async () => {
    const all = await loadDownloads();
    setDownloadItem(all.find((it) => it.clipId === clip.id) ?? null);
  };

  useEffect(() => {
    refreshDownload();
  }, [clip.id]);

  useEffect(() => {
    const id = setInterval(() => {
      refreshDownload();
    }, 1200);

    return () => clearInterval(id);
  }, [clip.id]);

  const videoUri = useMemo(
    () => downloadItem?.localVideoUri ?? clip.localUri ?? clip.previewUrl,
    [clip.localUri, clip.previewUrl, downloadItem?.localVideoUri]
  );

  useEffect(() => {
    let cancelled = false;

    const loadSegments = async () => {
      try {
        if (downloadItem?.localTranscriptUri) {
          const raw = await FileSystem.readAsStringAsync(downloadItem.localTranscriptUri);
          if (!cancelled) setSegments(JSON.parse(raw) as TranscriptSegment[]);
          return;
        }

        if (clip.localTranscriptUri) {
          const raw = await FileSystem.readAsStringAsync(clip.localTranscriptUri);
          if (!cancelled) setSegments(JSON.parse(raw) as TranscriptSegment[]);
          return;
        }

        setSegments(clip.transcript ?? []);
      } catch {
        if (!cancelled) setSegments([]);
      }
    };

    loadSegments();

    return () => {
      cancelled = true;
    };
  }, [clip.transcript, clip.localTranscriptUri, downloadItem?.localTranscriptUri]);

  const handleQueue = async () => {
    try {
      await enqueueDownload({
        clipId: clip.id,
        title: clip.title,
        remoteUrl: clip.downloadUrl,
        remoteSrtUrl: clip.srtUrl,
        remoteTranscript: clip.transcript
      });
      await refreshDownload();
      await onOfflineChanged?.();
      Alert.alert("Queued", "Clip added to downloads.");
    } catch (error) {
      Alert.alert("Queue failed", error instanceof Error ? error.message : "Please try again.");
    }
  };

  const handleRemove = async () => {
    if (!downloadItem) return;
    await removeDownload(downloadItem.id);
    await refreshDownload();
    await onOfflineChanged?.();
  };

  const canPause = downloadItem?.status === "downloading" || downloadItem?.status === "queued";

  return (
    <View style={{ borderWidth: 1, borderColor: "#e4e4e7", borderRadius: 12, padding: 12, gap: 8 }}>
      <View style={{ position: "relative" }}>
        <Video
          source={{ uri: videoUri }}
          style={{ width: "100%", height: 220, borderRadius: 8, backgroundColor: "#000" }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          onPlaybackStatusUpdate={(st: any) => {
            if (st?.isLoaded) setTimeSec((st.positionMillis ?? 0) / 1000);
          }}
        />
        <CaptionOverlay segments={segments} currentTimeSec={timeSec} />
      </View>

      <Text style={{ fontWeight: "700" }}>{clip.title}</Text>
      <Text style={{ color: "#52525b" }}>Viral score: {clip.viralScore}</Text>
      {downloadItem ? (
        <Text style={{ color: "#52525b" }}>
          Download: {downloadItem.status} ({(downloadItem.progress * 100).toFixed(0)}%)
        </Text>
      ) : null}
      {downloadItem ? <ProgressBar progress={downloadItem.progress * 100} /> : null}
      {downloadItem?.error ? <Text style={{ color: "#b91c1c" }}>Error: {downloadItem.error}</Text> : null}

      <View style={{ flexDirection: "row", gap: 16, flexWrap: "wrap" }}>
        {onOpen ? (
          <Pressable onPress={onOpen}>
            <Text style={{ color: "#111", fontWeight: "600" }}>Open</Text>
          </Pressable>
        ) : null}

        <Pressable onPress={() => Linking.openURL(clip.downloadUrl)}>
          <Text style={{ color: "#2563eb", fontWeight: "600" }}>Download URL</Text>
        </Pressable>

        {!downloadItem ? (
          <Pressable onPress={handleQueue}>
            <Text style={{ color: "#166534", fontWeight: "600" }}>Download</Text>
          </Pressable>
        ) : null}

        {canPause ? (
          <Pressable onPress={async () => {
            await pauseDownload(downloadItem.id);
            await refreshDownload();
            await onOfflineChanged?.();
          }}>
            <Text style={{ color: "#1d4ed8", fontWeight: "600" }}>Pause</Text>
          </Pressable>
        ) : null}

        {downloadItem?.status === "paused" || downloadItem?.status === "failed" ? (
          <Pressable onPress={async () => {
            await resumeDownload(downloadItem.id);
            await refreshDownload();
            await onOfflineChanged?.();
          }}>
            <Text style={{ color: "#1d4ed8", fontWeight: "600" }}>{downloadItem?.status === "failed" || downloadItem?.status === "queued" ? "Retry" : "Resume"}</Text>
          </Pressable>
        ) : null}

        {downloadItem ? (
          <Pressable onPress={handleRemove}>
            <Text style={{ color: "#b91c1c", fontWeight: "600" }}>Remove</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
