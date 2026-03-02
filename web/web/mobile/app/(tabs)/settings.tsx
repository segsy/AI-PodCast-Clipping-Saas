import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";

import { logout } from "../../lib/logout";
import { fetchSessions, logoutOtherDevices } from "../../lib/sessions";
import type { MobileSessionDevice } from "../../types/api";

export default function SettingsScreen() {
  const [sessions, setSessions] = useState<MobileSessionDevice[]>([]);

  const loadSessions = async () => {
    const res = await fetchSessions();
    setSessions(res.sessions);
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const onLogout = async () => {
    await logout();
    router.replace("/(auth)/sign-in");
  };

  const onLogoutOthers = async () => {
    await logoutOtherDevices();
    await loadSessions();
  };

  return (
    <View style={{ flex: 1, padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 28, fontWeight: "700" }}>Settings</Text>
      <Pressable onPress={onLogoutOthers} style={{ borderWidth: 1, borderColor: "#d4d4d8", borderRadius: 10, padding: 12 }}>
        <Text style={{ textAlign: "center", fontWeight: "600" }}>Log out other devices</Text>
      </Pressable>
      {sessions.map((session) => (
        <View key={session.id} style={{ borderWidth: 1, borderColor: "#e4e4e7", borderRadius: 10, padding: 10 }}>
          <Text style={{ fontWeight: "600" }}>{session.deviceName}</Text>
          <Text style={{ color: "#52525b" }}>Last used: {new Date(session.lastUsedAt).toLocaleString()}</Text>
          <Text style={{ color: session.current ? "#166534" : "#71717a" }}>{session.current ? "Current device" : "Active session"}</Text>
        </View>
      ))}
      <Pressable onPress={onLogout} style={{ borderWidth: 1, borderColor: "#d4d4d8", borderRadius: 10, padding: 12 }}>
        <Text style={{ textAlign: "center", fontWeight: "600" }}>Sign out</Text>
      </Pressable>
    </View>
  );
}
