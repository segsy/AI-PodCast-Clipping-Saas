"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  Video,
  Loader2,
  FileVideo,
  CloudUpload,
  Bell,
  BellOff
} from "lucide-react";
import Link from "next/link";

interface UploadItem {
  id: string;
  filename: string;
  contentType: string;
  bytes: number;
  durationSec: number | null;
  status: string;
  s3Key: string;
  createdAt: string;
  projectName: string | null;
  title?: string;
  duration?: string;
  size?: string;
  progress?: number;
  uploadedAt?: string;
  thumbnail?: string | null;
}

interface UploadStats {
  total: number;
  completed: number;
  uploading: number;
  failed: number;
  totalSize: number;
}

interface Project {
  id: string;
  name: string;
}

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDuration(seconds: number | null): string {
  if (!seconds) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

const statusColors: Record<string, string> = {
  completed: "#22c55e",
  uploading: "#3b82f6",
  failed: "#ef4444",
  queued: "#f59e0b",
};

export default function UploadsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [stats, setStats] = useState<UploadStats>({ total: 0, completed: 0, uploading: 0, failed: 0, totalSize: 0 });
  const [loading, setLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(false);
  
  // Upload form state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Project creation state
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [creatingProject, setCreatingProject] = useState(false);
  
  // Toast notifications
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: "success" | "error" | "info" = "success") => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  useEffect(() => {
    fetchUploads();
    fetchProjects();
  }, [statusFilter]);

  // Fetch projects and uploads on mount
  useEffect(() => {
    fetchProjects();
    fetchUploads();
  }, []);

  const fetchProjects = async () => {
    setProjectsLoading(true);
    try {
      // Get workspace ID from localStorage
      const workspaceId = localStorage.getItem("workspaceId");
      const url = workspaceId ? `/api/projects?workspaceId=${workspaceId}` : "/api/projects";
      
      const response = await fetch(url);
      
      // Handle error responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 400 && errorData.error?.includes("Workspace")) {
          // No workspace found - this is expected for new users
          console.log("No workspace configured");
          setProjectsLoading(false);
          return;
        }
        console.error("Error fetching projects:", errorData.error || response.statusText);
        setProjectsLoading(false);
        return;
      }
      
      const data = await response.json();
      setProjects(data.projects || []);
      if (data.projects && data.projects.length > 0) {
        setSelectedProject(data.projects[0].id);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setProjectsLoading(false);
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      addToast("Please enter a project name", "error");
      return;
    }

    try {
      setCreatingProject(true);
      // Get workspaceId and userId from localStorage with fallbacks
      let workspaceId = localStorage.getItem("workspaceId") || localStorage.getItem("currentWorkspaceId");
      let userId = localStorage.getItem("userId") || localStorage.getItem("currentUserId");
      
      // Use demo workspace if no workspace found
      if (!workspaceId) {
        workspaceId = "demo-workspace";
      }
      
      // If still no userId, use a default for demo purposes
      if (!userId) {
        userId = "demo-user";
      }

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId,
          name: newProjectName.trim(),
          userId
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to create project');
      }

      const data = await response.json();
      
      // Add the new project to the projects list
      const newProject = data.project;
      setProjects([...projects, newProject]);
      
      // Auto-select the new project
      setSelectedProject(newProject.id);
      
      // Close the create project UI
      setShowCreateProject(false);
      setNewProjectName("");
      
      addToast("Project created successfully!", "success");
      
    } catch (error: any) {
      console.error("Error creating project:", error);
      addToast(error.message || 'Failed to create project', "error");
    } finally {
      setCreatingProject(false);
    }
  };

  const fetchUploads = async () => {
    try {
      setLoading(true);
      const workspaceId = localStorage.getItem("workspaceId") || "demo-workspace";
      const params = new URLSearchParams({ workspaceId });
      if (statusFilter !== "all") {
        params.append("status", statusFilter.toUpperCase());
      }
      
      const response = await fetch(`/api/uploads?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        const transformedUploads = (data.uploads || []).map((u: any) => ({
          ...u,
          title: u.filename,
          duration: formatDuration(u.durationSec),
          size: formatBytes(u.bytes),
          progress: u.status === "UPLOAD_COMPLETE" ? 100 : (u.status === "UPLOADING" ? 50 : 0),
          uploadedAt: new Date(u.createdAt).toLocaleDateString(),
          status: u.status === "UPLOAD_COMPLETE" ? "completed" : 
                  u.status === "UPLOADING" ? "uploading" : 
                  u.status === "FAILED" ? "failed" : 
                  u.status === "UPLOAD_READY" ? "queued" : "completed",
        }));
        setUploads(transformedUploads);
        setStats(data.stats || { total: 0, completed: 0, uploading: 0, failed: 0, totalSize: 0 });
      }
    } catch (error) {
      console.error("Error fetching uploads:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('video/') || file.name.match(/\.(mp4|mov|avi|mkv|webm)$/i)) {
        setSelectedFile(file);
      } else {
        addToast("Please select a valid video file", "error");
      }
    }
  }, [addToast]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedProject) {
      addToast("Please select a file and project", "error");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Generate S3 key for the upload
      const s3Key = `uploads/${selectedProject}/${Date.now()}_${selectedFile.name}`;
      
      // Simulate upload progress (in a real app, you'd use actual S3 presigned URL upload)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      // Get workspaceId from localStorage
      const workspaceId = localStorage.getItem("workspaceId") || "demo-workspace";
      const userId = localStorage.getItem("userId") || "demo-user";
      
      // API gets workspace ID from server-side session
      const response = await fetch('/api/uploads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-workspace-id': workspaceId,
          'x-user-id': userId,
        },
        body: JSON.stringify({
          workspaceId: workspaceId,
          userId: userId,
          projectId: selectedProject,
          filename: selectedFile.name,
          contentType: selectedFile.type,
          bytes: selectedFile.size,
          s3Key: s3Key,
          durationSec: null,
        }),
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error("Failed to create upload record");
      }

      setUploadProgress(100);
      
      // Reset form
      setTimeout(() => {
        setSelectedFile(null);
        setShowUploadModal(false);
        setUploadProgress(0);
        setIsUploading(false);
        fetchUploads(); // Refresh the list
        addToast(`Successfully uploaded "${selectedFile.name}"`, "success");
      }, 500);

    } catch (error) {
      console.error("Upload error:", error);
      setIsUploading(false);
      setUploadProgress(0);
      
      // Provide more specific error message
      if (error instanceof Response) {
        try {
          const errorData = await error.json();
          addToast(errorData.error || "Failed to upload video. Please try again.", "error");
        } catch {
          addToast("Failed to upload video. Please try again.", "error");
        }
      } else {
        addToast("Failed to upload video. Please try again.", "error");
      }
    }
  };

  const handleDeleteUpload = async (uploadId: string) => {
    try {
      const response = await fetch(`/api/uploads?id=${uploadId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        addToast("Upload deleted successfully", "success");
        fetchUploads();
      }
    } catch (error) {
      console.error("Error deleting upload:", error);
      addToast("Failed to delete upload", "error");
    }
  };

  const filteredUploads = uploads.filter(upload => {
    const matchesSearch = (upload.title || upload.filename || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || upload.status?.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const completedCount = stats.completed;
  const uploadingCount = stats.uploading;
  const totalSize = stats.totalSize;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", position: "relative" }}>
      {/* Toast Notifications */}
      <div style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        gap: "8px"
      }}>
        {toasts.map(toast => (
          <div
            key={toast.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              backgroundColor: toast.type === "success" ? "#22c55e" : toast.type === "error" ? "#ef4444" : "#3b82f6",
              borderRadius: "8px",
              color: "white",
              fontSize: "14px",
              fontWeight: 500,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              animation: "slideIn 0.3s ease-out",
              minWidth: "280px",
            }}
          >
            {toast.type === "success" && <CheckCircle size={18} />}
            {toast.type === "error" && <AlertCircle size={18} />}
            {toast.type === "info" && <Bell size={18} />}
            <span style={{ flex: 1 }}>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: "none",
                border: "none",
                color: "white",
                cursor: "pointer",
                padding: "2px",
                opacity: 0.8
              }}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Page header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>Uploads</h1>
          <p style={{ color: "#9ca3af", marginTop: "4px" }}>Manage your video uploads</p>
        </div>
        <button 
          onClick={() => {
            if (projectsLoading) {
              addToast("Loading projects, please wait...", "info");
              return;
            }
            setShowUploadModal(true);
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 20px",
            backgroundColor: "#3b82f6",
            border: "none",
            borderRadius: "8px",
            color: "white",
            fontWeight: 500,
            cursor: "pointer",
            transition: "background-color 0.2s"
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#2563eb"}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#3b82f6"}
        >
          <Plus size={18} />
          Upload Video
        </button>
      </div>

      {/* Stats */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{ backgroundColor: '#1f2937', borderRadius: '12px', border: '1px solid #374151', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: '#374151', borderRadius: '8px' }} />
                <div>
                  <p style={{ color: '#9ca3af', fontSize: '14px', width: '80px', height: '14px', backgroundColor: '#374151', borderRadius: '4px', marginBottom: '8px' }} />
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', width: '60px', height: '28px', backgroundColor: '#374151', borderRadius: '4px' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
        <div style={{ backgroundColor: "#1f2937", borderRadius: "12px", border: "1px solid #374151", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "40px", height: "40px", backgroundColor: "#3b82f6", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Upload size={20} style={{ color: "white" }} />
            </div>
            <div>
              <p style={{ color: "#9ca3af", fontSize: "14px" }}>Total Uploads</p>
              <p style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>{stats.total}</p>
            </div>
          </div>
        </div>
        <div style={{ backgroundColor: "#1f2937", borderRadius: "12px", border: "1px solid #374151", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "40px", height: "40px", backgroundColor: "#22c55e", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CheckCircle size={20} style={{ color: "white" }} />
            </div>
            <div>
              <p style={{ color: "#9ca3af", fontSize: "14px" }}>Completed</p>
              <p style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>{stats.completed}</p>
            </div>
          </div>
        </div>
        <div style={{ backgroundColor: "#1f2937", borderRadius: "12px", border: "1px solid #374151", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "40px", height: "40px", backgroundColor: "#3b82f6", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Clock size={20} style={{ color: "white" }} />
            </div>
            <div>
              <p style={{ color: "#9ca3af", fontSize: "14px" }}>Uploading</p>
              <p style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>{uploadingCount}</p>
            </div>
          </div>
        </div>
        <div style={{ backgroundColor: "#1f2937", borderRadius: "12px", border: "1px solid #374151", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "40px", height: "40px", backgroundColor: "#8b5cf6", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FolderOpen size={20} style={{ color: "white" }} />
            </div>
            <div>
              <p style={{ color: "#9ca3af", fontSize: "14px" }}>Total Size</p>
              <p style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>{formatBytes(totalSize)}</p>
            </div>
          </div>
        </div>
      </div>
      )}

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
              color: "#9ca3af" 
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
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
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
            backgroundColor: "#1f2937",
            border: "1px solid #374151",
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
      <div style={{ backgroundColor: "#1f2937", borderRadius: "12px", border: "1px solid #374151" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {loading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "48px" }}>
              <Loader2 size={32} style={{ color: "#3b82f6", animation: "spin 1s linear infinite" }} />
            </div>
          ) : filteredUploads.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px", color: "#9ca3af" }}>
              <Video size={48} style={{ marginBottom: "16px", opacity: 0.5 }} />
              <p style={{ fontSize: "16px", marginBottom: "8px" }}>No uploads found</p>
              <p style={{ fontSize: "14px" }}>Upload your first video to get started</p>
            </div>
          ) : (
            filteredUploads.map((upload) => (
              <div
                key={upload.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 20px",
                  borderBottom: "1px solid #374151",
                  transition: "background-color 0.2s"
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#374151"}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1 }}>
                  {/* Thumbnail */}
                  <div style={{
                    width: "100px",
                    aspectRatio: "16/9",
                    backgroundColor: "#111827",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative"
                  }}>
                    <Video size={20} style={{ color: "#9ca3af" }} />
                    
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
                          border: "2px solid #3b82f6",
                          borderTopColor: "transparent",
                          borderRadius: "50%",
                          animation: "spin 1s linear infinite"
                        }} />
                      )}
                    </div>
                  </div>

                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontWeight: 500, color: "white", marginBottom: "4px" }}>{upload.title}</h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "13px", color: "#9ca3af" }}>
                      <span>{upload.duration}</span>
                      <span>•</span>
                      <span>{upload.size}</span>
                      {upload.projectName && (
                        <>
                          <span>•</span>
                          <span style={{ color: "#3b82f6" }}>{upload.projectName}</span>
                        </>
                      )}
                    </div>
                    
                    {/* Progress Bar */}
                    {upload.status === "uploading" && (
                      <div style={{ marginTop: "8px" }}>
                        <div style={{ 
                          width: "100%", 
                          height: "4px", 
                          backgroundColor: "#374151", 
                          borderRadius: "2px",
                          overflow: "hidden"
                        }}>
                          <div style={{
                            width: `${upload.progress}%`,
                            height: "100%",
                            backgroundColor: "#3b82f6",
                            borderRadius: "2px",
                            transition: "width 0.3s"
                          }} />
                        </div>
                        <span style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px", display: "block" }}>
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

                  <span style={{ fontSize: "13px", color: "#9ca3af", minWidth: "80px" }}>{upload.uploadedAt}</span>

                  <div style={{ display: "flex", gap: "4px" }}>
                    {upload.status === "completed" && (
                      <button style={{ background: "none", border: "none", color: "#3b82f6", cursor: "pointer", padding: "4px" }}>
                        <Film size={16} />
                      </button>
                    )}
                    {(upload.status === "failed" || upload.status === "queued") && (
                      <button style={{ background: "none", border: "none", color: "#9ca3af", cursor: "pointer", padding: "4px" }}>
                        <Play size={16} />
                      </button>
                    )}
                    <button 
                      onClick={() => handleDeleteUpload(upload.id)}
                      style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: "4px" }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
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
            backgroundColor: "#1f2937",
            borderRadius: "16px",
            border: "1px solid #374151",
            width: "100%",
            maxWidth: "560px",
            padding: "24px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "600", color: "white" }}>Upload Video</h2>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedFile(null);
                  setUploadProgress(0);
                }}
                style={{ background: "none", border: "none", color: "#9ca3af", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Project Selection */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "white", marginBottom: "8px" }}>
                Select Project
              </label>
              {showCreateProject ? (
                <div style={{ 
                  padding: "16px", 
                  backgroundColor: "#1f2937", 
                  borderRadius: "8px",
                  border: "1px solid #374151"
                }}>
                  <p style={{ color: "#9ca3af", marginBottom: "12px", fontSize: "14px" }}>Create a new project</p>
                  <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="Enter project name"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      backgroundColor: "#111827",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "white",
                      fontSize: "14px",
                      marginBottom: "12px"
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleCreateProject();
                      }
                    }}
                  />
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={handleCreateProject}
                      disabled={creatingProject || !newProjectName.trim()}
                      style={{
                        flex: 1,
                        padding: "10px 16px",
                        backgroundColor: creatingProject ? "#666" : "#22c55e",
                        border: "none",
                        borderRadius: "8px",
                        color: "white",
                        fontSize: "14px",
                        fontWeight: 500,
                        cursor: creatingProject ? "not-allowed" : "pointer"
                      }}
                    >
                      {creatingProject ? "Creating..." : "Create Project"}
                    </button>
                    <button
                      onClick={() => {
                        setShowCreateProject(false);
                        setNewProjectName("");
                      }}
                      style={{
                        padding: "10px 16px",
                        backgroundColor: "#374151",
                        border: "none",
                        borderRadius: "8px",
                        color: "white",
                        fontSize: "14px",
                        fontWeight: 500,
                        cursor: "pointer"
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : projectsLoading ? (
                <div style={{ 
                  padding: "16px", 
                  backgroundColor: "#374151", 
                  borderRadius: "8px",
                  textAlign: "center"
                }}>
                  <p style={{ color: "#9ca3af" }}>Loading projects...</p>
                </div>
              ) : (
                <div>
                  <select
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      backgroundColor: "#111827",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "white",
                      fontSize: "14px",
                      marginBottom: "8px"
                    }}
                  >
                    <option value="">Choose a project...</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => setShowCreateProject(true)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      backgroundColor: "transparent",
                      border: "1px dashed #374151",
                      borderRadius: "8px",
                      color: "#9ca3af",
                      fontSize: "14px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px"
                    }}
                  >
                    <Plus size={16} /> Create New Project
                  </button>
                </div>
              )}
            </div>

            {/* Drop Zone */}
            <div 
              style={{
                border: `2px dashed ${dragActive ? "#3b82f6" : selectedFile ? "#22c55e" : "#374151"}`,
                borderRadius: "12px",
                padding: selectedFile ? "24px" : "48px",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.2s",
                backgroundColor: dragActive ? "rgba(59, 130, 246, 0.1)" : selectedFile ? "rgba(34, 197, 94, 0.1)" : "transparent"
              }}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <label
                htmlFor="file-upload"
                style={{
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center"
                }}
              >
                <input
                  id="file-upload"
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileSelect}
                  style={{
                    position: "absolute",
                    width: "1px",
                    height: "1px",
                    padding: 0,
                    margin: "-1px",
                    overflow: "hidden",
                    clip: "rect(0,0,0,0)",
                    whiteSpace: "nowrap",
                    border: 0
                  }}
                />
              
              {selectedFile ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{
                    width: "64px",
                    height: "64px",
                    backgroundColor: "#22c55e",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "16px"
                  }}>
                    <FileVideo size={28} style={{ color: "white" }} />
                  </div>
                  <p style={{ fontSize: "16px", fontWeight: 500, color: "white", marginBottom: "8px" }}>
                    {selectedFile.name}
                  </p>
                  <p style={{ fontSize: "14px", color: "#9ca3af", marginBottom: "4px" }}>
                    {formatBytes(selectedFile.size)}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                    }}
                    style={{
                      marginTop: "8px",
                      padding: "6px 12px",
                      backgroundColor: "transparent",
                      border: "1px solid #ef4444",
                      borderRadius: "6px",
                      color: "#ef4444",
                      fontSize: "12px",
                      cursor: "pointer"
                    }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <div style={{
                    width: "64px",
                    height: "64px",
                    backgroundColor: "#3b82f6",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px"
                  }}>
                    <CloudUpload size={28} style={{ color: "white" }} />
                  </div>
                  <p style={{ fontSize: "16px", fontWeight: 500, color: "white", marginBottom: "8px" }}>
                    Drag and drop your video here
                  </p>
                  <p style={{ fontSize: "14px", color: "#9ca3af" }}>
                    or click to browse files
                  </p>
                  <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "16px" }}>
                    Supported formats: MP4, MOV, AVI, MKV (Max 5GB)
                  </p>
                </>
              )}
            </label>
          </div>

            {/* Upload Progress */}
            {isUploading && (
              <div style={{ marginTop: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontSize: "14px", color: "white" }}>Uploading...</span>
                  <span style={{ fontSize: "14px", color: "#3b82f6" }}>{uploadProgress}%</span>
                </div>
                <div style={{ 
                  width: "100%", 
                  height: "6px", 
                  backgroundColor: "#374151", 
                  borderRadius: "3px",
                  overflow: "hidden"
                }}>
                  <div style={{
                    width: `${uploadProgress}%`,
                    height: "100%",
                    backgroundColor: "#3b82f6",
                    borderRadius: "3px",
                    transition: "width 0.2s"
                  }} />
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedFile(null);
                  setUploadProgress(0);
                }}
                disabled={isUploading}
                style={{
                  flex: 1,
                  padding: "12px",
                  backgroundColor: "#374151",
                  border: "1px solid #4b5563",
                  borderRadius: "8px",
                  color: "white",
                  fontWeight: 500,
                  cursor: isUploading ? "not-allowed" : "pointer",
                  opacity: isUploading ? 0.5 : 1
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!selectedFile || !selectedProject || isUploading}
                style={{
                  flex: 1,
                  padding: "12px",
                  backgroundColor: !selectedFile || !selectedProject || isUploading ? "#374151" : "#3b82f6",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                  fontWeight: 500,
                  cursor: !selectedFile || !selectedProject || isUploading ? "not-allowed" : "pointer",
                  opacity: !selectedFile || !selectedProject || isUploading ? 0.5 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}
              >
                {isUploading ? (
                  <>
                    <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
                    Uploading...
                  </>
                ) : (
                  <>
                    <CloudUpload size={18} />
                    Upload Video
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global styles for animations */}
      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
