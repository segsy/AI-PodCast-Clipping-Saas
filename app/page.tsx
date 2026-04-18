"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  signInWithGoogle,
  signInWithGitHub,
  signInWithEmail,
  signUp
} from "@/lib/auth-client";
import {
  Zap,
  Play,
  Scissors,
  Type,
  Maximize2,
  Calendar,
  ArrowRight,
  Star,
  ChevronDown,
  Layout,
  FileText,
  Users,
  Building2,
  Mic,
  Video,
  Target,
  Church,
  ShoppingCart,
  Home,
  BarChart3,
  Folder,
  BookOpen,
  Clock,
  FileCode,
  UserCircle,
  Image,
  Upload,
  Layers,
  CreditCard,
  Receipt,
  DollarSign,
  Briefcase,
  Handshake,
  LinkIcon,
  Sparkles,
  Grid,
  Box,
  Megaphone,
  Headphones,
  Building,
  Store,
  TrendingUp,
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Wand2,
  Volume2,
  Film,
  Music,
  Mic2,
  Crop,
  Palette,
  Monitor,
  Repeat,
  Workflow,
  Bot,
  Gauge,
  Rocket,
  Menu
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [featuresMenuOpen, setFeaturesMenuOpen] = useState(false);
  const [solutionsMenuOpen, setSolutionsMenuOpen] = useState(false);
  const [resourcesMenuOpen, setResourcesMenuOpen] = useState(false);
  const [pricingMenuOpen, setPricingMenuOpen] = useState(false);
  const [businessMenuOpen, setBusinessMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modal state for each feature
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Prevent modal from showing on initial render (SSR/hydration fix)
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Form state
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formName, setFormName] = useState("");
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  // Form handlers
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);

    try {
      if (authMode === "signup") {
        const result = await signUp(formEmail, formPassword, formName);
        if (result.error) {
          setFormError(result.error.message);
        } else {
          // Success - redirect to dashboard
          router.push("/dashboard");
        }
      } else {
        const result = await signInWithEmail(formEmail, formPassword);
        if (result.error) {
          setFormError(result.error.message);
        } else {
          // Success - redirect to dashboard
          router.push("/dashboard");
        }
      }
    } catch (err: any) {
      setFormError(err.message || "An unexpected error occurred");
    } finally {
      setFormLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setFormLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setFormError("Failed to sign in with Google");
      setFormLoading(false);
    }
  };

  const handleGitHubSignIn = async () => {
    setFormLoading(true);
    try {
      await signInWithGitHub();
    } catch (err) {
      setFormError("Failed to sign in with GitHub");
      setFormLoading(false);
    }
  };

  const features = [
    {
      icon: Scissors,
      title: "ClipAnything",
      description: "Turn any video into viral shorts automatically"
    },
    {
      icon: Type,
      title: "Animated Captions",
      description: "Beautiful captions that boost engagement"
    },
    {
      icon: Maximize2,
      title: "AI Reframe",
      description: "Resize for any platform in one click"
    },
    {
      icon: Calendar,
      title: "Social Scheduler",
      description: "Schedule posts across all platforms"
    }
  ];

  const featuresMenuItems = [
    { name: "ClipAnything", href: "/features/clipanything", description: "The fastest way to turn any video into viral shorts", icon: Scissors },
    { name: "Animated Captions", href: "/features/animated-captions", description: "The fastest way to add animated captions", icon: Type },
    { name: "AI Reframe", href: "/features/ai-reframe", description: "Resize any video for every platform in 1 click", icon: Maximize2 },
    { name: "AI B-Roll", href: "/features/ai-broll", description: "Get relevant AI B-Roll in 1 click, under 1 minute", icon: Video },
    { name: "Social Scheduler", href: "/features/social-scheduler", description: "Schedule a month's post to all platforms in 10 minutes", icon: Calendar },
    { name: "Brand Template", href: "/features/brand-template", description: "Easily create and add brand templates in 1 click", icon: Layout },
    { name: "Editor", href: "/features/editor", description: "All-in-one AI editor. No editing skills required", icon: Sparkles },
    { name: "Export to XML", href: "/features/export-xml", description: "Export clips with XML for professional workflows", icon: FileCode },
    { name: "Team Workspace", href: "/features/team-workspace", description: "Maximize your team's productivity with AI", icon: Users },
    { name: "Thumbnail Generator", href: "/features/thumbnail-generator", description: "Drop a link & get YouTube thumbnail in 1 click", icon: Image },
  ];

  const solutionsMenuItems = [
    { name: "Creators", href: "/solutions?tab=creators", description: "Fastest way to gain your next 1 million views without burnout", icon: UserCircle },
    { name: "Media & Entertainment", href: "/solutions?tab=media", description: "Streamline video creation workflow & reach 10x more audiences", icon: Video },
    { name: "Marketers", href: "/solutions?tab=marketers", description: "Make every marketer a pro video editor", icon: Megaphone },
    { name: "Podcasters", href: "/solutions?tab=podcasters", description: "Get your next 1 million views in weeks via consistent posting", icon: Headphones },
    { name: "Agencies", href: "/solutions?tab=agencies", description: "Scale your business and save $2,700 monthly on editing cost", icon: Building2 },
    { name: "Livestreamers", href: "/solutions?tab=livestreamers", description: "Drive more traffic back to your livestreams through shorts", icon: Play },
    { name: "Advertisers", href: "/solutions?tab=advertisers", description: "Create high-performing ad creatives at scale", icon: TrendingUp },
    { name: "Church", href: "/solutions?tab=church", description: "Evangelize digitally to reach more people & get more donations", icon: Church },
    { name: "E-commerce", href: "/solutions?tab=ecommerce", description: "Sell more products & increase exposure with viral shorts", icon: ShoppingCart },
    { name: "Real Estate", href: "/solutions?tab=realestate", description: "Get more leads through shorts to become the top-selling realtor", icon: Home },
  ];

  const resourcesMenuItems = [
    { name: "Customer Stories", href: "/resources/customer-stories", icon: Users },
    { name: "Learning Center", href: "/resources/learning-center", icon: BookOpen },
    { name: "Product Changelog", href: "/resources/changelog", icon: Clock },
    { name: "Blog", href: "/resources/blog", icon: FileText },
    { name: "Help Center", href: "/resources/help-center", icon: Folder },
  ];

  const caseStudyItems = [
    { name: "How OPusClip helps marketing agencies boost revenue by 150%", href: "/resources/case-studies/marketing-agencies", image: "marketing" },
    { name: "How creators are earning 10M+ views in 1 month using video clipping", href: "/resources/case-studies/creators-views", image: "creators" },
  ];

  const pricingMenuItems = [
    { name: "Pricing Plans", href: "/resources/pricing", description: "Choose the plan that fits your needs", icon: CreditCard },
    { name: "Enterprise", href: "/resources/pricing/enterprise", description: "Custom solutions for large teams", icon: Building2 },
    { name: "Compare Plans", href: "/resources/pricing/compare", description: "See all features side by side", icon: Receipt },
    { name: "Billing FAQ", href: "/resources/pricing/faq", description: "Common billing questions answered", icon: DollarSign },
  ];

  const businessMenuItems = [
    { name: "For Agencies", href: "/solutions?tab=agencies", description: "Scale your agency with AI-powered video", icon: Briefcase },
    { name: "For Enterprise", href: "/solutions?tab=enterprise", description: "Custom integration and support", icon: Building },
    { name: "For Media Companies", href: "/solutions?tab=media", description: "Streamline your production workflow", icon: Video },
    { name: "API Access", href: "/resources/api", description: "Build with OPusClip's powerful API", icon: LinkIcon },
    { name: "Partner Program", href: "/resources/partners", description: "Join our partner network", icon: Handshake },
  ];

  const stats = [
    { value: "10M+", label: "Clips Created" },
    { value: "500K+", label: "Active Users" },
    { value: "50M+", label: "Views Generated" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">AI Podcast</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {/* Features Dropdown */}
              <div className="relative h-16">
                <button
                  onClick={() => { setFeaturesMenuOpen(!featuresMenuOpen); setSolutionsMenuOpen(false); setResourcesMenuOpen(false); setPricingMenuOpen(false); setBusinessMenuOpen(false); }}
                  className="flex items-center gap-1 text-text-secondary hover:text-white transition-colors h-16 px-2"
                >
                  Features
                  <ChevronDown className={`w-4 h-4 transition-transform ${featuresMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {featuresMenuOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: '0',
                      marginTop: '8px',
                      width: '320px',
                      backgroundColor: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      padding: '8px',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                      zIndex: 100
                    }}
                  >
                    {featuresMenuItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setFeaturesMenuOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px',
                          borderRadius: '8px',
                          textDecoration: 'none'
                        }}
                        className="hover:bg-background transition-colors"
                      >
                        <item.icon size={20} style={{ color: 'var(--primary)' }} />
                        <div>
                          <div style={{ fontWeight: 500, color: 'white', marginBottom: '4px' }}>{item.name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{item.description}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Solutions Dropdown */}
              <div className="relative h-16">
                <button
                  onClick={() => { setSolutionsMenuOpen(!solutionsMenuOpen); setFeaturesMenuOpen(false); setResourcesMenuOpen(false); setPricingMenuOpen(false); setBusinessMenuOpen(false); }}
                  className="flex items-center gap-1 text-text-secondary hover:text-white transition-colors h-16 px-2"
                >
                  Solutions
                  <ChevronDown className={`w-4 h-4 transition-transform ${solutionsMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {solutionsMenuOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: '0',
                      marginTop: '8px',
                      width: '320px',
                      backgroundColor: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      padding: '8px',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                      zIndex: 100
                    }}
                  >
                    {solutionsMenuItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setSolutionsMenuOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px',
                          borderRadius: '8px',
                          textDecoration: 'none'
                        }}
                        className="hover:bg-background transition-colors"
                      >
                        <item.icon size={20} style={{ color: 'var(--primary)' }} />
                        <div>
                          <div style={{ fontWeight: 500, color: 'white', marginBottom: '4px' }}>{item.name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{item.description}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Resources Dropdown */}
              <div className="relative h-16">
                <button
                  onClick={() => { setResourcesMenuOpen(!resourcesMenuOpen); setFeaturesMenuOpen(false); setSolutionsMenuOpen(false); setPricingMenuOpen(false); setBusinessMenuOpen(false); }}
                  className="flex items-center gap-1 text-text-secondary hover:text-white transition-colors h-16 px-2"
                >
                  Resources
                  <ChevronDown className={`w-4 h-4 transition-transform ${resourcesMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {resourcesMenuOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: '0',
                      marginTop: '8px',
                      width: '280px',
                      backgroundColor: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      padding: '8px',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                      zIndex: 100
                    }}
                  >
                    {resourcesMenuItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setResourcesMenuOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px',
                          borderRadius: '8px',
                          textDecoration: 'none'
                        }}
                        className="hover:bg-background transition-colors"
                      >
                        <item.icon size={20} style={{ color: 'var(--primary)' }} />
                        <span style={{ color: 'white', fontWeight: 500 }}>{item.name}</span>
                      </Link>
                    ))}
                    <div style={{ borderTop: '1px solid var(--border)', margin: '8px 0' }} />
                    <div style={{ padding: '8px 12px', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 500 }}>CASE STUDIES</div>
                    {caseStudyItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setResourcesMenuOpen(false)}
                        style={{
                          display: 'block',
                          padding: '12px',
                          borderRadius: '8px',
                          textDecoration: 'none'
                        }}
                        className="hover:bg-background transition-colors"
                      >
                        <div style={{ fontWeight: 500, color: 'white', marginBottom: '4px', fontSize: '13px' }}>{item.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Click to read success story</div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Pricing Dropdown */}
              <div className="relative h-16">
                <button
                  onClick={() => { setPricingMenuOpen(!pricingMenuOpen); setFeaturesMenuOpen(false); setSolutionsMenuOpen(false); setResourcesMenuOpen(false); setBusinessMenuOpen(false); }}
                  className="flex items-center gap-1 text-text-secondary hover:text-white transition-colors h-16 px-2"
                >
                  Pricing
                  <ChevronDown className={`w-4 h-4 transition-transform ${pricingMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {pricingMenuOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: '0',
                      marginTop: '8px',
                      width: '280px',
                      backgroundColor: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      padding: '8px',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                      zIndex: 100
                    }}
                  >
                    {pricingMenuItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setPricingMenuOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px',
                          borderRadius: '8px',
                          textDecoration: 'none'
                        }}
                        className="hover:bg-background transition-colors"
                      >
                        <item.icon size={20} style={{ color: 'var(--primary)' }} />
                        <div>
                          <div style={{ fontWeight: 500, color: 'white', marginBottom: '4px' }}>{item.name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{item.description}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* For Business Dropdown */}
              <div className="relative h-16">
                <button
                  onClick={() => { setBusinessMenuOpen(!businessMenuOpen); setFeaturesMenuOpen(false); setSolutionsMenuOpen(false); setResourcesMenuOpen(false); setPricingMenuOpen(false); }}
                  className="flex items-center gap-1 text-text-secondary hover:text-white transition-colors h-16 px-2"
                >
                  For Business
                  <ChevronDown className={`w-4 h-4 transition-transform ${businessMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {businessMenuOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: '0',
                      marginTop: '8px',
                      width: '300px',
                      backgroundColor: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      padding: '8px',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                      zIndex: 100
                    }}
                  >
                    {businessMenuItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setBusinessMenuOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px',
                          borderRadius: '8px',
                          textDecoration: 'none'
                        }}
                        className="hover:bg-background transition-colors"
                      >
                        <item.icon size={20} style={{ color: 'var(--primary)' }} />
                        <div>
                          <div style={{ fontWeight: 500, color: 'white', marginBottom: '4px' }}>{item.name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{item.description}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-text-secondary hover:text-white transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => { console.log('[Auth] Sign In button clicked'); setAuthMode("signin"); setAuthModalOpen(true); }}
                className="text-text-secondary hover:text-white transition-colors font-medium"
              >
                Sign In
              </button>
              <button 
                onClick={() => { console.log('[Auth] Get Started button clicked'); setAuthMode("signup"); setAuthModalOpen(true); }}
                className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-md md:hidden">
          <div className="pt-16 pb-6 px-4 overflow-y-auto h-full">
            <div className="max-w-md mx-auto space-y-6">

              {/* Features Section */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Features</h3>
                <div className="space-y-2">
                  {featuresMenuItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface transition-colors"
                    >
                      <item.icon size={20} style={{ color: 'var(--primary)' }} />
                      <div>
                        <div className="font-medium text-white">{item.name}</div>
                        <div className="text-sm text-text-secondary">{item.description}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Solutions Section */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Solutions</h3>
                <div className="space-y-2">
                  {solutionsMenuItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface transition-colors"
                    >
                      <item.icon size={20} style={{ color: 'var(--primary)' }} />
                      <div>
                        <div className="font-medium text-white">{item.name}</div>
                        <div className="text-sm text-text-secondary">{item.description}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Resources Section */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
                <div className="space-y-2">
                  {resourcesMenuItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface transition-colors"
                    >
                      <item.icon size={20} style={{ color: 'var(--primary)' }} />
                      <span className="font-medium text-white">{item.name}</span>
                    </Link>
                  ))}
                  <div className="pt-2 border-t border-border">
                    <div className="text-sm font-medium text-text-secondary mb-2">CASE STUDIES</div>
                    {caseStudyItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block p-3 rounded-lg hover:bg-surface transition-colors"
                      >
                        <div className="font-medium text-white text-sm">{item.name}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pricing Section */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Pricing</h3>
                <div className="space-y-2">
                  {pricingMenuItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface transition-colors"
                    >
                      <item.icon size={20} style={{ color: 'var(--primary)' }} />
                      <div>
                        <div className="font-medium text-white">{item.name}</div>
                        <div className="text-sm text-text-secondary">{item.description}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Business Section */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">For Business</h3>
                <div className="space-y-2">
                  {businessMenuItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface transition-colors"
                    >
                      <item.icon size={20} style={{ color: 'var(--primary)' }} />
                      <div>
                        <div className="font-medium text-white">{item.name}</div>
                        <div className="text-sm text-text-secondary">{item.description}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Auth Buttons */}
              <div className="pt-6 border-t border-border space-y-3">
                <button
                  onClick={() => { setAuthMode("signin"); setAuthModalOpen(true); setMobileMenuOpen(false); }}
                  className="w-full text-text-secondary hover:text-white transition-colors font-medium py-2"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setAuthMode("signup"); setAuthModalOpen(true); setMobileMenuOpen(false); }}
                  className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Turn Your Podcast Into
              <span className="text-primary"> Viral Shorts</span>
            </h1>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-10">
              AI-powered video clipping that helps you reach millions of new viewers. 
              No editing skills required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/dashboard" 
                className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-2"
              >
                Start Clipping Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/features/clipanything" 
                className="w-full sm:w-auto bg-surface hover:bg-surface-hover border border-border text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                See How It Works
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-text-secondary">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-2xl p-8 border border-purple-500/20">
              <div className="text-sm text-purple-400 mb-2">CASE STUDY</div>
              <h3 className="text-2xl font-bold text-white mb-4">How Marketing Agencies Boost Revenue by 150%</h3>
              <p className="text-text-secondary mb-6">Learn how agencies are using AI Podcast Clipper to scale their content production and increase client revenue.</p>
              <Link href="/resources/case-studies/marketing-agencies" className="text-primary hover:text-primary-hover font-medium flex items-center gap-2">
                Read Case Study <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 rounded-2xl p-8 border border-blue-500/20">
              <div className="text-sm text-blue-400 mb-2">CASE STUDY</div>
              <h3 className="text-2xl font-bold text-white mb-4">Creators Earning 10M+ Views in 1 Month</h3>
              <p className="text-text-secondary mb-6">Discover how top creators are leveraging video clipping to reach millions of new viewers.</p>
              <Link href="/resources/case-studies/creators-views" className="text-primary hover:text-primary-hover font-medium flex items-center gap-2">
                Read Case Study <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: AI Video Clipping Tool */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              #1 AI VIDEO CLIPPING TOOL
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-4">
              1 long video, 10 viral clips. Create 10x faster.
            </p>
            <p className="text-lg text-text-secondary">
              Podcast Clipper turns long videos into shorts, and publishes them to all social platforms in one click.
            </p>
          </div>

          {/* AI Features Tabs */}
          <div className="mb-12">
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {[
                { icon: Scissors, label: "AI Clipping", active: true },
                { icon: Type, label: "AI Captioning", active: false },
                { icon: Crop, label: "AI Reframe", active: false },
                { icon: Film, label: "AI B-Roll", active: false },
                { icon: Volume2, label: "AI Audio Enhance", active: false },
                { icon: Mic2, label: "AI Voice-Over", active: false },
              ].map((tab, index) => (
                <button
                  key={index}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    tab.active 
                      ? 'bg-primary text-white' 
                      : 'bg-background text-text-secondary hover:text-white hover:bg-background-hover'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* AI Features Cards with Video Placeholders */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                icon: Scissors, 
                title: "AI Clipping", 
                description: "Automatically detect and extract the most engaging moments from your videos",
                video: "clipping",
                image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=250&fit=crop"
              },
              { 
                icon: Type, 
                title: "AI Captioning", 
                description: "Generate accurate captions with keyword highlighting and emojis",
                video: "captioning",
                image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=250&fit=crop"
              },
              { 
                icon: Crop, 
                title: "AI Reframe", 
                description: "Smart resizing that keeps the subject centered in any aspect ratio",
                video: "reframe",
                image: "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=400&h=250&fit=crop"
              },
              { 
                icon: Film, 
                title: "AI B-Roll", 
                description: "Automatically find and add relevant B-roll footage to your clips",
                video: "broll",
                image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=250&fit=crop"
              },
              { 
                icon: Volume2, 
                title: "AI Audio Enhance", 
                description: "Clean up audio, remove background noise, and enhance voice clarity",
                video: "audio",
                image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=250&fit=crop"
              },
              { 
                icon: Mic2, 
                title: "AI Voice-Over", 
                description: "Generate natural-sounding voiceovers in 140+ languages",
                video: "voiceover",
                image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=250&fit=crop"
              },
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-background border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-colors group"
              >
                {/* Video Placeholder with Image */}
                <div className="relative h-40 overflow-hidden group-hover:scale-105 transition-transform duration-300">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Play className="w-7 h-7 text-white ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 text-xs text-white bg-black/60 px-2 py-1 rounded">
                    {feature.video}
                  </div>
                </div>
                <div className="p-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-text-secondary text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Used by 10M+ creators - Marquee Slider */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-background border-y border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-text-secondary">Used by 10M+ creators and businesses worldwide</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60">
            {['YouTube', 'TikTok', 'Instagram', 'Twitter', 'LinkedIn', 'Facebook', 'Pinterest', 'Snapchat'].map((brand, index) => (
              <div key={index} className="text-xl font-bold text-white hover:text-primary transition-colors cursor-pointer">
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: AI Editing Models */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              AI EDITING MODELS
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              AI that understands every pixel of your video. The most powerful AI editing models that work on any video. Built for speed, accuracy, and creative flexibility.
            </p>
          </div>

          {/* ClipAnything */}
          <div className="mb-12 bg-surface rounded-2xl p-8 border border-border">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">ClipAnything</h3>
                <p className="text-text-secondary mb-6">
                  Every other AI clipping tool only works with video podcasts. ClipAnything is the only AI clipping model that turns any genre — vlogs, gaming, sports, interviews, explainer videos — into viral clips in 1 click.
                </p>
                <Link href="/features/clipanything" className="text-primary hover:text-primary-hover font-medium flex items-center gap-2">
                  Learn More <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="relative h-64 rounded-xl overflow-hidden group">
                <img 
                  src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&h=400&fit=crop" 
                  alt="ClipAnything Demo"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 text-sm text-white bg-black/60 px-3 py-1.5 rounded">Watch ClipAnything Demo</div>
              </div>
            </div>
          </div>

          {/* ReframeAnything */}
          <div className="bg-surface rounded-2xl p-8 border border-border">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1 relative h-64 rounded-xl overflow-hidden group">
                <img 
                  src="https://images.unsplash.com/photo-1536240478700-b869070f9279?w=600&h=400&fit=crop" 
                  alt="ReframeAnything Demo"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 text-sm text-white bg-black/60 px-3 py-1.5 rounded">Watch ReframeAnything Demo</div>
              </div>
              <div className="order-1 md:order-2">
                <h3 className="text-2xl font-bold text-white mb-4">ReframeAnything</h3>
                <p className="text-text-secondary mb-6">
                  The only AI reframe model that resizes any video for any platform and keeps moving subjects centered with AI object tracking. If you want more control, use manual tracking to instruct AI exactly what to follow.
                </p>
                <Link href="/features/ai-reframe" className="text-primary hover:text-primary-hover font-medium flex items-center gap-2">
                  Learn More <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Workflow Automation */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              WORKFLOW AUTOMATION
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Your video creation process — now on autopilot. Create and publish videos 5x faster with Podcast Clipper's web app and API, so you can go on vacation and still keep your content rolling.
            </p>
          </div>

          {/* Workflow Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                icon: Rocket, 
                title: "Auto-Publish", 
                description: "Set it and forget it. Your clips are automatically published to all platforms",
                video: "autopublish",
                image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=250&fit=crop"
              },
              { 
                icon: Workflow, 
                title: "Custom Workflows", 
                description: "Build your own automated workflows with our drag-and-drop builder",
                video: "workflows",
                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop"
              },
              { 
                icon: Gauge, 
                title: "Batch Processing", 
                description: "Process multiple videos at once with our high-speed rendering engine",
                video: "batch",
                image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=250&fit=crop"
              },
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-background border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-colors group"
              >
                <div className="relative h-40 overflow-hidden group-hover:scale-105 transition-transform duration-300">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Play className="w-7 h-7 text-white ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 text-xs text-white bg-black/60 px-2 py-1 rounded">
                    {feature.video}
                  </div>
                </div>
                <div className="p-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-text-secondary text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: AI Editor */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              AI EDITOR
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              AI that edits with you, not just for you. Take full editing control, or let our AI take over. Either way, it's effortless.
            </p>
          </div>

          {/* AI Editor Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                icon: Wand2, 
                title: "AI Suggestions", 
                description: "Get intelligent suggestions for cuts, transitions, and effects",
                video: "suggestions",
                image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=250&fit=crop"
              },
              { 
                icon: Monitor, 
                title: "Preview Mode", 
                description: "Real-time preview of all AI edits before applying them",
                video: "preview",
                image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=250&fit=crop"
              },
              { 
                icon: Palette, 
                title: "AI Color Grading", 
                description: "Professional color grading with one-click AI presets",
                video: "color",
                image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop"
              },
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-surface border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-colors group"
              >
                <div className="relative h-40 overflow-hidden group-hover:scale-105 transition-transform duration-300">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Play className="w-7 h-7 text-white ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 text-xs text-white bg-black/60 px-2 py-1 rounded">
                    {feature.video}
                  </div>
                </div>
                <div className="p-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-text-secondary text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Podcast Clipper for Teams */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              PODCAST CLIPPER FOR TEAMS
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Scale your creative output and business without scaling overhead. Every business is becoming video-first. Podcast Clipper helps your brand stay top of mind.
            </p>
          </div>

          {/* Teams Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                icon: Users, 
                title: "Team Collaboration", 
                description: "Work together seamlessly with shared workspaces and permissions",
                video: "collaboration",
                image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=250&fit=crop"
              },
              { 
                icon: Bot, 
                title: "AI Assistants", 
                description: "Each team member gets their own AI editing assistant",
                video: "assistants",
                image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=250&fit=crop"
              },
              { 
                icon: Repeat, 
                title: "Brand Consistency", 
                description: "Maintain brand identity across all content with templates",
                video: "branding",
                image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop"
              },
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-background border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-colors group"
              >
                <div className="relative h-40 overflow-hidden group-hover:scale-105 transition-transform duration-300">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Play className="w-7 h-7 text-white ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 text-xs text-white bg-black/60 px-2 py-1 rounded">
                    {feature.video}
                  </div>
                </div>
                <div className="p-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-text-secondary text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything You Need to Go Viral
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Powerful AI tools that transform your long-form content into engaging shorts
            </p>
          </div>

          {/* Horizontal Icon List */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            {[
              { icon: Scissors, label: "Long to Shorts", id: "long-to-shorts" },
              { icon: Type, label: "AI Captions", id: "ai-captions" },
              { icon: Sparkles, label: "Video Editor", id: "video-editor" },
              { icon: Volume2, label: "Enhance Speech", id: "enhance-speech" },
              { icon: Crop, label: "Reframe Video", id: "reframe-video" },
              { icon: Maximize2, label: "AI Reframe", id: "ai-reframe" },
              { icon: Film, label: "B-Roll", id: "b-roll" },
              { icon: Layers, label: "AI B-Roll", id: "ai-b-roll" },
              { icon: Target, label: "AI Hook", id: "ai-hook" }
            ].map((feature, index) => (
              <button
                key={index}
                onClick={() => setActiveModal(feature.id)}
                className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-background transition-colors group"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all">
                  <feature.icon className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
                </div>
                <span className="text-text-secondary group-hover:text-white font-medium transition-colors">{feature.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Loved by Content Creators
            </h2>
            <p className="text-xl text-text-secondary">
              See what our users are saying about AI Podcast
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah Chen",
                role: "Podcast Host",
                content: "I've grown my audience by 300% in just 3 months. The AI does all the hard work!",
                rating: 5
              },
              {
                name: "Mike Johnson",
                role: "Content Creator",
                content: "Finally, a tool that actually works. My shorts are getting millions of views.",
                rating: 5
              },
              {
                name: "Emily Davis",
                role: "Marketing Pro",
                content: "We save hours every week. The quality of clips is incredible.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div 
                key={index}
                className="bg-surface border border-border rounded-xl p-6"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-warning fill-warning" />
                  ))}
                </div>
                <p className="text-text-secondary mb-4">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-text-muted text-sm">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Grow Your Audience?
          </h2>
          <p className="text-xl text-white/80 mb-10">
            Join thousands of creators who are already going viral with AI Podcast
          </p>
          <Link 
            href="/dashboard" 
            className="inline-block bg-white text-primary hover:bg-white/90 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
          >
            Get Started for Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">AI Podcast</span>
              </Link>
              <p className="text-text-secondary">
                Turn your podcast into viral shorts with AI-powered tools.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link href="/features/clipanything" className="text-text-secondary hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/resources/pricing" className="text-text-secondary hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/resources/changelog" className="text-text-secondary hover:text-white transition-colors">Changelog</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="/resources/customer-stories" className="text-text-secondary hover:text-white transition-colors">Customer Stories</Link></li>
                <li><Link href="/resources/learning-center" className="text-text-secondary hover:text-white transition-colors">Learning Center</Link></li>
                <li><Link href="/resources/help-center" className="text-text-secondary hover:text-white transition-colors">Help Center</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="/resources/about" className="text-text-secondary hover:text-white transition-colors">About</Link></li>
                <li><Link href="/resources/blog" className="text-text-secondary hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/resources/careers" className="text-text-secondary hover:text-white transition-colors">Careers</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-text-muted">© 2024 AI Podcast. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/resources/privacy" className="text-text-muted hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/resources/terms" className="text-text-muted hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Feature Modals */}
      {isMounted && activeModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
          onClick={() => setActiveModal(null)}
        >
          <div 
            className="bg-surface border border-border rounded-2xl p-8 w-full max-w-md mx-4"
            style={{ boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-text-secondary hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Content */}
            {activeModal === "long-to-shorts" && (
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <Scissors className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">Long to Shorts</h2>
                <p className="text-text-secondary mb-6">
                  Automatically convert your long videos into engaging short clips perfect for social media.
                </p>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Video URL</label>
                    <input 
                      type="url" 
                      placeholder="https://example.com/video.mp4"
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Number of Clips</label>
                    <select className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white focus:outline-none focus:border-primary transition-colors">
                      <option>5 clips</option>
                      <option>10 clips</option>
                      <option>15 clips</option>
                      <option>20 clips</option>
                    </select>
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    Generate Clips
                  </button>
                </form>
              </div>
            )}

            {activeModal === "ai-captions" && (
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <Type className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">AI Captions</h2>
                <p className="text-text-secondary mb-6">
                  Generate accurate, animated captions for your videos with AI-powered technology.
                </p>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Video URL</label>
                    <input 
                      type="url" 
                      placeholder="https://example.com/video.mp4"
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Language</label>
                    <select className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white focus:outline-none focus:border-primary transition-colors">
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                      <option>Chinese</option>
                    </select>
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    Generate Captions
                  </button>
                </form>
              </div>
            )}

            {activeModal === "video-editor" && (
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">Video Editor</h2>
                <p className="text-text-secondary mb-6">
                  Edit your videos with our AI-powered video editor for professional results.
                </p>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Upload Video</label>
                    <div className="w-full px-4 py-8 bg-background border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center text-text-secondary">
                      <Upload className="w-8 h-8 mb-2" />
                      <span>Click to upload or drag and drop</span>
                    </div>
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    Start Editing
                  </button>
                </form>
              </div>
            )}

            {activeModal === "enhance-speech" && (
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <Volume2 className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">Enhance Speech</h2>
                <p className="text-text-secondary mb-6">
                  Improve audio quality by reducing background noise and enhancing voice clarity.
                </p>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Audio File</label>
                    <div className="w-full px-4 py-8 bg-background border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center text-text-secondary">
                      <Upload className="w-8 h-8 mb-2" />
                      <span>Click to upload or drag and drop</span>
                    </div>
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    Enhance Audio
                  </button>
                </form>
              </div>
            )}

            {activeModal === "reframe-video" && (
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <Crop className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">Reframe Video</h2>
                <p className="text-text-secondary mb-6">
                  Resize your video for different platforms while keeping the subject in focus.
                </p>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Video URL</label>
                    <input 
                      type="url" 
                      placeholder="https://example.com/video.mp4"
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Aspect Ratio</label>
                    <select className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white focus:outline-none focus:border-primary transition-colors">
                      <option>16:9 (YouTube)</option>
                      <option>9:16 (TikTok/Reels)</option>
                      <option>1:1 (Instagram)</option>
                      <option>4:5 (Portrait)</option>
                    </select>
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    Reframe Video
                  </button>
                </form>
              </div>
            )}

            {activeModal === "ai-reframe" && (
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <Maximize2 className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">AI Reframe</h2>
                <p className="text-text-secondary mb-6">
                  Let AI automatically reframe your video for optimal viewing on any platform.
                </p>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Video URL</label>
                    <input 
                      type="url" 
                      placeholder="https://example.com/video.mp4"
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Target Platform</label>
                    <select className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white focus:outline-none focus:border-primary transition-colors">
                      <option>TikTok</option>
                      <option>Instagram Reels</option>
                      <option>YouTube Shorts</option>
                      <option>Facebook</option>
                    </select>
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    AI Reframe
                  </button>
                </form>
              </div>
            )}

            {activeModal === "b-roll" && (
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <Film className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">B-Roll</h2>
                <p className="text-text-secondary mb-6">
                  Add professional B-roll footage to enhance your videos.
                </p>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Main Video</label>
                    <div className="w-full px-4 py-8 bg-background border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center text-text-secondary">
                      <Upload className="w-8 h-8 mb-2" />
                      <span>Click to upload or drag and drop</span>
                    </div>
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    Add B-Roll
                  </button>
                </form>
              </div>
            )}

            {activeModal === "ai-b-roll" && (
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <Layers className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">AI B-Roll</h2>
                <p className="text-text-secondary mb-6">
                  Let AI automatically find and add relevant B-roll footage to your videos.
                </p>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Video URL</label>
                    <input 
                      type="url" 
                      placeholder="https://example.com/video.mp4"
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Keywords</label>
                    <input 
                      type="text" 
                      placeholder="e.g., nature, technology, business"
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    Generate B-Roll
                  </button>
                </form>
              </div>
            )}

            {activeModal === "ai-hook" && (
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">AI Hook</h2>
                <p className="text-text-secondary mb-6">
                  Create attention-grabbing hooks for your videos with AI.
                </p>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Video URL</label>
                    <input 
                      type="url" 
                      placeholder="https://example.com/video.mp4"
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Hook Style</label>
                    <select className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white focus:outline-none focus:border-primary transition-colors">
                      <option>Question</option>
                      <option>Statistic</option>
                      <option>Story</option>
                      <option>Surprise</option>
                    </select>
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    Generate Hook
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {authModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
          onClick={() => setAuthModalOpen(false)}
        >
          <div 
            className="bg-surface border border-border rounded-2xl p-8 w-full max-w-md mx-4"
            style={{ boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-4 right-4 text-text-secondary hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Logo */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">AI Podcast</span>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-white text-center mb-2">
              {authMode === "signin" ? "Welcome Back" : "Get Started Free"}
            </h2>
            <p className="text-text-secondary text-center mb-6">
              {authMode === "signin" 
                ? "Sign in to continue to your dashboard" 
                : "Create an account to start clipping"}
            </p>

            {/* Form */}
            <form className="space-y-4" onSubmit={handleFormSubmit}>
              {formError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                  {formError}
                </div>
              )}
              {authMode === "signup" && (
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input 
                    type="email" 
                    placeholder="you@example.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••"
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-background border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {authMode === "signin" && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input type="checkbox" className="w-4 h-4 rounded border-border bg-background text-primary focus:ring-primary" />
                    <span className="ml-2 text-sm text-text-secondary">Remember me</span>
                  </label>
                  <a href="#" className="text-sm text-primary hover:text-primary-hover">Forgot password?</a>
                </div>
              )}

              <button 
                type="submit"
                disabled={formLoading}
                className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                {formLoading ? "Please wait..." : authMode === "signin" ? "Sign In" : "Create Account"}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-surface text-text-muted">or continue with</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={handleGoogleSignIn}
                disabled={formLoading}
                className="flex items-center justify-center gap-2 py-2.5 border border-border rounded-lg text-white hover:bg-surface-hover transition-colors disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button 
                onClick={handleGitHubSignIn}
                disabled={formLoading}
                className="flex items-center justify-center gap-2 py-2.5 border border-border rounded-lg text-white hover:bg-surface-hover transition-colors disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </button>
            </div>

            {/* Switch Mode */}
            <p className="text-center text-text-secondary mt-6">
              {authMode === "signin" ? (
                <>
                  Don't have an account?{" "}
                  <button 
                    onClick={() => setAuthMode("signup")}
                    className="text-primary hover:text-primary-hover font-medium"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button 
                    onClick={() => setAuthMode("signin")}
                    className="text-primary hover:text-primary-hover font-medium"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
