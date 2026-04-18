"use client";

import { useState, useEffect } from "react";
import { Plus, X, Upload, Video, FileVideo, Zap, CheckCircle, Play, Edit, Trash2, ExternalLink } from "lucide-react";

interface UploadState {
  file: File | null;
  uploading: boolean;
  progress: number;
  error: string | null;
}

interface Project {
  id: string;
  name: string;
}

interface VideoAsset {
  id: string;
  name: string;
  durationSec: number | null;
  contentType: string;
  url: string;
  thumbnailUrl: string | null;
}

interface Clip {
  id: string;
  title: string;
  status: string;
  startMs: number;
  endMs: number;
  projectId: string;
  projectName: string | null;
  createdAt: string;
}

interface Stats {
  total: number;
  published: number;
  drafts: number;
}

export default function ClipsPageSimple() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [videos, setVideos] = useState<VideoAsset[]>([]);
  const [clips, setClips] = useState<Clip[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, published: 0, drafts: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedUpload, setSelectedUpload] = useState("");
  const [clipTitle, setClipTitle] = useState("");
  const [startTime, setStartTime] = useState("0");
  const [endTime, setEndTime] = useState("30");
  const [uploadState, setUploadState] = useState<UploadState>({ file: null, uploading: false, progress: 0, error: null });
  const [videoUrl, setVideoUrl] = useState("");
  const [uploadMode, setUploadMode] = useState<"file" | "select" | "link">("file");
  const [creating, setCreating] = useState(false);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [creatingProject, setCreatingProject] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Fetch data on mount
  useEffect(() => {
    console.log('[ClipsPage] Component mounted, starting data fetch...');
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log('[ClipsPage] Fetching clips data...');
      setLoading(true);
      
      // Fetch projects
      try {
        const workspaceId = localStorage.getItem("workspaceId") || "demo-workspace";
        const projectsRes = await fetch(`/api/projects?workspaceId=${workspaceId}`);
        const projectsData = await projectsRes.json();
        if (projectsRes.ok) {
          setProjects(projectsData.projects || []);
          console.log('[ClipsPage] Projects loaded:', projectsData.projects?.length || 0);
        } else {
          console.error('[ClipsPage] Projects API error:', projectsData.error);
        }
      } catch (e) {
        console.error('[ClipsPage] Error fetching projects:', e);
      }

      // Fetch uploads/videos
      try {
        const workspaceId = localStorage.getItem("workspaceId") || "demo-workspace";
        const uploadsRes = await fetch(`/api/uploads?workspaceId=${workspaceId}`);
        const uploadsData = await uploadsRes.json();
        if (uploadsRes.ok) {
          // Filter to only video types
          const videos = (uploadsData.uploads || []).filter((u: any) => 
            u.contentType?.startsWith('video/') || u.contentType === 'video'
          );
          setVideos(videos);
          console.log('[ClipsPage] Videos loaded:', videos.length);
        } else {
          console.error('[ClipsPage] Uploads API error:', uploadsData.error);
        }
      } catch (e) {
        console.error('[ClipsPage] Error fetching uploads:', e);
      }

      // Fetch clips
      try {
        const workspaceId = localStorage.getItem("workspaceId") || "demo-workspace";
        const clipsRes = await fetch(`/api/clips?workspaceId=${workspaceId}`);
        const clipsData = await clipsRes.json();
        if (clipsRes.ok) {
          setClips(clipsData.clips || []);
          setStats(clipsData.stats || { total: 0, published: 0, drafts: 0 });
          console.log('[ClipsPage] Clips loaded:', clipsData.clips?.length || 0);
        } else {
          console.error('[ClipsPage] Clips API error:', clipsData.error);
        }
      } catch (e) {
        console.error('[ClipsPage] Error fetching clips:', e);
      }
    } catch (error) {
      console.error('[ClipsPage] Error in fetchData:', error);
    } finally {
      setLoading(false);
    }
  };

  console.log('ClipsPageSimple rendering, showCreateModal:', showCreateModal);

  const handleCreateClip = () => {
    console.log('handleCreateClip called, setting showCreateModal to true');
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setSelectedProject("");
    setSelectedUpload("");
    setClipTitle("");
    setStartTime("0");
    setEndTime("30");
    setUploadState({ file: null, uploading: false, progress: 0, error: null });
    setVideoUrl("");
    setUploadMode("file");
    setShowCreateProject(false);
    setNewProjectName("");
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      setNotification({ type: 'error', message: 'Please enter a project name' });
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
        console.log('[ClipsPage] Using demo workspace for project creation');
      }
      
      // Try to get user from session/API if no userId found
      if (!userId) {
        // Try to get from a common session storage key
        const sessionUser = localStorage.getItem("session") || localStorage.getItem("auth_token");
        if (sessionUser) {
          // Try to decode and get user id if it's a JWT
          try {
            const parts = sessionUser.split('.');
            if (parts.length === 3) {
              const payload = JSON.parse(atob(parts[1]));
              userId = payload.sub || payload.userId || payload.id;
            }
          } catch (e) {
            console.log('[ClipsPage] Could not parse session token');
          }
        }
        // If still no userId, use a default for demo purposes
        if (!userId) {
          userId = "demo-user";
          console.log('[ClipsPage] Using demo user for project creation');
        }
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

      // Handle non-JSON responses (like HTML error pages)
      const contentType = response.headers.get('content-type');
      if (!response.ok) {
        let errorMessage = 'Failed to create project';
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } else {
          // Try to get text error, or use default
          try {
            const textError = await response.text();
            if (textError && textError.length < 100) {
              errorMessage = textError;
            }
          } catch (e) {
            // Use default error message
          }
        }
        throw new Error(errorMessage);
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
      
      setNotification({ type: 'success', message: 'Project created successfully!' });
      
    } catch (error: any) {
      console.error("Error creating project:", error);
      // Provide a more user-friendly error message
      let message = error.message || 'Failed to create project';
      
      // Check if it's a JSON parse error (server returned HTML)
      if (message.includes('JSON') || message.includes('Unexpected token')) {
        message = 'Server error. Please check if the backend is running properly.';
      }
      
      setNotification({ type: 'error', message });
    } finally {
      setCreatingProject(false);
    }
  };

  const handleSubmitClip = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('handleSubmitClip called, uploadMode:', uploadMode);
    
    if (uploadMode === "file" && uploadState.file) {
      try {
        setCreating(true);
        const formData = new FormData();
        formData.append("file", uploadState.file);
        formData.append("projectId", selectedProject || "default");
        
        // Get workspaceId and userId from localStorage
        const workspaceId = localStorage.getItem("workspaceId") || localStorage.getItem("currentWorkspaceId") || "demo-workspace";
        const userId = localStorage.getItem("userId") || localStorage.getItem("currentUserId");
        formData.append("workspaceId", workspaceId);
        if (userId) {
          formData.append("userId", userId);
        }
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        
        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.error || 'Failed to upload file');
        }
        
        const uploadData = await uploadResponse.json();
        const uploadId = uploadData.upload?.id || uploadData.id;
        
        const jobResponse = await fetch('/api/clips', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId: selectedProject || "default",
            uploadId,
            title: clipTitle || `Clip ${new Date().toISOString()}`,
            startMs: parseInt(startTime) * 1000,
            endMs: parseInt(endTime) * 1000,
          })
        });

        if (!jobResponse.ok) {
          throw new Error('Failed to create clip');
        }

        const newClip = await jobResponse.json();
        setNotification({ type: 'success', message: `Clip created successfully!` });
        handleCloseModal();
        fetchData(); // Refresh data
        
      } catch (error: any) {
        console.error("Error creating clip:", error);
        setNotification({ type: 'error', message: error.message || 'Failed to create clip' });
      } finally {
        setCreating(false);
      }
      return;
    }

    if (uploadMode === "link" && videoUrl) {
      try {
        setCreating(true);
        // Get workspaceId from localStorage
        const workspaceId = localStorage.getItem("workspaceId") || localStorage.getItem("currentWorkspaceId") || "demo-workspace";
        const linkResponse = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            videoUrl, 
            projectId: selectedProject || "default",
            workspaceId: workspaceId
          })
        });
        
        if (!linkResponse.ok) {
          const errorData = await linkResponse.json();
          throw new Error(errorData.error || 'Failed to import video link');
        }
        
        const linkData = await linkResponse.json();
        const uploadId = linkData.upload?.id || linkData.id;
        
        const jobResponse = await fetch('/api/clips', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId: selectedProject || "default",
            uploadId,
            title: clipTitle || `Clip ${new Date().toISOString()}`,
            startMs: parseInt(startTime) * 1000,
            endMs: parseInt(endTime) * 1000,
          })
        });

        if (!jobResponse.ok) {
          throw new Error('Failed to create clip');
        }

        setNotification({ type: 'success', message: 'Clip created successfully!' });
        handleCloseModal();
        fetchData(); // Refresh data
        
      } catch (error: any) {
        console.error("Error creating clip:", error);
        setNotification({ type: 'error', message: error.message || 'Failed to create clip' });
      } finally {
        setCreating(false);
      }
      return;
    }
    
    if (uploadMode === "select" && selectedUpload) {
      // For select mode, create clip with the selected upload
      try {
        setCreating(true);
        const jobResponse = await fetch('/api/clips', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId: selectedProject,
            uploadId: selectedUpload,
            title: clipTitle || `Clip ${new Date().toISOString()}`,
            startMs: parseInt(startTime) * 1000,
            endMs: parseInt(endTime) * 1000,
          })
        });

        if (!jobResponse.ok) {
          throw new Error('Failed to create clip');
        }

        setNotification({ type: 'success', message: 'Clip created successfully!' });
        handleCloseModal();
        fetchData(); // Refresh data
        
      } catch (error: any) {
        console.error("Error creating clip:", error);
        setNotification({ type: 'error', message: error.message || 'Failed to create clip' });
      } finally {
        setCreating(false);
      }
      return;
    }
    
    if (!selectedProject) {
      setNotification({ type: 'error', message: 'Please select a project' });
      return;
    }

    // File mode - requires file upload first
    if (uploadMode === "file" && !uploadState.file) {
      setNotification({ type: 'error', message: 'Please select a video file to upload' });
      return;
    }
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'READY': return '#22c55e';
      case 'PENDING': return '#eab308';
      case 'RENDERING': return '#3b82f6';
      case 'FAILED': return '#ef4444';
      default: return '#888';
    }
  };

  return (
    <div style={{ padding: 24, backgroundColor: '#0f0f0f', minHeight: '100vh', color: 'white' }}>
      {/* Notification */}
      {notification && (
        <div style={{
          position: 'fixed', top: 20, right: 20, padding: '12px 20px',
          borderRadius: 8, backgroundColor: notification.type === 'success' ? '#22c55e' : '#ef4444',
          color: 'white', zIndex: 9999,
        }}>
          {notification.message}
          <button onClick={() => setNotification(null)} style={{ marginLeft: 12, background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>✕</button>
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 'bold' }}>Clips</h1>
          <p style={{ color: '#888', marginTop: 4 }}>Manage and view all your created clips</p>
        </div>
        <button 
          onClick={handleCreateClip}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "10px 20px", backgroundColor: "#3b82f6",
            border: "none", borderRadius: 8, color: "white",
            fontWeight: 500, cursor: "pointer"
          }}
        >
          <Plus size={18} />
          Create Clip
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        <div style={{ backgroundColor: '#1a1a1a', borderRadius: 12, border: '1px solid #333', padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, backgroundColor: '#3b82f6', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileVideo size={20} style={{ color: 'white' }} />
            </div>
            <div>
              <p style={{ color: '#888', fontSize: 14 }}>Total Clips</p>
              <p style={{ fontSize: 24, fontWeight: 'bold' }}>{loading ? '...' : stats.total}</p>
            </div>
          </div>
        </div>
        <div style={{ backgroundColor: '#1a1a1a', borderRadius: 12, border: '1px solid #333', padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, backgroundColor: '#22c55e', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle size={20} style={{ color: 'white' }} />
            </div>
            <div>
              <p style={{ color: '#888', fontSize: 14 }}>Published</p>
              <p style={{ fontSize: 24, fontWeight: 'bold' }}>{loading ? '...' : stats.published}</p>
            </div>
          </div>
        </div>
        <div style={{ backgroundColor: '#1a1a1a', borderRadius: 12, border: '1px solid #333', padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, backgroundColor: '#eab308', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileVideo size={20} style={{ color: 'white' }} />
            </div>
            <div>
              <p style={{ color: '#888', fontSize: 14 }}>Drafts</p>
              <p style={{ fontSize: 24, fontWeight: 'bold' }}>{loading ? '...' : stats.drafts}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Clips List */}
      <div style={{ backgroundColor: '#1a1a1a', borderRadius: 12, border: '1px solid #333', padding: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>Your Clips</h2>
        
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Loading clips...</div>
        ) : clips.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>
            <Video size={48} style={{ marginBottom: 12, opacity: 0.5 }} />
            <p>No clips yet. Create your first clip to get started!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {clips.map((clip) => (
              <div 
                key={clip.id}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: 16, 
                  padding: 16, backgroundColor: '#0f0f0f', borderRadius: 8,
                  border: '1px solid #333'
                }}
              >
                {/* Thumbnail placeholder */}
                <div style={{ 
                  width: 120, height: 68, backgroundColor: '#222', borderRadius: 6,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Play size={24} style={{ color: '#666' }} />
                </div>
                
                {/* Clip Info */}
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{clip.title}</h3>
                  <div style={{ display: 'flex', gap: 12, fontSize: 13, color: '#888' }}>
                    <span>{clip.projectName || 'No project'}</span>
                    <span>•</span>
                    <span>{formatDate(clip.createdAt)}</span>
                    <span>•</span>
                    <span>{formatDuration((clip.endMs - clip.startMs) / 1000)}</span>
                  </div>
                </div>

                {/* Status */}
                <div style={{ 
                  padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500,
                  backgroundColor: getStatusColor(clip.status) + '20', color: getStatusColor(clip.status)
                }}>
                  {clip.status}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button style={{ padding: 8, background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
                    <Edit size={18} />
                  </button>
                  <button style={{ padding: 8, background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
                    <ExternalLink size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showCreateModal && (
        <div style={{ 
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
        }}>
          <div style={{
            backgroundColor: '#1a1a1a', borderRadius: 16, border: '1px solid #333',
            width: '100%', maxWidth: 560, maxHeight: '90vh', overflow: 'auto', padding: 24,
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, backgroundColor: '#3b82f6', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Zap size={20} style={{ color: 'white' }} />
                </div>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 'bold', margin: 0 }}>Create New Clip</h2>
                  <p style={{ fontSize: 14, color: '#888', margin: 0 }}>Select a video and configure clip settings</p>
                </div>
              </div>
              <button onClick={handleCloseModal} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', padding: 8 }}>
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitClip}>
              {/* Project */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 8 }}>
                  Project <span style={{ color: '#ef4444' }}>*</span>
                </label>
                
                {showCreateProject ? (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      type="text"
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      placeholder="Enter project name"
                      autoFocus
                      style={{ 
                        flex: 1, 
                        padding: 12, 
                        backgroundColor: '#0f0f0f', 
                        border: '1px solid #3b82f6', 
                        borderRadius: 8, 
                        color: 'white', 
                        fontSize: 14 
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleCreateProject();
                        }
                        if (e.key === 'Escape') {
                          setShowCreateProject(false);
                          setNewProjectName("");
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleCreateProject}
                      disabled={creatingProject}
                      style={{
                        padding: '12px 16px',
                        backgroundColor: '#3b82f6',
                        border: 'none',
                        borderRadius: 8,
                        color: 'white',
                        fontSize: 14,
                        fontWeight: 500,
                        cursor: creatingProject ? 'not-allowed' : 'pointer',
                        opacity: creatingProject ? 0.7 : 1,
                      }}
                    >
                      {creatingProject ? 'Creating...' : 'Create'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateProject(false);
                        setNewProjectName("");
                      }}
                      style={{
                        padding: '12px 16px',
                        backgroundColor: '#333',
                        border: 'none',
                        borderRadius: 8,
                        color: 'white',
                        fontSize: 14,
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : projects.length === 0 ? (
                  // No projects exist - show prominent create button
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: 12,
                    padding: 20, 
                    backgroundColor: '#0f0f0f', 
                    border: '2px dashed #3b82f6', 
                    borderRadius: 8,
                    textAlign: 'center'
                  }}>
                    <p style={{ color: '#888', fontSize: 14, margin: 0 }}>
                      No projects yet. Create your first project to get started.
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowCreateProject(true)}
                      style={{
                        padding: '12px 24px',
                        backgroundColor: '#3b82f6',
                        border: 'none',
                        borderRadius: 8,
                        color: 'white',
                        fontSize: 14,
                        fontWeight: 500,
                        cursor: 'pointer',
                        alignSelf: 'center',
                      }}
                    >
                      + Create Project
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <select
                      value={selectedProject}
                      onChange={(e) => setSelectedProject(e.target.value)}
                      required
                      style={{ flex: 1, padding: 12, backgroundColor: '#0f0f0f', border: '1px solid #333', borderRadius: 8, color: 'white', fontSize: 14 }}
                    >
                      <option value="">Select a project</option>
                      {projects.map((project) => (
                        <option key={project.id} value={project.id}>{project.name}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowCreateProject(true)}
                      style={{
                        padding: '12px 16px',
                        backgroundColor: '#22c55e',
                        border: 'none',
                        borderRadius: 8,
                        color: 'white',
                        fontSize: 14,
                        fontWeight: 500,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      + New Project
                    </button>
                  </div>
                )}
              </div>

              {/* Video Source */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 12 }}>
                  Video Source <span style={{ color: '#ef4444' }}>*</span>
                </label>
                
                {/* Tabs */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                  {['file', 'link', 'select'].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setUploadMode(mode as any)}
                      style={{
                        flex: 1, padding: '10px 16px',
                        backgroundColor: uploadMode === mode ? '#3b82f6' : '#0f0f0f',
                        border: `1px solid ${uploadMode === mode ? '#3b82f6' : '#333'}`,
                        borderRadius: 8, color: uploadMode === mode ? 'white' : '#888',
                        fontSize: 14, fontWeight: 500, cursor: 'pointer',
                      }}
                    >
                      {mode === 'file' ? 'Upload' : mode === 'link' ? 'Link' : 'Select'}
                    </button>
                  ))}
                </div>

                {/* File Upload */}
                {uploadMode === 'file' && (
                  <div>
                    <input
                      type="file"
                      id="file-upload"
                      accept="video/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setUploadState({ file, uploading: false, progress: 0, error: null });
                      }}
                      style={{ display: 'none' }}
                    />
                    <label
                      htmlFor="file-upload"
                      style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        padding: 32, backgroundColor: '#0f0f0f',
                        border: `2px dashed ${uploadState.file ? '#3b82f6' : '#333'}`,
                        borderRadius: 12, cursor: 'pointer',
                      }}
                    >
                      {uploadState.file ? (
                        <>
                          <FileVideo size={40} style={{ color: '#3b82f6', marginBottom: 12 }} />
                          <p style={{ fontSize: 14, marginBottom: 4 }}>{uploadState.file.name}</p>
                          <p style={{ fontSize: 12, color: '#888' }}>{(uploadState.file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </>
                      ) : (
                        <>
                          <Upload size={40} style={{ color: '#666', marginBottom: 12 }} />
                          <p style={{ fontSize: 14 }}>Click to upload video</p>
                          <p style={{ fontSize: 12, color: '#888' }}>MP4, MOV, AVI, WebM</p>
                        </>
                      )}
                    </label>
                  </div>
                )}

                {/* Video Link */}
                {uploadMode === 'link' && (
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="Paste YouTube, TikTok, or other video link..."
                    style={{ width: '100%', padding: 12, backgroundColor: '#0f0f0f', border: '1px solid #333', borderRadius: 8, color: 'white', fontSize: 14 }}
                  />
                )}

                {/* Select from uploads */}
                {uploadMode === 'select' && (
                  <div>
                    {videos.length === 0 ? (
                      <div style={{ padding: 20, backgroundColor: '#0f0f0f', border: '1px dashed #333', borderRadius: 8, textAlign: 'center' }}>
                        <p style={{ color: '#888' }}>No videos available</p>
                      </div>
                    ) : (
                      <select
                        value={selectedUpload}
                        onChange={(e) => setSelectedUpload(e.target.value)}
                        style={{ width: '100%', padding: 12, backgroundColor: '#0f0f0f', border: '1px solid #333', borderRadius: 8, color: 'white', fontSize: 14 }}
                      >
                        <option value="">Select a video</option>
                        {videos.map((video) => (
                          <option key={video.id} value={video.id}>
                            {video.name} ({formatDuration(video.durationSec)})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                )}
              </div>

              {/* Title */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 8 }}>Clip Title</label>
                <input
                  type="text"
                  value={clipTitle}
                  onChange={(e) => setClipTitle(e.target.value)}
                  placeholder="Enter clip title (optional)"
                  style={{ width: '100%', padding: 12, backgroundColor: '#0f0f0f', border: '1px solid #333', borderRadius: 8, color: 'white', fontSize: 14 }}
                />
              </div>

              {/* Time Range */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 8 }}>Start Time (seconds)</label>
                  <input
                    type="number"
                    min="0"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    style={{ width: '100%', padding: 12, backgroundColor: '#0f0f0f', border: '1px solid #333', borderRadius: 8, color: 'white', fontSize: 14 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 8 }}>End Time (seconds)</label>
                  <input
                    type="number"
                    min="0"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    style={{ width: '100%', padding: 12, backgroundColor: '#0f0f0f', border: '1px solid #333', borderRadius: 8, color: 'white', fontSize: 14 }}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  style={{ padding: '12px 24px', backgroundColor: 'transparent', border: '1px solid #333', borderRadius: 8, color: 'white', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || (uploadMode === 'select' && (!selectedProject || !selectedUpload)) || (uploadMode === 'file' && !uploadState.file) || (uploadMode === 'link' && !videoUrl)}
                  style={{ padding: '12px 24px', backgroundColor: creating ? '#666' : '#3b82f6', border: 'none', borderRadius: 8, color: 'white', fontSize: 14, fontWeight: 500, cursor: creating ? 'not-allowed' : 'pointer' }}
                >
                  {creating ? 'Creating...' : 'Create Clip'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
