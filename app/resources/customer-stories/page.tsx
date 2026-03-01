"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, TrendingUp, Users, DollarSign, Play, Quote } from "lucide-react";

export default function CustomerStoriesPage() {
  const [activeSlide, setActiveSlide] = useState<[number, number]>([0, 0]);

  const marketingAgencySlides = [
    { title: "Before OpusClip", description: "Manual editing took 4+ hours per video", image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop" },
    { title: "After OpusClip", description: "Automated clipping in under 5 minutes", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop" },
    { title: "150% Revenue Boost", description: "Clients increased ad spend by 150%", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop" },
    { title: "Team Productivity", description: "3x more content produced weekly", image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop" },
  ];

  const creatorsSlides = [
    { title: "Starting Point", description: "Struggling to gain traction on social", image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=400&fit=crop" },
    { title: "Video Clipping Strategy", description: "Turned long videos into viral shorts", image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=800&h=400&fit=crop" },
    { title: "10M+ Views Milestone", description: "Reached 10 million views in 1 month", image: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=800&h=400&fit=crop" },
    { title: "Monetization Success", description: "Multiple income streams activated", image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&h=400&fit=crop" },
  ];

  const nextSlide = (section: number) => {
    setActiveSlide((prev) => {
      const newSlides: [number, number] = [...prev];
      const maxSlides = section === 0 ? marketingAgencySlides.length : creatorsSlides.length;
      newSlides[section] = (newSlides[section] + 1) % maxSlides;
      return newSlides;
    });
  };

  const prevSlide = (section: number) => {
    setActiveSlide((prev) => {
      const newSlides: [number, number] = [...prev];
      const maxSlides = section === 0 ? marketingAgencySlides.length : creatorsSlides.length;
      newSlides[section] = (newSlides[section] - 1 + maxSlides) % maxSlides;
      return newSlides;
    });
  };

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Marketing Director",
      company: "DigitalFlow Agency",
      quote: "OpusClip transformed our content workflow. We've tripled our output while cutting editing costs by 70%.",
      metric: "150% Revenue Increase",
    },
    {
      name: "Marcus Johnson",
      role: "Content Creator",
      company: "TechTube",
      quote: "I went from 1K to 500K followers in 6 months. The auto-clipping feature is a game-changer.",
      metric: "10M+ Monthly Views",
    },
    {
      name: "Emily Rodriguez",
      role: "Podcast Host",
      company: "Business Insights Show",
      quote: "Every episode now reaches 10x more audience through short-form content. Absolutely incredible ROI.",
      metric: "300% More Engagement",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <div style={{ marginBottom: "48px" }}>
        <h1 style={{ fontSize: "48px", fontWeight: "bold", marginBottom: "16px", background: "linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Customer Success Stories
        </h1>
        <p style={{ fontSize: "20px", color: "var(--text-secondary)", maxWidth: "600px" }}>
          See how thousands of creators, agencies, and businesses are transforming their content with OpusClip
        </p>
      </div>

      {/* Featured Case Studies */}
      <div style={{ marginBottom: "64px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "24px" }}>Featured Case Studies</h2>
        
        {/* Marketing Agency Case Study */}
        <div style={{ 
          backgroundColor: "var(--surface)", 
          borderRadius: "16px", 
          border: "1px solid var(--border)",
          overflow: "hidden",
          marginBottom: "32px"
        }}>
          <div style={{ padding: "32px" }}>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              marginBottom: "24px"
            }}>
              <div>
                <span style={{ 
                  backgroundColor: "rgba(139, 92, 246, 0.2)", 
                  color: "var(--primary)", 
                  padding: "4px 12px", 
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: 600
                }}>
                  Agency Success Story
                </span>
                <h3 style={{ fontSize: "24px", fontWeight: "bold", marginTop: "12px" }}>
                  How OpusClip helps marketing agencies boost revenue by 150%
                </h3>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button 
                  onClick={() => prevSlide(0)}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--background)",
                    color: "white",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={() => nextSlide(0)}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--primary)",
                    color: "white",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
            
            {/* Slider */}
            <div style={{ position: "relative", height: "300px", borderRadius: "12px", overflow: "hidden" }}>
              {marketingAgencySlides.map((slide, index) => (
                <div
                  key={index}
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity: activeSlide[0] === index ? 1 : 0,
                    transition: "opacity 0.5s ease",
                  }}
                >
                  <div style={{
                    backgroundImage: `url(${slide.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: "100%",
                    display: "flex",
                    alignItems: "flex-end",
                    padding: "24px"
                  }}>
                    <div style={{
                      backgroundColor: "rgba(0,0,0,0.7)",
                      backdropFilter: "blur(8px)",
                      padding: "16px 24px",
                      borderRadius: "12px"
                    }}>
                      <h4 style={{ fontSize: "18px", fontWeight: "bold", color: "white" }}>{slide.title}</h4>
                      <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>{slide.description}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Dots */}
              <div style={{ 
                position: "absolute", 
                bottom: "16px", 
                left: "50%", 
                transform: "translateX(-50%)",
                display: "flex",
                gap: "8px"
              }}>
                {marketingAgencySlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveSlide((prev) => { const newSlides: [number, number] = [...prev]; newSlides[0] = index; return newSlides; })}
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: activeSlide[0] === index ? "var(--primary)" : "rgba(255,255,255,0.3)",
                      border: "none",
                      cursor: "pointer",
                      transition: "background-color 0.3s"
                    }}
                  />
                ))}
              </div>
            </div>
            
            <div style={{ marginTop: "24px", display: "flex", gap: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <TrendingUp size={20} style={{ color: "var(--success)" }} />
                <span style={{ fontWeight: 600 }}>150% Revenue Increase</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Users size={20} style={{ color: "var(--accent)" }} />
                <span style={{ fontWeight: 600 }}>50+ Client Accounts</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <DollarSign size={20} style={{ color: "var(--warning)" }} />
                <span style={{ fontWeight: 600 }}>$2,700 Monthly Savings</span>
              </div>
            </div>
            
            <Link href="/resources/case-studies/marketing-agencies" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "24px",
              color: "var(--primary)",
              textDecoration: "none",
              fontWeight: 500
            }}>
              Read full case study
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Creators Case Study */}
        <div style={{ 
          backgroundColor: "var(--surface)", 
          borderRadius: "16px", 
          border: "1px solid var(--border)",
          overflow: "hidden"
        }}>
          <div style={{ padding: "32px" }}>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              marginBottom: "24px"
            }}>
              <div>
                <span style={{ 
                  backgroundColor: "rgba(6, 182, 212, 0.2)", 
                  color: "var(--accent)", 
                  padding: "4px 12px", 
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: 600
                }}>
                  Creator Success Story
                </span>
                <h3 style={{ fontSize: "24px", fontWeight: "bold", marginTop: "12px" }}>
                  How creators are earning 10M+ views in 1 month using video clipping
                </h3>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button 
                  onClick={() => prevSlide(1)}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--background)",
                    color: "white",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={() => nextSlide(1)}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--accent)",
                    color: "white",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
            
            {/* Slider */}
            <div style={{ position: "relative", height: "300px", borderRadius: "12px", overflow: "hidden" }}>
              {creatorsSlides.map((slide, index) => (
                <div
                  key={index}
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity: activeSlide[1] === index ? 1 : 0,
                    transition: "opacity 0.5s ease",
                  }}
                >
                  <div style={{
                    backgroundImage: `url(${slide.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: "100%",
                    display: "flex",
                    alignItems: "flex-end",
                    padding: "24px"
                  }}>
                    <div style={{
                      backgroundColor: "rgba(0,0,0,0.7)",
                      backdropFilter: "blur(8px)",
                      padding: "16px 24px",
                      borderRadius: "12px"
                    }}>
                      <h4 style={{ fontSize: "18px", fontWeight: "bold", color: "white" }}>{slide.title}</h4>
                      <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>{slide.description}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Dots */}
              <div style={{ 
                position: "absolute", 
                bottom: "16px", 
                left: "50%", 
                transform: "translateX(-50%)",
                display: "flex",
                gap: "8px"
              }}>
                {creatorsSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveSlide((prev) => { const newSlides: [number, number] = [...prev]; newSlides[1] = index; return newSlides; })}
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: activeSlide[1] === index ? "var(--accent)" : "rgba(255,255,255,0.3)",
                      border: "none",
                      cursor: "pointer",
                      transition: "background-color 0.3s"
                    }}
                  />
                ))}
              </div>
            </div>
            
            <div style={{ marginTop: "24px", display: "flex", gap: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <TrendingUp size={20} style={{ color: "var(--success)" }} />
                <span style={{ fontWeight: 600 }}>10M+ Monthly Views</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Users size={20} style={{ color: "var(--accent)" }} />
                <span style={{ fontWeight: 600 }}>500K+ Followers</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <DollarSign size={20} style={{ color: "var(--warning)" }} />
                <span style={{ fontWeight: 600 }}>5 Income Streams</span>
              </div>
            </div>
            
            <Link href="/resources/case-studies/creators-views" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "24px",
              color: "var(--accent)",
              textDecoration: "none",
              fontWeight: 500
            }}>
              Read full case study
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div style={{ marginBottom: "64px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "24px" }}>What Our Customers Say</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "var(--surface)",
                borderRadius: "16px",
                border: "1px solid var(--border)",
                padding: "24px"
              }}
            >
              <Quote size={32} style={{ color: "var(--primary)", marginBottom: "16px" }} />
              <p style={{ fontSize: "16px", color: "var(--text-secondary)", marginBottom: "24px", lineHeight: 1.6 }}>
                "{testimonial.quote}"
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  backgroundColor: "var(--primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: "18px"
                }}>
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>{testimonial.name}</div>
                  <div style={{ fontSize: "14px", color: "var(--text-muted)" }}>{testimonial.role}, {testimonial.company}</div>
                </div>
              </div>
              <div style={{ 
                marginTop: "16px", 
                padding: "12px", 
                backgroundColor: "rgba(16, 185, 129, 0.1)", 
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <TrendingUp size={16} style={{ color: "var(--success)" }} />
                <span style={{ fontWeight: 600, color: "var(--success)" }}>{testimonial.metric}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{
        background: "linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)",
        borderRadius: "16px",
        border: "1px solid var(--border)",
        padding: "48px",
        textAlign: "center"
      }}>
        <h2 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "16px" }}>Ready to Write Your Success Story?</h2>
        <p style={{ fontSize: "18px", color: "var(--text-secondary)", marginBottom: "32px", maxWidth: "500px", margin: "0 auto 32px" }}>
          Join thousands of creators and agencies who are already transforming their content with OpusClip
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
          <button style={{
            backgroundColor: "transparent",
            color: "white",
            padding: "14px 32px",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            cursor: "pointer",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <Play size={18} />
            Watch Demo
          </button>
        </div>
      </div>
    </div>
  );
}
