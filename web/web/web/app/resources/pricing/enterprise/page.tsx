"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Check, 
  Building2, 
  Users, 
  Shield, 
  Zap, 
  Globe, 
  Clock,
  CreditCard,
  Headphones,
  FileText,
  Lock,
  BarChart3,
  Palette,
  Cloud,
  Server,
  MessageSquare,
  ChevronRight,
  Mail,
  Phone,
  Send
} from "lucide-react";

export default function EnterprisePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    employees: "",
    phone: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  const benefits = [
    {
      icon: <Users size={24} />,
      title: "Unlimited Team Seats",
      description: "Add as many team members as you need with no per-seat limits"
    },
    {
      icon: <Zap size={24} />,
      title: "Priority Processing",
      description: "Get faster processing times with dedicated infrastructure"
    },
    {
      icon: <Shield size={24} />,
      title: "Advanced Security",
      description: "SSO, SOC 2 compliance, and enterprise-grade data protection"
    },
    {
      icon: <Server size={24} />,
      title: "Custom API Access",
      description: "Full API access with custom rate limits and dedicated endpoints"
    },
    {
      icon: <Headphones size={24} />,
      title: "Dedicated Support",
      description: "24/7 priority support with dedicated account manager and Slack channel"
    },
    {
      icon: <CreditCard size={24} />,
      title: "Flexible Billing",
      description: "Custom billing cycles, net terms, and volume discounts"
    }
  ];

  const features = [
    {
      category: "Scale & Performance",
      items: [
        "Unlimited credits usage",
        "Unlimited team seats",
        "Unlimited brand templates",
        "Priority project processing",
        "Dedicated GPU rendering",
        "Custom output formats"
      ]
    },
    {
      category: "Integration & API",
      items: [
        "Full API access",
        "Custom webhook integrations",
        "SSO (SAML, OAuth)",
        "Custom integrations",
        "Adobe Premiere Pro plugin",
        "DaVinci Resolve plugin"
      ]
    },
    {
      category: "Security & Compliance",
      items: [
        "SOC 2 Type II compliance",
        "GDPR compliance",
        "Custom data retention policies",
        "Private cloud deployment",
        "On-premise options",
        "Advanced audit logs"
      ]
    },
    {
      category: "Support & Success",
      items: [
        "Dedicated account manager",
        "24/7 priority support",
        "Private Slack channel",
        "Onboarding & training",
        "Quarterly business reviews",
        "Custom SLAs"
      ]
    }
  ];

  const caseStudies = [
    {
      company: "MediaCorp",
      industry: "Broadcasting",
      result: "80% reduction in editing time",
      quote: "The enterprise solution transformed our workflow completely."
    },
    {
      company: "TechStream",
      industry: "Streaming Platform",
      result: "10x more clips produced",
      quote: "We went from manually clipping to automated viral content."
    },
    {
      company: "BrandForce",
      industry: "Marketing Agency",
      result: "50% cost savings",
      quote: "The ROI paid for itself within the first quarter."
    }
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

      {/* Hero Section */}
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
            Enterprise Solutions
          </span>
        </div>
        <h1 style={{
          fontSize: "56px",
          fontWeight: 700,
          marginBottom: "16px",
          background: "linear-gradient(135deg, #FFFFFF 0%, #A1A1AA 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        }}>
          Scale Without Limits
        </h1>
        <p style={{
          fontSize: "20px",
          color: "var(--text-secondary)",
          maxWidth: "700px",
          margin: "0 auto 40px",
          lineHeight: 1.6
        }}>
          Custom solutions for large organizations. Dedicated infrastructure, 
          advanced security, and personalized support to meet your enterprise needs.
        </p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
          <a 
            href="#contact"
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
            Contact Sales
            <ChevronRight size={16} />
          </a>
          <Link 
            href="/resources/pricing/compare"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "14px 32px",
              background: "transparent",
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: 600,
              textDecoration: "none",
              transition: "all 0.2s"
            }}
          >
            Compare Plans
          </Link>
        </div>
      </div>

      {/* Benefits Grid */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 48px 64px"
      }}>
        <h2 style={{
          fontSize: "32px",
          fontWeight: 600,
          textAlign: "center",
          marginBottom: "48px",
          color: "var(--text-primary)"
        }}>
          Enterprise Benefits
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "24px"
        }}>
          {benefits.map((benefit, idx) => (
            <div key={idx} style={{
              background: "var(--surface)",
              borderRadius: "16px",
              border: "1px solid var(--border)",
              padding: "32px",
              transition: "border-color 0.2s"
            }}>
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
                {benefit.icon}
              </div>
              <h3 style={{
                fontSize: "18px",
                fontWeight: 600,
                marginBottom: "8px",
                color: "var(--text-primary)"
              }}>
                {benefit.title}
              </h3>
              <p style={{
                fontSize: "14px",
                color: "var(--text-secondary)",
                lineHeight: 1.6
              }}>
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div style={{
        background: "var(--surface)",
        padding: "80px 48px"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 style={{
            fontSize: "32px",
            fontWeight: 600,
            textAlign: "center",
            marginBottom: "16px",
            color: "var(--text-primary)"
          }}>
            Everything You Need
          </h2>
          <p style={{
            fontSize: "16px",
            textAlign: "center",
            color: "var(--text-secondary)",
            marginBottom: "48px"
          }}>
            Comprehensive features designed for enterprise-scale operations
          </p>
          
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "32px"
          }}>
            {features.map((category, idx) => (
              <div key={idx}>
                <h3 style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  marginBottom: "16px",
                  color: "var(--text-primary)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  <div style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "var(--primary)"
                  }} />
                  {category.category}
                </h3>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" }}>
                  {category.items.map((item, itemIdx) => (
                    <li key={itemIdx} style={{
                      fontSize: "14px",
                      color: "var(--text-secondary)",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px"
                    }}>
                      <Check size={16} style={{ color: "var(--success)", flexShrink: 0, marginTop: "2px" }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Case Studies */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "80px 48px"
      }}>
        <h2 style={{
          fontSize: "32px",
          fontWeight: 600,
          textAlign: "center",
          marginBottom: "48px",
          color: "var(--text-primary)"
        }}>
          Trusted by Industry Leaders
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "24px"
        }}>
          {caseStudies.map((study, idx) => (
            <div key={idx} style={{
              background: "var(--surface)",
              borderRadius: "16px",
              border: "1px solid var(--border)",
              padding: "32px"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "16px"
              }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  background: "var(--primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: 700,
                  fontSize: "16px"
                }}>
                  {study.company.charAt(0)}
                </div>
                <div>
                  <h4 style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)" }}>
                    {study.company}
                  </h4>
                  <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                    {study.industry}
                  </p>
                </div>
              </div>
              <p style={{
                fontSize: "14px",
                color: "var(--text-secondary)",
                fontStyle: "italic",
                marginBottom: "16px",
                lineHeight: 1.6
              }}>
                "{study.quote}"
              </p>
              <div style={{
                padding: "12px 16px",
                background: "rgba(34, 197, 94, 0.1)",
                borderRadius: "8px",
                border: "1px solid rgba(34, 197, 94, 0.2)"
              }}>
                <p style={{ fontSize: "13px", color: "var(--success)", fontWeight: 600 }}>
                  {study.result}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Form */}
      <div id="contact" style={{
        background: "var(--surface)",
        padding: "80px 48px"
      }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h2 style={{
            fontSize: "32px",
            fontWeight: 600,
            textAlign: "center",
            marginBottom: "16px",
            color: "var(--text-primary)"
          }}>
            Get in Touch
          </h2>
          <p style={{
            fontSize: "16px",
            textAlign: "center",
            color: "var(--text-secondary)",
            marginBottom: "48px"
          }}>
            Ready to scale? Fill out the form below and our enterprise team will contact you within 24 hours.
          </p>

          {submitted ? (
            <div style={{
              background: "rgba(34, 197, 94, 0.1)",
              border: "1px solid rgba(34, 197, 94, 0.2)",
              borderRadius: "16px",
              padding: "48px",
              textAlign: "center"
            }}>
              <div style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: "var(--success)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px"
              }}>
                <Check size={32} color="white" />
              </div>
              <h3 style={{
                fontSize: "24px",
                fontWeight: 600,
                marginBottom: "8px",
                color: "var(--text-primary)"
              }}>
                Thank You!
              </h3>
              <p style={{
                fontSize: "16px",
                color: "var(--text-secondary)"
              }}>
                Our enterprise team will contact you within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{
              background: "var(--background)",
              borderRadius: "16px",
              border: "1px solid var(--border)",
              padding: "40px"
            }}>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "24px",
                marginBottom: "24px"
              }}>
                <div>
                  <label style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: 500,
                    marginBottom: "8px",
                    color: "var(--text-primary)"
                  }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      color: "var(--text-primary)",
                      fontSize: "14px"
                    }}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: 500,
                    marginBottom: "8px",
                    color: "var(--text-primary)"
                  }}>
                    Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      color: "var(--text-primary)",
                      fontSize: "14px"
                    }}
                    placeholder="john@company.com"
                  />
                </div>
              </div>
              
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "24px",
                marginBottom: "24px"
              }}>
                <div>
                  <label style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: 500,
                    marginBottom: "8px",
                    color: "var(--text-primary)"
                  }}>
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      color: "var(--text-primary)",
                      fontSize: "14px"
                    }}
                    placeholder="Acme Inc."
                  />
                </div>
                <div>
                  <label style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: 500,
                    marginBottom: "8px",
                    color: "var(--text-primary)"
                  }}>
                    Number of Employees
                  </label>
                  <select
                    value={formData.employees}
                    onChange={(e) => setFormData({ ...formData, employees: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      color: "var(--text-primary)",
                      fontSize: "14px"
                    }}
                  >
                    <option value="">Select...</option>
                    <option value="50-100">50-100</option>
                    <option value="100-500">100-500</option>
                    <option value="500-1000">500-1000</option>
                    <option value="1000+">1000+</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 500,
                  marginBottom: "8px",
                  color: "var(--text-primary)"
                }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "var(--text-primary)",
                    fontSize: "14px"
                  }}
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div style={{ marginBottom: "32px" }}>
                <label style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 500,
                  marginBottom: "8px",
                  color: "var(--text-primary)"
                }}>
                  How can we help?
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "var(--text-primary)",
                    fontSize: "14px",
                    resize: "vertical"
                  }}
                  placeholder="Tell us about your needs..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: "100%",
                  padding: "14px 24px",
                  background: "var(--primary)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: 600,
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  opacity: isSubmitting ? 0.7 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  transition: "background 0.2s"
                }}
              >
                {isSubmitting ? (
                  <>
                    <div style={{
                      width: "20px",
                      height: "20px",
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "white",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite"
                    }} />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Submit Request
                  </>
                )}
              </button>
            </form>
          )}

          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "48px",
            marginTop: "48px",
            paddingTop: "48px",
            borderTop: "1px solid var(--border)"
          }}>
            <div style={{ textAlign: "center" }}>
              <Mail size={24} style={{ color: "var(--primary)", marginBottom: "8px" }} />
              <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>enterprise@clipflow.com</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <Phone size={24} style={{ color: "var(--primary)", marginBottom: "8px" }} />
              <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>1-800-CLIPFLOW</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
