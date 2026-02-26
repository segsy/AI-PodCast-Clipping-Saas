"use client";

import { useState, useEffect } from "react";
import { 
  Folder, 
  Plus, 
  Search,
  MoreVertical,
  Users,
  Film,
  Calendar,
  Loader2,
  Trash2,
  Edit
} from "lucide-react";
import { adminWorkspaces, AdminWorkspace } from "@/lib/admin-api";

export default function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState<AdminWorkspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch workspaces
  const fetchWorkspaces = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminWorkspaces.list({ 
        page, 
        limit: 20,
        search: searchQuery || undefined,
      });
      setWorkspaces(response.workspaces);
      setTotal(response.total);
      setTotalPages(response.totalPages);
    } catch (err: any) {
      setError(err.message || "Failed to fetch workspaces");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, [page]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchWorkspaces();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle delete workspace
  const handleDeleteWorkspace = async (workspaceId: string) => {
    if (!confirm("Are you sure you want to delete this workspace? This action cannot be undone.")) return;
    
    try {
      await adminWorkspaces.delete(workspaceId);
      fetchWorkspaces();
    } catch (err: any) {
      alert(err.message || "Failed to delete workspace");
    }
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Page header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "white", marginBottom: "8px" }}>
            Workspaces
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Manage your team workspaces and collaborations
          </p>
        </div>
        <button style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          backgroundColor: "var(--primary)",
          color: "white",
          padding: "10px 16px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          fontWeight: 500
        }}>
          <Plus size={18} />
          Create Workspace
        </button>
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

      {/* Search */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        padding: "12px 16px"
      }}>
        <Search size={18} style={{ color: "var(--text-secondary)" }} />
        <input 
          type="text" 
          placeholder="Search workspaces..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            background: "none",
            border: "none",
            outline: "none",
            color: "white",
            width: "100%"
          }}
        />
      </div>

      {/* Loading state */}
      {loading && (
        <div style={{ display: "flex", justifyContent: "center", padding: "48px" }}>
          <Loader2 size={32} style={{ animation: "spin 1s linear infinite" }} className="animate-spin" />
        </div>
      )}

      {/* Workspaces Grid */}
      {!loading && !error && (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", 
          gap: "16px" 
        }}>
          {workspaces.map((workspace) => (
            <div 
              key={workspace.id}
              style={{
                backgroundColor: "var(--surface)",
                borderRadius: "12px",
                border: "1px solid var(--border)",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "16px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    backgroundColor: "var(--primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <Folder size={24} style={{ color: "white" }} />
                  </div>
                  <div>
                    <h3 style={{ fontWeight: "600", fontSize: "16px" }}>{workspace.name}</h3>
                    <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>/{workspace.slug}</p>
                  </div>
                </div>
                <button style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px",
                  borderRadius: "4px"
                }}>
                  <MoreVertical size={18} style={{ color: "var(--text-muted)" }} />
                </button>
              </div>

              <div style={{ display: "flex", gap: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Users size={16} style={{ color: "var(--text-muted)" }} />
                  <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                    {workspace.memberCount} members
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Film size={16} style={{ color: "var(--text-muted)" }} />
                  <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                    {workspace.credits} credits
                  </span>
                </div>
              </div>

              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                paddingTop: "16px",
                borderTop: "1px solid var(--border)"
              }}>
                <div>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Owner</p>
                  <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>{workspace.ownerName}</p>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button 
                    onClick={() => handleDeleteWorkspace(workspace.id)}
                    style={{
                      padding: "6px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      borderRadius: "4px",
                      color: "var(--error)"
                    }}
                    title="Delete Workspace"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {workspace.subscription && (
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  <span style={{ 
                    padding: "4px 8px", 
                    borderRadius: "9999px", 
                    fontSize: "12px",
                    backgroundColor: workspace.subscription.status === "ACTIVE" 
                      ? "rgba(16, 185, 129, 0.1)" 
                      : "rgba(245, 158, 11, 0.1)",
                    color: workspace.subscription.status === "ACTIVE" 
                      ? "var(--success)" 
                      : "var(--warning)"
                  }}>
                    {workspace.subscription.planId} - {workspace.subscription.status}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          padding: "16px",
          backgroundColor: "var(--surface)",
          borderRadius: "12px",
          border: "1px solid var(--border)"
        }}>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
            Showing {workspaces.length} of {total} workspaces
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
      )}
    </div>
  );
}
