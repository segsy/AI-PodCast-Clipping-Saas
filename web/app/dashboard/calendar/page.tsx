"use client";

import { useState, useEffect } from "react";
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Clock, 
  Calendar as CalendarView, 
  Upload, 
  FileVideo,
  X,
  CheckCircle2,
  Edit2,
  Trash2,
  Loader2
} from "lucide-react";

// Types
interface ScheduledPost {
  id: string;
  title: string;
  description?: string;
  platform: string;
  scheduledAt: string;
  status: string;
  caption?: string;
}

const platforms = [
  { name: "YouTube", icon: "📺", color: "#FF0000" },
  { name: "TikTok", icon: "🎵", color: "#000000" },
  { name: "Instagram", icon: "📸", color: "#E1306C" },
  { name: "Facebook", icon: "📘", color: "#1877F2" },
  { name: "LinkedIn", icon: "💼", color: "#0A66C2" },
  { name: "X", icon: "🐦", color: "#1DA1F2" },
];

export default function CalendarPage() {
  const [showBetaModal, setShowBetaModal] = useState(true);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [projects, setProjects] = useState<{id: string; name: string}[]>([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedPost, setSelectedPost] = useState<ScheduledPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Current date state for calendar
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Upload form state
  const [uploadDate, setUploadDate] = useState("");
  const [uploadTime, setUploadTime] = useState("12:00");

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formPlatform, setFormPlatform] = useState("YOUTUBE");
  const [formScheduledDate, setFormScheduledDate] = useState("");
  const [formScheduledTime, setFormScheduledTime] = useState("12:00");
  const [formCaption, setFormCaption] = useState("");

  useEffect(() => {
    fetchPosts();
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const workspaceId = localStorage.getItem("workspaceId") || "demo-workspace";
      const response = await fetch(`/api/projects?workspaceId=${workspaceId}`);
      if (!response.ok) {
        console.error("Failed to fetch projects:", response.status, response.statusText);
        return;
      }
      const data = await response.json();
      if (data.projects) {
        setProjects(data.projects);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  };

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const workspaceId = localStorage.getItem("workspaceId") || "demo-workspace";
      const response = await fetch(`/api/scheduled-posts?workspaceId=${workspaceId}`);
      if (!response.ok) {
        console.error("Failed to fetch posts:", response.status, response.statusText);
        setIsLoading(false);
        return;
      }
      const data = await response.json();
      
      if (data.posts) {
        setPosts(data.posts);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!formTitle || !formPlatform || !formScheduledDate) return;
    
    setIsSaving(true);
    try {
      const workspaceId = localStorage.getItem("workspaceId") || "demo-workspace";
      const scheduledAt = new Date(`${formScheduledDate}T${formScheduledTime}:00`).toISOString();
      
      const response = await fetch("/api/scheduled-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId,
          title: formTitle,
          description: formDescription,
          platform: formPlatform,
          scheduledAt,
          caption: formCaption,
          projectId: selectedProject,
        }),
      });
      
      const data = await response.json();
      if (data.post) {
        setPosts([...posts, data.post]);
        setShowScheduleModal(false);
        resetForm();
      }
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/scheduled-posts/${postId}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        setPosts(posts.filter(p => p.id !== postId));
        setShowPostModal(false);
      }
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  const handleViewPost = (post: ScheduledPost) => {
    setSelectedPost(post);
    setShowPostModal(true);
  };

  const resetForm = () => {
    setFormTitle("");
    setFormDescription("");
    setFormPlatform("YOUTUBE");
    setFormScheduledDate("");
    setFormScheduledTime("12:00");
    setFormCaption("");
    setSelectedProject("");
  };

  const handleGoSubmitProject = () => {
    setShowScheduleModal(false);
    window.location.href = '/dashboard/learning';
  };

  const handleUploadSchedule = async () => {
    if (!uploadDate || !uploadTime || uploadedFiles.length === 0) return;
    
    setIsSaving(true);
    try {
      const workspaceId = localStorage.getItem("workspaceId") || "demo-workspace";
      const scheduledAt = new Date(`${uploadDate}T${uploadTime}:00`).toISOString();
      
      const response = await fetch("/api/scheduled-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId,
          title: uploadedFiles[0].name,
          description: "Uploaded video",
          platform: selectedPlatform || "YOUTUBE",
          scheduledAt,
          caption: formCaption,
        }),
      });
      
      const data = await response.json();
      if (data.post) {
        setPosts([...posts, data.post]);
        setShowUploadModal(false);
        setUploadedFiles([]);
        setUploadDate("");
        setUploadTime("12:00");
        setSelectedPlatform("");
      }
    } catch (error) {
      console.error("Failed to schedule upload:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setUploadedFiles(filesArray);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const filesArray = Array.from(e.dataTransfer.files);
      setUploadedFiles(filesArray);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Page header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>Calendar</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>Schedule and manage your content calendar</p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button 
            onClick={() => setShowUploadModal(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              color: "white",
              fontWeight: 500,
              cursor: "pointer"
            }}
          >
            <Upload size={18} />
            Upload Video
          </button>
          <button 
            onClick={() => setShowScheduleModal(true)}
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
            Schedule Post
          </button>
        </div>
      </div>

      {/* Beta Modal */}
      {showBetaModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "24px"
        }}>
          <div style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "32px",
            maxWidth: "500px",
            width: "100%",
            textAlign: "center"
          }}>
            <div style={{
              width: "80px",
              height: "80px",
              backgroundColor: "var(--primary)/10",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px"
            }}>
              <CalendarIcon size={40} style={{ color: "var(--primary)" }} />
            </div>
            
            <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "white", marginBottom: "16px" }}>
              Welcome to the Calendar Beta!
            </h2>
            
            <p style={{ color: "var(--text-secondary)", fontSize: "16px", lineHeight: 1.6, marginBottom: "24px" }}>
              Schedule your post, easily view your entire posting schedule, and edit your posts from one easy to use calendar.
              <br /><br />
              The Calendar is still in the Beta testing phase. We might change posting quota and available features when it's formally launched.
            </p>

            <button 
              onClick={() => setShowBetaModal(false)}
              style={{
                padding: "12px 32px",
                backgroundColor: "var(--primary)",
                border: "none",
                borderRadius: "8px",
                color: "white",
                fontWeight: 600,
                fontSize: "16px",
                cursor: "pointer"
              }}
            >
              Begin Scheduling
            </button>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "24px"
        }}>
          <div style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "32px",
            maxWidth: "600px",
            width: "100%",
            maxHeight: "80vh",
            overflowY: "auto"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>Schedule Post</h2>
              <button 
                onClick={() => setShowScheduleModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  padding: "4px"
                }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Create Post Form */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "white", marginBottom: "8px" }}>
                  Select Project <span style={{ color: "var(--error)" }}>*</span>
                </label>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>
                  Select the project that contains the clip you would like to schedule.
                </p>
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    backgroundColor: "var(--background)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "14px"
                  }}
                >
                  <option value="">Select a project...</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "white", marginBottom: "8px" }}>
                  Title
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Enter post title"
                  style={{
                    width: "100%",
                    padding: "12px",
                    backgroundColor: "var(--background)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "14px"
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "white", marginBottom: "8px" }}>
                  Platform
                </label>
                <select
                  value={formPlatform}
                  onChange={(e) => setFormPlatform(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    backgroundColor: "var(--background)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "14px"
                  }}
                >
                  {platforms.map((platform) => (
                    <option key={platform.name} value={platform.name.toUpperCase()}>
                      {platform.icon} {platform.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "white", marginBottom: "8px" }}>
                    Date
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={formScheduledDate}
                    onChange={(e) => setFormScheduledDate(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      backgroundColor: "var(--background)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      color: "white",
                      fontSize: "14px"
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "white", marginBottom: "8px" }}>
                    Time
                  </label>
                  <input
                    type="time"
                    value={formScheduledTime}
                    onChange={(e) => setFormScheduledTime(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      backgroundColor: "var(--background)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      color: "white",
                      fontSize: "14px"
                    }}
                  />
                </div>
              </div>
              
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "white", marginBottom: "8px" }}>
                  Caption
                </label>
                <textarea
                  value={formCaption}
                  onChange={(e) => setFormCaption(e.target.value)}
                  placeholder="Enter caption"
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "12px",
                    backgroundColor: "var(--background)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "14px",
                    resize: "vertical"
                  }}
                />
              </div>
              
              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "8px" }}>
                <button 
                  onClick={() => setShowScheduleModal(false)}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "var(--surface)",
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
                  onClick={handleCreatePost}
                  disabled={!selectedProject || !formTitle || !formScheduledDate || isSaving}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "var(--primary)",
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                    fontWeight: 500,
                    cursor: isSaving ? "not-allowed" : "pointer",
                    opacity: isSaving ? 0.7 : 1
                  }}
                >
                  {isSaving ? "Scheduling..." : "Schedule Post"}
                </button>
              </div>
            </div>

            {/* Existing Posts */}
            {posts.length > 0 && (
              <div style={{ marginTop: "32px", borderTop: "1px solid var(--border)", paddingTop: "24px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "600", color: "white", marginBottom: "16px" }}>
                  Existing Scheduled Posts
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {posts.map((post) => (
                    <div key={post.id} style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "16px",
                      backgroundColor: "var(--background)",
                      borderRadius: "8px",
                      border: "1px solid var(--border)"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <div style={{
                          width: "48px",
                          height: "48px",
                          backgroundColor: "var(--primary)/10",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "24px"
                        }}>
                          {platforms.find(p => p.name.toLowerCase() === post.platform.toLowerCase())?.icon || "📹"}
                        </div>
                        <div>
                          <p style={{ fontWeight: 500, color: "white", marginBottom: "4px" }}>{post.title}</p>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--text-muted)" }}>
                            <CalendarView size={14} />
                            <span>{new Date(post.scheduledAt).toLocaleDateString()}</span>
                            <Clock size={14} />
                            <span>{new Date(post.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            <span style={{
                              padding: "2px 8px",
                              backgroundColor: post.status === "published" ? "var(--success)20" : "var(--warning)20",
                              color: post.status === "published" ? "var(--success)" : "var(--warning)",
                              borderRadius: "4px",
                              textTransform: "capitalize"
                            }}>
                              {post.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button 
                          onClick={() => handleDeletePost(post.id)}
                          style={{
                            background: "none",
                            border: "1px solid var(--error)/30",
                            color: "var(--error)",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "12px"
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "24px"
        }}>
          <div style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "32px",
            maxWidth: "600px",
            width: "100%"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>Upload Own Video</h2>
              <button 
                onClick={() => setShowUploadModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  padding: "4px"
                }}
              >
                <X size={24} />
              </button>
            </div>

            <p style={{ color: "var(--text-secondary)", fontSize: "16px", marginBottom: "24px" }}>
              You may upload and schedule your own videos directly through Podcast Clips.
            </p>

            {/* File Upload Area */}
            <div 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              style={{
                border: `2px dashed ${uploadedFiles.length > 0 ? "var(--success)" : "var(--border)"}`,
                borderRadius: "12px",
                padding: "48px 24px",
                textAlign: "center",
                backgroundColor: uploadedFiles.length > 0 ? "var(--success)5" : "var(--background)",
                transition: "all 0.2s"
              }}
            >
              {uploadedFiles.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <CheckCircle2 size={48} style={{ color: "var(--success)", margin: "0 auto" }} />
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {uploadedFiles.map((file, index) => (
                      <div key={index} style={{
                        padding: "12px",
                        backgroundColor: "var(--surface)",
                        borderRadius: "8px",
                        border: "1px solid var(--border)"
                      }}>
                        <p style={{ fontWeight: 500, color: "white", marginBottom: "4px" }}>{file.name}</p>
                        <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => setUploadedFiles([])}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "var(--error)/10",
                      border: "1px solid var(--error)/30",
                      borderRadius: "6px",
                      color: "var(--error)",
                      fontSize: "14px",
                      fontWeight: 500,
                      cursor: "pointer"
                    }}
                  >
                    Remove Files
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <Upload size={48} style={{ color: "var(--text-muted)", margin: "0 auto" }} />
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <p style={{ fontSize: "16px", fontWeight: "500", color: "white" }}>
                      Drag & drop your video file here
                    </p>
                    <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                      or
                    </p>
                    <label style={{
                      display: "inline-block",
                      padding: "10px 24px",
                      backgroundColor: "var(--primary)",
                      border: "none",
                      borderRadius: "8px",
                      color: "white",
                      fontWeight: 500,
                      cursor: "pointer",
                      transition: "background 0.2s"
                    }}>
                      Choose File
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleFileUpload}
                        style={{ display: "none" }}
                      />
                    </label>
                  </div>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    File size limit: 200MB
                  </p>
                </div>
              )}
            </div>

            {/* Platform Selection */}
            {uploadedFiles.length > 0 && (
              <div style={{ marginTop: "24px" }}>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "white", marginBottom: "12px" }}>
                  Select Platform
                </label>
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    backgroundColor: "var(--background)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "14px"
                  }}
                >
                  <option value="">All Platforms</option>
                  {platforms.map((platform) => (
                    <option key={platform.name} value={platform.name}>
                      {platform.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Schedule Date and Time */}
            {uploadedFiles.length > 0 && (
              <div style={{ marginTop: "24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "white", marginBottom: "12px" }}>
                    Schedule Date
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={uploadDate}
                    onChange={(e) => setUploadDate(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      backgroundColor: "var(--background)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      color: "white",
                      fontSize: "14px"
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "white", marginBottom: "12px" }}>
                    Schedule Time
                  </label>
                  <input
                    type="time"
                    value={uploadTime}
                    onChange={(e) => setUploadTime(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      backgroundColor: "var(--background)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      color: "white",
                      fontSize: "14px"
                    }}
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ marginTop: "24px", display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button 
                onClick={() => setShowUploadModal(false)}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "white",
                  fontWeight: 500,
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
              {uploadedFiles.length > 0 && (
                <button 
                  onClick={handleUploadSchedule}
                  disabled={!uploadDate || !uploadTime || isSaving}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "var(--primary)",
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                    fontWeight: 500,
                    cursor: isSaving ? "not-allowed" : "pointer",
                    opacity: isSaving ? 0.7 : 1
                  }}
                >
                  {isSaving ? "Scheduling..." : "Schedule Post"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Date Picker Modal - Quick Add */}
      {showDatePickerModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "24px"
        }}>
          <div style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "32px",
            maxWidth: "400px",
            width: "100%",
            textAlign: "center"
          }}>
            <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "white", marginBottom: "8px" }}>
              Add to Schedule
            </h2>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "24px" }}>
              {formScheduledDate ? new Date(formScheduledDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : 'Select a date'}
            </p>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <button 
                onClick={() => {
                  setShowDatePickerModal(false);
                  setShowScheduleModal(true);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "16px",
                  backgroundColor: "var(--primary)",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                  fontWeight: 500,
                  cursor: "pointer",
                  justifyContent: "flex-start"
                }}
              >
                <FileVideo size={20} />
                <div style={{ textAlign: "left" }}>
                  <div>Select from Projects</div>
                  <div style={{ fontSize: "12px", opacity: 0.8 }}>Choose an existing project clip to schedule</div>
                </div>
              </button>
              
              <button 
                onClick={() => {
                  setShowDatePickerModal(false);
                  setShowUploadModal(true);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "16px",
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "white",
                  fontWeight: 500,
                  cursor: "pointer",
                  justifyContent: "flex-start"
                }}
              >
                <Upload size={20} />
                <div style={{ textAlign: "left" }}>
                  <div>Upload New Video</div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Upload and schedule a new video</div>
                </div>
              </button>
            </div>
            
            <button 
              onClick={() => setShowDatePickerModal(false)}
              style={{
                marginTop: "16px",
                padding: "8px 16px",
                backgroundColor: "transparent",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer"
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Calendar View */}
      <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: "600", color: "white" }}>{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
          <div style={{ display: "flex", gap: "8px" }}>
            <button 
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
              style={{
                padding: "8px 12px",
                backgroundColor: "var(--background)",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                color: "white",
                fontSize: "14px",
                cursor: "pointer"
              }}>
              Prev
            </button>
            <button 
              onClick={() => setCurrentDate(new Date())}
              style={{
                padding: "8px 12px",
                backgroundColor: "var(--primary)",
                border: "none",
                borderRadius: "6px",
                color: "white",
                fontSize: "14px",
                cursor: "pointer"
              }}>
              Today
            </button>
            <button 
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
              style={{
                padding: "8px 12px",
                backgroundColor: "var(--background)",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                color: "white",
                fontSize: "14px",
                cursor: "pointer"
              }}>
              Next
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px" }}>
          {/* Days Header */}
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
            <div key={index} style={{
              textAlign: "center",
              padding: "12px",
              fontSize: "12px",
              fontWeight: "600",
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.5px"
            }}>
              {day}
            </div>
          ))}

          {/* Calendar Days */}
          {Array.from({ length: 35 }, (_, index) => {
            const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
            const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
            const day = index - firstDayOfMonth + 1;
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const isCurrentMonth = day > 0 && day <= daysInMonth;
            const today = new Date();
            const isToday = isCurrentMonth && 
              day === today.getDate() && 
              currentDate.getMonth() === today.getMonth() && 
              currentDate.getFullYear() === today.getFullYear();
            const hasPost = posts.some(post => {
              const postDate = new Date(post.scheduledAt);
              return postDate.getDate() === day && 
                postDate.getMonth() === currentDate.getMonth() && 
                postDate.getFullYear() === currentDate.getFullYear();
            });

            const handleDayClick = () => {
              if (isCurrentMonth) {
                const selectedDateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                setFormScheduledDate(selectedDateStr);
                setShowDatePickerModal(true);
              }
            };

            return (
              <div 
                key={index} 
                onClick={handleDayClick}
                onMouseEnter={(e) => {
                  const plusIcon = e.currentTarget.querySelector('.plus-icon') as HTMLElement;
                  if (plusIcon) plusIcon.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  const plusIcon = e.currentTarget.querySelector('.plus-icon') as HTMLElement;
                  if (plusIcon) plusIcon.style.opacity = '0';
                }}
                style={{
                  aspectRatio: "1/1",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: isCurrentMonth ? "var(--background)" : "transparent",
                  borderRadius: "8px",
                  cursor: isCurrentMonth ? "pointer" : "default",
                  opacity: isCurrentMonth ? 1 : 0.3,
                  border: isToday ? "2px solid var(--primary)" : "1px solid transparent",
                  transition: "all 0.2s",
                  position: "relative"
                }}>
                <span style={{
                  fontSize: "14px",
                  color: isToday ? "var(--primary)" : "white",
                  fontWeight: isToday ? "600" : "400"
                }}>
                  {day > 0 && day <= daysInMonth ? day : ""}
                </span>
                {hasPost && isCurrentMonth && (
                  <div style={{
                    width: "4px",
                    height: "4px",
                    backgroundColor: "var(--primary)",
                    borderRadius: "50%",
                    marginTop: "4px"
                  }} />
                )}
                {isCurrentMonth && (
                  <div 
                    className="plus-icon"
                    style={{
                      position: "absolute",
                      top: "4px",
                      right: "4px",
                      width: "16px",
                      height: "16px",
                      backgroundColor: "var(--primary)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: 0,
                      transition: "opacity 0.2s"
                    }}
                  >
                    <Plus size={10} color="white" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Schedule */}
      <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: "16px", fontWeight: "600", color: "white" }}>Upcoming Schedule</h2>
        </div>
        <div style={{ padding: "16px 20px" }}>
          {posts.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {posts.map((post) => (
                <div key={post.id} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  padding: "12px",
                  backgroundColor: "var(--background)",
                  borderRadius: "8px"
                }}>
                  <div style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: "var(--primary)/10",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px"
                  }}>
                    {platforms.find(p => p.name.toLowerCase() === post.platform.toLowerCase())?.icon || "📹"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 500, color: "white", marginBottom: "4px" }}>{post.title}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--text-muted)" }}>
                      <CalendarView size={14} />
                      <span>{new Date(post.scheduledAt).toLocaleDateString()}</span>
                      <Clock size={14} />
                      <span>{new Date(post.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                  <span style={{
                    padding: "4px 12px",
                    backgroundColor: post.status === "published" ? "var(--success)20" : "var(--warning)20",
                    color: post.status === "published" ? "var(--success)" : "var(--warning)",
                    borderRadius: "4px",
                    fontSize: "12px",
                    textTransform: "capitalize"
                  }}>
                    {post.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "40px 24px" }}>
              <CalendarIcon size={48} style={{ color: "var(--text-muted)", marginBottom: "16px" }} />
              <p style={{ color: "var(--text-secondary)" }}>No posts scheduled</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
