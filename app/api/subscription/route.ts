import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { subscriptions, billingCustomers, creditsBalance, workspaces } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { getActiveWorkspaceId } from "@/lib/auth";

// Define available plans
export const PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    interval: "MONTHLY" as const,
    features: [
      "5 video uploads per month",
      "Basic AI clipping",
      "720p exports",
      "1 team member",
    ],
    limits: {
      uploads: 5,
      exports: 5,
      teamMembers: 1,
      storage: "1GB",
    },
  },
  {
    id: "starter",
    name: "Starter",
    price: 19,
    interval: "MONTHLY" as const,
    features: [
      "25 video uploads per month",
      "Advanced AI clipping",
      "1080p exports",
      "3 team members",
      "Basic analytics",
      "Brand templates",
    ],
    limits: {
      uploads: 25,
      exports: 25,
      teamMembers: 3,
      storage: "10GB",
    },
  },
  {
    id: "pro",
    name: "Pro",
    price: 49,
    interval: "MONTHLY" as const,
    features: [
      "100 video uploads per month",
      "Premium AI clipping",
      "4K exports",
      "10 team members",
      "Advanced analytics",
      "Brand templates",
      "Priority support",
      "API access",
    ],
    limits: {
      uploads: 100,
      exports: 100,
      teamMembers: 10,
      storage: "100GB",
    },
  },
  {
    id: "business",
    name: "Business",
    price: 149,
    interval: "MONTHLY" as const,
    features: [
      "Unlimited video uploads",
      "Enterprise AI clipping",
      "4K exports",
      "Unlimited team members",
      "Custom analytics",
      "Custom brand templates",
      "Dedicated support",
      "API access",
      "SSO",
    ],
    limits: {
      uploads: -1,
      exports: -1,
      teamMembers: -1,
      storage: "1TB",
    },
  },
];

export async function GET(request: NextRequest) {
  try {
    const workspaceId = await getActiveWorkspaceId();
    
    // Fallback to query param for backwards compatibility
    const queryWorkspaceId = request.nextUrl.searchParams.get("workspaceId");
    
    if (!workspaceId && !queryWorkspaceId) {
      return NextResponse.json({ error: "Workspace ID required" }, { status: 400 });
    }

    const useWorkspaceId = workspaceId || queryWorkspaceId;

    // Get current subscription
    const subscription = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.workspaceId, useWorkspaceId!))
      .orderBy(desc(subscriptions.currentPeriodEnd))
      .limit(1);

    // Get workspace credits
    const credits = await db
      .select()
      .from(creditsBalance)
      .where(eq(creditsBalance.workspaceId, useWorkspaceId!))
      .limit(1);

    // Get available plans
    const currentPlan = subscription.length > 0 
      ? PLANS.find(p => p.id === subscription[0].planId) || PLANS[0]
      : PLANS[0];

    const isActive = subscription.length > 0 && 
      ["ACTIVE", "TRIALING"].includes(subscription[0].status);

    return NextResponse.json({
      subscription: subscription.length > 0 ? subscription[0] : null,
      credits: credits.length > 0 ? credits[0].balance : 0,
      currentPlan,
      plans: PLANS,
      isActive,
    });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json({ error: "Failed to fetch subscription" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const workspaceId = await getActiveWorkspaceId();
    const body = await request.json();
    
    // Fallback to body workspaceId for backwards compatibility
    const useWorkspaceId = workspaceId || body.workspaceId;
    const { planId, interval } = body;

    if (!useWorkspaceId || !planId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const plan = PLANS.find(p => p.id === planId);
    if (!plan) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // In a real app, this would create a Stripe subscription
    // For now, we'll update the local subscription record
    const [subscription] = await db
      .insert(subscriptions)
      .values({
        id: `sub_${Date.now()}`,
        workspaceId: useWorkspaceId!,
        planId,
        planId,
        interval: interval || "MONTHLY",
        status: "ACTIVE",
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      })
      .onConflictDoUpdate({
        target: subscriptions.workspaceId,
        set: {
          planId,
          interval: interval || "MONTHLY",
          status: "ACTIVE",
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(),
        },
      })
      .returning();

    return NextResponse.json({ 
      subscription,
      plan,
      message: "Subscription updated successfully" 
    });
  } catch (error) {
    console.error("Error updating subscription:", error);
    return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 });
  }
}
