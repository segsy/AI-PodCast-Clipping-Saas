"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Filter, Plus, Edit, Trash2, Eye, MoreVertical } from "lucide-react";

interface CMSResource {
  id: string;
  title: string;
  slug: string;
  type: "BLOG" | "CUSTOMER_STORY" | "LEARNING" | "HELP" | "CHANGELOG";
  status: "DRAFT" | "PUBLISHED" | "SCHEDULED";
  excerpt: string | null;
  tags: string[];
  authorName: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    name: string;
    email: string;
  };
}

export default function CMSResourcesPage() {
  const [resources, setResources] = useState<CMSResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch resources
  const fetchResources = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        ...(searchQuery && { search: searchQuery }),
        ...(typeFilter !== "all" && { type: typeFilter }),
        ...(statusFilter !== "all" && { status: statusFilter }),
      });

      const response = await fetch(`/api/admin/cms/resources?${params}`);
      if (!response.ok) throw new Error("Failed to fetch resources");

      const data = await response.json();
      setResources(data.resources);
      setTotalPages(data.pagination.totalPages);
    } catch (err: any) {
      setError(err.message || "Failed to fetch resources");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [page]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchResources();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, typeFilter, statusFilter]);

  // Handle delete resource
  const handleDeleteResource = async (resourceId: string) => {
    if (!confirm("Are you sure you want to delete this resource?")) return;

    try {
      const response = await fetch(`/api/admin/cms/resources/${resourceId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete resource");

      fetchResources();
    } catch (err: any) {
      alert(err.message || "Failed to delete resource");
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-green-100 text-green-800";
      case "SCHEDULED":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "BLOG":
        return "bg-purple-100 text-purple-800";
      case "CUSTOMER_STORY":
        return "bg-indigo-100 text-indigo-800";
      case "LEARNING":
        return "bg-blue-100 text-blue-800";
      case "HELP":
        return "bg-green-100 text-green-800";
      case "CHANGELOG":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Page header */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Resources</h1>
            <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>
              Manage your blog posts, case studies, and other content resources
            </p>
          </div>
          <Link href="/admin/cms/resources/new">
            <button
              style={{
                backgroundColor: "var(--primary)",
                color: "white",
                padding: "8px 16px",
                borderRadius: "8px",
                fontWeight: 500,
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <Plus size={18} />
              New Resource
            </button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div style={{
        backgroundColor: "var(--surface)",
        borderRadius: "12px",
        border: "1px solid var(--border)",
        padding: "24px"
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <div style={{ position: "relative", flex: 1 }}>
              <Search style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} size={20} />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 16px 8px 40px",
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "white"
                }}
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              style={{
                padding: "8px 16px",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                color: "white"
              }}
            >
              <option value="all">All Types</option>
              <option value="BLOG">Blog</option>
              <option value="CUSTOMER_STORY">Customer Story</option>
              <option value="LEARNING">Learning</option>
              <option value="HELP">Help</option>
              <option value="CHANGELOG">Changelog</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: "8px 16px",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                color: "white"
              }}
            >
              <option value="all">All Status</option>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="SCHEDULED">Scheduled</option>
            </select>
          </div>
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

      {/* Resources table */}
      <div style={{
        backgroundColor: "var(--surface)",
        borderRadius: "12px",
        border: "1px solid var(--border)",
        overflow: "hidden"
      }}>
        {loading ? (
          <div style={{ padding: "48px", textAlign: "center" }}>
            <div style={{ fontSize: "18px", marginBottom: "8px" }}>Loading resources...</div>
          </div>
        ) : resources.length === 0 ? (
          <div style={{ padding: "48px", textAlign: "center" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📝</div>
            <h3 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "8px" }}>No resources found</h3>
            <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>
              Get started by creating your first resource.
            </p>
            <Link href="/admin/cms/resources/new">
              <button
                style={{
                  backgroundColor: "var(--primary)",
                  color: "white",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 500
                }}
              >
                Create Resource
              </button>
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ backgroundColor: "var(--surface-hover)" }}>
                <tr>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: "600", color: "var(--text-secondary)" }}>Title</th>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: "600", color: "var(--text-secondary)" }}>Type</th>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: "600", color: "var(--text-secondary)" }}>Status</th>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: "600", color: "var(--text-secondary)" }}>Tags</th>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: "600", color: "var(--text-secondary)" }}>Published</th>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: "600", color: "var(--text-secondary)" }}>Updated</th>
                  <th style={{ padding: "16px", textAlign: "center", fontWeight: "600", color: "var(--text-secondary)" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {resources.map((resource) => (
                  <tr key={resource.id} style={{ borderTop: "1px solid var(--border)" }}>
                    <td style={{ padding: "16px" }}>
                      <div style={{ fontWeight: "500" }}>{resource.title}</div>
                      {resource.excerpt && (
                        <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px", maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {resource.excerpt}
                        </div>
                      )}
                      {resource.createdBy && (
                        <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>
                          by {resource.createdBy.name}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "16px" }}>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(resource.type)}`}>
                        {resource.type.replace("_", " ")}
                      </span>
                    </td>
                    <td style={{ padding: "16px" }}>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(resource.status)}`}>
                        {resource.status}
                      </span>
                    </td>
                    <td style={{ padding: "16px" }}>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                        {resource.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} style={{
                            padding: "2px 6px",
                            backgroundColor: "var(--surface-hover)",
                            borderRadius: "4px",
                            fontSize: "11px",
                            color: "var(--text-secondary)"
                          }}>
                            {tag}
                          </span>
                        ))}
                        {resource.tags.length > 3 && (
                          <span style={{
                            padding: "2px 6px",
                            backgroundColor: "var(--surface-hover)",
                            borderRadius: "4px",
                            fontSize: "11px",
                            color: "var(--text-secondary)"
                          }}>
                            +{resource.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: "16px", color: "var(--text-secondary)" }}>
                      {resource.publishedAt ? formatDate(resource.publishedAt) : "-"}
                    </td>
                    <td style={{ padding: "16px", color: "var(--text-secondary)" }}>
                      {formatDate(resource.updatedAt)}
                    </td>
                    <td style={{ padding: "16px", textAlign: "center" }}>
                      <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                        <Link href={`/admin/cms/resources/${resource.id}/edit`}>
                          <button
                            style={{
                              backgroundColor: "var(--surface-hover)",
                              border: "1px solid var(--border)",
                              borderRadius: "4px",
                              padding: "6px",
                              cursor: "pointer"
                            }}
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDeleteResource(resource.id)}
                          style={{
                            backgroundColor: "#fee2e2",
                            border: "1px solid #fca5a5",
                            borderRadius: "4px",
                            padding: "6px",
                            cursor: "pointer"
                          }}
                          title="Delete"
                        >
                          <Trash2 size={16} style={{ color: "#dc2626" }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{
              padding: "8px 16px",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              backgroundColor: page === 1 ? "var(--surface)" : "var(--primary)",
              color: page === 1 ? "var(--text-secondary)" : "white",
              cursor: page === 1 ? "not-allowed" : "pointer"
            }}
          >
            Previous
          </button>
          <span style={{ padding: "8px 16px", color: "var(--text-secondary)" }}>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{
              padding: "8px 16px",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              backgroundColor: page === totalPages ? "var(--surface)" : "var(--primary)",
              color: page === totalPages ? "var(--text-secondary)" : "white",
              cursor: page === totalPages ? "not-allowed" : "pointer"
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}