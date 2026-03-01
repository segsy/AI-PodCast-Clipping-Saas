"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye, 
  Clock,
  ArrowUp,
  ArrowDown,
  Film,
  Download,
  Share2,
  Loader2,
  CheckCircle,
  XCircle,
  Loader
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { adminAnalytics } from "@/lib/admin-api";

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [period, setPeriod] = useState("30d");

  // Fetch analytics data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAnalytics.get({ period });
      setData(response);
    } catch (err: any) {
      setError(err.message || "Failed to fetch analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [period]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "48px" }}>
        <Loader2 size={32} style={{ animation: "spin 1s linear infinite" }} className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        border: "1px solid var(--error)",
        borderRadius: "8px",
        padding: "16px",
        color: "var(--error)"
      }}>
        {error}
      </div>
    );
  }

  const stats = data?.overview ? [
    { 
      title: "Total Users", 
      value: data.overview.totalUsers.toLocaleString(), 
      change: `${data.overview.userGrowth >= 0 ? "+" : ""}${data.overview.userGrowth}%`, 
      trend: data.overview.userGrowth >= 0 ? "up" : "down",
      icon: Users 
    },
    { 
      title: "Total Workspaces", 
      value: data.overview.totalWorkspaces.toLocaleString(), 
      change: "+5.2%", 
      trend: "up",
      icon: BarChart3 
    },
    { 
      title: "Total Clips", 
      value: data.overview.totalClips.toLocaleString(), 
      change: "+15.3%", 
      trend: "up",
      icon: Film 
    },
    { 
      title: "Active Subscriptions", 
      value: data.overview.activeSubscriptions.toLocaleString(), 
      change: "+8.2%", 
      trend: "up",
      icon: CheckCircle 
    },
  ] : [];

  const dailyEvents = data?.dailyEvents?.map((e: any) => ({
    date: e.date ? new Date(e.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "",
    events: e.count,
  })) || [];

  const topClips = data?.topClips?.slice(0, 5) || [];

  const workspaceActivity = data?.workspaceActivity?.slice(0, 5) || [];

  const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Page header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "white", marginBottom: "8px" }}>
            Analytics
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Track your video performance and audience engagement
          </p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          style={{
            padding: "8px 16px",
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            color: "white"
          }}
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", 
        gap: "16px" 
      }}>
        {stats.map((stat: any, index: number) => (
          <div 
            key={index}
            style={{ 
              backgroundColor: "var(--surface)", 
              borderRadius: "12px", 
              border: "1px solid var(--border)",
              padding: "20px"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
              <div style={{ 
                width: "40px", 
                height: "40px", 
                borderRadius: "8px", 
                backgroundColor: "var(--primary)", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center" 
              }}>
                <stat.icon size={20} style={{ color: "white" }} />
              </div>
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "4px",
                color: stat.trend === "up" ? "var(--success)" : "var(--error)",
                fontSize: "14px"
              }}>
                {stat.trend === "up" ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                {stat.change}
              </div>
            </div>
            <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>{stat.title}</p>
            <p style={{ fontSize: "28px", fontWeight: "bold", marginTop: "4px" }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "16px" }}>
        {/* Activity Chart */}
        <div style={{
          backgroundColor: "var(--surface)",
          borderRadius: "12px",
          border: "1px solid var(--border)",
          padding: "24px"
        }}>
          <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "24px" }}>Daily Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dailyEvents}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "var(--surface)", 
                  border: "1px solid var(--border)",
                  borderRadius: "8px"
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="events" 
                stroke="var(--primary)" 
                fill="var(--primary)" 
                fillOpacity={0.1} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top Workspaces */}
        <div style={{
          backgroundColor: "var(--surface)",
          borderRadius: "12px",
          border: "1px solid var(--border)",
          padding: "24px"
        }}>
          <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "24px" }}>Top Workspaces by Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={workspaceActivity} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis type="number" stroke="var(--text-muted)" />
              <YAxis dataKey="workspaceName" type="category" stroke="var(--text-muted)" width={120} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "var(--surface)", 
                  border: "1px solid var(--border)",
                  borderRadius: "8px"
                }} 
              />
              <Bar dataKey="eventCount" fill="var(--accent)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Clips */}
      <div style={{
        backgroundColor: "var(--surface)",
        borderRadius: "12px",
        border: "1px solid var(--border)",
        padding: "24px"
      }}>
        <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "24px" }}>Top Performing Clips</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {topClips.map((clip: any, index: number) => (
            <div 
              key={clip.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                backgroundColor: "var(--surface-hover)",
                borderRadius: "8px"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ 
                  width: "24px", 
                  height: "24px", 
                  borderRadius: "50%", 
                  backgroundColor: "var(--primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: "bold"
                }}>
                  {index + 1}
                </span>
                <div>
                  <p style={{ fontWeight: 500 }}>{clip.title || "Untitled"}</p>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    Status: {clip.status}
                  </p>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ 
                  fontWeight: "bold", 
                  color: clip.score && clip.score >= 80 ? "var(--success)" : 
                         clip.score && clip.score >= 50 ? "var(--warning)" : "var(--error)"
                }}>
                  {clip.score?.toFixed(1) || "N/A"}
                </p>
                <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Score</p>
              </div>
            </div>
          ))}
          {topClips.length === 0 && (
            <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "24px" }}>
              No clips data available
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
