"use client";

import { useState } from "react";
import { 
  Palette, 
  Plus, 
  Search, 
  MoreVertical, 
  Copy, 
  Edit2, 
  Trash2, 
  Check,
  ChevronRight,
  Layout,
  Type,
  Image,
  Sparkles,
  Zap,
  Loader2
} from "lucide-react";

interface BrandTemplate {
  id: string;
  name: string;
  type: string;
  thumbnail: string;
  createdAt: string;
  usedCount: number;
}

const templateTypes = [
  { name: "All Templates", icon: Layout, count: 24 },
  { name: "Intro", icon: Layout, count: 8 },
  { name: "Outro", icon: Zap, count: 6 },
  { name: "Lower Thirds", icon: Type, count: 5 },
  { name: "Captions", icon: Image, count: 3 },
  { name: "Transitions", icon: ChevronRight, count: 2 },
];

const sampleTemplates: BrandTemplate[] = [
  {
    id: "1",
    name: "Corporate Intro",
    type: "Intro",
    thumbnail: "/templates/corporate-intro.jpg",
    createdAt: "2024-01-15",
    usedCount: 45,
  },
  {
    id: "2",
    name: "Modern Outro",
    type: "Outro",
    thumbnail: "/templates/modern-outro.jpg",
    createdAt: "2024-01-10",
    usedCount: 32,
  },
  {
    id: "3",
    name: "Minimal Lower Third",
    type: "Lower Thirds",
    thumbnail: "/templates/lower-third.jpg",
    createdAt: "2024-01-08",
    usedCount: 28,
  },
  {
    id: "4",
    name: "Social Media Captions",
    type: "Captions",
    thumbnail: "/templates/captions.jpg",
    createdAt: "2024-01-05",
    usedCount: 56,
  },
  {
    id: "5",
    name: "Brand Transition",
    type: "Transitions",
    thumbnail: "/templates/transition.jpg",
    createdAt: "2024-01-02",
    usedCount: 19,
  },
  {
    id: "6",
    name: "Podcast Intro",
    type: "Intro",
    thumbnail: "/templates/podcast-intro.jpg",
    createdAt: "2023-12-28",
    usedCount: 67,
  },
];

export default function BrandTemplatePage() {
  const [templates, setTemplates] = useState<BrandTemplate[]>(sampleTemplates);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All Templates");
  const [selectedTemplate, setSelectedTemplate] = useState<BrandTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "All Templates" || template.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleApplyTemplate = async (template: BrandTemplate) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    alert(`Template "${template.name}" applied successfully!`);
  };

  const handleDuplicate = (template: BrandTemplate) => {
    const newTemplate: BrandTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      createdAt: new Date().toISOString().split('T')[0],
      usedCount: 0,
    };
    setTemplates([newTemplate, ...templates]);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this template?")) {
      setTemplates(templates.filter(t => t.id !== id));
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "12px",
          marginBottom: "8px"
        }}>
          <div style={{
            width: "40px",
            height: "40px",
            backgroundColor: "rgba(168, 85, 247, 0.1)",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <Palette size={20} style={{ color: "#a855f7" }} />
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: "bold" }}>Brand Templates</h1>
        </div>
        <p style={{ color: "var(--text-secondary)", fontSize: "15px" }}>
          Create and manage your brand templates for consistent video branding
        </p>
      </div>

      {/* Quick Stats */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(4, 1fr)", 
        gap: "16px",
        marginBottom: "32px"
      }}>
        <div style={{
          padding: "20px",
          backgroundColor: "var(--surface)",
          borderRadius: "12px",
          border: "1px solid var(--border)"
        }}>
          <div style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "4px" }}>{templates.length}</div>
          <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Total Templates</div>
        </div>
        <div style={{
          padding: "20px",
          backgroundColor: "var(--surface)",
          borderRadius: "12px",
          border: "1px solid var(--border)"
        }}>
          <div style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "4px" }}>
            {templates.reduce((acc, t) => acc + t.usedCount, 0)}
          </div>
          <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Total Uses</div>
        </div>
        <div style={{
          padding: "20px",
          backgroundColor: "var(--surface)",
          borderRadius: "12px",
          border: "1px solid var(--border)"
        }}>
          <div style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "4px" }}>6</div>
          <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Template Types</div>
        </div>
        <div style={{
          padding: "20px",
          backgroundColor: "var(--surface)",
          borderRadius: "12px",
          border: "1px solid var(--border)"
        }}>
          <div style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "4px" }}>2</div>
          <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Brand Colors</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "24px" }}>
        {/* Sidebar */}
        <div style={{
          padding: "20px",
          backgroundColor: "var(--surface)",
          borderRadius: "12px",
          border: "1px solid var(--border)",
          height: "fit-content"
        }}>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              backgroundColor: "var(--primary)",
              color: "white",
              padding: "12px 16px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 600,
              marginBottom: "24px"
            }}
          >
            <Plus size={18} />
            Create Template
          </button>

          <div style={{ marginBottom: "16px" }}>
            <div style={{ 
              display: "flex", 
              alignItems: "center",
              backgroundColor: "var(--background)",
              borderRadius: "8px",
              padding: "8px 12px",
              border: "1px solid var(--border)"
            }}>
              <Search size={16} style={{ color: "var(--text-secondary)", marginRight: "8px" }} />
              <input 
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontSize: "14px",
                  width: "100%"
                }}
              />
            </div>
          </div>

          <div>
            {templateTypes.map((type, index) => (
              <button
                key={index}
                onClick={() => setSelectedType(type.name)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: selectedType === type.name ? "rgba(168, 85, 247, 0.1)" : "transparent",
                  color: selectedType === type.name ? "#a855f7" : "var(--text-primary)",
                  marginBottom: "4px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <type.icon size={16} />
                  <span style={{ fontSize: "14px" }}>{type.name}</span>
                </div>
                <span style={{ fontSize: "12px", opacity: 0.7 }}>{type.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div>
          {filteredTemplates.length === 0 ? (
            <div style={{
              padding: "60px",
              textAlign: "center",
              backgroundColor: "var(--surface)",
              borderRadius: "12px",
              border: "1px solid var(--border)"
            }}>
              <Palette size={48} style={{ color: "var(--text-secondary)", marginBottom: "16px", opacity: 0.5 }} />
              <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>No templates found</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "24px" }}>
                {searchQuery ? "Try adjusting your search" : "Create your first brand template"}
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "var(--primary)",
                  color: "white",
                  padding: "12px 24px",
                  borderRadius: "10px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 600
                }}
              >
                <Plus size={18} />
                Create Template
              </button>
            </div>
          ) : (
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(3, 1fr)", 
              gap: "20px"
            }}>
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  style={{
                    backgroundColor: "var(--surface)",
                    borderRadius: "12px",
                    border: "1px solid var(--border)",
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    position: "relative"
                  }}
                >
                  <div style={{
                    height: "140px",
                    backgroundColor: "var(--background)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative"
                  }}>
                    <Layout size={40} style={{ color: "var(--text-secondary)", opacity: 0.3 }} />
                    <div style={{
                      position: "absolute",
                      top: "8px",
                      left: "8px",
                      backgroundColor: "rgba(0,0,0,0.6)",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "11px",
                      color: "white"
                    }}>
                      {template.type}
                    </div>
                  </div>

                  <div style={{ padding: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                      <h3 style={{ fontSize: "15px", fontWeight: 600 }}>{template.name}</h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTemplate(selectedTemplate?.id === template.id ? null : template);
                        }}
                        style={{
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          padding: "4px",
                          color: "var(--text-secondary)"
                        }}
                      >
                        <MoreVertical size={16} />
                      </button>
                    </div>
                    
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                      <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                        Created {template.createdAt}
                      </span>
                      <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                        Used {template.usedCount} times
                      </span>
                    </div>

                    <button
                      onClick={() => handleApplyTemplate(template)}
                      disabled={isLoading}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        backgroundColor: "var(--primary)",
                        color: "white",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "none",
                        cursor: isLoading ? "not-allowed" : "pointer",
                        opacity: isLoading ? 0.7 : 1,
                        fontSize: "13px",
                        fontWeight: 600
                      }}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Applying...
                        </>
                      ) : (
                        <>
                          <Zap size={16} />
                          Apply Template
                        </>
                      )}
                    </button>
                  </div>

                  {selectedTemplate?.id === template.id && (
                    <div style={{
                      position: "absolute",
                      right: "16px",
                      top: "156px",
                      backgroundColor: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      padding: "8px 0",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      zIndex: 10
                    }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicate(template);
                          setSelectedTemplate(null);
                        }}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "10px 16px",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "13px",
                          color: "var(--text-primary)"
                        }}
                      >
                        <Copy size={14} />
                        Duplicate
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTemplate(null);
                        }}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "10px 16px",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "13px",
                          color: "var(--text-primary)"
                        }}
                      >
                        <Edit2 size={14} />
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(template.id);
                          setSelectedTemplate(null);
                        }}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "10px 16px",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "13px",
                          color: "#ef4444"
                        }}
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 50
        }}>
          <div style={{
            backgroundColor: "var(--surface)",
            borderRadius: "16px",
            padding: "32px",
            width: "500px",
            maxWidth: "90%"
          }}>
            <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "24px" }}>
              Create New Template
            </h2>
            
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: 500, marginBottom: "8px" }}>
                Template Name
              </label>
              <input 
                type="text"
                placeholder="Enter template name..."
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--background)",
                  fontSize: "14px"
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: 500, marginBottom: "8px" }}>
                Template Type
              </label>
              <select
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--background)",
                  fontSize: "14px"
                }}
              >
                <option value="">Select type...</option>
                {templateTypes.slice(1).map((type, index) => (
                  <option key={index} value={type.name}>{type.name}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: 500, marginBottom: "8px" }}>
                Description (Optional)
              </label>
              <textarea
                placeholder="Describe your template..."
                rows={3}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--background)",
                  fontSize: "14px",
                  resize: "none"
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{
                  padding: "12px 24px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  backgroundColor: "transparent",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 500
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  alert("Template created successfully!");
                }}
                style={{
                  padding: "12px 24px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "var(--primary)",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 600
                }}
              >
                Create Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
