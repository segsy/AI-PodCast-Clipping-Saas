"use client";

import { Rocket, Zap, Bug, TrendingUp, ArrowRight } from "lucide-react";

export default function ChangelogPage() {
  const changes = [
    {
      version: "v2.5.0",
      date: "February 20, 2026",
      type: "feature",
      title: "AI-Powered B-Roll Generation",
      description: "Generate relevant B-roll footage automatically using AI. Simply select moments in your video and let our AI find or create the perfect B-roll.",
      icon: Zap,
    },
    {
      version: "v2.4.2",
      date: "February 15, 2026",
      type: "improvement",
      title: "Enhanced Caption Styles",
      description: "Added 20+ new caption animations and styles. Now you can customize font, color, size, and position for each caption element.",
      icon: TrendingUp,
    },
    {
      version: "v2.4.1",
      date: "February 10, 2026",
      type: "bug",
      title: "Fixed Export Issues",
      description: "Resolved an issue where certain video exports would fail on Safari. Improved reliability of multipart uploads for large files.",
      icon: Bug,
    },
    {
      version: "v2.4.0",
      date: "February 5, 2026",
      type: "feature",
      title: "Team Collaboration Upgrade",
      description: "New team workspaces with real-time editing, comments, and approval workflows. Invite team members and manage roles easily.",
      icon: Rocket,
    },
    {
      version: "v2.3.5",
      date: "January 28, 2026",
      type: "improvement",
      title: "Faster Processing Speed",
      description: "Video processing is now 40% faster. ClipAnything technology has been optimized for quicker turnaround times.",
      icon: TrendingUp,
    },
    {
      version: "v2.3.0",
      date: "January 20, 2026",
      type: "feature",
      title: "Social Scheduler Enhancement",
      description: "Schedule posts across multiple platforms with custom timing for each. Added support for LinkedIn and Twitter/X.",
      icon: Rocket,
    },
    {
      version: "v2.2.1",
      date: "January 12, 2026",
      type: "bug",
      title: "Mobile App Sync Fix",
      description: "Fixed synchronization issues between web and mobile apps. Projects now sync properly across all devices.",
      icon: Bug,
    },
    {
      version: "v2.2.0",
      date: "January 5, 2026",
      type: "feature",
      title: "Brand Kit Integration",
      description: "Create and save brand templates with logos, colors, and fonts. Apply your brand identity to all videos with one click.",
      icon: Zap,
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "feature":
        return { bg: "rgba(139, 92, 246, 0.1)", color: "var(--primary)" };
      case "improvement":
        return { bg: "rgba(6, 182, 212, 0.1)", color: "var(--accent)" };
      case "bug":
        return { bg: "rgba(239, 68, 68, 0.1)", color: "var(--error)" };
      default:
        return { bg: "rgba(16, 185, 129, 0.1)", color: "var(--success)" };
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <div style={{ marginBottom: "48px" }}>
        <h1 style={{ fontSize: "48px", fontWeight: "bold", marginBottom: "16px", background: "linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Product Changelog
        </h1>
        <p style={{ fontSize: "20px", color: "var(--text-secondary)", maxWidth: "600px" }}>
          Stay up to date with the latest features, improvements, and bug fixes
        </p>
      </div>

      {/* Changelog Feed */}
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {changes.map((change, index) => {
          const typeStyle = getTypeColor(change.type);
          return (
            <div
              key={index}
              style={{
                backgroundColor: "var(--surface)",
                borderRadius: "16px",
                border: "1px solid var(--border)",
                padding: "24px",
                position: "relative"
              }}
            >
              {/* Version Badge */}
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "space-between",
                marginBottom: "16px",
                flexWrap: "wrap",
                gap: "12px"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{
                    backgroundColor: "var(--primary)",
                    color: "white",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: 600
                  }}>
                    {change.version}
                  </span>
                  <span style={{
                    backgroundColor: typeStyle.bg,
                    color: typeStyle.color,
                    padding: "4px 10px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: 500,
                    textTransform: "capitalize"
                  }}>
                    {change.type}
                  </span>
                </div>
                <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                  {change.date}
                </span>
              </div>

              {/* Content */}
              <div style={{ display: "flex", gap: "16px" }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  backgroundColor: typeStyle.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}>
                  <change.icon size={20} style={{ color: typeStyle.color }} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "8px" }}>
                    {change.title}
                  </h3>
                  <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                    {change.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More */}
      <div style={{ marginTop: "48px", textAlign: "center" }}>
        <button style={{
          backgroundColor: "var(--surface)",
          color: "white",
          padding: "14px 32px",
          borderRadius: "8px",
          border: "1px solid var(--border)",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: 500,
          display: "inline-flex",
          alignItems: "center",
          gap: "8px"
        }}>
          View Older Updates
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Subscribe */}
      <div style={{
        marginTop: "48px",
        backgroundColor: "var(--surface)",
        borderRadius: "16px",
        border: "1px solid var(--border)",
        padding: "32px"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "24px" }}>
          <div>
            <h3 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "8px" }}>
              Stay in the loop
            </h3>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
              Get notified when we release new features
            </p>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              style={{
                backgroundColor: "var(--background)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                padding: "12px 16px",
                color: "white",
                fontSize: "14px",
                outline: "none",
                width: "240px"
              }}
            />
            <button style={{
              backgroundColor: "var(--primary)",
              color: "white",
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 500
            }}>
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
