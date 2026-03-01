"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight, TrendingUp, Users, DollarSign, Play, Check, Quote } from "lucide-react";

export default function CreatorsViewsCaseStudy() {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    { 
      title: "The Beginning", 
      description: "Started with zero following, struggling to gain traction on social media",
      image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=1200&h=600&fit=crop",
      stat: "0 Followers"
    },
    { 
      title: "The Discovery", 
      description: "Discovered video clipping strategy to turn long content into viral shorts",
      image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=1200&h=600&fit=crop",
      stat: "Aha Moment"
    },
    { 
      title: "Strategy Implementation", 
      description: "Used ClipAnything to identify and extract the most engaging moments",
      image: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=1200&h=600&fit=crop",
      stat: "10x Content"
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
          backgroundColor: "rgba(6, 182, 212, 0.2)", 
          color: "var(--accent)", 
          padding: "6px 14px", 
          borderRadius: "20px",
          fontSize: "13px",
          fontWeight: 600
        }}>
          Creator Success Story
        </span>
        <h1 style={{ fontSize: "48px", fontWeight: "bold", marginTop: "16px", marginBottom: "16px" }}>
          How creators are earning 10M+ views in 1 month using video clipping
        </h1>
        <p style={{ fontSize: "20px", color: "var(--text-secondary)", maxWidth: "700px" }}>
          Follow the journey of a creator who transformed their content strategy and achieved viral success
        </p>
      </div>

      {/* Stats Banner */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(4, 1fr)", 
        gap: "24px",
        marginBottom: "48px"
      }}>
        {metrics.map((metric, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "var(--surface)",
              borderRadius: "16px",
              border: "1px solid var(--border)",
              padding: "24px",
              textAlign: "center"
            }}
          >
            <metric.icon size={24} style={{ color: "var(--accent)", marginBottom: "12px" }} />
            <div style={{ fontSize: "36px", fontWeight: "bold", color: "var(--accent)" }}>
              {metric.value}
            </div>
            <div style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
              {metric.label}
            </div>
          </div>
        ))}
      </div>

      {/* Slider */}
      <div style={{ marginBottom: "64px" }}>
        <div style={{ 
          backgroundColor: "var(--surface)", 
          borderRadius: "20px", 
          border: "1px solid var(--border)",
          overflow: "hidden"
        }}>
          <div style={{ position: "relative", height: "450px" }}>
            {slides.map((slide, index) => (
              <div
                key={index}
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: activeSlide === index ? 1 : 0,
                  transition: "opacity 0.5s ease",
                }}
              >
                <div style={{
                  backgroundImage: `url(${slide.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  height: "100%",
                  display: "flex",
                  alignItems: "flex-end"
                }}>
                  <div style={{
                    background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 100%)",
                    width: "100%",
                    padding: "40px"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px" }}>
                      <div>
                        <div style={{ fontSize: "14px", color: "var(--accent)", marginBottom: "8px" }}>
                          Step {index + 1} of {slides.length}
                        </div>
                        <h3 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "8px" }}>
                          {slide.title}
                        </h3>
                        <p style={{ fontSize: "16px", color: "var(--text-secondary)", maxWidth: "500px" }}>
                          {slide.description}
                        </p>
                      </div>
                      <div style={{
                        backgroundColor: "var(--accent)",
                        padding: "16px 24px",
                        borderRadius: "12px",
                        textAlign: "center"
                      }}>
                        <div style={{ fontSize: "32px", fontWeight: "bold" }}>{slide.stat}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Navigation */}
            <button 
              onClick={prevSlide}
              style={{
                position: "absolute",
                left: "20px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                border: "1px solid var(--border)",
                backgroundColor: "rgba(0,0,0,0.5)",
                color: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(8px)"
              }}
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={nextSlide}
              style={{
                position: "absolute",
                right: "20px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                border: "none",
                backgroundColor: "var(--accent)",
                color: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <ChevronRight size={24} />
            </button>

            {/* Dots */}
            <div style={{ 
              position: "absolute", 
              bottom: "20px", 
              left: "50%", 
              transform: "translateX(-50%)",
              display: "flex",
              gap: "10px"
            }}>
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSlide(index)}
                  style={{
                    width: activeSlide === index ? "32px" : "10px",
                    height: "10px",
                    borderRadius: "5px",
                    backgroundColor: activeSlide === index ? "var(--accent)" : "rgba(255,255,255,0.4)",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.3s"
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{
        backgroundColor: "var(--surface)",
        borderRadius: "20px",
        border: "1px solid var(--border)",
        padding: "48px",
        textAlign: "center"
      }}>
        <h2 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "16px" }}>Ready to Go Viral?</h2>
        <p style={{ fontSize: "18px", color: "var(--text-secondary)", marginBottom: "32px", maxWidth: "500px", margin: "0 auto 32px" }}>
          Join thousands of creators who are building their audience with OpusClip
        </p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
          <Link href="/" style={{
            backgroundColor: "var(--accent)",
            color: "white",
            padding: "14px 32px",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: 600
          }}>
            Start Creating Free
          </Link>
          <Link href="/resources/learning-center" style={{
            backgroundColor: "transparent",
            color: "white",
            padding: "14px 32px",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            textDecoration: "none",
            fontWeight: 500
          }}>
            Learn the Strategy
          </Link>
        </div>
      </div>
    </div>
  );
}
