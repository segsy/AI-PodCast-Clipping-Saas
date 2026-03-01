"use client";

import Link from "next/link";
import { 
  Zap, Users, Megaphone, Mic, Building2, Video, 
  Target, Cross, ShoppingCart, Home, ArrowRight, Check,
  Play, TrendingUp, Clock, DollarSign
} from "lucide-react";

export default function SolutionsPage() {
  const solutions = [
    {
      id: "creators",
      icon: Play,
      title: "Creators",
      subtitle: "Fastest way to gain your next 1 million views without burnout",
      description: "Turn your long-form content into viral shorts instantly. No editing skills needed.",
      stats: [
        { value: "10M+", label: "Monthly Views" },
        { value: "85%", label: "Time Saved" },
        { value: "3x", label: "Faster Growth" }
      ],
      color: "#06b6d4"
    },
    {
      id: "media-entertainment",
      icon: Video,
      title: "Media & Entertainment",
      subtitle: "Streamline video creation workflow & reach 10x more audiences",
      description: "Automate your content clipping pipeline and scale your video production.",
      stats: [
        { value: "10x", label: "More Content" },
        { value: "70%", label: "Cost Reduction" },
        { value: "5hrs", label: "Saved Daily" }
      ],
      color: "#8b5cf6"
    },
    {
      id: "marketers",
      icon: Megaphone,
      title: "Marketers",
      subtitle: "Make every marketer a pro video editor",
      description: "Empower your marketing team to create engaging video content without hiring editors.",
      stats: [
        { value: "50+", label: "Campaigns/Month" },
        { value: "60%", label: "Faster Turnaround" },
        { value: "4x", label: "Engagement" }
      ],
      color: "#f59e0b"
    },
    {
      id: "podcasters",
      icon: Mic,
      title: "Podcasters",
      subtitle: "Get your next 1 million views in weeks via consistent posting",
      description: "Transform your podcast episodes into shareable short clips that drive massive growth.",
      stats: [
        { value: "1M+", label: "Views/Week" },
        { value: "12x", label: "Audience Growth" },
        { value: "90%", label: "More Reach" }
      ],
      color: "#ec4899"
    },
    {
      id: "agencies",
      icon: Building2,
      title: "Agencies",
      subtitle: "Scale your business and save $2,700 monthly on editing cost",
      description: "Deliver more client projects with less overhead. Automate your video editing workflow.",
      stats: [
        { value: "$2,700", label: "Saved Monthly" },
        { value: "3x", label: "Client Capacity" },
        { value: "95%", label: "Client Satisfaction" }
      ],
      color: "#10b981"
    },
    {
      id: "livestreamers",
      icon: Users,
      title: "Livestreamers",
      subtitle: "Drive more traffic back to your livestreams through shorts",
      description: "Repurpose your live streams into engaging shorts that bring viewers back for more.",
      stats: [
        { value: "200%", label: "Return Traffic" },
        { value: "75%", label: "Clip Volume Up" },
        { value: "50%", label: "More Followers" }
      ],
      color: "#f97316"
    },
    {
      id: "advertisers",
      icon: Target,
      title: "Advertisers",
      subtitle: "Create high-performing ad creatives at scale",
      description: "Generate dozens of ad variations in minutes. Test more creatives, get better results.",
      stats: [
        { value: "100+", label: "Ad Variations" },
        { value: "40%", label: "Better CTR" },
        { value: "3x", label: "ROAS" }
      ],
      color: "#ef4444"
    },
    {
      id: "church",
      icon: Cross,
      title: "Church",
      subtitle: "Evangelize digitally to reach more people & get more donations",
      description: "Share your sermons and services with the world. Grow your congregation online.",
      stats: [
        { value: "500%", label: "Online Reach" },
        { value: "35%", label: "Donation Increase" },
        { value: "80%", label: "Service Views" }
      ],
      color: "#14b8a6"
    },
    {
      id: "e-commerce",
      icon: ShoppingCart,
      title: "E-commerce",
      subtitle: "Sell more products & increase exposure with viral shorts",
      description: "Showcase your products in engaging short videos that drive sales and brand awareness.",
      stats: [
        { value: "150%", label: "More Sales" },
        { value: "300%", label: "Brand Awareness" },
        { value: "5x", label: "Traffic" }
      ],
      color: "#a855f7"
    },
    {
      id: "real-estate",
      icon: Home,
      title: "Real Estate",
      subtitle: "Get more leads through shorts to become the top-selling realtor",
      description: "Create captivating property tours and market insights that attract buyers and sellers.",
      stats: [
        { value: "200%", label: "More Leads" },
        { value: "3x", label: "Listings Sold" },
        { value: "60%", label: "Faster Sales" }
      ],
      color: "#0ea5e9"
    }
  ];

  const features = [
    { icon: Zap, title: "AI-Powered Clipping", description: "Automatically identify the most engaging moments in your content" },
    { icon: Clock, title: "5-Minute Processing", description: "Turn hours of content into ready-to-post shorts in minutes" },
    { icon: TrendingUp, title: "Viral Optimization", description: "AI suggests hooks and captions to maximize engagement" },
    { icon: DollarSign, title: "No Editor Needed", description: "Create professional videos without any technical skills" }
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
              <Link href="/solutions" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 500 }}>Solutions</Link>
              <Link href="/resources/customer-stories" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Customer Stories</Link>
              <Link href="/resources/learning-center" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Learning Center</Link>
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

      {/* Hero Section */}
      <section style={{ paddingTop: "120px", paddingBottom: "80px", textAlign: "center", background: "linear-gradient(180deg, rgba(6, 182, 212, 0.1) 0%, transparent 100%)" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 24px" }}>
          <span style={{ 
            backgroundColor: "rgba(6, 182, 212, 0.2)", 
            color: "var(--accent)", 
            padding: "8px 16px", 
            borderRadius: "24px",
            fontSize: "14px",
            fontWeight: 600,
            display: "inline-block",
            marginBottom: "24px"
          }}>
            Industry Solutions
          </span>
          <h1 style={{ fontSize: "56px", fontWeight: "bold", marginBottom: "24px", lineHeight: 1.1 }}>
            Solutions for Every <span style={{ color: "var(--accent)" }}>Industry</span>
          </h1>
          <p style={{ fontSize: "20px", color: "var(--text-secondary)", maxWidth: "700px", margin: "0 auto 48px" }}>
            Whether you're a creator, marketer, or enterprise, we help you transform long-form content into viral short videos that grow your audience.
          </p>
          
          {/* Key Benefits */}
          <div style={{ display: "flex", gap: "48px", justifyContent: "center", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "rgba(6, 182, 212, 0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Zap size={20} style={{ color: "var(--accent)" }} />
              </div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: "24px", fontWeight: "bold" }}>5 min</div>
                <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Processing Time</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "rgba(6, 182, 212, 0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <TrendingUp size={20} style={{ color: "var(--accent)" }} />
              </div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: "24px", fontWeight: "bold" }}>10x</div>
                <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>More Content</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "rgba(6, 182, 212, 0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Users size={20} style={{ color: "var(--accent)" }} />
              </div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: "24px", fontWeight: "bold" }}>1M+</div>
                <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Users Worldwide</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section style={{ padding: "80px 24px", maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: "24px" }}>
          {solutions.map((solution) => (
            <Link 
              key={solution.id}
              href={`/resources/case-studies/${solution.id}`}
              style={{ 
                backgroundColor: "var(--surface)", 
                borderRadius: "16px", 
                padding: "32px",
                border: "1px solid var(--border)",
                textDecoration: "none",
                transition: "all 0.3s ease",
                display: "block"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = solution.color;
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = `0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px ${solution.color}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", marginBottom: "20px" }}>
                <div style={{ 
                  width: "56px", 
                  height: "56px", 
                  borderRadius: "12px", 
                  backgroundColor: `${solution.color}20`,
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  flexShrink: 0
                }}>
                  <solution.icon size={28} style={{ color: solution.color }} />
                </div>
                <div>
                  <h3 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "4px", color: "white" }}>
                    {solution.title}
                  </h3>
                  <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                    {solution.subtitle}
                  </p>
                </div>
              </div>
              
              <p style={{ fontSize: "15px", color: "var(--text-secondary)", marginBottom: "24px", lineHeight: 1.6 }}>
                {solution.description}
              </p>
              
              <div style={{ display: "flex", gap: "24px", marginBottom: "24px" }}>
                {solution.stats.map((stat, index) => (
                  <div key={index}>
                    <div style={{ fontSize: "20px", fontWeight: "bold", color: solution.color }}>
                      {stat.value}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
              
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "8px", 
                color: solution.color,
                fontWeight: 500,
                fontSize: "14px"
              }}>
                View Case Study <ArrowRight size={16} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: "80px 24px", backgroundColor: "var(--surface)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <h2 style={{ fontSize: "40px", fontWeight: "bold", marginBottom: "16px" }}>
              Why Top Brands Choose Us
            </h2>
            <p style={{ fontSize: "18px", color: "var(--text-secondary)" }}>
              Everything you need to scale your video content production
            </p>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "32px" }}>
            {features.map((feature, index) => (
              <div key={index} style={{ textAlign: "center" }}>
                <div style={{ 
                  width: "64px", 
                  height: "64px", 
                  borderRadius: "16px", 
                  backgroundColor: "rgba(6, 182, 212, 0.15)",
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  margin: "0 auto 16px"
                }}>
                  <feature.icon size={28} style={{ color: "var(--accent)" }} />
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px", color: "white" }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: "100px 24px", textAlign: "center", background: "linear-gradient(180deg, transparent 0%, rgba(6, 182, 212, 0.1) 100%)" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "48px", fontWeight: "bold", marginBottom: "20px" }}>
            Ready to <span style={{ color: "var(--accent)" }}>Transform</span> Your Content?
          </h2>
          <p style={{ fontSize: "18px", color: "var(--text-secondary)", marginBottom: "40px" }}>
            Join 1 million+ creators, marketers, and businesses already using AI Podcast Clipper to grow their audience.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/dashboard" style={{
              backgroundColor: "var(--primary)",
              color: "white",
              padding: "16px 32px",
              borderRadius: "12px",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "16px",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px"
            }}>
              Start Free Trial <ArrowRight size={20} />
            </Link>
            <Link href="/resources/customer-stories" style={{
              backgroundColor: "transparent",
              color: "white",
              padding: "16px 32px",
              borderRadius: "12px",
              border: "1px solid var(--border)",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "16px"
            }}>
              See Success Stories
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "40px 24px", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "24px", height: "24px", backgroundColor: "var(--primary)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap size={14} style={{ color: "white" }} />
            </div>
            <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>© 2024 AI Podcast Clipper. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
