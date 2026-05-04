"use client";

import { useState, useEffect, useCallback } from "react";
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
  Loader2,
  Video
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
  projectId?: string;
  clipId?: string;
  mediaUrls?: string[];
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
}

// Platform icons as SVG components
const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const TwitchIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
  </svg>
);

const RumbleIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-6.71 4.342c-.355.23-.81.11-1.016-.266-.093-.17-.116-.37-.065-.554.05-.184.16-.34.303-.43l.002-.001c.198-.123.44-.166.677-.12l.013.002.013.002 6.71-2.41c.355-.127.72-.044.978.177.19.163.283.417.244.677-.04.26-.193.485-.42.615l-.012.007zm-2.428 1.553L7.43 15.05c-.532.344-1.185.402-1.75.154-.563-.247-.943-.78-1.016-1.428-.073-.648.154-1.29.608-1.714l1.83-1.683c.093-.086.21-.128.33-.128.12 0 .237.042.33.128l6.71 3.19c.093.044.166.115.21.202.044.087.058.187.042.283-.016.097-.058.186-.116.263l-.003.002c-.08.105-.2.17-.33.17-.063 0-.127-.017-.186-.05l-.007-.004zm.856 3.43l-5.355 2.17c-.62.252-1.322.18-1.876-.192-.553-.372-.89-.99-.9-1.653-.01-.662.297-1.29.82-1.683l3.104-2.325c.093-.07.21-.108.33-.108.12 0 .237.038.33.108l3.876 2.57c.093.062.166.145.21.238.044.093.06.2.044.303-.016.103-.058.196-.116.27l-.003.002c-.085.107-.208.175-.34.175-.063 0-.127-.018-.186-.052l-.01-.005z"/>
  </svg>
);

const VimeoIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881L5.322 11.4C4.603 8.816 3.834 7.522 3.01 7.522c-.179 0-.806.378-1.881 1.132L0 7.197c1.185-1.044 2.351-2.084 3.501-3.128C5.08 2.701 6.266 1.984 7.055 1.91c1.867-.18 3.016 1.1 3.447 3.838.465 2.953.789 4.789.971 5.507.539 2.45 1.131 3.674 1.776 3.674.502 0 1.256-.796 2.265-2.385 1.004-1.589 1.54-2.797 1.612-3.628.144-1.371-.395-2.061-1.614-2.061-.574 0-1.167.121-1.777.391 1.186-3.868 3.434-5.757 6.762-5.637 2.473.06 3.628 1.664 3.493 4.797l-.013.01z"/>
  </svg>
);

const platforms = [
 { name: "YouTube", icon: "YouTube", color: "#FF0000", connected: true, username: "@podcastclips" },
  { name: "TikTok", icon: "TikTok", color: "#000000", connected: true, username: "@podcastclips" },
  { name: "Instagram", icon: "Instagram", color: "#E1306C", connected: false },
  { name: "Facebook", icon: "Facebook", color: "#1877F2", connected: false },
  { name: "LinkedIn", icon: "LinkedIn", color: "#0A66C2", connected: true, username: "Podcast Clips" },
  { name: "X", icon: "X", color: "#1DA1F2", connected: false },

];
// Pro platforms for non-pro users
const proPlatforms = [
  { name: "YouTube Pro", icon: YouTubeIcon, color: "#FF0000" },
  { name: "TikTok Pro", icon: TikTokIcon, color: "#000000" },
  { name: "Instagram Pro", icon: InstagramIcon, color: "#E1306C" },
  { name: "Facebook Pro", icon: FacebookIcon, color: "#1877F2" },
  { name: "LinkedIn Pro", icon: LinkedInIcon, color: "#0A66C2" },
  { name: "X Pro", icon: XIcon, color: "#1DA1F2" },
];

export default function CalendarPage() {
  const [showBetaModal, setShowBetaModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [projects, setProjects] = useState<{id: string; name: string}[]>([]);
  const [clips, setClips] = useState<{id: string; title: string}[]>([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedClip, setSelectedClip] = useState("");
  const [selectedPost, setSelectedPost] = useState<ScheduledPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  // Current date state for calendar
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Upload form state
  const [uploadDate, setUploadDate] = useState("");
  const [uploadTime, setUploadTime] = useState("12:00");
  const [uploadCaption, setUploadCaption] = useState("");
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

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
    fetchClips();
  }, []);

  // Get user ID from session (mock for now)
  const getUserId = () => {
    // In production, get from session
    return localStorage.getItem("userId") || "demo-user";
  };

  const fetchProjects = async () => {
    try {
      const workspaceId = localStorage.getItem("workspaceId") || "demo-workspace";
      const response = await fetch(`/api/projects?workspaceId=${workspaceId}`);
      
      if (!response.ok) {
        console.error("Failed to fetch projects:", response.status);
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

  const fetchClips = async () => {
    try {
      const workspaceId = localStorage.getItem("workspaceId") || "demo-workspace";
      const response = await fetch(`/api/clips?workspaceId=${workspaceId}&status=READY`);
      
      if (!response.ok) {
        console.error("Failed to fetch clips:", response.status);
        return;
      }
      
      const data = await response.json();
      if (data.clips) {
        setClips(data.clips);
      }
    } catch (error) {
      console.error("Failed to fetch clips:", error);
    }
  };

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const workspaceId = localStorage.getItem("workspaceId") || "demo-workspace";
      const response = await fetch(`/api/scheduled-posts?workspaceId=${workspaceId}`);
      
      if (!response.ok) {
        console.error("Failed to fetch posts:", response.status);
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
    
    const workspaceId = localStorage.getItem("workspaceId");
    if (!workspaceId) {
      alert("Workspace not found. Please log in again.");
      return;
    }
    
    setIsSaving(true);
    try {
      const userId = getUserId();
      const scheduledAt = new Date(`${formScheduledDate}T${formScheduledTime}:00`).toISOString();
      
      const response = await fetch("/api/scheduled-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId,
          userId,
          title: formTitle,
          description: formDescription,
          platform: formPlatform,
          scheduledAt,
          caption: formCaption,
          projectId: selectedProject,
          clipId: selectedClip || undefined,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to create post");
      }
      
      if (data.post) {
        setPosts([...posts, data.post]);
        setShowScheduleModal(false);
        resetForm();
        setSelectedClip("");
        // Show success message
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
        alert("Post scheduled successfully!");
      }
    } catch (error) {
      console.error("Failed to create post:", error);
      alert(error instanceof Error ? error.message : "Failed to create post");
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
    
    const workspaceId = localStorage.getItem("workspaceId");
    if (!workspaceId) {
      alert("Workspace not found. Please log in again.");
      return;
    }
    
    setIsSaving(true);
    setUploadProgress(0);
    
    try {
      const userId = getUserId();
      const scheduledAt = new Date(`${uploadDate}T${uploadTime}:00`).toISOString();
      
      // First, upload the file to the server
      const file = uploadedFiles[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("workspaceId", workspaceId);
      formData.append("userId", userId);
      
      setUploadProgress(30);
      
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      
      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file");
      }
      
      const uploadData = await uploadResponse.json();
      setUploadProgress(60);
      
      // Then create the scheduled post with the uploaded file info
      const response = await fetch("/api/scheduled-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId,
          userId,
          title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
          description: "Uploaded video",
          platform: selectedPlatform || "YOUTUBE",
          scheduledAt,
          caption: uploadCaption,
          mediaUrls: [uploadData.asset.url || uploadData.asset.s3Key],
        }),
      });
      
      setUploadProgress(90);
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to schedule post");
      }
      
      if (data.post) {
        setPosts([...posts, data.post]);
        setShowUploadModal(false);
        setUploadedFiles([]);
        setUploadDate("");
        setUploadTime("12:00");
        setSelectedPlatform("");
        setUploadCaption("");
        // Show success message
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
        alert("Video uploaded and scheduled successfully!");
      }
    } catch (error) {
      console.error("Failed to schedule upload:", error);
      alert(error instanceof Error ? error.message : "Failed to schedule upload");
    } finally {
      setIsSaving(false);
      setUploadProgress(null);
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
        
        {/* Success Message */}
        {showSuccessMessage && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 20px",
            backgroundColor: "#10B981",
            borderRadius: "8px",
            color: "white",
            fontWeight: 500,
          }}>
            <CheckCircle2 size={20} />
            Post scheduled successfully!
          </div>
        )}
        
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
                  Select Video Clip
                </label>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>
                  Select an existing video clip to schedule.
                </p>
                <select
                  value={selectedClip}
                  onChange={(e) => setSelectedClip(e.target.value)}
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
                  <option value="">Select a clip...</option>
                  {clips.map((clip) => (
                    <option key={clip.id} value={clip.id}>
                      {clip.title}
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
                    <option key={platform.name} value={platform.name}>
                      {platform.icon} {platform.label}
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
                          {platforms.find(p => p.name.toLowerCase() === post.platform.toLowerCase())?.icon || "ðŸ“¹"}
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
            width: "100%",
            maxHeight: "80vh",
            overflowY: "auto"
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
                      {platform.label}
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

            {/* Caption */}
            {uploadedFiles.length > 0 && (
              <div style={{ marginTop: "24px" }}>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "white", marginBottom: "12px" }}>
                  Caption
                </label>
                <textarea
                  value={uploadCaption}
                  onChange={(e) => setUploadCaption(e.target.value)}
                  placeholder="Enter caption for your video post..."
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
                    opacity: isSaving ? 0.7 : 1,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      {uploadProgress ? `${uploadProgress}%` : "Uploading..."}
                    </>
                  ) : (
                    "Schedule Post"
                  )}
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
                    {platforms.find(p => p.name.toLowerCase() === post.platform.toLowerCase())?.icon || "ðŸ“¹"}
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

      {/* Floating Action Button (FAB) - Quick Add */}
      <button
        onClick={() => setShowDatePickerModal(true)}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          backgroundColor: "var(--primary)",
          border: "none",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          zIndex: 100,
          transition: "transform 0.2s, box-shadow 0.2s"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.3)";
        }}
        title="Quick Add"
      >
        <Plus size={24} />
      </button>
    </div>
  );
}
