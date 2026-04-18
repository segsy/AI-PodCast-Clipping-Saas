"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Image, 
  Sparkles, 
  Download, 
  Copy, 
  RefreshCw, 
  Palette,
  Square,
  Type,
  Zap,
  Clock,
  Check,
  X,
  Upload,
  Wand2,
  AlertCircle,
  FileVideo,
  CloudUpload,
  Loader2,
  FolderOpen
} from "lucide-react";

interface ThumbnailJob {
  id: string;
  status: string;
  style: string;
  aspectRatio: string;
  titleText: string;
  aiModel: string;
  creditsUsed: number;
  generatedVariants: string[];
  errorMessage: string | null;
  createdAt: string;
  filename: string | null;
}

const thumbnailStyles = [
  { id: "vibrant", name: "Vibrant", color: "#FF6B6B" },
  { id: "minimal", name: "Minimal", color: "#4ECDC4" },
  { id: "bold", name: "Bold", color: "#45B7D1" },
  { id: "gradient", name: "Gradient", color: "#96E6A1" },
  { id: "dark", name: "Dark", color: "#DDA0DD" },
  { id: "neon", name: "Neon", color: "#FFD93D" },
];

const aspectRatios = [
  { id: "16:9", name: "YouTube", icon: "16:9" },
  { id: "9:16", name: "Shorts/Reels", icon: "9:16" },
  { id: "1:1", name: "Square", icon: "1:1" },
  { id: "4:5", name: "Instagram", icon: "4:5" },
];

const aiModels = [
  { id: "gemini", name: "Gemini", description: "Google's best model" },
  { id: "openai", name: "OpenAI", description: "GPT-4 powered" },
  { id: "anthropic", name: "Anthropic", description: "Claude powered" },
];

const CREDIT_COST_PER_THUMBNAIL = 10;

export default function AIThumbnailPage() {
  const [selectedStyle, setSelectedStyle] = useState("vibrant");
  const [selectedRatio, setSelectedRatio] = useState("16:9");
  const [titleText, setTitleText] = useState("");
  const [addTitle, setAddTitle] = useState(true);
  const [addEpisodeNumber, setAddEpisodeNumber] = useState(true);
  const [addGlowEffect, setAddGlowEffect] = useState(false);
  const [selectedAiModel, setSelectedAiModel] = useState("gemini");
  const [selectedUploadId, setSelectedUploadId] = useState<string | null>(null);
  const [availableUploads, setAvailableUploads] = useState<any[]>([]);
  const [credits, setCredits] = useState(0);
  const [monthlyUsed, setMonthlyUsed] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [jobs, setJobs] = useState<ThumbnailJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [projects, setProjects] = useState<{id: string, name: string}[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchProjects = async () => {
    try {
      const workspaceId = localStorage.getItem("workspaceId") || "demo-workspace";
      const response = await fetch(`/api/projects?workspaceId=${workspaceId}`);
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
        if (data.projects?.length > 0) {
          setSelectedProject(data.projects[0].id);
        }
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile || !selectedProject) {
      setError("Please select a file and project");
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      setUploadProgress(0);

      // For demo purposes, simulate upload progress
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
      
      // Simulate upload completion
      await new Promise(resolve => setTimeout(resolve, 2000));
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Create upload record in database
      const uploadResponse = await fetch('/api/uploads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId: workspaceId,
          projectId: selectedProject,
          filename: uploadFile.name,
          contentType: uploadFile.type,
          bytes: uploadFile.size,
          s3Key: `uploads/${Date.now()}_${uploadFile.name}`,
          durationSec: Math.floor(Math.random() * 600) + 60
        })
      });

      if (uploadResponse.ok) {
        const uploadData = await uploadResponse.json();
        setAvailableUploads(prev => [uploadData, ...prev]);
        setSelectedUploadId(uploadData.id);
        
        setTimeout(() => {
          setShowUploadModal(false);
          setUploadFile(null);
          setUploadProgress(0);
        }, 500);
      } else {
        const errData = await uploadResponse.json();
        setError(errData.error || 'Failed to create upload record');
      }
    } catch (err) {
      setError('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const openUploadModal = async () => {
    await fetchProjects();
    setShowUploadModal(true);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch thumbnail jobs
      const jobsResponse = await fetch('/api/thumbnails');
      if (jobsResponse.ok) {
        const jobsData = await jobsResponse.json();
        setJobs(jobsData.jobs || []);
        setCredits(jobsData.credits || 0);
      }

      // Fetch uploads for selection
      const workspaceId = localStorage.getItem("workspaceId") || "demo-workspace";
      const uploadsResponse = await fetch(`/api/uploads?workspaceId=${workspaceId}&status=UPLOAD_COMPLETE`);
      if (uploadsResponse.ok) {
        const uploadsData = await uploadsResponse.json();
        setAvailableUploads(uploadsData.uploads || []);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedUploadId) {
      setError("Please select a video first");
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);

      const response = await fetch('/api/thumbnails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uploadId: selectedUploadId,
          style: selectedStyle,
          aspectRatio: selectedRatio,
          titleText,
          addTitle,
          addEpisodeNumber,
          addGlowEffect,
          aiModel: selectedAiModel,
          variants: 3
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to generate thumbnails');
        return;
      }

      // Refresh jobs
      await fetchData();
    } catch (err) {
      setError('Failed to generate thumbnails');
    } finally {
      setIsGenerating(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  const selectedUpload = availableUploads.find(u => u.id === selectedUploadId);
  const estimatedCredits = CREDIT_COST_PER_THUMBNAIL * 3; // 3 variants

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Page header */}
      <div>
        <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>AI PodCast Thumbnail</h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>Generate eye-catching thumbnails for your podcast videos</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "24px" }}>
        {/* Main Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Thumbnail Generator */}
          <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "24px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "20px", color: "white", display: "flex", alignItems: "center", gap: "8px" }}>
              <Wand2 size={20} style={{ color: "var(--primary)" }} />
              Generate Thumbnail
            </h2>

            {error && (
              <div style={{
                padding: "12px",
                backgroundColor: "var(--error)",
                borderRadius: "8px",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "white"
              }}>
                <AlertCircle size={18} />
                {error}
              </div>
            )}
            
            {/* Video Selection */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: 500, marginBottom: "8px", color: "white" }}>
                Select Video
              </label>
              <div style={{ display: "flex", gap: "8px" }}>
                <select
                  value={selectedUploadId || ""}
                  onChange={(e) => setSelectedUploadId(e.target.value || null)}
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    backgroundColor: "var(--surface-hover)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "14px"
                  }}
                >
                  <option value="">Choose a video...</option>
                  {availableUploads.map((upload) => (
                    <option key={upload.id} value={upload.id}>
                      {upload.filename}
                    </option>
                  ))}
                </select>
                <button
                  onClick={openUploadModal}
                  style={{
                    padding: "12px 16px",
                    backgroundColor: "var(--primary)",
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "14px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    whiteSpace: "nowrap"
                  }}
                >
                  <Upload size={16} />
                  Upload
                </button>
              </div>
            </div>
            
            {/* Thumbnail Preview */}
            <div style={{
              width: "100%",
              aspectRatio: selectedRatio === "16:9" ? "16/9" : selectedRatio === "9:16" ? "9/16" : selectedRatio === "1:1" ? "1/1" : "4/5",
              backgroundColor: "var(--background)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "20px",
              position: "relative",
              maxHeight: "400px"
            }}>
              <div style={{ textAlign: "center" }}>
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
                  <Image size={28} style={{ color: "white" }} />
                </div>
                <p style={{ color: "var(--text-muted)", marginBottom: "8px" }}>
                  {selectedUpload ? selectedUpload.filename : "Select a video to generate thumbnails"}
                </p>
              </div>
              
              {/* Thumbnail Overlay */}
              {selectedUpload && (
                <div style={{
                  position: "absolute",
                  inset: 0,
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center"
                }}>
                  <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "white", textAlign: "center", textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}>
                    {titleText || "YOUR PODCAST TITLE"}
                  </h3>
                  <p style={{ fontSize: "16px", color: "white", marginTop: "8px", textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}>
                    Episode #45
                  </p>
                </div>
              )}
            </div>

            {/* Text Input */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: 500, marginBottom: "8px", color: "white" }}>
                Title Text
              </label>
              <input
                type="text"
                placeholder="Enter your thumbnail title..."
                value={titleText}
                onChange={(e) => setTitleText(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  backgroundColor: "var(--surface-hover)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "white",
                  fontSize: "14px"
                }}
              />
            </div>

            {/* AI Model Selection */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: 500, marginBottom: "8px", color: "white" }}>
                AI Model
              </label>
              <div style={{ display: "flex", gap: "8px" }}>
                {aiModels.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => setSelectedAiModel(model.id)}
                    style={{
                      flex: 1,
                      padding: "12px",
                      backgroundColor: selectedAiModel === model.id ? "var(--primary)" : "var(--surface-hover)",
                      border: `1px solid ${selectedAiModel === model.id ? "var(--primary)" : "var(--border)"}`,
                      borderRadius: "8px",
                      cursor: "pointer",
                      textAlign: "center"
                    }}
                  >
                    <div style={{ fontWeight: 500, color: "white", marginBottom: "2px" }}>{model.name}</div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{model.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Credit Estimate */}
            {selectedUpload && (
              <div style={{
                padding: "12px",
                backgroundColor: "var(--surface-hover)",
                borderRadius: "8px",
                marginBottom: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <span style={{ color: "var(--text-muted)", fontSize: "14px" }}>Estimated credits (3 variants):</span>
                <span style={{ color: "white", fontWeight: 600 }}>{estimatedCredits} credits</span>
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !selectedUploadId}
              style={{
                width: "100%",
                padding: "14px",
                backgroundColor: isGenerating || !selectedUploadId ? "var(--surface-hover)" : "var(--primary)",
                border: "none",
                borderRadius: "8px",
                color: "white",
                fontWeight: 600,
                fontSize: "16px",
                cursor: isGenerating || !selectedUploadId ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px"
              }}
            >
              {isGenerating ? (
                <>
                  <RefreshCw size={20} className="animate-spin" />
                  Generating Thumbnails...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Generate with AI
                </>
              )}
            </button>
          </div>

          {/* Recent Thumbnails */}
          <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: "16px", fontWeight: "600", color: "white" }}>Recent Thumbnails</h2>
            </div>
            {loading ? (
              <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
                <RefreshCw size={24} className="animate-spin" style={{ margin: "0 auto" }} />
              </div>
            ) : jobs.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
                No thumbnails generated yet
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column" }}>
                {jobs.slice(0, 5).map((job) => (
                  <div
                    key={job.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px 20px",
                      borderBottom: "1px solid var(--border)"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <div style={{
                        width: "80px",
                        aspectRatio: "16/9",
                        backgroundColor: "var(--surface-hover)",
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <Image size={20} style={{ color: "var(--text-muted)" }} />
                      </div>
                      <div>
                        <p style={{ fontWeight: 500, color: "white" }}>{job.filename || 'Untitled'}</p>
                        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "2px" }}>{job.style}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{
                        padding: "4px 10px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: 500,
                        backgroundColor: job.status === "COMPLETED" ? "var(--success)20" : 
                                        job.status === "PROCESSING" ? "var(--warning)20" : 
                                        job.status === "FAILED" ? "var(--error)20" : "var(--surface-hover)",
                        color: job.status === "COMPLETED" ? "var(--success)" : 
                              job.status === "PROCESSING" ? "var(--warning)" : 
                              job.status === "FAILED" ? "var(--error)" : "var(--text-muted)"
                      }}>
                        {job.status === "COMPLETED" ? "Completed" : 
                         job.status === "PROCESSING" ? "Processing" :
                         job.status === "FAILED" ? "Failed" : "Pending"}
                      </span>
                      <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>{formatDate(job.createdAt)}</span>
                      {job.status === "COMPLETED" && (
                        <button style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                          <Download size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Settings Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Thumbnail Style */}
          <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "20px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "16px", color: "white", display: "flex", alignItems: "center", gap: "8px" }}>
              <Palette size={16} />
              Thumbnail Style
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
              {thumbnailStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  style={{
                    padding: "12px",
                    backgroundColor: selectedStyle === style.id ? style.color + "30" : "var(--surface-hover)",
                    border: `2px solid ${selectedStyle === style.id ? style.color : "var(--border)"}`,
                    borderRadius: "8px",
                    cursor: "pointer",
                    textAlign: "center"
                  }}
                >
                  <div style={{ 
                    width: "24px", 
                    height: "24px", 
                    backgroundColor: style.color, 
                    borderRadius: "50%", 
                    margin: "0 auto 4px" 
                  }} />
                  <div style={{ fontSize: "11px", color: "white" }}>
                    {style.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio */}
          <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "20px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "16px", color: "white", display: "flex", alignItems: "center", gap: "8px" }}>
              <Square size={16} />
              Aspect Ratio
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
              {aspectRatios.map((ratio) => (
                <button
                  key={ratio.id}
                  onClick={() => setSelectedRatio(ratio.id)}
                  style={{
                    padding: "12px",
                    backgroundColor: selectedRatio === ratio.id ? "var(--primary)" : "var(--surface-hover)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    cursor: "pointer",
                    textAlign: "center"
                  }}
                >
                  <div style={{ fontSize: "16px", fontWeight: "bold", color: "white", marginBottom: "2px" }}>
                    {ratio.icon}
                  </div>
                  <div style={{ fontSize: "11px", color: selectedRatio === ratio.id ? "white" : "var(--text-muted)" }}>
                    {ratio.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Text Options */}
          <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "20px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "16px", color: "white", display: "flex", alignItems: "center", gap: "8px" }}>
              <Type size={16} />
              Text Options
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Add title</span>
                <input 
                  type="checkbox" 
                  checked={addTitle}
                  onChange={(e) => setAddTitle(e.target.checked)}
                  style={{ width: "18px", height: "18px", accentColor: "var(--primary)" }} 
                />
              </label>
              <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Add episode number</span>
                <input 
                  type="checkbox" 
                  checked={addEpisodeNumber}
                  onChange={(e) => setAddEpisodeNumber(e.target.checked)}
                  style={{ width: "18px", height: "18px", accentColor: "var(--primary)" }} 
                />
              </label>
              <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Add glow effect</span>
                <input 
                  type="checkbox" 
                  checked={addGlowEffect}
                  onChange={(e) => setAddGlowEffect(e.target.checked)}
                  style={{ width: "18px", height: "18px", accentColor: "var(--primary)" }} 
                />
              </label>
            </div>
          </div>

          {/* Credits Info */}
          <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
              <Zap size={18} style={{ color: "var(--primary)" }} />
              <span style={{ fontSize: "14px", fontWeight: 500, color: "white" }}>Credits Usage</span>
            </div>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "12px" }}>
              Generating thumbnails costs <span style={{ color: "white", fontWeight: 600 }}>{CREDIT_COST_PER_THUMBNAIL} credits</span> per thumbnail.
            </p>
            <div style={{ padding: "12px", backgroundColor: "var(--surface-hover)", borderRadius: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>Available Credits</span>
                <span style={{ fontSize: "14px", fontWeight: 600, color: "white" }}>{credits.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>This Month</span>
                <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--primary)" }}>{monthlyUsed} used</span>
              </div>
            </div>
          </div>
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
            maxWidth: "500px",
            padding: "24px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "600", color: "white", display: "flex", alignItems: "center", gap: "8px" }}>
                <Upload size={20} style={{ color: "var(--primary)" }} />
                Upload Video
              </h2>
              <button
                onClick={() => { setShowUploadModal(false); setUploadFile(null); }}
                style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            {error && (
              <div style={{
                padding: "12px",
                backgroundColor: "var(--error)",
                borderRadius: "8px",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "white",
                fontSize: "14px"
              }}>
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            {/* Project Selection */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: 500, marginBottom: "8px", color: "white" }}>
                Select Project
              </label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  backgroundColor: "var(--surface-hover)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "white",
                  fontSize: "14px"
                }}
              >
                <option value="">Choose a project...</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            {/* File Drop Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${uploadFile ? "var(--primary)" : "var(--border)"}`,
                borderRadius: "12px",
                padding: "32px",
                textAlign: "center",
                cursor: "pointer",
                backgroundColor: "var(--surface-hover)",
                marginBottom: "20px",
                transition: "all 0.2s"
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*,image/*"
                onChange={handleFileSelect}
                style={{ display: "none" }}
              />
              {uploadFile ? (
                <div>
                  <FileVideo size={48} style={{ color: "var(--primary)", margin: "0 auto 12px" }} />
                  <p style={{ color: "white", fontWeight: 500, marginBottom: "4px" }}>{uploadFile.name}</p>
                  <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
                    {(uploadFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div>
                  <CloudUpload size={48} style={{ color: "var(--text-muted)", margin: "0 auto 12px" }} />
                  <p style={{ color: "white", fontWeight: 500, marginBottom: "4px" }}>
                    Click to upload or drag and drop
                  </p>
                  <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
                    MP4, MOV, PNG, JPG up to 10MB
                  </p>
                </div>
              )}
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>Uploading...</span>
                  <span style={{ fontSize: "13px", color: "var(--primary)" }}>{uploadProgress}%</span>
                </div>
                <div style={{ width: "100%", height: "6px", backgroundColor: "var(--surface-hover)", borderRadius: "3px", overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${uploadProgress}%`,
                      height: "100%",
                      backgroundColor: "var(--primary)",
                      borderRadius: "3px",
                      transition: "width 0.2s"
                    }}
                  />
                </div>
              </div>
            )}

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={isUploading || !uploadFile || !selectedProject}
              style={{
                width: "100%",
                padding: "14px",
                backgroundColor: isUploading || !uploadFile || !selectedProject ? "var(--surface-hover)" : "var(--primary)",
                border: "none",
                borderRadius: "8px",
                color: "white",
                fontWeight: 600,
                fontSize: "16px",
                cursor: isUploading || !uploadFile || !selectedProject ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px"
              }}
            >
              {isUploading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={20} />
                  Upload Video
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
