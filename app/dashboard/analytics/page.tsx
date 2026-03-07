"use client";

import { useState, useEffect } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Heart, 
  Share2, 
  Clock,
  Film,
  Calendar,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Filter,
  PieChart,
  Target,
  Globe,
  Activity,
  Loader2,
  FileSpreadsheet
} from "lucide-react";

// Mock data for when API is not available
const mockWeeklyData = [
  { day: "Mon", views: 4500, likes: 320, shares: 45 },
  { day: "Tue", views: 5200, likes: 410, shares: 62 },
  { day: "Wed", views: 4800, likes: 380, shares: 51 },
  { day: "Thu", views: 6100, likes: 520, shares: 78 },
  { day: "Fri", views: 7200, likes: 680, shares: 95 },
  { day: "Sat", views: 8500, likes: 820, shares: 120 },
  { day: "Sun", views: 9100, likes: 890, shares: 145 },
];

const mockMonthlyData = [
  { date: "Jan", views: 125000, likes: 8500, shares: 1200 },
  { date: "Feb", views: 142000, likes: 9200, shares: 1450 },
  { date: "Mar", views: 168000, likes: 11500, shares: 1800 },
  { date: "Apr", views: 195000, likes: 13200, shares: 2100 },
  { date: "May", views: 225000, likes: 15800, shares: 2500 },
  { date: "Jun", views: 258000, likes: 18200, shares: 2900 },
];

const mockTopClips = [
  { id: 1, title: "Top 5 Tips for Growing Your Podcast", views: "12.5K", growth: "+28%", platform: "YouTube" },
  { id: 2, title: "The Secret to Viral Content", views: "45.2K", growth: "+45%", platform: "TikTok" },
  { id: 3, title: "How I Gained 100K Followers", views: "28.7K", growth: "+32%", platform: "Instagram" },
  { id: 4, title: "Interview Highlights", views: "15.3K", growth: "+18%", platform: "YouTube" },
  { id: 5, title: "Q&A Best Moments", views: "8.9K", growth: "+12%", platform: "TikTok" },
];

const mockPlatformStats = [
  { name: "YouTube Shorts", views: "125.5K", percentage: 45, color: "#FF0000", likes: 12500, shares: 2100, comments: 3200 },
  { name: "TikTok", views: "98.2K", percentage: 35, color: "#000000", likes: 15200, shares: 4800, comments: 2100 },
  { name: "Instagram Reels", views: "56.8K", percentage: 20, color: "#E1306C", likes: 8900, shares: 1200, comments: 1800 },
];

const mockAudienceInsights = [
  { metric: "Age 18-24", percentage: 35, trend: "+12%" },
  { metric: "Age 25-34", percentage: 45, trend: "+8%" },
  { metric: "Age 35-44", percentage: 15, trend: "-2%" },
  { metric: "Age 45+", percentage: 5, trend: "0%" },
];

const mockLocationStats = [
  { country: "United States", views: "156K", percentage: 45 },
  { country: "United Kingdom", views: "68K", percentage: 19 },
  { country: "Canada", views: "42K", percentage: 12 },
  { country: "Australia", views: "35K", percentage: 10 },
  { country: "Other", views: "50K", percentage: 14 },
];

const mockPlatformMetrics = [
  { platform: "YouTube Shorts", metric: "Avg. Watch Time", value: "3:20", trend: "+12%", color: "#FF0000" },
  { platform: "TikTok", metric: "Engagement Rate", value: "12.5%", trend: "+8%", color: "#000000" },
  { platform: "Instagram Reels", metric: "Share Rate", value: "4.2%", trend: "+5%", color: "#E1306C" },
];

interface AnalyticsData {
  summary: {
    totalViews: number;
    totalLikes: number;
    totalShares: number;
    totalComments: number;
    totalNewFollowers: number;
    avgWatchTime: number;
    totalVideos: number;
    engagementRate: number;
  };
  dailyData: any[];
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("week");
  const [viewType, setViewType] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const workspaceId = localStorage.getItem("workspaceId") || "demo-workspace";
        const response = await fetch(`/api/analytics?workspaceId=${workspaceId}`);
        
        if (response.ok) {
          const data = await response.json();
          setAnalyticsData(data);
        }
      } catch (error) {
        console.log("Using mock data - API not available");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange]);

  const handleExport = async (format: string) => {
    setExporting(true);
    try {
      // Simulate export delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In production, this would generate actual reports
      const workspaceId = localStorage.getItem("workspaceId") || "demo-workspace";
      console.log(`Exporting ${format} report for workspace: ${workspaceId}`);
      
      // Create a mock download
      const data = analyticsData ? JSON.stringify(analyticsData, null, 2) : JSON.stringify({
        summary: {
          totalViews: mockWeeklyData.reduce((acc, d) => acc + d.views, 0),
          totalLikes: mockWeeklyData.reduce((acc, d) => acc + d.likes, 0),
          totalShares: mockWeeklyData.reduce((acc, d) => acc + d.shares, 0),
        },
        timeRange,
        exportedAt: new Date().toISOString()
      }, null, 2);
      
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-report-${timeRange}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setExporting(false);
    }
  };

  const chartData = analyticsData && analyticsData.dailyData && analyticsData.dailyData.length > 0 
    ? analyticsData.dailyData.slice(0, 7).map((d: any) => ({
        day: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }),
        views: Number(d.totalViews),
        likes: Number(d.totalLikes),
        shares: Number(d.totalShares),
      }))
    : mockWeeklyData;

  const weeklyData = chartData;

  const totalViews = analyticsData?.summary?.totalViews || weeklyData.reduce((acc, d) => acc + d.views, 0);
  const totalLikes = analyticsData?.summary?.totalLikes || weeklyData.reduce((acc, d) => acc + d.likes, 0);
  const totalShares = analyticsData?.summary?.totalShares || weeklyData.reduce((acc, d) => acc + d.shares, 0);
  const avgWatchTime = analyticsData?.summary?.avgWatchTime 
    ? `${Math.floor(analyticsData.summary.avgWatchTime / 60)}:${String(Math.floor(analyticsData.summary.avgWatchTime % 60)).padStart(2, '0')}`
    : "2:45";

  const maxViews = Math.max(...weeklyData.map(d => d.views));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Page header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>Analytics</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>Track your content performance</p>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            style={{
              padding: "8px 12px",
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              color: "white",
              fontSize: "14px"
            }}
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          
          {/* Export Dropdown */}
          <div style={{ position: "relative" }}>
            <button 
              onClick={() => handleExport('json')}
              disabled={exporting}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 12px",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                color: "white",
                fontSize: "14px",
                cursor: exporting ? "not-allowed" : "pointer",
                opacity: exporting ? 0.7 : 1
              }}
            >
              {exporting ? (
                <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
              ) : (
                <Download size={16} />
              )}
              {exporting ? "Exporting..." : "Export"}
            </button>
          </div>
        </div>
      </div>

      {/* View Tabs */}
      <div style={{ display: "flex", gap: "8px", padding: "8px", backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)" }}>
        {[
          { id: "realtime", name: "Real-time", icon: Activity },
          { id: "overview", name: "Overview", icon: BarChart3 },
          { id: "account", name: "Account", icon: Users },
          { id: "audience", name: "Audience Insights", icon: Target },
          { id: "platforms", name: "Platform Performance", icon: Globe },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setViewType(tab.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              backgroundColor: viewType === tab.id ? "var(--primary)" : "transparent",
              border: "none",
              borderRadius: "8px",
              color: viewType === tab.id ? "white" : "var(--text-secondary)",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            <tab.icon size={16} />
            {tab.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          justifyContent: "center", 
          minHeight: "400px",
          gap: "16px"
        }}>
          <Loader2 size={32} style={{ color: "var(--primary)", animation: "spin 1s linear infinite" }} />
          <p style={{ color: "var(--text-muted)" }}>Loading analytics data...</p>
        </div>
      ) : (
        <>
          {/* Conditional Content based on view type */}
          {viewType === "realtime" && (
            <>
              {/* Real-time Overview */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
                <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                    <div style={{ width: "36px", height: "36px", backgroundColor: "var(--primary)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Eye size={18} style={{ color: "white" }} />
                    </div>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Live Views</span>
                  </div>
                  <p style={{ fontSize: "28px", fontWeight: "bold", color: "white" }}>1,247</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
                    <span style={{ width: "8px", height: "8px", backgroundColor: "var(--success)", borderRadius: "50%" }} />
                    <span style={{ fontSize: "12px", color: "var(--success)", fontWeight: 500 }}>Live now</span>
                  </div>
                </div>

                <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                    <div style={{ width: "36px", height: "36px", backgroundColor: "var(--error)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Heart size={18} style={{ color: "white" }} />
                    </div>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Live Likes</span>
                  </div>
                  <p style={{ fontSize: "28px", fontWeight: "bold", color: "white" }}>892</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
                    <ArrowUpRight size={14} style={{ color: "var(--success)" }} />
                    <span style={{ fontSize: "12px", color: "var(--success)", fontWeight: 500 }}>+156/min</span>
                  </div>
                </div>

                <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                    <div style={{ width: "36px", height: "36px", backgroundColor: "var(--accent)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Share2 size={18} style={{ color: "white" }} />
                    </div>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Live Shares</span>
                  </div>
                  <p style={{ fontSize: "28px", fontWeight: "bold", color: "white" }}>124</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
                    <ArrowUpRight size={14} style={{ color: "var(--success)" }} />
                    <span style={{ fontSize: "12px", color: "var(--success)", fontWeight: 500 }}>+23/min</span>
                  </div>
                </div>

                <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                    <div style={{ width: "36px", height: "36px", backgroundColor: "var(--warning)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Users size={18} style={{ color: "white" }} />
                    </div>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Active Viewers</span>
                  </div>
                  <p style={{ fontSize: "28px", fontWeight: "bold", color: "white" }}>456</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
                    <span style={{ width: "8px", height: "8px", backgroundColor: "var(--success)", borderRadius: "50%" }} />
                    <span style={{ fontSize: "12px", color: "var(--success)", fontWeight: 500 }}>Watching</span>
                  </div>
                </div>
              </div>

              {/* Real-time Charts */}
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
                {/* Live Viewers Chart */}
                <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                    <h2 style={{ fontSize: "16px", fontWeight: "600", color: "white" }}>Live Viewers (Last 60 minutes)</h2>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ width: "8px", height: "8px", backgroundColor: "var(--success)", borderRadius: "50%" }} />
                      <span style={{ fontSize: "12px", color: "var(--success)" }}>Live</span>
                    </div>
                  </div>
                  
                  {/* Real-time bar chart */}
                  <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", height: "200px", gap: "4px" }}>
                    {Array.from({ length: 30 }, (_, i) => {
                      const height = Math.random() * 150 + 20;
                      return (
                        <div 
                          key={i} 
                          style={{ 
                            flex: 1, 
                            height: `${height}px`, 
                            backgroundColor: i > 25 ? "var(--primary)" : "var(--primary)/40",
                            borderRadius: "2px 2px 0 0",
                            transition: "height 0.3s"
                          }} 
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Platform Live Performance */}
                <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "24px" }}>
                  <h2 style={{ fontSize: "16px", fontWeight: "600", color: "white", marginBottom: "24px" }}>Live by Platform</h2>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {[
                      { name: "YouTube Shorts", viewers: 523, color: "#FF0000" },
                      { name: "TikTok", viewers: 412, color: "#000000" },
                      { name: "Instagram Reels", viewers: 312, color: "#E1306C" },
                    ].map((platform) => (
                      <div key={platform.name}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <div style={{ width: "12px", height: "12px", backgroundColor: platform.color, borderRadius: "2px" }} />
                            <span style={{ fontSize: "14px", color: "white" }}>{platform.name}</span>
                          </div>
                          <span style={{ fontSize: "14px", fontWeight: 500, color: "white" }}>{platform.viewers}</span>
                        </div>
                        <div style={{ width: "100%", height: "8px", backgroundColor: "var(--surface-hover)", borderRadius: "4px", overflow: "hidden" }}>
                          <div style={{
                            width: `${(platform.viewers / 600) * 100}%`,
                            height: "100%",
                            backgroundColor: platform.color,
                            borderRadius: "4px"
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Activity Feed */}
              <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)" }}>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h2 style={{ fontSize: "16px", fontWeight: "600", color: "white" }}>Real-time Activity</h2>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Updates every 5 seconds</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {[
                    { action: "New like", user: "@johndoe", platform: "YouTube Shorts", time: "2s ago" },
                    { action: "New follower", user: "@janedoe", platform: "TikTok", time: "5s ago" },
                    { action: "Video shared", user: "@contentcreator", platform: "Instagram Reels", time: "8s ago" },
                    { action: "Comment", user: "@viewer123", platform: "YouTube Shorts", time: "12s ago" },
                    { action: "New like", user: "@fan456", platform: "TikTok", time: "15s ago" },
                  ].map((activity, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "16px 20px",
                        borderBottom: "1px solid var(--border)"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <div style={{ width: "36px", height: "36px", backgroundColor: "var(--primary)/20", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Heart size={16} style={{ color: "var(--primary)" }} />
                        </div>
                        <div>
                          <p style={{ fontWeight: 500, color: "white", marginBottom: "2px" }}>{activity.action}</p>
                          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{activity.user} on {activity.platform}</span>
                        </div>
                      </div>
                      <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {viewType === "overview" && (
            <>
              {/* Overview Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px" }}>
                <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                    <div style={{ width: "36px", height: "36px", backgroundColor: "var(--primary)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Eye size={18} style={{ color: "white" }} />
                    </div>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Total Views</span>
                  </div>
                  <p style={{ fontSize: "28px", fontWeight: "bold", color: "white" }}>{(totalViews / 1000).toFixed(1)}K</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
                    <ArrowUpRight size={14} style={{ color: "var(--success)" }} />
                    <span style={{ fontSize: "12px", color: "var(--success)", fontWeight: 500 }}>+23%</span>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>vs last week</span>
                  </div>
                </div>

                <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                    <div style={{ width: "36px", height: "36px", backgroundColor: "var(--error)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Heart size={18} style={{ color: "white" }} />
                    </div>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Total Likes</span>
                  </div>
                  <p style={{ fontSize: "28px", fontWeight: "bold", color: "white" }}>{(totalLikes / 1000).toFixed(1)}K</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
                    <ArrowUpRight size={14} style={{ color: "var(--success)" }} />
                    <span style={{ fontSize: "12px", color: "var(--success)", fontWeight: 500 }}>+18%</span>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>vs last week</span>
                  </div>
                </div>

                <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                    <div style={{ width: "36px", height: "36px", backgroundColor: "var(--accent)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Share2 size={18} style={{ color: "white" }} />
                    </div>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Total Shares</span>
                  </div>
                  <p style={{ fontSize: "28px", fontWeight: "bold", color: "white" }}>{totalShares}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
                    <ArrowUpRight size={14} style={{ color: "var(--success)" }} />
                    <span style={{ fontSize: "12px", color: "var(--success)", fontWeight: 500 }}>+32%</span>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>vs last week</span>
                  </div>
                </div>

                <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                    <div style={{ width: "36px", height: "36px", backgroundColor: "var(--warning)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Clock size={18} style={{ color: "white" }} />
                    </div>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Avg. Watch Time</span>
                  </div>
                  <p style={{ fontSize: "28px", fontWeight: "bold", color: "white" }}>{avgWatchTime}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
                    <ArrowUpRight size={14} style={{ color: "var(--success)" }} />
                    <span style={{ fontSize: "12px", color: "var(--success)", fontWeight: 500 }}>+8%</span>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>vs last week</span>
                  </div>
                </div>

                <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                    <div style={{ width: "36px", height: "36px", backgroundColor: "var(--success)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Users size={18} style={{ color: "white" }} />
                    </div>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>New Followers</span>
                  </div>
                  <p style={{ fontSize: "28px", fontWeight: "bold", color: "white" }}>+2.5K</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
                    <ArrowUpRight size={14} style={{ color: "var(--success)" }} />
                    <span style={{ fontSize: "12px", color: "var(--success)", fontWeight: 500 }}>+45%</span>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>vs last week</span>
                  </div>
                </div>
              </div>

              {/* Charts Row */}
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
                {/* Views Chart */}
                <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                    <h2 style={{ fontSize: "16px", fontWeight: "600", color: "white" }}>Views This {timeRange === 'week' ? 'Week' : timeRange === 'month' ? 'Month' : 'Year'}</h2>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <div style={{ width: "8px", height: "8px", backgroundColor: "var(--primary)", borderRadius: "50%" }} />
                        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Views</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Bar Chart */}
                  <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", height: "200px", gap: "12px" }}>
                    {weeklyData.map((day, index) => (
                      <div key={index} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                        <div style={{ 
                          width: "100%", 
                          height: `${(day.views / maxViews) * 180}px`, 
                          backgroundColor: "var(--primary)",
                          borderRadius: "4px 4px 0 0",
                          transition: "height 0.3s",
                          minHeight: "20px"
                        }} />
                        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{day.day}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Platform Distribution */}
                <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "24px" }}>
                  <h2 style={{ fontSize: "16px", fontWeight: "600", color: "white", marginBottom: "24px" }}>Platform Distribution</h2>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {mockPlatformStats.map((platform) => (
                      <div key={platform.name}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <div style={{ width: "12px", height: "12px", backgroundColor: platform.color, borderRadius: "2px" }} />
                            <span style={{ fontSize: "14px", color: "white" }}>{platform.name}</span>
                          </div>
                          <span style={{ fontSize: "14px", fontWeight: 500, color: "white" }}>{platform.views}</span>
                        </div>
                        <div style={{ width: "100%", height: "8px", backgroundColor: "var(--surface-hover)", borderRadius: "4px", overflow: "hidden" }}>
                          <div style={{
                            width: `${platform.percentage}%`,
                            height: "100%",
                            backgroundColor: platform.color,
                            borderRadius: "4px"
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>Total</span>
                      <span style={{ fontSize: "16px", fontWeight: 600, color: "white" }}>280.5K</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Performing Clips */}
              <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)" }}>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h2 style={{ fontSize: "16px", fontWeight: "600", color: "white" }}>Top Performing Clips</h2>
                  <button style={{ color: "var(--primary)", fontSize: "14px", background: "none", border: "none", cursor: "pointer" }}>
                    View All
                  </button>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {mockTopClips.map((clip, index) => (
                    <div
                      key={clip.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "16px 20px",
                        borderBottom: "1px solid var(--border)"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <span style={{ fontSize: "18px", fontWeight: 600, color: "var(--text-muted)", width: "24px" }}>
                          {index + 1}
                        </span>
                        <div>
                          <p style={{ fontWeight: 500, color: "white", marginBottom: "4px" }}>{clip.title}</p>
                          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{clip.platform}</span>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                        <div style={{ textAlign: "right" }}>
                          <p style={{ fontWeight: 500, color: "white" }}>{clip.views}</p>
                          <p style={{ fontSize: "12px", color: "var(--success)" }}>{clip.growth}</p>
                        </div>
                        <button style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                          <ArrowUpRight size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {viewType === "account" && (
            <>
              {/* Account Metrics */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
                <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                    <div style={{ width: "36px", height: "36px", backgroundColor: "var(--primary)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Users size={18} style={{ color: "white" }} />
                    </div>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Total Followers</span>
                  </div>
                  <p style={{ fontSize: "28px", fontWeight: "bold", color: "white" }}>156K</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
                    <ArrowUpRight size={14} style={{ color: "var(--success)" }} />
                    <span style={{ fontSize: "12px", color: "var(--success)", fontWeight: 500 }}>+12%</span>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>vs last month</span>
                  </div>
                </div>

                <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                    <div style={{ width: "36px", height: "36px", backgroundColor: "var(--accent)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Activity size={18} style={{ color: "white" }} />
                    </div>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Engagement Rate</span>
                  </div>
                  <p style={{ fontSize: "28px", fontWeight: "bold", color: "white" }}>8.5%</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
                    <ArrowUpRight size={14} style={{ color: "var(--success)" }} />
                    <span style={{ fontSize: "12px", color: "var(--success)", fontWeight: 500 }}>+1.2%</span>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>vs last week</span>
                  </div>
                </div>

                <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                    <div style={{ width: "36px", height: "36px", backgroundColor: "var(--warning)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Target size={18} style={{ color: "white" }} />
                    </div>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Click-through Rate</span>
                  </div>
                  <p style={{ fontSize: "28px", fontWeight: "bold", color: "white" }}>3.2%</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
                    <ArrowDownRight size={14} style={{ color: "var(--error)" }} />
                    <span style={{ fontSize: "12px", color: "var(--error)", fontWeight: 500 }}>-0.5%</span>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>vs last week</span>
                  </div>
                </div>

                <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                    <div style={{ width: "36px", height: "36px", backgroundColor: "var(--success)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Calendar size={18} style={{ color: "white" }} />
                    </div>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Posts This Month</span>
                  </div>
                  <p style={{ fontSize: "28px", fontWeight: "bold", color: "white" }}>48</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
                    <ArrowUpRight size={14} style={{ color: "var(--success)" }} />
                    <span style={{ fontSize: "12px", color: "var(--success)", fontWeight: 500 }}>+25%</span>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>vs last month</span>
                  </div>
                </div>
              </div>

              {/* Monthly Growth Chart */}
              <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "24px" }}>
                <h2 style={{ fontSize: "16px", fontWeight: "600", color: "white", marginBottom: "24px" }}>Monthly Performance</h2>
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", height: "250px", gap: "16px" }}>
                  {mockMonthlyData.map((month: { date: string; views: number }, index: number) => {
                    const maxMonthViews = Math.max(...mockMonthlyData.map((m: { views: number }) => m.views));
                    return (
                      <div key={index} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                        <div style={{ 
                          width: "100%", 
                          height: `${(month.views / maxMonthViews) * 200}px`, 
                          backgroundColor: "var(--primary)",
                          borderRadius: "4px 4px 0 0",
                          transition: "height 0.3s",
                          minHeight: "20px"
                        }} />
                        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{month.date}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {viewType === "audience" && (
            <>
              {/* Audience Insights */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "24px" }}>
                {/* Age Demographics */}
                <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "24px" }}>
                  <h2 style={{ fontSize: "16px", fontWeight: "600", color: "white", marginBottom: "24px" }}>Age Distribution</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {mockAudienceInsights.map((item, index) => (
                      <div key={index}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                          <span style={{ fontSize: "14px", color: "white" }}>{item.metric}</span>
                          <span style={{ fontSize: "14px", fontWeight: 500, color: "white" }}>{item.percentage}%</span>
                        </div>
                        <div style={{ width: "100%", height: "8px", backgroundColor: "var(--surface-hover)", borderRadius: "4px", overflow: "hidden" }}>
                          <div style={{
                            width: `${item.percentage}%`,
                            height: "100%",
                            backgroundColor: "var(--primary)",
                            borderRadius: "4px"
                          }} />
                        </div>
                        <div style={{ fontSize: "12px", color: item.trend.startsWith("+") ? "var(--success)" : item.trend.startsWith("-") ? "var(--error)" : "var(--text-muted)", marginTop: "4px" }}>
                          {item.trend} vs previous period
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Location Data */}
                <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "24px" }}>
                  <h2 style={{ fontSize: "16px", fontWeight: "600", color: "white", marginBottom: "24px" }}>Top Locations</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {mockLocationStats.map((item, index) => (
                      <div key={index}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                          <span style={{ fontSize: "14px", color: "white" }}>{item.country}</span>
                          <span style={{ fontSize: "14px", fontWeight: 500, color: "white" }}>{item.views}</span>
                        </div>
                        <div style={{ width: "100%", height: "8px", backgroundColor: "var(--surface-hover)", borderRadius: "4px", overflow: "hidden" }}>
                          <div style={{
                            width: `${item.percentage}%`,
                            height: "100%",
                            backgroundColor: "var(--accent)",
                            borderRadius: "4px"
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Audience Activity */}
              <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "24px" }}>
                <h2 style={{ fontSize: "16px", fontWeight: "600", color: "white", marginBottom: "24px" }}>Audience Activity</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                  {[
                    { metric: "Most Active Day", value: "Friday", time: "7:00 PM" },
                    { metric: "Peak Engagement", value: "Comments", rate: "12%" },
                    { metric: "Avg. Watch Time", value: "2:45", improvement: "+15%" },
                  ].map((item, index) => (
                    <div key={index} style={{ padding: "20px", backgroundColor: "var(--background)", borderRadius: "8px" }}>
                      <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>{item.metric}</p>
                      <p style={{ fontSize: "20px", fontWeight: "bold", color: "white" }}>{item.value}</p>
                      <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
                        {item.time || item.rate || item.improvement}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {viewType === "platforms" && (
            <>
              {/* Platform Performance - Platform Comparison */}
              <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "24px" }}>
                <h2 style={{ fontSize: "16px", fontWeight: "600", color: "white", marginBottom: "24px" }}>Platform Comparison</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
                  {mockPlatformStats.map((platform, index) => (
                    <div key={index} style={{ padding: "20px", backgroundColor: "var(--background)", borderRadius: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                        <div style={{ width: "12px", height: "12px", backgroundColor: platform.color, borderRadius: "2px" }} />
                        <span style={{ fontSize: "14px", fontWeight: 500, color: "white" }}>{platform.name}</span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <div>
                          <p style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>{platform.views}</p>
                          <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Total Views</p>
                        </div>
                        <div>
                          <p style={{ fontSize: "18px", fontWeight: "bold", color: "white" }}>{platform.percentage}%</p>
                          <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>of Total</p>
                        </div>
                        <div style={{ paddingTop: "12px", borderTop: "1px solid var(--border)" }}>
                          <p style={{ fontSize: "14px", color: "var(--success)" }}>+18% vs last month</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Platform Metrics - Specific to YouTube Shorts, TikTok, Instagram Reels */}
              <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "24px" }}>
                <h2 style={{ fontSize: "16px", fontWeight: "600", color: "white", marginBottom: "24px" }}>Platform Metrics</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                  {mockPlatformMetrics.map((item, index) => (
                    <div key={index} style={{ padding: "20px", backgroundColor: "var(--background)", borderRadius: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                        <div style={{ width: "8px", height: "8px", backgroundColor: item.color, borderRadius: "50%" }} />
                        <p style={{ fontSize: "14px", fontWeight: "500", color: "white" }}>{item.platform}</p>
                      </div>
                      <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>{item.metric}</p>
                      <p style={{ fontSize: "20px", fontWeight: "bold", color: "white" }}>{item.value}</p>
                      <p style={{ fontSize: "12px", color: "var(--success)", marginTop: "4px" }}>{item.trend}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
