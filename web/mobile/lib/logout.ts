import { api } from "./api";
import { clearTokens, getRefreshToken } from "./auth";
import { clearCurrentWorkspaceId } from "./workspace";

export async function logout() {
  const refreshToken = await getRefreshToken();

  try {
    if (refreshToken) {
      await api.post<{ ok: boolean }>("/api/mobile/logout", { refreshToken });
    }
  } finally {
    await clearTokens();
    await clearCurrentWorkspaceId();
  }
}
