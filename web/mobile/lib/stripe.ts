import * as Linking from "expo-linking";

import { api } from "./api";

export async function openBillingPortal() {
  const { url } = await api.post<{ url: string }>("/api/stripe/portal");
  await Linking.openURL(url);
}
