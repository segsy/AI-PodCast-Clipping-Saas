"use client";

import Link from "next/link";
import { 
  Zap, 
  Upload, 
  Film, 
  BarChart3, 
  Settings, 
  CreditCard,
  Users,
  FolderOpen,
  Plus,
  Clock,
  TrendingUp
} from "lucide-react";

export default function DashboardPage() {
  const recentClips = [
    { id: 1, title: "Top 5 Tips for Growing Your Podcast", platform: "YouTube Shorts", views: "12.5K", date: "2 hours ago" },
    { id: 2, title: "The Secret to Viral Content", platform: "TikTok", views: "45.2K", date: "5 hours ago" },
    { id: 3, title: "How I Gained 100K Followers", platform: "Instagram Reels", views: "28.7K", date: "1 day ago" },
  ];

  const stats = [
    { label: "Total Clips", value: "234", icon: Film, change: "+12%" },
    { label: "Total Views", value: "1.2M", icon: TrendingUp, change: "+28%" },
    { label: "Total Duration", value: "4.5h", icon: Clock, change: "+5%" },
    { label: "Workspaces", value: "3", icon: FolderOpen, change: "0%" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-border">
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
              <Link href="/dashboard" className="text-white font-medium">Dashboard</Link>
              <Link href="/dashboard/clips" className="text-text-secondary hover:text-white transition-colors">Clips</Link>
              <Link href="/dashboard/uploads" className="text-text-secondary hover:text-white transition-colors">Uploads</Link>
              <Link href="/dashboard/analytics" className="text-text-secondary hover:text-white transition-colors">Analytics</Link>
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <Link 
                href="/dashboard/settings" 
                className="p-2 text-text-secondary hover:text-white transition-colors"
              >
                <Settings className="w-5 h-5" />
              </Link>
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">JD</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back!</h1>
          <p className="text-text-secondary">Here's what's happening with your content today.</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link 
            href="/dashboard/uploads" 
            className="flex items-center gap-4 p-4 bg-primary/10 border border-primary/20 rounded-xl hover:bg-primary/20 transition-colors"
          >
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-semibold text-white">Upload Video</div>
              <div className="text-sm text-text-secondary">Add a new video to clip</div>
            </div>
          </Link>
          
          <Link 
            href="/dashboard/clips" 
            className="flex items-center gap-4 p-4 bg-surface border border-border rounded-xl hover:bg-surface-hover transition-colors"
          >
            <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
              <Film className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-semibold text-white">View All Clips</div>
              <div className="text-sm text-text-secondary">Manage your created clips</div>
            </div>
          </Link>
          
          <Link 
            href="/dashboard/analytics" 
            className="flex items-center gap-4 p-4 bg-surface border border-border rounded-xl hover:bg-surface-hover transition-colors"
          >
            <div className="w-12 h-12 bg-success rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-semibold text-white">Analytics</div>
              <div className="text-sm text-text-secondary">Track your performance</div>
            </div>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-surface border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="w-5 h-5 text-primary" />
                <span className="text-xs text-success font-medium">{stat.change}</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-text-secondary">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Recent Clips */}
        <div className="bg-surface border border-border rounded-xl">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Recent Clips</h2>
            <Link 
              href="/dashboard/clips" 
              className="text-sm text-primary hover:text-primary-hover font-medium"
            >
              View All
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentClips.map((clip) => (
              <div key={clip.id} className="p-4 flex items-center justify-between hover:bg-surface-hover transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-background rounded-lg flex items-center justify-center">
                    <Film className="w-6 h-6 text-text-muted" />
                  </div>
                  <div>
                    <div className="font-medium text-white">{clip.title}</div>
                    <div className="text-sm text-text-secondary">{clip.platform} • {clip.date}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-white">{clip.views}</div>
                  <div className="text-xs text-text-muted">views</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
