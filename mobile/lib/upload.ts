import { getAccessToken } from "./auth";
import { refreshAccessToken } from "./refresh";
import { getCurrentWorkspaceId } from "./workspace";
import type { UploadResponse } from "../types/api";

const BASE_URL = process.env.EXPO_PUBLIC_WEB_BASE_URL!;

async function sendUpload(fileUri: string, fileName: string, token: string | null, workspaceId: string | null) {
  const form = new FormData();

  form.append("file", {
    uri: fileUri,
    name: fileName,
    type: "video/mp4"
  } as never);

  return fetch(`${BASE_URL}/api/upload`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(workspaceId ? { "x-workspace-id": workspaceId } : {})
    },
    body: form
  });
}

export async function uploadPodcast(fileUri: string, fileName: string) {
  const token = await getAccessToken();
  const workspaceId = await getCurrentWorkspaceId();
  let res = await sendUpload(fileUri, fileName, token, workspaceId);

  if (res.status === 401) {
    const refreshed = await refreshAccessToken();
    res = await sendUpload(fileUri, fileName, refreshed, workspaceId);
  }

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json() as Promise<UploadResponse>;
}
