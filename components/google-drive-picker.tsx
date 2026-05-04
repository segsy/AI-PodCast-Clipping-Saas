"use client";

import { useState, useEffect } from "react";
import { Loader2, Folder, FileVideo, FileAudio, File, AlertCircle, RefreshCw, LogOut, X } from "lucide-react";

interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink?: string;
  size?: number;
  modifiedTime: string;
  parents?: string[];
}

interface GoogleDrivePickerProps {
  onFileSelect: (file: GoogleDriveFile) => void;
  onClose: () => void;
}

export default function GoogleDrivePicker({ onFileSelect, onClose }: GoogleDrivePickerProps) {
  const [files, setFiles] = useState<GoogleDriveFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [folderPath, setFolderPath] = useState<{ id: string; name: string }[]>([]);
  const [connected, setConnected] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  // Check if Google Drive is connected
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const response = await fetch("/api/google-drive/status");
      const data = await response.json();
      setConnected(data.connected || false);
      if (data.connected) {
        loadFiles();
      }
    } catch (err) {
      console.error("Error checking Google Drive status:", err);
      setError("Failed to check connection status");
    } finally {
      setCheckingStatus(false);
    }
  };

  const loadFiles = async (folderId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (folderId) {
        params.append("folderId", folderId);
      }
      const response = await fetch(`/api/google-drive/files?${params}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to load files");
      }
      
      setFiles(data.files || []);
    } catch (err: any) {
      console.error("Error loading Google Drive files:", err);
      setError(err.message || "Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  const handleFolderClick = (folder: GoogleDriveFile) => {
    setCurrentFolder(folder.id);
    setFolderPath([...folderPath, { id: folder.id, name: folder.name }]);
    loadFiles(folder.id);
  };

  const handleFileSelect = (file: GoogleDriveFile) => {
    onFileSelect(file);
  };

  const handleBackClick = () => {
    if (folderPath.length === 0) return;
    const newPath = folderPath.slice(0, -1);
    setFolderPath(newPath);
    if (newPath.length === 0) {
      setCurrentFolder(null);
      loadFiles();
    } else {
      const parentFolder = newPath[newPath.length - 1];
      setCurrentFolder(parentFolder.id);
      loadFiles(parentFolder.id);
    }
  };

  const handleConnect = async () => {
    try {
      const response = await fetch("/api/google-drive/authorize");
      const data = await response.json();
      if (data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
      }
    } catch (err) {
      console.error("Error initiating Google Drive connection:", err);
      setError("Failed to connect to Google Drive");
    }
  };

  const handleDisconnect = async () => {
    try {
      await fetch("/api/google-drive/disconnect", { method: "POST" });
      setConnected(false);
      setFiles([]);
    } catch (err) {
      console.error("Error disconnecting Google Drive:", err);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown size";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType === "application/vnd.google-apps.folder") {
      return <Folder className="w-8 h-8 text-yellow-500" />;
    }
    if (mimeType.startsWith("video/")) {
      return <FileVideo className="w-8 h-8 text-blue-500" />;
    }
    if (mimeType.startsWith("audio/")) {
      return <FileAudio className="w-8 h-8 text-green-500" />;
    }
    return <File className="w-8 h-8 text-gray-500" />;
  };

  if (checkingStatus) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2">Checking Google Drive status...</span>
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="text-center p-8">
        <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
          <RefreshCw className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Connect Google Drive</h3>
        <p className="text-text-secondary mb-6">
          Connect your Google Drive to import videos directly from your cloud storage.
        </p>
        <button
          onClick={handleConnect}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-lg font-semibold transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Connect Google Drive
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Google Drive</h3>
          <p className="text-sm text-text-secondary">
            {folderPath.length > 0 
              ? folderPath.map(f => f.name).join(" / ")
              : "My Drive"
            }
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDisconnect}
            className="p-2 text-text-secondary hover:text-white transition-colors"
            title="Disconnect"
          >
            <LogOut className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
            className="p-2 text-text-secondary hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Breadcrumb navigation */}
      {folderPath.length > 0 && (
        <button
          onClick={handleBackClick}
          className="flex items-center gap-2 text-sm text-primary hover:text-primary-hover mb-4"
        >
          ← Back
        </button>
      )}

      {/* Files grid */}
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2">Loading files...</span>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center p-8 text-red-500">
          <AlertCircle className="w-12 h-12 mb-2" />
          <p>{error}</p>
          <button
            onClick={() => loadFiles(currentFolder)}
            className="mt-4 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg"
          >
            Try Again
          </button>
        </div>
      ) : files.length === 0 ? (
        <div className="text-center p-8 text-text-secondary">
          <Folder className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>This folder is empty</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 overflow-y-auto max-h-96">
          {files.map((file) => (
            <div
              key={file.id}
              onClick={() => {
                if (file.mimeType === "application/vnd.google-apps.folder") {
                  handleFolderClick(file);
                } else {
                  handleFileSelect(file);
                }
              }}
              className="flex flex-col items-center p-4 bg-background border border-border rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
            >
              {file.thumbnailLink ? (
                <img
                  src={file.thumbnailLink}
                  alt={file.name}
                  className="w-full aspect-video object-cover rounded mb-2"
                />
              ) : (
                getFileIcon(file.mimeType)
              )}
              <p className="text-sm text-white text-center truncate w-full" title={file.name}>
                {file.name}
              </p>
              {file.size && (
                <p className="text-xs text-text-secondary">{formatFileSize(file.size)}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
