"use client";

import { useState } from "react";
import { 
  Book, 
  Search, 
  Play, 
  Clock, 
  Star, 
  ChevronRight,
  Video,
  FileText,
  Zap,
  Layout,
  MessageSquare,
  BarChart3,
  Users,
  Image,
  Film,
  ArrowRight
} from "lucide-react";

const categories = [
  { id: "all", name: "All Courses", icon: Book, count: 24 },
  { id: "getting-started", name: "Getting Started", icon: Zap, count: 6 },
  { id: "tutorials", name: "Video Tutorials", icon: Video, count: 8 },
  { id: "guides", name: "Step-by-Step Guides", icon: FileText, count: 5 },
  { id: "tips", name: "Tips & Tricks", icon: Star, count: 5 },
];

const courses = [
  {
    id: 1,
    title: "Getting Started with AI Podcast",
    description: "Learn the basics of using AI Podcast to create amazing content from your recordings.",
    category: "getting-started",
    duration: "15 min",
    level: "Beginner",
    lessons: 5,
    rating: 4.9,
    students: 1250,
    thumbnail: "🎙️",
    featured: true
  },
  {
    id: 2,
    title: "Mastering Clip Generation",
    description: "Discover how to create engaging short clips from your long-form podcast content.",
    category: "tutorials",
    duration: "25 min",
    level: "Intermediate",
    lessons: 8,
    rating: 4.8,
    students: 890,
    thumbnail: "✂️"
  },
  {
    id: 3,
    title: "AI-Powered Captions Deep Dive",
    description: "Learn how to generate accurate captions and customize them for your brand.",
    category: "tutorials",
    duration: "20 min",
    level: "Intermediate",
    lessons: 6,
    rating: 4.7,
    students: 654,
    subtitle: "📝"
  },
  {
    id: 4,
    title: "Creating Stunning Thumbnails",
    description: "Design eye-catching thumbnails that increase your click-through rates.",
    category: "tips",
    duration: "18 min",
    level: "Advanced",
    lessons: 5,
    rating: 4.9,
    students: 432,
    thumbnail: "🖼️"
  },
  {
    id: 5,
    title: "Brand Template Mastery",
    description: "Learn how to create and use brand templates for consistent content.",
    category: "guides",
    duration: "30 min",
    level: "Intermediate",
    lessons: 10,
    rating: 4.8,
    students: 567,
    thumbnail: "🎨"
  },
  {
    id: 6,
    title: "Social Media Integration",
    description: "Connect your social accounts and automatically share your clips.",
    category: "guides",
    duration: "22 min",
    level: "Beginner",
    lessons: 7,
    rating: 4.6,
    students: 789,
    thumbnail: "📱"
  },
  {
    id: 7,
    title: "Analytics & Performance Tracking",
    description: "Understand your audience and improve your content strategy with analytics.",
    category: "tutorials",
    duration: "28 min",
    level: "Advanced",
    lessons: 9,
    rating: 4.7,
    students: 345,
    thumbnail: "📊"
  },
  {
    id: 8,
    title: "Team Collaboration",
    description: "Work effectively with your team using AI Podcast's collaboration features.",
    category: "guides",
    duration: "20 min",
    level: "Intermediate",
    lessons: 6,
    rating: 4.8,
    students: 234,
    thumbnail: "👥"
  }
];

const quickGuides = [
  { title: "Quick Start Guide", icon: Zap, readTime: "5 min" },
  { title: "Importing Your First Video", icon: Video, readTime: "8 min" },
  { title: "Understanding Credit Usage", icon: Star, readTime: "6 min" },
  { title: "Export Settings Explained", icon: FileText, readTime: "10 min" },
];

export default function LearningCenterPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = courses.filter(course => {
    const matchesCategory = activeCategory === "all" || course.category === activeCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ padding: "24px", maxWidth: "1400px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "white", marginBottom: "8px" }}>
          Learning Center
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
          Tutorials, guides, and resources to help you get the most out of AI Podcast
        </p>
      </div>

      {/* Search Bar */}
      <div style={{ 
        position: "relative", 
        marginBottom: "24px",
        maxWidth: "500px"
      }}>
        <Search 
          size={20} 
          style={{ 
            position: "absolute", 
            left: "16px", 
            top: "50%", 
            transform: "translateY(-50%)",
            color: "var(--text-secondary)"
          }} 
        />
        <input
          type="text"
          placeholder="Search tutorials, guides, and more..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: "100%",
            padding: "14px 16px 14px 48px",
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            color: "white",
            fontSize: "14px",
            outline: "none"
          }}
        />
      </div>

      {/* Categories */}
      <div style={{ 
        display: "flex", 
        gap: "12px", 
        marginBottom: "32px",
        overflowX: "auto",
        paddingBottom: "8px"
      }}>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 16px",
              backgroundColor: activeCategory === category.id ? "var(--primary)" : "var(--surface)",
              border: activeCategory === category.id ? "none" : "1px solid var(--border)",
              borderRadius: "8px",
              color: activeCategory === category.id ? "white" : "var(--text-secondary)",
              cursor: "pointer",
              whiteSpace: "nowrap",
              fontWeight: "500",
              fontSize: "14px"
            }}
          >
            <category.icon size={18} />
            {category.name}
            <span style={{ 
              fontSize: "12px", 
              padding: "2px 8px", 
              backgroundColor: activeCategory === category.id ? "rgba(255,255,255,0.2)" : "var(--border)",
              borderRadius: "10px"
            }}>
              {category.count}
            </span>
          </button>
        ))}
      </div>

      {/* Featured Course */}
      {activeCategory === "all" && !searchQuery && (
        <div style={{ 
          backgroundColor: "var(--surface)", 
          borderRadius: "16px", 
          padding: "32px",
          marginBottom: "32px",
          border: "1px solid var(--primary)",
          background: "linear-gradient(135deg, var(--surface) 0%, rgba(99, 102, 241, 0.1) 100%)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "24px" }}>
            <div style={{ flex: 1, minWidth: "300px" }}>
              <span style={{ 
                color: "var(--primary)", 
                fontSize: "12px", 
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "1px"
              }}>
                Featured Course
              </span>
              <h2 style={{ fontSize: "28px", fontWeight: "bold", color: "white", marginTop: "8px", marginBottom: "12px" }}>
                Getting Started with AI Podcast
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "15px", marginBottom: "20px", lineHeight: 1.6 }}>
                Learn the basics of using AI Podcast to create amazing content from your recordings. 
                Perfect for beginners who want to get up and running quickly.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)", fontSize: "14px" }}>
                  <Clock size={16} /> 15 min
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)", fontSize: "14px" }}>
                  <FileText size={16} /> 5 lessons
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--warning)", fontSize: "14px" }}>
                  <Star size={16} /> 4.9 rating
                </div>
              </div>
              <button style={{
                padding: "12px 24px",
                backgroundColor: "var(--primary)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                Start Learning <ArrowRight size={18} />
              </button>
            </div>
            <div style={{ 
              width: "200px", 
              height: "160px", 
              backgroundColor: "var(--background)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "64px"
            }}>
              🎙️
            </div>
          </div>
        </div>
      )}

      {/* Quick Guides */}
      {activeCategory === "all" && !searchQuery && (
        <div style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "white", marginBottom: "16px" }}>
            Quick Guides
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" }}>
            {quickGuides.map((guide, index) => (
              <div key={index} style={{ 
                backgroundColor: "var(--surface)", 
                borderRadius: "12px", 
                padding: "20px",
                border: "1px solid var(--border)",
                cursor: "pointer",
                transition: "all 0.2s"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                  <div style={{ 
                    width: "40px", 
                    height: "40px", 
                    borderRadius: "10px",
                    backgroundColor: "var(--primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <guide.icon size={20} color="white" />
                  </div>
                  <span style={{ color: "white", fontWeight: "600" }}>{guide.title}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-secondary)", fontSize: "13px" }}>{guide.readTime} read</span>
                  <ChevronRight size={18} color="var(--text-secondary)" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Course Grid */}
      <div>
        <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "white", marginBottom: "16px" }}>
          {activeCategory === "all" ? "All Courses" : categories.find(c => c.id === activeCategory)?.name}
          <span style={{ color: "var(--text-secondary)", fontSize: "16px", fontWeight: "normal", marginLeft: "8px" }}>
            ({filteredCourses.length})
          </span>
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
          {filteredCourses.map((course) => (
            <div key={course.id} style={{ 
              backgroundColor: "var(--surface)", 
              borderRadius: "16px", 
              padding: "24px",
              border: "1px solid var(--border)",
              cursor: "pointer",
              transition: "all 0.2s",
              display: "flex",
              flexDirection: "column"
            }}>
              <div style={{ 
                height: "120px", 
                backgroundColor: "var(--background)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "48px",
                marginBottom: "16px"
              }}>
                {course.thumbnail}
              </div>
              <div style={{ marginBottom: "12px" }}>
                <span style={{ 
                  fontSize: "11px", 
                  color: "var(--primary)",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  {course.level}
                </span>
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "white", marginBottom: "8px" }}>
                {course.title}
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "16px", flex: 1 }}>
                {course.description}
              </p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--text-secondary)", fontSize: "13px" }}>
                    <Clock size={14} /> {course.duration}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--text-secondary)", fontSize: "13px" }}>
                    <FileText size={14} /> {course.lessons} lessons
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--warning)", fontSize: "13px", fontWeight: "600" }}>
                  <Star size={14} /> {course.rating}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div style={{ 
            textAlign: "center", 
            padding: "60px",
            color: "var(--text-secondary)"
          }}>
            <Book size={48} style={{ marginBottom: "16px", opacity: 0.5 }} />
            <p>No courses found matching your criteria.</p>
            <button 
              onClick={() => { setActiveCategory("all"); setSearchQuery(""); }}
              style={{
                marginTop: "16px",
                padding: "10px 20px",
                backgroundColor: "var(--primary)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer"
              }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Newsletter Section */}
      <div style={{ 
        marginTop: "48px",
        backgroundColor: "var(--surface)", 
        borderRadius: "16px", 
        padding: "32px",
        border: "1px solid var(--border)",
        textAlign: "center"
      }}>
        <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "white", marginBottom: "8px" }}>
          Stay Updated
        </h3>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "20px" }}>
          Subscribe to our newsletter to get the latest tutorials and tips delivered to your inbox.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", maxWidth: "400px", margin: "0 auto" }}>
          <input
            type="email"
            placeholder="Enter your email"
            style={{
              flex: 1,
              padding: "12px 16px",
              backgroundColor: "var(--background)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              color: "white",
              fontSize: "14px",
              outline: "none"
            }}
          />
          <button style={{
            padding: "12px 24px",
            backgroundColor: "var(--primary)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600"
          }}>
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
}
