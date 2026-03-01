import { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import { ResizeMode, Video } from "expo-av";
import { useLocalSearchParams, useRouter } from "expo-router";

import { api } from "../../lib/api";
import type { ClipDetail } from "../../types/api";

export default function ClipDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [clip, setClip] = useState<ClipDetail | null>(null);

  useEffect(() => {
    if (!id) return;
    api.get<ClipDetail>(`/api/clips/${id}`).then(setClip);
  }, [id]);

  if (!clip) return <Text style={{ padding: 16 }}>Loading...</Text>;

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "600" }}>{clip.title}</Text>
      <Video
        source={{ uri: clip.url }}
        style={{ width: "100%", height: 360, borderRadius: 12, backgroundColor: "#000" }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
      />
      <Button title="Trim this clip" onPress={() => router.push(`/clip/${id}/trim`)} />
      <Button title="Edit captions (AI)" onPress={() => router.push(`/clip/${id}/captions`)} />
    </View>
  );
}
