"use client";

import { useState, useEffect } from "react";
import { 
  Clock, 
  Film,
  User,
  Upload,
  Download,
  Edit,
  Trash2,
  Share2,
  Loader2
} from "lucide-react";
import { adminActivity } from "@/lib/admin-api";

export default function ActivityPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [page, setPage] = useState(1);

  // Fetch activity data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminActivity.list({ 
        page, 
        limit: 50,
      });
      setData(response);
    } catch (err: any) {
      setError(err.message || "Failed to fetch activity data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "upload": return Upload;
      case "clip": return Film;
      case "edit": return Edit;
      case "share": return Share2;
      case "download": return Download;
      case "delete": return Trash2;
      default: return Clock;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "upload": return "#10B981";
      case "clip": return "#8B5CF6";
      case "edit": return "#F59E0B";
      case "share": return "#3B82F6";
      case "download": return "#6366F1";
      case "delete": return "#EF4444";
      default: return "#6B7280";
    }
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Page header */}
      <div>
        <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Activity</h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>View platform activity and system events</p>
      </div>

      {/* Summary Stats */}
      {data?.summary?.byType && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px" }}>
          {data.summary.byType.slice(0, 6).map((item: any, index: number) => {
            const Icon = getActivityIcon(item.type);
            const color = getActivityColor(item.type);
            return (
              <div key={index} style={{
                backgroundColor: "var(--surface)",
                borderRadius: "12px",
                border: "1px solid var(--border)",
                padding: "16px",
                display: "flex",
                alignItems: "center",
                gap: "12px"
              }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  backgroundColor: `${color}20`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <Icon size={20} style={{ color }} />
                </div>
                <div>
                  <p style={{ fontSize: "20px", fontWeight: "bold" }}>{item.count}</p>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "capitalize" }}>{item.type}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Activity List */}
      <div style={{
        backgroundColor: "var(--surface)",
        borderRadius: "12px",
        border: "1px solid var(--border)",
        overflow: "hidden"
      }}>
        <div style={{ maxHeight: "600px", overflowY: "auto" }}>
          {data?.events?.map((event: any, index: number) => {
            const Icon = getActivityIcon(event.type || "default");
            const color = getActivityColor(event.type || "default");
            
            return (
              <div 
                key={index}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "16px",
                  padding: "16px 24px",
                  borderBottom: index < data.events.length - 1 ? "1px solid var(--border)" : "none"
                }}
              >
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: `${color}20`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}>
                  <Icon size={18} style={{ color }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <p style={{ fontWeight: 500 }}>
                        {event.message || event.type}
                      </p>
                      <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "4px" }}>
                        {event.job?.workspace?.name || "Unknown Workspace"}
                        {event.job?.project && ` / ${event.job.project.name}`}
                      </p>
                    </div>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                      {formatDate(event.createdAt)}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                    <span style={{ 
                      fontSize: "10px", 
                      padding: "2px 6px", 
                      borderRadius: "4px", 
                      backgroundColor: "var(--surface-hover)",
                      color: "var(--text-muted)"
                    }}>
                      {event.source}
                    </span>
                    {event.stage && (
                      <span style={{ 
                        fontSize: "10px", 
                        padding: "2px 6px", 
                        borderRadius: "4px", 
                        backgroundColor: "var(--surface-hover)",
                        color: "var(--text-muted)"
                      }}>
                        {event.stage}
                      </span>
                    )}
                    {event.progress !== undefined && (
                      <span style={{ 
                        fontSize: "10px", 
                        padding: "2px 6px", 
                        borderRadius: "4px", 
                        backgroundColor: `${color}20`,
                        color: color
                      }}>
                        {event.progress}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {data?.totalPages > 1 && (
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            padding: "16px 24px", 
            borderTop: "1px solid var(--border)" 
          }}>
            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
              Showing {data?.events?.length || 0} of {data?.total || 0} events
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "white",
                  fontSize: "14px",
                  cursor: page === 1 ? "not-allowed" : "pointer",
                  opacity: page === 1 ? 0.5 : 1
                }}
              >
                Previous
              </button>
              <button 
                onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
                disabled={page === data.totalPages}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "white",
                  fontSize: "14px",
                  cursor: page === data.totalPages ? "not-allowed" : "pointer",
                  opacity: page === data.totalPages ? 0.5 : 1
                }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
