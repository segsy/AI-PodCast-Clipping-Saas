"use client";

import { useState } from "react";
import { 
  Upload, 
  Film, 
  Trash2, 
  MoreVertical, 
  Play, 
  Pause,
  CheckCircle,
  AlertCircle,
  Clock,
  Search,
  Filter,
  FolderOpen,
  Plus,
  X,
  Video
} from "lucide-react";

const uploads = [
  { 
    id: 1, 
    title: "Podcast Episode 45 - Growth Tips", 
    duration: "45:30", 
    size: "1.2 GB",
    progress: 100,
    status: "completed",
    uploadedAt: "2 hours ago",
    thumbnail: null
  },
  { 
    id: 2, 
    title: "Interview with Sarah Johnson", 
    duration: "32:15", 
    size: "850 MB",
    progress: 100,
    status: "completed",
    uploadedAt: "5 hours ago",
    thumbnail: null
  },
  { 
    id: 3, 
    title: "Q&A Session #12", 
    duration: "28:45", 
    size: "720 MB",
    progress: 65,
    status: "uploading",
    uploadedAt: "In progress",
    thumbnail: null
  },
  { 
    id: 4, 
    title: "Marketing Deep Dive", 
    duration: "55:20", 
    size: "1.5 GB",
    progress: 100,
    status: "completed",
    uploadedAt: "1 day ago",
    thumbnail: null
  },
  { 
    id: 5, 
    title: "Behind the Scenes", 
    duration: "18:30", 
    size: "450 MB",
    progress: 100,
    status: "completed",
    uploadedAt: "2 days ago",
    thumbnail: null
  },
  { 
    id: 6, 
    title: "Guest Interview - John", 
    duration: "42:10", 
    size: "1.1 GB",
    progress: 0,
    status: "failed",
    uploadedAt: "3 days ago",
    thumbnail: null
  },
  { 
    id: 7, 
    title: "Weekly Recap", 
    duration: "15:45", 
    size: "380 MB",
    progress: 0,
    status: "queued",
    uploadedAt: "Pending",
    thumbnail: null
  },
];

const statusColors: Record<string, string> = {
  completed: "var(--success)",
  uploading: "var(--primary)",
  failed: "var(--error)",
  queued: "var(--warning)",
};

export default function UploadsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showUploadModal, setShowUploadModal] = useState(false);

  const filteredUploads = uploads.filter(upload => {
    const matchesSearch = upload.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || upload.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const completedCount = uploads.filter(u => u.status === "completed").length;
  const uploadingCount = uploads.filter(u => u.status === "uploading").length;
  const totalSize = uploads.reduce((acc, u) => acc + parseFloat(u.size), 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Page header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>Uploads</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>Manage your video uploads</p>
        </div>
        <button 
          onClick={() => setShowUploadModal(true)}
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
          Upload Video
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
        <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "40px", height: "40px", backgroundColor: "var(--primary)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Upload size={20} style={{ color: "white" }} />
            </div>
            <div>
              <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Total Uploads</p>
              <p style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>{uploads.length}</p>
            </div>
          </div>
        </div>
        <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "40px", height: "40px", backgroundColor: "var(--success)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CheckCircle size={20} style={{ color: "white" }} />
            </div>
            <div>
              <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Completed</p>
              <p style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>{completedCount}</p>
            </div>
          </div>
        </div>
        <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "40px", height: "40px", backgroundColor: "var(--primary)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Clock size={20} style={{ color: "white" }} />
            </div>
            <div>
              <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Uploading</p>
              <p style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>{uploadingCount}</p>
            </div>
          </div>
        </div>
        <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "40px", height: "40px", backgroundColor: "var(--accent)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FolderOpen size={20} style={{ color: "white" }} />
            </div>
            <div>
              <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Total Size</p>
              <p style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>{totalSize.toFixed(1)} GB</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <div style={{ position: "relative", flex: "1", maxWidth: "400px" }}>
          <Search 
            size={18} 
            style={{ 
              position: "absolute", 
              left: "12px", 
              top: "50%", 
              transform: "translateY(-50%)",
              color: "var(--text-muted)" 
            }} 
          />
          <input
            type="text"
            placeholder="Search uploads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px 10px 40px",
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              color: "white",
              fontSize: "14px"
            }}
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: "10px 12px",
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            color: "white",
            fontSize: "14px"
          }}
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="uploading">Uploading</option>
          <option value="queued">Queued</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Uploads List */}
      <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {filteredUploads.map((upload) => (
            <div
              key={upload.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 20px",
                borderBottom: "1px solid var(--border)",
                transition: "background-color 0.2s"
              }}
              className="hover:bg-surface-hover"
            >
              <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1 }}>
                {/* Thumbnail */}
                <div style={{
                  width: "100px",
                  aspectRatio: "16/9",
                  backgroundColor: "var(--background)",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative"
                }}>
                  <Video size={20} style={{ color: "var(--text-muted)" }} />
                  
                  {/* Status Indicator */}
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: upload.status === "uploading" ? "rgba(0,0,0,0.5)" : "transparent"
                  }}>
                    {upload.status === "uploading" && (
                      <div style={{
                        width: "24px",
                        height: "24px",
                        border: "2px solid var(--primary)",
                        borderTopColor: "transparent",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite"
                      }} />
                    )}
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  <h3 style={{ fontWeight: 500, color: "white", marginBottom: "4px" }}>{upload.title}</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "13px", color: "var(--text-muted)" }}>
                    <span>{upload.duration}</span>
                    <span>•</span>
                    <span>{upload.size}</span>
                  </div>
                  
                  {/* Progress Bar */}
                  {upload.status === "uploading" && (
                    <div style={{ marginTop: "8px" }}>
                      <div style={{ 
                        width: "100%", 
                        height: "4px", 
                        backgroundColor: "var(--surface-hover)", 
                        borderRadius: "2px",
                        overflow: "hidden"
                      }}>
                        <div style={{
                          width: `${upload.progress}%`,
                          height: "100%",
                          backgroundColor: "var(--primary)",
                          borderRadius: "2px",
                          transition: "width 0.3s"
                        }} />
                      </div>
                      <span style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px", display: "block" }}>
                        {upload.progress}% uploaded
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                {/* Status Badge */}
                <span style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 12px",
                  backgroundColor: statusColors[upload.status] + "20",
                  color: statusColors[upload.status],
                  fontSize: "12px",
                  fontWeight: 500,
                  borderRadius: "6px",
                  textTransform: "capitalize"
                }}>
                  {upload.status === "completed" && <CheckCircle size={14} />}
                  {upload.status === "uploading" && <Clock size={14} />}
                  {upload.status === "failed" && <AlertCircle size={14} />}
                  {upload.status === "queued" && <Clock size={14} />}
                  {upload.status}
                </span>

                <span style={{ fontSize: "13px", color: "var(--text-muted)", minWidth: "80px" }}>{upload.uploadedAt}</span>

                <div style={{ display: "flex", gap: "4px" }}>
                  {upload.status === "completed" && (
                    <button style={{ background: "none", border: "none", color: "var(--primary)", cursor: "pointer", padding: "4px" }}>
                      <Film size={16} />
                    </button>
                  )}
                  {(upload.status === "failed" || upload.status === "queued") && (
                    <button style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "4px" }}>
                      <Play size={16} />
                    </button>
                  )}
                  <button style={{ background: "none", border: "none", color: "var(--error)", cursor: "pointer", padding: "4px" }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100
        }}>
          <div style={{
            backgroundColor: "var(--surface)",
            borderRadius: "16px",
            border: "1px solid var(--border)",
            width: "100%",
            maxWidth: "560px",
            padding: "24px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "600", color: "white" }}>Upload Video</h2>
              <button
                onClick={() => setShowUploadModal(false)}
                style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Drop Zone */}
            <div style={{
              border: "2px dashed var(--border)",
              borderRadius: "12px",
              padding: "48px",
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            onDragOver={(e) => e.preventDefault()}
            >
              <div style={{
                width: "64px",
                height: "64px",
                backgroundColor: "var(--primary)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px"
              }}>
                <Upload size={28} style={{ color: "white" }} />
              </div>
              <p style={{ fontSize: "16px", fontWeight: 500, color: "white", marginBottom: "8px" }}>
                Drag and drop your video here
              </p>
              <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                or click to browse files
              </p>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "16px" }}>
                Supported formats: MP4, MOV, AVI, MKV (Max 5GB)
              </p>
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
              <button
                onClick={() => setShowUploadModal(false)}
                style={{
                  flex: 1,
                  padding: "12px",
                  backgroundColor: "var(--surface-hover)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "white",
                  fontWeight: 500,
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
              <button
                style={{
                  flex: 1,
                  padding: "12px",
                  backgroundColor: "var(--primary)",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                  fontWeight: 500,
                  cursor: "pointer"
                }}
              >
                Select File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
