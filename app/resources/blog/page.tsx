"use client";

import { Calendar, User, ArrowRight, Search, Tag } from "lucide-react";
import { useState } from "react";

export default function BlogPage() {
  const [selectedTag, setSelectedTag] = useState("all");

  const tags = [
    { id: "all", name: "All Posts" },
    { id: "strategy", name: "Strategy" },
    { id: "tutorials", name: "Tutorials" },
    { id: "trends", name: "Trends" },
    { id: "case-studies", name: "Case Studies" },
    { id: "tips", name: "Tips & Tricks" },
  ];

  const featuredPost = {
    id: 1,
    title: "The Ultimate Guide to Video Clipping in 2026",
    excerpt: "Learn how to turn long-form content into viral short-form videos that drive engagement and growth across all platforms.",
    author: "Sarah Johnson",
    date: "February 18, 2026",
    readTime: "12 min read",
    tags: ["Strategy", "Tutorials"],
    image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&h=400&fit=crop",
  };

  const posts = [
    {
      id: 2,
      title: "How to 10x Your Content Output Without Burning Out",
      excerpt: "Discover the workflow automation strategies that top creators use to produce more content in less time.",
      author: "Marcus Chen",
      date: "February 15, 2026",
      readTime: "8 min read",
      tags: ["Strategy", "Tips"],
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
    },
    {
      id: 3,
      title: "Understanding the Algorithm: What Works on Each Platform in 2026",
      excerpt: "A deep dive into how TikTok, Instagram Reels, and YouTube Shorts algorithms work and how to optimize for each.",
      author: "Emily Rodriguez",
      date: "February 12, 2026",
      readTime: "15 min read",
      tags: ["Trends", "Strategy"],
      image: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=400&h=250&fit=crop",
    },
    {
      id: 4,
      title: "From 0 to 100K Subscribers: A Creator's Journey",
      excerpt: "An interview with a growing creator who used video clipping to build a massive following in just 6 months.",
      author: "David Park",
      date: "February 8, 2026",
      readTime: "10 min read",
      tags: ["Case Studies"],
      image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&h=250&fit=crop",
    },
    {
      id: 5,
      title: "5 Caption Styles That Go Viral Every Time",
      excerpt: "Learn the caption formulas that top creators use to grab attention in the first 3 seconds.",
      author: "Lisa Thompson",
      date: "February 5, 2026",
      readTime: "6 min read",
      tags: ["Tutorials", "Tips"],
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=250&fit=crop",
    },
    {
      id: 6,
      title: "The Future of Short-Form Video: Trends to Watch",
      excerpt: "What's coming next in short-form video content? Here are the trends that will shape 2026.",
      author: "Alex Kim",
      date: "January 28, 2026",
      readTime: "7 min read",
      tags: ["Trends"],
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=250&fit=crop",
    },
    {
      id: 7,
      title: "Monetizing Your Short-Form Content: A Complete Guide",
      excerpt: "From brand deals to affiliate marketing, learn how to turn your viral clips into revenue.",
      author: "Sarah Johnson",
      date: "January 22, 2026",
      readTime: "11 min read",
      tags: ["Strategy", "Case Studies"],
      image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=250&fit=crop",
    },
  ];

  const filteredPosts = selectedTag === "all" 
    ? posts 
    : posts.filter(post => post.tags.some(tag => tag.toLowerCase() === tags.find(t => t.id === selectedTag)?.name.toLowerCase()));

  return (
    <div>
      {/* Hero Section */}
      <div style={{ marginBottom: "48px" }}>
        <h1 style={{ fontSize: "48px", fontWeight: "bold", marginBottom: "16px", background: "linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Blog
        </h1>
        <p style={{ fontSize: "20px", color: "var(--text-secondary)", maxWidth: "600px" }}>
          Tips, trends, and insights on video marketing and content creation
        </p>
      </div>

      {/* Search */}
      <div style={{ 
        display: "flex", 
        gap: "16px", 
        marginBottom: "32px",
        flexWrap: "wrap"
      }}>
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "12px",
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          padding: "12px 16px",
          flex: 1,
          minWidth: "280px"
        }}>
          <Search size={20} style={{ color: "var(--text-muted)" }} />
          <input 
            type="text" 
            placeholder="Search articles..." 
            style={{ 
              backgroundColor: "transparent", 
              border: "none", 
              outline: "none",
              color: "white",
              fontSize: "14px",
              width: "100%"
            }}
          />
        </div>
      </div>

      {/* Tags Filter */}
      <div style={{ 
        display: "flex", 
        gap: "8px", 
        marginBottom: "32px",
        flexWrap: "wrap"
      }}>
        {tags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => setSelectedTag(tag.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              borderRadius: "24px",
              border: "1px solid",
              borderColor: selectedTag === tag.id ? "var(--primary)" : "var(--border)",
              backgroundColor: selectedTag === tag.id ? "rgba(139, 92, 246, 0.1)" : "transparent",
              color: selectedTag === tag.id ? "var(--primary)" : "var(--text-secondary)",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 500,
              transition: "all 0.2s"
            }}
          >
            <Tag size={14} />
            {tag.name}
          </button>
        ))}
      </div>

      {/* Featured Post */}
      <div style={{ marginBottom: "48px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "20px", color: "var(--text-muted)" }}>Featured Article</h2>
        <div style={{
          backgroundColor: "var(--surface)",
          borderRadius: "20px",
          border: "1px solid var(--border)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column"
        }}>
          <div style={{ height: "300px", position: "relative" }}>
            <div style={{
              backgroundImage: `url(${featuredPost.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "100%"
            }} />
            <div style={{
              position: "absolute",
              top: "16px",
              left: "16px",
              display: "flex",
              gap: "8px"
            }}>
              {featuredPost.tags.map((tag, index) => (
                <span key={index} style={{
                  backgroundColor: "var(--primary)",
                  color: "white",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: 500
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div style={{ padding: "32px" }}>
            <h3 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "12px" }}>
              {featuredPost.title}
            </h3>
            <p style={{ fontSize: "16px", color: "var(--text-secondary)", marginBottom: "24px", lineHeight: 1.6 }}>
              {featuredPost.excerpt}
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-muted)", fontSize: "14px" }}>
                  <User size={16} />
                  {featuredPost.author}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-muted)", fontSize: "14px" }}>
                  <Calendar size={16} />
                  {featuredPost.date}
                </div>
                <span style={{ color: "var(--text-muted)", fontSize: "14px" }}>{featuredPost.readTime}</span>
              </div>
              <button style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "var(--primary)",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 600
              }}>
                Read Article
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div style={{ marginBottom: "48px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "20px", color: "var(--text-muted)" }}>Latest Articles</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "24px" }}>
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              style={{
                backgroundColor: "var(--surface)",
                borderRadius: "16px",
                border: "1px solid var(--border)",
                overflow: "hidden",
                transition: "all 0.2s",
                cursor: "pointer"
              }}
            >
              {/* Thumbnail */}
              <div style={{ height: "200px" }}>
                <div style={{
                  backgroundImage: `url(${post.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  height: "100%"
                }} />
              </div>
              
              {/* Content */}
              <div style={{ padding: "20px" }}>
                <div style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
                  {post.tags.map((tag, index) => (
                    <span key={index} style={{
                      fontSize: "11px",
                      padding: "3px 8px",
                      borderRadius: "4px",
                      backgroundColor: "rgba(139, 92, 246, 0.1)",
                      color: "var(--primary)",
                      fontWeight: 500
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px", lineHeight: 1.4 }}>
                  {post.title}
                </h3>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "16px", lineHeight: 1.5 }}>
                  {post.excerpt}
                </p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "13px", color: "var(--text-muted)" }}>
                    <span>{post.author}</span>
                    <span>•</span>
                    <span>{post.date}</span>
                  </div>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{post.readTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div style={{
        background: "linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)",
        borderRadius: "16px",
        border: "1px solid var(--border)",
        padding: "48px",
        textAlign: "center"
      }}>
        <h2 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "12px" }}>Subscribe to Our Newsletter</h2>
        <p style={{ fontSize: "16px", color: "var(--text-secondary)", marginBottom: "32px", maxWidth: "500px", margin: "0 auto 32px" }}>
          Get the latest articles, tutorials, and tips delivered straight to your inbox
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <input 
            type="email" 
            placeholder="Enter your email" 
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              padding: "14px 20px",
              color: "white",
              fontSize: "14px",
              outline: "none",
              width: "280px"
            }}
          />
          <button style={{
            backgroundColor: "var(--primary)",
            color: "white",
            padding: "14px 32px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 600
          }}>
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
}
