"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Layers, BookOpen, Plus } from "lucide-react";

export default function CMSPage() {
  const [activeTab, setActiveTab] = useState("pages");

  const tabs = [
    { id: "pages", label: "Pages", icon: FileText, href: "/admin/cms/pages" },
    { id: "sections", label: "Sections", icon: Layers, href: "/admin/cms/sections" },
    { id: "resources", label: "Resources", icon: BookOpen, href: "/admin/cms/resources" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Page header */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Content Management System</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>Manage pages, sections, and resources for your website</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        backgroundColor: "var(--surface)",
        borderRadius: "12px",
        border: "1px solid var(--border)",
        padding: "24px"
      }}>
        <div style={{ display: "flex", gap: "24px", marginBottom: "24px" }}>
          {tabs.map((tab) => (
            <Link key={tab.id} href={tab.href}>
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 24px",
                  backgroundColor: activeTab === tab.id ? "var(--primary)" : "var(--surface)",
                  color: activeTab === tab.id ? "white" : "var(--text-secondary)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 500
                }}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            </Link>
          ))}
        </div>

        {/* Content area */}
        <div style={{ textAlign: "center", padding: "48px 24px" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📝</div>
          <h3 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "8px" }}>Welcome to CMS</h3>
          <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>
            Select a category above to start managing your content. You can create and edit pages, sections, and resources with our WYSIWYG editor.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <Link href="/admin/cms/pages">
              <button
                style={{
                  backgroundColor: "var(--primary)",
                  color: "white",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontWeight: 500
                }}
              >
                <Plus size={18} />
                Manage Pages
              </button>
            </Link>
            <Link href="/admin/cms/resources">
              <button
                style={{
                  backgroundColor: "var(--surface)",
                  color: "white",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontWeight: 500
                }}
              >
                <Plus size={18} />
                Manage Resources
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}