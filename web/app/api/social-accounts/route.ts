import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { socialAccounts } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";

type Platform = "YOUTUBE" | "TIKTOK" | "INSTAGRAM" | "FACEBOOK" | "TWITTER" | "LINKEDIN" | "PINTEREST" | "SNAPCHAT";
type AccountStatus = "CONNECTED" | "DISCONNECTED" | "EXPIRED" | "ERROR";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const workspaceId = searchParams.get("workspaceId");
    const platform = searchParams.get("platform") as Platform | null;
    const status = searchParams.get("status") as AccountStatus | null;

    if (!workspaceId) {
      return NextResponse.json({ error: "Workspace ID required" }, { status: 400 });
    }

    const conditions = [eq(socialAccounts.workspaceId, workspaceId)];

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

    return NextResponse.json({ accounts });
  } catch (error) {
    console.error("Error fetching social accounts:", error);
    return NextResponse.json({ error: "Failed to fetch accounts" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      workspaceId,
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

    if (!workspaceId || !platform || !platformAccountId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if account already exists
    const existing = await db
      .select()
      .from(socialAccounts)
      .where(
        and(
          eq(socialAccounts.workspaceId, workspaceId),
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
        workspaceId,
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
