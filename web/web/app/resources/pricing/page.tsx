"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  ArrowLeft, 
  Check, 
  ChevronRight, 
  HelpCircle,
  X,
  Sparkles,
  Zap,
  Users,
  Building2,
  Crown,
  CreditCard,
  Clock,
  BarChart3,
  Layers,
  Share2,
  FileText,
  MessageSquare,
  Shield,
  Sliders,
  Globe,
  Download,
  Wand2,
  Headphones,
  Hash,
  Video,
  Instagram,
  Youtube,
  Loader2,
  Send
} from "lucide-react";
import { createCheckoutSession, PLANS, PlanType } from "@/lib/billing";

export default function PricingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactPlan, setContactPlan] = useState("");
  const [billingInterval, setBillingInterval] = useState<"monthly" | "annual">("monthly");
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Check for subscription status in URL
  useEffect(() => {
    const status = searchParams.get("subscription");
    if (status === "success") {
      // Show success message or redirect
      console.log("Subscription successful!");
    } else if (status === "cancelled") {
      console.log("Subscription cancelled");
    }
  }, [searchParams]);

  const handleSubscribe = async (planId: PlanType) => {
    setLoadingPlan(planId);
    try {
      const { url } = await createCheckoutSession({
        planId,
        interval: billingInterval,
        workspaceId: "default", // Will be determined server-side from session
      });
      
      if (url) {
        window.location.href = url;
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      alert(error.message || "Failed to start checkout. Please try again.");
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleContactClick = (plan: string) => {
    setContactPlan(plan);
    setShowContactForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  const starterFeatures = [
    { text: "150 credits per month", tooltip: "Credits can be used for AI clipping, captions, and more" },
    { text: "AI clipping with Virality Score", tooltip: "AI analyzes your content to predict viral potential" },
    { text: "AI animated captions in 20+ languages", tooltip: "Automatically generate and translate captions" },
    { text: "Auto post to YouTube Shorts, TikTok, IG Reels, or download", tooltip: "One-click posting to multiple platforms" },
    { text: "Powerful editor", tooltip: "Full-featured video editing capabilities" },
    { text: "1 brand template", tooltip: "Customize your video branding" },
    { text: "Filler & silence removal", tooltip: "Automatically remove ums, uhs, and dead air" },
    { text: "Remove Watermark", tooltip: "Export without our watermark" },
  ];

  const proFeatures = [
    { text: "3,600 credits per year, available instantly", tooltip: "Equivalent to 300 credits/month" },
    { text: "Team workspace with 2 seats", tooltip: "Collaborate with your team" },
    { text: "2 brand templates", tooltip: "More branding options" },
    { text: "6 social account connections", tooltip: "Connect more platforms" },
    { text: "Everything in Starter plan, plus:", tooltip: "" },
    { text: "AI B-roll", tooltip: "Automatically add relevant stock footage" },
    { text: "Input from 10+ sources", tooltip: "Import from various platforms" },
    { text: "Export to Adobe Premiere Pro & DaVinci Resolve", tooltip: "Professional export options" },
    { text: "Multiple aspect ratios (9:16, 1:1, 16:9)", tooltip: "Optimize for any platform" },
    { text: "Social media scheduler", tooltip: "Plan your posts in advance" },
    { text: "Intercom chat support", tooltip: "Get help when you need it" },
    { text: "Custom fonts", tooltip: "Use your brand fonts" },
    { text: "Speech enhancement", tooltip: "Improve audio quality" },
  ];

  const businessFeatures = [
    { text: "Priority project processing", tooltip: "Faster rendering and processing" },
    { text: "Customized credits, team seats and social account connections", tooltip: "Scale as you grow" },
    { text: "Tailored business assets: brand templates, fonts, vocabulary & more", tooltip: "Full brand customization" },
    { text: "Dedicated storage", tooltip: "More space for your projects" },
    { text: "API & custom integrations", tooltip: "Connect with your tools" },
    { text: "Master Service Agreement (MSA)", tooltip: "Enterprise terms" },
    { text: "Priority support with a dedicated Slack channel", tooltip: "Direct access to our team" },
    { text: "Enterprise-level security", tooltip: "Advanced security features" },
    { text: "Everything in the Pro plan, plus:", tooltip: "" },
  ];

  const trustedBy = [
    { name: "Billboard", logo: "🎵" },
    { name: "Univision", logo: "📺" },
    { name: "HubSpot", logo: "🧡" },
    { name: "LinkedIn", logo: "💼" },
    { name: "SeaHawks", logo: "🦅" },
    { name: "Netflix", logo: "🎬" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)" }}>
      {/* Back Link */}
      <Link 
        href="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          color: "var(--text-secondary)",
          padding: "24px 48px",
          fontSize: "14px",
          textDecoration: "none",
          transition: "color 0.2s"
        }}
      >
        <ArrowLeft size={16} />
        Back to Home
      </Link>

      {/* Header */}
      <div style={{ textAlign: "center", padding: "0 24px 64px" }}>
        <div style={{
          display: "inline-block",
          padding: "6px 16px",
          background: "rgba(139, 92, 246, 0.1)",
          borderRadius: "20px",
          marginBottom: "24px",
          border: "1px solid rgba(139, 92, 246, 0.2)"
        }}>
          <span style={{ color: "var(--primary)", fontSize: "14px", fontWeight: 500 }}>
            Simple, transparent pricing
          </span>
        </div>
        <h1 style={{
          fontSize: "48px",
          fontWeight: 700,
          marginBottom: "16px",
          background: "linear-gradient(135deg, #FFFFFF 0%, #A1A1AA 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        }}>
          Choose Your Plan
        </h1>
        <p style={{
          fontSize: "18px",
          color: "var(--text-secondary)",
          maxWidth: "600px",
          margin: "0 auto",
          lineHeight: 1.6
        }}>
          Start free and scale as you grow. No credit card required to begin.
        </p>
        
        {/* Billing Interval Toggle */}
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          gap: "12px",
          marginBottom: "32px"
        }}>
          <span style={{ 
            fontSize: "14px", 
            color: billingInterval === "monthly" ? "white" : "var(--text-muted)"
          }}>
            Monthly
          </span>
          <button
            onClick={() => setBillingInterval(billingInterval === "monthly" ? "annual" : "monthly")}
            style={{
              position: "relative",
              width: "56px",
              height: "28px",
              background: billingInterval === "annual" ? "var(--primary)" : "var(--border)",
              borderRadius: "14px",
              border: "none",
              cursor: "pointer",
              transition: "background 0.2s"
            }}
          >
            <div style={{
              position: "absolute",
              top: "2px",
              left: billingInterval === "annual" ? "30px" : "2px",
              width: "24px",
              height: "24px",
              background: "white",
              borderRadius: "12px",
              transition: "left 0.2s"
            }} />
          </button>
          <span style={{ 
            fontSize: "14px", 
            color: billingInterval === "annual" ? "white" : "var(--text-muted)"
          }}>
            Annual <span style={{ color: "var(--success)", fontWeight: 600 }}>(Save 20%)</span>
          </span>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "24px",
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "0 48px 64px"
      }}>
        {/* Starter Card */}
        <div className="pricing-card" style={{
          background: "var(--surface)",
          borderRadius: "16px",
          border: "1px solid var(--border)",
          padding: "32px",
          position: "relative",
          display: "flex",
          flexDirection: "column"
        }}>
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ fontSize: "24px", fontWeight: 600, marginBottom: "8px", color: "var(--text-primary)" }}>
              Starter
            </h3>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
              For individual creators
            </p>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
              <span style={{ fontSize: "48px", fontWeight: 700, color: "var(--text-primary)"}}>${billingInterval === "monthly" ? PLANS.starter.priceMonthly : Math.round(PLANS.starter.priceAnnual / 12)}</span>
              <span style={{ fontSize: "16px", color: "var(--text-secondary)" }}>USD/mo</span>
            </div>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
              {billingInterval === "annual" ? `${PLANS.starter.priceAnnual} billed annually` : "Starter plan only available in monthly"}
            </p>
          </div>

          <button 
            onClick={() => handleSubscribe("starter")}
            disabled={loadingPlan === "starter"}
            style={{
              width: "100%",
              padding: "14px 24px",
              background: "var(--primary)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: 600,
              cursor: loadingPlan === "starter" ? "not-allowed" : "pointer",
              marginBottom: "24px",
              transition: "background 0.2s",
              opacity: loadingPlan === "starter" ? 0.7 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            }}>
            {loadingPlan === "starter" ? <Loader2 size={20} className="animate-spin" /> : "Start your free trial"}
          </button>

          <p style={{ fontSize: "13px", color: "var(--text-muted)", textAlign: "center", marginBottom: "24px" }}>
            No credit card required
          </p>

          <div style={{ borderTop: "1px solid var(--border)", paddingTop: "24px", flex: 1 }}>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <CreditCard size={16} style={{ color: "var(--primary)" }} />
              <span>$15 billed monthly</span>
              <HelpCircle size={14} style={{ color: "var(--text-muted)", cursor: "help" }} />
            </p>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" }}>
              {starterFeatures.map((feature, idx) => (
                <li key={idx} style={{ fontSize: "14px", color: "var(--text-primary)", display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <Check size={16} style={{ color: "var(--success)", flexShrink: 0, marginTop: "2px" }} />
                  <span style={{ flex: 1 }}>{feature.text}</span>
                  <HelpCircle size={14} style={{ color: "var(--text-muted)", cursor: "help", flexShrink: 0 }} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Pro Card */}
        <div className="pricing-card popular" style={{
          background: "var(--surface)",
          borderRadius: "16px",
          border: "2px solid var(--primary)",
          padding: "32px",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          transform: "scale(1.02)",
          boxShadow: "0 0 40px rgba(139, 92, 246, 0.15)"
        }}>
          <div style={{
            position: "absolute",
            top: "-12px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "var(--primary)",
            color: "white",
            padding: "4px 16px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: 600
          }}>
            MOST POPULAR
          </div>

          <div style={{ marginBottom: "24px", marginTop: "8px" }}>
            <h3 style={{ fontSize: "24px", fontWeight: 600, marginBottom: "8px", color: "var(--text-primary)" }}>
              Pro
            </h3>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
              For professional creators, marketers, & teams
            </p>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
              <span style={{ fontSize: "48px", fontWeight: 700, color: "var(--text-primary)"}}>${billingInterval === "monthly" ? PLANS.pro.priceMonthly : Math.round(PLANS.pro.priceAnnual / 12)}</span>
              <span style={{ fontSize: "16px", color: "var(--text-secondary)" }}>USD/mo</span>
            </div>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
              {billingInterval === "annual" ? `${PLANS.pro.priceAnnual} billed annually` : "$208.80 billed annually"}
            </p>
          </div>

          <button 
            onClick={() => handleSubscribe("pro")}
            disabled={loadingPlan === "pro"}
            style={{
              width: "100%",
              padding: "14px 24px",
              background: "var(--primary)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: 600,
              cursor: loadingPlan === "pro" ? "not-allowed" : "pointer",
              marginBottom: "24px",
              transition: "background 0.2s",
              opacity: loadingPlan === "pro" ? 0.7 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            }}>
            {loadingPlan === "pro" ? <Loader2 size={20} className="animate-spin" /> : "Start your free trial"}
          </button>

          <p style={{ fontSize: "13px", color: "var(--text-muted)", textAlign: "center", marginBottom: "24px" }}>
            No credit card required
          </p>

          <div style={{ borderTop: "1px solid var(--border)", paddingTop: "24px", flex: 1 }}>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <CreditCard size={16} style={{ color: "var(--primary)" }} />
              <span>$208.8 billed annually</span>
              <HelpCircle size={14} style={{ color: "var(--text-muted)", cursor: "help" }} />
            </p>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" }}>
              {proFeatures.map((feature, idx) => (
                <li key={idx} style={{ fontSize: "14px", color: feature.text.includes("plus:") ? "var(--text-secondary)" : "var(--text-primary)", display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <Check size={16} style={{ color: "var(--success)", flexShrink: 0, marginTop: "2px" }} />
                  <span style={{ flex: 1 }}>{feature.text}</span>
                  {feature.tooltip && feature.text !== "Everything in Starter plan, plus:" && (
                    <HelpCircle size={14} style={{ color: "var(--text-muted)", cursor: "help", flexShrink: 0 }} />
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Business Card */}
        <div className="pricing-card" style={{
          background: "var(--surface)",
          borderRadius: "16px",
          border: "1px solid var(--border)",
          padding: "32px",
          position: "relative",
          display: "flex",
          flexDirection: "column"
        }}>
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ fontSize: "24px", fontWeight: 600, marginBottom: "8px", color: "var(--text-primary)" }}>
              Business
            </h3>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
              For organizations that need tailored solutions, API, and more
            </p>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
              <span style={{ fontSize: "48px", fontWeight: 700, color: "var(--text-primary)" }}>Custom</span>
            </div>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
              Pricing and packs tailored to your needs
            </p>
          </div>

          <button 
            onClick={() => handleContactClick("Business")}
            style={{
              width: "100%",
              padding: "14px 24px",
              background: "transparent",
              color: "var(--primary)",
              border: "2px solid var(--primary)",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: 600,
              cursor: "pointer",
              marginBottom: "24px",
              transition: "all 0.2s"
            }}>
            Contact us
          </button>

          <div style={{ borderTop: "1px solid var(--border)", paddingTop: "24px", flex: 1 }}>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Building2 size={16} style={{ color: "var(--primary)" }} />
              <span>Everything in the Pro plan, plus:</span>
            </p>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" }}>
              {businessFeatures.map((feature, idx) => (
                <li key={idx} style={{ fontSize: "14px", color: feature.text.includes("plus:") ? "var(--text-secondary)" : "var(--text-primary)", display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <Check size={16} style={{ color: "var(--success)", flexShrink: 0, marginTop: "2px" }} />
                  <span style={{ flex: 1 }}>{feature.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Enterprise Card */}
        <div className="pricing-card" style={{
          background: "var(--surface)",
          borderRadius: "16px",
          border: "1px solid var(--border)",
          padding: "32px",
          position: "relative",
          display: "flex",
          flexDirection: "column"
        }}>
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ fontSize: "24px", fontWeight: 600, marginBottom: "8px", color: "var(--text-primary)" }}>
              Enterprise
            </h3>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
              For large organizations that need tailored solutions
            </p>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
              <span style={{ fontSize: "48px", fontWeight: 700, color: "var(--text-primary)" }}>Custom</span>
            </div>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
              Pricing and packs tailored to your organization
            </p>
          </div>

          <button 
            onClick={() => handleContactClick("Enterprise")}
            style={{
              width: "100%",
              padding: "14px 24px",
              background: "transparent",
              color: "var(--primary)",
              border: "2px solid var(--primary)",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: 600,
              cursor: "pointer",
              marginBottom: "24px",
              transition: "all 0.2s"
            }}>
            Contact us
          </button>

          <div style={{ borderTop: "1px solid var(--border)", paddingTop: "24px", flex: 1 }}>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "16px" }}>
              Everything in Business plan, plus:
            </p>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" }}>
              <li style={{ fontSize: "14px", color: "var(--text-primary)", display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <Check size={16} style={{ color: "var(--success)", flexShrink: 0, marginTop: "2px" }} />
                <span>Large Corporation support</span>
              </li>
              <li style={{ fontSize: "14px", color: "var(--text-primary)", display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <Check size={16} style={{ color: "var(--success)", flexShrink: 0, marginTop: "2px" }} />
                <span>Dedicated account manager</span>
              </li>
              <li style={{ fontSize: "14px", color: "var(--text-primary)", display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <Check size={16} style={{ color: "var(--success)", flexShrink: 0, marginTop: "2px" }} />
                <span>Custom SLAs</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Trusted By Section */}
      <div style={{
        background: "var(--surface)",
        padding: "64px 48px",
        textAlign: "center"
      }}>
        <h2 style={{
          fontSize: "24px",
          fontWeight: 600,
          marginBottom: "8px",
          color: "var(--text-primary)"
        }}>
          Trusted by teams at
        </h2>
        <p style={{
          fontSize: "14px",
          color: "var(--text-secondary)",
          marginBottom: "40px"
        }}>
          Leading companies use our platform
        </p>
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "48px",
          flexWrap: "wrap"
        }}>
          {trustedBy.map((company, idx) => (
            <div key={idx} style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              opacity: 0.7,
              transition: "opacity 0.2s"
            }}>
              <span style={{ fontSize: "32px" }}>{company.logo}</span>
              <span style={{ fontSize: "18px", fontWeight: 500, color: "var(--text-secondary)" }}>
                {company.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div style={{ padding: "80px 48px", maxWidth: "900px", margin: "0 auto" }}>
        <h2 style={{
          fontSize: "32px",
          fontWeight: 700,
          textAlign: "center",
          marginBottom: "48px",
          color: "var(--text-primary)"
        }}>
          Frequently Asked Questions
        </h2>
        <div style={{ display: "grid", gap: "24px" }}>
          <FAQItem 
            question="Can I change plans later?"
            answer="Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and we'll prorate your billing."
          />
          <FAQItem 
            question="What payment methods do you accept?"
            answer="We accept all major credit cards, PayPal, and wire transfers for annual Enterprise plans."
          />
          <FAQItem 
            question="Is there a free trial?"
            answer="Yes! All plans come with a 14-day free trial. No credit card required to start."
          />
          <FAQItem 
            question="What happens if I run out of credits?"
            answer="You can purchase additional credit packs at any time, or upgrade to a higher plan for more monthly credits."
          />
          <FAQItem 
            question="Can I cancel my subscription?"
            answer="Yes, you can cancel anytime. Your access will continue until the end of your billing period."
          />
        </div>
      </div>

      {/* Quick Links Section */}
      <div style={{ padding: "0 48px 80px", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "24px"
        }}>
          <Link 
            href="/resources/pricing/enterprise"
            style={{
              display: "block",
              background: "var(--surface)",
              borderRadius: "12px",
              border: "1px solid var(--border)",
              padding: "24px",
              textDecoration: "none",
              transition: "border-color 0.2s"
            }}
          >
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "rgba(139, 92, 246, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px",
              color: "var(--primary)"
            }}>
              <Building2 size={24} />
            </div>
            <h3 style={{
              fontSize: "18px",
              fontWeight: 600,
              marginBottom: "8px",
              color: "var(--text-primary)"
            }}>
              Enterprise
            </h3>
            <p style={{
              fontSize: "14px",
              color: "var(--text-secondary)",
              marginBottom: "16px"
            }}>
              Custom solutions for large organizations with dedicated support.
            </p>
            <span style={{
              fontSize: "14px",
              fontWeight: 500,
              color: "var(--primary)"
            }}>
              Learn more →
            </span>
          </Link>

          <Link 
            href="/resources/pricing/compare"
            style={{
              display: "block",
              background: "var(--surface)",
              borderRadius: "12px",
              border: "1px solid var(--border)",
              padding: "24px",
              textDecoration: "none",
              transition: "border-color 0.2s"
            }}
          >
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "rgba(139, 92, 246, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px",
              color: "var(--primary)"
            }}>
              <Layers size={24} />
            </div>
            <h3 style={{
              fontSize: "18px",
              fontWeight: 600,
              marginBottom: "8px",
              color: "var(--text-primary)"
            }}>
              Compare Plans
            </h3>
            <p style={{
              fontSize: "14px",
              color: "var(--text-secondary)",
              marginBottom: "16px"
            }}>
              Side-by-side comparison of all features across our pricing plans.
            </p>
            <span style={{
              fontSize: "14px",
              fontWeight: 500,
              color: "var(--primary)"
            }}>
              View comparison →
            </span>
          </Link>

          <Link 
            href="/resources/pricing/faq"
            style={{
              display: "block",
              background: "var(--surface)",
              borderRadius: "12px",
              border: "1px solid var(--border)",
              padding: "24px",
              textDecoration: "none",
              transition: "border-color 0.2s"
            }}
          >
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "rgba(139, 92, 246, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px",
              color: "var(--primary)"
            }}>
              <HelpCircle size={24} />
            </div>
            <h3 style={{
              fontSize: "18px",
              fontWeight: 600,
              marginBottom: "8px",
              color: "var(--text-primary)"
            }}>
              Billing FAQ
            </h3>
            <p style={{
              fontSize: "14px",
              color: "var(--text-secondary)",
              marginBottom: "16px"
            }}>
              Answers to common questions about billing, payments, and plans.
            </p>
            <span style={{
              fontSize: "14px",
              fontWeight: 500,
              color: "var(--primary)"
            }}>
              Read FAQ →
            </span>
          </Link>
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "24px"
        }}>
          <div style={{
            background: "var(--surface)",
            borderRadius: "16px",
            border: "1px solid var(--border)",
            padding: "40px",
            maxWidth: "500px",
            width: "100%",
            maxHeight: "90vh",
            overflowY: "auto"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h3 style={{ fontSize: "24px", fontWeight: 600, color: "var(--text-primary)" }}>
                Contact Sales
              </h3>
              <button 
                onClick={() => setShowContactForm(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                  padding: "8px"
                }}
              >
                <X size={24} />
              </button>
            </div>

            {submitted ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: "rgba(16, 185, 129, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px"
                }}>
                  <Check size={32} style={{ color: "var(--success)" }} />
                </div>
                <h4 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "8px", color: "var(--text-primary)" }}>
                  Thank you!
                </h4>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                  We've received your message and will get back to you within 24 hours.
                </p>
                <button 
                  onClick={() => {
                    setShowContactForm(false);
                    setSubmitted(false);
                  }}
                  style={{
                    marginTop: "24px",
                    padding: "12px 24px",
                    background: "var(--primary)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 500,
                    cursor: "pointer"
                  }}
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "24px" }}>
                  Interested in <strong style={{ color: "var(--primary)" }}>{contactPlan}</strong> plan? 
                  Fill out the form below and we'll be in touch.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: 500, marginBottom: "8px", color: "var(--text-primary)" }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        background: "var(--background)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        color: "var(--text-primary)",
                        fontSize: "14px",
                        outline: "none"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: 500, marginBottom: "8px", color: "var(--text-primary)" }}>
                      Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@company.com"
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        background: "var(--background)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        color: "var(--text-primary)",
                        fontSize: "14px",
                        outline: "none"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: 500, marginBottom: "8px", color: "var(--text-primary)" }}>
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Your company"
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        background: "var(--background)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        color: "var(--text-primary)",
                        fontSize: "14px",
                        outline: "none"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: 500, marginBottom: "8px", color: "var(--text-primary)" }}>
                      Message *
                    </label>
                    <textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your needs..."
                      rows={4}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        background: "var(--background)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        color: "var(--text-primary)",
                        fontSize: "14px",
                        outline: "none",
                        resize: "vertical"
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      width: "100%",
                      padding: "14px 24px",
                      background: isSubmitting ? "var(--text-muted)" : "var(--primary)",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "16px",
                      fontWeight: 600,
                      cursor: isSubmitting ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      marginTop: "8px"
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        .pricing-card:hover {
          transform: translateY(-4px);
          transition: transform 0.3s ease;
        }
        .pricing-card.popular:hover {
          transform: scale(1.02) translateY(-4px);
        }
        input:focus, textarea:focus {
          border-color: var(--primary) !important;
        }
      `}</style>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{
      background: "var(--surface)",
      borderRadius: "12px",
      border: "1px solid var(--border)",
      overflow: "hidden"
    }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          padding: "20px 24px",
          background: "none",
          border: "none",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          textAlign: "left"
        }}
      >
        <span style={{ fontSize: "16px", fontWeight: 500, color: "var(--text-primary)" }}>
          {question}
        </span>
        <ChevronRight 
          size={20} 
          style={{ 
            color: "var(--text-secondary)",
            transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 0.2s"
          }} 
        />
      </button>
      {isOpen && (
        <div style={{ padding: "0 24px 20px" }}>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}
