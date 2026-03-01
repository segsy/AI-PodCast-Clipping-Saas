"use client";

import Link from "next/link";
import { ArrowLeft, Play, Zap, TrendingUp, Clock, Users, Star, Check, ChevronRight, Clapperboard, Video, Film, Sparkles, Search } from "lucide-react";

export default function AIBRollPage() {
  const stats = [
    { value: "1M+", label: "Stock Videos", icon: Film },
    { value: "<1min", label: "Search Time", icon: Clock },
    { value: "100%", label: "Relevant B-Roll", icon: Sparkles },
    { value: "Free", label: "Included", icon: Zap },
  ];

  const features = [
    {
      title: "AI-Powered Search",
      description: "Describe what you need in plain English. AI finds the perfect B-Roll in seconds.",
      icon: Search,
    },
    {
      title: "Context-Aware Selection",
      description: "AI understands your video content and suggests B-Roll that matches the mood and context.",
      icon: Sparkles,
    },
    {
      title: "Automatic Insertion",
      description: "AI automatically inserts B-Roll at the perfect moments in your video.",
      icon: Clapperboard,
    },
    {
      title: "Royalty-Free Library",
      description: "Access millions of royalty-free stock videos. No licensing worries.",
      icon: Film,
    },
  ];

  const brollExamples = [
    { query: "office meeting", videos: 12500 },
    { query: "city skyline", videos: 8900 },
    { query: "nature landscape", videos: 15200 },
    { query: "technology", videos: 9800 },
  ];

  const testimonials = [
    {
      name: "Kevin Zhang",
      role: "Video Editor",
      handle: "@kevinedits",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      content: "Finding the right B-Roll used to take me hours. Now it takes under a minute. Total game changer.",
      stats: "10+ hours saved/week",
    },
    {
      name: "Amanda Ross",
      role: "YouTuber",
      handle: "@amandaross",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      content: "My videos look so much more professional now. The AI always picks the perfect B-Roll.",
      stats: "50% better retention",
    },
    {
      name: "Chris Taylor",
      role: "Marketing Lead",
      handle: "@christaylor",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      content: "We've cut our video production time in half. The B-Roll feature alone is worth it.",
      stats: "50% faster production",
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
          backgroundColor: "rgba(34, 197, 94, 0.1)", 
          padding: "8px 16px", 
          borderRadius: "24px",
          marginBottom: "24px"
        }}>
          <Clapperboard size={16} style={{ color: "#22c55e" }} />
          <span style={{ color: "#22c55e", fontSize: "14px", fontWeight: 600 }}>AI-Powered B-Roll</span>
        </div>
        
        <h1 style={{ 
          fontSize: "56px", 
          fontWeight: "bold", 
          marginBottom: "24px",
          lineHeight: 1.1
        }}>
          Get relevant AI B-Roll<br />
          <span style={{ color: "#22c55e" }}>in 1 click, under 1 minute</span>
        </h1>
        
        <p style={{ 
          fontSize: "20px", 
          color: "var(--text-secondary)", 
          maxWidth: "600px",
          marginBottom: "40px"
        }}>
          Never struggle to find the perfect B-Roll again. Describe what you need and let AI find and insert it automatically.
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
            Try AI B-Roll Free
            <ChevronRight size={20} />
          </Link>
          <Link 
            href="/resources/case-studies/ai-broll"
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
              <stat.icon size={24} style={{ color: "#22c55e", marginBottom: "8px" }} />
              <div style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "4px" }}>{stat.value}</div>
              <div style={{ fontSize: "14px", color: "var(--text-secondary)" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Search Demo */}
      <div style={{ marginBottom: "80px" }}>
        <h2 style={{ fontSize: "40px", fontWeight: "bold", marginBottom: "16px", textAlign: "center" }}>
          Just describe what you need
        </h2>
        <p style={{ fontSize: "18px", color: "var(--text-secondary)", marginBottom: "48px", textAlign: "center" }}>
          AI finds the perfect B-Roll from millions of stock videos
        </p>
        
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(2, 1fr)", 
          gap: "20px"
        }}>
          {brollExamples.map((example, index) => (
            <div 
              key={index}
              style={{
                padding: "24px",
                backgroundColor: "var(--surface)",
                borderRadius: "16px",
                border: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <div>
                <div style={{ fontWeight: "600", fontSize: "18px", marginBottom: "4px" }}>"{example.query}"</div>
                <div style={{ fontSize: "14px", color: "var(--text-secondary)" }}>{example.videos.toLocaleString()} videos found</div>
              </div>
              <Search size={20} style={{ color: "#22c55e" }} />
            </div>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div style={{ marginBottom: "80px" }}>
        <h2 style={{ fontSize: "40px", fontWeight: "bold", marginBottom: "16px", textAlign: "center" }}>
          Smart B-Roll features
        </h2>
        <p style={{ fontSize: "18px", color: "var(--text-secondary)", marginBottom: "48px", textAlign: "center" }}>
          Everything you need to add professional B-Roll
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
                backgroundColor: "rgba(34, 197, 94, 0.1)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px"
              }}>
                <feature.icon size={24} style={{ color: "#22c55e" }} />
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
          Loved by video creators
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
                backgroundColor: "rgba(34, 197, 94, 0.1)",
                padding: "6px 12px",
                borderRadius: "20px",
                fontSize: "13px",
                color: "#22c55e",
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
          Find perfect B-Roll in seconds
        </h2>
        <p style={{ fontSize: "18px", color: "var(--text-secondary)", marginBottom: "32px", maxWidth: "500px", margin: "0 auto 32px" }}>
          Let AI do the searching for you.
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
            Try AI B-Roll Now
            <ChevronRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}
