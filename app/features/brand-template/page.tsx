"use client";

import Link from "next/link";
import { ArrowLeft, Play, Zap, TrendingUp, Clock, Users, Star, Check, ChevronRight, Palette, Type, Image, Sparkles, Layout } from "lucide-react";

export default function BrandTemplatePage() {
  const stats = [
    { value: "50+", label: "Templates", icon: Layout },
    { value: "1-Click", label: "Apply", icon: Zap },
    { value: "100%", label: "Brand Consistent", icon: Palette },
    { value: "Unlimited", label: "Customization", icon: Sparkles },
  ];

  const features = [
    {
      title: "Custom Templates",
      description: "Create and save your own templates with your brand colors, fonts, and styles.",
      icon: Palette,
    },
    {
      title: "Brand Kit",
      description: "Store all your brand assets in one place. Colors, logos, fonts, and more.",
      icon: Layout,
    },
    {
      title: "One-Click Apply",
      description: "Apply your brand template to any video with a single click. Instant consistency.",
      icon: Zap,
    },
    {
      title: "Auto-Matching",
      description: "AI automatically applies your brand elements to new content.",
      icon: Sparkles,
    },
  ];

  const templateTypes = [
    { name: "Intro", preview: "🎬" },
    { name: "Outro", preview: "🎬" },
    { name: "Lower Thirds", preview: "📝" },
    { name: "Captions", preview: "💬" },
    { name: "Transitions", preview: "➡️" },
    { name: "Brand Frame", preview: "🖼️" },
  ];

  const testimonials = [
    {
      name: "David Miller",
      role: "Agency Founder",
      handle: "@davidagency",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      content: "Our client videos now look consistent and professional. Brand templates saved us hundreds of hours.",
      stats: "50+ clients",
    },
    {
      name: "Jennifer Lee",
      role: "Brand Manager",
      handle: "@jenniferlee",
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop",
      content: "Every video we publish now has our brand identity. No more inconsistent visuals across platforms.",
      stats: "100% consistent",
    },
    {
      name: "Mike Chen",
      role: "Content Creator",
      handle: "@mikechen",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      content: "My videos now look like they have a whole design team behind them. Best investment ever.",
      stats: "10x faster",
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
          backgroundColor: "rgba(168, 85, 247, 0.1)", 
          padding: "8px 16px", 
          borderRadius: "24px",
          marginBottom: "24px"
        }}>
          <Palette size={16} style={{ color: "#a855f7" }} />
          <span style={{ color: "#a855f7", fontSize: "14px", fontWeight: 600 }}>Brand Templates</span>
        </div>
        
        <h1 style={{ 
          fontSize: "56px", 
          fontWeight: "bold", 
          marginBottom: "24px",
          lineHeight: 1.1
        }}>
          Easily create and add<br />
          <span style={{ color: "#a855f7" }}>brand templates in 1 click</span>
        </h1>
        
        <p style={{ 
          fontSize: "20px", 
          color: "var(--text-secondary)", 
          maxWidth: "600px",
          marginBottom: "40px"
        }}>
          Maintain consistent brand identity across all your videos. Create templates once, apply forever.
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
            Create Templates Free
            <ChevronRight size={20} />
          </Link>
          <Link 
            href="/resources/case-studies/brand-template"
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
              <stat.icon size={24} style={{ color: "#a855f7", marginBottom: "8px" }} />
              <div style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "4px" }}>{stat.value}</div>
              <div style={{ fontSize: "14px", color: "var(--text-secondary)" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Template Types */}
      <div style={{ marginBottom: "80px" }}>
        <h2 style={{ fontSize: "40px", fontWeight: "bold", marginBottom: "16px", textAlign: "center" }}>
          Template Types
        </h2>
        <p style={{ fontSize: "18px", color: "var(--text-secondary)", marginBottom: "48px", textAlign: "center" }}>
          Create templates for every part of your video
        </p>
        
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(3, 1fr)", 
          gap: "20px"
        }}>
          {templateTypes.map((type, index) => (
            <div 
              key={index}
              style={{
                padding: "32px",
                backgroundColor: "var(--surface)",
                borderRadius: "16px",
                border: "1px solid var(--border)",
                textAlign: "center"
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>{type.preview}</div>
              <div style={{ fontWeight: "600" }}>{type.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div style={{ marginBottom: "80px" }}>
        <h2 style={{ fontSize: "40px", fontWeight: "bold", marginBottom: "16px", textAlign: "center" }}>
          Brand template features
        </h2>
        <p style={{ fontSize: "18px", color: "var(--text-secondary)", marginBottom: "48px", textAlign: "center" }}>
          Everything you need for consistent branding
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
                backgroundColor: "rgba(168, 85, 247, 0.1)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px"
              }}>
                <feature.icon size={24} style={{ color: "#a855f7" }} />
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
          Loved by brands worldwide
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
                backgroundColor: "rgba(168, 85, 247, 0.1)",
                padding: "6px 12px",
                borderRadius: "20px",
                fontSize: "13px",
                color: "#a855f7",
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
          Build your brand today
        </h2>
        <p style={{ fontSize: "18px", color: "var(--text-secondary)", marginBottom: "32px", maxWidth: "500px", margin: "0 auto 32px" }}>
          Create consistent, professional videos with brand templates.
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
            Create Templates Now
            <ChevronRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}
