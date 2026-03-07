"use client";

import { useState, useEffect } from "react";
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
  X,
  RefreshCw,
  Check,
  AlertCircle
} from "lucide-react";

interface TeamMember {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: string;
  status: string;
  avatar: string;
}

interface TeamInvitation {
  id: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

interface TeamStats {
  total: number;
  owners: number;
  admins: number;
  members: number;
  viewers: number;
  pending: number;
}

const roleColors: Record<string, string> = {
  Owner: "var(--primary)",
  Admin: "var(--accent)",
  Member: "var(--success)",
  Viewer: "var(--text-muted)",
};

export default function TeamPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Member");
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [invitations, setInvitations] = useState<TeamInvitation[]>([]);
  const [stats, setStats] = useState<TeamStats>({ total: 0, owners: 0, admins: 0, members: 0, viewers: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [inviting, setInviting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/team');
      if (response.ok) {
        const data = await response.json();
        setMembers(data.members || []);
        setInvitations(data.invitations || []);
        setStats(data.stats || { total: 0, owners: 0, admins: 0, members: 0, viewers: 0, pending: 0 });
      }
    } catch (error) {
      console.error("Error fetching team:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail) return;
    
    try {
      setInviting(true);
      setError(null);
      
      const response = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: inviteEmail,
          role: inviteRole.toUpperCase()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to send invitation');
        return;
      }

      // Refresh team data
      await fetchTeam();
      
      // Close modal and reset
      setShowInviteModal(false);
      setInviteEmail("");
      setInviteRole("Member");
    } catch (error) {
      console.error("Error inviting member:", error);
      setError('Failed to send invitation');
    } finally {
      setInviting(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this team member?')) return;
    
    try {
      const response = await fetch(`/api/team?memberId=${memberId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchTeam();
      }
    } catch (error) {
      console.error("Error removing member:", error);
    }
  };

  const handleCancelInvitation = async (invitationId: string) => {
    try {
      const response = await fetch(`/api/team?invitationId=${invitationId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchTeam();
      }
    } catch (error) {
      console.error("Error cancelling invitation:", error);
    }
  };

  const filteredMembers = members.filter(
    (member) =>
      (member.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <p style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>{stats.total}</p>
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
              <p style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>{stats.owners}</p>
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
              <p style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>{stats.admins}</p>
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
              <p style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>{stats.pending}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Team members list */}
      <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
          <h2 style={{ fontSize: "16px", fontWeight: "600", color: "white" }}>Team Members</h2>
        </div>
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
            <RefreshCw size={24} className="animate-spin" style={{ margin: "0 auto" }} />
            <p style={{ marginTop: "12px" }}>Loading team...</p>
          </div>
        ) : (
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
                      <span style={{ fontWeight: 500, color: "white" }}>{member.name || 'Unknown'}</span>
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
                  {member.role !== "OWNER" && (
                    <button 
                      onClick={() => handleRemoveMember(member.id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--text-muted)",
                        cursor: "pointer",
                        padding: "4px"
                      }}
                    >
                      <MoreVertical size={18} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pending Invitations */}
      {invitations.length > 0 && (
        <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
            <h2 style={{ fontSize: "16px", fontWeight: "600", color: "white" }}>Pending Invitations</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {invitations.map((invitation) => (
              <div
                key={invitation.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 20px",
                  borderBottom: "1px solid var(--border)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: "var(--warning)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "black"
                  }}>
                    {invitation.email.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontWeight: 500, color: "white" }}>{invitation.email}</span>
                      <span style={{
                        padding: "2px 8px",
                        backgroundColor: "var(--warning)",
                        color: "black",
                        fontSize: "12px",
                        borderRadius: "4px"
                      }}>
                        Pending
                      </span>
                    </div>
                    <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "2px" }}>
                      Invited as {invitation.role}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => handleCancelInvitation(invitation.id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--error)",
                    cursor: "pointer",
                    padding: "8px"
                  }}
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

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
            
            {error && (
              <div style={{
                padding: "12px",
                backgroundColor: "var(--error)",
                borderRadius: "8px",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "white"
              }}>
                <AlertCircle size={18} />
                {error}
              </div>
            )}
            
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
                  <option value="Member">Member</option>
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
                  disabled={inviting || !inviteEmail}
                  style={{
                    flex: 1,
                    padding: "10px 20px",
                    backgroundColor: inviting ? "var(--surface-hover)" : "var(--primary)",
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                    fontWeight: 500,
                    cursor: inviting ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px"
                  }}
                >
                  {inviting ? (
                    <>
                      <RefreshCw size={18} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail size={18} />
                      Send Invite
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
