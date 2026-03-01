"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight, TrendingUp, Users, DollarSign, Calendar, Check, Quote } from "lucide-react";

export default function MarketingAgenciesCaseStudy() {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    { 
      title: "The Challenge", 
      description: "Manual video editing was consuming 4+ hours per video, limiting their ability to scale",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=600&fit=crop",
      stat: "4+ hrs"
    },
    { 
      title: "The Solution", 
      description: "Implemented OpusClip's AI-powered clipping to automate the entire process",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop",
      stat: "85% Faster"
    },
    { 
      title: "The Results", 
      description: "150% increase in revenue with 3x more client content produced weekly",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop",
      stat: "150%"
    },
    { 
      title: "Team Growth", 
      description: "Scaled from 5 to 25 client accounts without adding editors",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=600&fit=crop",
      stat: "5x Clients"
    },
    { 
      title: "Cost Savings", 
      description: "Saved $2,700 monthly on freelance editing costs",
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&h=600&fit=crop",
      stat: "$2,700/mo"
    },
  ];

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const metrics = [
    { value: "150%", label: "Revenue Increase", icon: TrendingUp },
    { value: "3x", label: "Content Output", icon: Users },
    { value: "$2,700", label: "Monthly Savings", icon: DollarSign },
    { value: "85%", label: "Time Reduced", icon: Calendar },
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
          Agency Success Story
        </span>
        <h1 style={{ fontSize: "48px", fontWeight: "bold", marginTop: "16px", marginBottom: "16px" }}>
          How OpusClip helps marketing agencies boost revenue by 150%
        </h1>
        <p style={{ fontSize: "20px", color: "var(--text-secondary)", maxWidth: "700px" }}>
          Discover how DigitalFlow Agency transformed their video production workflow and dramatically increased their revenue
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
            <metric.icon size={24} style={{ color: "var(--primary)", marginBottom: "12px" }} />
            <div style={{ fontSize: "36px", fontWeight: "bold", color: "var(--primary)" }}>
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
                        <div style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "8px" }}>
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
                        backgroundColor: "var(--primary)",
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
                backgroundColor: "var(--primary)",
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
                    backgroundColor: activeSlide === index ? "var(--primary)" : "rgba(255,255,255,0.4)",
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

      {/* Challenge & Solution */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", marginBottom: "64px" }}>
        <div style={{
          backgroundColor: "var(--surface)",
          borderRadius: "16px",
          border: "1px solid var(--border)",
          padding: "32px"
        }}>
          <h3 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px", color: "var(--error)" }}>The Challenge</h3>
          <p style={{ fontSize: "16px", color: "var(--text-secondary)", lineHeight: 1.7 }}>
            DigitalFlow Agency was struggling with manual video editing that consumed 4+ hours per video. This limited their ability to take on more clients and generated significant costs through freelance editors. They needed a solution that could scale without compromising quality.
          </p>
        </div>
        <div style={{
          backgroundColor: "var(--surface)",
          borderRadius: "16px",
          border: "1px solid var(--border)",
          padding: "32px"
        }}>
          <h3 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px", color: "var(--success)" }}>The Solution</h3>
          <p style={{ fontSize: "16px", color: "var(--text-secondary)", lineHeight: 1.7 }}>
            By implementing OpusClip, they automated the entire video clipping process. The AI now identifies the most engaging moments, generates captions, and creates multiple aspect ratios automatically - all in under 5 minutes per video.
          </p>
        </div>
      </div>

      {/* Testimonial */}
      <div style={{
        background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)",
        borderRadius: "20px",
        border: "1px solid var(--border)",
        padding: "48px",
        marginBottom: "48px",
        textAlign: "center"
      }}>
        <Quote size={48} style={{ color: "var(--primary)", marginBottom: "24px" }} />
        <p style={{ fontSize: "24px", fontWeight: 500, lineHeight: 1.6, maxWidth: "800px", margin: "0 auto 32px" }}>
          "OpusClip transformed our content workflow. We've tripled our output while cutting editing costs by 70%. It's not just a tool - it's a competitive advantage that helped us grow from a small agency to handling 25+ client accounts."
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px" }}>
          <div style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            backgroundColor: "var(--primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: "20px"
          }}>
            SC
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontWeight: 600 }}>Sarah Chen</div>
            <div style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Marketing Director, DigitalFlow Agency</div>
          </div>
        </div>
      </div>

      {/* Key Takeaways */}
      <div style={{ marginBottom: "48px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "24px" }}>Key Takeaways</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
          {[
            "AI-powered clipping reduces editing time by 85%",
            "Automated caption generation improves engagement",
            "Multi-platform export saves significant manual work",
            "Brand templates ensure consistent client deliverables",
            "Team collaboration features enable workflow scaling",
            "Cost savings can reach $2,700+ monthly per agency"
          ].map((item, index) => (
            <div key={index} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}>
                <Check size={14} style={{ color: "var(--success)" }} />
              </div>
              <span>{item}</span>
            </div>
          ))}
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
        <h2 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "16px" }}>Ready to Transform Your Agency?</h2>
        <p style={{ fontSize: "18px", color: "var(--text-secondary)", marginBottom: "32px", maxWidth: "500px", margin: "0 auto 32px" }}>
          Join hundreds of agencies already scaling their video production with OpusClip
        </p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
          <Link href="/" style={{
            backgroundColor: "var(--primary)",
            color: "white",
            padding: "14px 32px",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: 600
          }}>
            Start Free Trial
          </Link>
          <Link href="/resources/demo" style={{
            backgroundColor: "transparent",
            color: "white",
            padding: "14px 32px",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            textDecoration: "none",
            fontWeight: 500
          }}>
            Schedule Demo
          </Link>
        </div>
      </div>
    </div>
  );
}
