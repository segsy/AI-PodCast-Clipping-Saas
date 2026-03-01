import AsyncStorage from "@react-native-async-storage/async-storage";

import type { DownloadItem } from "./types";

const KEY = "download_queue_v1";

export async function loadDownloads(): Promise<DownloadItem[]> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as DownloadItem[]) : [];
}

export async function saveDownloads(items: DownloadItem[]) {
  await AsyncStorage.setItem(KEY, JSON.stringify(items));
}
