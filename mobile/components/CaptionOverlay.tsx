import { useMemo } from "react";
import { Text, View } from "react-native";

import type { TranscriptSegment } from "../lib/downloadQueue/types";

export function CaptionOverlay({
  segments,
  currentTimeSec
}: {
  segments: TranscriptSegment[];
  currentTimeSec: number;
}) {
  const line = useMemo(() => {
    const active = segments.find((x) => currentTimeSec >= x.start && currentTimeSec <= x.end);
    return active?.text ?? "";
  }, [segments, currentTimeSec]);

  if (!line) return null;

  return (
    <View style={{ position: "absolute", bottom: 20, left: 16, right: 16, alignItems: "center" }}>
      <View style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, backgroundColor: "rgba(0,0,0,0.55)" }}>
        <Text style={{ color: "white", fontSize: 16, fontWeight: "700", textAlign: "center" }}>{line}</Text>
      </View>
    </View>
  );
}
