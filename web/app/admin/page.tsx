"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  Film, 
  DollarSign, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  Folder
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
  Bar
} from "recharts";
import { adminAnalytics, adminUsers, adminClips, adminWorkspaces } from "@/lib/admin-api";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [period, setPeriod] = useState("30d");

  // Fetch analytics data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [analyticsData, usersData] = await Promise.all([
        adminAnalytics.get({ period }),
        adminUsers.list({ limit: 5, sortBy: "createdAt", sortOrder: "desc" }),
      ]);
      
      setAnalytics(analyticsData);
      setRecentUsers(usersData.users);
    } catch (err: any) {
      console.error("Failed to fetch dashboard data:", err);
      setError(err.message || "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [period]);

  const stats = analytics ? [
    { 
      name: "Total Users", 
      value: analytics.overview.totalUsers.toLocaleString(), 
      change: `${analytics.overview.userGrowth >= 0 ? "+" : ""}${analytics.overview.userGrowth}%`, 
      positive: analytics.overview.userGrowth >= 0,
      icon: Users 
    },
    { 
      name: "Total Workspaces", 
      value: analytics.overview.totalWorkspaces.toLocaleString(), 
      change: "+5.2%", 
      positive: true,
      icon: Workspace 
    },
    { 
      name: "Total Clips", 
      value: analytics.overview.totalClips.toLocaleString(), 
      change: "+15.3%", 
      positive: true,
      icon: Film 
    },
    { 
      name: "Active Subscriptions", 
      value: analytics.overview.activeSubscriptions.toLocaleString(), 
      change: "+8.2%", 
      positive: true,
      icon: DollarSign 
    },
  ] : [];

  const revenueData = analytics?.dailyEvents?.map((e: any, index: number) => ({
    month: e.date ? new Date(e.date).toLocaleDateString("en-US", { month: "short" }) : `Day ${index + 1}`,
    revenue: e.count * 10, // Mock revenue calculation
  })) || [
    { month: "Jan", revenue: 4000 },
    { month: "Feb", revenue: 3000 },
    { month: "Mar", revenue: 5000 },
    { month: "Apr", revenue: 4500 },
    { month: "May", revenue: 6000 },
    { month: "Jun", revenue: 5500 },
  ];

  const clipsData = analytics?.dailyEvents?.map((e: any, index: number) => ({
    month: e.date ? new Date(e.date).toLocaleDateString("en-US", { month: "short" }) : `Day ${index + 1}`,
    clips: e.count,
  })) || [
    { month: "Jan", clips: 120 },
    { month: "Feb", clips: 180 },
    { month: "Mar", clips: 250 },
    { month: "Apr", clips: 320 },
    { month: "May", clips: 410 },
    { month: "Jun", clips: 380 },
  ];

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
        <Loader2 size={32} style={{ animation: "spin 1s linear infinite" }} className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        gap: "24px",
        padding: "24px",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        borderRadius: "12px",
        border: "1px solid var(--error)"
      }}>
        <p style={{ color: "var(--error)" }}>{error}</p>
        <button 
          onClick={fetchData}
          style={{
            padding: "8px 16px",
            backgroundColor: "var(--primary)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            alignSelf: "flex-start"
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Page header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Dashboard</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>Welcome back! Here's what's happening.</p>
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

      {/* Stats cards */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
        gap: "16px" 
      }}>
        {stats.map((stat, index) => (
          <div key={index} style={{
            backgroundColor: "var(--surface)",
            borderRadius: "12px",
            border: "1px solid var(--border)",
            padding: "24px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>{stat.name}</p>
                <p style={{ fontSize: "32px", fontWeight: "bold", marginTop: "8px" }}>{stat.value}</p>
              </div>
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
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "16px" }}>
              {stat.positive ? (
                <ArrowUpRight size={16} style={{ color: "var(--success)" }} />
              ) : (
                <ArrowDownRight size={16} style={{ color: "var(--error)" }} />
              )}
              <span style={{ 
                color: stat.positive ? "var(--success)" : "var(--error)", 
                fontSize: "14px",
                fontWeight: 500 
              }}>
                {stat.change}
              </span>
              <span style={{ color: "var(--text-muted)", fontSize: "14px" }}>from last period</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "16px" }}>
        {/* Revenue Chart */}
        <div style={{
          backgroundColor: "var(--surface)",
          borderRadius: "12px",
          border: "1px solid var(--border)",
          padding: "24px"
        }}>
          <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "24px" }}>Activity Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--text-muted)" />
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
                dataKey="revenue" 
                stroke="var(--primary)" 
                fill="var(--primary)" 
                fillOpacity={0.1} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Clips Chart */}
        <div style={{
          backgroundColor: "var(--surface)",
          borderRadius: "12px",
          border: "1px solid var(--border)",
          padding: "24px"
        }}>
          <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "24px" }}>Clips Created</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={clipsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "var(--surface)", 
                  border: "1px solid var(--border)",
                  borderRadius: "8px"
                }} 
              />
              <Bar dataKey="clips" fill="var(--accent)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Users */}
      <div style={{
        backgroundColor: "var(--surface)",
        borderRadius: "12px",
        border: "1px solid var(--border)",
        padding: "24px"
      }}>
        <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "24px" }}>Recent Users</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {recentUsers.map((user) => (
            <div key={user.id} style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px",
              borderRadius: "8px",
              backgroundColor: "var(--surface-hover)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: "var(--primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  color: "white"
                }}>
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <p style={{ fontWeight: 500 }}>{user.name}</p>
                  <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>{user.email}</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <span style={{ 
                  padding: "4px 8px", 
                  borderRadius: "9999px", 
                  fontSize: "12px",
                  backgroundColor: "rgba(16, 185, 129, 0.1)",
                  color: "var(--success)"
                }}>
                  {user.status}
                </span>
                <span style={{ color: "var(--text-muted)", fontSize: "14px" }}>
                  {formatDate(user.createdAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
