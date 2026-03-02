import * as SecureStore from "expo-secure-store";

const K_ACCESS = "access_token";
const K_REFRESH = "refresh_token";
const K_EXPIRES = "access_expires_at";

export async function setTokens(accessToken: string, refreshToken: string, expiresInSec: number) {
  const expiresAt = Date.now() + expiresInSec * 1000 - 10_000;
  await SecureStore.setItemAsync(K_ACCESS, accessToken);
  await SecureStore.setItemAsync(K_REFRESH, refreshToken);
  await SecureStore.setItemAsync(K_EXPIRES, String(expiresAt));
}

export async function getAccessToken() {
  return SecureStore.getItemAsync(K_ACCESS);
}

export async function getRefreshToken() {
  return SecureStore.getItemAsync(K_REFRESH);
}

export async function isAccessExpired() {
  const v = await SecureStore.getItemAsync(K_EXPIRES);
  if (!v) return true;
  return Date.now() >= Number(v);
}

export async function clearTokens() {
  await SecureStore.deleteItemAsync(K_ACCESS);
  await SecureStore.deleteItemAsync(K_REFRESH);
  await SecureStore.deleteItemAsync(K_EXPIRES);
}
