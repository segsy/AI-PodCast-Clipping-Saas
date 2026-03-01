import { clearTokens, getAccessToken, isAccessExpired } from "./auth";
import { getDeviceInfo } from "./device";
import { refreshAccessToken } from "./refresh";
import { getCurrentWorkspaceId } from "./workspace";

const BASE_URL = process.env.EXPO_PUBLIC_WEB_BASE_URL;

if (!BASE_URL) {
  throw new Error("EXPO_PUBLIC_WEB_BASE_URL is required");
}

async function request<T>(path: string, options: RequestInit = {}, retry = true): Promise<T> {
  let token = await getAccessToken();
  const workspaceId = await getCurrentWorkspaceId();
  const { deviceId } = getDeviceInfo();

  if (await isAccessExpired()) {
    token = await refreshAccessToken();
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(workspaceId ? { "x-workspace-id": workspaceId } : {}),
      ...(deviceId ? { "x-device-id": deviceId } : {})
    }
  });

  if (res.status === 401 && retry) {
    const newToken = await refreshAccessToken();
    if (!newToken) {
      await clearTokens();
      throw new Error("Session expired. Please sign in again.");
    }
    return request<T>(path, options, false);
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined
    }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined
    }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined
    }),
  del: <T>(path: string) => request<T>(path, { method: "DELETE" })
};
