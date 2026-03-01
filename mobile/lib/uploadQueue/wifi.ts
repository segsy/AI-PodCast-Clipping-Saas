import * as Network from "expo-network";

export async function isWifiConnected() {
  const state = await Network.getNetworkStateAsync();
  const kind = (state as { type?: string }).type;
  return Boolean(state.isConnected && state.isInternetReachable && kind === "WIFI");
}

export async function isOnline() {
  const state = await Network.getNetworkStateAsync();
  return Boolean(state.isConnected && state.isInternetReachable);
}
