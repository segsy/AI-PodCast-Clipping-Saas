import { useEffect } from "react";
import { AppState, TouchableWithoutFeedback, View } from "react-native";
import * as Notifications from "expo-notifications";
import { Stack, router } from "expo-router";
import NetInfo from "@react-native-community/netinfo";

import { isAppLocked, recordActivity } from "../lib/appLock";
import { authenticateWithBiometrics } from "../lib/biometric";
import { startAutoSync } from "../lib/sync/syncManager";
import { ThemeProvider } from "../lib/theme";
import { startUploadWorker as startTier2UploadWorker } from "../lib/tier2Upload/manager";
import { startDownloadWorker } from "../lib/downloadQueue/manager";

export default function RootLayout() {
  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as { type?: string; podcastId?: string; clipId?: string };

      if (data?.type === "clips") {
        router.push("/(tabs)/clips");
      } else if (data?.type === "trim_finished" && data.clipId) {
        router.push(`/clip/${data.clipId}`);
      } else if (data?.type === "upload_finished" && data.podcastId) {
        router.push(`/(tabs)/dashboard`);
      }
    });

    return () => sub.remove();
  }, []);

  useEffect(() => {
    const unsubscribe = startAutoSync();
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    startTier2UploadWorker();
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected && state.isInternetReachable) {
        startTier2UploadWorker();
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    startDownloadWorker(undefined, 2);
  }, []);


  useEffect(() => {
    const checkLock = async () => {
      if (await isAppLocked()) {
        const success = await authenticateWithBiometrics();
        if (!success) {
          router.replace("/(auth)/sign-in");
          return;
        }
      }
      await recordActivity();
    };

    checkLock();

    const appStateSub = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        checkLock();
      }
    });

    return () => appStateSub.remove();
  }, []);

  return (
    <ThemeProvider>
      <TouchableWithoutFeedback onPress={recordActivity}>
        <View style={{ flex: 1 }}>
          <Stack screenOptions={{ headerBackTitle: "Back" }} />
        </View>
      </TouchableWithoutFeedback>
    </ThemeProvider>
  );
}
