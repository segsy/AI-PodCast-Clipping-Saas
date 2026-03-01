import { clearTokens, getRefreshToken, setTokens } from "./auth";
import { getDeviceInfo } from "./device";

const BASE_URL = process.env.EXPO_PUBLIC_WEB_BASE_URL!;

let refreshingPromise: Promise<string | null> | null = null;

export async function refreshAccessToken(): Promise<string | null> {
  if (refreshingPromise) return refreshingPromise;

  refreshingPromise = (async () => {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) return null;

    const device = getDeviceInfo();
    const res = await fetch(`${BASE_URL}/api/mobile/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        refreshToken,
        deviceId: device.deviceId,
        deviceName: device.deviceName
      })
    });

    if (!res.ok) {
      await clearTokens();
      return null;
    }

    const data = (await res.json()) as { accessToken: string; refreshToken: string; expiresIn: number };
    await setTokens(data.accessToken, data.refreshToken, data.expiresIn);
    return data.accessToken;
  })();

  try {
    return await refreshingPromise;
  } finally {
    refreshingPromise = null;
  }
}
