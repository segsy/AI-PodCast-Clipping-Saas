"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight, TrendingUp, Users, DollarSign, Play, Check, Quote, Eye, MessageSquare, Share2, Video } from "lucide-react";

export default function ClipAnythingCaseStudy() {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    { 
      title: "The Beginning", 
      description: "Started with zero following, struggling to gain traction on social media with long-form podcast content",
      image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=1200&h=600&fit=crop",
      stat: "0 Followers"
    },
    { 
      title: "The Discovery", 
      description: "Discovered ClipAnything to turn podcast episodes into viral short clips",
      image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=1200&h=600&fit=crop",
      stat: "Aha Moment"
    },
    { 
      title: "Strategy Implementation", 
      description: "Used AI to identify and extract the most engaging moments from each episode",
      image: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=1200&h=600&fit=crop",
      stat: "50+ Clips/mo"
    },
    { 
      title: "Going Viral", 
      description: "Multiple clips went viral, driving exponential growth in views and followers",
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&h=600&fit=crop",
      stat: "Viral Hit"
    },
    { 
      title: "10M+ Views Milestone", 
      description: "Reached over 10 million views in just one month",
      image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=1200&h=600&fit=crop",
      stat: "10M+ Views"
    },
    { 
      title: "Monetization", 
      description: "Activated multiple income streams including brand deals, affiliates, and courses",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop",
      stat: "$15K/mo"
    },
  ];

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const metrics = [
    { value: "10M+", label: "Monthly Views", icon: TrendingUp },
    { value: "500K+", label: "Followers", icon: Users },
    { value: "$15K", label: "Monthly Income", icon: DollarSign },
    { value: "50+", label: "Viral Clips", icon: Play },
  ];

  return (
    <div>
      {/* Back Link */}
      <Link 
        href="/resources/customer-stories" 
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
        Back to Customer Stories
      </Link>

      {/* Hero */}
      <div style={{ marginBottom: "48px" }}>
        <span style={{ 
          backgroundColor: "rgba(139, 92, 246, 0.2)", 
          color: "var(--primary)", 
          padding: "6px 14px", 
          borderRadius: "20px",
          fontSize: "13px",
          fontWeight: 600
        }}>
          Creator Success Story
        </span>
        <h1 style={{ fontSize: "48px", fontWeight: "bold", marginTop: "16px", marginBottom: "16px" }}>
          How creators are earning 10M+ views in 1 month using ClipAnything
        </h1>
        <p style={{ fontSize: "20px", color: "var(--text-secondary)", maxWidth: "700px" }}>
          Follow the journey of a creator who transformed their content strategy and achieved viral success
        </p>
      </div>

      {/* Metrics */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(4, 1fr)", 
        gap: "24px",
        marginBottom: "64px"
      }}>
        {metrics.map((metric, index) => (
          <div 
            key={index}
            style={{
              padding: "24px",
              backgroundColor: "var(--surface)",
              borderRadius: "16px",
              border: "1px solid var(--border)",
              textAlign: "center"
            }}
          >
            <metric.icon size={28} style={{ color: "var(--primary)", marginBottom: "12px" }} />
            <div style={{ fontSize: "36px", fontWeight: "bold", marginBottom: "4px" }}>{metric.value}</div>
            <div style={{ fontSize: "14px", color: "var(--text-secondary)" }}>{metric.label}</div>
          </div>
        ))}
      </div>

      {/* Story Slider */}
      <div style={{ marginBottom: "64px" }}>
        <h2 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "32px" }}>The Journey</h2>
        
        <div style={{ 
          position: "relative",
          backgroundColor: "var(--surface)",
          borderRadius: "24px",
          overflow: "hidden",
          border: "1px solid var(--border)"
        }}>
          <div style={{ aspectRatio: "16/9" }}>
            <img 
              src={slides[activeSlide].image}
              alt={slides[activeSlide].title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          
          <div style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "32px",
            background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)"
          }}>
            <div style={{ 
              display: "inline-block",
              backgroundColor: "var(--primary)",
              color: "white",
              padding: "4px 12px",
              borderRadius: "12px",
              fontSize: "12px",
              fontWeight: 600,
              marginBottom: "12px"
            }}>
              {slides[activeSlide].stat}
            </div>
            <h3 style={{ fontSize: "28px", fontWeight: "bold", color: "white", marginBottom: "8px" }}>
              {slides[activeSlide].title}
            </h3>
            <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.8)", maxWidth: "600px" }}>
              {slides[activeSlide].description}
            </p>
          </div>
          
          <button 
            onClick={prevSlide}
            style={{
              position: "absolute",
              left: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "48px",
              height: "48px",
              backgroundColor: "rgba(255,255,255,0.9)",
              border: "none",
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            onClick={nextSlide}
            style={{
              position: "absolute",
              right: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "48px",
              height: "48px",
              backgroundColor: "rgba(255,255,255,0.9)",
              border: "none",
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <ChevronRight size={24} />
          </button>
          
          <div style={{
            position: "absolute",
            bottom: "16px",
            right: "16px",
            display: "flex",
            gap: "8px"
          }}>
            {slides.map((_, index) => (
              <div 
                key={index}
                style={{
                  width: index === activeSlide ? "24px" : "8px",
                  height: "8px",
                  backgroundColor: index === activeSlide ? "var(--primary)" : "rgba(255,255,255,0.5)",
                  borderRadius: "4px",
                  cursor: "pointer",
                  transition: "all 0.3s"
                }}
                onClick={() => setActiveSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Challenge & Solution */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "1fr 1fr", 
        gap: "32px",
        marginBottom: "64px"
      }}>
        <div style={{
          padding: "32px",
          backgroundColor: "var(--surface)",
          borderRadius: "16px",
          border: "1px solid var(--border)"
        }}>
          <h3 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "16px", color: "#ef4444" }}>The Challenge</h3>
          <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.7 }}>
            Creating consistent, engaging content for social media while producing long-form podcasts was overwhelming. 
            Manual editing took hours per video, and the creator had no editing skills. They were spending $2,000/month 
            on editors but still struggling to maintain a consistent posting schedule.
          </p>
        </div>
        
        <div style={{
          padding: "32px",
          backgroundColor: "var(--surface)",
          borderRadius: "16px",
          border: "1px solid var(--border)"
        }}>
          <h3 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "16px", color: "#22c55e" }}>The Solution</h3>
          <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.7 }}>
            ClipAnything automated the entire process. The AI identified the most engaging moments, auto-generated 
            captions, and created multiple clips from each episode. What took hours now takes minutes, and the 
            viral rate increased dramatically with professionally edited, optimized content.
          </p>
        </div>
      </div>

      {/* Results */}
      <div style={{ 
        padding: "48px",
        backgroundColor: "var(--surface)",
        borderRadius: "24px",
        border: "1px solid var(--border)",
        marginBottom: "48px"
      }}>
        <h2 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "32px" }}>The Results</h2>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "32px" }}>
          <div>
            <div style={{ fontSize: "48px", fontWeight: "bold", color: "var(--primary)", marginBottom: "8px" }}>10M+</div>
            <div style={{ fontSize: "16px", color: "var(--text-secondary)" }}>Monthly Views</div>
          </div>
          <div>
            <div style={{ fontSize: "48px", fontWeight: "bold", color: "var(--primary)", marginBottom: "8px" }}>500K+</div>
            <div style={{ fontSize: "16px", color: "var(--text-secondary)" }}>New Followers</div>
          </div>
          <div>
            <div style={{ fontSize: "48px", fontWeight: "bold", color: "var(--primary)", marginBottom: "8px" }}>$15K</div>
            <div style={{ fontSize: "16px", color: "var(--text-secondary)" }}>Monthly Income</div>
          </div>
        </div>
      </div>

      {/* Quote */}
      <div style={{ 
        padding: "48px",
        backgroundColor: "var(--surface)",
        borderRadius: "24px",
        border: "1px solid var(--border)",
        marginBottom: "48px",
        textAlign: "center"
      }}>
        <Quote size={48} style={{ color: "var(--primary)", marginBottom: "24px" }} />
        <p style={{ fontSize: "24px", fontWeight: "500", marginBottom: "24px", maxWidth: "800px", margin: "0 auto 24px", lineHeight: 1.5 }}>
          "ClipAnything literally changed my life. I went from working 60 hours a week on content to just 10 hours, 
          while my views increased by 100x. The ROI is insane - it paid for itself in the first week."
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
          <img 
            src="https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=100&h=100&fit=crop"
            alt="Creator"
            style={{ width: "56px", height: "56px", borderRadius: "50%", objectFit: "cover" }}
          />
          <div style={{ textAlign: "left" }}>
            <div style={{ fontWeight: "600" }}>Alex Johnson</div>
            <div style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Podcast Host, @alexTalks</div>
          </div>
        </div>
      </div>

      {/* Key Takeaways */}
      <div style={{ marginBottom: "48px" }}>
        <h2 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "24px" }}>Key Takeaways</h2>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }}>
          {[
            "Consistency is key - post daily using AI automation",
            "Hook-first content performs best on short-form platforms",
            "Auto-captions increase watch time by 40%",
            "Multiple aspect ratios maximize reach across platforms"
          ].map((takeaway, index) => (
            <div 
              key={index}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                padding: "20px",
                backgroundColor: "var(--surface)",
                borderRadius: "12px",
                border: "1px solid var(--border)"
              }}
            >
              <Check size={20} style={{ color: "var(--primary)", flexShrink: 0, marginTop: "2px" }} />
              <span style={{ fontSize: "15px" }}>{takeaway}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ 
        padding: "48px",
        backgroundColor: "var(--surface)",
        borderRadius: "24px",
        border: "1px solid var(--border)",
        textAlign: "center"
      }}>
        <h2 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "16px" }}>
          Start your viral journey today
        </h2>
        <p style={{ fontSize: "18px", color: "var(--text-secondary)", marginBottom: "32px", maxWidth: "500px", margin: "0 auto 32px" }}>
          Join 500K+ creators who are already producing viral content on autopilot.
        </p>
        <Link 
          href="/features/clipanything"
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
          Learn More About ClipAnything
        </Link>
      </div>
    </div>
  );
}
