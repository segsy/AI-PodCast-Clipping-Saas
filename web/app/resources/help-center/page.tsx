"use client";

import { Search, MessageCircle, Mail, Book, Video, MessageSquare, ChevronRight, ExternalLink } from "lucide-react";
import { useState } from "react";

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    {
      id: "getting-started",
      title: "Getting Started",
      description: "Learn the basics of OpusClip",
      icon: Book,
      articles: 12,
      color: "var(--primary)"
    },
    {
      id: "account",
      title: "Account & Billing",
      description: "Manage your account and subscriptions",
      icon: MessageCircle,
      articles: 8,
      color: "var(--accent)"
    },
    {
      id: "video-editing",
      title: "Video Editing",
      description: "Create and edit amazing videos",
      icon: Video,
      articles: 15,
      color: "var(--success)"
    },
    {
      id: "technical",
      title: "Technical Issues",
      description: "Troubleshoot common problems",
      icon: MessageSquare,
      articles: 10,
      color: "var(--warning)"
    },
  ];

  const faqs = [
    {
      question: "How do I get started with OpusClip?",
      answer: "Simply sign up for a free account, upload your video, and let our AI automatically identify the most engaging moments. You can then customize, edit, and export your clips."
    },
    {
      question: "What video formats are supported?",
      answer: "We support MP4, MOV, AVI, MKV, and WebM formats. The maximum file size depends on your plan - up to 10GB for Pro plans."
    },
    {
      question: "Can I use OpusClip for commercial purposes?",
      answer: "Yes! All plans include commercial rights. You own 100% of the content you create with OpusClip."
    },
    {
      question: "How does the AI clipping work?",
      answer: "Our AI analyzes your video for engaging moments based on factors like speech patterns, visual interest, emotional peaks, and viral potential scores."
    },
    {
      question: "Can I edit the AI-generated clips?",
      answer: "Absolutely! You have full control to edit captions, trim clips, add B-roll, change aspect ratios, and apply your branding."
    },
    {
      question: "How do I cancel my subscription?",
      answer: "You can cancel anytime from your account settings. Your access will continue until the end of your billing period."
    },
  ];

  const popularArticles = [
    { title: "Quick Start Guide", views: "12.5K" },
    { title: "How to use ClipAnything", views: "10.2K" },
    { title: "Exporting your videos", views: "8.9K" },
    { title: "Adding custom captions", views: "7.6K" },
    { title: "Scheduling social posts", views: "6.3K" },
  ];

  return (
    <div>
      {/* Hero Section */}
      <div style={{ marginBottom: "48px", textAlign: "center", maxWidth: "700px", margin: "0 auto 48px" }}>
        <h1 style={{ fontSize: "48px", fontWeight: "bold", marginBottom: "16px", background: "linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          How can we help?
        </h1>
        <p style={{ fontSize: "20px", color: "var(--text-secondary)" }}>
          Search our knowledge base or browse topics below
        </p>
        
        {/* Search Bar */}
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "12px",
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          padding: "16px 20px",
          marginTop: "32px",
          maxWidth: "560px",
          margin: "32px auto 0"
        }}>
          <Search size={20} style={{ color: "var(--text-muted)" }} />
          <input 
            type="text" 
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              backgroundColor: "transparent", 
              border: "none", 
              outline: "none",
              color: "white",
              fontSize: "16px",
              width: "100%"
            }}
          />
        </div>
      </div>

      {/* Categories */}
      <div style={{ marginBottom: "48px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "24px" }}>Browse by Topic</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
          {categories.map((category) => (
            <div
              key={category.id}
              style={{
                backgroundColor: "var(--surface)",
                borderRadius: "16px",
                border: "1px solid var(--border)",
                padding: "24px",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: `${category.color}20`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px"
              }}>
                <category.icon size={24} style={{ color: category.color }} />
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>
                {category.title}
              </h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "12px" }}>
                {category.description}
              </p>
              <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                {category.articles} articles
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
        {/* Popular Articles */}
        <div>
          <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "24px" }}>Popular Articles</h2>
          <div style={{
            backgroundColor: "var(--surface)",
            borderRadius: "16px",
            border: "1px solid var(--border)",
            overflow: "hidden"
          }}>
            {popularArticles.map((article, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 20px",
                  borderBottom: index < popularArticles.length - 1 ? "1px solid var(--border)" : "none",
                  cursor: "pointer",
                  transition: "background-color 0.2s"
                }}
              >
                <span style={{ fontSize: "15px" }}>{article.title}</span>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>{article.views} views</span>
                  <ChevronRight size={16} style={{ color: "var(--text-muted)" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div>
          <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "24px" }}>Frequently Asked Questions</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {faqs.map((faq, index) => (
              <details
                key={index}
                style={{
                  backgroundColor: "var(--surface)",
                  borderRadius: "12px",
                  border: "1px solid var(--border)",
                  overflow: "hidden"
                }}
              >
                <summary style={{
                  padding: "20px",
                  cursor: "pointer",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}>
                  {faq.question}
                  <ChevronRight size={18} style={{ color: "var(--text-muted)" }} />
                </summary>
                <div style={{
                  padding: "0 20px 20px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.6
                }}>
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Support */}
      <div style={{
        marginTop: "48px",
        background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)",
        borderRadius: "16px",
        border: "1px solid var(--border)",
        padding: "48px",
        textAlign: "center"
      }}>
        <h2 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "12px" }}>Still need help?</h2>
        <p style={{ fontSize: "16px", color: "var(--text-secondary)", marginBottom: "32px", maxWidth: "500px", margin: "0 auto 32px" }}>
          Our support team is available 24/7 to assist you
        </p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <button style={{
            backgroundColor: "var(--primary)",
            color: "white",
            padding: "14px 32px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <MessageCircle size={18} />
            Start Live Chat
          </button>
          <button style={{
            backgroundColor: "var(--surface)",
            color: "white",
            padding: "14px 32px",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <Mail size={18} />
            Email Support
          </button>
        </div>
      </div>
    </div>
  );
}
