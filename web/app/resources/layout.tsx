import Link from "next/link";
import { BookOpen, GraduationCap, FileText, BookMarked, HelpCircle, ArrowLeft, Zap } from "lucide-react";

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const resourcesNav = [
    { name: "Customer Stories", href: "/resources/customer-stories", icon: BookOpen },
    { name: "Learning Center", href: "/resources/learning-center", icon: GraduationCap },
    { name: "Product Changelog", href: "/resources/changelog", icon: FileText },
    { name: "Blog", href: "/resources/blog", icon: BookMarked },
    { name: "Help Center", href: "/resources/help-center", icon: HelpCircle },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--background)" }}>
      {/* Header */}
      <header style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: "rgba(15, 15, 35, 0.8)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)"
      }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
                <div style={{ width: "32px", height: "32px", backgroundColor: "var(--primary)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Zap size={18} style={{ color: "white" }} />
                </div>
                <span style={{ fontSize: "20px", fontWeight: "bold", color: "white" }}>AI Podcast</span>
              </Link>
            </div>
            <nav style={{ display: "flex", gap: "24px", alignItems: "center" }}>
              <Link href="/resources/customer-stories" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Customer Stories</Link>
              <Link href="/resources/learning-center" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Learning Center</Link>
              <Link href="/resources/changelog" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Changelog</Link>
              <Link href="/resources/blog" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Blog</Link>
              <Link href="/resources/help-center" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Help Center</Link>
              <Link href="/" style={{
                backgroundColor: "var(--primary)",
                color: "white",
                padding: "8px 16px",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: 500
              }}>
                Go to Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside style={{
        position: "fixed",
        left: 0,
        top: "64px",
        bottom: 0,
        width: "260px",
        backgroundColor: "var(--surface)",
        borderRight: "1px solid var(--border)",
        padding: "24px 16px",
        overflowY: "auto"
      }}>
        <Link href="/" style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          color: "var(--text-secondary)",
          textDecoration: "none",
          fontSize: "14px",
          marginBottom: "24px",
          padding: "8px"
        }}>
          <ArrowLeft size={16} />
          Back to Home
        </Link>
        
        <div style={{ marginBottom: "8px", padding: "0 8px" }}>
          <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Resources
          </span>
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {resourcesNav.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px",
                borderRadius: "8px",
                color: "var(--text-secondary)",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: 500,
                transition: "all 0.2s"
              }}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main style={{
        marginLeft: "260px",
        marginTop: "64px",
        padding: "32px",
        minHeight: "calc(100vh - 64px)"
      }}>
        <div style={{ maxWidth: "1200px" }}>
          {children}
        </div>
      </main>
    </div>
  );
}
