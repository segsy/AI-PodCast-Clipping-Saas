import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { subscriptions, creditsLedger, creditsBalance, workspaces, billingCustomers } from "@/db/schema";
import { eq, desc, or, count, sum, sql } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";

// Define status types as a constant array
const STATUS_VALUES = ["ACTIVE", "TRIALING", "PAST_DUE", "CANCELLED", "UNPAID"] as const;
type SubscriptionStatus = typeof STATUS_VALUES[number];

// Helper function to safely build OR conditions
function buildOrConditions<T>(values: T[], column: any): any[] {
  if (values.length === 0) return [];
  if (values.length === 1) return [eq(column, values[0])];
  return values.map(value => eq(column, value));
}

// Helper to get enum value safely
function getStatusEnum(status: string): any {
  const upperStatus = status.toUpperCase();
  if (STATUS_VALUES.includes(upperStatus as SubscriptionStatus)) {
    return sql`${upperStatus}::subscription_status`;
  }
  return sql`${upperStatus}::text`;
}

// GET - Get billing overview and all subscriptions
export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const statusFilter = searchParams.get("status") || "all";
    
    const offset = (page - 1) * limit;
    
    // Get total subscription count
    let totalCountResult;
    if (statusFilter && statusFilter !== "all") {
      totalCountResult = await db
        .select({ count: count() })
        .from(subscriptions)
        .where(sql`${subscriptions.status} = ${statusFilter.toUpperCase()}`);
    } else {
      totalCountResult = await db
        .select({ count: count() })
        .from(subscriptions);
    }
    
    // Get all subscriptions with workspace info
    let allSubscriptions;
    if (statusFilter && statusFilter !== "all") {
      allSubscriptions = await db
        .select()
        .from(subscriptions)
        .where(sql`${subscriptions.status} = ${statusFilter.toUpperCase()}`)
        .orderBy(desc(subscriptions.createdAt))
        .limit(limit)
        .offset(offset);
    } else {
      allSubscriptions = await db
        .select()
        .from(subscriptions)
        .orderBy(desc(subscriptions.createdAt))
        .limit(limit)
        .offset(offset);
    }
    
    // Get workspace info for each subscription
    const workspaceIds = allSubscriptions.map(s => s.workspaceId);
    let workspaceDetails: any[] = [];
    if (workspaceIds.length > 0) {
      try {
        const conditions = buildOrConditions(workspaceIds, workspaces.id);
        if (conditions.length > 0) {
          workspaceDetails = await db
            .select({
              id: workspaces.id,
              name: workspaces.name,
              slug: workspaces.slug,
            })
            .from(workspaces)
            .where(or(...conditions));
        }
      } catch (e) {
        console.error("Error fetching workspaces:", e);
      }
    }
    
    // Get credits for each workspace
    let creditsDetails: any[] = [];
    if (workspaceIds.length > 0) {
      try {
        const conditions = buildOrConditions(workspaceIds, creditsBalance.workspaceId);
        if (conditions.length > 0) {
          creditsDetails = await db
            .select()
            .from(creditsBalance)
            .where(or(...conditions));
        }
      } catch (e) {
        console.error("Error fetching credits:", e);
      }
    }
    
    // Map data
    const workspaceMap = new Map(workspaceDetails.map(w => [w.id, w]));
    const creditsMap = new Map(creditsDetails.map(c => [c.workspaceId, c]));
    
    // Format subscriptions
    const formattedSubscriptions = allSubscriptions.map(sub => {
      const workspace = workspaceMap.get(sub.workspaceId);
      const credits = creditsMap.get(sub.workspaceId);
      
      return {
        ...sub,
        workspace: workspace ? { id: workspace.id, name: workspace.name, slug: workspace.slug } : null,
        credits: credits?.balance || 0,
      };
    });
    
    // Get billing stats
    const activeCount = await db
      .select({ count: count() })
      .from(subscriptions)
      .where(sql`${subscriptions.status} = 'ACTIVE'`);
    
    const trialCount = await db
      .select({ count: count() })
      .from(subscriptions)
      .where(sql`${subscriptions.status} = 'TRIALING'`);
    
    const pastDueCount = await db
      .select({ count: count() })
      .from(subscriptions)
      .where(sql`${subscriptions.status} = 'PAST_DUE'`);
    
    const cancelledCount = await db
      .select({ count: count() })
      .from(subscriptions)
      .where(sql`${subscriptions.status} = 'CANCELLED'`);
    
    // Get total credits in system
    const totalCredits = await db
      .select({
        total: sum(creditsBalance.balance),
      })
      .from(creditsBalance);
    
    // Get recent transactions
    const recentTransactions = await db
      .select()
      .from(creditsLedger)
      .orderBy(desc(creditsLedger.createdAt))
      .limit(10);
    
    // Get workspace names for transactions
    const transactionWorkspaceIds = [...new Set(recentTransactions.map(t => t.workspaceId))];
    let transactionWorkspaces: any[] = [];
    if (transactionWorkspaceIds.length > 0) {
      try {
        const conditions = buildOrConditions(transactionWorkspaceIds, workspaces.id);
        if (conditions.length > 0) {
          transactionWorkspaces = await db
            .select({
              id: workspaces.id,
              name: workspaces.name,
            })
            .from(workspaces)
            .where(or(...conditions));
        }
      } catch (e) {
        console.error("Error fetching transaction workspaces:", e);
      }
    }
    
    const transactionWorkspaceMap = new Map(transactionWorkspaces.map(w => [w.id, w.name]));
    
    const formattedTransactions = recentTransactions.map(t => ({
      ...t,
      workspaceName: transactionWorkspaceMap.get(t.workspaceId) || "Unknown",
    }));
    
    return NextResponse.json({
      subscriptions: formattedSubscriptions,
      total: totalCountResult[0]?.count || 0,
      page,
      limit,
      totalPages: Math.ceil((totalCountResult[0]?.count || 0) / limit),
      stats: {
        active: activeCount[0]?.count || 0,
        trial: trialCount[0]?.count || 0,
        pastDue: pastDueCount[0]?.count || 0,
        cancelled: cancelledCount[0]?.count || 0,
        totalCredits: totalCredits[0]?.total || 0,
      },
      recentTransactions: formattedTransactions,
    });
  } catch (error: any) {
    console.error("Error fetching billing data:", error);
    if (error.message === "Unauthorized" || error.message.includes("Forbidden")) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

// POST - Create or update subscription (admin only)
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    
    const body = await request.json();
    const { workspaceId, planId, interval, status, stripeSubscriptionId } = body;
    
    if (!workspaceId || !planId) {
      return NextResponse.json(
        { error: "Workspace ID and plan ID are required" },
        { status: 400 }
      );
    }
    
    // Check if subscription exists
    const existingSubscription = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.workspaceId, workspaceId))
      .limit(1);
    
    let subscription;
    if (existingSubscription.length > 0) {
      // Update existing subscription
      const updateData: any = {
        planId,
        interval: interval || "MONTHLY",
        status: status || "ACTIVE",
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      };
      
      if (stripeSubscriptionId) {
        updateData.stripeSubscriptionId = stripeSubscriptionId;
      }
      
      subscription = await db
        .update(subscriptions)
        .set(updateData)
        .where(eq(subscriptions.workspaceId, workspaceId))
        .returning();
    } else {
      // Create new subscription
      subscription = await db
        .insert(subscriptions)
        .values({
          id: `sub_${Date.now()}`,
          workspaceId,
          planId,
          interval: interval || "MONTHLY",
          status: status || "ACTIVE",
          stripeSubscriptionId,
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        })
        .returning();
    }
    
    return NextResponse.json({
      subscription: subscription[0],
    });
  } catch (error: any) {
    console.error("Error creating subscription:", error);
    if (error.message === "Unauthorized" || error.message.includes("Forbidden")) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

// PATCH - Update subscription
export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();
    
    const body = await request.json();
    const { subscriptionId, status, planId, interval } = body;
    
    if (!subscriptionId) {
      return NextResponse.json(
        { error: "Subscription ID is required" },
        { status: 400 }
      );
    }
    
    // Build update data
    const updateData: any = {
      updatedAt: new Date(),
    };
    
    if (status) {
      updateData.status = status.toUpperCase();
    }
    
    if (planId) {
      updateData.planId = planId;
    }
    
    if (interval) {
      updateData.interval = interval.toUpperCase();
    }
    
    const updated = await db
      .update(subscriptions)
      .set(updateData)
      .where(eq(subscriptions.id, subscriptionId))
      .returning();
    
    if (updated.length === 0) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      subscription: updated[0],
    });
  } catch (error: any) {
    console.error("Error updating subscription:", error);
    if (error.message === "Unauthorized" || error.message.includes("Forbidden")) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

// DELETE - Cancel/Delete subscription
export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin();
    
    const searchParams = request.nextUrl.searchParams;
    const subscriptionId = searchParams.get("id");
    
    if (!subscriptionId) {
      return NextResponse.json(
        { error: "Subscription ID is required" },
        { status: 400 }
      );
    }
    
    // Soft delete - just mark as cancelled
    const updated = await db
      .update(subscriptions)
      .set({
        status: "CANCELLED",
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.id, subscriptionId))
      .returning();
    
    if (updated.length === 0) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: "Subscription cancelled successfully",
      subscription: updated[0],
    });
  } catch (error: any) {
    console.error("Error deleting subscription:", error);
    if (error.message === "Unauthorized" || error.message.includes("Forbidden")) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
