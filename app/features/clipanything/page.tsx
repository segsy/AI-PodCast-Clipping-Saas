"use client";

import Link from "next/link";
import { ArrowLeft, Play, Zap, TrendingUp, Clock, Users, Star, Check, ChevronRight, Video, MessageSquare, Share2, Eye } from "lucide-react";

export default function ClipAnythingPage() {
  const stats = [
    { value: "10M+", label: "Videos Clipped", icon: Video },
    { value: "87%", label: "Viral Rate", icon: TrendingUp },
    { value: "2min", label: "Avg. Processing", icon: Clock },
    { value: "500K+", label: "Active Users", icon: Users },
  ];

  const features = [
    {
      title: "AI-Powered Detection",
      description: "Our AI automatically identifies the most engaging moments in your videos - hooks, punchlines, key insights, and emotional peaks.",
      icon: Zap,
    },
    {
      title: "One-Click Viral Clips",
      description: "Transform long-form content into platform-optimized shorts in a single click. Perfect for TikTok, Instagram Reels, and YouTube Shorts.",
      icon: Play,
    },
    {
      title: "Smart Editing",
      description: "Auto-trim, auto-crop, and auto-add captions to create scroll-stopping content that keeps viewers engaged.",
      icon: TrendingUp,
    },
    {
      title: "Multi-Platform Export",
      description: "Export to multiple aspect ratios and formats simultaneously - vertical for Reels, square for Instagram, horizontal for YouTube.",
      icon: Share2,
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Content Creator",
      handle: "@sarahchen",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      content: "ClipAnything transformed my content strategy. I went from posting once a week to daily viral shorts with minimal effort.",
      stats: "2M+ views/month",
    },
    {
      name: "Mike Rodriguez",
      role: "Podcast Host",
      handle: "@mikepodcast",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      content: "My podcast listener count grew 300% after I started using ClipAnything to create short clips for social media.",
      stats: "50K new followers",
    },
    {
      name: "Emma Thompson",
      role: "Marketing Manager",
      handle: "@emmat",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      content: "We've scaled our content production by 10x. What used to take our team hours now takes minutes.",
      stats: "500+ clips/month",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Upload Your Video",
      description: "Drag and drop any long-form video - podcasts, interviews, webinars, or livestreams.",
    },
    {
      number: "02",
      title: "AI Analyzes Content",
      description: "Our AI scans for engaging moments, emotional peaks, and hook-worthy segments.",
    },
    {
      number: "03",
      title: "Review & Customize",
      description: "Browse AI-suggested clips, make adjustments, or let AI auto-edit for you.",
    },
    {
      number: "04",
      title: "Export & Share",
      description: "Download in any format or directly publish to your social platforms.",
    },
  ];

  return (
    <div>
      {/* Back Link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-text-secondary hover:text-white transition-colors text-sm mb-8"
      >
        <ArrowLeft size={16} />
        Back to Home
      </Link>

      {/* Hero Section */}
      <div className="mb-16">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-semibold px-4 py-2 rounded-full mb-6">
          <Zap size={16} />
          AI-Powered Video Clipping
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
          The fastest way to turn<br />
          <span className="text-primary">any video into viral shorts</span>
        </h1>

        <p className="text-xl text-text-secondary max-w-2xl mb-10">
          Transform hours of long-form content into dozens of engaging short videos automatically. Stop spending hours editing - let AI do the heavy lifting.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
          >
            Start Clipping Free
            <ChevronRight size={20} />
          </Link>
          <Link
            href="/resources/case-studies/clipanything"
            className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-surface border border-border text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
          >
            View Case Studies
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-8 bg-surface border border-border rounded-xl">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <stat.icon size={24} className="text-primary mx-auto mb-2" />
              <div className="text-2xl sm:text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-text-secondary">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Demo Section */}
      <div className="mb-20">
        <div className="relative aspect-video max-w-4xl bg-surface border border-border rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-cyan-500/20 flex items-center justify-center">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
              <Play size={32} className="text-white ml-1" />
            </div>
          </div>
          <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/70 backdrop-blur-sm rounded-xl">
            <div className="font-semibold mb-1">Watch how it works</div>
            <div className="text-sm text-text-secondary">See ClipAnything in action - from upload to viral clip in 2 minutes</div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mb-20">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-center">
          Everything you need to go viral
        </h2>
        <p className="text-xl text-text-secondary mb-12 text-center">
          Powerful AI features that make video clipping effortless
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-8 bg-surface border border-border rounded-xl"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-5">
                <feature.icon size={24} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-text-secondary leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="mb-20">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-center">
          How ClipAnything works
        </h2>
        <p className="text-xl text-text-secondary mb-12 text-center">
          From upload to viral clip in four simple steps
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="p-7 bg-surface border border-border rounded-xl h-full">
                <div className="text-4xl font-bold text-primary opacity-30 mb-4">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold mb-3">{step.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <ChevronRight
                  size={24}
                  className="absolute -right-3 top-1/2 transform -translate-y-1/2 text-text-secondary z-10 hidden lg:block"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="mb-20">
        <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">
          Loved by 500K+ creators
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-7 bg-surface border border-border rounded-xl"
            >
              <div className="flex items-center gap-3 mb-5">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-text-secondary">{testimonial.handle}</div>
                </div>
              </div>
              <p className="text-white leading-relaxed mb-4">
                "{testimonial.content}"
              </p>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                <TrendingUp size={14} />
                {testimonial.stats}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="p-16 bg-surface border border-border rounded-3xl text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Ready to go viral?
        </h2>
        <p className="text-xl text-text-secondary mb-8 max-w-lg mx-auto">
          Join 500K+ creators who are already producing viral content on autopilot.
        </p>
        <div className="flex justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
          >
            Start Clipping Free
            <ChevronRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}
