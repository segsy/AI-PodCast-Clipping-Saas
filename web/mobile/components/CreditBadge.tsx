import { Text, View } from "react-native";

type Props = { credits: number };

export function CreditBadge({ credits }: Props) {
  return (
    <View style={{ backgroundColor: "#111", borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6 }}>
      <Text style={{ color: "white", fontWeight: "600" }}>{credits} credits</Text>
    </View>
  );
}
