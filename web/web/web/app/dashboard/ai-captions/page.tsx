"use client";

import { useState } from "react";
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
  Sparkles
} from "lucide-react";

const captionStyles = [
  { id: "modern", name: "Modern", preview: "Aa" },
  { id: "classic", name: "Classic", preview: "Ab" },
  { id: "bold", name: "Bold", preview: "aB" },
  { id: "minimal", name: "Minimal", preview: "--" },
  { id: "neon", name: "Neon", preview: "N-" },
  { id: "handwritten", name: "Handwritten", preview: "✎" },
];

const recentCaptions = [
  { id: 1, title: "Episode 45 - Growth Tips", duration: "45:30", style: "Modern", status: "completed", createdAt: "2 hours ago" },
  { id: 2, title: "Interview with Sarah Johnson", duration: "32:15", style: "Classic", status: "completed", createdAt: "5 hours ago" },
  { id: 3, title: "Q&A Session #12", duration: "28:45", style: "Bold", status: "processing", createdAt: "1 day ago" },
  { id: 4, title: "Marketing Deep Dive", duration: "55:20", style: "Minimal", status: "completed", createdAt: "2 days ago" },
  { id: 5, title: "Behind the Scenes", duration: "18:30", style: "Neon", status: "failed", createdAt: "3 days ago" },
];

export default function AICaptionsPage() {
  const [selectedStyle, setSelectedStyle] = useState("modern");
  const [fontSize, setFontSize] = useState("medium");
  const [showTimestamps, setShowTimestamps] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleGenerateCaptions = () => {
    setIsProcessing(true);
    setTimeout(() => setIsProcessing(false), 3000);
  };

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
                <p style={{ color: "var(--text-muted)" }}>Select a video to generate captions</p>
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

            {/* Generate Button */}
            <button
              onClick={handleGenerateCaptions}
              disabled={isProcessing}
              style={{
                width: "100%",
                padding: "14px",
                backgroundColor: isProcessing ? "var(--surface-hover)" : "var(--primary)",
                border: "none",
                borderRadius: "8px",
                color: "white",
                fontWeight: 600,
                fontSize: "16px",
                cursor: isProcessing ? "not-allowed" : "pointer",
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
              <button style={{ color: "var(--primary)", fontSize: "14px", background: "none", border: "none", cursor: "pointer" }}>
                View All
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {recentCaptions.map((caption) => (
                <div
                  key={caption.id}
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
                      <p style={{ fontWeight: 500, color: "white" }}>{caption.title}</p>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                        <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>{caption.duration}</span>
                        <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>•</span>
                        <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>{caption.style}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{
                      padding: "4px 10px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: 500,
                      backgroundColor: caption.status === "completed" ? "var(--success)20" : caption.status === "processing" ? "var(--warning)20" : "var(--error)20",
                      color: caption.status === "completed" ? "var(--success)" : caption.status === "processing" ? "var(--warning)" : "var(--error)"
                    }}>
                      {caption.status === "completed" ? "Completed" : caption.status === "processing" ? "Processing" : "Failed"}
                    </span>
                    <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>{caption.createdAt}</span>
                    {caption.status === "completed" && (
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
                <input type="checkbox" defaultChecked style={{ width: "18px", height: "18px", accentColor: "var(--primary)" }} />
              </label>
              <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Sound effects</span>
                <input type="checkbox" style={{ width: "18px", height: "18px", accentColor: "var(--primary)" }} />
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
              Generating captions costs <span style={{ color: "white", fontWeight: 600 }}>5 credits</span> per minute of video.
            </p>
            <div style={{ padding: "12px", backgroundColor: "var(--surface-hover)", borderRadius: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>Available Credits</span>
                <span style={{ fontSize: "14px", fontWeight: 600, color: "white" }}>1,250</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>This Month</span>
                <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--primary)" }}>750 used</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
