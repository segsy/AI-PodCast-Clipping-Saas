"use client";

import { useState, useEffect } from "react";
import { 
  FileText, 
  Play, 
  Pause, 
  Download, 
  Trash2, 
  Copy, 
  RefreshCw,
  Clock,
  Check,
  Type,
  Music,
  StickyNote,
  Sparkles,
  Upload,
  AlertCircle
} from "lucide-react";

interface CaptionJob {
  id: string;
  status: string;
  style: string;
  fontSize: string;
  showTimestamps: boolean;
  aiModel: string;
  creditsUsed: number;
  durationSec: number | null;
  errorMessage: string | null;
  createdAt: string;
  filename: string | null;
}

const captionStyles = [
  { id: "modern", name: "Modern", preview: "Aa" },
  { id: "classic", name: "Classic", preview: "Ab" },
  { id: "bold", name: "Bold", preview: "aB" },
  { id: "minimal", name: "Minimal", preview: "--" },
  { id: "neon", name: "Neon", preview: "N-" },
  { id: "handwritten", name: "Handwritten", preview: "✎" },
];

const aiModels = [
  { id: "gemini", name: "Gemini", description: "Google's best model" },
  { id: "openai", name: "OpenAI", description: "GPT-4 powered" },
  { id: "anthropic", name: "Anthropic", description: "Claude powered" },
];

const CREDIT_COST_PER_MINUTE = 5;

export default function AICaptionsPage() {
  const [selectedStyle, setSelectedStyle] = useState("modern");
  const [fontSize, setFontSize] = useState("medium");
  const [showTimestamps, setShowTimestamps] = useState(true);
  const [speakerIdentification, setSpeakerIdentification] = useState(true);
  const [soundEffects, setSoundEffects] = useState(false);
  const [selectedAiModel, setSelectedAiModel] = useState("gemini");
  const [selectedUploadId, setSelectedUploadId] = useState<string | null>(null);
  const [availableUploads, setAvailableUploads] = useState<any[]>([]);
  const [credits, setCredits] = useState(0);
  const [monthlyUsed, setMonthlyUsed] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [jobs, setJobs] = useState<CaptionJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch caption jobs
      const jobsResponse = await fetch('/api/captions');
      if (jobsResponse.ok) {
        const jobsData = await jobsResponse.json();
        setJobs(jobsData.jobs || []);
        setCredits(jobsData.credits || 0);
      }

      // Fetch uploads for selection
      const uploadsResponse = await fetch('/api/uploads?status=UPLOAD_COMPLETE');
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

  const handleGenerateCaptions = async () => {
    if (!selectedUploadId) {
      setError("Please select a video first");
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      const response = await fetch('/api/captions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uploadId: selectedUploadId,
          style: selectedStyle,
          fontSize,
          showTimestamps,
          speakerIdentification,
          soundEffects,
          aiModel: selectedAiModel
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to generate captions');
        return;
      }

      // Refresh jobs
      await fetchData();
    } catch (err) {
      setError('Failed to generate captions');
    } finally {
      setIsProcessing(false);
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
  const estimatedCredits = selectedUpload?.durationSec 
    ? Math.ceil((selectedUpload.durationSec / 60) * CREDIT_COST_PER_MINUTE)
    : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Page header */}
      <div>
        <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>AI PodCast Captions</h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>Generate AI-powered captions for your podcast videos</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "24px" }}>
        {/* Main Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Caption Generator */}
          <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "24px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "20px", color: "white", display: "flex", alignItems: "center", gap: "8px" }}>
              <Sparkles size={20} style={{ color: "var(--primary)" }} />
              Generate Captions
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
              <select
                value={selectedUploadId || ""}
                onChange={(e) => setSelectedUploadId(e.target.value || null)}
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
                <option value="">Choose a video...</option>
                {availableUploads.map((upload) => (
                  <option key={upload.id} value={upload.id}>
                    {upload.filename} ({formatDuration(upload.durationSec)})
                  </option>
                ))}
              </select>
            </div>

            {/* Video Preview */}
            <div style={{
              width: "100%",
              aspectRatio: "16/9",
              backgroundColor: "var(--background)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "20px",
              position: "relative"
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
                  <Play size={28} style={{ color: "white", marginLeft: "4px" }} />
                </div>
                <p style={{ color: "var(--text-muted)" }}>
                  {selectedUpload ? selectedUpload.filename : "Select a video to generate captions"}
                </p>
              </div>
              
              {/* Caption Overlay Preview */}
              <div style={{
                position: "absolute",
                bottom: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                padding: "8px 16px",
                backgroundColor: "rgba(0,0,0,0.8)",
                borderRadius: "8px",
                maxWidth: "80%"
              }}>
                <p style={{ color: "white", fontSize: "16px", textAlign: "center" }}>
                  [Captions will appear here]
                </p>
              </div>
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
                <span style={{ color: "var(--text-muted)", fontSize: "14px" }}>Estimated credits:</span>
                <span style={{ color: "white", fontWeight: 600 }}>{estimatedCredits} credits</span>
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerateCaptions}
              disabled={isProcessing || !selectedUploadId}
              style={{
                width: "100%",
                padding: "14px",
                backgroundColor: isProcessing || !selectedUploadId ? "var(--surface-hover)" : "var(--primary)",
                border: "none",
                borderRadius: "8px",
                color: "white",
                fontWeight: 600,
                fontSize: "16px",
                cursor: isProcessing || !selectedUploadId ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px"
              }}
            >
              {isProcessing ? (
                <>
                  <RefreshCw size={20} className="animate-spin" />
                  Generating Captions...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Generate Captions with AI
                </>
              )}
            </button>
          </div>

          {/* Recent Captions */}
          <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: "16px", fontWeight: "600", color: "white" }}>Recent Captions</h2>
            </div>
            {loading ? (
              <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
                <RefreshCw size={24} className="animate-spin" style={{ margin: "0 auto" }} />
              </div>
            ) : jobs.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
                No captions generated yet
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
                      padding: "16px 20px",
                      borderBottom: "1px solid var(--border)",
                      transition: "background-color 0.2s"
                    }}
                    className="hover:bg-surface-hover"
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <div style={{
                        width: "48px",
                        height: "48px",
                        backgroundColor: "var(--surface-hover)",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <FileText size={20} style={{ color: "var(--primary)" }} />
                      </div>
                      <div>
                        <p style={{ fontWeight: 500, color: "white" }}>{job.filename || 'Untitled'}</p>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                          <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>{formatDuration(job.durationSec)}</span>
                          <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>•</span>
                          <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>{job.style}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
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
                        <div style={{ display: "flex", gap: "4px" }}>
                          <button style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "4px" }}>
                            <Copy size={16} />
                          </button>
                          <button style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "4px" }}>
                            <Download size={16} />
                          </button>
                        </div>
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
          {/* Caption Style */}
          <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "20px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "16px", color: "white", display: "flex", alignItems: "center", gap: "8px" }}>
              <Type size={16} />
              Caption Style
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
              {captionStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  style={{
                    padding: "12px",
                    backgroundColor: selectedStyle === style.id ? "var(--primary)" : "var(--surface-hover)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all 0.2s"
                  }}
                >
                  <div style={{ fontSize: "20px", fontWeight: "bold", color: "white", marginBottom: "4px" }}>
                    {style.preview}
                  </div>
                  <div style={{ fontSize: "11px", color: selectedStyle === style.id ? "white" : "var(--text-muted)" }}>
                    {style.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "20px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "16px", color: "white" }}>Font Size</h3>
            <div style={{ display: "flex", gap: "8px" }}>
              {["small", "medium", "large"].map((size) => (
                <button
                  key={size}
                  onClick={() => setFontSize(size)}
                  style={{
                    flex: 1,
                    padding: "8px",
                    backgroundColor: fontSize === size ? "var(--primary)" : "var(--surface-hover)",
                    border: "1px solid var(--border)",
                    borderRadius: "6px",
                    color: "white",
                    fontSize: "13px",
                    cursor: "pointer",
                    textTransform: "capitalize"
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Options */}
          <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "20px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "16px", color: "white" }}>Options</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Show timestamps</span>
                <input 
                  type="checkbox" 
                  checked={showTimestamps}
                  onChange={(e) => setShowTimestamps(e.target.checked)}
                  style={{ width: "18px", height: "18px", accentColor: "var(--primary)" }}
                />
              </label>
              <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Speaker identification</span>
                <input 
                  type="checkbox" 
                  checked={speakerIdentification}
                  onChange={(e) => setSpeakerIdentification(e.target.checked)}
                  style={{ width: "18px", height: "18px", accentColor: "var(--primary)" }}
                />
              </label>
              <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Sound effects</span>
                <input 
                  type="checkbox" 
                  checked={soundEffects}
                  onChange={(e) => setSoundEffects(e.target.checked)}
                  style={{ width: "18px", height: "18px", accentColor: "var(--primary)" }}
                />
              </label>
            </div>
          </div>

          {/* Credits Info */}
          <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
              <Clock size={18} style={{ color: "var(--primary)" }} />
              <span style={{ fontSize: "14px", fontWeight: 500, color: "white" }}>Credits Usage</span>
            </div>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "12px" }}>
              Generating captions costs <span style={{ color: "white", fontWeight: 600 }}>{CREDIT_COST_PER_MINUTE} credits</span> per minute of video.
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
    </div>
  );
}
