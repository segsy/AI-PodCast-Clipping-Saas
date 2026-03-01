import Upload from "react-native-background-upload";
import * as SecureStore from "expo-secure-store";
import { v4 as uuidv4 } from "uuid";

import { compressVideo } from "./compress";
import { getNetworkState } from "./network";
import { notifyUploadComplete, notifyUploadFailed } from "./notify";
import { getUploadSettings } from "./settings";
import { loadUploads, saveUploads } from "./storage";
import type { UploadItem } from "./types";
import { getCurrentWorkspaceId } from "../workspace";

const BASE_URL = process.env.EXPO_PUBLIC_WEB_BASE_URL!;

let running = false;
let loopTimer: ReturnType<typeof setTimeout> | null = null;

function now() {
  return Date.now();
}

async function updateItem(jobId: string, patch: Partial<UploadItem>) {
  const queue = await loadUploads();
  const next = queue.map((item) =>
    item.id === jobId ? { ...item, ...patch, updatedAt: now() } : item
  );
  await saveUploads(next);
  return next;
}

function sanitizeFilePath(path: string) {
  return path.replace("file://", "");
}

export async function enqueueUpload(params: {
  fileUri: string;
  fileName: string;
  mimeType?: string;
}) {
  const queue = await loadUploads();

  const item: UploadItem = {
    id: uuidv4(),
    fileUri: params.fileUri,
    fileName: params.fileName,
    mimeType: params.mimeType ?? "video/mp4",
    status: "queued",
    progress: 0,
    createdAt: now(),
    updatedAt: now()
  };

  await saveUploads([item, ...queue]);
  return item;
}

export async function pauseUpload(jobId: string) {
  const queue = await loadUploads();
  const item = queue.find((row) => row.id === jobId);

  if (item?.uploadId) {
    try {
      await Upload.cancelUpload(item.uploadId);
    } catch {
      // ignore cancel races
    }
  }

  await updateItem(jobId, {
    status: "paused",
    uploadId: undefined,
    progress: item?.status === "completed" ? 1 : 0
  });
}

export async function resumeUpload(jobId: string) {
  const queue = await loadUploads();
  const item = queue.find((row) => row.id === jobId);
  if (!item) return;
  if (item.status !== "paused" && item.status !== "failed") return;

  await updateItem(jobId, {
    status: "queued",
    error: undefined,
    uploadId: undefined,
    progress: 0
  });
}

export async function cancelUpload(jobId: string) {
  const queue = await loadUploads();
  const item = queue.find((row) => row.id === jobId);
  if (item?.uploadId) {
    try {
      await Upload.cancelUpload(item.uploadId);
    } catch {
      // ignore
    }
  }

  await updateItem(jobId, { status: "canceled", uploadId: undefined });
}

export async function removeUpload(jobId: string) {
  const queue = await loadUploads();
  await saveUploads(queue.filter((row) => row.id !== jobId));
}

async function startSingleUpload(item: UploadItem, onUpdate?: (q: UploadItem[]) => void) {
  const settings = await getUploadSettings();
  const net = await getNetworkState();
  if (!net.online) return;
  if (settings.wifiOnly && !net.wifi) return;

  let uploadUri = item.fileUri;

  if (settings.autoCompress) {
    const compressing = await updateItem(item.id, {
      status: "compressing",
      progress: 0,
      error: undefined
    });
    onUpdate?.(compressing);

    const compressed = await compressVideo(item.fileUri);
    uploadUri = compressed;

    const withCompressed = await updateItem(item.id, {
      compressedUri: compressed
    });
    onUpdate?.(withCompressed);
  }

  const token = await SecureStore.getItemAsync("access_token");
  const workspaceId = await getCurrentWorkspaceId();

  const uploading = await updateItem(item.id, {
    status: "uploading",
    progress: 0,
    error: undefined
  });
  onUpdate?.(uploading);

  const options = {
    url: `${BASE_URL}/api/upload`,
    path: sanitizeFilePath(uploadUri),
    method: "POST" as const,
    type: "multipart" as const,
    field: "file",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(workspaceId ? { "x-workspace-id": workspaceId } : {})
    },
    parameters: { filename: item.fileName },
    notification: {
      enabled: true,
      autoClear: true,
      onProgressTitle: "Uploading podcast…",
      onProgressMessage: item.fileName,
      onCompleteTitle: "Upload finished",
      onCompleteMessage: item.fileName,
      onErrorTitle: "Upload failed",
      onErrorMessage: item.fileName
    }
  };

  const uploadId = await Upload.startUpload(options);
  const withUploadId = await updateItem(item.id, { uploadId });
  onUpdate?.(withUploadId);

  Upload.addListener("progress", uploadId, async (data: { progress?: number }) => {
    const pct = Math.max(0, Math.min(1, (data.progress ?? 0) / 100));
    const next = await updateItem(item.id, { progress: pct });
    onUpdate?.(next);
  });

  Upload.addListener("error", uploadId, async (data: { error?: string }) => {
    const next = await updateItem(item.id, {
      status: "failed",
      error: data.error ?? "Upload error",
      uploadId: undefined
    });
    onUpdate?.(next);
    await notifyUploadFailed(item.fileName);
  });

  Upload.addListener("cancelled", uploadId, async () => {
    const latest = await loadUploads();
    const current = latest.find((row) => row.id === item.id);
    if (current?.status === "canceled" || current?.status === "paused") return;
    const next = await updateItem(item.id, {
      status: "paused",
      uploadId: undefined,
      progress: 0
    });
    onUpdate?.(next);
  });

  Upload.addListener("completed", uploadId, async (data: { responseBody?: string }) => {
    let podcastId: string | undefined;

    try {
      const parsed = data.responseBody ? (JSON.parse(data.responseBody) as { podcastId?: string }) : null;
      podcastId = parsed?.podcastId;
    } catch {
      podcastId = undefined;
    }

    if (podcastId) {
      try {
        await fetch(`${BASE_URL}/api/process`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(workspaceId ? { "x-workspace-id": workspaceId } : {})
          },
          body: JSON.stringify({ jobId: podcastId })
        });
      } catch {
        // non-fatal: upload is already successful
      }
    }

    const next = await updateItem(item.id, {
      status: "completed",
      progress: 1,
      uploadId: undefined,
      podcastId
    });
    onUpdate?.(next);
    await notifyUploadComplete(item.fileName);
  });
}

export async function startUploadWorker(onUpdate?: (q: UploadItem[]) => void) {
  if (running) return;
  running = true;

  const loop = async () => {
    if (!running) return;

    const settings = await getUploadSettings();
    const net = await getNetworkState();

    if (!net.online || (settings.wifiOnly && !net.wifi)) {
      onUpdate?.(await loadUploads());
      loopTimer = setTimeout(loop, 2000);
      return;
    }

    const queue = await loadUploads();
    const active = queue.filter((item) => item.status === "uploading" || item.status === "compressing").length;
    const canStart = Math.max(0, settings.concurrency - active);
    const candidates = queue.filter((item) => item.status === "queued").slice(0, canStart);

    for (const candidate of candidates) {
      const latest = await loadUploads();
      const current = latest.find((item) => item.id === candidate.id);
      if (!current || current.status !== "queued") continue;

      try {
        await startSingleUpload(current, onUpdate);
      } catch (error) {
        const next = await updateItem(current.id, {
          status: "failed",
          error: error instanceof Error ? error.message : "Failed",
          uploadId: undefined
        });
        onUpdate?.(next);
      }
    }

    onUpdate?.(await loadUploads());
    loopTimer = setTimeout(loop, 900);
  };

  loop();
}

export function stopUploadWorker() {
  running = false;
  if (loopTimer) {
    clearTimeout(loopTimer);
    loopTimer = null;
  }
}
