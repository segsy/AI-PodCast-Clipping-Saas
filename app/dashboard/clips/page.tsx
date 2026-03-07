"use client";

import { useState, useEffect } from "react";
import { 
  Film, 
  Search, 
  Filter, 
  Plus, 
  Play, 
  Pause, 
  Download, 
  Trash2, 
  Share2, 
  MoreVertical,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Calendar,
  Grid,
  List,
  X,
  Loader2
} from "lucide-react";

interface Clip {
  id: string;
  title: string;
  startMs: number;
  endMs: number;
  status: string;
  score: number | null;
  variant: string | null;
  createdAt: string;
  projectName: string | null;
  // Legacy fields for backward compatibility
  duration?: string;
  views?: string;
  likes?: string;
  platform?: string;
  thumbnail?: string | null;
}

interface ClipStats {
  total: number;
  published: number;
  drafts: number;
}

const clips = [
  { 
    id: 1, 
    title: "Top 5 Tips for Growing Your Podcast", 
    duration: "0:45", 
    views: "12.5K", 
    likes: "1.2K", 
    platform: "YouTube Shorts",
    thumbnail: null,
    createdAt: "2 hours ago",
    status: "published"
  },
  { 
    id: 2, 
    title: "The Secret to Viral Content", 
    duration: "1:20", 
    views: "45.2K", 
    likes: "5.8K", 
    platform: "TikTok",
    thumbnail: null,
    createdAt: "5 hours ago",
    status: "published"
  },
  { 
    id: 3, 
    title: "How I Gained 100K Followers", 
    duration: "0:58", 
    views: "28.7K", 
    likes: "3.4K", 
    platform: "Instagram Reels",
    thumbnail: null,
    createdAt: "1 day ago",
    status: "published"
  },
  { 
    id: 4, 
    title: "Interview Highlights - Sarah", 
    duration: "2:15", 
    views: "0", 
    likes: "0", 
    platform: "Not exported",
    thumbnail: null,
    createdAt: "2 days ago",
    status: "draft"
  },
  { 
    id: 5, 
    title: "Q&A Session Best Moments", 
    duration: "1:05", 
    views: "8.9K", 
    likes: "890", 
    platform: "YouTube Shorts",
    thumbnail: null,
    createdAt: "3 days ago",
    status: "published"
  },
  { 
    id: 6, 
    title: "Behind the Scenes", 
    duration: "0:32", 
    views: "15.3K", 
    likes: "2.1K", 
    platform: "TikTok",
    thumbnail: null,
    createdAt: "4 days ago",
    status: "published"
  },
];

const platformColors: Record<string, string> = {
  "YouTube Shorts": "#FF0000",
  "TikTok": "#000000",
  "Instagram Reels": "#E1306C",
  "Not exported": "var(--text-muted)",
};

export default function ClipsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [statusFilter, setStatusFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [clips, setClips] = useState<Clip[]>([]);
  const [stats, setStats] = useState<ClipStats>({ total: 0, published: 0, drafts: 0 });
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchClips();
  }, [statusFilter]);

  const fetchClips = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "all") {
        params.append("status", statusFilter.toUpperCase());
      }
      
      const response = await fetch(`/api/clips?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setClips(data.clips || []);
        setStats(data.stats || { total: 0, published: 0, drafts: 0 });
      }
    } catch (error) {
      console.error("Error fetching clips:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClip = () => {
    // Navigate to clip creation page or open modal
    window.location.href = "/dashboard/clip-anything";
  };

  const filteredClips = clips.filter(clip => {
    const matchesSearch = clip.title?.toLowerCase().includes(searchQuery.toLowerCase()) || true;
    return matchesSearch;
  });

  const publishedCount = stats.published;
  const draftCount = stats.drafts;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Page header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>Clips</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>Manage and view all your created clips</p>
        </div>
        <button 
          onClick={handleCreateClip}
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
          }}>
          <Plus size={18} />
          Create Clip
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
        <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "40px", height: "40px", backgroundColor: "var(--primary)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Film size={20} style={{ color: "white" }} />
            </div>
            <div>
              <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Total Clips</p>
              <p style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>{clips.length}</p>
            </div>
          </div>
        </div>
        <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "40px", height: "40px", backgroundColor: "var(--success)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Play size={20} style={{ color: "white" }} />
            </div>
            <div>
              <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Published</p>
              <p style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>{publishedCount}</p>
            </div>
          </div>
        </div>
        <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "40px", height: "40px", backgroundColor: "var(--warning)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Clock size={20} style={{ color: "white" }} />
            </div>
            <div>
              <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Drafts</p>
              <p style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>{draftCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: "1", minWidth: "200px", maxWidth: "400px" }}>
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
            placeholder="Search clips..."
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
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>

        <select
          value={platformFilter}
          onChange={(e) => setPlatformFilter(e.target.value)}
          style={{
            padding: "10px 12px",
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            color: "white",
            fontSize: "14px"
          }}
        >
          <option value="all">All Platforms</option>
          <option value="YouTube Shorts">YouTube Shorts</option>
          <option value="TikTok">TikTok</option>
          <option value="Instagram Reels">Instagram Reels</option>
        </select>

        <div style={{ display: "flex", gap: "4px", marginLeft: "auto" }}>
          <button
            onClick={() => setViewMode("grid")}
            style={{
              padding: "8px",
              backgroundColor: viewMode === "grid" ? "var(--primary)" : "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "6px",
              color: "white",
              cursor: "pointer"
            }}
          >
            <Grid size={18} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            style={{
              padding: "8px",
              backgroundColor: viewMode === "list" ? "var(--primary)" : "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "6px",
              color: "white",
              cursor: "pointer"
            }}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Clips Grid/List */}
      {viewMode === "grid" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
          {filteredClips.map((clip) => (
            <div 
              key={clip.id}
              style={{ 
                backgroundColor: "var(--surface)", 
                borderRadius: "12px", 
                border: "1px solid var(--border)",
                overflow: "hidden",
                transition: "transform 0.2s, box-shadow 0.2s"
              }}
              className="hover:scale-[1.02]"
            >
              {/* Thumbnail */}
              <div style={{
                aspectRatio: "16/9",
                backgroundColor: "var(--background)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative"
              }}>
                <Film size={32} style={{ color: "var(--text-muted)" }} />
                
                {/* Duration Badge */}
                <div style={{
                  position: "absolute",
                  bottom: "8px",
                  right: "8px",
                  padding: "2px 6px",
                  backgroundColor: "rgba(0,0,0,0.8)",
                  borderRadius: "4px",
                  fontSize: "12px",
                  color: "white"
                }}>
                  {clip.duration}
                </div>

                {/* Play Button Overlay */}
                <div style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(0,0,0,0.3)",
                  opacity: 0,
                  transition: "opacity 0.2s"
                }}
                className="group-hover:opacity-100"
                >
                  <button style={{
                    width: "48px",
                    height: "48px",
                    backgroundColor: "var(--primary)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "none",
                    cursor: "pointer"
                  }}>
                    <Play size={24} style={{ color: "white", marginLeft: "2px" }} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "8px" }}>
                  <h3 style={{ fontSize: "14px", fontWeight: 500, color: "white", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {clip.title}
                  </h3>
                  <button style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "0 4px" }}>
                    <MoreVertical size={16} />
                  </button>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                  <span style={{
                    padding: "2px 8px",
                    backgroundColor: (platformColors[clip.platform || "Not exported"]) + "20",
                    color: platformColors[clip.platform || "Not exported"],
                    fontSize: "11px",
                    borderRadius: "4px"
                  }}>
                    {clip.platform || "Not exported"}
                  </span>
                  <span style={{
                    padding: "2px 8px",
                    backgroundColor: clip.status === "published" ? "var(--success)20" : "var(--warning)20",
                    color: clip.status === "published" ? "var(--success)" : "var(--warning)",
                    fontSize: "11px",
                    borderRadius: "4px",
                    textTransform: "capitalize"
                  }}>
                    {clip.status}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "16px", color: "var(--text-muted)", fontSize: "13px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <Eye size={14} />
                    {clip.views}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <Heart size={14} />
                    {clip.likes}
                  </div>
                  <span style={{ marginLeft: "auto", fontSize: "12px" }}>{clip.createdAt}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)" }}>
          {filteredClips.map((clip) => (
            <div
              key={clip.id}
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
                <div style={{
                  width: "120px",
                  aspectRatio: "16/9",
                  backgroundColor: "var(--background)",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative"
                }}>
                  <Film size={20} style={{ color: "var(--text-muted)" }} />
                  <div style={{
                    position: "absolute",
                    bottom: "4px",
                    right: "4px",
                    padding: "2px 4px",
                    backgroundColor: "rgba(0,0,0,0.8)",
                    borderRadius: "2px",
                    fontSize: "10px",
                    color: "white"
                  }}>
                    {clip.duration}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontWeight: 500, color: "white", marginBottom: "4px" }}>{clip.title}</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{
                      padding: "2px 8px",
                      backgroundColor: (platformColors[clip.platform || "Not exported"]) + "20",
                      color: platformColors[clip.platform || "Not exported"],
                      fontSize: "11px",
                      borderRadius: "4px"
                    }}>
                      {clip.platform || "Not exported"}
                    </span>
                    <span style={{
                      padding: "2px 8px",
                      backgroundColor: clip.status === "published" ? "var(--success)20" : "var(--warning)20",
                      color: clip.status === "published" ? "var(--success)" : "var(--warning)",
                      fontSize: "11px",
                      borderRadius: "4px",
                      textTransform: "capitalize"
                    }}>
                      {clip.status}
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px", color: "var(--text-muted)", fontSize: "13px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", minWidth: "60px" }}>
                    <Eye size={14} />
                    {clip.views}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", minWidth: "50px" }}>
                    <Heart size={14} />
                    {clip.likes}
                  </div>
                </div>
                <span style={{ fontSize: "13px", color: "var(--text-muted)", minWidth: "80px" }}>{clip.createdAt}</span>
                <div style={{ display: "flex", gap: "4px" }}>
                  <button style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "4px" }}>
                    <Download size={16} />
                  </button>
                  <button style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "4px" }}>
                    <Share2 size={16} />
                  </button>
                  <button style={{ background: "none", border: "none", color: "var(--error)", cursor: "pointer", padding: "4px" }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
