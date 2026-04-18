"use client";

import { Calendar, User, ArrowRight, Search, Tag, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  tags: string[];
  coverImage?: string;
  slug: string;
}

export default function BlogPage() {
  const [selectedTag, setSelectedTag] = useState("all");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tags = [
    { id: "all", name: "All Posts" },
    { id: "strategy", name: "Strategy" },
    { id: "tutorials", name: "Tutorials" },
    { id: "trends", name: "Trends" },
    { id: "case-studies", name: "Case Studies" },
    { id: "tips", name: "Tips & Tricks" },
  ];

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/cms/resources?type=BLOG&limit=20&featured=true");
      if (!response.ok) throw new Error("Failed to fetch blog posts");

      const data = await response.json();

      if (data.featured) {
        setFeaturedPost(data.featured);
        setPosts(data.resources);
      } else {
        setPosts(data.resources);
        setFeaturedPost(data.resources[0] || null);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load blog posts");
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = selectedTag === "all"
    ? posts
    : posts.filter(post => post.tags.some(tag =>
        tag.toLowerCase().includes(tags.find(t => t.id === selectedTag)?.name.toLowerCase() || "")
      ));

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

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

     {/* Loading/Error States */}
     {loading && (
       <div style={{ textAlign: "center", padding: "48px" }}>
         <Loader2 size={48} className="animate-spin" style={{ color: "var(--primary)", marginBottom: "16px" }} />
         <p>Loading blog posts...</p>
       </div>
     )}

     {error && (
       <div style={{
         backgroundColor: "#fee2e2",
         border: "1px solid #fca5a5",
         borderRadius: "8px",
         padding: "16px",
         color: "#dc2626",
         textAlign: "center",
         marginBottom: "48px"
       }}>
         {error}
       </div>
     )}

     {/* Featured Post */}
     {!loading && !error && featuredPost && (
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
           {featuredPost.coverImage && (
             <div style={{ height: "300px", position: "relative" }}>
               <div style={{
                 backgroundImage: `url(${featuredPost.coverImage})`,
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
                 {featuredPost.tags.slice(0, 3).map((tag, index) => (
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
           )}
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
                   {featuredPost.author || "Anonymous"}
                 </div>
                 <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-muted)", fontSize: "14px" }}>
                   <Calendar size={16} />
                   {formatDate(featuredPost.publishedAt)}
                 </div>
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
      )}

      {/* Posts Grid */}
      {!loading && !error && (
        <div style={{ marginBottom: "48px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "20px", color: "var(--text-muted)" }}>Latest Articles</h2>
          {filteredPosts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px", color: "var(--text-secondary)" }}>
              No blog posts found.
            </div>
          ) : (
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
                  {post.coverImage && (
                    <div style={{ height: "200px" }}>
                      <div style={{
                        backgroundImage: `url(${post.coverImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        height: "100%"
                      }} />
                    </div>
                  )}

                  {/* Content */}
                  <div style={{ padding: "20px" }}>
                    <div style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
                      {post.tags.slice(0, 3).map((tag, index) => (
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
                        <span>{post.author || "Anonymous"}</span>
                        <span>•</span>
                        <span>{formatDate(post.publishedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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
