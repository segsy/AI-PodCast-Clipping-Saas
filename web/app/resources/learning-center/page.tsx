"use client";

import { Play, BookOpen, Video, Clock, ArrowRight, Search, Filter } from "lucide-react";
import { useState } from "react";

export default function LearningCenterPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Tutorials", icon: BookOpen },
    { id: "getting-started", name: "Getting Started", icon: Play },
    { id: "video-editing", name: "Video Editing", icon: Video },
    { id: "growth", name: "Growth Strategies", icon: ArrowRight },
    { id: "advanced", name: "Advanced Features", icon: BookOpen },
  ];

  const tutorials = [
    {
      id: 1,
      title: "Getting Started with OpusClip",
      description: "Learn the basics of video clipping and set up your first project",
      duration: "5 min",
      level: "Beginner",
      category: "getting-started",
      thumbnail: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=225&fit=crop",
    },
    {
      id: 2,
      title: "How to Use ClipAnything Technology",
      description: "Master the AI-powered video clipping feature to extract viral moments",
      duration: "8 min",
      level: "Beginner",
      category: "getting-started",
      thumbnail: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&h=225&fit=crop",
    },
    {
      id: 3,
      title: "Creating Viral Captions",
      description: "Add animated captions that grab attention and boost engagement",
      duration: "10 min",
      level: "Intermediate",
      category: "video-editing",
      thumbnail: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=400&h=225&fit=crop",
    },
    {
      id: 4,
      title: "AI Reframe for Multi-Platform",
      description: "Automatically resize your videos for TikTok, Instagram, and YouTube",
      duration: "6 min",
      level: "Intermediate",
      category: "video-editing",
      thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=225&fit=crop",
    },
    {
      id: 5,
      title: "Building Your Content Strategy",
      description: "Learn how to plan and schedule content for maximum reach",
      duration: "12 min",
      level: "Advanced",
      category: "growth",
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop",
    },
    {
      id: 6,
      title: "Monetization Strategies for Creators",
      description: "Turn your viral clips into multiple income streams",
      duration: "15 min",
      level: "Advanced",
      category: "growth",
      thumbnail: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=225&fit=crop",
    },
    {
      id: 7,
      title: "Advanced B-Roll Integration",
      description: "Add AI-generated B-roll footage for professional results",
      duration: "10 min",
      level: "Advanced",
      category: "advanced",
      thumbnail: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=225&fit=crop",
    },
    {
      id: 8,
      title: "Team Collaboration Features",
      description: "Work together with your team on video projects",
      duration: "7 min",
      level: "Intermediate",
      category: "advanced",
      thumbnail: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=225&fit=crop",
    },
  ];

  const filteredTutorials = selectedCategory === "all" 
    ? tutorials 
    : tutorials.filter(t => t.category === selectedCategory);

  return (
    <div>
      {/* Hero Section */}
      <div style={{ marginBottom: "48px" }}>
        <h1 style={{ fontSize: "48px", fontWeight: "bold", marginBottom: "16px", background: "linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Learning Center
        </h1>
        <p style={{ fontSize: "20px", color: "var(--text-secondary)", maxWidth: "600px" }}>
          Master video clipping with our comprehensive tutorials, guides, and best practices
        </p>
      </div>

      {/* Search and Filter */}
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
            placeholder="Search tutorials..." 
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

      {/* Category Filter */}
      <div style={{ 
        display: "flex", 
        gap: "8px", 
        marginBottom: "32px",
        flexWrap: "wrap"
      }}>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              borderRadius: "24px",
              border: "1px solid",
              borderColor: selectedCategory === category.id ? "var(--primary)" : "var(--border)",
              backgroundColor: selectedCategory === category.id ? "rgba(139, 92, 246, 0.1)" : "transparent",
              color: selectedCategory === category.id ? "var(--primary)" : "var(--text-secondary)",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 500,
              transition: "all 0.2s"
            }}
          >
            <category.icon size={16} />
            {category.name}
          </button>
        ))}
      </div>

      {/* Tutorials Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
        {filteredTutorials.map((tutorial) => (
          <div
            key={tutorial.id}
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
            <div style={{ position: "relative", height: "180px" }}>
              <div style={{
                backgroundImage: `url(${tutorial.thumbnail})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "100%"
              }} />
              <div style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "rgba(0,0,0,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0,
                transition: "opacity 0.2s"
              }}>
                <div style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  backgroundColor: "var(--primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <Play size={24} style={{ color: "white", marginLeft: "2px" }} />
                </div>
              </div>
              <div style={{
                position: "absolute",
                bottom: "12px",
                right: "12px",
                backgroundColor: "rgba(0,0,0,0.8)",
                padding: "4px 8px",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "12px"
              }}>
                <Clock size={12} />
                {tutorial.duration}
              </div>
            </div>
            
            {/* Content */}
            <div style={{ padding: "20px" }}>
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "8px",
                marginBottom: "8px"
              }}>
                <span style={{
                  fontSize: "12px",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  backgroundColor: tutorial.level === "Beginner" ? "rgba(16, 185, 129, 0.1)" : tutorial.level === "Intermediate" ? "rgba(245, 158, 11, 0.1)" : "rgba(139, 92, 246, 0.1)",
                  color: tutorial.level === "Beginner" ? "var(--success)" : tutorial.level === "Intermediate" ? "var(--warning)" : "var(--primary)",
                  fontWeight: 500
                }}>
                  {tutorial.level}
                </span>
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>
                {tutorial.title}
              </h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                {tutorial.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div style={{ marginTop: "48px", textAlign: "center" }}>
        <button style={{
          backgroundColor: "var(--surface)",
          color: "white",
          padding: "14px 32px",
          borderRadius: "8px",
          border: "1px solid var(--border)",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: 500,
          display: "inline-flex",
          alignItems: "center",
          gap: "8px"
        }}>
          Load More Tutorials
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
