import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

import { api } from "../api";
import { retryFailedDownloads, startDownloadWorker } from "../downloadQueue/manager";
import { startUploadWorker } from "../uploadQueue/manager";

export function startAutoSync() {
  return NetInfo.addEventListener(async (state) => {
    const online = Boolean(state.isConnected && state.isInternetReachable !== false);
    if (!online) return;

    try {
      const clips = await api.get("/api/clips");
      await AsyncStorage.setItem("cached_clips", JSON.stringify((clips as { clips?: unknown }).clips ?? []));
    } catch {
      // noop
    }

    try {
      await retryFailedDownloads();
    } catch {
      // noop
    }

    try {
      await startDownloadWorker();
    } catch {
      // noop
    }

    try {
      await startUploadWorker();
    } catch {
      // noop
    }
  });
}
