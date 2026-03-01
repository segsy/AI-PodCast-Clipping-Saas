import NetInfo from "@react-native-community/netinfo";

export async function getNetworkState() {
  const state = await NetInfo.fetch();
  return {
    online: Boolean(state.isConnected && state.isInternetReachable),
    wifi: state.type === "wifi"
  };
}
