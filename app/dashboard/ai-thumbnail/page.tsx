"use client";

import { useState } from "react";
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
  Wand2
} from "lucide-react";

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

const recentThumbnails = [
  { id: 1, title: "Episode 45 - Growth Tips", style: "Vibrant", createdAt: "2 hours ago" },
  { id: 2, title: "Interview with Sarah", style: "Minimal", createdAt: "5 hours ago" },
  { id: 3, title: "Q&A Session #12", style: "Bold", createdAt: "1 day ago" },
  { id: 4, title: "Marketing Deep Dive", style: "Gradient", createdAt: "2 days ago" },
];

export default function AIThumbnailPage() {
  const [selectedStyle, setSelectedStyle] = useState("vibrant");
  const [selectedRatio, setSelectedRatio] = useState("16:9");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedThumbnails, setGeneratedThumbnails] = useState<string[]>([]);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedThumbnails(["thumb1", "thumb2", "thumb3"]);
    }, 3000);
  };

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
                <p style={{ color: "var(--text-muted)", marginBottom: "8px" }}>Upload an image or select a video</p>
                <button style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  margin: "0 auto",
                  padding: "8px 16px",
                  backgroundColor: "var(--surface-hover)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "white",
                  cursor: "pointer"
                }}>
                  <Upload size={16} />
                  Upload Image
                </button>
              </div>
              
              {/* Thumbnail Overlay */}
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
                  YOUR PODCAST TITLE
                </h3>
                <p style={{ fontSize: "16px", color: "white", marginTop: "8px", textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}>
                  Episode #45
                </p>
              </div>
            </div>

            {/* Text Input */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: 500, marginBottom: "8px", color: "white" }}>
                Title Text
              </label>
              <input
                type="text"
                placeholder="Enter your thumbnail title..."
                defaultValue="Growth Tips That Changed My Life"
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

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              style={{
                width: "100%",
                padding: "14px",
                backgroundColor: isGenerating ? "var(--surface-hover)" : "var(--primary)",
                border: "none",
                borderRadius: "8px",
                color: "white",
                fontWeight: 600,
                fontSize: "16px",
                cursor: isGenerating ? "not-allowed" : "pointer",
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

          {/* Generated Thumbnails */}
          {generatedThumbnails.length > 0 && (
            <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "24px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "20px", color: "white" }}>
                Generated Thumbnails
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                {generatedThumbnails.map((thumb, index) => (
                  <div
                    key={index}
                    style={{
                      aspectRatio: "16/9",
                      backgroundColor: "var(--surface-hover)",
                      borderRadius: "8px",
                      position: "relative",
                      cursor: "pointer",
                      border: "2px solid transparent"
                    }}
                  >
                    <div style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <span style={{ color: "var(--text-muted)" }}>Variant {index + 1}</span>
                    </div>
                    <div style={{
                      position: "absolute",
                      bottom: "8px",
                      right: "8px",
                      display: "flex",
                      gap: "4px"
                    }}>
                      <button style={{
                        width: "28px",
                        height: "28px",
                        backgroundColor: "var(--primary)",
                        border: "none",
                        borderRadius: "4px",
                        color: "white",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <Download size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Thumbnails */}
          <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: "16px", fontWeight: "600", color: "white" }}>Recent Thumbnails</h2>
              <button style={{ color: "var(--primary)", fontSize: "14px", background: "none", border: "none", cursor: "pointer" }}>
                View All
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {recentThumbnails.map((thumb) => (
                <div
                  key={thumb.id}
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
                      <p style={{ fontWeight: 500, color: "white" }}>{thumb.title}</p>
                      <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "2px" }}>{thumb.style}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>{thumb.createdAt}</span>
                    <button style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
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
                <input type="checkbox" defaultChecked style={{ width: "18px", height: "18px", accentColor: "var(--primary)" }} />
              </label>
              <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Add episode number</span>
                <input type="checkbox" defaultChecked style={{ width: "18px", height: "18px", accentColor: "var(--primary)" }} />
              </label>
              <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Add glow effect</span>
                <input type="checkbox" style={{ width: "18px", height: "18px", accentColor: "var(--primary)" }} />
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
              Generating thumbnails costs <span style={{ color: "white", fontWeight: 600 }}>10 credits</span> per thumbnail.
            </p>
            <div style={{ padding: "12px", backgroundColor: "var(--surface-hover)", borderRadius: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>Available Credits</span>
                <span style={{ fontSize: "14px", fontWeight: 600, color: "white" }}>1,250</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>This Month</span>
                <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--primary)" }}>250 used</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
