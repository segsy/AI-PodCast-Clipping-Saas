import * as Notifications from "expo-notifications";

export async function notifyUploadComplete(fileName: string) {
  await Notifications.scheduleNotificationAsync({
    content: { title: "Upload complete ✅", body: `${fileName} uploaded.` },
    trigger: null
  });
}

export async function notifyUploadFailed(fileName: string) {
  await Notifications.scheduleNotificationAsync({
    content: { title: "Upload failed ❌", body: `${fileName} failed to upload.` },
    trigger: null
  });
}
