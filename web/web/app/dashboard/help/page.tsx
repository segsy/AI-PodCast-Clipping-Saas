"use client";

import { useState } from "react";
import { 
  HelpCircle, 
  Search, 
  MessageSquare, 
  Mail, 
  Phone, 
  ChevronDown,
  ChevronRight,
  FileText,
  ExternalLink,
  Clock,
  Send,
  Check,
  Zap,
  CreditCard,
  Upload,
  Film,
  Image,
  Users,
  AlertCircle
} from "lucide-react";

const faqCategories = [
  { id: "getting-started", name: "Getting Started", icon: Zap },
  { id: "account", name: "Account & Billing", icon: CreditCard },
  { id: "uploads", name: "Video Uploads", icon: Upload },
  { id: "clips", name: "Clip Generation", icon: Film },
  { id: "thumbnails", name: "AI Thumbnails", icon: Image },
  { id: "team", name: "Team & Collaboration", icon: Users },
];

const faqs = [
  {
    id: 1,
    category: "getting-started",
    question: "How do I get started with AI Podcast?",
    answer: "Getting started is easy! First, create an account and verify your email. Then, upload your first video or podcast recording. Our AI will automatically analyze your content and suggest clips, generate captions, and create thumbnails. You can also check out our Learning Center for step-by-step tutorials."
  },
  {
    id: 2,
    category: "getting-started",
    question: "What file formats are supported for uploads?",
    answer: "We support most common video and audio formats including MP4, MOV, AVI, MKV, MP3, WAV, and M4A. For best results, we recommend using MP4 or MOV files with H.264 encoding. Maximum file size is 10GB for Pro users and 25GB for Business users."
  },
  {
    id: 3,
    category: "getting-started",
    question: "How does the credit system work?",
    answer: "Credits are used to power our AI features. Different actions consume different amounts of credits: generating clips uses 5 credits per clip, AI captions use 5 credits per minute, and AI thumbnails use 10 credits per thumbnail. You can purchase credits or get monthly allowances with your subscription plan."
  },
  {
    id: 4,
    category: "account",
    question: "How do I upgrade or change my subscription plan?",
    answer: "To change your plan, go to Settings > Subscription and click 'Manage Plan'. You can upgrade to a higher tier immediately, or downgrade to a lower tier at the end of your billing cycle. Changes take effect immediately for upgrades, and you'll be credited for any unused time."
  },
  {
    id: 5,
    category: "account",
    question: "Can I get a refund if I'm not satisfied?",
    answer: "Yes! We offer a 14-day money-back guarantee for all new subscriptions. If you're not satisfied with our service, contact our support team within 14 days of your purchase for a full refund. After 14 days, we offer prorated refunds on annual plans on a case-by-case basis."
  },
  {
    id: 6,
    category: "account",
    question: "How do I update my payment method?",
    answer: "Go to Settings > Subscription > Payment Method. You can add a new credit card, update your existing card details, or remove payment methods. All transactions are secure and encrypted."
  },
  {
    id: 7,
    category: "uploads",
    question: "Why is my video upload taking so long?",
    answer: "Upload speed depends on your internet connection and video file size. For large files, we recommend using our desktop uploader for faster uploads. You can also use our browser extension to upload videos directly from platforms like YouTube or Vimeo."
  },
  {
    id: 8,
    category: "uploads",
    question: "What should I do if my upload fails?",
    answer: "First, check your internet connection and try again. If the issue persists, try: 1) Clear your browser cache, 2) Use a different browser, 3) Reduce the file size, 4) Disable any browser extensions. If still failing, contact support with your error message."
  },
  {
    id: 9,
    category: "clips",
    question: "How does AI clip generation work?",
    answer: "Our AI analyzes your video for engaging moments, speech patterns, and visual highlights. It identifies natural break points and creates shareable clips automatically. You can customize clip length, add captions, and apply brand templates before exporting."
  },
  {
    id: 10,
    category: "clips",
    question: "Can I manually edit the AI-generated clips?",
    answer: "Absolutely! After AI generates clips, you can: trim start/end points, adjust clip length, add custom captions, apply filters, add your logo/branding, and rearrange clips in the timeline. All edits are non-destructive and can be undone."
  },
  {
    id: 11,
    category: "thumbnails",
    question: "How do AI thumbnails work?",
    answer: "Our AI analyzes your video content and generates multiple thumbnail options using compelling imagery, text overlays, and design principles. You can customize colors, add your text, choose from different styles, and A/B test thumbnails to see which performs best."
  },
  {
    id: 12,
    category: "thumbnails",
    question: "Can I use my own images for thumbnails?",
    answer: "Yes! You can upload custom images from your device or select frames from your video. Our editor lets you crop, adjust, add text overlays, and apply filters to create the perfect thumbnail."
  },
  {
    id: 13,
    category: "team",
    question: "How do I invite team members?",
    answer: "Go to Settings > Team and click 'Invite Member'. Enter their email address and select a role (Admin, Editor, or Viewer). They'll receive an email to join your workspace. You can manage permissions and remove members at any time."
  },
  {
    id: 14,
    category: "team",
    question: "What roles can team members have?",
    answer: "Admins can manage billing, team members, and all settings. Editors can create, edit, and delete content. Viewers can only view content without making changes. You can customize role permissions on the Team settings page."
  }
];

const supportOptions = [
  {
    title: "Live Chat",
    description: "Chat with our support team in real-time",
    icon: MessageSquare,
    availability: "Available 24/7",
    action: "Start Chat"
  },
  {
    title: "Email Support",
    description: "Get detailed help via email",
    icon: Mail,
    availability: "Response within 24 hours",
    action: "Send Email"
  },
  {
    title: "Phone Support",
    description: "Speak with a support specialist",
    icon: Phone,
    availability: "Mon-Fri, 9am-6pm EST",
    action: "Schedule Call"
  }
];

export default function HelpCenterPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div style={{ padding: "24px", maxWidth: "1400px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "white", marginBottom: "8px" }}>
          Help Center
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
          Find answers to common questions or get in touch with our support team
        </p>
      </div>

      {/* Hero Search */}
      <div style={{ 
        backgroundColor: "var(--surface)", 
        borderRadius: "16px", 
        padding: "48px",
        marginBottom: "32px",
        border: "1px solid var(--border)",
        textAlign: "center"
      }}>
        <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "white", marginBottom: "8px" }}>
          How can we help you?
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "24px" }}>
          Search our knowledge base or browse by category
        </p>
        <div style={{ 
          position: "relative", 
          maxWidth: "600px",
          margin: "0 auto"
        }}>
          <Search 
            size={20} 
            style={{ 
              position: "absolute", 
              left: "20px", 
              top: "50%", 
              transform: "translateY(-50%)",
              color: "var(--text-secondary)"
            }} 
          />
          <input
            type="text"
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "16px 20px 16px 52px",
              backgroundColor: "var(--background)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              color: "white",
              fontSize: "16px",
              outline: "none"
            }}
          />
        </div>
      </div>

      {/* Support Options */}
      <div style={{ marginBottom: "40px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "white", marginBottom: "16px" }}>
          Contact Support
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" }}>
          {supportOptions.map((option, index) => (
            <div key={index} style={{ 
              backgroundColor: "var(--surface)", 
              borderRadius: "12px", 
              padding: "24px",
              border: "1px solid var(--border)",
              textAlign: "center"
            }}>
              <div style={{ 
                width: "56px", 
                height: "56px", 
                borderRadius: "14px",
                backgroundColor: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px"
              }}>
                <option.icon size={24} color="white" />
              </div>
              <h4 style={{ fontSize: "16px", fontWeight: "bold", color: "white", marginBottom: "8px" }}>
                {option.title}
              </h4>
              <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginBottom: "16px" }}>
                {option.description}
              </p>
              <p style={{ color: "var(--success)", fontSize: "12px", marginBottom: "16px", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                <Clock size={12} /> {option.availability}
              </p>
              <button style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "var(--primary)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600"
              }}>
                {option.action}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Categories */}
      <div style={{ marginBottom: "32px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "white", marginBottom: "16px" }}>
          Browse by Topic
        </h3>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveCategory("all")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 20px",
              backgroundColor: activeCategory === "all" ? "var(--primary)" : "var(--surface)",
              border: activeCategory === "all" ? "none" : "1px solid var(--border)",
              borderRadius: "10px",
              color: activeCategory === "all" ? "white" : "var(--text-secondary)",
              cursor: "pointer",
              fontWeight: "500"
            }}
          >
            <HelpCircle size={18} /> All Topics
          </button>
          {faqCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 20px",
                backgroundColor: activeCategory === category.id ? "var(--primary)" : "var(--surface)",
                border: activeCategory === category.id ? "none" : "1px solid var(--border)",
                borderRadius: "10px",
                color: activeCategory === category.id ? "white" : "var(--text-secondary)",
                cursor: "pointer",
                fontWeight: "500"
              }}
            >
              <category.icon size={18} /> {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div style={{ marginBottom: "40px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "white", marginBottom: "16px" }}>
          Frequently Asked Questions
          <span style={{ color: "var(--text-secondary)", fontSize: "14px", fontWeight: "normal", marginLeft: "8px" }}>
            ({filteredFaqs.length} questions)
          </span>
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filteredFaqs.map((faq) => (
            <div 
              key={faq.id} 
              style={{ 
                backgroundColor: "var(--surface)", 
                borderRadius: "12px", 
                border: "1px solid var(--border)",
                overflow: "hidden"
              }}
            >
              <button
                onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                style={{
                  width: "100%",
                  padding: "20px 24px",
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "16px"
                }}
              >
                <span style={{ 
                  color: "white", 
                  fontWeight: "600", 
                  fontSize: "15px",
                  textAlign: "left",
                  flex: 1
                }}>
                  {faq.question}
                </span>
                <ChevronDown 
                  size={20} 
                  color="var(--text-secondary)"
                  style={{
                    transform: expandedFaq === faq.id ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s",
                    flexShrink: 0
                  }}
                />
              </button>
              {expandedFaq === faq.id && (
                <div style={{ 
                  padding: "0 24px 20px", 
                  color: "var(--text-secondary)", 
                  fontSize: "14px",
                  lineHeight: 1.7
                }}>
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredFaqs.length === 0 && (
          <div style={{ 
            textAlign: "center", 
            padding: "48px",
            color: "var(--text-secondary)",
            backgroundColor: "var(--surface)",
            borderRadius: "12px",
            border: "1px solid var(--border)"
          }}>
            <AlertCircle size={48} style={{ marginBottom: "16px", opacity: 0.5 }} />
            <p>No FAQs found matching your search.</p>
            <p style={{ fontSize: "13px", marginTop: "8px" }}>Try a different search term or contact support.</p>
          </div>
        )}
      </div>

      {/* Contact Form */}
      <div style={{ 
        backgroundColor: "var(--surface)", 
        borderRadius: "16px", 
        padding: "32px",
        border: "1px solid var(--border)"
      }}>
        <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "white", marginBottom: "8px" }}>
          Still Need Help?
        </h3>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "24px" }}>
          Send us a message and we'll get back to you within 24 hours
        </p>
        
        {submitted ? (
          <div style={{ 
            textAlign: "center", 
            padding: "40px",
            backgroundColor: "var(--background)",
            borderRadius: "12px"
          }}>
            <div style={{ 
              width: "64px", 
              height: "64px", 
              borderRadius: "50%",
              backgroundColor: "var(--success)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px"
            }}>
              <Check size={32} color="white" />
            </div>
            <h4 style={{ fontSize: "18px", fontWeight: "bold", color: "white", marginBottom: "8px" }}>
              Message Sent!
            </h4>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
              We'll get back to you within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
              <input
                type="text"
                placeholder="Your Name"
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                required
                style={{
                  padding: "14px 16px",
                  backgroundColor: "var(--background)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "white",
                  fontSize: "14px",
                  outline: "none"
                }}
              />
              <input
                type="email"
                placeholder="Your Email"
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                required
                style={{
                  padding: "14px 16px",
                  backgroundColor: "var(--background)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "white",
                  fontSize: "14px",
                  outline: "none"
                }}
              />
            </div>
            <input
              type="text"
              placeholder="Subject"
              value={contactForm.subject}
              onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
              required
              style={{
                padding: "14px 16px",
                backgroundColor: "var(--background)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                color: "white",
                fontSize: "14px",
                outline: "none"
              }}
            />
            <textarea
              placeholder="Describe your issue or question..."
              value={contactForm.message}
              onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
              required
              rows={5}
              style={{
                padding: "14px 16px",
                backgroundColor: "var(--background)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                color: "white",
                fontSize: "14px",
                outline: "none",
                resize: "vertical"
              }}
            />
            <button 
              type="submit"
              style={{
                padding: "14px 24px",
                backgroundColor: "var(--primary)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                alignSelf: "flex-start"
              }}
            >
              <Send size={18} /> Send Message
            </button>
          </form>
        )}
      </div>

      {/* Additional Resources */}
      <div style={{ marginTop: "40px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
        <div style={{ 
          backgroundColor: "var(--surface)", 
          borderRadius: "12px", 
          padding: "24px",
          border: "1px solid var(--border)"
        }}>
          <h4 style={{ fontSize: "16px", fontWeight: "bold", color: "white", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
            <FileText size={20} color="var(--primary)" /> Documentation
          </h4>
          <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginBottom: "16px" }}>
            Detailed documentation for all features and integrations
          </p>
          <a href="#" style={{ color: "var(--primary)", fontSize: "14px", display: "flex", alignItems: "center", gap: "4px", textDecoration: "none" }}>
            View Documentation <ExternalLink size={14} />
          </a>
        </div>
        <div style={{ 
          backgroundColor: "var(--surface)", 
          borderRadius: "12px", 
          padding: "24px",
          border: "1px solid var(--border)"
        }}>
          <h4 style={{ fontSize: "16px", fontWeight: "bold", color: "white", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Zap size={20} color="var(--primary)" /> Status Page
          </h4>
          <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginBottom: "16px" }}>
            Check the current status of our services and uptime
          </p>
          <a href="#" style={{ color: "var(--primary)", fontSize: "14px", display: "flex", alignItems: "center", gap: "4px", textDecoration: "none" }}>
            View Status <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
