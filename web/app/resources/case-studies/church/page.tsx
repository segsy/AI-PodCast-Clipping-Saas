"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight, TrendingUp, Users, DollarSign, Play, Check, Quote, Zap, Cross, Heart } from "lucide-react";

export default function ChurchCaseStudy() {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    { 
      title: "Limited Reach", 
      description: "Church only reaching local community through Sunday services",
      image: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1200&h=600&fit=crop",
      stat: "Local Only"
    },
    { 
      title: "The Digital Opportunity", 
      description: "Discovered other churches were reaching millions online through short videos",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&h=600&fit=crop",
      stat: "New Possibility"
    },
    { 
      title: "Sermon to Shorts", 
      description: "Started clipping powerful sermon moments into shareable short videos",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=600&fit=crop",
      stat: "Content Machine"
    },
    { 
      title: "Going Viral", 
      description: "A sermon clip went viral - 5 million views, shared around the world",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&h=600&fit=crop",
      stat: "5M+ Views"
    },
    { 
      title: "Online Growth", 
      description: "Built digital congregation - online views translated to more donations",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop",
      stat: "35% Donations Up"
    },
    { 
      title: "Global Church", 
      description: "Now reaching people in 50+ countries - digital evangelism at scale",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=600&fit=crop",
      stat: "50+ Countries"
    },
  ];

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const metrics = [
    { value: "500%", label: "Online Reach", icon: TrendingUp },
    { value: "35%", label: "Donation Increase", icon: DollarSign },
    { value: "80%", label: "Service Views", icon: Users },
    { value: "50+", label: "Countries Reached", icon: Cross },
  ];

  const benefits = [
    "Turn sermons into viral short videos that spread the message",
    "Reach people beyond your local community - globally",
    "Grow donations through increased online engagement",
    "Build year-round connection with your congregation",
    "Automate content creation - no technical skills needed"
  ];

  const testimonials = [
    {
      quote: "We went from 500 weekly attendees to reaching 50,000 people online. Our message is now going places we never thought possible.",
      author: "Pastor Michael Ross",
      role: "Lead Pastor",
      company: "Grace Community Church"
    },
    {
      quote: "The viral sermon clip brought in donors from across the country. Our annual giving increased by 40%.",
      author: "Sarah Johnson",
      role: "Church Administrator",
      company: "New Life Fellowship"
    }
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--background)" }}>
      {/* Header */}
      <header style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: "rgba(15, 15, 35, 0.9)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)"
      }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
              <div style={{ width: "32px", height: "32px", backgroundColor: "var(--primary)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Zap size={18} style={{ color: "white" }} />
              </div>
              <span style={{ fontSize: "20px", fontWeight: "bold", color: "white" }}>AI Podcast</span>
            </Link>
            <nav style={{ display: "flex", gap: "24px", alignItems: "center" }}>
              <Link href="/solutions" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Solutions</Link>
              <Link href="/resources/customer-stories" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Customer Stories</Link>
              <Link href="/dashboard" style={{
                backgroundColor: "var(--primary)",
                color: "white",
                padding: "8px 16px",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: 500
              }}>
                Get Started
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main style={{ paddingTop: "96px", paddingBottom: "80px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>
          {/* Back Link */}
          <Link 
            href="/solutions" 
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
            Back to Solutions
          </Link>

          {/* Hero */}
          <div style={{ marginBottom: "48px" }}>
            <span style={{ 
              backgroundColor: "rgba(20, 184, 166, 0.2)", 
              color: "#14b8a6", 
              padding: "6px 14px", 
              borderRadius: "20px",
              fontSize: "13px",
              fontWeight: 600
            }}>
              Church
            </span>
            <h1 style={{ fontSize: "48px", fontWeight: "bold", marginTop: "16px", marginBottom: "16px" }}>
              Evangelize Digitally to Reach More People & Get More Donations
            </h1>
            <p style={{ fontSize: "20px", color: "var(--text-secondary)", maxWidth: "700px" }}>
              Transform your sermons into viral content that spreads your message globally.
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
              <div key={index} style={{ 
                backgroundColor: "var(--surface)", 
                borderRadius: "16px", 
                padding: "24px",
                border: "1px solid var(--border)",
                textAlign: "center"
              }}>
                <metric.icon size={32} style={{ color: "#14b8a6", marginBottom: "12px" }} />
                <div style={{ fontSize: "36px", fontWeight: "bold", marginBottom: "4px" }}>
                  {metric.value}
                </div>
                <div style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                  {metric.label}
                </div>
              </div>
            ))}
          </div>

          {/* Journey Carousel */}
          <div style={{ marginBottom: "64px" }}>
            <h2 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "32px", textAlign: "center" }}>
              From Local Church to Global Ministry
            </h2>
            
            <div style={{ 
              position: "relative", 
              backgroundColor: "var(--surface)", 
              borderRadius: "24px", 
              overflow: "hidden",
              border: "1px solid var(--border)"
            }}>
              <div style={{ 
                height: "400px", 
                backgroundImage: `url(${slides[activeSlide].image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative"
              }}>
                <div style={{ 
                  position: "absolute", 
                  inset: 0, 
                  background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)" 
                }} />
                <div style={{ 
                  position: "absolute", 
                  bottom: "32px", 
                  left: "32px", 
                  right: "32px" 
                }}>
                  <div style={{ 
                    backgroundColor: "#14b8a6", 
                    color: "white",
                    padding: "4px 12px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: 600,
                    display: "inline-block",
                    marginBottom: "12px"
                  }}>
                    {slides[activeSlide].stat}
                  </div>
                  <h3 style={{ fontSize: "28px", fontWeight: "bold", color: "white", marginBottom: "8px" }}>
                    {slides[activeSlide].title}
                  </h3>
                  <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.8)" }}>
                    {slides[activeSlide].description}
                  </p>
                </div>
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
                  borderRadius: "50%",
                  backgroundColor: "rgba(255,255,255,0.2)",
                  backdropFilter: "blur(8px)",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <ChevronLeft size={24} color="white" />
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
                  borderRadius: "50%",
                  backgroundColor: "rgba(255,255,255,0.2)",
                  backdropFilter: "blur(8px)",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <ChevronRight size={24} color="white" />
              </button>
              
              <div style={{ 
                display: "flex", 
                justifyContent: "center", 
                gap: "8px", 
                padding: "20px" 
              }}>
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveSlide(index)}
                    style={{
                      width: index === activeSlide ? "32px" : "8px",
                      height: "8px",
                      borderRadius: "4px",
                      backgroundColor: index === activeSlide ? "#14b8a6" : "var(--border)",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.3s"
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div style={{ 
            backgroundColor: "var(--surface)", 
            borderRadius: "24px", 
            padding: "48px",
            border: "1px solid var(--border)",
            marginBottom: "64px"
          }}>
            <h2 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "32px", textAlign: "center" }}>
              What Churches Get
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
              {benefits.map((benefit, index) => (
                <div key={index} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                  <div style={{ 
                    width: "24px", 
                    height: "24px", 
                    borderRadius: "50%", 
                    backgroundColor: "rgba(20, 184, 166, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}>
                    <Check size={14} style={{ color: "#14b8a6" }} />
                  </div>
                  <span style={{ fontSize: "16px", color: "var(--text-secondary)" }}>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials */}
          <div style={{ marginBottom: "64px" }}>
            <h2 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "32px", textAlign: "center" }}>
              What Churches Are Saying
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
              {testimonials.map((testimonial, index) => (
                <div key={index} style={{ 
                  backgroundColor: "var(--surface)", 
                  borderRadius: "16px", 
                  padding: "32px",
                  border: "1px solid var(--border)"
                }}>
                  <Quote size={32} style={{ color: "#14b8a6", marginBottom: "16px" }} />
                  <p style={{ fontSize: "18px", marginBottom: "24px", lineHeight: 1.6, fontStyle: "italic" }}>
                    "{testimonial.quote}"
                  </p>
                  <div>
                    <div style={{ fontSize: "16px", fontWeight: "600", marginBottom: "4px" }}>
                      {testimonial.author}
                    </div>
                    <div style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{ 
            background: "linear-gradient(135deg, rgba(20, 184, 166, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)",
            borderRadius: "24px",
            padding: "64px",
            textAlign: "center",
            border: "1px solid var(--border)"
          }}>
            <h2 style={{ fontSize: "40px", fontWeight: "bold", marginBottom: "16px" }}>
              Share Your Message Globally
            </h2>
            <p style={{ fontSize: "18px", color: "var(--text-secondary)", marginBottom: "32px", maxWidth: "600px", margin: "0 auto 32px" }}>
              Join 5,000+ churches spreading their message to the world.
            </p>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/dashboard" style={{
                backgroundColor: "#14b8a6",
                color: "white",
                padding: "16px 32px",
                borderRadius: "12px",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "16px"
              }}>
                Start Free Trial
              </Link>
              <Link href="/solutions" style={{
                backgroundColor: "transparent",
                color: "white",
                padding: "16px 32px",
                borderRadius: "12px",
                border: "1px solid var(--border)",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "16px"
              }}>
                View All Solutions
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
