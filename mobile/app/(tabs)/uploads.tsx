import * as DocumentPicker from "expo-document-picker";
import { useEffect, useState } from "react";
import { Button, FlatList, Pressable, Text, View } from "react-native";

import {
  cancelUpload,
  enqueueUpload,
  pauseUpload,
  removeUpload,
  resumeUpload,
  startUploadWorker
} from "../../lib/tier2Upload/manager";
import { getUploadSettings, setUploadSettings } from "../../lib/tier2Upload/settings";
import { loadUploads } from "../../lib/tier2Upload/storage";
import type { UploadItem } from "../../lib/tier2Upload/types";

export default function UploadsTab() {
  const [queue, setQueue] = useState<UploadItem[]>([]);
  const [wifiOnly, setWifiOnly] = useState(false);
  const [autoCompress, setAutoCompress] = useState(true);

  const refresh = async () => {
    setQueue(await loadUploads());
  };

  useEffect(() => {
    (async () => {
      const settings = await getUploadSettings();
      setWifiOnly(settings.wifiOnly);
      setAutoCompress(settings.autoCompress);

      await refresh();
      await startUploadWorker(setQueue);
    })();
  }, []);

  const pickAndQueue = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: "video/*" });
    if (result.canceled) return;

    const file = result.assets[0];
    await enqueueUpload({
      fileUri: file.uri,
      fileName: file.name,
      mimeType: file.mimeType ?? "video/mp4"
    });
    await refresh();
  };

  const toggleWifi = async () => {
    const settings = await getUploadSettings();
    const next = { ...settings, wifiOnly: !settings.wifiOnly };
    await setUploadSettings(next);
    setWifiOnly(next.wifiOnly);
  };

  const toggleCompress = async () => {
    const settings = await getUploadSettings();
    const next = { ...settings, autoCompress: !settings.autoCompress };
    await setUploadSettings(next);
    setAutoCompress(next.autoCompress);
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: "700" }}>Tier-2 Uploads</Text>

      <View style={{ gap: 10 }}>
        <Button title="Add Upload" onPress={pickAndQueue} />
        <Button title={wifiOnly ? "WiFi-only: ON" : "WiFi-only: OFF"} onPress={toggleWifi} />
        <Button title={autoCompress ? "Compress: ON" : "Compress: OFF"} onPress={toggleCompress} />
      </View>

      <FlatList
        data={queue}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ borderWidth: 1, borderRadius: 12, borderColor: "#e4e4e7", padding: 12, marginBottom: 10, gap: 6 }}>
            <Text style={{ fontWeight: "700" }}>{item.fileName}</Text>
            <Text>Status: {item.status}</Text>
            <Text>Progress: {(item.progress * 100).toFixed(0)}%</Text>
            {item.error ? <Text style={{ color: "crimson" }}>Error: {item.error}</Text> : null}
            {item.podcastId ? <Text>Podcast: {item.podcastId}</Text> : null}

            <View style={{ flexDirection: "row", gap: 12, marginTop: 6 }}>
              {(item.status === "queued" || item.status === "uploading" || item.status === "compressing") ? (
                <Pressable onPress={async () => {
                  await pauseUpload(item.id);
                  await refresh();
                }}>
                  <Text style={{ color: "#2563eb" }}>Pause</Text>
                </Pressable>
              ) : null}

              {(item.status === "paused" || item.status === "failed") ? (
                <Pressable onPress={async () => {
                  await resumeUpload(item.id);
                  await refresh();
                }}>
                  <Text style={{ color: "#2563eb" }}>Resume</Text>
                </Pressable>
              ) : null}

              {(item.status === "uploading" || item.status === "compressing") ? (
                <Pressable onPress={async () => {
                  await cancelUpload(item.id);
                  await refresh();
                }}>
                  <Text style={{ color: "#b91c1c" }}>Cancel</Text>
                </Pressable>
              ) : null}

              <Pressable onPress={async () => {
                await removeUpload(item.id);
                await refresh();
              }}>
                <Text style={{ color: "#b91c1c" }}>Remove</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
}
