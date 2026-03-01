import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";

import { api } from "../../lib/api";
import { setTokens } from "../../lib/auth";
import { getDeviceInfo } from "../../lib/device";
import { registerForPushNotifications } from "../../lib/push";
import { resolveWorkspaceSelection } from "../../lib/workspace";
import type { MobileSession, Workspace } from "../../types/api";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const login = async () => {
    try {
      setLoading(true);
      setError(null);

      const device = getDeviceInfo();
      const data = await api.post<MobileSession>("/api/mobile/login", {
        email,
        password,
        deviceId: device.deviceId,
        deviceName: device.deviceName
      });
      await setTokens(data.accessToken, data.refreshToken, data.expiresIn);

      const ws = await api.get<{ workspaces: Workspace[]; defaultWorkspaceId: string | null }>("/api/workspaces");
      await resolveWorkspaceSelection(ws.workspaces ?? [], ws.defaultWorkspaceId ?? null);

      await registerForPushNotifications();
      router.replace("/(tabs)/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 28, fontWeight: "700" }}>Sign in</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 10, borderRadius: 8 }}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, padding: 10, borderRadius: 8 }}
      />
      {error ? <Text style={{ color: "#dc2626" }}>{error}</Text> : null}
      <Pressable onPress={login} style={{ backgroundColor: "#111", borderRadius: 10, padding: 12 }}>
        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "600" }}>
          {loading ? "Signing in..." : "Continue"}
        </Text>
      </Pressable>
    </View>
  );
}
