"use client";

import Link from "next/link";
import { ArrowLeft, Play, Zap, TrendingUp, Clock, Users, Star, Check, ChevronRight, Calendar, Globe, Smartphone, MessageSquare, Sparkles, Send } from "lucide-react";

export default function SocialSchedulerPage() {
  const stats = [
    { value: "30", label: "Days of Posts", icon: Calendar },
    { value: "10+", label: "Platforms", icon: Globe },
    { value: "10min", label: "Setup Time", icon: Clock },
    { value: "80%", label: "Time Saved", icon: Zap },
  ];

  const features = [
    {
      title: "Bulk Scheduling",
      description: "Schedule up to 30 days of content in one sitting. Plan your entire month in 10 minutes.",
      icon: Calendar,
    },
    {
      title: "Multi-Platform Support",
      description: "Post to TikTok, Instagram, YouTube, LinkedIn, Twitter, Facebook and more from one dashboard.",
      icon: Globe,
    },
    {
      title: "Smart Timing",
      description: "AI analyzes your audience and automatically schedules posts at the optimal times.",
      icon: Clock,
    },
    {
      title: "Calendar View",
      description: "Visual calendar shows your entire content schedule at a glance. Easy drag-and-drop editing.",
      icon: Calendar,
    },
  ];

  const platforms = [
    { name: "TikTok", icon: Smartphone, connected: true },
    { name: "Instagram", icon: Globe, connected: true },
    { name: "YouTube", icon: Play, connected: true },
    { name: "LinkedIn", icon: Globe, connected: true },
    { name: "Twitter", icon: MessageSquare, connected: true },
    { name: "Facebook", icon: Globe, connected: true },
  ];

  const testimonials = [
    {
      name: "Rachel Kim",
      role: "Social Media Manager",
      handle: "@rachelk",
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop",
      content: "I used to spend hours every week scheduling posts. Now I do it all in 10 minutes once a month.",
      stats: "10 hrs saved/week",
    },
    {
      name: "Mark Johnson",
      role: "Business Owner",
      handle: "@markjohnson",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      content: "Our social media presence is now consistent. Sales have increased 40% since we started scheduling.",
      stats: "40% more sales",
    },
    {
      name: "Sarah Williams",
      role: "Influencer",
      handle: "@sarahwilliams",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
      content: "Consistency is key to growing followers. The scheduler helps me stay on track even when I'm busy.",
      stats: "100K+ followers",
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
          backgroundColor: "rgba(251, 191, 36, 0.1)", 
          padding: "8px 16px", 
          borderRadius: "24px",
          marginBottom: "24px"
        }}>
          <Calendar size={16} style={{ color: "#fbbf24" }} />
          <span style={{ color: "#fbbf24", fontSize: "14px", fontWeight: 600 }}>Social Scheduling</span>
        </div>
        
        <h1 style={{ 
          fontSize: "56px", 
          fontWeight: "bold", 
          marginBottom: "24px",
          lineHeight: 1.1
        }}>
          Schedule a month's posts<br />
          <span style={{ color: "#fbbf24" }}>to all platforms in 10 minutes</span>
        </h1>
        
        <p style={{ 
          fontSize: "20px", 
          color: "var(--text-secondary)", 
          maxWidth: "600px",
          marginBottom: "40px"
        }}>
          Plan your entire month of social media content in one sitting. Automate your posting and never miss a day.
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
            Start Scheduling Free
            <ChevronRight size={20} />
          </Link>
          <Link 
            href="/resources/case-studies/social-scheduler"
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
              <stat.icon size={24} style={{ color: "#fbbf24", marginBottom: "8px" }} />
              <div style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "4px" }}>{stat.value}</div>
              <div style={{ fontSize: "14px", color: "var(--text-secondary)" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Platforms */}
      <div style={{ marginBottom: "80px" }}>
        <h2 style={{ fontSize: "40px", fontWeight: "bold", marginBottom: "16px", textAlign: "center" }}>
          Connect All Your Platforms
        </h2>
        <p style={{ fontSize: "18px", color: "var(--text-secondary)", marginBottom: "48px", textAlign: "center" }}>
          Manage all your social media from one place
        </p>
        
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(3, 1fr)", 
          gap: "20px"
        }}>
          {platforms.map((platform, index) => (
            <div 
              key={index}
              style={{
                padding: "24px",
                backgroundColor: "var(--surface)",
                borderRadius: "16px",
                border: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <platform.icon size={24} style={{ color: "#fbbf24" }} />
                <span style={{ fontWeight: "600" }}>{platform.name}</span>
              </div>
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "6px",
                color: platform.connected ? "#22c55e" : "var(--text-secondary)",
                fontSize: "13px"
              }}>
                {platform.connected && <Check size={14} />}
                {platform.connected ? "Connected" : "Connect"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div style={{ marginBottom: "80px" }}>
        <h2 style={{ fontSize: "40px", fontWeight: "bold", marginBottom: "16px", textAlign: "center" }}>
          Powerful scheduling features
        </h2>
        <p style={{ fontSize: "18px", color: "var(--text-secondary)", marginBottom: "48px", textAlign: "center" }}>
          Everything you need to automate your social media
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
                backgroundColor: "rgba(251, 191, 36, 0.1)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px"
              }}>
                <feature.icon size={24} style={{ color: "#fbbf24" }} />
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
          Loved by marketers
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
                backgroundColor: "rgba(251, 191, 36, 0.1)",
                padding: "6px 12px",
                borderRadius: "20px",
                fontSize: "13px",
                color: "#fbbf24",
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
          Plan your month in 10 minutes
        </h2>
        <p style={{ fontSize: "18px", color: "var(--text-secondary)", marginBottom: "32px", maxWidth: "500px", margin: "0 auto 32px" }}>
          Automate your posting and never miss a day.
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
            Start Scheduling
            <ChevronRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}
