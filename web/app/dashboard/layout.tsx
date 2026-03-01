"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Upload, 
  Film, 
  BarChart3, 
  Settings,
  Zap,
  ChevronDown,
  LogOut,
  User,
  Users,
  Image,
  FileText,
  CreditCard,
  ArrowLeft
} from "lucide-react";
import { useState } from "react";
import { signOut } from "@/lib/auth-client";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Clips", href: "/dashboard/clips", icon: Film },
  { name: "Uploads", href: "/dashboard/uploads", icon: Upload },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
];

const profileMenuItems = [
  { name: "Create a Team", href: "/dashboard/team", icon: Users },
  { name: "AI PodCast Captions", href: "/dashboard/ai-captions", icon: FileText },
  { name: "AI PodCast Thumbnail", href: "/dashboard/ai-thumbnail", icon: Image },
  { name: "Credit Usage history", href: "/dashboard/credits", icon: CreditCard },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--background)" }}>
      {/* Header */}
      <header style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: "var(--surface)",
        borderBottom: "1px solid var(--border)"
      }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
                <div style={{ width: "32px", height: "32px", backgroundColor: "var(--primary)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Zap size={18} style={{ color: "white" }} />
                </div>
                <span style={{ fontSize: "20px", fontWeight: "bold", color: "white" }}>AI Podcast</span>
              </Link>
            </div>

            {/* Navigation */}
            <nav style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      textDecoration: "none",
                      fontSize: "14px",
                      fontWeight: 500,
                      backgroundColor: isActive ? "var(--primary)" : "transparent",
                      color: isActive ? "white" : "var(--text-secondary)",
                      transition: "all 0.2s"
                    }}
                  >
                    <item.icon size={18} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* User Menu */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "6px 12px",
                  backgroundColor: "var(--surface-hover)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  cursor: "pointer",
                  color: "white"
                }}
              >
                <div style={{
                  width: "28px",
                  height: "28px",
                  backgroundColor: "var(--primary)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: 600
                }}>
                  JD
                </div>
                <span style={{ fontSize: "14px" }}>john@example.com</span>
                <ChevronDown size={16} style={{ color: "var(--text-muted)" }} />
              </button>

              {/* Profile Dropdown */}
              {profileMenuOpen && (
                <>
                  <div
                    style={{
                      position: "fixed",
                      inset: 0,
                      zIndex: 40
                    }}
                    onClick={() => setProfileMenuOpen(false)}
                  />
                  <div style={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    marginTop: "8px",
                    width: "280px",
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    padding: "8px",
                    zIndex: 50,
                    boxShadow: "0 10px 40px rgba(0,0,0,0.3)"
                  }}>
                    {/* User Info */}
                    <div style={{ padding: "12px", borderBottom: "1px solid var(--border)", marginBottom: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{
                          width: "40px",
                          height: "40px",
                          backgroundColor: "var(--primary)",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "16px",
                          fontWeight: 600,
                          color: "white"
                        }}>
                          JD
                        </div>
                        <div>
                          <div style={{ fontWeight: 500, color: "white", fontSize: "14px" }}>John Doe</div>
                          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>john@example.com</div>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    {profileMenuItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setProfileMenuOpen(false)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "12px",
                          borderRadius: "8px",
                          textDecoration: "none",
                          color: "var(--text-secondary)",
                          fontSize: "14px",
                          transition: "all 0.2s"
                        }}
                        className="hover:bg-surface-hover"
                      >
                        <item.icon size={18} />
                        {item.name}
                      </Link>
                    ))}

                    {/* Settings */}
                    <Link
                      href="/dashboard/settings"
                      onClick={() => setProfileMenuOpen(false)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px",
                        borderRadius: "8px",
                        textDecoration: "none",
                        color: "var(--text-secondary)",
                        fontSize: "14px",
                        transition: "all 0.2s"
                      }}
                      className="hover:bg-surface-hover"
                    >
                      <Settings size={18} />
                      Settings
                    </Link>

                    {/* Divider */}
                    <div style={{ height: "1px", backgroundColor: "var(--border)", margin: "8px 0" }} />

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px",
                        width: "100%",
                        borderRadius: "8px",
                        background: "none",
                        border: "none",
                        color: "var(--error)",
                        fontSize: "14px",
                        cursor: "pointer",
                        transition: "all 0.2s"
                      }}
                      className="hover:bg-surface-hover"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: "24px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          {children}
        </div>
      </main>
    </div>
  );
}
