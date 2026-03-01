"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  ChevronDown, 
  CreditCard, 
  RefreshCw, 
  Shield, 
  Clock,
  Mail,
  MessageSquare,
  Check,
  HelpCircle,
  DollarSign,
  Calendar,
  Lock,
  AlertCircle
} from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

export default function BillingFAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqCategories = [
    {
      title: "Billing & Payments",
      icon: <CreditCard size={20} />,
      items: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, and bank transfers for annual Enterprise plans. For Business and Enterprise customers, we also offer invoice-based billing with NET-30 terms."
        },
        {
          question: "Can I change my plan at any time?",
          answer: "Yes! You can upgrade or downgrade your plan at any time. When upgrading, you'll be prorated for the remainder of your billing cycle. When downgrading, the change takes effect at the end of your current billing period, and you'll retain access to your current features until then."
        },
        {
          question: "Do you offer refunds?",
          answer: "We offer a 14-day money-back guarantee for all new subscriptions. If you're not satisfied within the first 14 days, contact our support team for a full refund. After 14 days, we offer prorated refunds on annual plans on a case-by-case basis."
        },
        {
          question: "How does annual billing work?",
          answer: "Annual billing gives you a 20% discount compared to monthly billing. You'll be charged upfront for the full year, and your subscription will automatically renew annually. You can cancel anytime before the renewal date."
        },
        {
          question: "Will my credit card be charged automatically?",
          answer: "Yes, for monthly plans your credit card will be charged automatically on the same date each month. For annual plans, your card will be charged automatically at the end of your 12-month term unless you cancel."
        }
      ]
    },
    {
      title: "Credits & Usage",
      icon: <RefreshCw size={20} />,
      items: [
        {
          question: "What are credits and how are they used?",
          answer: "Credits are our virtual currency used to access AI features. Each AI operation (clip generation, caption creation, thumbnail generation) consumes credits. The number of credits required varies by feature - for example, basic clipping uses fewer credits than advanced AI features like B-roll insertion."
        },
        {
          question: "Do unused credits roll over?",
          answer: "Starter plans do not roll over unused credits to the next month. Pro and Business plans include monthly credit allocations that reset on your billing date. Annual plans provide all credits upfront. Contact Enterprise support for custom rollover options."
        },
        {
          question: "What happens when I run out of credits?",
          answer: "When you reach your credit limit, you can either wait for your next billing cycle or purchase additional credit packs. Additional credits are available at $10 per 100 credits for Starter/Pro plans, and custom pricing for Business/Enterprise."
        },
        {
          question: "Can I buy credits without a subscription?",
          answer: "No, credits are only available as part of our subscription plans. The credit allocation is included in your monthly or annual plan pricing."
        }
      ]
    },
    {
      title: "Security & Privacy",
      icon: <Shield size={20} />,
      items: [
        {
          question: "Is my payment information secure?",
          answer: "Absolutely. We use industry-standard SSL encryption for all payment transactions and never store your full credit card details on our servers. All payments are processed through Stripe, which is PCI DSS Level 1 certified - the highest level of security."
        },
        {
          question: "Do you store my credit card information?",
          answer: "We store only a secure token of your payment method for recurring billing. Your full credit card details are never stored on our systems. This token can be removed at any time from your account settings."
        },
        {
          question: "What is your data privacy policy?",
          answer: "We take privacy seriously. Your video content is processed and stored according to your plan's data retention settings. We never use your content for AI training without explicit consent. For Enterprise customers, we offer custom data processing agreements (DPAs) and GDPR compliance."
        }
      ]
    },
    {
      title: "Billing Cycles & Invoices",
      icon: <Calendar size={20} />,
      items: [
        {
          question: "When will I be charged?",
          answer: "For monthly plans, you're charged on the same date you started your subscription. For annual plans, you're charged upfront for the full year. You'll receive email reminders 7 days before each renewal."
        },
        {
          question: "How do I download my invoices?",
          answer: "You can download all your invoices from the Billing section in your account settings. Each invoice includes a detailed breakdown of your subscription, any additional credits purchased, and applicable taxes."
        },
        {
          question: "Can I get a receipt for my purchase?",
          answer: "Yes, receipts are automatically sent to your registered email after each charge. You can also find all past receipts in your account's Billing History section."
        },
        {
          question: "What if I need to update my billing information?",
          answer: "You can update your payment method anytime from your Account Settings > Billing section. Changes take effect immediately for the next billing cycle."
        }
      ]
    },
    {
      title: "Cancellations & Account",
      icon: <AlertCircle size={20} />,
      items: [
        {
          question: "How do I cancel my subscription?",
          answer: "You can cancel your subscription anytime from Account Settings > Billing > Cancel Subscription. Your access will continue until the end of your current billing period. We don't offer prorated refunds for partial months."
        },
        {
          question: "What happens to my data after cancellation?",
          answer: "After cancellation, your account enters a 30-day grace period where you can reactivate. After 30 days, your projects and content are deleted according to our data retention policy. You can export your data before cancellation."
        },
        {
          question: "Can I reactivate my account after canceling?",
          answer: "Yes! Within 30 days of cancellation, you can reactivate your account and restore all your data. Simply log in and select 'Reactivate Subscription'. After 30 days, you'll need to start a new account."
        },
        {
          question: "Do you offer pause functionality?",
          answer: "Yes, Business and Enterprise plans include the ability to pause your subscription for up to 90 days. During this time, you won't be charged, but your credits will not refresh. Starter and Pro plans do not include pause functionality."
        }
      ]
    }
  ];

  const contactOptions = [
    {
      icon: <Mail size={24} />,
      title: "Email Support",
      description: "Get help within 24 hours",
      action: "support@clipflow.com"
    },
    {
      icon: <MessageSquare size={24} />,
      title: "Live Chat",
      description: "Available 24/7 for Pro & Business",
      action: "Start Chat"
    },
    {
      icon: <HelpCircle size={24} />,
      title: "Help Center",
      description: "Browse articles and guides",
      action: "Visit Help Center"
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
            Billing FAQ
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
          Frequently Asked Questions
        </h1>
        <p style={{
          fontSize: "18px",
          color: "var(--text-secondary)",
          maxWidth: "600px",
          margin: "0 auto",
          lineHeight: 1.6
        }}>
          Find answers to common questions about billing, payments, and account management.
        </p>
      </div>

      {/* Search Bar */}
      <div style={{
        maxWidth: "600px",
        margin: "0 auto 48px",
        padding: "0 24px"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          padding: "16px 20px"
        }}>
          <HelpCircle size={20} style={{ color: "var(--text-muted)" }} />
          <input 
            type="text"
            placeholder="Search for answers..."
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              fontSize: "16px",
              color: "var(--text-primary)"
            }}
          />
          <div style={{
            padding: "4px 12px",
            background: "var(--background)",
            borderRadius: "6px",
            fontSize: "12px",
            color: "var(--text-muted)"
          }}>
            ⌘K
          </div>
        </div>
      </div>

      {/* FAQ Categories */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 48px 64px" }}>
        {faqCategories.map((category, catIdx) => (
          <div key={catIdx} style={{ marginBottom: "48px" }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "24px",
              paddingBottom: "16px",
              borderBottom: "1px solid var(--border)"
            }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "rgba(139, 92, 246, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--primary)"
              }}>
                {category.icon}
              </div>
              <h2 style={{
                fontSize: "20px",
                fontWeight: 600,
                color: "var(--text-primary)"
              }}>
                {category.title}
              </h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {category.items.map((item, itemIdx) => {
                const globalIndex = catIdx * 100 + itemIdx;
                const isOpen = openItems.includes(globalIndex);
                
                return (
                  <div 
                    key={itemIdx}
                    style={{
                      background: "var(--surface)",
                      borderRadius: "12px",
                      border: "1px solid var(--border)",
                      overflow: "hidden"
                    }}
                  >
                    <button
                      onClick={() => toggleItem(globalIndex)}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "20px 24px",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        textAlign: "left"
                      }}
                    >
                      <span style={{
                        fontSize: "15px",
                        fontWeight: 500,
                        color: "var(--text-primary)"
                      }}>
                        {item.question}
                      </span>
                      <ChevronDown 
                        size={20} 
                        style={{
                          color: "var(--text-muted)",
                          transform: isOpen ? "rotate(180deg)" : "rotate(0)",
                          transition: "transform 0.2s",
                          flexShrink: 0,
                          marginLeft: "16px"
                        }}
                      />
                    </button>
                    {isOpen && (
                      <div style={{
                        padding: "0 24px 20px",
                        borderTop: "1px solid var(--border)"
                      }}>
                        <p style={{
                          fontSize: "14px",
                          color: "var(--text-secondary)",
                          lineHeight: 1.7,
                          paddingTop: "16px"
                        }}>
                          {item.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div style={{
        background: "var(--surface)",
        padding: "80px 48px"
      }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2 style={{
            fontSize: "28px",
            fontWeight: 600,
            textAlign: "center",
            marginBottom: "16px",
            color: "var(--text-primary)"
          }}>
            Need More Help?
          </h2>
          <p style={{
            fontSize: "16px",
            textAlign: "center",
            color: "var(--text-secondary)",
            marginBottom: "48px"
          }}>
            Can't find the answer you're looking for? Our support team is here to help.
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "24px"
          }}>
            {contactOptions.map((option, idx) => (
              <div key={idx} style={{
                background: "var(--background)",
                borderRadius: "12px",
                border: "1px solid var(--border)",
                padding: "24px",
                textAlign: "center",
                cursor: "pointer",
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
                  margin: "0 auto 16px",
                  color: "var(--primary)"
                }}>
                  {option.icon}
                </div>
                <h3 style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  marginBottom: "4px",
                  color: "var(--text-primary)"
                }}>
                  {option.title}
                </h3>
                <p style={{
                  fontSize: "14px",
                  color: "var(--text-secondary)",
                  marginBottom: "16px"
                }}>
                  {option.description}
                </p>
                <span style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "var(--primary)"
                }}>
                  {option.action} →
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Compare Plans Teaser */}
      <div style={{
        padding: "80px 48px",
        textAlign: "center"
      }}>
        <h2 style={{
          fontSize: "28px",
          fontWeight: 600,
          marginBottom: "16px",
          color: "var(--text-primary)"
        }}>
          Compare Plans
        </h2>
        <p style={{
          fontSize: "16px",
          color: "var(--text-secondary)",
          marginBottom: "32px",
          maxWidth: "500px",
          margin: "0 auto 32px"
        }}>
          See a detailed comparison of features across all our plans.
        </p>
        <Link 
          href="/resources/pricing/compare"
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
          View Plan Comparison
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </Link>
      </div>
    </div>
  );
}
