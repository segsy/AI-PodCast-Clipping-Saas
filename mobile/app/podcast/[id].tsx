import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function PodcastDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={{ flex: 1, padding: 20, gap: 8 }}>
      <Text style={{ fontSize: 28, fontWeight: "700" }}>Podcast</Text>
      <Text style={{ color: "#52525b" }}>ID: {id}</Text>
      <Text style={{ color: "#71717a" }}>Progress and clip details can be rendered here.</Text>
    </View>
  );
}
