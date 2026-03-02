"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Play, Check, X, Eye, Download, Loader2 } from "lucide-react";
import { adminClips, AdminClip } from "@/lib/admin-api";

export default function ClipsPage() {
  const [clips, setClips] = useState<AdminClip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [statusCounts, setStatusCounts] = useState<any>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch clips
  const fetchClips = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminClips.list({ 
        page, 
        limit: 20,
        search: searchQuery || undefined,
        status: filterStatus !== "all" ? filterStatus : undefined,
      });
      setClips(response.clips);
      setStatusCounts(response.statusCounts);
      setTotal(response.total);
      setTotalPages(response.totalPages);
    } catch (err: any) {
      setError(err.message || "Failed to fetch clips");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClips();
  }, [page, filterStatus]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchClips();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle status change
  const handleStatusChange = async (clipId: string, newStatus: string) => {
    try {
      await adminClips.updateStatus(clipId, newStatus);
      fetchClips();
    } catch (err: any) {
      alert(err.message || "Failed to update clip status");
    }
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "READY":
        return { bg: "rgba(16, 185, 129, 0.1)", color: "var(--success)" };
      case "PENDING":
        return { bg: "rgba(245, 158, 11, 0.1)", color: "var(--warning)" };
      case "RENDERING":
        return { bg: "rgba(59, 130, 246, 0.1)", color: "#3B82F6" };
      case "FAILED":
        return { bg: "rgba(239, 68, 68, 0.1)", color: "var(--error)" };
      case "ARCHIVED":
        return { bg: "rgba(113, 113, 122, 0.1)", color: "var(--text-muted)" };
      default:
        return { bg: "rgba(113, 113, 122, 0.1)", color: "var(--text-muted)" };
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Page header */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Clips</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>Moderate and manage generated clips</p>
        </div>
      </div>

      {/* Stats */}
      {statusCounts && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "12px" }}>
          <div style={{ backgroundColor: "var(--surface)", borderRadius: "8px", border: "1px solid var(--border)", padding: "16px", textAlign: "center" }}>
            <p style={{ fontSize: "24px", fontWeight: "bold" }}>{statusCounts.pending}</p>
            <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Pending</p>
          </div>
          <div style={{ backgroundColor: "var(--surface)", borderRadius: "8px", border: "1px solid var(--border)", padding: "16px", textAlign: "center" }}>
            <p style={{ fontSize: "24px", fontWeight: "bold", color: "#3B82F6" }}>{statusCounts.rendering}</p>
            <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Rendering</p>
          </div>
          <div style={{ backgroundColor: "var(--surface)", borderRadius: "8px", border: "1px solid var(--border)", padding: "16px", textAlign: "center" }}>
            <p style={{ fontSize: "24px", fontWeight: "bold", color: "var(--success)" }}>{statusCounts.ready}</p>
            <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Ready</p>
          </div>
          <div style={{ backgroundColor: "var(--surface)", borderRadius: "8px", border: "1px solid var(--border)", padding: "16px", textAlign: "center" }}>
            <p style={{ fontSize: "24px", fontWeight: "bold", color: "var(--error)" }}>{statusCounts.failed}</p>
            <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Failed</p>
          </div>
          <div style={{ backgroundColor: "var(--surface)", borderRadius: "8px", border: "1px solid var(--border)", padding: "16px", textAlign: "center" }}>
            <p style={{ fontSize: "24px", fontWeight: "bold", color: "var(--text-muted)" }}>{statusCounts.archived}</p>
            <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Archived</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{
        backgroundColor: "var(--surface)",
        borderRadius: "12px",
        border: "1px solid var(--border)",
        padding: "24px"
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} size={20} />
            <input
              type="text"
              placeholder="Search clips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 16px 8px 40px",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                color: "white"
              }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Filter size={20} style={{ color: "var(--text-muted)" }} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                padding: "8px 16px",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                color: "white"
              }}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="rendering">Rendering</option>
              <option value="ready">Ready</option>
              <option value="failed">Failed</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div style={{
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          border: "1px solid var(--error)",
          borderRadius: "8px",
          padding: "16px",
          color: "var(--error)"
        }}>
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div style={{ display: "flex", justifyContent: "center", padding: "48px" }}>
          <Loader2 size={32} style={{ animation: "spin 1s linear infinite" }} className="animate-spin" />
        </div>
      )}

      {/* Clips table */}
      {!loading && !error && (
        <div style={{
          backgroundColor: "var(--surface)",
          borderRadius: "12px",
          border: "1px solid var(--border)",
          overflow: "hidden"
        }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)", backgroundColor: "var(--surface-hover)" }}>
                  <th style={{ textAlign: "left", padding: "16px 24px", color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase", fontWeight: 500 }}>Title</th>
                  <th style={{ textAlign: "left", padding: "16px 24px", color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase", fontWeight: 500 }}>Workspace</th>
                  <th style={{ textAlign: "left", padding: "16px 24px", color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase", fontWeight: 500 }}>Score</th>
                  <th style={{ textAlign: "left", padding: "16px 24px", color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase", fontWeight: 500 }}>Status</th>
                  <th style={{ textAlign: "left", padding: "16px 24px", color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase", fontWeight: 500 }}>Created</th>
                  <th style={{ textAlign: "right", padding: "16px 24px", color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase", fontWeight: 500 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {clips.map((clip) => {
                  const statusStyle = getStatusColor(clip.status);
                  return (
                    <tr key={clip.id} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "16px 24px" }}>
                        <div>
                          <p style={{ fontWeight: 500 }}>{clip.title || "Untitled Clip"}</p>
                          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                            {clip.project?.name || "Unknown Project"}
                          </p>
                        </div>
                      </td>
                      <td style={{ padding: "16px 24px", color: "var(--text-secondary)" }}>
                        {clip.workspace?.name || "Unknown"}
                      </td>
                      <td style={{ padding: "16px 24px" }}>
                        <span style={{ 
                          padding: "4px 8px", 
                          borderRadius: "9999px", 
                          fontSize: "12px",
                          fontWeight: 500,
                          backgroundColor: clip.score && clip.score >= 80 ? "rgba(16, 185, 129, 0.1)" : 
                                         clip.score && clip.score >= 50 ? "rgba(245, 158, 11, 0.1)" : 
                                         "rgba(239, 68, 68, 0.1)",
                          color: clip.score && clip.score >= 80 ? "var(--success)" : 
                                 clip.score && clip.score >= 50 ? "var(--warning)" : 
                                 "var(--error)"
                        }}>
                          {clip.score?.toFixed(1) || "N/A"}
                        </span>
                      </td>
                      <td style={{ padding: "16px 24px" }}>
                        <span style={{ 
                          padding: "4px 8px", 
                          borderRadius: "9999px", 
                          fontSize: "12px",
                          fontWeight: 500,
                          backgroundColor: statusStyle.bg,
                          color: statusStyle.color
                        }}>
                          {clip.status}
                        </span>
                      </td>
                      <td style={{ padding: "16px 24px", color: "var(--text-secondary)" }}>
                        {formatDate(clip.createdAt)}
                      </td>
                      <td style={{ padding: "16px 24px" }}>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                          <button style={{ 
                            padding: "8px", 
                            background: "none", 
                            border: "none", 
                            cursor: "pointer",
                            borderRadius: "6px"
                          }} title="View">
                            <Eye size={18} style={{ color: "var(--text-muted)" }} />
                          </button>
                          {clip.status === "PENDING" && (
                            <>
                              <button 
                                onClick={() => handleStatusChange(clip.id, "READY")}
                                style={{ 
                                  padding: "8px", 
                                  background: "none", 
                                  border: "none", 
                                  cursor: "pointer",
                                  borderRadius: "6px"
                                }}
                                title="Approve"
                              >
                                <Check size={18} style={{ color: "var(--success)" }} />
                              </button>
                              <button 
                                onClick={() => handleStatusChange(clip.id, "FAILED")}
                                style={{ 
                                  padding: "8px", 
                                  background: "none", 
                                  border: "none", 
                                  cursor: "pointer",
                                  borderRadius: "6px"
                                }}
                                title="Reject"
                              >
                                <X size={18} style={{ color: "var(--error)" }} />
                              </button>
                            </>
                          )}
                          {clip.status === "READY" && (
                            <button style={{ 
                              padding: "8px", 
                              background: "none", 
                              border: "none", 
                              cursor: "pointer",
                              borderRadius: "6px"
                            }} title="Download">
                              <Download size={18} style={{ color: "var(--text-muted)" }} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            padding: "16px 24px", 
            borderTop: "1px solid var(--border)" 
          }}>
            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Showing {clips.length} of {total} clips</p>
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
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "white",
                  fontSize: "14px",
                  cursor: page === totalPages ? "not-allowed" : "pointer",
                  opacity: page === totalPages ? 0.5 : 1
                }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
