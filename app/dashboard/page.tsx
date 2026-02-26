"use client";

import { useState } from "react";
import { 
  Zap, 
  Upload, 
  Film, 
  BarChart3, 
  Settings, 
  CreditCard,
  Users,
  FolderOpen,
  Plus,
  Clock,
  TrendingUp,
  Wand2,
  Sparkles,
  Mic,
  Video,
  ImageIcon,
  ExternalLink
} from "lucide-react";

// Helper component for Upload Field
const UploadField = ({ title }: { title: string }) => {
  const [isDragging, setIsDragging] = useState(false);

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
    // Handle file drop
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
        isDragging 
          ? 'border-primary bg-primary/10' 
          : 'border-border bg-surface hover:border-primary/50 hover:bg-surface-hover'
      }`}
    >
      <div className="mb-4">
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Upload className="w-8 h-8 text-primary" />
        </div>
        <div className="text-xl font-bold text-white mb-2">Drop your video here</div>
        <div className="text-text-secondary mb-4">
          Drop a Zoom link, Drop a YouTube link, Drop a Twitch link, Drop a Rumble link
        </div>
      </div>
      <div className="flex items-center justify-center gap-4">
        <button className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors">
          Browse Files
        </button>
        <button className="px-6 py-3 bg-surface border border-border text-white rounded-lg font-medium hover:bg-surface-hover transition-colors">
          <GoogleDriveIcon /> Google Drive
        </button>
      </div>
      <div className="mt-4 text-sm text-text-muted">
        {title}
      </div>
    </div>
  );
};

// Google Drive Icon component
const GoogleDriveIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.75 9.5L12 2L4.25 9.5v5L12 22l7.75-7.5v-5z" fill="#34A853"/>
    <path d="M12 2v20" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Service Card component
const ServiceCard = ({ 
  title, 
  description, 
  icon: Icon, 
  sampleImages, 
  additionalText 
}: { 
  title: string, 
  description: string, 
  icon: any,
  sampleImages?: string[],
  additionalText?: string
}) => {
  return (
    <div className="bg-surface border border-border rounded-xl p-6 hover:border-primary/50 transition-colors">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center">
          <Icon className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <p className="text-text-secondary">{description}</p>
        </div>
      </div>
      
      {/* Sample Images */}
      {sampleImages && sampleImages.length > 0 && (
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {sampleImages.map((image, index) => (
            <div key={index} className="w-24 h-16 bg-background rounded-lg flex-shrink-0 flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-text-muted" />
            </div>
          ))}
        </div>
      )}

      {/* Upload Field */}
      <UploadField title="Get clips in 1 click" />
      
      {/* Additional Text */}
      {additionalText && (
        <div className="mt-4 text-sm text-text-secondary">
          {additionalText}
        </div>
      )}
    </div>
  );
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back!</h1>
          <p className="text-text-secondary">Here's what's happening with your content today.</p>
        </div>

        {/* Main Upload Section */}
        <div className="mb-12">
          <UploadField title="Get clips in 1 click" />
          <div className="mt-4 text-center">
            <button className="text-primary hover:text-primary-hover font-medium">
              Click here to try a sample project
            </button>
          </div>
        </div>

        {/* Services Grid */}
        <div className="space-y-8">
          {/* Long to Shorts */}
          <ServiceCard
            title="Long to shorts"
            description="AI finds hooks, highlights, and turns your video into viral shorts."
            icon={Film}
            sampleImages={["short1", "short2", "short3"]}
          />

          {/* AI Captions */}
          <ServiceCard
            title="AI Captions"
            description="Add stylish captions or translate your content with one click."
            icon={Sparkles}
            sampleImages={["caption1", "caption2", "caption3"]}
          />

          {/* Video Editor */}
          <ServiceCard
            title="Video editor"
            description="Upload your video and start editing for free."
            icon={Wand2}
            sampleImages={["editor1", "editor2", "editor3"]}
            additionalText="You can upload videos up to 120 minutes long. Credits are not required."
          />

          {/* Enhance Speech */}
          <ServiceCard
            title="Enhance speech"
            description="Enhance voice clarity and remove filler words with one click."
            icon={Mic}
            sampleImages={["speech1", "speech2"]}
            additionalText="You can upload videos up to 120 minutes long."
          />

          {/* AI Reframe */}
          <ServiceCard
            title="AI Reframe"
            description="Let AI automatically reframe your content to fit any social platform. Save time on manual reframing."
            icon={Video}
            sampleImages={["reframe1", "reframe2", "reframe3"]}
            additionalText="You can upload videos up to 120 minutes long."
          />

          {/* AI B-Roll */}
          <ServiceCard
            title="AI B-Roll"
            description="Add AI generated B-Roll to your video in 1 click."
            icon={ImageIcon}
            sampleImages={["broll1", "broll2"]}
            additionalText="You can upload videos up to 120 minutes long. Limited captions may impact B-roll generation due to insufficient data."
          />

          {/* AI Hook */}
          <ServiceCard
            title="AI Hook"
            description="Create a sound hook with the AI voice-over."
            icon={Zap}
            sampleImages={["hook1", "hook2"]}
          />
        </div>
      </main>
    </div>
  );
}
