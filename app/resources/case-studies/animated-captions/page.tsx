"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight, TrendingUp, Users, DollarSign, Play, Check, Quote, Eye, MessageSquare, Sparkles, Type } from "lucide-react";

export default function AnimatedCaptionsCaseStudy() {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    { 
      title: "The Problem", 
      description: "Low engagement and watch time despite quality content",
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&h=600&fit=crop",
      stat: "15% Watch Time"
    },
    { 
      title: "Discovery", 
      description: "Found that captioned videos get 40% more views",
      image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=1200&h=600&fit=crop",
      stat: "Aha Moment"
    },
    { 
      title: "Implementation", 
      description: "Added animated captions to all new content",
      image: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=1200&h=600&fit=crop",
      stat: "100+ Videos"
    },
    { 
      title: "Results", 
      description: "Engagement and watch time skyrocketed",
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&h=600&fit=crop",
      stat: "3x Engagement"
    },
    { 
      title: "Growth", 
      description: "Follower count grew exponentially",
      image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=1200&h=600&fit=crop",
      stat: "200K+ Followers"
    },
    { 
      title: "Success", 
      description: "Became a recognized creator in the niche",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop",
      stat: "Brand Deals"
    },
  ];

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const metrics = [
    { value: "3x", label: "Engagement", icon: Sparkles },
    { value: "40%", label: "More Watch Time", icon: TrendingUp },
    { value: "200K+", label: "New Followers", icon: Users },
    { value: "50+", label: "Brand Deals", icon: DollarSign },
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
          backgroundColor: "rgba(6, 182, 212, 0.2)", 
          color: "var(--accent)", 
          padding: "6px 14px", 
          borderRadius: "20px",
          fontSize: "13px",
          fontWeight: 600
        }}>
          Success Story
        </span>
        <h1 style={{ fontSize: "48px", fontWeight: "bold", marginTop: "16px", marginBottom: "16px" }}>
          How animated captions helped achieve 3x engagement
        </h1>
        <p style={{ fontSize: "20px", color: "var(--text-secondary)", maxWidth: "700px" }}>
          Discover how one creator transformed their content strategy and achieved viral success
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
            <metric.icon size={28} style={{ color: "var(--accent)", marginBottom: "12px" }} />
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
              backgroundColor: "var(--accent)",
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
            Creating quality content but struggling with engagement. Videos were getting recommended 
            but viewers weren't watching until the end. No professional editing skills or budget 
            for a video editor.
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
            Added animated captions using our AI-powered captioning tool. The auto-sync feature 
            matched captions to speech perfectly, and the variety of styles helped create 
            scroll-stopping content without any design skills.
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
            <div style={{ fontSize: "48px", fontWeight: "bold", color: "var(--accent)", marginBottom: "8px" }}>3x</div>
            <div style={{ fontSize: "16px", color: "var(--text-secondary)" }}>Engagement Rate</div>
          </div>
          <div>
            <div style={{ fontSize: "48px", fontWeight: "bold", color: "var(--accent)", marginBottom: "8px" }}>40%</div>
            <div style={{ fontSize: "16px", color: "var(--text-secondary)" }}>More Watch Time</div>
          </div>
          <div>
            <div style={{ fontSize: "48px", fontWeight: "bold", color: "var(--accent)", marginBottom: "8px" }}>200K+</div>
            <div style={{ fontSize: "16px", color: "var(--text-secondary)" }}>New Followers</div>
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
        <Quote size={48} style={{ color: "var(--accent)", marginBottom: "24px" }} />
        <p style={{ fontSize: "24px", fontWeight: "500", marginBottom: "24px", maxWidth: "800px", margin: "0 auto 24px", lineHeight: 1.5 }}>
          "Animated captions completely changed my content. My videos went from getting ignored to 
          stopping people mid-scroll. The best investment I've made in my content strategy."
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
          <img 
            src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop"
            alt="Creator"
            style={{ width: "56px", height: "56px", borderRadius: "50%", objectFit: "cover" }}
          />
          <div style={{ textAlign: "left" }}>
            <div style={{ fontWeight: "600" }}>Jessica Lee</div>
            <div style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Social Media Manager</div>
          </div>
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
          Boost your engagement today
        </h2>
        <p style={{ fontSize: "18px", color: "var(--text-secondary)", marginBottom: "32px", maxWidth: "500px", margin: "0 auto 32px" }}>
          Add animated captions to your videos and see the difference.
        </p>
        <Link 
          href="/features/animated-captions"
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
          Learn More About Animated Captions
        </Link>
      </div>
    </div>
  );
}
