import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

import { api } from "./api";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowAlert: true
  })
});

export async function registerForPushNotifications() {
  if (!Device.isDevice) return null;

  const existing = await Notifications.getPermissionsAsync();
  let finalStatus = existing.status;

  if (finalStatus !== "granted") {
    const requested = await Notifications.requestPermissionsAsync();
    finalStatus = requested.status;
  }

  if (finalStatus !== "granted") return null;

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  await api.post<{ success: boolean }>("/api/mobile/push-token", { token });
  return token;
}
