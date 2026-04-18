import { Text, View } from "react-native";

export default function SignUp() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>Create account on web</Text>
      <Text style={{ color: "#52525b", marginTop: 8 }}>Sign-up is currently routed to the web app auth flow.</Text>
    </View>
  );
}
