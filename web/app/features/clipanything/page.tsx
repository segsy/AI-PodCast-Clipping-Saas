"use client";

import Link from "next/link";
import { ArrowLeft, Play, Zap, TrendingUp, Clock, Users, Star, Check, ChevronRight, Video, MessageSquare, Share2, Eye } from "lucide-react";
import { useEffect, useState } from "react";

interface CMSPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  seo?: any;
}

export default function ClipAnythingPage() {
  const [cmsData, setCmsData] = useState<CMSPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch CMS data for this page
    const fetchCMSData = async () => {
      try {
        const response = await fetch('/api/cms/pages?slug=features-clipanything');
        if (response.ok) {
          const data = await response.json();
          setCmsData(data.page);
        }
      } catch (error) {
        console.log('CMS data not available, using static content');
      } finally {
        setLoading(false);
      }
    };

    fetchCMSData();
  }, []);
  const stats = [
    { value: "10M+", label: "Videos Clipped", icon: Video },
    { value: "87%", label: "Viral Rate", icon: TrendingUp },
    { value: "2min", label: "Avg. Processing", icon: Clock },
    { value: "500K+", label: "Active Users", icon: Users },
  ];

  const features = [
    {
      title: "AI-Powered Detection",
      description: "Our AI automatically identifies the most engaging moments in your videos - hooks, punchlines, key insights, and emotional peaks.",
      icon: Zap,
    },
    {
      title: "One-Click Viral Clips",
      description: "Transform long-form content into platform-optimized shorts in a single click. Perfect for TikTok, Instagram Reels, and YouTube Shorts.",
      icon: Play,
    },
    {
      title: "Smart Editing",
      description: "Auto-trim, auto-crop, and auto-add captions to create scroll-stopping content that keeps viewers engaged.",
      icon: TrendingUp,
    },
    {
      title: "Multi-Platform Export",
      description: "Export to multiple aspect ratios and formats simultaneously - vertical for Reels, square for Instagram, horizontal for YouTube.",
      icon: Share2,
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Content Creator",
      handle: "@sarahchen",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      content: "ClipAnything transformed my content strategy. I went from posting once a week to daily viral shorts with minimal effort.",
      stats: "2M+ views/month",
    },
    {
      name: "Mike Rodriguez",
      role: "Podcast Host",
      handle: "@mikepodcast",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      content: "My podcast listener count grew 300% after I started using ClipAnything to create short clips for social media.",
      stats: "50K new followers",
    },
    {
      name: "Emma Thompson",
      role: "Marketing Manager",
      handle: "@emmat",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      content: "We've scaled our content production by 10x. What used to take our team hours now takes minutes.",
      stats: "500+ clips/month",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Upload Your Video",
      description: "Drag and drop any long-form video - podcasts, interviews, webinars, or livestreams.",
    },
    {
      number: "02",
      title: "AI Analyzes Content",
      description: "Our AI scans for engaging moments, emotional peaks, and hook-worthy segments.",
    },
    {
      number: "03",
      title: "Review & Customize",
      description: "Browse AI-suggested clips, make adjustments, or let AI auto-edit for you.",
    },
    {
      number: "04",
      title: "Export & Share",
      description: "Download in any format or directly publish to your social platforms.",
    },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  // If CMS data is available, render it
  if (cmsData) {
    return (
      <div>
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

        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "48px", fontWeight: "bold", marginBottom: "24px" }}>
            {cmsData.title}
          </h1>
          <div dangerouslySetInnerHTML={{ __html: cmsData.content }} />
        </div>
      </div>
    );
  }

  // Fallback to static content
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
          backgroundColor: "rgba(139, 92, 246, 0.1)", 
          padding: "8px 16px", 
          borderRadius: "24px",
          marginBottom: "24px"
        }}>
          <Zap size={16} style={{ color: "var(--primary)" }} />
          <span style={{ color: "var(--primary)", fontSize: "14px", fontWeight: 600 }}>AI-Powered Video Clipping</span>
        </div>
        
        <h1 style={{ 
          fontSize: "56px", 
          fontWeight: "bold", 
          marginBottom: "24px",
          lineHeight: 1.1
        }}>
          The fastest way to turn<br />
          <span style={{ color: "var(--primary)" }}>any video into viral shorts</span>
        </h1>
        
        <p style={{ 
          fontSize: "20px", 
          color: "var(--text-secondary)", 
          maxWidth: "600px",
          marginBottom: "40px"
        }}>
          Transform hours of long-form content into dozens of engaging short videos automatically. Stop spending hours editing - let AI do the heavy lifting.
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
            Start Clipping Free
            <ChevronRight size={20} />
          </Link>
          <Link 
            href="/resources/case-studies/clipanything"
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
              <stat.icon size={24} style={{ color: "var(--primary)", marginBottom: "8px" }} />
              <div style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "4px" }}>{stat.value}</div>
              <div style={{ fontSize: "14px", color: "var(--text-secondary)" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Demo Section */}
      <div style={{ marginBottom: "80px" }}>
        <div style={{ 
          position: "relative",
          aspectRatio: "16/9",
          maxWidth: "900px",
          backgroundColor: "var(--surface)",
          borderRadius: "20px",
          overflow: "hidden",
          border: "1px solid var(--border)"
        }}>
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(6, 182, 212, 0.2))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <div style={{
              width: "80px",
              height: "80px",
              backgroundColor: "var(--primary)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "transform 0.2s"
            }}>
              <Play size={32} style={{ color: "white", marginLeft: "4px" }} />
            </div>
          </div>
          <div style={{
            position: "absolute",
            bottom: "24px",
            left: "24px",
            right: "24px",
            padding: "16px",
            backgroundColor: "rgba(0,0,0,0.7)",
            borderRadius: "12px"
          }}>
            <div style={{ fontWeight: 600, marginBottom: "4px" }}>Watch how it works</div>
            <div style={{ fontSize: "14px", color: "var(--text-secondary)" }}>See ClipAnything in action - from upload to viral clip in 2 minutes</div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div style={{ marginBottom: "80px" }}>
        <h2 style={{ fontSize: "40px", fontWeight: "bold", marginBottom: "16px", textAlign: "center" }}>
          Everything you need to go viral
        </h2>
        <p style={{ fontSize: "18px", color: "var(--text-secondary)", marginBottom: "48px", textAlign: "center" }}>
          Powerful AI features that make video clipping effortless
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
                backgroundColor: "rgba(139, 92, 246, 0.1)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px"
              }}>
                <feature.icon size={24} style={{ color: "var(--primary)" }} />
              </div>
              <h3 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "12px" }}>{feature.title}</h3>
              <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.6 }}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div style={{ marginBottom: "80px" }}>
        <h2 style={{ fontSize: "40px", fontWeight: "bold", marginBottom: "16px", textAlign: "center" }}>
          How ClipAnything works
        </h2>
        <p style={{ fontSize: "18px", color: "var(--text-secondary)", marginBottom: "48px", textAlign: "center" }}>
          From upload to viral clip in four simple steps
        </p>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}>
          {steps.map((step, index) => (
            <div key={index} style={{ position: "relative" }}>
              <div style={{
                padding: "28px",
                backgroundColor: "var(--surface)",
                borderRadius: "16px",
                border: "1px solid var(--border)",
                height: "100%"
              }}>
                <div style={{ 
                  fontSize: "48px", 
                  fontWeight: "bold", 
                  color: "var(--primary)",
                  opacity: 0.3,
                  marginBottom: "16px"
                }}>
                  {step.number}
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "12px" }}>{step.title}</h3>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6 }}>{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <ChevronRight 
                  size={24} 
                  style={{ 
                    position: "absolute", 
                    right: "-12px", 
                    top: "50%", 
                    transform: "translateY(-50%)",
                    color: "var(--text-secondary)",
                    zIndex: 1
                  }} 
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div style={{ marginBottom: "80px" }}>
        <h2 style={{ fontSize: "40px", fontWeight: "bold", marginBottom: "48px", textAlign: "center" }}>
          Loved by 500K+ creators
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
                backgroundColor: "rgba(139, 92, 246, 0.1)",
                padding: "6px 12px",
                borderRadius: "20px",
                fontSize: "13px",
                color: "var(--primary)",
                fontWeight: 600
              }}>
                <TrendingUp size={14} />
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
          Ready to go viral?
        </h2>
        <p style={{ fontSize: "18px", color: "var(--text-secondary)", marginBottom: "32px", maxWidth: "500px", margin: "0 auto 32px" }}>
          Join 500K+ creators who are already producing viral content on autopilot.
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
            Start Clipping Free
            <ChevronRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}
