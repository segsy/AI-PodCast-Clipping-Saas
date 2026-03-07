"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Users, 
  Plus, 
  Settings, 
  X, 
  CheckCircle2,
  Crown,
  Lock,
  Paperclip,
  ChevronDown
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getCurrentSubscription } from "@/lib/billing";

// All available platforms
const allPlatforms = [
  { name: "YouTube", key: "YOUTUBE", icon: "📺", color: "#FF0000" },
  { name: "TikTok", key: "TIKTOK", icon: "🎵", color: "#000000" },
  { name: "Instagram", key: "INSTAGRAM", icon: "📸", color: "#E1306C" },
  { name: "Facebook", key: "FACEBOOK", icon: "📘", color: "#1877F2" },
  { name: "LinkedIn", key: "LINKEDIN", icon: "💼", color: "#0A66C2" },
  { name: "X", key: "TWITTER", icon: "🐦", color: "#1DA1F2" },
];

// Map database platform to display platform
const getPlatformInfo = (platformKey: string) => {
  return allPlatforms.find(p => p.key === platformKey) || { name: platformKey, key: platformKey, icon: "📱", color: "#666666" };
};

interface ConnectedAccount {
  id: string;
  platform: string;
  platformUsername: string | null;
  platformProfileUrl: string | null;
  platformProfileImage: string | null;
  status: string;
  createdAt: string;
}

export default function SocialAccountsPage() {
  const router = useRouter();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");
  const [connecting, setConnecting] = useState(false);
  
  // All Platforms dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedFilterPlatform, setSelectedFilterPlatform] = useState<string>("All Platforms");
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // ProModal state
  const [isProModalOpen, setIsProModalOpen] = useState(false);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const sub = await getCurrentSubscription();
        setSubscription(sub);
        
        // Fetch connected accounts from database
        const workspaceId = localStorage.getItem("workspaceId") || "demo-workspace";
        const response = await fetch(`/api/social-accounts?workspaceId=${workspaceId}`);
        if (response.ok) {
          const data = await response.json();
          setConnectedAccounts(data.accounts || []);
        }
      } catch (error) {
        console.error("Failed to check subscription:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSubscription();
  }, [router]);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isProUser = subscription && (subscription.planId === "pro" || subscription.planId === "business");

  const handleAddAccountClick = () => {
    if (isProUser) {
      setShowAddModal(true);
    } else {
      setIsProModalOpen(true);
    }
  };

  const handleAddAccount = async () => {
    if (!selectedPlatform) return;
    
    setConnecting(true);
    try {
      const workspaceId = localStorage.getItem("workspaceId") || "demo-workspace";
      const platformKey = allPlatforms.find(p => p.name === selectedPlatform)?.key || selectedPlatform;
      
      // In production, this would trigger OAuth flow with the platform
      // For now, we'll simulate the connection
      const response = await fetch("/api/social-accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId,
          platform: platformKey,
          platformAccountId: `demo_${Date.now()}`,
          platformUsername: `@demo_${selectedPlatform.toLowerCase()}`,
          platformProfileUrl: `https://${selectedPlatform.toLowerCase()}.com/demo`,
          status: "CONNECTED",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.account) {
          setConnectedAccounts([...connectedAccounts, data.account]);
        }
      }
      
      setShowAddModal(false);
      setSelectedPlatform("");
    } catch (error) {
      console.error("Failed to connect account:", error);
    } finally {
      setConnecting(false);
    }
  };

  // Handle disconnect account
  const handleDisconnectAccount = async (accountId: string) => {
    try {
      const workspaceId = localStorage.getItem("workspaceId") || "demo-workspace";
      await fetch(`/api/social-accounts?id=${accountId}&workspaceId=${workspaceId}`, {
        method: "DELETE",
      });
      setConnectedAccounts(connectedAccounts.filter(acc => acc.id !== accountId));
    } catch (error) {
      console.error("Failed to disconnect account:", error);
    }
  };

  // Check if a platform is connected
  const isPlatformConnected = (platformName: string) => {
    const platformKey = allPlatforms.find(p => p.name === platformName)?.key;
    return connectedAccounts.some(acc => acc.platform === platformKey);
  };

  // Get connected account for a platform
  const getConnectedAccount = (platformName: string) => {
    const platformKey = allPlatforms.find(p => p.name === platformName)?.key;
    return connectedAccounts.find(acc => acc.platform === platformKey);
  };

  // Get connected and available platforms based on database data
  const connectedPlatforms = allPlatforms.filter(platform => isPlatformConnected(platform.name));
  const availablePlatforms = allPlatforms.filter(platform => !isPlatformConnected(platform.name));

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center", 
        minHeight: "400px",
        gap: "16px"
      }}>
        <div style={{
          width: "48px",
          height: "48px",
          backgroundColor: "var(--primary)/10",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: "pulse 1.5s ease-in-out"
        }}>
          <Users size={24} style={{ color: "var(--primary)" }} />
        </div>
        <p style={{ color: "var(--text-muted)" }}>Loading social accounts...</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Page header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>Social Accounts</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>Manage your social media connections</p>
        </div>
        
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {/* All Platforms Dropdown */}
          <div style={{ position: "relative" }} ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 16px",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                color: "white",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              <Paperclip size={16} style={{ color: "var(--primary)" }} />
              {selectedFilterPlatform}
              <ChevronDown 
                size={14} 
                style={{ 
                  color: "var(--text-muted)",
                  transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0)",
                  transition: "transform 0.2s"
                }} 
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                marginTop: "8px",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                zIndex: 50,
                overflow: "hidden"
              }}>
                {/* All Platforms option */}
                <button
                  onClick={() => {
                    setSelectedFilterPlatform("All Platforms");
                    setIsDropdownOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    width: "100%",
                    padding: "12px 16px",
                    backgroundColor: selectedFilterPlatform === "All Platforms" ? "var(--primary)/10" : "transparent",
                    border: "none",
                    borderBottom: "1px solid var(--border)",
                    color: "white",
                    cursor: "pointer",
                    textAlign: "left"
                  }}
                >
                  <div style={{
                    width: "32px",
                    height: "32px",
                    backgroundColor: "var(--primary)/20",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <Users size={16} style={{ color: "var(--primary)" }} />
                  </div>
                  <span style={{ flex: 1 }}>All Platforms</span>
                  {selectedFilterPlatform === "All Platforms" && (
                    <CheckCircle2 size={16} style={{ color: "var(--primary)" }} />
                  )}
                </button>
                
                {allPlatforms.map((platform) => (
                  <button
                    key={platform.name}
                    onClick={() => {
                      setSelectedFilterPlatform(platform.name);
                      setIsDropdownOpen(false);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      width: "100%",
                      padding: "12px 16px",
                      backgroundColor: selectedFilterPlatform === platform.name ? "var(--primary)/10" : "transparent",
                      border: "none",
                      borderBottom: platform.name !== allPlatforms[allPlatforms.length - 1].name ? "1px solid var(--border)" : "none",
                      color: "white",
                      cursor: "pointer",
                      textAlign: "left"
                    }}
                  >
                    <div style={{
                      width: "32px",
                      height: "32px",
                      backgroundColor: platform.color + "20",
                      borderRadius: "6px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "16px"
                    }}>
                      {platform.icon}
                    </div>
                    <span style={{ flex: 1 }}>{platform.name}</span>
                    {isPlatformConnected(platform.name) && (
                      <CheckCircle2 size={16} style={{ color: "var(--success)" }} />
                    )}
                    {selectedFilterPlatform === platform.name && !isPlatformConnected(platform.name) && (
                      <CheckCircle2 size={16} style={{ color: "var(--primary)" }} />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Add Account Button */}
          <button 
            onClick={handleAddAccountClick}
            disabled={!isProUser}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              backgroundColor: isProUser ? "var(--primary)" : "var(--surface)",
              border: isProUser ? "none" : "1px solid var(--border)",
              borderRadius: "8px",
              color: isProUser ? "white" : "var(--text-muted)",
              fontWeight: 500,
              cursor: isProUser ? "pointer" : "not-allowed",
              opacity: isProUser ? 1 : 0.6
            }}
          >
            {isProUser ? <Plus size={18} /> : <Lock size={18} />}
            {isProUser ? "Add Account" : "Pro Feature"}
          </button>
        </div>
      </div>

      {/* Pro Badge */}
      <div style={{
        backgroundColor: "var(--primary)/10",
        border: "1px solid var(--primary)/20",
        borderRadius: "12px",
        padding: "16px",
        display: "flex",
        alignItems: "center",
        gap: "12px"
      }}>
        <Crown size={20} style={{ color: "var(--primary)" }} />
        <div>
          <p style={{ fontSize: "14px", fontWeight: "600", color: "var(--primary)", marginBottom: "2px" }}>
            Pro Feature
          </p>
          <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
            Connect up to 6 social accounts with the Pro plan
          </p>
        </div>
      </div>

      {/* Connected Accounts */}
      {connectedAccounts.length > 0 && (
        <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontSize: "16px", fontWeight: "600", color: "white" }}>Connected Accounts</h2>
            <span style={{ 
              padding: "4px 12px", 
              backgroundColor: "var(--success)20", 
              color: "var(--success)", 
              borderRadius: "12px", 
              fontSize: "12px", 
              fontWeight: "500" 
            }}>
              {connectedAccounts.length} connected
            </span>
          </div>
          <div style={{ padding: "16px 20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
              {connectedAccounts.map((account) => {
                const platformInfo = getPlatformInfo(account.platform);
                return (
                  <div key={account.id} style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px",
                    backgroundColor: "var(--background)",
                    borderRadius: "8px",
                    border: "1px solid var(--border)"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <div style={{
                        width: "48px",
                        height: "48px",
                        backgroundColor: platformInfo.color + "20",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "24px"
                      }}>
                        {platformInfo.icon}
                      </div>
                      <div>
                        <p style={{ fontWeight: 500, color: "white", marginBottom: "4px" }}>{platformInfo.name}</p>
                        <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>{account.platformUsername || "Connected"}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button style={{
                        background: "none",
                        border: "1px solid var(--border)",
                        color: "var(--text-secondary)",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "12px"
                      }}>
                        <Settings size={14} />
                      </button>
                      <button 
                        onClick={() => handleDisconnectAccount(account.id)}
                        style={{
                          background: "none",
                          border: "1px solid rgba(239, 68, 68, 0.3)",
                          color: "var(--error)",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "12px"
                        }}>
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Available Platforms */}
      {availablePlatforms.length > 0 && (
        <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontSize: "16px", fontWeight: "600", color: "white" }}>Available Platforms</h2>
            <span style={{ 
              padding: "4px 12px", 
              backgroundColor: "var(--warning)20", 
              color: "var(--warning)", 
              borderRadius: "12px", 
              fontSize: "12px", 
              fontWeight: "500" 
            }}>
              {availablePlatforms.length} available
            </span>
          </div>
          <div style={{ padding: "16px 20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
              {availablePlatforms.map((platform) => (
                <div key={platform.name} style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px",
                  backgroundColor: "var(--background)",
                  borderRadius: "8px",
                  border: "1px solid var(--border)"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{
                      width: "48px",
                      height: "48px",
                      backgroundColor: platform.color + "20",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "24px"
                    }}>
                      {platform.icon}
                    </div>
                    <div>
                      <p style={{ fontWeight: 500, color: "white", marginBottom: "4px" }}>{platform.name}</p>
                      <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Not connected</p>
                    </div>
                  </div>
                  <button style={{
                    padding: "6px 12px",
                    backgroundColor: "var(--primary)",
                    border: "none",
                    borderRadius: "6px",
                    color: "white",
                    fontSize: "12px",
                    fontWeight: "500",
                    cursor: "pointer"
                  }}>
                    Connect
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Account Modal */}
      {showAddModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "24px"
        }}>
          <div style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "32px",
            maxWidth: "500px",
            width: "100%"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>Add Social Account</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                disabled={connecting}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: connecting ? "not-allowed" : "pointer",
                  padding: "4px"
                }}
              >
                <X size={24} />
              </button>
            </div>

            <p style={{ color: "var(--text-secondary)", fontSize: "16px", marginBottom: "24px" }}>
              Select the platform you want to connect to your account
            </p>

            {/* Platform Selection */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "white", marginBottom: "12px" }}>
                Select Platform
              </label>
              <div style={{
                backgroundColor: "var(--background)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                padding: "8px"
              }}>
                {allPlatforms.map((platform) => (
                  <div
                    key={platform.name}
                    onClick={() => setSelectedPlatform(platform.name)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "12px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      transition: "background-color 0.2s",
                      backgroundColor: selectedPlatform === platform.name ? "var(--primary)/10" : "transparent",
                      border: selectedPlatform === platform.name ? "1px solid var(--primary)" : "1px solid transparent",
                      marginBottom: "8px"
                    }}
                  >
                    <div style={{
                      width: "40px",
                      height: "40px",
                      backgroundColor: platform.color + "20",
                      borderRadius: "6px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "20px",
                      marginRight: "12px"
                    }}>
                      {platform.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 500, color: "white", marginBottom: "2px" }}>{platform.name}</p>
                      <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                        {isPlatformConnected(platform.name) ? "Already connected" : "Connect your account"}
                      </p>
                    </div>
                    {selectedPlatform === platform.name && (
                      <CheckCircle2 size={20} style={{ color: "var(--primary)" }} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button 
                onClick={() => setShowAddModal(false)}
                disabled={connecting}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "white",
                  fontWeight: 500,
                  cursor: connecting ? "not-allowed" : "pointer",
                  opacity: connecting ? 0.5 : 1
                }}
              >
                Cancel
              </button>
              <button 
                onClick={handleAddAccount}
                disabled={connecting || !selectedPlatform}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "var(--primary)",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                  fontWeight: 500,
                  cursor: (!selectedPlatform || connecting) ? "not-allowed" : "pointer",
                  opacity: (!selectedPlatform || connecting) ? 0.5 : 1,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                {connecting ? (
                  <div style={{
                    width: "16px",
                    height: "16px",
                    border: "2px solid #fff",
                    borderTop: "2px solid transparent",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite"
                  }} />
                ) : (
                  "Connect"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Tips */}
      <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "24px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "600", color: "white", marginBottom: "16px" }}>
          Quick Tips
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <div style={{
              width: "24px",
              height: "24px",
              backgroundColor: "var(--success)/20",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              marginTop: "2px"
            }}>
              <CheckCircle2 size={16} style={{ color: "var(--success)" }} />
            </div>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              Connect all your platforms to schedule posts across multiple channels simultaneously
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <div style={{
              width: "24px",
              height: "24px",
              backgroundColor: "var(--success)/20",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              marginTop: "2px"
            }}>
              <CheckCircle2 size={16} style={{ color: "var(--success)" }} />
            </div>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              Your connection data is secure and encrypted. We never store your passwords.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <div style={{
              width: "24px",
              height: "24px",
              backgroundColor: "var(--success)/20",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              marginTop: "2px"
            }}>
              <CheckCircle2 size={16} style={{ color: "var(--success)" }} />
            </div>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              Manage your posting permissions and preferences for each connected account
            </p>
          </div>
        </div>
      </div>

      {/* ProModal for Non-Pro Users */}
      {isProModalOpen && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "24px"
        }}>
          <div style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "32px",
            maxWidth: "500px",
            width: "100%",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
          }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{
                  width: "56px",
                  height: "56px",
                  backgroundColor: "var(--primary)/20",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <Crown size={28} style={{ color: "var(--primary)" }} />
                </div>
                <div>
                  <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "white", marginBottom: "4px" }}>Add Social Accounts</h2>
                  <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Unlock premium connections</p>
                </div>
              </div>
              <button 
                onClick={() => setIsProModalOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  padding: "8px"
                }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "24px" }}>
              Connect your social accounts with Pro to access advanced features:
            </p>

            {/* Pro Platforms Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", marginBottom: "24px" }}>
              {allPlatforms.map((platform) => (
                <button
                  key={platform.name}
                  onClick={() => {
                    router.push("/resources/pricing?upgrade=social");
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px",
                    backgroundColor: "var(--background)",
                    border: "1px solid var(--border)",
                    borderRadius: "10px",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s"
                  }}
                >
                  <div style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: platform.color + "20",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px"
                  }}>
                    {platform.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "14px", fontWeight: 500, color: "white", marginBottom: "2px" }}>{platform.name}</p>
                    <p style={{ fontSize: "12px", color: "var(--primary)" }}>Pro</p>
                  </div>
                  <Lock size={16} style={{ color: "var(--text-muted)" }} />
                </button>
              ))}
            </div>

            {/* Upgrade Button */}
            <button
              onClick={() => router.push("/resources/pricing?upgrade=social")}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "12px 24px",
                background: "linear-gradient(135deg, var(--primary), var(--accent))",
                border: "none",
                borderRadius: "10px",
                color: "white",
                fontSize: "16px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "opacity 0.2s"
              }}
            >
              Upgrade to Pro
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
