"use client";

import { 
  Palette, 
  Plus, 
  Search,
  MoreVertical,
  Eye,
  Edit,
  Copy,
  Trash2
} from "lucide-react";

export default function TemplatesPage() {
  const templates = [
    { 
      name: "Modern Intro", 
      type: "Intro",
      uses: 245,
      thumbnail: "#8B5CF6"
    },
    { 
      name: "Corporate Outro", 
      type: "Outro",
      uses: 189,
      thumbnail: "#3B82F6"
    },
    { 
      name: "Social Media Pack", 
      type: "Full Video",
      uses: 512,
      thumbnail: "#10B981"
    },
    { 
      name: "Viral Captions", 
      type: "Captions",
      uses: 876,
      thumbnail: "#F59E0B"
    },
    { 
      name: "Brand Lower Third", 
      type: "Lower Third",
      uses: 156,
      thumbnail: "#EF4444"
    },
    { 
      name: "Product Showcase", 
      type: "Full Video",
      uses: 98,
      thumbnail: "#6366F1"
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Page header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "white", marginBottom: "8px" }}>
            Templates
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Manage your brand templates and video presets
          </p>
        </div>
        <button style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          backgroundColor: "var(--primary)",
          color: "white",
          padding: "10px 16px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          fontWeight: 500
        }}>
          <Plus size={18} />
          Create Template
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "8px" }}>
        {["All", "Intros", "Outros", "Lower Thirds", "Captions", "Full Video"].map((filter, index) => (
          <button
            key={index}
            style={{
              padding: "8px 16px",
              borderRadius: "20px",
              border: index === 0 ? "none" : "1px solid var(--border)",
              backgroundColor: index === 0 ? "var(--primary)" : "transparent",
              color: "white",
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", 
        gap: "16px" 
      }}>
        {templates.map((template, index) => (
          <div 
            key={index}
            style={{ 
              backgroundColor: "var(--surface)", 
              borderRadius: "12px", 
              border: "1px solid var(--border)",
              overflow: "hidden"
            }}
          >
            {/* Thumbnail */}
            <div style={{
              height: "160px",
              backgroundColor: template.thumbnail,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Palette size={48} style={{ color: "white", opacity: 0.8 }} />
            </div>
            
            {/* Content */}
            <div style={{ padding: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: "600", color: "white", marginBottom: "4px" }}>
                    {template.name}
                  </h3>
                  <span style={{ 
                    fontSize: "12px", 
                    color: "var(--text-secondary)",
                    backgroundColor: "var(--background)",
                    padding: "4px 8px",
                    borderRadius: "4px"
                  }}>
                    {template.type}
                  </span>
                </div>
                <button style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-secondary)",
                  cursor: "pointer"
                }}>
                  <MoreVertical size={18} />
                </button>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
                <span style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
                  Used {template.uses} times
                </span>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button style={{
                    background: "none",
                    border: "none",
                    color: "var(--text-secondary)",
                    cursor: "pointer",
                    padding: "4px"
                  }}>
                    <Eye size={16} />
                  </button>
                  <button style={{
                    background: "none",
                    border: "none",
                    color: "var(--text-secondary)",
                    cursor: "pointer",
                    padding: "4px"
                  }}>
                    <Copy size={16} />
                  </button>
                  <button style={{
                    background: "none",
                    border: "none",
                    color: "var(--text-secondary)",
                    cursor: "pointer",
                    padding: "4px"
                  }}>
                    <Edit size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
