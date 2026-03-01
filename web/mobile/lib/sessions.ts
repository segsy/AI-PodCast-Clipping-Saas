import { api } from "./api";
import { getRefreshToken } from "./auth";

import type { MobileSessionDevice } from "../types/api";

export async function fetchSessions() {
  return api.get<{ sessions: MobileSessionDevice[] }>("/api/mobile/sessions");
}

export async function logoutOtherDevices() {
  const refreshToken = await getRefreshToken();
  return api.post<{ ok: boolean }>("/api/mobile/logout-others", { refreshToken });
}
