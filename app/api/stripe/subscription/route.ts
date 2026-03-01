import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { subscriptions, workspaces, workspaceMembers, creditsBalance } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's workspace
    let userWorkspaces;
    try {
      // First get the user from the session to find their workspace
      userWorkspaces = await db
        .select({
          id: workspaces.id,
          name: workspaces.name,
        })
        .from(workspaces)
        .innerJoin(workspaceMembers, eq(workspaceMembers.workspaceId, workspaces.id))
        .where(eq(workspaceMembers.userId, (session.user as any).id as string))
        .limit(1);

      // If no workspace found via membership, try to find by user's email
      if (userWorkspaces.length === 0) {
        userWorkspaces = await db
          .select({
            id: workspaces.id,
            name: workspaces.name,
          })
          .from(workspaces)
          .where(eq(workspaces.createdBy, (session.user as any).id as string))
          .limit(1);
      }
    } catch (dbError) {
      console.error("Database error fetching workspaces:", dbError);
      return NextResponse.json({ error: "Database error. Please try again later." }, { status: 500 });
    }

    if (userWorkspaces.length === 0) {
      return NextResponse.json({ error: "No workspace found" }, { status: 404 });
    }

    const workspaceId = userWorkspaces[0].id;

    // Get active subscription
    const activeSubscription = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.workspaceId, workspaceId))
      .limit(1);

    if (activeSubscription.length === 0) {
      return NextResponse.json(null, { status: 404 });
    }

    const subscription = activeSubscription[0];

    // Get credits balance
    const credits = await db
      .select()
      .from(creditsBalance)
      .where(eq(creditsBalance.workspaceId, workspaceId))
      .limit(1);

    return NextResponse.json({
      id: subscription.id,
      status: subscription.status,
      planId: subscription.planId,
      interval: subscription.interval,
      currentPeriodEnd: subscription.currentPeriodEnd,
      credits: credits.length > 0 ? credits[0].balance : 0,
    });
  } catch (error: any) {
    console.error("Subscription error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to get subscription" },
      { status: 500 }
    );
  }
}
