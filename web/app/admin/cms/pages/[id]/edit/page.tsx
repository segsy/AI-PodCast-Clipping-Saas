"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { Editor } from "@tinymce/tinymce-react";

interface CMSPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: "DRAFT" | "PUBLISHED" | "SCHEDULED";
  publishedAt: string | null;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  visibility: {
    isPublic: boolean;
    requiresAuth: boolean;
  };
}

export default function EditPagePage() {
  const router = useRouter();
  const params = useParams();
  const pageId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    status: "DRAFT" as "DRAFT" | "PUBLISHED" | "SCHEDULED",
    publishedAt: "",
    seo: {
      title: "",
      description: "",
      keywords: [] as string[],
    },
    visibility: {
      isPublic: true,
      requiresAuth: false,
    },
  });

  const [seoKeywordInput, setSeoKeywordInput] = useState("");

  // Fetch page data
  useEffect(() => {
    const fetchPage = async () => {
      try {
        setFetchLoading(true);
        const response = await fetch(`/api/admin/cms/pages/${pageId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch page");
        }

        const page: CMSPage = await response.json();

        setFormData({
          title: page.title,
          slug: page.slug,
          content: page.content || "",
          status: page.status,
          publishedAt: page.publishedAt ? new Date(page.publishedAt).toISOString().slice(0, 16) : "",
          seo: {
            title: page.seo?.title || "",
            description: page.seo?.description || "",
            keywords: page.seo?.keywords || [],
          },
          visibility: {
            isPublic: page.visibility?.isPublic ?? true,
            requiresAuth: page.visibility?.requiresAuth ?? false,
          },
        });
      } catch (err: any) {
        setError(err.message || "Failed to fetch page");
      } finally {
        setFetchLoading(false);
      }
    };

    if (pageId) {
      fetchPage();
    }
  }, [pageId]);

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
        seo: {
          ...formData.seo,
          keywords: formData.seo.keywords,
        },
      };

      const response = await fetch(`/api/admin/cms/pages/${pageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update page");
      }

      router.push("/admin/cms/pages");
    } catch (err: any) {
      setError(err.message || "Failed to update page");
    } finally {
      setLoading(false);
    }
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

  if (fetchLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
        <div style={{ fontSize: "18px" }}>Loading page...</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <Link href="/admin/cms/pages">
          <button
            style={{
              backgroundColor: "var(--surface-hover)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              padding: "8px",
              cursor: "pointer"
            }}
          >
            <ArrowLeft size={20} />
          </button>
        </Link>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Edit Page</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>
            Update page information
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
          <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>Basic Information</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
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
                placeholder="Enter page title"
                required
              />
            </div>
            <div>
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
                placeholder="enter-page-slug"
                required
              />
            </div>
            <div>
              <label style={{ display: "block", fontWeight: "500", marginBottom: "8px" }}>
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                style={{
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
            {formData.status === "SCHEDULED" && (
              <div>
                <label style={{ display: "block", fontWeight: "500", marginBottom: "8px" }}>
                  Publish Date
                </label>
                <input
                  type="datetime-local"
                  value={formData.publishedAt}
                  onChange={(e) => setFormData(prev => ({ ...prev, publishedAt: e.target.value }))}
                  style={{
                    padding: "8px 12px",
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "white"
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div style={{
          backgroundColor: "var(--surface)",
          borderRadius: "12px",
          border: "1px solid var(--border)",
          padding: "24px"
        }}>
          <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>Content</h2>
          <Editor
            apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
            value={formData.content}
            disabled={false}
            onEditorChange={(content) => setFormData(prev => ({ ...prev, content }))}
            init={{
              height: 500,
              menubar: true,
              plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
              ],
              toolbar: 'undo redo | blocks | ' +
                'bold italic forecolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | help',
              content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
            }}
          />
        </div>

        {/* SEO Settings */}
        <div style={{
          backgroundColor: "var(--surface)",
          borderRadius: "12px",
          border: "1px solid var(--border)",
          padding: "24px"
        }}>
          <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>SEO Settings</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
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
                placeholder="SEO title"
              />
            </div>
            <div>
              <label style={{ display: "block", fontWeight: "500", marginBottom: "8px" }}>
                SEO Description
              </label>
              <textarea
                value={formData.seo.description}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  seo: { ...prev.seo, description: e.target.value }
                }))}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "white",
                  minHeight: "80px",
                  resize: "vertical"
                }}
                placeholder="SEO description"
              />
            </div>
            <div>
              <label style={{ display: "block", fontWeight: "500", marginBottom: "8px" }}>
                Keywords
              </label>
              <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                <input
                  type="text"
                  value={seoKeywordInput}
                  onChange={(e) => setSeoKeywordInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSeoKeyword())}
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "white"
                  }}
                  placeholder="Add keyword"
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
                {formData.seo.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "4px 8px",
                      backgroundColor: "var(--surface-hover)",
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
                        color: "var(--text-secondary)",
                        cursor: "pointer",
                        padding: "0",
                        fontSize: "14px"
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Visibility Settings */}
        <div style={{
          backgroundColor: "var(--surface)",
          borderRadius: "12px",
          border: "1px solid var(--border)",
          padding: "24px"
        }}>
          <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>Visibility Settings</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="checkbox"
                id="isPublic"
                checked={formData.visibility.isPublic}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  visibility: { ...prev.visibility, isPublic: e.target.checked }
                }))}
              />
              <label htmlFor="isPublic" style={{ fontWeight: "500" }}>
                Public Page
              </label>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="checkbox"
                id="requiresAuth"
                checked={formData.visibility.requiresAuth}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  visibility: { ...prev.visibility, requiresAuth: e.target.checked }
                }))}
              />
              <label htmlFor="requiresAuth" style={{ fontWeight: "500" }}>
                Requires Authentication
              </label>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 24px",
              backgroundColor: "var(--primary)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: 500,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Update Page
          </button>
          <Link href="/admin/cms/pages">
            <button
              type="button"
              style={{
                padding: "12px 24px",
                backgroundColor: "var(--surface)",
                color: "white",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                fontWeight: 500,
                cursor: "pointer"
              }}
            >
              Cancel
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
}