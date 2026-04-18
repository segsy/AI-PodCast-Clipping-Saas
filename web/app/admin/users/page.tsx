"use client";

import { useState, useEffect } from "react";
import { Search, Filter, MoreVertical, Mail, Ban, Check, Loader2, UserPlus, Trash2, X, Download } from "lucide-react";
import { adminUsers, AdminUser } from "@/lib/admin-api";

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddLoading, setShowAddLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  // New user form state
  const [newUser, setNewUser] = useState({
    email: "",
    name: "",
    password: "",
    role: ""
  });

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminUsers.list({ 
        page, 
        limit: 20,
        search: searchQuery || undefined,
      });
      setUsers(response.users);
      setTotal(response.total);
      setTotalPages(response.totalPages);
    } catch (err: any) {
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchUsers();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle delete user
  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    
    try {
      await adminUsers.delete(userId);
      fetchUsers();
    } catch (err: any) {
      alert(err.message || "Failed to delete user");
    }
  };

  // Handle update user role
  const handleUpdateRole = async (userId: string, role: string) => {
    try {
      await adminUsers.update(userId, { role: role || undefined });
      fetchUsers();
    } catch (err: any) {
      alert(err.message || "Failed to update user");
    }
  };

  // Handle create new user
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.email || !newUser.password) {
      alert("Email and password are required");
      return;
    }
    
    try {
      setShowAddLoading(true);
      await adminUsers.create({
        email: newUser.email,
        name: newUser.name || undefined,
        password: newUser.password,
        role: newUser.role || undefined,
      });
      setShowAddModal(false);
      setNewUser({ email: "", name: "", password: "", role: "" });
      fetchUsers();
    } catch (err: any) {
      alert(err.message || "Failed to create user");
    } finally {
      setShowAddLoading(false);
    }
  };

  // Handle export users
  const handleExportUsers = async () => {
    try {
      setExporting(true);
      const response = await adminUsers.export({ search: searchQuery || undefined });
      
      // Convert to CSV
      const headers = ["Name", "Email", "Role", "Workspaces", "Status", "Created"];
      const csvContent = [
        headers.join(","),
        ...response.users.map(u => [
          `"${u.name || ""}"`,
          `"${u.email}"`,
          `"${u.role || "User"}"`,
          u.workspaceCount || 0,
          u.status || "Active",
          new Date(u.createdAt).toLocaleDateString()
        ].join(","))
      ].join("\n");
      
      // Download CSV
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `users_export_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(err.message || "Failed to export users");
    } finally {
      setExporting(false);
    }
  };

  const filteredUsers = users.filter(user => {
    if (filterStatus === "all") return true;
    return user.status?.toLowerCase() === filterStatus;
  });
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Page header */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Users</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>Manage and view all registered users</p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button 
            onClick={() => setShowAddModal(true)}
            style={{
              backgroundColor: "var(--primary)",
              color: "white",
              padding: "8px 16px",
              borderRadius: "8px",
              fontWeight: 500,
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <UserPlus size={18} />
            Add User
          </button>
          <button 
            onClick={handleExportUsers}
            disabled={exporting}
            style={{
              backgroundColor: "var(--surface)",
              color: "white",
              padding: "8px 16px",
              borderRadius: "8px",
              fontWeight: 500,
              border: "1px solid var(--border)",
              cursor: exporting ? "not-allowed" : "pointer",
              opacity: exporting ? 0.5 : 1,
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            {exporting ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
            Export Users
          </button>
        </div>
      </div>

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
              placeholder="Search users..."
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
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

      {/* Users table */}
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
                  <th style={{ textAlign: "left", padding: "16px 24px", color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase", fontWeight: 500 }}>User</th>
                  <th style={{ textAlign: "left", padding: "16px 24px", color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase", fontWeight: 500 }}>Role</th>
                  <th style={{ textAlign: "left", padding: "16px 24px", color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase", fontWeight: 500 }}>Workspaces</th>
                  <th style={{ textAlign: "left", padding: "16px 24px", color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase", fontWeight: 500 }}>Joined</th>
                  <th style={{ textAlign: "left", padding: "16px 24px", color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase", fontWeight: 500 }}>Status</th>
                  <th style={{ textAlign: "right", padding: "16px 24px", color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase", fontWeight: 500 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "16px 24px" }}>
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
                    </td>
                    <td style={{ padding: "16px 24px" }}>
                      <select
                        value={user.role || ""}
                        onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                        style={{
                          padding: "4px 8px",
                          backgroundColor: "var(--surface)",
                          border: "1px solid var(--border)",
                          borderRadius: "4px",
                          color: "white",
                          fontSize: "12px"
                        }}
                      >
                        <option value="">User</option>
                        <option value="ADMIN">Admin</option>
                        <option value="SUPER_ADMIN">Super Admin</option>
                        <option value="SUPPORT">Support</option>
                        <option value="ANALYST">Analyst</option>
                      </select>
                    </td>
                    <td style={{ padding: "16px 24px" }}>
                      <span style={{ color: "var(--accent)", fontWeight: 500 }}>{user.workspaceCount}</span>
                    </td>
                    <td style={{ padding: "16px 24px", color: "var(--text-secondary)" }}>
                      {formatDate(user.createdAt)}
                    </td>
                    <td style={{ padding: "16px 24px" }}>
                      <span style={{ 
                        padding: "4px 8px", 
                        borderRadius: "9999px", 
                        fontSize: "12px",
                        fontWeight: 500,
                        backgroundColor: user.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                        color: user.status === 'Active' ? 'var(--success)' : 'var(--warning)'
                      }}>
                        {user.status}
                      </span>
                    </td>
                    <td style={{ padding: "16px 24px" }}>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                        <button
                          onClick={() => alert(`Send email to ${user.email}`)}
                          style={{
                            padding: "8px",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            borderRadius: "6px"
                          }}
                          title="Send Email"
                        >
                          <Mail size={18} style={{ color: "var(--text-muted)" }} />
                        </button>
                        <button
                          onClick={() => alert(`More options for ${user.name}: Edit, View Details, Reset Password`)}
                          style={{
                            padding: "8px",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            borderRadius: "6px"
                          }}
                          title="More Options"
                        >
                          <MoreVertical size={18} style={{ color: "var(--text-muted)" }} />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          style={{ 
                            padding: "8px", 
                            background: "none", 
                            border: "none", 
                            cursor: "pointer",
                            borderRadius: "6px"
                          }}
                          title="Delete User"
                        >
                          <Trash2 size={18} style={{ color: "var(--error)" }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
              Showing {filteredUsers.length} of {total} users
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
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: page === pageNum ? "var(--primary)" : "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      color: "white",
                      fontSize: "14px",
                      cursor: "pointer"
                    }}
                  >
                    {pageNum}
                  </button>
                );
              })}
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
      {/* Add User Modal */}
      {showAddModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)"
        }}>
          <div style={{
            backgroundColor: "var(--surface)",
            borderRadius: "12px",
            border: "1px solid var(--border)",
            padding: "24px",
            width: "100%",
            maxWidth: "480px",
            maxHeight: "90vh",
            overflowY: "auto"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>Add New User</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer"
                }}
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleCreateUser} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}>
                  Email <span style={{ color: "var(--error)" }}>*</span>
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  required
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    backgroundColor: "var(--surface-hover)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "14px"
                  }}
                  placeholder="user@example.com"
                />
              </div>
              
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}>
                  Name
                </label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    backgroundColor: "var(--surface-hover)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "14px"
                  }}
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}>
                  Password <span style={{ color: "var(--error)" }}>*</span>
                </label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  required
                  minLength={6}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    backgroundColor: "var(--surface-hover)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "14px"
                  }}
                  placeholder="Minimum 6 characters"
                />
              </div>
              
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}>
                  Role
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    backgroundColor: "var(--surface-hover)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "14px"
                  }}
                >
                  <option value="">User (Default)</option>
                  <option value="ADMIN">Admin</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                  <option value="SUPPORT">Support</option>
                  <option value="ANALYST">Analyst</option>
                </select>
              </div>
              
              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    flex: 1,
                    padding: "10px 16px",
                    backgroundColor: "transparent",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "white",
                    fontWeight: 500,
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={showAddLoading}
                  style={{
                    flex: 1,
                    padding: "10px 16px",
                    backgroundColor: "var(--primary)",
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                    fontWeight: 500,
                    cursor: showAddLoading ? "not-allowed" : "pointer",
                    opacity: showAddLoading ? 0.7 : 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px"
                  }}
                >
                  {showAddLoading && <Loader2 size={18} className="animate-spin" />}
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
