"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Check, 
  X,
  HelpCircle,
  Sparkles,
  Zap,
  Users,
  Building2,
  Crown,
  CreditCard,
  Globe,
  Download,
  Wand2,
  FileText,
  MessageSquare,
  Shield,
  Layers,
  Clock,
  BarChart3,
  Share2
} from "lucide-react";

export default function ComparePlansPage() {
  const [showAnnual, setShowAnnual] = useState(true);

  const features = [
    {
      category: "Credits & Usage",
      items: [
        { name: "Monthly credits", starter: "150", pro: "300/mo equivalent", business: "Custom", enterprise: "Unlimited" },
        { name: "Additional credits", starter: "Paid add-ons", pro: "Paid add-ons", business: "Included in plan", enterprise: "Unlimited" },
        { name: "Video processing", starter: "Standard", pro: "Priority", business: "Priority +", enterprise: "Dedicated GPU" },
        { name: "Export quality", starter: "Up to 1080p", pro: "Up to 4K", business: "Up to 4K", enterprise: "Up to 8K" },
      ]
    },
    {
      category: "AI Features",
      items: [
        { name: "AI Clipping", starter: true, pro: true, business: true, enterprise: true },
        { name: "Virality Score", starter: true, pro: true, business: true, enterprise: true },
        { name: "AI Captions (20+ languages)", starter: true, pro: true, business: true, enterprise: true },
        { name: "AI B-roll", starter: false, pro: true, business: true, enterprise: true },
        { name: "AI Thumbnail", starter: false, pro: true, business: true, enterprise: true },
        { name: "Speech Enhancement", starter: false, pro: true, business: true, enterprise: true },
        { name: "Filler Word Removal", starter: true, pro: true, business: true, enterprise: true },
        { name: "Silence Removal", starter: true, pro: true, business: true, enterprise: true },
      ]
    },
    {
      category: "Platform & Publishing",
      items: [
        { name: "YouTube Shorts", starter: true, pro: true, business: true, enterprise: true },
        { name: "TikTok", starter: true, pro: true, business: true, enterprise: true },
        { name: "Instagram Reels", starter: true, pro: true, business: true, enterprise: true },
        { name: "Social accounts", starter: "3", pro: "6", business: "Unlimited", enterprise: "Unlimited" },
        { name: "Auto-post scheduling", starter: false, pro: true, business: true, enterprise: true },
        { name: "Export to Premiere Pro", starter: false, pro: true, business: true, enterprise: true },
        { name: "Export to DaVinci Resolve", starter: false, pro: true, business: true, enterprise: true },
        { name: "Custom aspect ratios", starter: false, pro: "Standard set", business: "Custom", enterprise: "Custom" },
      ]
    },
    {
      category: "Branding & Templates",
      items: [
        { name: "Brand templates", starter: "1", pro: "2", business: "Unlimited", enterprise: "Unlimited" },
        { name: "Custom fonts", starter: false, pro: true, business: true, enterprise: true },
        { name: "Custom colors", starter: "Basic", pro: "Full palette", business: "Custom palette", enterprise: "Custom palette" },
        { name: "Logo overlay", starter: true, pro: true, business: true, enterprise: true },
        { name: "Intro/outro templates", starter: false, pro: true, business: "Custom", enterprise: "Custom" },
        { name: "Custom vocabulary", starter: false, pro: false, business: true, enterprise: true },
      ]
    },
    {
      category: "Team & Collaboration",
      items: [
        { name: "Team seats", starter: "1", pro: "2", business: "Up to 10", enterprise: "Unlimited" },
        { name: "Role-based access", starter: false, pro: "Basic", business: "Full", enterprise: "Custom" },
        { name: "Team analytics", starter: false, pro: "Basic", business: "Advanced", enterprise: "Custom" },
        { name: "Shared templates", starter: false, pro: false, business: true, enterprise: true },
        { name: "Asset library", starter: false, pro: false, business: "Custom", enterprise: "Custom" },
      ]
    },
    {
      category: "Integrations & API",
      items: [
        { name: "API access", starter: false, pro: false, business: true, enterprise: "Full access" },
        { name: "Custom webhooks", starter: false, pro: false, business: true, enterprise: true },
        { name: "SSO (SAML/OAuth)", starter: false, pro: false, business: false, enterprise: true },
        { name: "Third-party integrations", starter: false, pro: false, business: "Built-in", enterprise: "Custom" },
        { name: "Private plugins", starter: false, pro: false, business: false, enterprise: true },
      ]
    },
    {
      category: "Support & Security",
      items: [
        { name: "Email support", starter: true, pro: true, business: true, enterprise: true },
        { name: "Chat support", starter: false, pro: "Standard", business: "Priority", enterprise: "24/7 Priority" },
        { name: "Dedicated account manager", starter: false, pro: false, business: true, enterprise: true },
        { name: "Slack channel", starter: false, pro: false, business: true, enterprise: true },
        { name: "Onboarding & training", starter: false, pro: false, business: "Basic", enterprise: "Full" },
        { name: "SOC 2 compliance", starter: false, pro: false, business: false, enterprise: true },
        { name: "Custom SLA", starter: false, pro: false, business: false, enterprise: true },
        { name: "Private cloud", starter: false, pro: false, business: false, enterprise: true },
      ]
    },
  ];

  const plans = [
    {
      name: "Starter",
      description: "For individual creators",
      price: { monthly: 15, annual: 15 },
      cta: "Start Free Trial",
      popular: false,
      link: "/resources/pricing"
    },
    {
      name: "Pro",
      description: "For professional creators & teams",
      price: { monthly: 29, annual: 17.40 },
      cta: "Start Free Trial",
      popular: true,
      link: "/resources/pricing"
    },
    {
      name: "Business",
      description: "For growing organizations",
      price: { monthly: "Custom", annual: "Custom" },
      cta: "Contact Sales",
      popular: false,
      link: "/resources/pricing/enterprise"
    },
    {
      name: "Enterprise",
      description: "For large organizations",
      price: { monthly: "Custom", annual: "Custom" },
      cta: "Contact Sales",
      popular: false,
      link: "/resources/pricing/enterprise"
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)" }}>
      {/* Back Link */}
      <Link 
        href="/resources/pricing"
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
        Back to Pricing
      </Link>

      {/* Header */}
      <div style={{ textAlign: "center", padding: "0 24px 48px" }}>
        <div style={{
          display: "inline-block",
          padding: "6px 16px",
          background: "rgba(139, 92, 246, 0.1)",
          borderRadius: "20px",
          marginBottom: "24px",
          border: "1px solid rgba(139, 92, 246, 0.2)"
        }}>
          <span style={{ color: "var(--primary)", fontSize: "14px", fontWeight: 500 }}>
            Compare Plans
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
          Choose the Right Plan
        </h1>
        <p style={{
          fontSize: "18px",
          color: "var(--text-secondary)",
          maxWidth: "600px",
          margin: "0 auto 32px",
          lineHeight: 1.6
        }}>
          Compare features across all plans to find the perfect fit for your needs.
        </p>

        {/* Billing Toggle */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "12px",
          background: "var(--surface)",
          padding: "6px 16px",
          borderRadius: "30px",
          border: "1px solid var(--border)"
        }}>
          <span style={{
            fontSize: "14px",
            fontWeight: 500,
            color: !showAnnual ? "var(--text-primary)" : "var(--text-secondary)"
          }}>
            Monthly
          </span>
          <button
            onClick={() => setShowAnnual(!showAnnual)}
            style={{
              width: "48px",
              height: "24px",
              borderRadius: "12px",
              background: "var(--primary)",
              border: "none",
              cursor: "pointer",
              position: "relative",
              transition: "background 0.2s"
            }}
          >
            <div style={{
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              background: "white",
              position: "absolute",
              top: "2px",
              left: showAnnual ? "26px" : "2px",
              transition: "left 0.2s"
            }} />
          </button>
          <span style={{
            fontSize: "14px",
            fontWeight: 500,
            color: showAnnual ? "var(--text-primary)" : "var(--text-secondary)"
          }}>
            Annual
          </span>
          <span style={{
            fontSize: "12px",
            padding: "2px 8px",
            background: "rgba(34, 197, 94, 0.1)",
            color: "var(--success)",
            borderRadius: "10px",
            fontWeight: 500
          }}>
            Save 20%
          </span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "0 48px 48px"
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          marginBottom: "48px"
        }}>
          {plans.map((plan, idx) => (
            <div key={idx} style={{
              background: "var(--surface)",
              borderRadius: "16px",
              border: plan.popular ? "2px solid var(--primary)" : "1px solid var(--border)",
              padding: "24px",
              position: "relative",
              transform: plan.popular ? "scale(1.02)" : "none",
              boxShadow: plan.popular ? "0 0 30px rgba(139, 92, 246, 0.15)" : "none"
            }}>
              {plan.popular && (
                <div style={{
                  position: "absolute",
                  top: "-10px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "var(--primary)",
                  color: "white",
                  padding: "4px 12px",
                  borderRadius: "12px",
                  fontSize: "11px",
                  fontWeight: 600
                }}>
                  POPULAR
                </div>
              )}
              <h3 style={{
                fontSize: "20px",
                fontWeight: 600,
                marginBottom: "4px",
                color: "var(--text-primary)"
              }}>
                {plan.name}
              </h3>
              <p style={{
                fontSize: "13px",
                color: "var(--text-secondary)",
                marginBottom: "16px"
              }}>
                {plan.description}
              </p>
              <div style={{ marginBottom: "16px" }}>
                {typeof plan.price.monthly === "number" ? (
                  <>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                      <span style={{ fontSize: "36px", fontWeight: 700, color: "var(--text-primary)" }}>
                        ${showAnnual ? plan.price.annual : plan.price.monthly}
                      </span>
                      <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>USD/mo</span>
                    </div>
                    {showAnnual && (
                      <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
                        ${Number(plan.price.annual) * 12} billed annually
                      </p>
                    )}
                  </>
                ) : (
                  <span style={{ fontSize: "36px", fontWeight: 700, color: "var(--text-primary)" }}>
                    Custom
                  </span>
                )}
              </div>
              <Link
                href={plan.link}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "10px 16px",
                  background: plan.popular ? "var(--primary)" : "transparent",
                  color: plan.popular ? "white" : "var(--primary)",
                  border: plan.popular ? "none" : "2px solid var(--primary)",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: 600,
                  textDecoration: "none",
                  textAlign: "center",
                  transition: "all 0.2s"
                }}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <div style={{
          background: "var(--surface)",
          borderRadius: "16px",
          border: "1px solid var(--border)",
          overflow: "hidden"
        }}>
          <div style={{
            overflowX: "auto"
          }}>
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "900px"
            }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  <th style={{
                    padding: "16px 24px",
                    textAlign: "left",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                    background: "var(--background)",
                    position: "sticky",
                    left: 0,
                    zIndex: 10,
                    minWidth: "200px"
                  }}>
                    Features
                  </th>
                  <th style={{
                    padding: "16px 24px",
                    textAlign: "center",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    background: "var(--background)",
                    minWidth: "140px"
                  }}>
                    Starter
                  </th>
                  <th style={{
                    padding: "16px 24px",
                    textAlign: "center",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "var(--primary)",
                    background: "rgba(139, 92, 246, 0.05)",
                    minWidth: "140px"
                  }}>
                    Pro
                  </th>
                  <th style={{
                    padding: "16px 24px",
                    textAlign: "center",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    background: "var(--background)",
                    minWidth: "140px"
                  }}>
                    Business
                  </th>
                  <th style={{
                    padding: "16px 24px",
                    textAlign: "center",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    background: "var(--background)",
                    minWidth: "140px"
                  }}>
                    Enterprise
                  </th>
                </tr>
              </thead>
              <tbody>
                {features.map((category, catIdx) => (
                  <>
                    <tr key={`category-${catIdx}`} style={{ background: "var(--background)" }}>
                      <td colSpan={5} style={{
                        padding: "12px 24px",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        borderTop: "1px solid var(--border)",
                        borderBottom: "1px solid var(--border)"
                      }}>
                        {category.category}
                      </td>
                    </tr>
                    {category.items.map((item, itemIdx) => (
                      <tr key={`${catIdx}-${itemIdx}`} style={{ borderBottom: "1px solid var(--border)" }}>
                        <td style={{
                          padding: "14px 24px",
                          fontSize: "14px",
                          color: "var(--text-secondary)",
                          position: "sticky",
                          left: 0,
                          background: "var(--surface)",
                          zIndex: 5
                        }}>
                          {item.name}
                        </td>
                        <td style={{
                          padding: "14px 24px",
                          textAlign: "center",
                          fontSize: "14px",
                          background: "var(--surface)"
                        }}>
                          {typeof item.starter === "boolean" ? (
                            item.starter ? (
                              <Check size={18} style={{ color: "var(--success)", margin: "0 auto" }} />
                            ) : (
                              <X size={18} style={{ color: "var(--text-muted)", margin: "0 auto" }} />
                            )
                          ) : (
                            <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>
                              {item.starter}
                            </span>
                          )}
                        </td>
                        <td style={{
                          padding: "14px 24px",
                          textAlign: "center",
                          fontSize: "14px",
                          background: "rgba(139, 92, 246, 0.03)"
                        }}>
                          {typeof item.pro === "boolean" ? (
                            item.pro ? (
                              <Check size={18} style={{ color: "var(--success)", margin: "0 auto" }} />
                            ) : (
                              <X size={18} style={{ color: "var(--text-muted)", margin: "0 auto" }} />
                            )
                          ) : (
                            <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>
                              {item.pro}
                            </span>
                          )}
                        </td>
                        <td style={{
                          padding: "14px 24px",
                          textAlign: "center",
                          fontSize: "14px",
                          background: "var(--surface)"
                        }}>
                          {typeof item.business === "boolean" ? (
                            item.business ? (
                              <Check size={18} style={{ color: "var(--success)", margin: "0 auto" }} />
                            ) : (
                              <X size={18} style={{ color: "var(--text-muted)", margin: "0 auto" }} />
                            )
                          ) : (
                            <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>
                              {item.business}
                            </span>
                          )}
                        </td>
                        <td style={{
                          padding: "14px 24px",
                          textAlign: "center",
                          fontSize: "14px",
                          background: "var(--surface)"
                        }}>
                          {typeof item.enterprise === "boolean" ? (
                            item.enterprise ? (
                              <Check size={18} style={{ color: "var(--success)", margin: "0 auto" }} />
                            ) : (
                              <X size={18} style={{ color: "var(--text-muted)", margin: "0 auto" }} />
                            )
                          ) : (
                            <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>
                              {item.enterprise}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FAQ Teaser */}
      <div style={{
        background: "var(--surface)",
        padding: "80px 48px",
        textAlign: "center"
      }}>
        <h2 style={{
          fontSize: "32px",
          fontWeight: 600,
          marginBottom: "16px",
          color: "var(--text-primary)"
        }}>
          Have Questions?
        </h2>
        <p style={{
          fontSize: "16px",
          color: "var(--text-secondary)",
          marginBottom: "32px",
          maxWidth: "500px",
          margin: "0 auto 32px"
        }}>
          Check out our billing FAQ for answers to common questions about pricing, payments, and plans.
        </p>
        <Link 
          href="/resources/pricing/faq"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "14px 32px",
            background: "var(--primary)",
            color: "white",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: 600,
            textDecoration: "none",
            transition: "background 0.2s"
          }}
        >
          View Billing FAQ
          <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}

function ChevronRight({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
