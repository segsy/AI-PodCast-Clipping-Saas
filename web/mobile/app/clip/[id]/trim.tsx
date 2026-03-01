import { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Button, Text, View } from "react-native";
import { ResizeMode, Video } from "expo-av";
import MultiSlider from "react-native-multi-slider";
import { useLocalSearchParams, useRouter } from "expo-router";

import { api } from "../../../lib/api";
import type { ClipDetail, TrimClipResponse } from "../../../types/api";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function formatTime(sec: number) {
  const s = Math.floor(sec);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

export default function TrimClipScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const videoRef = useRef<Video>(null);

  const [clip, setClip] = useState<ClipDetail | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [start, setStart] = useState<number>(0);
  const [end, setEnd] = useState<number>(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.get<ClipDetail>(`/api/clips/${id}`).then((data) => {
      setClip(data);
      const dur = data.durationSec ?? 60;
      setDuration(dur);
      setStart(0);
      setEnd(dur);
    });
  }, [id]);

  const minGap = useMemo(() => (duration >= 30 ? 2 : 1), [duration]);

  async function previewAt(sec: number) {
    if (!videoRef.current) return;
    await videoRef.current.setPositionAsync(sec * 1000);
  }

  async function saveTrim() {
    if (!clip || !id) return;
    const s = clamp(start, 0, duration);
    const e = clamp(end, 0, duration);
    if (e - s < minGap) return;

    setSaving(true);
    try {
      const res = await api.post<TrimClipResponse>(`/api/clips/${id}/trim`, {
        startSec: s,
        endSec: e,
        title: `${clip.title} (Trimmed)`
      });
      router.replace(`/clip/${res.newClipId}`);
    } finally {
      setSaving(false);
    }
  }

  if (!clip) return <Text style={{ padding: 16 }}>Loading...</Text>;

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "600" }}>Trim Clip</Text>
      <Text style={{ color: "#666" }}>Drag handles to choose start & end, then save as a new clip.</Text>

      <Video
        ref={videoRef}
        source={{ uri: clip.url }}
        style={{ width: "100%", height: 360, borderRadius: 12, backgroundColor: "#000" }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        onPlaybackStatusUpdate={(st) => {
          if (!st.isLoaded || !end) return;
          const t = st.positionMillis / 1000;
          if (t >= end) videoRef.current?.pauseAsync();
        }}
      />

      <View style={{ paddingVertical: 8 }}>
        <Text style={{ fontWeight: "600" }}>
          {formatTime(start)} — {formatTime(end)} ({formatTime(end - start)})
        </Text>

        <MultiSlider
          values={[start, end]}
          min={0}
          max={Math.max(1, duration)}
          step={0.1}
          allowOverlap={false}
          minMarkerOverlapDistance={10}
          snapped
          onValuesChange={(vals) => {
            const [s, e] = vals;
            if (e - s < minGap) return;
            setStart(s);
            setEnd(e);
          }}
          onValuesChangeFinish={(vals) => {
            previewAt(vals[0]);
          }}
        />

        <View style={{ flexDirection: "row", gap: 12 }}>
          <Button title="Preview Start" onPress={() => previewAt(start)} />
          <Button title="Preview End" onPress={() => previewAt(Math.max(0, end - 0.25))} />
        </View>
      </View>

      <View style={{ gap: 10 }}>
        {saving ? (
          <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
            <ActivityIndicator />
            <Text>Saving trimmed clip…</Text>
          </View>
        ) : (
          <Button title="Save Trim (New Clip)" onPress={saveTrim} />
        )}
        <Button title="Cancel" onPress={() => router.back()} />
      </View>
    </View>
  );
}
