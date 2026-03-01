import * as SecureStore from "expo-secure-store";

import type { Workspace } from "../types/api";

const KEY = "current_workspace_id";

export async function getCurrentWorkspaceId() {
  return SecureStore.getItemAsync(KEY);
}

export async function setCurrentWorkspaceId(id: string) {
  await SecureStore.setItemAsync(KEY, id);
}

export async function clearCurrentWorkspaceId() {
  await SecureStore.deleteItemAsync(KEY);
}

export async function resolveWorkspaceSelection(workspaces: Workspace[], defaultWorkspaceId: string | null) {
  const stored = await getCurrentWorkspaceId();
  const availableIds = workspaces.map((w) => w.id);

  if (stored && availableIds.includes(stored)) {
    await setCurrentWorkspaceId(stored);
    return stored;
  }

  const fallback = defaultWorkspaceId ?? workspaces[0]?.id ?? null;
  if (fallback) {
    await setCurrentWorkspaceId(fallback);
  }
  return fallback;
}
