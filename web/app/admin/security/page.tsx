"use client";

import { 
  Shield, 
  Lock,
  Key,
  Smartphone,
  Mail,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";

export default function SecurityPage() {
  const sessions = [
    { 
      device: "MacBook Pro", 
      location: "San Francisco, CA",
      lastActive: "Now",
      current: true
    },
    { 
      device: "iPhone 14", 
      location: "San Francisco, CA",
      lastActive: "2 hours ago",
      current: false
    },
    { 
      device: "Windows PC", 
      location: "New York, NY",
      lastActive: "3 days ago",
      current: false
    },
  ];

  const securityLog = [
    { 
      action: "Password changed", 
      ip: "192.168.1.1",
      time: "2 days ago"
    },
    { 
      action: "New device authorized", 
      ip: "192.168.1.1",
      time: "1 week ago"
    },
    { 
      action: "Two-factor authentication enabled", 
      ip: "192.168.1.1",
      time: "2 weeks ago"
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Page header */}
      <div>
        <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "white", marginBottom: "8px" }}>
          Security
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>
          Manage your account security and authentication settings
        </p>
      </div>

      {/* Security Overview */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
        gap: "16px" 
      }}>
        {/* Password */}
        <div style={{ 
          backgroundColor: "var(--surface)", 
          borderRadius: "12px", 
          border: "1px solid var(--border)",
          padding: "20px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              backgroundColor: "#10B98120",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Lock size={20} style={{ color: "#10B981" }} />
            </div>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: "600", color: "white" }}>Password</h3>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Last changed 30 days ago</p>
            </div>
          </div>
          <button style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            backgroundColor: "transparent",
            color: "white",
            cursor: "pointer",
            fontWeight: 500
          }}>
            Change Password
          </button>
        </div>

        {/* Two-Factor */}
        <div style={{ 
          backgroundColor: "var(--surface)", 
          borderRadius: "12px", 
          border: "1px solid var(--border)",
          padding: "20px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              backgroundColor: "#10B98120",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Smartphone size={20} style={{ color: "#10B981" }} />
            </div>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: "600", color: "white" }}>Two-Factor Auth</h3>
              <p style={{ fontSize: "13px", color: "#10B981" }}>Enabled</p>
            </div>
          </div>
          <button style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            backgroundColor: "transparent",
            color: "white",
            cursor: "pointer",
            fontWeight: 500
          }}>
            Manage 2FA
          </button>
        </div>

        {/* API Keys */}
        <div style={{ 
          backgroundColor: "var(--surface)", 
          borderRadius: "12px", 
          border: "1px solid var(--border)",
          padding: "20px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              backgroundColor: "#F59E0B20",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Key size={20} style={{ color: "#F59E0B" }} />
            </div>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: "600", color: "white" }}>API Keys</h3>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>3 active keys</p>
            </div>
          </div>
          <button style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            backgroundColor: "transparent",
            color: "white",
            cursor: "pointer",
            fontWeight: 500
          }}>
            Manage Keys
          </button>
        </div>
      </div>

      {/* Active Sessions */}
      <div style={{ 
        backgroundColor: "var(--surface)", 
        borderRadius: "12px", 
        border: "1px solid var(--border)",
        overflow: "hidden"
      }}>
        <div style={{ padding: "20px", borderBottom: "1px solid var(--border)" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "600", color: "white" }}>
            Active Sessions
          </h3>
        </div>
        {sessions.map((session, index) => (
          <div 
            key={index}
            style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "space-between",
              padding: "16px 20px",
              borderBottom: index < sessions.length - 1 ? "1px solid var(--border)" : "none"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                backgroundColor: "var(--background)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <Smartphone size={18} style={{ color: "var(--text-secondary)" }} />
              </div>
              <div>
                <div style={{ color: "white", fontSize: "14px", fontWeight: 500 }}>
                  {session.device}
                  {session.current && (
                    <span style={{ 
                      marginLeft: "8px", 
                      fontSize: "11px", 
                      backgroundColor: "#10B98120", 
                      color: "#10B981",
                      padding: "2px 6px",
                      borderRadius: "4px"
                    }}>
                      Current
                    </span>
                  )}
                </div>
                <div style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
                  {session.location} • {session.lastActive}
                </div>
              </div>
            </div>
            {!session.current && (
              <button style={{
                padding: "8px 16px",
                borderRadius: "6px",
                border: "none",
                backgroundColor: "transparent",
                color: "#EF4444",
                cursor: "pointer",
                fontSize: "13px"
              }}>
                Revoke
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Security Log */}
      <div style={{ 
        backgroundColor: "var(--surface)", 
        borderRadius: "12px", 
        border: "1px solid var(--border)",
        overflow: "hidden"
      }}>
        <div style={{ padding: "20px", borderBottom: "1px solid var(--border)" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "600", color: "white" }}>
            Security Log
          </h3>
        </div>
        {securityLog.map((log, index) => (
          <div 
            key={index}
            style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "space-between",
              padding: "16px 20px",
              borderBottom: index < securityLog.length - 1 ? "1px solid var(--border)" : "none"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <CheckCircle size={16} style={{ color: "#10B981" }} />
              <div style={{ color: "white", fontSize: "14px" }}>{log.action}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ color: "var(--text-secondary)", fontSize: "13px" }}>{log.ip}</div>
              <div style={{ color: "var(--text-muted)", fontSize: "13px" }}>{log.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
