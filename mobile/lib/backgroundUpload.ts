import * as FileSystem from "expo-file-system";

import { getAccessToken } from "./auth";
import { refreshAccessToken } from "./refresh";
import { getCurrentWorkspaceId } from "./workspace";
import type { UploadResponse } from "../types/api";

const BASE_URL = process.env.EXPO_PUBLIC_WEB_BASE_URL!;

function createTask(
  fileUri: string,
  fileName: string,
  token: string | null,
  workspaceId: string | null,
  onProgress?: (progress: number) => void
) {
  return FileSystem.createUploadTask(
    `${BASE_URL}/api/upload`,
    fileUri,
    {
      fieldName: "file",
      httpMethod: "POST",
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(workspaceId ? { "x-workspace-id": workspaceId } : {})
      },
      parameters: {
        filename: fileName
      },
      sessionType: FileSystem.FileSystemSessionType.BACKGROUND
    },
    (progress) => {
      if (!onProgress) return;
      const total = progress.totalBytesExpectedToSend || 1;
      onProgress(progress.totalBytesSent / total);
    }
  );
}

async function uploadOnce(
  fileUri: string,
  fileName: string,
  token: string | null,
  workspaceId: string | null,
  onProgress?: (progress: number) => void
) {
  const task = createTask(fileUri, fileName, token, workspaceId, onProgress);
  return task.uploadAsync();
}

export async function uploadPodcastInBackground(
  fileUri: string,
  fileName: string,
  onProgress?: (progress: number) => void
): Promise<UploadResponse> {
  let token = await getAccessToken();
  const workspaceId = await getCurrentWorkspaceId();
  let result;

  try {
    result = await uploadOnce(fileUri, fileName, token, workspaceId, onProgress);
  } catch {
    // transient failure retry once
    result = await uploadOnce(fileUri, fileName, token, workspaceId, onProgress);
  }

  if (result.status === 401) {
    token = await refreshAccessToken();
    result = await uploadOnce(fileUri, fileName, token, workspaceId, onProgress);
  }

  if (result.status < 200 || result.status >= 300) {
    throw new Error(result.body || `Upload failed: ${result.status}`);
  }

  return JSON.parse(result.body) as UploadResponse;
}
