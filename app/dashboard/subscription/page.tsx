"use client";

import { useState } from "react";
import { 
  CreditCard, 
  Check, 
  Zap, 
  Crown, 
  Shield,
  ArrowRight,
  Clock,
  FileText,
  Download,
  Mail,
  ChevronRight
} from "lucide-react";

const plans = [
  {
    name: "Free",
    price: 0,
    period: "forever",
    description: "Perfect for getting started",
    features: [
      "5 video uploads per month",
      "10 AI clips per month",
      "Basic captions",
      "Standard quality exports",
      "Community support"
    ],
    notIncluded: [
      "AI thumbnails",
      "Priority processing",
      "Advanced analytics",
      "Brand templates"
    ],
    cta: "Current Plan",
    popular: false
  },
  {
    name: "Pro",
    price: 29,
    period: "month",
    description: "Best for content creators",
    features: [
      "50 video uploads per month",
      "200 AI clips per month",
      "AI-powered captions",
      "HD quality exports",
      "AI thumbnails",
      "Brand templates",
      "Priority processing",
      "Email support"
    ],
    notIncluded: [
      "Advanced analytics",
      "API access"
    ],
    cta: "Upgrade Now",
    popular: true
  },
  {
    name: "Business",
    price: 99,
    period: "month",
    description: "For teams and agencies",
    features: [
      "Unlimited video uploads",
      "Unlimited AI clips",
      "Advanced AI captions",
      "4K quality exports",
      "AI thumbnails",
      "Brand templates",
      "Priority processing",
      "Advanced analytics",
      "API access",
      "Team collaboration",
      "Dedicated support"
    ],
    notIncluded: [],
    cta: "Contact Sales",
    popular: false
  }
];

const billingHistory = [
  { id: 1, date: "Feb 1, 2026", amount: 29.00, status: "Paid", invoice: "INV-2026-0201" },
  { id: 2, date: "Jan 1, 2026", amount: 29.00, status: "Paid", invoice: "INV-2026-0101" },
  { id: 3, date: "Dec 1, 2025", amount: 29.00, status: "Paid", invoice: "INV-2025-1201" },
  { id: 4, date: "Nov 1, 2025", amount: 29.00, status: "Paid", invoice: "INV-2025-1101" },
];

export default function SubscriptionPage() {
  const [currentPlan] = useState("Pro");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  return (
    <div style={{ padding: "24px", maxWidth: "1400px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "white", marginBottom: "8px" }}>
          Subscription
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
          Manage your subscription and billing details
        </p>
      </div>

      {/* Current Plan Card */}
      <div style={{ 
        backgroundColor: "var(--surface)", 
        borderRadius: "16px", 
        padding: "24px",
        marginBottom: "32px",
        border: "1px solid var(--border)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <span style={{ 
                backgroundColor: "var(--primary)", 
                color: "white", 
                padding: "4px 12px", 
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "600"
              }}>
                {currentPlan} Plan
              </span>
              <span style={{ color: "var(--success)", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
                <Crown size={14} /> Active
              </span>
            </div>
            <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "white", marginBottom: "4px" }}>
              Pro Monthly
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
              Renews on March 1, 2026
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "32px", fontWeight: "bold", color: "white" }}>
              $29<span style={{ fontSize: "16px", color: "var(--text-secondary)", fontWeight: "normal" }}>/month</span>
            </div>
            <button style={{
              marginTop: "12px",
              backgroundColor: "var(--primary)",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              Manage Plan <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Usage Stats */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
          gap: "16px",
          marginTop: "24px",
          paddingTop: "24px",
          borderTop: "1px solid var(--border)"
        }}>
          <div>
            <p style={{ color: "var(--text-secondary)", fontSize: "12px", marginBottom: "4px" }}>Video Uploads</p>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ flex: 1, height: "8px", backgroundColor: "var(--border)", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ width: "68%", height: "100%", backgroundColor: "var(--primary)", borderRadius: "4px" }} />
              </div>
              <span style={{ color: "white", fontSize: "14px", fontWeight: "600" }}>34/50</span>
            </div>
          </div>
          <div>
            <p style={{ color: "var(--text-secondary)", fontSize: "12px", marginBottom: "4px" }}>AI Clips</p>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ flex: 1, height: "8px", backgroundColor: "var(--border)", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ width: "56%", height: "100%", backgroundColor: "var(--accent)", borderRadius: "4px" }} />
              </div>
              <span style={{ color: "white", fontSize: "14px", fontWeight: "600" }}>112/200</span>
            </div>
          </div>
          <div>
            <p style={{ color: "var(--text-secondary)", fontSize: "12px", marginBottom: "4px" }}>Storage</p>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ flex: 1, height: "8px", backgroundColor: "var(--border)", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ width: "42%", height: "100%", backgroundColor: "var(--success)", borderRadius: "4px" }} />
              </div>
              <span style={{ color: "white", fontSize: "14px", fontWeight: "600" }}>4.2/10 GB</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Plans */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "white" }}>Available Plans</h2>
          <div style={{ display: "flex", gap: "8px", backgroundColor: "var(--surface)", padding: "4px", borderRadius: "8px" }}>
            <button
              onClick={() => setBillingCycle("monthly")}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                fontWeight: "600",
                backgroundColor: billingCycle === "monthly" ? "var(--primary)" : "transparent",
                color: billingCycle === "monthly" ? "white" : "var(--text-secondary)"
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                fontWeight: "600",
                backgroundColor: billingCycle === "yearly" ? "var(--primary)" : "transparent",
                color: billingCycle === "yearly" ? "white" : "var(--text-secondary)"
              }}
            >
              Yearly <span style={{ fontSize: "10px", color: "var(--success)" }}>-20%</span>
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
          {plans.map((plan) => (
            <div key={plan.name} style={{ 
              backgroundColor: "var(--surface)", 
              borderRadius: "16px", 
              padding: "24px",
              border: plan.popular ? "2px solid var(--primary)" : "1px solid var(--border)",
              position: "relative"
            }}>
              {plan.popular && (
                <div style={{ 
                  position: "absolute", 
                  top: "-12px", 
                  left: "50%", 
                  transform: "translateX(-50%)",
                  backgroundColor: "var(--primary)",
                  color: "white",
                  padding: "4px 16px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "600"
                }}>
                  Most Popular
                </div>
              )}
              <div style={{ marginBottom: "16px" }}>
                <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "white", marginBottom: "4px" }}>{plan.name}</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "13px" }}>{plan.description}</p>
              </div>
              <div style={{ marginBottom: "24px" }}>
                <span style={{ fontSize: "40px", fontWeight: "bold", color: "white" }}>
                  ${billingCycle === "yearly" && plan.price > 0 ? (plan.price * 0.8).toFixed(0) : plan.price}
                </span>
                <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}>/{plan.period}</span>
              </div>
              <ul style={{ listStyle: "none", padding: 0, marginBottom: "24px" }}>
                {plan.features.map((feature, index) => (
                  <li key={index} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", color: "white", fontSize: "14px" }}>
                    <div style={{ 
                      width: "20px", 
                      height: "20px", 
                      borderRadius: "50%", 
                      backgroundColor: "var(--success)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0
                    }}>
                      <Check size={12} color="white" />
                    </div>
                    {feature}
                  </li>
                ))}
                {plan.notIncluded.map((feature, index) => (
                  <li key={index} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", color: "var(--text-secondary)", fontSize: "14px" }}>
                    <div style={{ 
                      width: "20px", 
                      height: "20px", 
                      borderRadius: "50%", 
                      backgroundColor: "var(--border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0
                    }}>
                      <span style={{ fontSize: "12px" }}>×</span>
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
              <button style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontWeight: "600",
                backgroundColor: plan.name === currentPlan ? "var(--border)" : "var(--primary)",
                color: plan.name === currentPlan ? "var(--text-secondary)" : "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px"
              }}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Method & Billing History */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "24px" }}>
        {/* Payment Method */}
        <div style={{ 
          backgroundColor: "var(--surface)", 
          borderRadius: "16px", 
          padding: "24px",
          border: "1px solid var(--border)"
        }}>
          <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "white", marginBottom: "20px" }}>
            Payment Method
          </h3>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "16px",
            padding: "16px",
            backgroundColor: "var(--background)",
            borderRadius: "12px",
            marginBottom: "16px"
          }}>
            <div style={{ 
              width: "48px", 
              height: "32px", 
              backgroundColor: "var(--primary)",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <CreditCard size={20} color="white" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ color: "white", fontWeight: "600" }}>Visa ending in 4242</p>
              <p style={{ color: "var(--text-secondary)", fontSize: "13px" }}>Expires 12/2027</p>
            </div>
            <button style={{
              padding: "8px 16px",
              backgroundColor: "transparent",
              border: "1px solid var(--border)",
              borderRadius: "6px",
              color: "white",
              cursor: "pointer",
              fontSize: "13px"
            }}>
              Update
            </button>
          </div>
        </div>

        {/* Billing History */}
        <div style={{ 
          backgroundColor: "var(--surface)", 
          borderRadius: "16px", 
          padding: "24px",
          border: "1px solid var(--border)"
        }}>
          <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "white", marginBottom: "20px" }}>
            Billing History
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {billingHistory.map((item) => (
              <div key={item.id} style={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "space-between",
                padding: "12px",
                backgroundColor: "var(--background)",
                borderRadius: "8px"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <FileText size={18} color="var(--text-secondary)" />
                  <div>
                    <p style={{ color: "white", fontSize: "14px", fontWeight: "500" }}>${item.amount.toFixed(2)}</p>
                    <p style={{ color: "var(--text-secondary)", fontSize: "12px" }}>{item.date}</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ 
                    color: "var(--success)", 
                    fontSize: "12px",
                    padding: "4px 8px",
                    backgroundColor: "rgba(34, 197, 94, 0.1)",
                    borderRadius: "4px"
                  }}>
                    {item.status}
                  </span>
                  <button style={{
                    padding: "6px 10px",
                    backgroundColor: "transparent",
                    border: "1px solid var(--border)",
                    borderRadius: "4px",
                    color: "var(--text-secondary)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "12px"
                  }}>
                    <Download size={12} /> Invoice
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button style={{
            width: "100%",
            marginTop: "16px",
            padding: "10px",
            backgroundColor: "transparent",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            color: "var(--text-secondary)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px"
          }}>
            View All Invoices <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
