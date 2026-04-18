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
  Calendar,
  Book,
  HelpCircle,
  FolderOpen,
  Sparkles,
  Wand2,
  Video,
  Mic,
  ImageIcon,
  ExternalLink,
  Crown,
  CreditCard as CreditCardIcon,
  Globe
} from "lucide-react";
import { useState } from "react";
import { signOut } from "@/lib/auth-client";
import { useSession } from "@/lib/auth-client";

const createMenu = [
  { name: "Home dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Brand template", href: "/dashboard/brand-template", icon: Sparkles, badge: "Pro" },
  { name: "Asset library", href: "/dashboard/assets", icon: FolderOpen , badge: "Pro" },
];

const postMenu = [
  { name: "Calendar", href: "/dashboard/calendar", icon: Calendar },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },  
  { name: "Social accounts", href: "/dashboard/social", icon: Users },
  { name: "Subscription", href: "/dashboard/subscription", icon: CreditCard },
  { name: "Learning center", href: "/dashboard/learning", icon: Book },
  { name: "Help center", href: "/dashboard/help", icon: HelpCircle },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--background)", display: "flex" }}>
      {/* Sidebar */}
      <aside style={{
        width: "260px",
        backgroundColor: "var(--surface)",
        borderRight: "1px solid var(--border)",
        position: "fixed",
        height: "100vh",
        overflowY: "auto",
        zIndex: 100
      }}>
        {/* Logo */}
        <div style={{
          padding: "24px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          borderBottom: "1px solid var(--border)"
        }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
            <div style={{
              width: "36px",
              height: "36px",
              backgroundColor: "var(--primary)",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Zap size={20} style={{ color: "white" }} />
            </div>
            <span style={{ fontSize: "20px", fontWeight: "bold", color: "white" }}>AI Podcast</span>
          </Link>
        </div>

        {/* Menu */}
        <nav style={{ padding: "16px" }}>
          {/* Clips, Uploads, Analytics */}
          <div style={{ marginBottom: "24px" }}>
            <div style={{ padding: "0 16px 12px", fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Main
            </div>
            <Link
              href="/dashboard/clips"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 16px",
                borderRadius: "8px",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: 500,
                backgroundColor: pathname === "/dashboard/clips" ? "var(--primary)" : "transparent",
                color: pathname === "/dashboard/clips" ? "white" : "var(--text-secondary)",
                transition: "all 0.2s"
              }}
            >
              <Film size={18} />
              Clips
            </Link>
            <Link
              href="/dashboard/uploads"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 16px",
                borderRadius: "8px",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: 500,
                backgroundColor: pathname === "/dashboard/uploads" ? "var(--primary)" : "transparent",
                color: pathname === "/dashboard/uploads" ? "white" : "var(--text-secondary)",
                transition: "all 0.2s",
                marginTop: "4px"
              }}
            >
              <Upload size={18} />
              Uploads
            </Link>
          </div>

          {/* Create Menu */}
          <div style={{ marginBottom: "24px" }}>
            <div style={{ padding: "0 16px 12px", fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Create
            </div>
            {createMenu.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: 500,
                  backgroundColor: pathname === item.href ? "var(--primary)" : "transparent",
                  color: pathname === item.href ? "white" : "var(--text-secondary)",
                  transition: "all 0.2s",
                  marginTop: item.name === "Home dashboard" ? "0" : "4px"
                }}
              >
                <item.icon size={18} />
                <span style={{ flex: 1 }}>{item.name}</span>
                {item.badge && (
                  <span style={{
                    fontSize: "10px",
                    fontWeight: "700",
                    color: "var(--primary)",
                    backgroundColor: "var(--primary)/10",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}>
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Post Menu */}
          <div style={{ marginBottom: "24px" }}>
            <div style={{ padding: "0 16px 12px", fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Post
            </div>
            {postMenu.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: 500,
                  backgroundColor: pathname === item.href ? "var(--primary)" : "transparent",
                  color: pathname === item.href ? "white" : "var(--text-secondary)",
                  transition: "all 0.2s",
                  marginTop: item.name === "Calendar" ? "0" : "4px"
                }}
              >
                <item.icon size={18} />
                <span style={{ flex: 1 }}>{item.name}</span>
              </Link>
            ))}
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, marginLeft: "260px" }}>
        {/* Top Bar */}
        <div style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          backgroundColor: "var(--surface)",
          borderBottom: "1px solid var(--border)",
          padding: "0 24px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end"
        }}>
          {/* User Profile Dropdown */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "8px 16px",
                borderRadius: "8px",
                background: "none",
                border: "1px solid var(--border)",
                color: "var(--text-secondary)",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              <div style={{
                width: "32px",
                height: "32px",
                backgroundColor: "var(--primary)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                fontWeight: 600,
                color: "white"
              }}>
                {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <span style={{ fontWeight: 500 }}>{session?.user?.email || "user@example.com"}</span>
              <ChevronDown size={16} style={{ transform: profileMenuOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
            </button>
            
            {/* Dropdown Menu */}
            {profileMenuOpen && (
              <div style={{
                position: "absolute",
                top: "100%",
                right: "0",
                marginTop: "8px",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                minWidth: "280px",
                zIndex: 1000,
                boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)"
              }}>
                <div style={{ padding: "16px", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ fontSize: "14px", fontWeight: 500, color: "white", marginBottom: "4px" }}>
                    {session?.user?.name || "User"}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    {session?.user?.email || "user@example.com"}
                  </div>
                </div>
                
                <div style={{ padding: "8px" }}>
                  <Link
                    href="/dashboard/team"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "10px 16px",
                      borderRadius: "6px",
                      textDecoration: "none",
                      fontSize: "14px",
                      color: "var(--text-secondary)",
                      transition: "background-color 0.2s"
                    }}
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    <Users size={16} />
                    <span>Create a team</span>
                    <span style={{
                      marginLeft: "auto",
                      fontSize: "10px",
                      fontWeight: "700",
                      color: "var(--primary)",
                      backgroundColor: "var(--primary)/10",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      textTransform: "uppercase"
                    }}>
                      Pro
                    </span>
                  </Link>
                  
                  <Link
                    href="/dashboard/ai-captions"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "10px 16px",
                      borderRadius: "6px",
                      textDecoration: "none",
                      fontSize: "14px",
                      color: "var(--text-secondary)",
                      transition: "background-color 0.2s",
                      marginTop: "4px"
                    }}
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    <FileText size={16} />
                    <span>Clip Caption</span>
                    <span style={{
                      marginLeft: "auto",
                      fontSize: "10px",
                      fontWeight: "700",
                      color: "var(--success)",
                      backgroundColor: "var(--success)/10",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      textTransform: "uppercase"
                    }}>
                      Free
                    </span>
                  </Link>
                  
                  <Link
                    href="/dashboard/ai-thumbnail"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "10px 16px",
                      borderRadius: "6px",
                      textDecoration: "none",
                      fontSize: "14px",
                      color: "var(--text-secondary)",
                      transition: "background-color 0.2s",
                      marginTop: "4px"
                    }}
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    <ImageIcon size={16} />
                    <span>Clip Thumbnail</span>
                    <span style={{
                      marginLeft: "auto",
                      fontSize: "10px",
                      fontWeight: "700",
                      color: "var(--success)",
                      backgroundColor: "var(--success)/10",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      textTransform: "uppercase"
                    }}>
                      Free
                    </span>
                  </Link>
                  
                  <Link
                    href="/dashboard/credits"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "10px 16px",
                      borderRadius: "6px",
                      textDecoration: "none",
                      fontSize: "14px",
                      color: "var(--text-secondary)",
                      transition: "background-color 0.2s",
                      marginTop: "4px"
                    }}
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    <CreditCardIcon size={16} />
                    <span>Credit usage History</span>
                  </Link>
                  
                  <Link
                    href="/dashboard/settings"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "10px 16px",
                      borderRadius: "6px",
                      textDecoration: "none",
                      fontSize: "14px",
                      color: "var(--text-secondary)",
                      transition: "background-color 0.2s",
                      marginTop: "4px"
                    }}
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    <Globe size={16} />
                    <span>Language</span>
                    <span style={{
                      marginLeft: "auto",
                      fontSize: "12px",
                      color: "var(--text-muted)"
                    }}>
                      English (US)
                    </span>
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "10px 16px",
                      borderRadius: "6px",
                      background: "none",
                      border: "none",
                      fontSize: "14px",
                      color: "var(--error)",
                      cursor: "pointer",
                      transition: "background-color 0.2s",
                      marginTop: "4px",
                      width: "100%",
                      textAlign: "left"
                    }}
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "24px" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
