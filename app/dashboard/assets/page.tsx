"use client";

import { useState, useEffect } from "react";
import { 
  FolderOpen, 
  ImageIcon, 
  Music, 
  FileText, 
  Video, 
  Upload, 
  Search, 
  Filter, 
  Plus,
  Crown,
  Lock
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getCurrentSubscription } from "@/lib/billing";

const assets = [
  { id: 1, name: "Podcast Intro Music", type: "audio", size: "2.4 MB", duration: "0:30", thumbnail: null },
  { id: 2, name: "Background Music - Ambient", type: "audio", size: "4.8 MB", duration: "2:15", thumbnail: null },
  { id: 3, name: "Logo - Black", type: "image", size: "125 KB", thumbnail: null },
  { id: 4, name: "Logo - White", type: "image", size: "132 KB", thumbnail: null },
  { id: 5, name: "Intro Template", type: "video", size: "15.2 MB", duration: "0:15", thumbnail: null },
  { id: 6, name: "Outro Template", type: "video", size: "12.8 MB", duration: "0:12", thumbnail: null },
  { id: 7, name: "Sound Effect - Applause", type: "audio", size: "1.2 MB", duration: "0:05", thumbnail: null },
  { id: 8, name: "Sound Effect - Laughter", type: "audio", size: "850 KB", duration: "0:03", thumbnail: null },
];

const assetTypes = ["All", "Images", "Videos", "Audio"];
const assetCategories = ["All", "Logos", "Music", "Sound Effects", "Templates"];

export default function AssetLibraryPage() {
  const router = useRouter();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const sub = await getCurrentSubscription();
        setSubscription(sub);
        
        // Redirect to pricing if not Pro or Business plan
        if (!sub || (sub.planId !== "pro" && sub.planId !== "business")) {
          router.push("/resources/pricing?upgrade=assets");
        }
      } catch (error) {
        console.error("Failed to check subscription:", error);
        router.push("/resources/pricing?upgrade=assets");
      } finally {
        setLoading(false);
      }
    };

    checkSubscription();
  }, [router]);

  const filteredAssets = assets.filter(asset => {
    const matchesType = selectedType === "All" || 
      (selectedType === "Images" && asset.type === "image") ||
      (selectedType === "Videos" && asset.type === "video") ||
      (selectedType === "Audio" && asset.type === "audio");
    
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesType && matchesSearch;
  });

  const getAssetIcon = (type: string) => {
    switch (type) {
      case "image":
        return ImageIcon;
      case "video":
        return Video;
      case "audio":
        return Music;
      default:
        return FileText;
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center", 
        minHeight: "400px",
        gap: "16px"
      }}>
        <div style={{
          width: "48px",
          height: "48px",
          backgroundColor: "var(--primary)/10",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: "pulse 1.5s ease-in-out"
        }}>
          <FolderOpen size={24} style={{ color: "var(--primary)" }} />
        </div>
        <p style={{ color: "var(--text-muted)" }}>Loading asset library...</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Page header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>Asset Library</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>Manage and organize your media assets</p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button style={{
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
          }}>
            <Upload size={18} />
            Upload Asset
          </button>
          <button style={{
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
            Create Folder
          </button>
        </div>
      </div>

      {/* Pro Badge */}
      <div style={{
        backgroundColor: "var(--primary)/10",
        border: "1px solid var(--primary)/20",
        borderRadius: "12px",
        padding: "16px",
        display: "flex",
        alignItems: "center",
        gap: "12px"
      }}>
        <Crown size={20} style={{ color: "var(--primary)" }} />
        <div>
          <p style={{ fontSize: "14px", fontWeight: "600", color: "var(--primary)", marginBottom: "2px" }}>
            Pro Feature
          </p>
          <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
            Access to unlimited asset storage and advanced organization features
          </p>
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
            placeholder="Search assets..."
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
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          style={{
            padding: "10px 12px",
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            color: "white",
            fontSize: "14px"
          }}
        >
          {assetTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            padding: "10px 12px",
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            color: "white",
            fontSize: "14px"
          }}
        >
          {assetCategories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

        <button style={{
          padding: "10px 12px",
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          color: "white",
          fontSize: "14px",
          cursor: "pointer"
        }}>
          <Filter size={18} />
        </button>
      </div>

      {/* Asset Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
        {filteredAssets.map((asset) => {
          const AssetIcon = getAssetIcon(asset.type);
          return (
            <div 
              key={asset.id}
              style={{ 
                backgroundColor: "var(--surface)", 
                borderRadius: "12px", 
                border: "1px solid var(--border)",
                overflow: "hidden",
                transition: "transform 0.2s, box-shadow 0.2s"
              }}
              className="hover:scale-[1.02]"
            >
              {/* Asset Thumbnail */}
              <div style={{
                aspectRatio: asset.type === "audio" ? "1/1" : "16/9",
                backgroundColor: "var(--background)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative"
              }}>
                <AssetIcon size={40} style={{ color: "var(--text-muted)" }} />
                
                {/* Duration Badge */}
                {asset.duration && (
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
                    {asset.duration}
                  </div>
                )}
              </div>

              {/* Asset Info */}
              <div style={{ padding: "16px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: 500, color: "white", marginBottom: "8px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {asset.name}
                </h3>
                
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-muted)", fontSize: "12px" }}>
                  <span style={{
                    padding: "2px 6px",
                    backgroundColor: "var(--border)",
                    borderRadius: "4px",
                    textTransform: "capitalize"
                  }}>
                    {asset.type}
                  </span>
                  <span>{asset.size}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredAssets.length === 0 && (
        <div style={{ 
          textAlign: "center", 
          padding: "80px 24px",
          backgroundColor: "var(--surface)",
          borderRadius: "12px",
          border: "1px dashed var(--border)"
        }}>
          <FolderOpen size={64} style={{ color: "var(--text-muted)", marginBottom: "16px" }} />
          <h3 style={{ fontSize: "18px", fontWeight: "600", color: "white", marginBottom: "8px" }}>
            No assets found
          </h3>
          <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>
            {searchQuery || selectedType !== "All" || selectedCategory !== "All" ? 
              "No assets match your search or filters" : 
              "Start uploading your first asset"}
          </p>
          <button style={{
            padding: "10px 24px",
            backgroundColor: "var(--primary)",
            border: "none",
            borderRadius: "8px",
            color: "white",
            fontWeight: 500,
            cursor: "pointer"
          }}>
            <Upload size={18} style={{ marginRight: "8px" }} />
            Upload First Asset
          </button>
        </div>
      )}

      {/* Storage Usage */}
      <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: "600", color: "white" }}>Storage Usage</h2>
          <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>2.4 GB of 10 GB</span>
        </div>
        <div style={{ width: "100%", height: "8px", backgroundColor: "var(--surface-hover)", borderRadius: "4px", overflow: "hidden" }}>
          <div style={{
            width: "24%",
            height: "100%",
            backgroundColor: "var(--primary)",
            borderRadius: "4px"
          }} />
        </div>
        <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "8px" }}>
          Upgrade to Business plan for unlimited storage
        </p>
      </div>
    </div>
  );
}
