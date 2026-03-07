"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Zap, 
  Upload, 
  Film, 
  Wand2, 
  Sparkles, 
  Mic, 
  Video, 
  ImageIcon,
  X,
  Link,
  Paperclip,
  CheckCircle2,
  Crown,
  Lock,
  ChevronDown
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getCurrentSubscription } from "@/lib/billing";

// Types
interface Service {
  id: string;
  title: string;
  description: string;
  icon: any;
  additionalText?: string;
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

// Platform data
const platforms = [
  { name: "YouTube", icon: YouTubeIcon, color: "#FF0000", connected: true, username: "@podcastclips" },
  { name: "TikTok", icon: TikTokIcon, color: "#000000", connected: true, username: "@podcastclips" },
  { name: "Instagram", icon: InstagramIcon, color: "#E1306C", connected: false },
  { name: "Facebook", icon: FacebookIcon, color: "#1877F2", connected: false },
  { name: "LinkedIn", icon: LinkedInIcon, color: "#0A66C2", connected: true, username: "Podcast Clips" },
  { name: "X", icon: XIcon, color: "#1DA1F2", connected: false },
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

// Service data - Sequential order as requested
const services: Service[] = [
  { id: "long-to-shorts", title: "Long to shorts", description: "AI finds hooks, highlights, and turns your video into viral shorts.", icon: Film },
  { id: "ai-captions", title: "AI Captions", description: "Add stylish captions or translate your content with one click.", icon: Sparkles },
  { id: "video-editor", title: "Video editor", description: "Upload your video and start editing for free.", icon: Wand2, additionalText: "You can upload videos up to 120 minutes long. Credits are not required." },
  { id: "enhance-speech", title: "Enhance speech", description: "Enhance voice clarity and remove filler words with one click.", icon: Mic, additionalText: "You can upload videos up to 120 minutes long." },
  { id: "ai-reframe", title: "AI Reframe", description: "Let AI automatically reframe your content to fit any social platform.", icon: Video, additionalText: "You can upload videos up to 120 minutes long." },
  { id: "ai-broll", title: "AI B-Roll", description: "Add AI generated B-Roll to your video in 1 click.", icon: ImageIcon, additionalText: "You can upload videos up to 120 minutes long. Limited captions may impact B-roll generation." },
  { id: "ai-hook", title: "AI Hook", description: "Create a sound hook with the AI voice-over.", icon: Zap },
];

// Animated Link Text Component - Shows cycling platform names
const AnimatedLinkText = () => {
  const links = ["Zoom link", "YouTube link", "Twitch link", "Rumble link"];
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % links.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [links.length]);

  return (
    <div className="flex items-center gap-1 text-sm">
      <span className="text-text-secondary">Drop a</span>
      <span className="relative h-5 w-24 inline-block">
        {links.map((link, index) => (
          <span
            key={link}
            className={`absolute left-0 text-primary font-medium transition-all duration-500 ${
              index === activeIndex 
                ? "opacity-100 transform translate-y-0" 
                : "opacity-0 transform -translate-y-2"
            }`}
          >
            {link}
          </span>
        ))}
      </span>
    </div>
  );
};

// Google Drive Icon
const GoogleDriveIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.75 9.5L12 2L4.25 9.5v5L12 22l7.75-7.5v-5z" fill="#34A853"/>
    <path d="M12 2v20" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Social Accounts Pop-up Component
interface SocialAccountsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  isProUser: boolean;
  onSelectPlatform: (platform: string) => void;
  onUpgradeClick: () => void;
}

const SocialAccountsPopup = ({ isOpen, onClose, isProUser, onSelectPlatform, onUpgradeClick }: SocialAccountsPopupProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const handlePlatformClick = (platformName: string) => {
    if (isProUser) {
      onSelectPlatform(platformName);
      onClose();
    } else {
      onUpgradeClick();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Popup Panel */}
      <div className="relative mt-20 mr-4 w-80 bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-right-5 fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
              <Paperclip className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Social Accounts</h3>
              <p className="text-xs text-text-muted">Connect your platforms</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-surface-hover rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-text-secondary" />
          </button>
        </div>

        {/* All Platforms Dropdown */}
        <div className="p-4" ref={dropdownRef}>
          <label className="text-xs font-medium text-text-secondary mb-2 block">All Platforms</label>
          
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-background border border-border rounded-xl text-white hover:border-primary/50 transition-colors"
            >
              <span className="text-sm">{selectedPlatform || "Select a platform"}</span>
              <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-xl shadow-lg z-10 overflow-hidden">
                {platforms.map((platform) => {
                  const Icon = platform.icon;
                  return (
                    <button
                      key={platform.name}
                      onClick={() => {
                        setSelectedPlatform(platform.name);
                        handlePlatformClick(platform.name);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-hover transition-colors text-left"
                    >
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: platform.color + "20" }}
                      >
                        <Icon />
                      </div>
                      <span className="text-sm text-white flex-1">{platform.name}</span>
                      {platform.connected && (
                        <CheckCircle2 className="w-4 h-4 text-success" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pro Feature Notice for Non-Pro Users */}
          {!isProUser && (
            <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-primary">Pro Feature</span>
              </div>
              <p className="text-xs text-text-secondary">
                Upgrade to Pro to connect unlimited social accounts and auto-post to all platforms.
              </p>
              <button
                onClick={onUpgradeClick}
                className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors"
              >
                Upgrade to Pro
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Pro User Modal Component (for non-pro users)
interface ProModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

const ProModal = ({ isOpen, onClose, onUpgrade }: ProModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center">
              <Crown className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Add Social Accounts</h2>
              <p className="text-text-secondary text-sm">Unlock premium connections</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-text-secondary" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-text-secondary mb-6 text-sm">
            Connect your social accounts with Pro to access advanced features:
          </p>

          {/* Pro Platforms Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {proPlatforms.map((platform) => {
              const Icon = platform.icon;
              return (
                <button
                  key={platform.name}
                  onClick={onUpgrade}
                  className="flex items-center gap-3 p-3 bg-background border border-border rounded-xl hover:border-primary/50 hover:bg-surface-hover transition-colors text-left"
                >
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: platform.color + "20" }}
                  >
                    <Icon />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{platform.name}</p>
                    <p className="text-xs text-primary">Pro</p>
                  </div>
                  <Lock className="w-4 h-4 text-text-muted" />
                </button>
              );
            })}
          </div>

          {/* Upgrade Button */}
          <button
            onClick={onUpgrade}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            <Crown className="w-5 h-5" />
            Upgrade to Pro
          </button>
          
          <p className="text-center text-text-muted text-xs mt-4">
            Starting at $19/month • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
};

// Upload Modal Component
interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
}

const UploadModal = ({ isOpen, onClose, service }: UploadModalProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState<"upload" | "link">("upload");
  const [videoLink, setVideoLink] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  if (!isOpen || !service) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith("video/") && !file.type.startsWith("audio/")) {
      alert("Please upload a video or audio file");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Create FormData
      const formData = new FormData();
      formData.append("file", file);
      // Add workspaceId and userId - in real app these would come from auth
      formData.append("workspaceId", "demo-workspace");
      formData.append("userId", "demo-user");

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      // Upload to API
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      
      if (response.ok) {
        setUploadProgress(100);
        setTimeout(() => {
          onClose();
          // Navigate to the appropriate service page
          window.location.href = `/dashboard/${service.id}`;
        }, 500);
      } else {
        alert("Upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleLinkImport = async () => {
    if (!videoLink.trim()) {
      alert("Please enter a video link");
      return;
    }

    setUploading(true);
    try {
      // In a real app, this would call an API to process the link
      // For now, we'll just redirect to the service page
      setTimeout(() => {
        onClose();
        window.location.href = `/dashboard/${service.id}?link=${encodeURIComponent(videoLink)}`;
      }, 1000);
    } catch (error) {
      console.error("Link import error:", error);
      alert("Failed to import link. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleGoogleDriveUpload = () => {
    // In a real app, this would trigger Google Drive picker
    alert("Google Drive integration coming soon!");
  };

  const Icon = service.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center">
              <Icon className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{service.title}</h2>
              <p className="text-text-secondary text-sm">{service.description}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-text-secondary" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Tab Switcher */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab("upload")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "upload" 
                  ? "bg-primary text-white" 
                  : "bg-surface-hover text-text-secondary hover:text-white"
              }`}
            >
              <Upload className="w-4 h-4" />
              Upload File
            </button>
            <button
              onClick={() => setActiveTab("link")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "link" 
                  ? "bg-primary text-white" 
                  : "bg-surface-hover text-text-secondary hover:text-white"
              }`}
            >
              <Link className="w-4 h-4" />
              Paste Link
            </button>
          </div>

          {activeTab === "upload" ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 ${
                isDragging 
                  ? 'border-primary bg-primary/10' 
                  : 'border-border bg-background hover:border-primary/50'
              }`}
            >
              <div className="mb-4">
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-10 h-10 text-primary" />
                </div>
                <div className="text-2xl font-bold text-white mb-2">Drop your video here</div>
                <div className="text-text-secondary mb-4">
                  or click to browse files
                </div>
              </div>
              {uploading ? (
                <div className="space-y-2">
                  <div className="w-full bg-surface-hover rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-text-secondary text-sm">Uploading... {uploadProgress}%</p>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="video/*,audio/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <span className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors inline-block">
                      Browse Files
                    </span>
                  </label>
                  <button 
                    onClick={handleGoogleDriveUpload}
                    className="px-6 py-3 bg-surface border border-border text-white rounded-lg font-medium hover:bg-surface-hover transition-colors flex items-center gap-2"
                  >
                    <GoogleDriveIcon /> Google Drive
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {["Zoom", "YouTube", "Twitch", "Rumble"].map((platform) => (
                  <button
                    key={platform}
                    onClick={() => setVideoLink(`${platform.toLowerCase()}-link`)}
                    className="p-4 bg-background border border-border rounded-xl text-white font-medium hover:border-primary/50 hover:bg-surface-hover transition-colors text-left flex items-center gap-3"
                  >
                    <Link className="w-5 h-5 text-primary" />
                    {platform}
                  </button>
                ))}
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Paste your link here..."
                  value={videoLink}
                  onChange={(e) => setVideoLink(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-4 text-white placeholder-text-muted focus:outline-none focus:border-primary"
                />
                <button 
                  onClick={handleLinkImport}
                  disabled={uploading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50"
                >
                  {uploading ? "Importing..." : "Import"}
                </button>
              </div>
            </div>
          )}

          {service.additionalText && (
            <div className="mt-4 text-sm text-text-muted text-center">
              {service.additionalText}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Feature Icon Button Component
interface FeatureIconProps {
  service: Service;
  onClick: () => void;
  isActive: boolean;
}

const FeatureIcon = ({ service, onClick, isActive }: FeatureIconProps) => {
  const Icon = service.icon;
  
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300 ${
        isActive 
          ? "bg-primary/20 border-2 border-primary" 
          : "bg-surface hover:bg-surface-hover border-2 border-transparent hover:border-border"
      }`}
    >
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
        isActive ? "bg-primary" : "bg-primary/20"
      }`}>
        <Icon className={`w-6 h-6 ${isActive ? "text-white" : "text-primary"}`} />
      </div>
      <span className={`text-sm font-medium ${isActive ? "text-primary" : "text-text-secondary"}`}>
        {service.title}
      </span>
    </button>
  );
};

// Service Card Component with Animated Link Text
const ServiceCard = ({ service, onClick }: { service: Service; onClick: () => void }) => {
  const Icon = service.icon;
  
  return (
    <button
      onClick={onClick}
      className="bg-surface border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-surface-hover transition-all duration-300 text-left group w-full"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
          <Icon className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
            {service.title}
          </h3>
          <p className="text-text-secondary text-sm">{service.description}</p>
        </div>
      </div>
      
      {/* Animated Link Text */}
      <div className="mb-4 py-2">
        <AnimatedLinkText />
      </div>
      
      <div className="flex items-center gap-2 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
        <Upload className="w-4 h-4" />
        Click to upload
      </div>
    </button>
  );
};

export default function DashboardPage() {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Social accounts popup state
  const [isSocialPopupOpen, setIsSocialPopupOpen] = useState(false);
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const sub = await getCurrentSubscription();
        setSubscription(sub);
      } catch (error) {
        console.error("Failed to check subscription:", error);
      }
    };
    checkSubscription();
  }, []);

  const isProUser = subscription && (subscription.planId === "pro" || subscription.planId === "business");

  const handleServiceClick = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  const handleSocialAccountsClick = () => {
    setIsSocialPopupOpen(true);
  };

  const handleUpgradeClick = () => {
    setIsSocialPopupOpen(false);
    setIsProModalOpen(true);
  };

  const handleSelectPlatform = (platform: string) => {
    router.push("/dashboard/social");
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back!</h1>
            <p className="text-text-secondary">Here's what's happening with your content today.</p>
          </div>
          
          {/* Social Accounts Attachment Icon Button */}
          <button 
            onClick={handleSocialAccountsClick}
            className="flex items-center gap-2 px-4 py-2.5 bg-surface border border-border rounded-xl hover:border-primary/50 hover:bg-surface-hover transition-all duration-300 group"
          >
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center group-hover:bg-primary/30 transition-colors">
              <Paperclip className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-white">Social Accounts</p>
              <p className="text-xs text-text-muted">Connect platforms</p>
            </div>
            <ChevronDown className="w-4 h-4 text-text-muted" />
          </button>
        </div>

        {/* Feature Icons Bar - Sequential Arrangement */}
        <div className="mb-12">
          <div className="bg-surface/50 backdrop-blur-sm rounded-2xl p-4 border border-border">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
              <div className="flex gap-3 min-w-max">
                {services.map((service) => (
                  <FeatureIcon
                    key={service.id}
                    service={service}
                    onClick={() => handleServiceClick(service)}
                    isActive={selectedService?.id === service.id}
                  />
                ))}
              </div>
            </div>
          </div>
          
          {/* Quick Upload Button */}
          <div className="mt-4 flex justify-center">
            <button 
              onClick={() => handleServiceClick(services[0])}
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-primary/25"
            >
              <Upload className="w-6 h-6" />
              Upload Video
            </button>
          </div>
        </div>

        {/* Services Grid - Clickable Cards with Animated Link Text */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onClick={() => handleServiceClick(service)}
            />
          ))}
        </div>
      </main>

      {/* Upload Modal */}
      <UploadModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        service={selectedService}
      />

      {/* Social Accounts Pop-up */}
      <SocialAccountsPopup 
        isOpen={isSocialPopupOpen}
        onClose={() => setIsSocialPopupOpen(false)}
        isProUser={isProUser}
        onSelectPlatform={handleSelectPlatform}
        onUpgradeClick={handleUpgradeClick}
      />

      {/* Pro User Modal for Non-Pro Users */}
      <ProModal 
        isOpen={isProModalOpen}
        onClose={() => setIsProModalOpen(false)}
        onUpgrade={() => router.push("/resources/pricing?upgrade=social")}
      />
    </div>
  );
}
