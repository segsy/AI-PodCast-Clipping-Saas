"use client";

import { useState } from "react";
import { 
  User, 
  Shield, 
  Bell, 
  Key, 
  Globe, 
  Save,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  X
} from "lucide-react";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "api", label: "API Keys", icon: Key },
  { id: "preferences", label: "Preferences", icon: Globe },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Handle copy to clipboard
  const handleCopyApiKey = async () => {
    try {
      await navigator.clipboard.writeText("sk_live_abc123xyz789def456ghi012jkl345");
      setToast({ message: "API Key copied to clipboard", type: "success" });
    } catch (err) {
      setToast({ message: "Failed to copy API Key", type: "error" });
    }
  };

  // Handle revoke session
  const handleRevokeSession = () => {
    // In a real app, this would call an API to revoke the session
    setToast({ message: "Session revoked successfully", type: "success" });
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Page header */}
      <div>
        <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Settings</h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>Manage your account settings and preferences</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }} className="lg:flex-row">
        {/* Sidebar tabs */}
        <div style={{ width: "256px", flexShrink: 0 }}>
          <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "8px" }}>
            <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    transition: "background-color 0.2s",
                    backgroundColor: activeTab === tab.id ? "var(--primary)" : "transparent",
                    color: activeTab === tab.id ? "white" : "var(--text-secondary)",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    width: "100%"
                  }}
                >
                  <tab.icon size={20} />
                  <span style={{ fontWeight: 500 }}>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1 }}>
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "24px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "24px" }}>Profile Information</h2>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {/* Avatar */}
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ 
                    width: "80px", 
                    height: "80px", 
                    borderRadius: "50%", 
                    backgroundColor: "var(--primary)", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    fontSize: "24px",
                    fontWeight: "bold"
                  }}>
                    A
                  </div>
                  <div>
                    <button style={{
                      padding: "8px 16px",
                      backgroundColor: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      color: "white",
                      fontSize: "14px",
                      cursor: "pointer"
                    }}>Change Avatar</button>
                    <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "4px" }}>JPG, PNG or GIF. Max 2MB.</p>
                  </div>
                </div>

                {/* Form */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: 500, marginBottom: "8px" }}>First Name</label>
                    <input type="text" defaultValue="Admin" style={{
                      width: "100%",
                      padding: "8px 16px",
                      backgroundColor: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      color: "white"
                    }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: 500, marginBottom: "8px" }}>Last Name</label>
                    <input type="text" defaultValue="User" style={{
                      width: "100%",
                      padding: "8px 16px",
                      backgroundColor: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      color: "white"
                    }} />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: 500, marginBottom: "8px" }}>Email Address</label>
                    <input type="email" defaultValue="admin@aipodcast.com" style={{
                      width: "100%",
                      padding: "8px 16px",
                      backgroundColor: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      color: "white"
                    }} />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: 500, marginBottom: "8px" }}>Company</label>
                    <input type="text" defaultValue="AI Podcast Inc." style={{
                      width: "100%",
                      padding: "8px 16px",
                      backgroundColor: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      color: "white"
                    }} />
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
                  <button onClick={handleSave} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 16px",
                    backgroundColor: "var(--primary)",
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                    fontWeight: 500,
                    cursor: "pointer"
                  }}>
                    {isSaving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "24px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "24px" }}>Security Settings</h2>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {/* Change Password */}
                <div>
                  <h3 style={{ fontWeight: 500, marginBottom: "16px" }}>Change Password</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "14px", fontWeight: 500, marginBottom: "8px" }}>Current Password</label>
                      <input type="password" style={{
                        width: "100%",
                        padding: "8px 16px",
                        backgroundColor: "var(--surface)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        color: "white"
                      }} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "14px", fontWeight: 500, marginBottom: "8px" }}>New Password</label>
                      <input type="password" style={{
                        width: "100%",
                        padding: "8px 16px",
                        backgroundColor: "var(--surface)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        color: "white"
                      }} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "14px", fontWeight: 500, marginBottom: "8px" }}>Confirm New Password</label>
                      <input type="password" style={{
                        width: "100%",
                        padding: "8px 16px",
                        backgroundColor: "var(--surface)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        color: "white"
                      }} />
                    </div>
                  </div>
                </div>

                {/* Two-Factor Auth */}
                <div style={{ paddingTop: "24px", borderTop: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h3 style={{ fontWeight: 500 }}>Two-Factor Authentication</h3>
                      <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "4px" }}>Add an extra layer of security to your account</p>
                    </div>
                    <button style={{
                      padding: "8px 16px",
                      backgroundColor: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      color: "white",
                      fontSize: "14px",
                      cursor: "pointer"
                    }}>Enable</button>
                  </div>
                </div>

                {/* Active Sessions */}
                <div style={{ paddingTop: "24px", borderTop: "1px solid var(--border)" }}>
                  <h3 style={{ fontWeight: 500, marginBottom: "16px" }}>Active Sessions</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", backgroundColor: "var(--surface-hover)", borderRadius: "8px" }}>
                      <div>
                        <p style={{ fontWeight: 500 }}>Chrome on MacOS</p>
                        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>San Francisco, CA • Current session</p>
                      </div>
                      <span style={{ color: "var(--success)", fontSize: "14px" }}>Active</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", backgroundColor: "var(--surface-hover)", borderRadius: "8px" }}>
                      <div>
                        <p style={{ fontWeight: 500 }}>Safari on iPhone</p>
                        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>San Francisco, CA • 2 hours ago</p>
                      </div>
                      <button onClick={handleRevokeSession} style={{ color: "var(--error)", fontSize: "14px", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>Revoke</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "24px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "24px" }}>Notification Preferences</h2>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {[
                  { title: "Email Notifications", desc: "Receive email updates about your account" },
                  { title: "Push Notifications", desc: "Get push notifications on your devices" },
                  { title: "Marketing Emails", desc: "Receive emails about new features and updates" },
                  { title: "Weekly Reports", desc: "Get weekly summaries of your activity" },
                ].map((item, index) => (
                  <div key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "12px", borderBottom: index < 3 ? "1px solid var(--border)" : "none" }}>
                    <div>
                      <p style={{ fontWeight: 500 }}>{item.title}</p>
                      <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>{item.desc}</p>
                    </div>
                    <label style={{ position: "relative", display: "inline-block", width: "44px", height: "24px" }}>
                      <input type="checkbox" defaultChecked style={{ opacity: 0, width: 0, height: 0 }} />
                      <span style={{
                        position: "absolute",
                        cursor: "pointer",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "var(--primary)",
                        borderRadius: "24px",
                        transition: "0.2s"
                      }}></span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* API Keys Tab */}
          {activeTab === "api" && (
            <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "24px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "24px" }}>API Keys</h2>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <div>
                  <h3 style={{ fontWeight: 500, marginBottom: "8px" }}>Your API Key</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "16px" }}>Use this key to authenticate API requests</p>
                  
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "8px", padding: "12px", backgroundColor: "var(--surface-hover)", borderRadius: "8px" }}>
                      <code style={{ flex: 1, fontFamily: "monospace", fontSize: "14px" }}>
                        {showApiKey ? "sk_live_abc123xyz789def456ghi012jkl345" : "sk_live_••••••••••••••••••••••••••••••"}
                      </code>
                      <button 
                        onClick={() => setShowApiKey(!showApiKey)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
                      >
                        {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                      <button onClick={handleCopyApiKey} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                        <Copy size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                <div style={{ paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
                  <button style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 16px",
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "14px",
                    cursor: "pointer"
                  }}>
                    <RefreshCw size={16} />
                    Regenerate Key
                  </button>
                  <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "8px" }}>Warning: Regenerating your key will invalidate the previous key.</p>
                </div>

                {/* API Usage */}
                <div style={{ paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
                  <h3 style={{ fontWeight: 500, marginBottom: "16px" }}>API Usage This Month</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                    <div style={{ padding: "16px", backgroundColor: "var(--surface-hover)", borderRadius: "8px" }}>
                      <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Requests</p>
                      <p style={{ fontSize: "30px", fontWeight: "bold", marginTop: "4px" }}>12,450</p>
                    </div>
                    <div style={{ padding: "16px", backgroundColor: "var(--surface-hover)", borderRadius: "8px" }}>
                      <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Errors</p>
                      <p style={{ fontSize: "30px", fontWeight: "bold", marginTop: "4px", color: "var(--error)" }}>23</p>
                    </div>
                    <div style={{ padding: "16px", backgroundColor: "var(--surface-hover)", borderRadius: "8px" }}>
                      <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Avg Response</p>
                      <p style={{ fontSize: "30px", fontWeight: "bold", marginTop: "4px", color: "var(--success)" }}>145ms</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === "preferences" && (
            <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "24px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "24px" }}>Preferences</h2>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 500, marginBottom: "8px" }}>Language</label>
                  <select style={{
                    width: "100%",
                    padding: "8px 16px",
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "white"
                  }}>
                    <option>English (US)</option>
                    <option>English (UK)</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 500, marginBottom: "8px" }}>Timezone</label>
                  <select style={{
                    width: "100%",
                    padding: "8px 16px",
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "white"
                  }}>
                    <option>Pacific Time (PT)</option>
                    <option>Mountain Time (MT)</option>
                    <option>Central Time (CT)</option>
                    <option>Eastern Time (ET)</option>
                    <option>UTC</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 500, marginBottom: "8px" }}>Date Format</label>
                  <select style={{
                    width: "100%",
                    padding: "8px 16px",
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "white"
                  }}>
                    <option>MM/DD/YYYY</option>
                    <option>DD/MM/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 500, marginBottom: "8px" }}>Default Dashboard View</label>
                  <select style={{
                    width: "100%",
                    padding: "8px 16px",
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "white"
                  }}>
                    <option>Dashboard</option>
                    <option>Users</option>
                    <option>Clips</option>
                    <option>Billing</option>
                  </select>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
                  <button onClick={handleSave} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 16px",
                    backgroundColor: "var(--primary)",
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                    fontWeight: 500,
                    cursor: "pointer"
                  }}>
                    <Save size={18} />
                    Save Preferences
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Toast notification */}
      {toast && (
        <div style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          backgroundColor: toast.type === "success" ? "var(--success)" : "var(--error)",
          color: "white",
          padding: "12px 24px",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          gap: "12px"
        }}>
          <span style={{ fontWeight: 500 }}>{toast.message}</span>
          <button onClick={() => setToast(null)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: 0 }}>
            <X size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
