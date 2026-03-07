"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Palette, 
  Layout, 
  Zap, 
  Sparkles,
  Trash2, 
  Edit, 
  MoreVertical,
  Check,
  X,
  Loader2,
  Settings
} from "lucide-react";

interface BrandTemplate {
  id: string;
  name: string;
  config: Record<string, any>;
  isDefault: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function BrandTemplateDashboard() {
  const [templates, setTemplates] = useState<BrandTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<BrandTemplate | null>(null);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/brand-templates");
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates || []);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = async () => {
    if (!newTemplateName.trim()) return;

    setSaving(true);
    try {
      const response = await fetch("/api/brand-templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newTemplateName,
          config: {
            colors: {
              primary: "#6366f1",
              secondary: "#8b5cf6",
            },
            fonts: {
              heading: "Inter",
              body: "Inter",
            },
            logo: null,
          },
          isDefault: templates.length === 0,
        }),
      });

      if (response.ok) {
        setShowCreateModal(false);
        setNewTemplateName("");
        fetchTemplates();
      }
    } catch (error) {
      console.error("Error creating template:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm("Are you sure you want to delete this template?")) return;

    try {
      const response = await fetch(`/api/brand-templates?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchTemplates();
      }
    } catch (error) {
      console.error("Error deleting template:", error);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const response = await fetch("/api/brand-templates", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          isDefault: true,
          workspaceId: "demo-workspace",
        }),
      });

      if (response.ok) {
        fetchTemplates();
      }
    } catch (error) {
      console.error("Error setting default template:", error);
    }
  };

  const defaultTemplate = templates.find(t => t.isDefault);
  const totalTemplates = templates.length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Page header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>Brand Templates</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>
            Create and manage your brand templates for consistent video branding
          </p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 20px",
            backgroundColor: "var(--primary)",
            border: "none",
            borderRadius: "8px",
            color: "white",
            fontWeight: 500,
            cursor: "pointer"
          }}
        >
          <Plus size={18} />
          Create Template
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
        <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "40px", height: "40px", backgroundColor: "var(--primary)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Layout size={20} style={{ color: "white" }} />
            </div>
            <div>
              <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Total Templates</p>
              <p style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>{totalTemplates}</p>
            </div>
          </div>
        </div>
        <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "40px", height: "40px", backgroundColor: "var(--success)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Check size={20} style={{ color: "white" }} />
            </div>
            <div>
              <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Default Template</p>
              <p style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>
                {defaultTemplate?.name || "None"}
              </p>
            </div>
          </div>
        </div>
        <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "40px", height: "40px", backgroundColor: "#a855f7", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Sparkles size={20} style={{ color: "white" }} />
            </div>
            <div>
              <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Customization</p>
              <p style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>Unlimited</p>
            </div>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "60px" }}>
          <Loader2 size={32} className="animate-spin" style={{ color: "var(--primary)" }} />
        </div>
      ) : templates.length === 0 ? (
        <div style={{ 
          backgroundColor: "var(--surface)", 
          borderRadius: "12px", 
          border: "1px solid var(--border)", 
          padding: "60px",
          textAlign: "center"
        }}>
          <Palette size={48} style={{ color: "var(--text-muted)", marginBottom: "16px" }} />
          <h3 style={{ fontSize: "18px", fontWeight: "600", color: "white", marginBottom: "8px" }}>
            No brand templates yet
          </h3>
          <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>
            Create your first brand template to maintain consistent branding across all videos
          </p>
          <button 
            onClick={() => setShowCreateModal(true)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              backgroundColor: "var(--primary)",
              border: "none",
              borderRadius: "8px",
              color: "white",
              fontWeight: 500,
              cursor: "pointer"
            }}
          >
            <Plus size={18} />
            Create Template
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
          {templates.map((template) => (
            <div 
              key={template.id}
              style={{ 
                backgroundColor: "var(--surface)", 
                borderRadius: "12px", 
                border: "1px solid var(--border)",
                padding: "20px",
                position: "relative"
              }}
            >
              {/* Default Badge */}
              {template.isDefault && (
                <div style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  backgroundColor: "var(--primary)",
                  color: "white",
                  fontSize: "10px",
                  fontWeight: "600",
                  padding: "4px 8px",
                  borderRadius: "4px",
                }}>
                  DEFAULT
                </div>
              )}

              {/* Template Preview */}
              <div style={{
                height: "120px",
                backgroundColor: "var(--background)",
                borderRadius: "8px",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden"
              }}>
                {template.config?.colors?.primary ? (
                  <div style={{
                    width: "100%",
                    height: "100%",
                    background: `linear-gradient(135deg, ${template.config.colors.primary} 0%, ${template.config.colors.secondary || template.config.colors.primary} 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <Palette size={40} style={{ color: "white", opacity: 0.8 }} />
                  </div>
                ) : (
                  <Palette size={40} style={{ color: "var(--text-muted)" }} />
                )}
              </div>

              {/* Template Info */}
              <h3 style={{ fontSize: "16px", fontWeight: "600", color: "white", marginBottom: "4px" }}>
                {template.name}
              </h3>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "16px" }}>
                Created {new Date(template.createdAt).toLocaleDateString()}
              </p>

              {/* Actions */}
              <div style={{ display: "flex", gap: "8px" }}>
                {!template.isDefault && (
                  <button
                    onClick={() => handleSetDefault(template.id)}
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      padding: "8px",
                      backgroundColor: "var(--primary)",
                      border: "none",
                      borderRadius: "6px",
                      color: "white",
                      fontSize: "13px",
                      fontWeight: 500,
                      cursor: "pointer"
                    }}
                  >
                    <Zap size={14} />
                    Set Default
                  </button>
                )}
                <button
                  onClick={() => handleDeleteTemplate(template.id)}
                  style={{
                    padding: "8px",
                    backgroundColor: "transparent",
                    border: "1px solid var(--error)",
                    borderRadius: "6px",
                    color: "var(--error)",
                    cursor: "pointer"
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowCreateModal(false)}
          />
          <div className="relative w-full max-w-md mx-4 bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-bold text-white">Create Brand Template</h2>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-text-secondary" />
              </button>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Template Name
              </label>
              <input
                type="text"
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
                placeholder="Enter template name..."
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white placeholder-text-muted focus:outline-none focus:border-primary"
              />
              <p className="text-xs text-text-muted mt-2">
                You can customize colors, fonts, and other branding elements after creation
              </p>
              <button
                onClick={handleCreateTemplate}
                disabled={saving || !newTemplateName.trim()}
                className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    Create Template
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
