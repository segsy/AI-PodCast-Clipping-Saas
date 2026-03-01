import * as Notifications from "expo-notifications";
import * as FileSystem from "expo-file-system";
import * as SecureStore from "expo-secure-store";
import { v4 as uuidv4 } from "uuid";

import { loadQueue, saveQueue } from "./storage";
import type { UploadItem } from "./types";
import { isOnline, isWifiConnected } from "./wifi";
import { getCurrentWorkspaceId } from "../workspace";

type UploadSettings = {
  wifiOnly: boolean;
  concurrency: number;
  maxRetries: number;
};

const BASE_URL = process.env.EXPO_PUBLIC_WEB_BASE_URL!;
const SETTINGS_KEY = "upload_settings_v1";

let running = false;

export async function getUploadSettings(): Promise<UploadSettings> {
  const raw = await SecureStore.getItemAsync(SETTINGS_KEY);
  return raw ? (JSON.parse(raw) as UploadSettings) : { wifiOnly: false, concurrency: 2, maxRetries: 3 };
}

export async function setUploadSettings(settings: UploadSettings) {
  await SecureStore.setItemAsync(SETTINGS_KEY, JSON.stringify(settings));
}

export async function enqueueUpload(params: {
  fileUri: string;
  fileName: string;
  mimeType?: string;
  sizeBytes?: number;
}) {
  const queue = await loadQueue();
  const item: UploadItem = {
    id: uuidv4(),
    fileUri: params.fileUri,
    fileName: params.fileName,
    mimeType: params.mimeType ?? "video/mp4",
    sizeBytes: params.sizeBytes,
    status: "queued",
    progress: 0,
    retries: 0,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  await saveQueue([item, ...queue]);
  return item;
}

export async function pauseUpload(id: string) {
  const queue = await loadQueue();
  const next = queue.map((item) =>
    item.id === id && (item.status === "queued" || item.status === "uploading")
      ? { ...item, status: "paused" as const, updatedAt: Date.now() }
      : item
  );
  await saveQueue(next);
}

export async function resumeUpload(id: string) {
  const queue = await loadQueue();
  const next = queue.map((item) =>
    item.id === id && item.status === "paused"
      ? { ...item, status: "queued" as const, updatedAt: Date.now() }
      : item
  );
  await saveQueue(next);
}

export async function removeUpload(id: string) {
  const queue = await loadQueue();
  await saveQueue(queue.filter((item) => item.id !== id));
}

async function notifyUploadComplete(fileName: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Upload complete ✅",
      body: `${fileName} uploaded successfully.`
    },
    trigger: null
  });
}

async function processUpload(item: UploadItem, onUpdate?: (queue: UploadItem[]) => void) {
  const token = await SecureStore.getItemAsync("access_token");
  const workspaceId = await getCurrentWorkspaceId();

  const task = FileSystem.createUploadTask(
    `${BASE_URL}/api/upload`,
    item.fileUri,
    {
      fieldName: "file",
      httpMethod: "POST",
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(workspaceId ? { "x-workspace-id": workspaceId } : {})
      },
      parameters: {
        filename: item.fileName
      }
    },
    async (progress) => {
      const ratio = progress.totalBytesExpectedToSend
        ? progress.totalBytesSent / progress.totalBytesExpectedToSend
        : 0;

      const latest = await loadQueue();
      const next = latest.map((row) =>
        row.id === item.id ? { ...row, progress: ratio, updatedAt: Date.now() } : row
      );
      await saveQueue(next);
      onUpdate?.(next);
    }
  );

  const uploaded = await task.uploadAsync();
  if (!uploaded || uploaded.status !== 200) {
    throw new Error(uploaded?.body || "Upload failed");
  }

  const payload = JSON.parse(uploaded.body) as { podcastId?: string };

  if (payload.podcastId) {
    await fetch(`${BASE_URL}/api/process`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(workspaceId ? { "x-workspace-id": workspaceId } : {})
      },
      body: JSON.stringify({ jobId: payload.podcastId })
    });
  }

  const latest = await loadQueue();
  const next = latest.map((row) =>
    row.id === item.id
      ? {
          ...row,
          status: "completed" as const,
          progress: 1,
          podcastId: payload.podcastId,
          updatedAt: Date.now(),
          error: undefined
        }
      : row
  );
  await saveQueue(next);
  onUpdate?.(next);
  await notifyUploadComplete(item.fileName);
}

export async function startUploadWorker(onUpdate?: (queue: UploadItem[]) => void) {
  if (running) return;
  running = true;

  const tick = async () => {
    if (!running) return;

    const settings = await getUploadSettings();

    if (!(await isOnline())) {
      setTimeout(tick, 2500);
      return;
    }

    if (settings.wifiOnly && !(await isWifiConnected())) {
      setTimeout(tick, 2500);
      return;
    }

    let queue = await loadQueue();
    queue = queue.map((item) =>
      item.status === "uploading" ? { ...item, status: "queued" as const, updatedAt: Date.now() } : item
    );
    await saveQueue(queue);

    const uploadingCount = queue.filter((item) => item.status === "uploading").length;
    const slots = Math.max(0, settings.concurrency - uploadingCount);
    const candidates = queue.filter((item) => item.status === "queued").slice(0, slots);

    if (candidates.length === 0) {
      onUpdate?.(queue);
      setTimeout(tick, 1200);
      return;
    }

    for (const candidate of candidates) {
      const latest = await loadQueue();
      const current = latest.find((item) => item.id === candidate.id);
      if (!current || current.status !== "queued") continue;

      const marked = latest.map((item) =>
        item.id === candidate.id
          ? { ...item, status: "uploading" as const, updatedAt: Date.now(), error: undefined }
          : item
      );
      await saveQueue(marked);
      onUpdate?.(marked);

      try {
        await processUpload(candidate, onUpdate);
      } catch (error) {
        const failedState = await loadQueue();
        const updated = failedState.map((item) => {
          if (item.id !== candidate.id) return item;
          const retries = item.retries + 1;
          if (retries <= settings.maxRetries) {
            return {
              ...item,
              retries,
              status: "queued" as const,
              error: error instanceof Error ? error.message : "Upload failed",
              updatedAt: Date.now()
            };
          }
          return {
            ...item,
            retries,
            status: "failed" as const,
            error: error instanceof Error ? error.message : "Upload failed",
            updatedAt: Date.now()
          };
        });
        await saveQueue(updated);
        onUpdate?.(updated);
      }
    }

    setTimeout(tick, 600);
  };

  tick();
}

export function stopUploadWorker() {
  running = false;
}
