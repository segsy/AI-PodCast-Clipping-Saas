"use client";

import Link from "next/link";
import { ArrowLeft, Play, Zap, TrendingUp, Clock, Users, Star, Check, ChevronRight, Maximize2, Smartphone, Tablet, Monitor, Globe, Sparkles } from "lucide-react";

export default function AIReframePage() {
  const stats = [
    { value: "10+", label: "Platform Formats", icon: Globe },
    { value: "1-Click", label: "Auto Resize", icon: Zap },
    { value: "90%", label: "Time Saved", icon: Clock },
    { value: "5M+", label: "Videos Resized", icon: Maximize2 },
  ];

  const features = [
    {
      title: "Smart Auto-Detection",
      description: "AI automatically detects the main subject and keeps it centered in every aspect ratio.",
      icon: Maximize2,
    },
    {
      title: "10+ Platform Formats",
      description: "One-click export to TikTok, Instagram Reels, YouTube Shorts, LinkedIn, Twitter, and more.",
      icon: Globe,
    },
    {
      title: "Auto Smart Framing",
      description: "Automatically adjust framing to highlight the most important parts of your video.",
      icon: Smartphone,
    },
    {
      title: "Batch Processing",
      description: "Resize multiple videos at once. Save hours of manual crop work.",
      icon: Zap,
    },
  ];

  const platforms = [
    { name: "TikTok", ratio: "9:16", icon: Smartphone },
    { name: "Instagram Reels", ratio: "9:16", icon: Smartphone },
    { name: "YouTube Shorts", ratio: "9:16", icon: Smartphone },
    { name: "Instagram Feed", ratio: "1:1", icon: Tablet },
    { name: "Facebook", ratio: "16:9", icon: Monitor },
    { name: "LinkedIn", ratio: "16:9", icon: Monitor },
    { name: "Twitter/X", ratio: "16:9", icon: Globe },
    { name: "Pinterest", ratio: "2:3", icon: Tablet },
  ];

  const testimonials = [
    {
      name: "Tom Williams",
      role: "Digital Marketer",
      handle: "@tomwilliams",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      content: "AI Reframe saved me hours of work. I used to spend 30 minutes per video cropping for different platforms.",
      stats: "90% time saved",
    },
    {
      name: "Lisa Chen",
      role: "Content Creator",
      handle: "@lisachen",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
      content: "Now I post to all platforms from one video. My reach has doubled across all social media.",
      stats: "2x reach",
    },
    {
      name: "Ryan Miller",
      role: "Agency Owner",
      handle: "@ryanagency",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      content: "We've scaled our client work by 5x. The batch processing feature is a game changer.",
      stats: "5x scaling",
    },
  ];

  return (
    <div>
      {/* Back Link */}
      <Link 
        href="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          color: "var(--text-secondary)",
          textDecoration: "none",
          fontSize: "14px",
          marginBottom: "32px"
        }}
      >
        <ArrowLeft size={16} />
        Back to Home
      </Link>

      {/* Hero Section */}
      <div style={{ marginBottom: "64px" }}>
        <div style={{ 
          display: "inline-flex", 
          alignItems: "center", 
          gap: "8px",
          backgroundColor: "rgba(236, 72, 153, 0.1)", 
          padding: "8px 16px", 
          borderRadius: "24px",
          marginBottom: "24px"
        }}>
          <Maximize2 size={16} style={{ color: "#ec4899" }} />
          <span style={{ color: "#ec4899", fontSize: "14px", fontWeight: 600 }}>AI-Powered Resizing</span>
        </div>
        
        <h1 style={{ 
          fontSize: "56px", 
          fontWeight: "bold", 
          marginBottom: "24px",
          lineHeight: 1.1
        }}>
          Resize any video for<br />
          <span style={{ color: "#ec4899" }}>every platform in 1 click</span>
        </h1>
        
        <p style={{ 
          fontSize: "20px", 
          color: "var(--text-secondary)", 
          maxWidth: "600px",
          marginBottom: "40px"
        }}>
          Stop manually cropping videos for each platform. AI Reframe automatically resizes and reframes your content for every social platform.
        </p>

        <div style={{ display: "flex", gap: "16px", marginBottom: "48px" }}>
          <Link 
            href="/dashboard"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "var(--primary)",
              color: "white",
              padding: "14px 28px",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: 600,
              textDecoration: "none"
            }}
          >
            Start Reframing Free
            <ChevronRight size={20} />
          </Link>
          <Link 
            href="/resources/case-studies/ai-reframe"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "transparent",
              color: "var(--text-primary)",
              padding: "14px 28px",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: 600,
              textDecoration: "none",
              border: "1px solid var(--border)"
            }}
          >
            View Case Studies
          </Link>
        </div>

        {/* Stats */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(4, 1fr)", 
          gap: "24px",
          padding: "32px",
          backgroundColor: "var(--surface)",
          borderRadius: "16px",
          border: "1px solid var(--border)"
        }}>
          {stats.map((stat, index) => (
            <div key={index} style={{ textAlign: "center" }}>
              <stat.icon size={24} style={{ color: "#ec4899", marginBottom: "8px" }} />
              <div style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "4px" }}>{stat.value}</div>
              <div style={{ fontSize: "14px", color: "var(--text-secondary)" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Platforms Grid */}
      <div style={{ marginBottom: "80px" }}>
        <h2 style={{ fontSize: "40px", fontWeight: "bold", marginBottom: "16px", textAlign: "center" }}>
          Support for All Platforms
        </h2>
        <p style={{ fontSize: "18px", color: "var(--text-secondary)", marginBottom: "48px", textAlign: "center" }}>
          Export to any aspect ratio with perfect framing
        </p>
        
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(4, 1fr)", 
          gap: "20px"
        }}>
          {platforms.map((platform, index) => (
            <div 
              key={index}
              style={{
                padding: "28px",
                backgroundColor: "var(--surface)",
                borderRadius: "16px",
                border: "1px solid var(--border)",
                textAlign: "center"
              }}
            >
              <platform.icon size={32} style={{ color: "#ec4899", marginBottom: "16px" }} />
              <div style={{ fontWeight: "600", marginBottom: "4px" }}>{platform.name}</div>
              <div style={{ fontSize: "14px", color: "var(--text-secondary)" }}>{platform.ratio}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div style={{ marginBottom: "80px" }}>
        <h2 style={{ fontSize: "40px", fontWeight: "bold", marginBottom: "16px", textAlign: "center" }}>
          Smart reframing features
        </h2>
        <p style={{ fontSize: "18px", color: "var(--text-secondary)", marginBottom: "48px", textAlign: "center" }}>
          AI that understands framing and keeps your content looking great
        </p>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "24px" }}>
          {features.map((feature, index) => (
            <div 
              key={index}
              style={{
                padding: "32px",
                backgroundColor: "var(--surface)",
                borderRadius: "16px",
                border: "1px solid var(--border)"
              }}
            >
              <div style={{
                width: "48px",
                height: "48px",
                backgroundColor: "rgba(236, 72, 153, 0.1)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px"
              }}>
                <feature.icon size={24} style={{ color: "#ec4899" }} />
              </div>
              <h3 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "12px" }}>{feature.title}</h3>
              <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.6 }}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div style={{ marginBottom: "80px" }}>
        <h2 style={{ fontSize: "40px", fontWeight: "bold", marginBottom: "48px", textAlign: "center" }}>
          Loved by marketers worldwide
        </h2>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              style={{
                padding: "28px",
                backgroundColor: "var(--surface)",
                borderRadius: "16px",
                border: "1px solid var(--border)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  style={{ width: "48px", height: "48px", borderRadius: "50%", objectFit: "cover" }}
                />
                <div>
                  <div style={{ fontWeight: "600" }}>{testimonial.name}</div>
                  <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{testimonial.handle}</div>
                </div>
              </div>
              <p style={{ fontSize: "15px", color: "var(--text-primary)", lineHeight: 1.6, marginBottom: "16px" }}>
                "{testimonial.content}"
              </p>
              <div style={{ 
                display: "inline-flex", 
                alignItems: "center", 
                gap: "6px",
                backgroundColor: "rgba(236, 72, 153, 0.1)",
                padding: "6px 12px",
                borderRadius: "20px",
                fontSize: "13px",
                color: "#ec4899",
                fontWeight: 600
              }}>
                <Sparkles size={14} />
                {testimonial.stats}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div style={{ 
        padding: "64px",
        backgroundColor: "var(--surface)",
        borderRadius: "24px",
        border: "1px solid var(--border)",
        textAlign: "center"
      }}>
        <h2 style={{ fontSize: "40px", fontWeight: "bold", marginBottom: "16px" }}>
          Resize for every platform
        </h2>
        <p style={{ fontSize: "18px", color: "var(--text-secondary)", marginBottom: "32px", maxWidth: "500px", margin: "0 auto 32px" }}>
          Stop manually cropping. Let AI do the work for you.
        </p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
          <Link 
            href="/dashboard"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "var(--primary)",
              color: "white",
              padding: "16px 32px",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: 600,
              textDecoration: "none"
            }}
          >
            Start Reframing
            <ChevronRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}
