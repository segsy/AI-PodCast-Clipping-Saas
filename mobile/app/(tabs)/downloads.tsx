import { useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";

import { ProgressBar } from "../../components/ProgressBar";
import { WorkspaceSwitcher } from "../../components/WorkspaceSwitcher";
import {
  getDownloadStorageUsageBytes,
  pauseDownload,
  removeDownload,
  resumeDownload,
  startDownloadWorker
} from "../../lib/downloadQueue/manager";
import { loadDownloads } from "../../lib/downloadQueue/storage";
import type { DownloadItem } from "../../lib/downloadQueue/types";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  return `${(mb / 1024).toFixed(1)} GB`;
}

export default function DownloadsTab() {
  const [queue, setQueue] = useState<DownloadItem[]>([]);
  const [offlineOnly, setOfflineOnly] = useState(false);
  const [storageUsage, setStorageUsage] = useState("0 B");

  const refresh = async () => {
    const next = await loadDownloads();
    setQueue(next);
    setStorageUsage(formatBytes(await getDownloadStorageUsageBytes()));
  };

  useEffect(() => {
    (async () => {
      await refresh();
      await startDownloadWorker(async (q) => {
        setQueue(q);
        setStorageUsage(formatBytes(await getDownloadStorageUsageBytes()));
      }, 2);
    })();
  }, []);

  const filtered = useMemo(() => {
    if (!offlineOnly) return queue;
    return queue.filter((item) => item.status === "completed" && item.localVideoUri);
  }, [offlineOnly, queue]);

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <WorkspaceSwitcher onChanged={refresh} />

      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ fontSize: 24, fontWeight: "700" }}>Downloads</Text>
        <Text style={{ color: "#52525b" }}>Used: {storageUsage}</Text>
      </View>

      <Pressable
        onPress={() => setOfflineOnly((value) => !value)}
        style={{ borderWidth: 1, borderColor: "#d4d4d8", borderRadius: 10, padding: 10 }}
      >
        <Text style={{ fontWeight: "600" }}>{offlineOnly ? "Offline only: ON" : "Offline only: OFF"}</Text>
      </Pressable>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ borderWidth: 1, borderColor: "#e4e4e7", borderRadius: 12, padding: 12, marginBottom: 10, gap: 8 }}>
            <Text style={{ fontWeight: "700" }}>{item.title}</Text>
            <Text style={{ color: "#52525b" }}>
              {item.status} • {(item.progress * 100).toFixed(0)}%
            </Text>

            <ProgressBar progress={item.progress * 100} />

            {item.error ? <Text style={{ color: "#b91c1c" }}>Error: {item.error}</Text> : null}

            <View style={{ flexDirection: "row", gap: 14 }}>
              {item.status === "downloading" ? (
                <Pressable onPress={async () => {
                  await pauseDownload(item.id);
                  await refresh();
                }}>
                  <Text style={{ color: "#2563eb", fontWeight: "600" }}>Pause</Text>
                </Pressable>
              ) : null}

              {item.status === "paused" || item.status === "failed" ? (
                <Pressable onPress={async () => {
                  await resumeDownload(item.id);
                  await refresh();
                }}>
                  <Text style={{ color: "#2563eb", fontWeight: "600" }}>Resume</Text>
                </Pressable>
              ) : null}

              <Pressable onPress={async () => {
                await removeDownload(item.id);
                await refresh();
              }}>
                <Text style={{ color: "#b91c1c", fontWeight: "600" }}>Remove</Text>
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={{ color: "#71717a" }}>No downloads yet.</Text>}
      />
    </View>
  );
}
