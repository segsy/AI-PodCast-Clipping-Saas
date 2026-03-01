import { useEffect, useState } from "react";
import { Text, View } from "react-native";

import { WorkspaceSwitcher } from "../../components/WorkspaceSwitcher";
import { api } from "../../lib/api";

type Metrics = {
  totalClips: number;
  averageViralScore: number;
  creditsRemaining: number;
  uploadsThisWeek: number;
};

export default function AnalyticsScreen() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  const load = async () => {
    const res = await api.get<{ metrics: Metrics }>("/api/analytics");
    setMetrics(res.metrics);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <View style={{ flex: 1, padding: 20, gap: 12 }}>
      <WorkspaceSwitcher onChanged={load} />
      <Text style={{ fontSize: 28, fontWeight: "700" }}>Analytics</Text>
      {!metrics ? (
        <Text style={{ color: "#52525b" }}>Loading metrics...</Text>
      ) : (
        <View style={{ gap: 8 }}>
          <Text>Total clips: {metrics.totalClips}</Text>
          <Text>Average viral score: {metrics.averageViralScore}</Text>
          <Text>Credits remaining: {metrics.creditsRemaining}</Text>
          <Text>Uploads this week: {metrics.uploadsThisWeek}</Text>
        </View>
      )}
    </View>
  );
}
