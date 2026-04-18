import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { socialAccounts } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { getActiveWorkspaceId } from "@/lib/auth";

type Platform = "YOUTUBE" | "TIKTOK" | "INSTAGRAM" | "FACEBOOK" | "TWITTER" | "LINKEDIN" | "PINTEREST" | "SNAPCHAT";
type AccountStatus = "CONNECTED" | "DISCONNECTED" | "EXPIRED" | "ERROR";

export async function GET(request: NextRequest) {
  try {
    const workspaceId = await getActiveWorkspaceId();
    
    if (!workspaceId) {
      // Fallback to query param for backwards compatibility
      const searchParams = request.nextUrl.searchParams;
      const queryWorkspaceId = searchParams.get("workspaceId");
      if (!queryWorkspaceId) {
        return NextResponse.json({ error: "Workspace ID required" }, { status: 400 });
      }
    }

    const useWorkspaceId = workspaceId || request.nextUrl.searchParams.get("workspaceId");
    const platform = request.nextUrl.searchParams.get("platform") as Platform | null;
    const status = request.nextUrl.searchParams.get("status") as AccountStatus | null;

    const conditions = [eq(socialAccounts.workspaceId, useWorkspaceId!)];

    if (platform) {
      conditions.push(eq(socialAccounts.platform, platform));
    }

    if (status) {
      conditions.push(eq(socialAccounts.status, status));
    }

    const accounts = await db
      .select({
        id: socialAccounts.id,
        platform: socialAccounts.platform,
        platformAccountId: socialAccounts.platformAccountId,
        platformUsername: socialAccounts.platformUsername,
        platformProfileUrl: socialAccounts.platformProfileUrl,
        platformProfileImage: socialAccounts.platformProfileImage,
        status: socialAccounts.status,
        tokenExpiresAt: socialAccounts.tokenExpiresAt,
        createdAt: socialAccounts.createdAt,
        updatedAt: socialAccounts.updatedAt,
      })
      .from(socialAccounts)
      .where(and(...conditions))
      .orderBy(desc(socialAccounts.createdAt));

    return NextResponse.json({ accounts }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'Pragma': 'no-cache',
      },
    });
  } catch (error) {
    console.error("Error fetching social accounts:", error);
    return NextResponse.json({ error: "Failed to fetch accounts" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const workspaceId = await getActiveWorkspaceId();
    const searchParams = request.nextUrl.searchParams;
    const queryWorkspaceId = searchParams.get("workspaceId");
    const body = await request.json();
    
    // Use session workspaceId or fall back to body/query
    const useWorkspaceId = workspaceId || queryWorkspaceId || body.workspaceId;
    
    if (!useWorkspaceId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const {
      userId,
      platform,
      platformAccountId,
      platformUsername,
      platformProfileUrl,
      platformProfileImage,
      accessToken,
      refreshToken,
      tokenExpiresAt,
    } = body;

    // Check if account already exists
    const existing = await db
      .select()
      .from(socialAccounts)
      .where(
        and(
          eq(socialAccounts.workspaceId, useWorkspaceId!),
          eq(socialAccounts.platform, platform),
          eq(socialAccounts.platformAccountId, platformAccountId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      // Update existing account
      const [updated] = await db
        .update(socialAccounts)
        .set({
          platformUsername,
          platformProfileUrl,
          platformProfileImage,
          accessToken,
          refreshToken,
          tokenExpiresAt: tokenExpiresAt ? new Date(tokenExpiresAt) : null,
          status: "CONNECTED",
          updatedAt: new Date(),
        })
        .where(eq(socialAccounts.id, existing[0].id))
        .returning();

      return NextResponse.json({ account: updated });
    }

    const id = `sa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const [newAccount] = await db
      .insert(socialAccounts)
      .values({
        id,
        workspaceId: useWorkspaceId!,
        userId,
        platform,
        platformAccountId,
        platformUsername,
        platformProfileUrl,
        platformProfileImage,
        accessToken,
        refreshToken,
        tokenExpiresAt: tokenExpiresAt ? new Date(tokenExpiresAt) : null,
        status: "CONNECTED",
      })
      .returning();

    return NextResponse.json({ account: newAccount }, { status: 201 });
  } catch (error) {
    console.error("Error creating social account:", error);
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const workspaceId = await getActiveWorkspaceId();
    const searchParams = request.nextUrl.searchParams;
    const accountId = searchParams.get("id");
    const queryWorkspaceId = searchParams.get("workspaceId");

    // Use session workspaceId or fall back to query
    const useWorkspaceId = workspaceId || queryWorkspaceId;

    if (!accountId || !useWorkspaceId) {
      return NextResponse.json({ error: "Account ID and Workspace ID required" }, { status: 400 });
    }

    // Delete the social account
    await db
      .delete(socialAccounts)
      .where(
        and(
          eq(socialAccounts.id, accountId),
          eq(socialAccounts.workspaceId, useWorkspaceId)
        )
      );

    return NextResponse.json({ message: "Account disconnected successfully" });
  } catch (error) {
    console.error("Error deleting social account:", error);
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}
