import * as DocumentPicker from "expo-document-picker";
import { useEffect, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";

import { WorkspaceSwitcher } from "../../components/WorkspaceSwitcher";
import {
  enqueueUpload,
  getUploadSettings,
  pauseUpload,
  removeUpload,
  resumeUpload,
  setUploadSettings,
  startUploadWorker
} from "../../lib/uploadQueue/manager";
import { loadQueue } from "../../lib/uploadQueue/storage";
import type { UploadItem } from "../../lib/uploadQueue/types";

export default function Dashboard() {
  const [queue, setQueue] = useState<UploadItem[]>([]);
  const [wifiOnly, setWifiOnly] = useState(false);

  const refreshQueue = async () => {
    setQueue(await loadQueue());
  };

  useEffect(() => {
    (async () => {
      const settings = await getUploadSettings();
      setWifiOnly(settings.wifiOnly);

      await refreshQueue();
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
      mimeType: file.mimeType ?? "video/mp4",
      sizeBytes: file.size
    });

    await refreshQueue();
  };

  const toggleWifiOnly = async () => {
    const settings = await getUploadSettings();
    const next = { ...settings, wifiOnly: !settings.wifiOnly };
    await setUploadSettings(next);
    setWifiOnly(next.wifiOnly);
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <WorkspaceSwitcher />
      <Text style={{ fontSize: 24, fontWeight: "700" }}>Upload Queue</Text>

      <View style={{ flexDirection: "row", gap: 10 }}>
        <Pressable onPress={pickAndQueue} style={{ borderRadius: 10, backgroundColor: "#111", padding: 10 }}>
          <Text style={{ color: "#fff", fontWeight: "600" }}>Add Upload</Text>
        </Pressable>
        <Pressable
          onPress={toggleWifiOnly}
          style={{ borderRadius: 10, borderWidth: 1, borderColor: "#d4d4d8", padding: 10 }}
        >
          <Text style={{ fontWeight: "600" }}>WiFi Only: {wifiOnly ? "ON" : "OFF"}</Text>
        </Pressable>
      </View>

      <FlatList
        data={queue}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ borderWidth: 1, borderColor: "#e4e4e7", borderRadius: 12, padding: 12, marginBottom: 10, gap: 6 }}>
            <Text style={{ fontWeight: "600" }}>{item.fileName}</Text>
            <Text>Status: {item.status}</Text>
            <Text>Progress: {(item.progress * 100).toFixed(0)}%</Text>
            {item.error ? <Text style={{ color: "#dc2626" }}>Error: {item.error}</Text> : null}

            <View style={{ flexDirection: "row", gap: 12 }}>
              {(item.status === "uploading" || item.status === "queued") ? (
                <Pressable onPress={async () => {
                  await pauseUpload(item.id);
                  await refreshQueue();
                }}>
                  <Text style={{ color: "#2563eb" }}>Pause</Text>
                </Pressable>
              ) : null}

              {item.status === "paused" ? (
                <Pressable onPress={async () => {
                  await resumeUpload(item.id);
                  await refreshQueue();
                }}>
                  <Text style={{ color: "#2563eb" }}>Resume</Text>
                </Pressable>
              ) : null}

              <Pressable onPress={async () => {
                await removeUpload(item.id);
                await refreshQueue();
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
