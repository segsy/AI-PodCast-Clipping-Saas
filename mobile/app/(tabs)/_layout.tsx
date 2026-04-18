import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="dashboard" options={{ title: "Dashboard" }} />
      <Tabs.Screen name="uploads" options={{ title: "Uploads" }} />
      <Tabs.Screen name="downloads" options={{ title: "Downloads" }} />
      <Tabs.Screen name="clips" options={{ title: "Clips" }} />
      <Tabs.Screen name="analytics" options={{ title: "Analytics" }} />
      <Tabs.Screen name="billing" options={{ title: "Billing" }} />
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />
    </Tabs>
  );
}
