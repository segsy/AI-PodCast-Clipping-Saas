"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { Editor } from "@tinymce/tinymce-react";

export default function NewResourcePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    type: "BLOG" as "BLOG" | "CUSTOMER_STORY" | "LEARNING" | "HELP" | "CHANGELOG",
    title: "",
    slug: "",
    status: "DRAFT" as "DRAFT" | "PUBLISHED" | "SCHEDULED",
    excerpt: "",
    coverS3Key: "",
    body: "",
    tags: [] as string[],
    authorName: "",
    publishedAt: "",
    seo: {
      title: "",
      description: "",
      keywords: [] as string[],
    },
  });

  const [tagInput, setTagInput] = useState("");
  const [seoKeywordInput, setSeoKeywordInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.slug) {
      setError("Title and slug are required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const submitData = {
        ...formData,
        publishedAt: formData.publishedAt ? new Date(formData.publishedAt).toISOString() : null,
        body: { content: formData.body },
        tags: formData.tags,
        seo: {
          ...formData.seo,
          keywords: formData.seo.keywords,
        },
      };

      const response = await fetch("/api/admin/cms/resources", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create resource");
      }

      router.push("/admin/cms/resources");
    } catch (err: any) {
      setError(err.message || "Failed to create resource");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddSeoKeyword = () => {
    if (seoKeywordInput.trim() && !formData.seo.keywords.includes(seoKeywordInput.trim())) {
      setFormData(prev => ({
        ...prev,
        seo: {
          ...prev.seo,
          keywords: [...prev.seo.keywords, seoKeywordInput.trim()]
        }
      }));
      setSeoKeywordInput("");
    }
  };

  const handleRemoveSeoKeyword = (keywordToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      seo: {
        ...prev.seo,
        keywords: prev.seo.keywords.filter(keyword => keyword !== keywordToRemove)
      }
    }));
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setFormData(prev => ({ ...prev, slug }));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <Link href="/admin/cms/resources">
          <button
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              padding: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <ArrowLeft size={20} />
          </button>
        </Link>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Create New Resource</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>
            Add a new content resource to your CMS
          </p>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div style={{
          backgroundColor: "#fee2e2",
          border: "1px solid #fca5a5",
          borderRadius: "8px",
          padding: "16px",
          color: "#dc2626"
        }}>
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Basic Information */}
        <div style={{
          backgroundColor: "var(--surface)",
          borderRadius: "12px",
          border: "1px solid var(--border)",
          padding: "24px"
        }}>
          <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "16px" }}>Basic Information</h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontWeight: "500", marginBottom: "8px" }}>
                Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "white"
                }}
                required
              >
                <option value="BLOG">Blog Post</option>
                <option value="CUSTOMER_STORY">Customer Story</option>
                <option value="LEARNING">Learning</option>
                <option value="HELP">Help Article</option>
                <option value="CHANGELOG">Changelog</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontWeight: "500", marginBottom: "8px" }}>
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "white"
                }}
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="SCHEDULED">Scheduled</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: "16px" }}>
            <label style={{ display: "block", fontWeight: "500", marginBottom: "8px" }}>
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              style={{
                width: "100%",
                padding: "8px 12px",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                color: "white"
              }}
              required
            />
          </div>

          <div style={{ marginTop: "16px", display: "flex", gap: "8px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", fontWeight: "500", marginBottom: "8px" }}>
                Slug *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "white"
                }}
                required
              />
            </div>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button
                type="button"
                onClick={generateSlug}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "var(--surface-hover)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "14px"
                }}
              >
                Generate
              </button>
            </div>
          </div>

          <div style={{ marginTop: "16px" }}>
            <label style={{ display: "block", fontWeight: "500", marginBottom: "8px" }}>
              Excerpt
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              rows={3}
              style={{
                width: "100%",
                padding: "8px 12px",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                color: "white",
                resize: "vertical"
              }}
            />
          </div>

          <div style={{ marginTop: "16px" }}>
            <label style={{ display: "block", fontWeight: "500", marginBottom: "8px" }}>
              Author Name
            </label>
            <input
              type="text"
              value={formData.authorName}
              onChange={(e) => setFormData(prev => ({ ...prev, authorName: e.target.value }))}
              style={{
                width: "100%",
                padding: "8px 12px",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                color: "white"
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div style={{
          backgroundColor: "var(--surface)",
          borderRadius: "12px",
          border: "1px solid var(--border)",
          padding: "24px"
        }}>
          <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "16px" }}>Content</h3>

          <div>
            <label style={{ display: "block", fontWeight: "500", marginBottom: "8px" }}>
              Body Content
            </label>
            <Editor
              apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
              value={formData.body}
              onEditorChange={(content) => {
                setFormData(prev => ({ ...prev, body: content }));
              }}
              init={{
                height: 500,
                menubar: true,
                plugins: [
                  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                  'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                  'insertdatetime', 'media', 'table', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | blocks | ' +
                  'bold italic backcolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat | help',
                content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; font-size: 14px; color: #000; }',
                skin: 'oxide-dark',
                content_css: 'dark'
              }}
            />
          </div>
        </div>

        {/* Tags */}
        <div style={{
          backgroundColor: "var(--surface)",
          borderRadius: "12px",
          border: "1px solid var(--border)",
          padding: "24px"
        }}>
          <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "16px" }}>Tags</h3>

          <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              placeholder="Add a tag"
              style={{
                flex: 1,
                padding: "8px 12px",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                color: "white"
              }}
            />
            <button
              type="button"
              onClick={handleAddTag}
              style={{
                padding: "8px 16px",
                backgroundColor: "var(--primary)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer"
              }}
            >
              Add
            </button>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "4px 8px",
                  backgroundColor: "var(--primary)",
                  color: "white",
                  borderRadius: "4px",
                  fontSize: "12px"
                }}
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "white",
                    cursor: "pointer",
                    fontSize: "16px",
                    lineHeight: 1
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* SEO */}
        <div style={{
          backgroundColor: "var(--surface)",
          borderRadius: "12px",
          border: "1px solid var(--border)",
          padding: "24px"
        }}>
          <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "16px" }}>SEO Settings</h3>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontWeight: "500", marginBottom: "8px" }}>
              SEO Title
            </label>
            <input
              type="text"
              value={formData.seo.title}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                seo: { ...prev.seo, title: e.target.value }
              }))}
              style={{
                width: "100%",
                padding: "8px 12px",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                color: "white"
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontWeight: "500", marginBottom: "8px" }}>
              SEO Description
            </label>
            <textarea
              value={formData.seo.description}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                seo: { ...prev.seo, description: e.target.value }
              }))}
              rows={3}
              style={{
                width: "100%",
                padding: "8px 12px",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                color: "white",
                resize: "vertical"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontWeight: "500", marginBottom: "8px" }}>
              SEO Keywords
            </label>
            <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
              <input
                type="text"
                value={seoKeywordInput}
                onChange={(e) => setSeoKeywordInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSeoKeyword())}
                placeholder="Add a keyword"
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "white"
                }}
              />
              <button
                type="button"
                onClick={handleAddSeoKeyword}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "var(--primary)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer"
                }}
              >
                Add
              </button>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {formData.seo.keywords.map((keyword, index) => (
                <span
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "4px 8px",
                    backgroundColor: "var(--primary)",
                    color: "white",
                    borderRadius: "4px",
                    fontSize: "12px"
                  }}
                >
                  {keyword}
                  <button
                    type="button"
                    onClick={() => handleRemoveSeoKeyword(keyword)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "white",
                      cursor: "pointer",
                      fontSize: "16px",
                      lineHeight: 1
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Publish Settings */}
        <div style={{
          backgroundColor: "var(--surface)",
          borderRadius: "12px",
          border: "1px solid var(--border)",
          padding: "24px"
        }}>
          <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "16px" }}>Publish Settings</h3>

          <div>
            <label style={{ display: "block", fontWeight: "500", marginBottom: "8px" }}>
              Publish Date (leave empty for immediate publishing when status is set to Published)
            </label>
            <input
              type="datetime-local"
              value={formData.publishedAt}
              onChange={(e) => setFormData(prev => ({ ...prev, publishedAt: e.target.value }))}
              style={{
                width: "100%",
                padding: "8px 12px",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                color: "white"
              }}
            />
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
          <Link href="/admin/cms/resources">
            <button
              type="button"
              style={{
                padding: "12px 24px",
                backgroundColor: "var(--surface)",
                color: "white",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                cursor: "pointer"
              }}
            >
              Cancel
            </button>
          </Link>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "12px 24px",
              backgroundColor: "var(--primary)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.5 : 1,
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save size={18} />
                Create Resource
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}