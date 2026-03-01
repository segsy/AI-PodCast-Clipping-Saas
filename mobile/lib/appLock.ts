import * as SecureStore from "expo-secure-store";

const LAST_ACTIVITY_KEY = "last_activity";
const LOCK_TIMEOUT_MINUTES = 5;

export async function recordActivity() {
  await SecureStore.setItemAsync(LAST_ACTIVITY_KEY, Date.now().toString());
}

export async function isAppLocked() {
  const value = await SecureStore.getItemAsync(LAST_ACTIVITY_KEY);
  if (!value) return true;

  const diff = Date.now() - Number(value);
  return diff > LOCK_TIMEOUT_MINUTES * 60 * 1000;
}
