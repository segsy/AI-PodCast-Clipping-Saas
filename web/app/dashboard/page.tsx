"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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
import { useRouter, useSearchParams } from "next/navigation";
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

  // Handle escape key to close popup
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle click outside dropdown - cross-platform compatible
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    
    // Only add listener in browser environment
    if (typeof window !== 'undefined') {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
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

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end" onClick={handleBackdropClick}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-hidden="true"
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
  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center" onClick={handleBackdropClick}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        aria-hidden="true"
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
  const IconComponent = service?.icon;
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState<"upload" | "link">("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [urlPlatform, setUrlPlatform] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isGoogleDriveConnected, setIsGoogleDriveConnected] = useState(false);
  const [isLoadingGoogleDrive, setIsLoadingGoogleDrive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null);
      setVideoUrl("");
      setUrlPlatform("");
      setUploadProgress(0);
      setIsUploading(false);
    }
  }, [isOpen]);

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Validate file type
      if (file.type.startsWith('video/') || file.name.match(/\.(mp4|mov|avi|mkv|webm|wmv|flv|m4v)$/i)) {
        setSelectedFile(file);
      } else {
        alert("Please select a valid video file");
      }
    }
  };

  // Handle drag events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('video/') || file.name.match(/\.(mp4|mov|avi|mkv|webm|wmv|flv|m4v)$/i)) {
        setSelectedFile(file);
      } else {
        alert("Please drop a valid video file");
      }
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      // Get workspace ID from localStorage
      const workspaceId = localStorage.getItem("workspaceId") || "demo-workspace";
      const userId = localStorage.getItem("userId") || "demo-user";
      
      // Create upload record via API
      const s3Key = `uploads/${workspaceId}/${Date.now()}_${selectedFile.name}`;
      
      const response = await fetch('/api/uploads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-workspace-id': workspaceId,
          'x-user-id': userId,
        },
        body: JSON.stringify({
          workspaceId: workspaceId,
          userId: userId,
          projectId: workspaceId,
          filename: selectedFile.name,
          contentType: selectedFile.type,
          bytes: selectedFile.size,
          s3Key: s3Key,
          durationSec: null,
        }),
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error("Failed to create upload record");
      }

      setUploadProgress(100);
      
      // Close modal and show success
      setTimeout(() => {
        alert(`Successfully uploaded "${selectedFile.name}"`);
        onClose();
      }, 500);

    } catch (error) {
      console.error("Upload error:", error);
      
      // Provide more specific error message
      if (error instanceof Response) {
        try {
          const errorData = await error.json();
          alert(errorData.error || "Failed to upload video. Please try again.");
        } catch {
          alert("Failed to upload video. Please try again.");
        }
      } else if (error instanceof Error) {
        // Show the actual error message for debugging
        alert(`Upload failed: ${error.message}. Please try again.`);
      } else {
        alert("Failed to upload video. Please try again.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  // Handle URL import
  const handleUrlImport = async () => {
    if (!videoUrl || !urlPlatform) {
      alert("Please select a platform and paste a URL");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate import progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 15;
        });
      }, 200);

      // In a real app, this would call an API to download the video from the URL
      // For now, we'll simulate a successful import
      await new Promise(resolve => setTimeout(resolve, 2000));

      clearInterval(progressInterval);
      setUploadProgress(100);

      setTimeout(() => {
        alert(`Successfully imported video from ${urlPlatform}`);
        onClose();
      }, 500);

    } catch (error) {
      console.error("Import error:", error);
      alert("Failed to import video. Please check the URL and try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle Google Drive connection
  const handleGoogleDriveClick = async () => {
    setIsLoadingGoogleDrive(true);
    
    try {
      // In a real app, this would trigger Google OAuth flow
      // For demo, we'll simulate the OAuth popup
      
      // Check if we have a stored Google Drive access token
      const gdriveToken = localStorage.getItem("googleDriveAccessToken");
      
      if (gdriveToken) {
        setIsGoogleDriveConnected(true);
        // In real implementation, open Google Drive file picker
        alert("Google Drive is connected. File picker would open here.");
      } else {
        // Simulate OAuth flow - in production this would redirect to Google OAuth
        // For demo purposes, we'll just show an alert
        const shouldConnect = confirm("This would open Google OAuth. For demo, click OK to simulate connection.");
        if (shouldConnect) {
          localStorage.setItem("googleDriveAccessToken", "demo_token");
          setIsGoogleDriveConnected(true);
          alert("Google Drive connected! In production, this would open the file picker.");
        }
      }
    } catch (error) {
      console.error("Google Drive error:", error);
      alert("Failed to connect to Google Drive");
    } finally {
      setIsLoadingGoogleDrive(false);
    }
  };

  // Handle platform URL detection
  const detectPlatform = (url: string) => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) return "YouTube";
    if (url.includes("tiktok.com")) return "TikTok";
    if (url.includes("twitch.tv")) return "Twitch";
    if (url.includes("rumble.com")) return "Rumble";
    if (url.includes("zoom.us")) return "Zoom";
    if (url.includes("vimeo.com")) return "Vimeo";
    if (url.includes("instagram.com")) return "Instagram";
    return "";
  };

  const handleUrlChange = (url: string) => {
    setVideoUrl(url);
    const detected = detectPlatform(url);
    if (detected) {
      setUrlPlatform(detected);
    }
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if clicking the backdrop, not the modal content
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-hidden="true"
      />
      
      {/* Modal - scrollable on mobile */}
      <div className="relative w-full max-w-2xl max-h-[90vh] md:max-h-[80vh] bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header - fixed at top */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 md:p-6 border-b border-border">
          <div className="flex items-center gap-3 md:gap-4 min-w-0">
            <div className="w-10 h-10 md:w-14 md:h-14 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
              {IconComponent && <IconComponent className="w-5 h-5 md:w-7 md:h-7 text-primary" />}
            </div>
            <div className="min-w-0">
              <h2 className="text-lg md:text-xl font-bold text-white truncate">{service?.title}</h2>
              <p className="text-text-secondary text-sm hidden md:block">{service?.description}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-surface-hover rounded-lg transition-colors flex-shrink-0"
            aria-label="Close modal"
            type="button"
          >
            <X className="w-5 h-5 md:w-6 md:h-6 text-text-secondary" />
          </button>
        </div>

        {/* Content - scrollable */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
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
            <div>
              {/* Selected File Display */}
              {selectedFile && (
                <div className="mb-4 p-4 bg-primary/10 border border-primary/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Film className="w-8 h-8 text-primary" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{selectedFile.name}</p>
                      <p className="text-text-muted text-sm">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                    <button 
                      onClick={() => setSelectedFile(null)}
                      className="p-1 hover:bg-surface-hover rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 text-text-muted" />
                    </button>
                  </div>
                </div>
              )}

              {/* Upload Progress */}
              {isUploading && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-text-secondary mb-2">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 bg-surface-hover rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Drop Zone */}
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
                  <div className="text-2xl font-bold text-white mb-2">
                    {selectedFile ? "File Selected" : "Drop your video here"}
                  </div>
                  <div className="text-text-secondary mb-4">
                    {selectedFile ? "Click upload to proceed" : "or click to browse files"}
                  </div>
                </div>
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors"
                  >
                    Browse Files
                  </button>
                  <button 
                    onClick={handleGoogleDriveClick}
                    disabled={isLoadingGoogleDrive}
                    className="px-6 py-3 bg-surface border border-border text-white rounded-lg font-medium hover:bg-surface-hover transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {isLoadingGoogleDrive ? (
                      <span className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    ) : (
                      <>
                        <GoogleDriveIcon />
                        {isGoogleDriveConnected ? "Open Drive" : "Google Drive"}
                      </>
                    )}
                  </button>
                </div>
                
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                {/* Supported formats */}
                <p className="text-text-muted text-sm mt-4">
                  Supported formats: MP4, MOV, AVI, MKV, WebM, WMV, FLV
                </p>
              </div>

              {/* Upload Button */}
              {selectedFile && !isUploading && (
                <div className="hidden">
                  <button 
                    onClick={handleUpload}
                    className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition-colors"
                  >
                    <Upload className="w-5 h-5" />
                    Upload Video
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Import Progress */}
              {isUploading && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-text-secondary mb-2">
                    <span>Importing from {urlPlatform}...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 bg-surface-hover rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Platform Quick Select */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: "Zoom", icon: Video },
                  { name: "YouTube", icon: YouTubeIcon },
                  { name: "Twitch", icon: TwitchIcon },
                  { name: "Rumble", icon: RumbleIcon },
                  { name: "Vimeo", icon: VimeoIcon },
                  { name: "Instagram", icon: InstagramIcon }
                ].map((platform) => (
                  <button
                    key={platform.name}
                    onClick={() => setUrlPlatform(platform.name)}
                    disabled={isUploading}
                    className={`p-4 bg-background border rounded-xl text-white font-medium hover:border-primary/50 hover:bg-surface-hover transition-colors text-left flex items-center gap-3 disabled:opacity-50 ${
                      urlPlatform === platform.name ? "border-primary bg-primary/10" : "border-border"
                    }`}
                  >
                    <platform.icon />
                    {platform.name}
                  </button>
                ))}
              </div>
              
              {/* URL Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Paste your video link here..."
                  value={videoUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  disabled={isUploading}
                  className="w-full bg-background border border-border rounded-xl px-4 py-4 text-white placeholder-text-muted focus:outline-none focus:border-primary disabled:opacity-50"
                />
                {urlPlatform && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-primary/20 text-primary text-xs rounded-lg">
                    {urlPlatform}
                  </div>
                )}
              </div>
              
              {/* Import Button */}
              <button 
                onClick={handleUrlImport}
                disabled={!videoUrl || !urlPlatform || isUploading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Link className="w-5 h-5" />
                    Import from {urlPlatform || "Link"}
                  </>
                )}
              </button>

              {/* Supported platforms note */}
              <p className="text-text-muted text-sm text-center">
                Supported: YouTube, TikTok, Twitch, Rumble, Vimeo, Zoom, Instagram
              </p>
            </div>
          )}

          {service?.additionalText && (
            <div className="mt-4 text-sm text-text-muted text-center flex-shrink-0">
              {service.additionalText}
            </div>
          )}
        </div>

        {/* Footer with buttons - fixed at bottom */}
        <div className="flex-shrink-0 flex gap-3 p-4 md:p-6 border-t border-border bg-surface">
          <button 
            onClick={onClose}
            type="button"
            className="flex-1 px-4 py-3 bg-surface-hover text-white rounded-xl font-medium hover:bg-surface-hover/80 transition-colors"
          >
            Cancel
          </button>
          {selectedFile && !isUploading && (
            <button 
              onClick={handleUpload}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition-colors"
            >
              <Upload className="w-5 h-5" />
              Upload Video
            </button>
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
      aria-label={`Open ${service.title}`}
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
        Click to explore
      </div>
    </button>
  );
};

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Social accounts popup state
  const [isSocialPopupOpen, setIsSocialPopupOpen] = useState(false);
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    console.log('[DEBUG] Dashboard mounted - checking initial state');
    
    const checkSubscription = async () => {
      try {
        console.log('[DEBUG] Checking subscription...');
        const sub = await getCurrentSubscription();
        console.log('[DEBUG] Subscription result:', sub);
        setSubscription(sub);
      } catch (error) {
        console.error('[DEBUG] Failed to check subscription:', error);
      }
    };
    checkSubscription();
    
    // Check for feature parameter in URL
    const featureParam = searchParams.get("feature");
    console.log('[DEBUG] Feature param from URL:', featureParam);
    if (featureParam) {
      const matchingService = services.find(s => s.id === featureParam);
      console.log('[DEBUG] Matching service found:', matchingService);
      if (matchingService) {
        setSelectedService(matchingService);
        setIsModalOpen(true);
        console.log('[DEBUG] Modal opened due to URL param, will clear after');
        // Clear the URL parameter after opening modal
        router.replace("/dashboard");
      }
    }
  }, [searchParams, router]);

  const isProUser = subscription && (subscription.planId === "pro" || subscription.planId === "business");

  // Open modal when clicking a service card
  const handleServiceClick = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  // Navigate to service page (alternative action)
  const handleServiceNavigate = (service: Service) => {
    // Map service IDs to their corresponding pages
    const servicePageMap: { [key: string]: string } = {
      "long-to-shorts": "/features/clipanything",
      "ai-captions": "/features/animated-captions",
      "video-editor": "/features/editor",
      "enhance-speech": "/features/clipanything", // Using clipanything as it may have enhance functionality
      "ai-reframe": "/features/ai-reframe",
      "ai-broll": "/features/ai-broll",
      "ai-hook": "/features/clipanything", // Using clipanything as it may have hook generation
    };
    
    const pageUrl = servicePageMap[service.id];
    if (pageUrl) {
      router.push(pageUrl);
    }
  };

  // Handle upload button click - opens upload modal
  const handleUploadClick = () => {
    setSelectedService(services[0]); // Default to first service (long-to-shorts)
    setIsModalOpen(true);
  };

  const closeModal = React.useCallback(() => {
    setIsModalOpen(false);
    setSelectedService(null);
  }, []);

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
                    isActive={selectedService?.id === service.id && isModalOpen}
                  />
                ))}
              </div>
            </div>
          </div>
          
          {/* Quick Upload Button */}
          <div className="mt-4 flex justify-center">
            <button 
              onClick={handleUploadClick}
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
        onClose={useCallback(() => setIsSocialPopupOpen(false), [])}
        isProUser={isProUser}
        onSelectPlatform={handleSelectPlatform}
        onUpgradeClick={handleUpgradeClick}
      />

      {/* Pro User Modal for Non-Pro Users */}
      <ProModal 
        isOpen={isProModalOpen}
        onClose={useCallback(() => setIsProModalOpen(false), [])}
        onUpgrade={() => router.push("/resources/pricing?upgrade=social")}
      />
    </div>
  );
}
