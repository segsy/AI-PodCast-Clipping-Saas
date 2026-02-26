"use client";

import { useState } from "react";
import { 
  Users, 
  Plus, 
  Search, 
  MoreVertical, 
  Mail, 
  Crown,
  Shield,
  User,
  Trash2,
  Edit,
  X
} from "lucide-react";

const teamMembers = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Owner", avatar: "JD", status: "active" },
  { id: 2, name: "Sarah Smith", email: "sarah@example.com", role: "Admin", avatar: "SS", status: "active" },
  { id: 3, name: "Mike Johnson", email: "mike@example.com", role: "Editor", avatar: "MJ", status: "active" },
  { id: 4, name: "Emily Brown", email: "emily@example.com", role: "Viewer", avatar: "EB", status: "pending" },
];

const roleColors: Record<string, string> = {
  Owner: "var(--primary)",
  Admin: "var(--accent)",
  Editor: "var(--success)",
  Viewer: "var(--text-muted)",
};

export default function TeamPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Editor");

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInvite = () => {
    console.log("Inviting:", inviteEmail, "as", inviteRole);
    setShowInviteModal(false);
    setInviteEmail("");
    setInviteRole("Editor");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Page header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>Team</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>Manage your team members and their permissions</p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 20px",
            backgroundColor: "var(--primary)",
            border: "none",
            borderRadius: "8px",
            color: "white",
            fontWeight: 500,
            cursor: "pointer"
          }}
        >
          <Plus size={18} />
          Invite Member
        </button>
      </div>

      {/* Search */}
      <div style={{ position: "relative", maxWidth: "400px" }}>
        <Search 
          size={18} 
          style={{ 
            position: "absolute", 
            left: "12px", 
            top: "50%", 
            transform: "translateY(-50%)",
            color: "var(--text-muted)" 
          }} 
        />
        <input
          type="text"
          placeholder="Search team members..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 12px 10px 40px",
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            color: "white",
            fontSize: "14px"
          }}
        />
      </div>

      {/* Team stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
        <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "40px", height: "40px", backgroundColor: "var(--primary)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Users size={20} style={{ color: "white" }} />
            </div>
            <div>
              <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Total Members</p>
              <p style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>{teamMembers.length}</p>
            </div>
          </div>
        </div>
        <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "40px", height: "40px", backgroundColor: "var(--success)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Crown size={20} style={{ color: "white" }} />
            </div>
            <div>
              <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Owners</p>
              <p style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>1</p>
            </div>
          </div>
        </div>
        <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "40px", height: "40px", backgroundColor: "var(--accent)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Shield size={20} style={{ color: "white" }} />
            </div>
            <div>
              <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Admins</p>
              <p style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>1</p>
            </div>
          </div>
        </div>
        <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "40px", height: "40px", backgroundColor: "var(--text-muted)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <User size={20} style={{ color: "white" }} />
            </div>
            <div>
              <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Pending</p>
              <p style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>{teamMembers.filter(m => m.status === "pending").length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Team members list */}
      <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
          <h2 style={{ fontSize: "16px", fontWeight: "600", color: "white" }}>Team Members</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 20px",
                borderBottom: "1px solid var(--border)",
                transition: "background-color 0.2s"
              }}
              className="hover:bg-surface-hover"
            >
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: roleColors[member.role] || "var(--primary)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "white"
                }}>
                  {member.avatar}
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontWeight: 500, color: "white" }}>{member.name}</span>
                    {member.status === "pending" && (
                      <span style={{
                        padding: "2px 8px",
                        backgroundColor: "var(--warning)",
                        color: "black",
                        fontSize: "12px",
                        borderRadius: "4px"
                      }}>
                        Pending
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                    <Mail size={12} style={{ color: "var(--text-muted)" }} />
                    <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>{member.email}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{
                  padding: "4px 12px",
                  backgroundColor: `${roleColors[member.role]}20`,
                  color: roleColors[member.role],
                  fontSize: "13px",
                  fontWeight: 500,
                  borderRadius: "6px"
                }}>
                  {member.role}
                </span>
                {member.role !== "Owner" && (
                  <button style={{
                    background: "none",
                    border: "none",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                    padding: "4px"
                  }}>
                    <MoreVertical size={18} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100
        }}>
          <div style={{
            backgroundColor: "var(--surface)",
            borderRadius: "16px",
            border: "1px solid var(--border)",
            width: "100%",
            maxWidth: "480px",
            padding: "24px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "600", color: "white" }}>Invite Team Member</h2>
              <button
                onClick={() => setShowInviteModal(false)}
                style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 500, marginBottom: "8px", color: "white" }}>Email Address</label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 16px",
                    backgroundColor: "var(--surface-hover)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "14px"
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 500, marginBottom: "8px", color: "white" }}>Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 16px",
                    backgroundColor: "var(--surface-hover)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "14px"
                  }}
                >
                  <option value="Admin">Admin</option>
                  <option value="Editor">Editor</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <button
                  onClick={() => setShowInviteModal(false)}
                  style={{
                    flex: 1,
                    padding: "10px 20px",
                    backgroundColor: "var(--surface-hover)",
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
                  onClick={handleInvite}
                  style={{
                    flex: 1,
                    padding: "10px 20px",
                    backgroundColor: "var(--primary)",
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                    fontWeight: 500,
                    cursor: "pointer"
                  }}
                >
                  Send Invite
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
