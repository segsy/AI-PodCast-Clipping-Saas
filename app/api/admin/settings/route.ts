import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { adminUsersTable, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAdmin, requireSuperAdmin, getCurrentUser } from "@/lib/auth";

// In-memory settings storage (in production, use a settings table)
const platformSettings = {
  general: {
    platformName: "AI Podcast",
    supportEmail: "support@aipodcast.com",
    defaultPlan: "starter",
    allowSignups: true,
  },
  billing: {
    stripeEnabled: true,
    taxRate: 0,
    currency: "USD",
  },
  limits: {
    maxWorkspacesPerUser: 10,
    maxTeamMembers: 50,
    maxStorageGB: 100,
    maxVideoDurationMinutes: 180,
  },
  features: {
    aiBrollEnabled: true,
    aiCaptionsEnabled: true,
    aiThumbnailEnabled: true,
    brandTemplatesEnabled: true,
    analyticsEnabled: true,
  },
  moderation: {
    autoApproveClips: false,
    contentModerationEnabled: true,
    maxClipLength: 60,
  },
};

// GET - Get platform settings
export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    
    return NextResponse.json({
      settings: platformSettings,
    });
  } catch (error: any) {
    console.error("Error fetching settings:", error);
    if (error.message === "Unauthorized" || error.message.includes("Forbidden")) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT - Update platform settings
export async function PUT(request: NextRequest) {
  try {
    await requireSuperAdmin();
    
    const body = await request.json();
    const { section, settings } = body;
    
    if (!section || !settings) {
      return NextResponse.json(
        { error: "Section and settings are required" },
        { status: 400 }
      );
    }
    
    // Validate section
    const validSections = ["general", "billing", "limits", "features", "moderation"];
    if (!validSections.includes(section)) {
      return NextResponse.json(
        { error: "Invalid section" },
        { status: 400 }
      );
    }
    
    // Update settings
    (platformSettings as any)[section] = {
      ...(platformSettings as any)[section],
      ...settings,
    };
    
    return NextResponse.json({
      settings: platformSettings,
      message: "Settings updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating settings:", error);
    if (error.message === "Unauthorized" || error.message.includes("Forbidden")) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
