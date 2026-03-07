"use client";

import { useState, useEffect, useRef } from "react";
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
  Lock,
  X,
  Loader2,
  FolderPlus
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getCurrentSubscription } from "@/lib/billing";

interface Asset {
  id: string;
  name: string;
  type: string;
  url?: string;
  thumbnailUrl?: string;
  bytes?: number;
  contentType?: string;
  width?: number;
  height?: number;
  durationSec?: number;
  folder?: string;
  createdAt: string;
}

// Mock data for initial display
const mockAssets: Asset[] = [
  { id: "1", name: "Podcast Intro Music", type: "audio", bytes: 2500000, durationSec: 30, createdAt: "2026-02-01" },
  { id: "2", name: "Background Music - Ambient", type: "audio", bytes: 5000000, durationSec: 135, createdAt: "2026-02-02" },
  { id: "3", name: "Logo - Black", type: "image", bytes: 128000, createdAt: "2026-02-03" },
  { id: "4", name: "Logo - White", type: "image", bytes: 135000, createdAt: "2026-02-03" },
  { id: "5", name: "Intro Template", type: "video", bytes: 15900000, durationSec: 15, createdAt: "2026-02-05" },
  { id: "6", name: "Outro Template", type: "video", bytes: 13400000, durationSec: 12, createdAt: "2026-02-05" },
  { id: "7", name: "Sound Effect - Applause", type: "audio", bytes: 1250000, durationSec: 5, createdAt: "2026-02-06" },
  { id: "8", name: "Sound Effect - Laughter", type: "audio", bytes: 870000, durationSec: 3, createdAt: "2026-02-06" },
];

const assetTypes = ["All", "Images", "Videos", "Audio"];
const assetCategories = ["All", "Logos", "Music", "Sound Effects", "Templates"];

export default function AssetLibraryPage() {
  const router = useRouter();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [selectedType, setSelectedType] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const sub = await getCurrentSubscription();
        setSubscription(sub);
        
        // Redirect to pricing if not Pro or Business plan
        if (!sub || (sub.planId !== "pro" && sub.planId !== "business")) {
          router.push("/resources/pricing?upgrade=assets");
        }
        
        // Fetch assets from database
        const workspaceId = localStorage.getItem("workspaceId") || "demo-workspace";
        const response = await fetch(`/api/assets?workspaceId=${workspaceId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.assets && data.assets.length > 0) {
            setAssets(data.assets);
          }
        }
      } catch (error) {
        console.error("Failed to check subscription:", error);
        // Continue with mock data on error
      } finally {
        setLoading(false);
      }
    };

    checkSubscription();
  }, [router]);

  // Handle file upload
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const workspaceId = localStorage.getItem("workspaceId") || "demo-workspace";
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Determine asset type based on file type
        let assetType = "other";
        if (file.type.startsWith("image/")) assetType = "image";
        else if (file.type.startsWith("video/")) assetType = "video";
        else if (file.type.startsWith("audio/")) assetType = "audio";
        
        // In production, this would upload to S3 and create the asset record
        // For demo, we'll simulate the upload
        const formData = new FormData();
        formData.append("file", file);
        formData.append("workspaceId", workspaceId);
        formData.append("name", file.name);
        formData.append("type", assetType);
        
        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 20) {
          setUploadProgress(progress);
          await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        // Create asset in database
        const response = await fetch("/api/assets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            workspaceId,
            name: file.name,
            type: assetType,
            s3Key: `assets/${workspaceId}/${file.name}`,
            url: URL.createObjectURL(file),
            bytes: file.size,
            contentType: file.type,
          }),
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.asset) {
            setAssets(prev => [data.asset, ...prev]);
          }
        }
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Handle create folder
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    
    try {
      const workspaceId = localStorage.getItem("workspaceId") || "demo-workspace";
      
      // In production, this would create a folder in the database
      console.log("Creating folder:", newFolderName, "for workspace:", workspaceId);
      
      // For demo, just close the modal
      setShowCreateFolder(false);
      setNewFolderName("");
    } catch (error) {
      console.error("Failed to create folder:", error);
    }
  };

  const filteredAssets = assets.filter(asset => {
    const matchesType = selectedType === "All" || 
      (selectedType === "Images" && asset.type === "image") ||
      (selectedType === "Videos" && asset.type === "video") ||
      (selectedType === "Audio" && asset.type === "audio");
    
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesType && matchesSearch;
  });

  // Format file size
  const formatSize = (bytes?: number) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Format duration
  const formatDuration = (seconds?: number) => {
    if (!seconds) return "";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUpload}
            multiple
            accept="image/*,video/*,audio/*"
            style={{ display: "none" }}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
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
              cursor: uploading ? "not-allowed" : "pointer",
              opacity: uploading ? 0.7 : 1
            }}
          >
            {uploading ? (
              <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
            ) : (
              <Upload size={18} />
            )}
            {uploading ? `Uploading ${uploadProgress}%` : "Upload Asset"}
          </button>
          <button 
            onClick={() => setShowCreateFolder(true)}
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
            <FolderPlus size={18} />
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
                  <span>{formatSize(asset.bytes)}</span>
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
