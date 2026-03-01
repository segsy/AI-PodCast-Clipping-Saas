import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import * as Network from "expo-network";

import { WorkspaceSwitcher } from "../../components/WorkspaceSwitcher";
import { isOnline } from "../../lib/network";
import { openBillingPortal } from "../../lib/stripe";

export default function BillingScreen() {
  const [offlineMode, setOfflineMode] = useState(false);

  useEffect(() => {
    isOnline().then((online) => setOfflineMode(!online));
    const sub = Network.addNetworkStateListener((state) => {
      setOfflineMode(!(state.isConnected && state.isInternetReachable !== false));
    });
    return () => sub.remove();
  }, []);

  return (
    <View style={{ flex: 1, padding: 20, gap: 12 }}>
      <WorkspaceSwitcher />
      <Text style={{ fontSize: 28, fontWeight: "700" }}>Billing</Text>
      <Text style={{ color: "#52525b" }}>Manage plans and credits through Stripe Customer Portal.</Text>
      {offlineMode ? <Text style={{ color: "#b45309" }}>Offline mode: billing disabled</Text> : null}
      <Pressable
        disabled={offlineMode}
        onPress={openBillingPortal}
        style={{ borderRadius: 10, backgroundColor: offlineMode ? "#a1a1aa" : "#111", padding: 12 }}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "600" }}>Open billing portal</Text>
      </Pressable>
    </View>
  );
}
