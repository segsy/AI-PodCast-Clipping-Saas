import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { api } from "../../../lib/api";

export default function CaptionEditorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [captions, setCaptions] = useState("Hook line here\nSecond line here");
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  const save = async () => {
    if (!id) return;
    const res = await api.post<{ aiSuggestions: string[] }>(`/api/clips/${id}/captions`, { captions });
    setAiSuggestions(res.aiSuggestions ?? []);
    Alert.alert("Saved", "Captions updated with AI suggestions.");
  };

  return (
    <View style={{ flex: 1, padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: "700" }}>AI Caption Editor</Text>
      <TextInput
        value={captions}
        onChangeText={setCaptions}
        multiline
        style={{ borderWidth: 1, borderColor: "#d4d4d8", borderRadius: 10, padding: 12, minHeight: 180, textAlignVertical: "top" }}
      />
      <Pressable onPress={save} style={{ borderRadius: 10, backgroundColor: "#111", padding: 12 }}>
        <Text style={{ color: "white", textAlign: "center", fontWeight: "600" }}>Save captions</Text>
      </Pressable>
      {aiSuggestions.map((s, i) => (
        <Text key={`${s}-${i}`} style={{ color: "#52525b" }}>• {s}</Text>
      ))}
    </View>
  );
}
