import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Network from "expo-network";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { ClipCard } from "../../components/ClipCard";
import { WorkspaceSwitcher } from "../../components/WorkspaceSwitcher";
import { api } from "../../lib/api";
import {
  getDownloadStorageUsageBytes,
  retryFailedDownloads,
  startDownloadWorker
} from "../../lib/downloadQueue/manager";
import { loadDownloads } from "../../lib/downloadQueue/storage";
import { isOnline } from "../../lib/network";
import type { Clip } from "../../types/api";

const CACHED_CLIPS_KEY = "cached_clips";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  return `${(mb / 1024).toFixed(1)} GB`;
}

export default function ClipsScreen() {
  const [onlineClips, setOnlineClips] = useState<Clip[]>([]);
  const [offlineMode, setOfflineMode] = useState(false);
  const [offlineOnly, setOfflineOnly] = useState(false);
  const [queueSize, setQueueSize] = useState(0);
  const [storageUsage, setStorageUsage] = useState("0 B");

  const loadOnline = useCallback(async () => {
    if (!(await isOnline())) {
      setOfflineMode(true);
      const cached = await AsyncStorage.getItem(CACHED_CLIPS_KEY);
      if (cached) setOnlineClips(JSON.parse(cached) as Clip[]);
      return;
    }

    const res = await api.get<{ clips: Clip[] }>("/api/clips");
    setOnlineClips(res.clips);
    await AsyncStorage.setItem(CACHED_CLIPS_KEY, JSON.stringify(res.clips));
    setOfflineMode(false);
  }, []);

  const loadQueueStats = useCallback(async () => {
    const downloads = await loadDownloads();
    setQueueSize(downloads.filter((it) => it.status !== "completed").length);
    setStorageUsage(formatBytes(await getDownloadStorageUsageBytes()));
  }, []);

  const clips = useMemo(() => {
    if (!offlineOnly && !offlineMode) return onlineClips;
    return onlineClips.filter((clip) => Boolean(clip.localUri));
  }, [onlineClips, offlineMode, offlineOnly]);

  const hydrateOfflineToOnline = useCallback(async () => {
    const downloads = await loadDownloads();
    const completed = new Map(
      downloads
        .filter((it) => it.status === "completed" && it.localVideoUri)
        .map((it) => [
          it.clipId,
          {
            localUri: it.localVideoUri,
            localSrtUri: it.localSrtUri,
            localTranscriptUri: it.localTranscriptUri
          }
        ])
    );

    setOnlineClips((existing) => existing.map((clip) => ({ ...clip, ...(completed.get(clip.id) ?? {}) })));
  }, []);

  const refreshAll = useCallback(async () => {
    await loadOnline();
    await hydrateOfflineToOnline();
    await loadQueueStats();
  }, [hydrateOfflineToOnline, loadOnline, loadQueueStats]);

  useEffect(() => {
    (async () => {
      await startDownloadWorker(async () => {
        await hydrateOfflineToOnline();
        await loadQueueStats();
      });
      await refreshAll();
    })();
  }, [refreshAll, hydrateOfflineToOnline, loadQueueStats]);

  useEffect(() => {
    const sub = Network.addNetworkStateListener((state) => {
      if (state.isConnected) {
        refreshAll();
      } else {
        setOfflineMode(true);
      }
    });

    return () => sub.remove();
  }, [refreshAll]);

  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }}>
      <WorkspaceSwitcher onChanged={refreshAll} />
      <Text style={{ fontSize: 28, fontWeight: "700" }}>Clips</Text>
      {offlineMode ? <Text style={{ color: "#b45309" }}>Offline mode enabled</Text> : null}

      <View style={{ flexDirection: "row", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <Pressable
          onPress={() => setOfflineOnly((current) => !current)}
          style={{ borderWidth: 1, borderColor: "#d4d4d8", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 }}
        >
          <Text style={{ fontWeight: "600" }}>{offlineOnly ? "All Clips" : "Offline only"}</Text>
        </Pressable>

        <Pressable
          onPress={async () => {
            await retryFailedDownloads();
            await loadQueueStats();
          }}
          style={{ borderWidth: 1, borderColor: "#d4d4d8", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 }}
        >
          <Text style={{ fontWeight: "600" }}>Retry failed</Text>
        </Pressable>

        <Text style={{ color: "#52525b" }}>Queue: {queueSize}</Text>
        <Text style={{ color: "#52525b" }}>Storage: {storageUsage}</Text>
      </View>

      {clips.map((clip) => (
        <ClipCard
          clip={clip}
          key={clip.id}
          onOpen={() => router.push(`/clip/${clip.id}`)}
          onOfflineChanged={refreshAll}
        />
      ))}

      {clips.length === 0 ? (
        <Text style={{ color: "#71717a" }}>{offlineOnly || offlineMode ? "No offline clips yet." : "No clips yet."}</Text>
      ) : null}
    </ScrollView>
  );
}
