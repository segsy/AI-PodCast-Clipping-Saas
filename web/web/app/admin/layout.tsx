"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Film, 
  CreditCard, 
  Settings,
  LogOut,
  Menu,
  X,
  BarChart3,
  Folder,
  Clock,
  Zap,
  MessageSquare,
  Bell,
  Palette,
  Shield
} from "lucide-react";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Clips", href: "/admin/clips", icon: Film },
  { name: "Billing", href: "/admin/billing", icon: CreditCard },
  { name: "Settings", href: "/admin/settings", icon: Settings },
  { name: "Workspaces", href: "/admin/workspaces", icon: Folder },
  { name: "Activity", href: "/admin/activity", icon: Clock },
  { name: "Notifications", href: "/admin/notifications", icon: Bell },
  { name: "Templates", href: "/admin/templates", icon: Palette },
  { name: "Security", href: "/admin/security", icon: Shield },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--background)" }}>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 40,
            backgroundColor: "rgba(0,0,0,0.5)"
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 50,
        height: "100%",
        width: "256px",
        backgroundColor: "var(--surface)",
        borderRight: "1px solid var(--border)",
        transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.2s ease-in-out"
      }} className="lg:translate-x-0">
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "24px",
          borderBottom: "1px solid var(--border)"
        }}>
          <h1 style={{ fontSize: "20px", fontWeight: "bold", color: "var(--primary)" }}>AI Podcast</h1>
          <button 
            onClick={() => setSidebarOpen(false)}
            style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}
            className="lg:hidden"
          >
            <X size={24} />
          </button>
        </div>

        <nav style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "4px" }}>
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  transition: "background-color 0.2s",
                  backgroundColor: isActive ? "var(--primary)" : "transparent",
                  color: isActive ? "white" : "var(--text-secondary)",
                  textDecoration: "none"
                }}
              >
                <item.icon size={20} />
                <span style={{ fontWeight: 500 }}>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "16px",
          borderTop: "1px solid var(--border)"
        }}>
          <button style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 16px",
            width: "100%",
            background: "none",
            border: "none",
            color: "var(--text-secondary)",
            cursor: "pointer",
            transition: "color 0.2s"
          }}>
            <LogOut size={20} />
            <span style={{ fontWeight: 500 }}>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div style={{ paddingLeft: sidebarOpen ? "0" : "0" }} className="lg:pl-64">
        {/* Mobile header */}
        <header style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          display: "flex",
          alignItems: "center",
          gap: "16px",
          padding: "12px 16px",
          backgroundColor: "var(--surface)",
          borderBottom: "1px solid var(--border)"
        }} className="lg:hidden">
          <button 
            onClick={() => setSidebarOpen(true)}
            style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}
          >
            <Menu size={24} />
          </button>
          <span style={{ fontWeight: "bold", color: "var(--primary)" }}>AI Podcast Admin</span>
        </header>

        <main style={{ padding: "24px" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
