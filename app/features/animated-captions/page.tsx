"use client";

import Link from "next/link";
import { ArrowLeft, Play, Zap, TrendingUp, Clock, Users, Star, Check, ChevronRight, Type, Palette, Video, MessageSquare, Eye, Sparkles } from "lucide-react";

export default function AnimatedCaptionsPage() {
  const stats = [
    { value: "95%", label: "Videos with Captions", icon: Type },
    { value: "40%", label: "More Watch Time", icon: TrendingUp },
    { value: "60+", label: "Caption Styles", icon: Palette },
    { value: "3x", label: "Engagement Boost", icon: Sparkles },
  ];

  const features = [
    {
      title: "AI-Powered Transcription",
      description: "Automatically transcribe any video in 50+ languages with 99% accuracy. No manual typing required.",
      icon: Type,
    },
    {
      title: "Animated Caption Styles",
      description: "Choose from 60+ professionally designed animated caption styles. From subtle pops to dynamic reveals.",
      icon: Sparkles,
    },
    {
      title: "Smart Timing Sync",
      description: "AI automatically syncs captions with speech patterns, pauses, and emphasis for perfect timing.",
      icon: Clock,
    },
    {
      title: "Brand Customization",
      description: "Match your brand colors, fonts, and style. Create reusable caption templates for consistency.",
      icon: Palette,
    },
  ];

  const testimonials = [
    {
      name: "Jessica Lee",
      role: "Social Media Manager",
      handle: "@jessicalee",
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop",
      content: "Our engagement skyrocketed after adding animated captions. Comments increased by 300%!",
      stats: "3x engagement",
    },
    {
      name: "David Park",
      role: "YouTuber",
      handle: "@davidpark",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      content: "Animated captions made my videos stand out. My click-through rate improved significantly.",
      stats: "50% more clicks",
    },
    {
      name: "Maria Garcia",
      role: "Content Creator",
      handle: "@mariacreates",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
      content: "Finally, captions that look professional without needing design skills. Total game changer.",
      stats: "100+ videos styled",
    },
  ];

  const captionStyles = [
    { name: "Pop", description: "Bold, eye-catching" },
    { name: "Typewriter", description: "Classic reveal effect" },
    { name: "Wave", description: "Fluid motion" },
    { name: "Glitch", description: "Modern tech vibe" },
    { name: "Smooth", description: "Elegant transitions" },
    { name: "Bounce", description: "Playful energy" },
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
          backgroundColor: "rgba(6, 182, 212, 0.1)", 
          padding: "8px 16px", 
          borderRadius: "24px",
          marginBottom: "24px"
        }}>
          <Sparkles size={16} style={{ color: "var(--accent)" }} />
          <span style={{ color: "var(--accent)", fontSize: "14px", fontWeight: 600 }}>AI-Powered Captions</span>
        </div>
        
        <h1 style={{ 
          fontSize: "56px", 
          fontWeight: "bold", 
          marginBottom: "24px",
          lineHeight: 1.1
        }}>
          The fastest way to add<br />
          <span style={{ color: "var(--accent)" }}>animated captions</span>
        </h1>
        
        <p style={{ 
          fontSize: "20px", 
          color: "var(--text-secondary)", 
          maxWidth: "600px",
          marginBottom: "40px"
        }}>
          Transform static subtitles into scroll-stopping animated captions. Boost engagement by 3x with professional captions in minutes.
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
            Add Captions Free
            <ChevronRight size={20} />
          </Link>
          <Link 
            href="/resources/case-studies/animated-captions"
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
              <stat.icon size={24} style={{ color: "var(--accent)", marginBottom: "8px" }} />
              <div style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "4px" }}>{stat.value}</div>
              <div style={{ fontSize: "14px", color: "var(--text-secondary)" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Caption Styles Demo */}
      <div style={{ marginBottom: "80px" }}>
        <h2 style={{ fontSize: "40px", fontWeight: "bold", marginBottom: "16px", textAlign: "center" }}>
          60+ Caption Styles
        </h2>
        <p style={{ fontSize: "18px", color: "var(--text-secondary)", marginBottom: "48px", textAlign: "center" }}>
          From subtle to bold, find the perfect style for your brand
        </p>
        
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(3, 1fr)", 
          gap: "20px",
          marginBottom: "40px"
        }}>
          {captionStyles.map((style, index) => (
            <div 
              key={index}
              style={{
                padding: "32px",
                backgroundColor: "var(--surface)",
                borderRadius: "16px",
                border: "1px solid var(--border)",
                textAlign: "center",
                cursor: "pointer",
                transition: "border-color 0.2s"
              }}
            >
              <div style={{
                height: "60px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px"
              }}>
                <span style={{ 
                  fontSize: "24px", 
                  fontWeight: "bold",
                  color: "var(--accent)"
                }}>
                  {style.name}
                </span>
              </div>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>{style.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div style={{ marginBottom: "80px" }}>
        <h2 style={{ fontSize: "40px", fontWeight: "bold", marginBottom: "16px", textAlign: "center" }}>
          Everything you need for captions
        </h2>
        <p style={{ fontSize: "18px", color: "var(--text-secondary)", marginBottom: "48px", textAlign: "center" }}>
          Professional caption features that make your content stand out
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
                backgroundColor: "rgba(6, 182, 212, 0.1)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px"
              }}>
                <feature.icon size={24} style={{ color: "var(--accent)" }} />
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
          Loved by creators worldwide
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
                backgroundColor: "rgba(6, 182, 212, 0.1)",
                padding: "6px 12px",
                borderRadius: "20px",
                fontSize: "13px",
                color: "var(--accent)",
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
          Ready to boost engagement?
        </h2>
        <p style={{ fontSize: "18px", color: "var(--text-secondary)", marginBottom: "32px", maxWidth: "500px", margin: "0 auto 32px" }}>
          Add animated captions to your videos and watch your engagement soar.
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
            Start Adding Captions
            <ChevronRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}
