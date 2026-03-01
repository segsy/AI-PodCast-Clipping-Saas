"use client";

import Link from "next/link";
import { ArrowLeft, Play, Zap, TrendingUp, Clock, Users, Star, Check, ChevronRight, Image, Sparkles, Eye, MousePointer, Youtube } from "lucide-react";

export default function ThumbnailGeneratorPage() {
  const stats = [
    { value: "1-Click", label: "Generation", icon: Zap },
    { value: "50+", label: "Styles", icon: Sparkles },
    { value: "3x", label: "More Clicks", icon: MousePointer },
    { value: "Free", label: "Included", icon: Eye },
  ];

  const features = [
    {
      title: "AI Thumbnail Generation",
      description: "Drop a link and get a professional YouTube thumbnail in seconds.",
      icon: Sparkles,
    },
    {
      title: "Smart Design",
      description: "AI uses proven design principles to create click-worthy thumbnails.",
      icon: Image,
    },
    {
      title: "Multiple Variations",
      description: "Get 5+ thumbnail options to choose from. Pick the best one.",
      icon: Zap,
    },
    {
      title: "Brand Consistency",
      description: "Apply your brand colors and style to all thumbnails automatically.",
      icon: Star,
    },
  ];

  const thumbnailStyles = [
    { name: "Bold", description: "High contrast, eye-catching" },
    { name: "Minimal", description: "Clean and simple" },
    { name: "Gaming", description: "Gamer aesthetic" },
    { name: "Vlog", description: "Personal brand style" },
    { name: "Tech", description: "Modern tech vibe" },
    { name: "Tutorial", description: "Educational look" },
  ];

  const testimonials = [
    {
      name: "Jake Wilson",
      role: "YouTuber",
      handle: "@jakepicks",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      content: "My click-through rate increased 3x after using AI-generated thumbnails. Game changer!",
      stats: "3x CTR boost",
    },
    {
      name: "Megan Lee",
      role: "Content Creator",
      handle: "@meganlee",
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop",
      content: "I used to spend hours designing thumbnails. Now I get professional ones in seconds.",
      stats: "10+ hours saved",
    },
    {
      name: "Tyler Brooks",
      role: "Tech Reviewer",
      handle: "@tylertech",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      content: "All my thumbnails now look consistent and professional. My subscribers love them.",
      stats: "500K+ subscribers",
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
          backgroundColor: "rgba(239, 68, 68, 0.1)", 
          padding: "8px 16px", 
          borderRadius: "24px",
          marginBottom: "24px"
        }}>
          <Image size={16} style={{ color: "#ef4444" }} />
          <span style={{ color: "#ef4444", fontSize: "14px", fontWeight: 600 }}>Thumbnail Generator</span>
        </div>
        
        <h1 style={{ 
          fontSize: "56px", 
          fontWeight: "bold", 
          marginBottom: "24px",
          lineHeight: 1.1
        }}>
          Drop a link & get<br />
          <span style={{ color: "#ef4444" }}>YouTube thumbnail in 1 click</span>
        </h1>
        
        <p style={{ 
          fontSize: "20px", 
          color: "var(--text-secondary)", 
          maxWidth: "600px",
          marginBottom: "40px"
        }}>
          Generate professional YouTube thumbnails instantly. Boost your click-through rate with AI-designed thumbnails.
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
            Generate Thumbnails Free
            <ChevronRight size={20} />
          </Link>
          <Link 
            href="/resources/case-studies/thumbnail-generator"
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
              <stat.icon size={24} style={{ color: "#ef4444", marginBottom: "8px" }} />
              <div style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "4px" }}>{stat.value}</div>
              <div style={{ fontSize: "14px", color: "var(--text-secondary)" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Thumbnail Styles */}
      <div style={{ marginBottom: "80px" }}>
        <h2 style={{ fontSize: "40px", fontWeight: "bold", marginBottom: "16px", textAlign: "center" }}>
          Thumbnail Styles
        </h2>
        <p style={{ fontSize: "18px", color: "var(--text-secondary)", marginBottom: "48px", textAlign: "center" }}>
          Choose from 50+ AI-generated styles
        </p>
        
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(3, 1fr)", 
          gap: "20px"
        }}>
          {thumbnailStyles.map((style, index) => (
            <div 
              key={index}
              style={{
                padding: "24px",
                backgroundColor: "var(--surface)",
                borderRadius: "16px",
                border: "1px solid var(--border)"
              }}
            >
              <div style={{ 
                aspectRatio: "16/9", 
                backgroundColor: "#1a1a2e",
                borderRadius: "12px",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <Youtube size={32} style={{ color: "#ef4444" }} />
              </div>
              <div style={{ fontWeight: "600", marginBottom: "4px" }}>{style.name}</div>
              <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{style.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div style={{ marginBottom: "80px" }}>
        <h2 style={{ fontSize: "40px", fontWeight: "bold", marginBottom: "16px", textAlign: "center" }}>
          Thumbnail features
        </h2>
        <p style={{ fontSize: "18px", color: "var(--text-secondary)", marginBottom: "48px", textAlign: "center" }}>
          Everything you need for click-worthy thumbnails
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
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px"
              }}>
                <feature.icon size={24} style={{ color: "#ef4444" }} />
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
          Loved by YouTubers
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
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                padding: "6px 12px",
                borderRadius: "20px",
                fontSize: "13px",
                color: "#ef4444",
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
          Get more clicks
        </h2>
        <p style={{ fontSize: "18px", color: "var(--text-secondary)", marginBottom: "32px", maxWidth: "500px", margin: "0 auto 32px" }}>
          Generate professional thumbnails that get clicked.
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
            Generate Thumbnails
            <ChevronRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}
