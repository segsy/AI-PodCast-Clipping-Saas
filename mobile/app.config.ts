import type { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "AI Podcast Clipping",
  slug: "ai-podcast-clipping",
  scheme: "aipodcast",
  version: "1.0.0",
  orientation: "portrait",
  plugins: ["expo-router", "expo-notifications"],
  android: {
    useNextNotificationsApi: true
  },
  ios: {
    supportsTablet: true
  },
  extra: {
    webBaseUrl: process.env.EXPO_PUBLIC_WEB_BASE_URL
  }
};

export default config;
