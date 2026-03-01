"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight, TrendingUp, Users, DollarSign, Play, Check, Quote, Zap, ShoppingCart, Clock } from "lucide-react";

export default function EcommerceCaseStudy() {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    { 
      title: "The Visibility Problem", 
      description: "Great products but no one seeing them - relying on paid ads alone",
      image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&h=600&fit=crop",
      stat: "Ad Dependent"
    },
    { 
      title: "The Video Opportunity", 
      description: "Discovered short-form video was driving massive organic traffic for competitors",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop",
      stat: "New Channel"
    },
    { 
      title: "Product to Video", 
      description: "Started creating short videos showcasing products in action",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop",
      stat: "Video First"
    },
    { 
      title: "Going Viral", 
      description: "Product showcase went viral - 10M views driving massive traffic",
      image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&h=600&fit=crop",
      stat: "10M+ Views"
    },
    { 
      title: "Sales Explosion", 
      description: "150% increase in sales - viral videos drove unstoppable traffic",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop",
      stat: "+150% Sales"
    },
    { 
      title: "Brand Dominance", 
      description: "Now a category leader - 300% brand awareness in target market",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop",
      stat: "300% Awareness"
    },
  ];

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const metrics = [
    { value: "150%", label: "More Sales", icon: TrendingUp },
    { value: "300%", label: "Brand Awareness", icon: Users },
    { value: "5x", label: "More Traffic", icon: ShoppingCart },
    { value: "80%", label: "Less Ad Spend", icon: DollarSign },
  ];

  const benefits = [
    "Showcase products in action - not just static images",
    "Go viral organically - reduce dependence on paid ads",
    "Create authentic content that builds trust",
    "Reach new audiences on TikTok, Instagram, YouTube",
    "Turn viewers into buyers with compelling video demos"
  ];

  const testimonials = [
    {
      quote: "Our viral product video generated $200K in sales in one week. That's more than 6 months of paid advertising.",
      author: "Chris Martinez",
      role: "Founder",
      company: "FitGear Direct"
    },
    {
      quote: "We cut ad spend by 80% while doubling revenue. Organic video is now our #1 traffic source.",
      author: "Emily Chen",
      role: "Marketing Director",
      company: "BeautyBliss"
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
              backgroundColor: "rgba(168, 85, 247, 0.2)", 
              color: "#a855f7", 
              padding: "6px 14px", 
              borderRadius: "20px",
              fontSize: "13px",
              fontWeight: 600
            }}>
              E-commerce
            </span>
            <h1 style={{ fontSize: "48px", fontWeight: "bold", marginTop: "16px", marginBottom: "16px" }}>
              Sell More Products & Increase Exposure with Viral Shorts
            </h1>
            <p style={{ fontSize: "20px", color: "var(--text-secondary)", maxWidth: "700px" }}>
              Turn your products into viral content that drives sales and builds brand awareness.
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
                <metric.icon size={32} style={{ color: "#a855f7", marginBottom: "12px" }} />
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
              From Unknown Brand to Category Leader
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
                    backgroundColor: "#a855f7", 
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
                      backgroundColor: index === activeSlide ? "#a855f7" : "var(--border)",
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
              What E-commerce Brands Get
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
              {benefits.map((benefit, index) => (
                <div key={index} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                  <div style={{ 
                    width: "24px", 
                    height: "24px", 
                    borderRadius: "50%", 
                    backgroundColor: "rgba(168, 85, 247, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}>
                    <Check size={14} style={{ color: "#a855f7" }} />
                  </div>
                  <span style={{ fontSize: "16px", color: "var(--text-secondary)" }}>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials */}
          <div style={{ marginBottom: "64px" }}>
            <h2 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "32px", textAlign: "center" }}>
              What E-commerce Brands Are Saying
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
              {testimonials.map((testimonial, index) => (
                <div key={index} style={{ 
                  backgroundColor: "var(--surface)", 
                  borderRadius: "16px", 
                  padding: "32px",
                  border: "1px solid var(--border)"
                }}>
                  <Quote size={32} style={{ color: "#a855f7", marginBottom: "16px" }} />
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
            background: "linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)",
            borderRadius: "24px",
            padding: "64px",
            textAlign: "center",
            border: "1px solid var(--border)"
          }}>
            <h2 style={{ fontSize: "40px", fontWeight: "bold", marginBottom: "16px" }}>
              Go Viral, Increase Sales
            </h2>
            <p style={{ fontSize: "18px", color: "var(--text-secondary)", marginBottom: "32px", maxWidth: "600px", margin: "0 auto 32px" }}>
              Join 10,000+ e-commerce brands driving sales through viral video content.
            </p>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/dashboard" style={{
                backgroundColor: "#a855f7",
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
