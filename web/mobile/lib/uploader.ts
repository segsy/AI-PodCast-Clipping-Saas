import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

import {
  createControlPlane,
  createExpoFsAdapter,
  createUrlSessionAdapter,
  uploadMultipart
} from "@ai-podcast/uploader";

const API_BASE = process.env.EXPO_PUBLIC_API_BASE || "";

async function authHeader() {
  const token = await SecureStore.getItemAsync("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function uploadPodcastMobile(params: {
  fileUri: string;
  fileName: string;
  fileSize: number;
  networkHint: "wifi" | "cellular" | "unknown";
  useNativeBackground?: boolean;
  onProgress?: (p: { progress: number; bps: number; etaSec: number }) => void;
}) {
  const control = createControlPlane(`${API_BASE}/api`, authHeader);
  const adapter = params.useNativeBackground ? createUrlSessionAdapter() : createExpoFsAdapter(params.fileUri);

  return uploadMultipart(control, adapter, { fileName: params.fileName, fileSize: params.fileSize }, {
    networkHint: params.networkHint,
    preferAccelerate: true,
    concurrency: params.networkHint === "wifi" ? 3 : 1,
    maxRetries: 5,
    adaptive: true,
    resume: true,
    onProgress: (progress) => {
      params.onProgress?.({ progress: progress.progress, bps: progress.bps, etaSec: progress.etaSec });
    },
    persist: {
      sessionKey: `mp:${params.fileName}:${params.fileSize}`,
      load: async (key) => {
        const value = await AsyncStorage.getItem(key);
        return value ? JSON.parse(value) : null;
      },
      save: async (key, value) => AsyncStorage.setItem(key, JSON.stringify(value)),
      clear: async (key) => AsyncStorage.removeItem(key)
    }
  });
}
