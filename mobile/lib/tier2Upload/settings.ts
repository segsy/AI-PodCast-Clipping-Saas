import * as SecureStore from "expo-secure-store";

export type UploadSettings = {
  wifiOnly: boolean;
  autoCompress: boolean;
  concurrency: number;
};

const KEY = "tier2_upload_settings_v1";

export async function getUploadSettings(): Promise<UploadSettings> {
  const raw = await SecureStore.getItemAsync(KEY);
  return raw
    ? (JSON.parse(raw) as UploadSettings)
    : { wifiOnly: false, autoCompress: true, concurrency: 1 };
}

export async function setUploadSettings(settings: UploadSettings) {
  await SecureStore.setItemAsync(KEY, JSON.stringify(settings));
}
