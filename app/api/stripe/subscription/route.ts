import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { subscriptions, workspaces, workspaceMembers, creditsBalance } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";

// Simple in-memory cache for subscription data
const CACHE_TTL = 60 * 1000; // 60 seconds
interface CacheEntry {
  data: any;
  timestamp: number;
}
const stripeSubscriptionCache = new Map<string, CacheEntry>();

function getCachedData(key: string): any | null {
  const entry = stripeSubscriptionCache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data;
  }
  stripeSubscriptionCache.delete(key);
  return null;
}

function setCachedData(key: string, data: any): void {
  stripeSubscriptionCache.set(key, { data, timestamp: Date.now() });
}

function invalidateCache(key: string): void {
  stripeSubscriptionCache.delete(key);
}

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
      // Return empty subscription object instead of 404 for new users
      return NextResponse.json({ subscription: null, credits: 0 });
    }

    const workspaceId = userWorkspaces[0].id;
    const cacheKey = `stripe-subscription:${workspaceId}`;

    // Check cache first
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return NextResponse.json(cachedData, {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
          'X-Cache': 'HIT',
        },
      });
    }

    // Get active subscription
    const activeSubscription = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.workspaceId, workspaceId))
      .limit(1);

    if (activeSubscription.length === 0) {
      // Return empty subscription object instead of 404
      const responseData = { subscription: null, credits: 0 };
      setCachedData(cacheKey, responseData);
      return NextResponse.json(responseData, {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
          'X-Cache': 'MISS',
        },
      });
    }

    const subscription = activeSubscription[0];

    // Get credits balance
    const credits = await db
      .select()
      .from(creditsBalance)
      .where(eq(creditsBalance.workspaceId, workspaceId))
      .limit(1);

    const responseData = {
      subscription: {
        id: subscription.id,
        status: subscription.status,
        planId: subscription.planId,
        interval: subscription.interval,
        currentPeriodEnd: subscription.currentPeriodEnd,
      },
      credits: credits.length > 0 ? credits[0].balance : 0,
    };

    // Cache the response
    setCachedData(cacheKey, responseData);

    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
        'X-Cache': 'MISS',
      },
    });
  } catch (error: any) {
    console.error("Subscription error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to get subscription" },
      { status: 500 }
    );
  }
}
