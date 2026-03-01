import AsyncStorage from "@react-native-async-storage/async-storage";

import type { UploadItem } from "./types";

const KEY = "tier2_upload_queue_v1";

export async function loadUploads(): Promise<UploadItem[]> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as UploadItem[]) : [];
}

export async function saveUploads(items: UploadItem[]) {
  await AsyncStorage.setItem(KEY, JSON.stringify(items));
}
