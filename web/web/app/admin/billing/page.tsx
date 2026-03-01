"use client";

import { useState, useEffect } from "react";
import { CreditCard, Download, Check, Plus, AlertCircle, Loader2, DollarSign, Users, Edit2, Trash2, X } from "lucide-react";
import { adminBilling } from "@/lib/admin-api";

export default function BillingPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [editingSubscription, setEditingSubscription] = useState<any>(null);
  const [editStatus, setEditStatus] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch billing data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminBilling.list({ 
        page, 
        limit: 20,
        status: filterStatus !== "all" ? filterStatus : undefined,
      });
      setData(response);
    } catch (err: any) {
      setError(err.message || "Failed to fetch billing data. Please ensure you have admin permissions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, filterStatus]);

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "ACTIVE":
        return { bg: "rgba(16, 185, 129, 0.1)", color: "var(--success)" };
      case "TRIALING":
        return { bg: "rgba(59, 130, 246, 0.1)", color: "#3B82F6" };
      case "PAST_DUE":
        return { bg: "rgba(239, 68, 68, 0.1)", color: "var(--error)" };
      case "CANCELLED":
        return { bg: "rgba(113, 113, 122, 0.1)", color: "var(--text-muted)" };
      default:
        return { bg: "rgba(113, 113, 122, 0.1)", color: "var(--text-muted)" };
    }
  };

  const handleEditClick = (subscription: any) => {
    setEditingSubscription(subscription);
    setEditStatus(subscription.status);
  };

  const handleSaveEdit = async () => {
    if (!editingSubscription) return;
    
    setEditLoading(true);
    try {
      await adminBilling.update(editingSubscription.id, { status: editStatus });
      setEditingSubscription(null);
      fetchData();
    } catch (err: any) {
      setError(err.message || "Failed to update subscription");
    } finally {
      setEditLoading(false);
    }
  };

  const handleCancelSubscription = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this subscription?")) return;
    
    setActionLoading(id);
    try {
      await adminBilling.delete(id);
      fetchData();
    } catch (err: any) {
      setError(err.message || "Failed to cancel subscription");
    } finally {
      setActionLoading(null);
    }
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
        <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Billing</h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>Manage your subscription and billing details</p>
      </div>

      {/* Stats */}
      {data?.stats && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
          <div style={{
            backgroundColor: "var(--surface)",
            borderRadius: "12px",
            border: "1px solid var(--border)",
            padding: "20px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <Check size={20} style={{ color: "var(--success)" }} />
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Active</p>
            </div>
            <p style={{ fontSize: "28px", fontWeight: "bold" }}>{data.stats.active}</p>
          </div>

          <div style={{
            backgroundColor: "var(--surface)",
            borderRadius: "12px",
            border: "1px solid var(--border)",
            padding: "20px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <Users size={20} style={{ color: "#3B82F6" }} />
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Trial</p>
            </div>
            <p style={{ fontSize: "28px", fontWeight: "bold" }}>{data.stats.trial}</p>
          </div>

          <div style={{
            backgroundColor: "var(--surface)",
            borderRadius: "12px",
            border: "1px solid var(--border)",
            padding: "20px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <AlertCircle size={20} style={{ color: "var(--error)" }} />
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Past Due</p>
            </div>
            <p style={{ fontSize: "28px", fontWeight: "bold" }}>{data.stats.pastDue}</p>
          </div>

          <div style={{
            backgroundColor: "var(--surface)",
            borderRadius: "12px",
            border: "1px solid var(--border)",
            padding: "20px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                backgroundColor: "rgba(245, 158, 11, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <DollarSign size={20} style={{ color: "var(--warning)" }} />
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Total Credits</p>
            </div>
            <p style={{ fontSize: "28px", fontWeight: "bold" }}>{data.stats.totalCredits.toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Filter */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
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
          <option value="active">Active</option>
          <option value="trialing">Trialing</option>
          <option value="past_due">Past Due</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Subscriptions Table */}
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
                <th style={{ textAlign: "left", padding: "16px 24px", color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase", fontWeight: 500 }}>Workspace</th>
                <th style={{ textAlign: "left", padding: "16px 24px", color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase", fontWeight: 500 }}>Plan</th>
                <th style={{ textAlign: "left", padding: "16px 24px", color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase", fontWeight: 500 }}>Credits</th>
                <th style={{ textAlign: "left", padding: "16px 24px", color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase", fontWeight: 500 }}>Status</th>
                <th style={{ textAlign: "left", padding: "16px 24px", color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase", fontWeight: 500 }}>Interval</th>
                <th style={{ textAlign: "left", padding: "16px 24px", color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase", fontWeight: 500 }}>Created</th>
                <th style={{ textAlign: "left", padding: "16px 24px", color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase", fontWeight: 500 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.subscriptions?.map((sub: any) => {
                const statusStyle = getStatusColor(sub.status);
                return (
                  <tr key={sub.id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "16px 24px" }}>
                      <p style={{ fontWeight: 500 }}>{sub.workspace?.name || "Unknown"}</p>
                      <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>/{sub.workspace?.slug}</p>
                    </td>
                    <td style={{ padding: "16px 24px" }}>
                      <span style={{ 
                        padding: "4px 8px", 
                        borderRadius: "9999px", 
                        fontSize: "12px",
                        fontWeight: 500,
                        backgroundColor: "var(--primary)",
                        color: "white"
                      }}>
                        {sub.planId}
                      </span>
                    </td>
                    <td style={{ padding: "16px 24px" }}>
                      <span style={{ color: "var(--accent)", fontWeight: 500 }}>{sub.credits}</span>
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
                        {sub.status}
                      </span>
                    </td>
                    <td style={{ padding: "16px 24px", color: "var(--text-secondary)" }}>
                      {sub.interval}
                    </td>
                    <td style={{ padding: "16px 24px", color: "var(--text-secondary)" }}>
                      {formatDate(sub.createdAt)}
                    </td>
                    <td style={{ padding: "16px 24px" }}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => handleEditClick(sub)}
                          style={{
                            padding: "6px 12px",
                            backgroundColor: "var(--surface-hover)",
                            border: "1px solid var(--border)",
                            borderRadius: "6px",
                            color: "var(--text-primary)",
                            fontSize: "12px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px"
                          }}
                        >
                          <Edit2 size={14} />
                          Edit
                        </button>
                        {sub.status !== "CANCELLED" && (
                          <button
                            onClick={() => handleCancelSubscription(sub.id)}
                            disabled={actionLoading === sub.id}
                            style={{
                              padding: "6px 12px",
                              backgroundColor: "rgba(239, 68, 68, 0.1)",
                              border: "1px solid var(--error)",
                              borderRadius: "6px",
                              color: "var(--error)",
                              fontSize: "12px",
                              cursor: actionLoading === sub.id ? "not-allowed" : "pointer",
                              opacity: actionLoading === sub.id ? 0.7 : 1,
                              display: "flex",
                              alignItems: "center",
                              gap: "4px"
                            }}
                          >
                            {actionLoading === sub.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                            Cancel
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
        {data?.totalPages > 1 && (
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            padding: "16px 24px", 
            borderTop: "1px solid var(--border)" 
          }}>
            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
              Showing {data?.subscriptions?.length || 0} of {data?.total || 0} subscriptions
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

      {/* Edit Modal */}
      {editingSubscription && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: "var(--surface)",
            borderRadius: "12px",
            border: "1px solid var(--border)",
            padding: "24px",
            width: "400px",
            maxWidth: "90vw",
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px"
            }}>
              <h2 style={{ fontSize: "18px", fontWeight: 600 }}>Edit Subscription</h2>
              <button
                onClick={() => setEditingSubscription(null)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  padding: "4px"
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "8px" }}>
                Workspace: <span style={{ color: "var(--text-primary)" }}>{editingSubscription.workspace?.name}</span>
              </p>
              <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "8px" }}>
                Plan: <span style={{ color: "var(--text-primary)" }}>{editingSubscription.planId}</span>
              </p>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "14px", marginBottom: "8px", color: "var(--text-secondary)" }}>
                Status
              </label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  backgroundColor: "var(--background)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "white",
                  fontSize: "14px"
                }}
              >
                <option value="ACTIVE">Active</option>
                <option value="TRIALING">Trialing</option>
                <option value="PAST_DUE">Past Due</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="UNPAID">Unpaid</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button
                onClick={() => setEditingSubscription(null)}
                style={{
                  padding: "10px 16px",
                  backgroundColor: "transparent",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "var(--text-primary)",
                  fontSize: "14px",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={editLoading}
                style={{
                  padding: "10px 16px",
                  backgroundColor: "var(--primary)",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                  fontSize: "14px",
                  cursor: editLoading ? "not-allowed" : "pointer",
                  opacity: editLoading ? 0.7 : 1,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                {editLoading && <Loader2 size={16} className="animate-spin" />}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
