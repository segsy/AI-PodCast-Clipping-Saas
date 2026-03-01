import { View } from "react-native";

type Props = { progress: number };

export function ProgressBar({ progress }: Props) {
  return (
    <View style={{ height: 8, width: "100%", backgroundColor: "#e4e4e7", borderRadius: 999 }}>
      <View
        style={{
          height: 8,
          width: `${Math.max(0, Math.min(100, progress))}%`,
          backgroundColor: "#18181b",
          borderRadius: 999
        }}
      />
    </View>
  );
}
