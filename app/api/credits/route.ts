import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/db";
import { creditsBalance, creditsLedger, billingCustomers, workspaces, subscriptions } from "@/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { getActiveWorkspaceId, getCurrentUserId } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";

// Credit packages available for purchase
export const CREDIT_PACKAGES = [
  {
    id: "starter",
    name: "Starter",
    credits: 100,
    price: 9.99,
    bonus: 0,
    stripePriceId: process.env.STRIPE_CREDITS_STARTER_PRICE_ID || "price_starter_credits",
  },
  {
    id: "pro",
    name: "Pro",
    credits: 500,
    price: 39.99,
    bonus: 50, // 10% bonus
    stripePriceId: process.env.STRIPE_CREDITS_PRO_PRICE_ID || "price_pro_credits",
  },
  {
    id: "business",
    name: "Business",
    credits: 1500,
    price: 99.99,
    bonus: 300, // 20% bonus
    stripePriceId: process.env.STRIPE_CREDITS_BUSINESS_PRICE_ID || "price_business_credits",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    credits: 5000,
    price: 299.99,
    bonus: 1500, // 30% bonus
    stripePriceId: process.env.STRIPE_CREDITS_ENTERPRISE_PRICE_ID || "price_enterprise_credits",
  },
];

// GET - Get credit balance and transaction history
export async function GET(request: NextRequest) {
  try {
    const workspaceId = await getActiveWorkspaceId();
    
    if (!workspaceId) {
      return NextResponse.json(
        { error: "Workspace ID is required" },
        { status: 400 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Get credit balance
    const credits = await db
      .select()
      .from(creditsBalance)
      .where(eq(creditsBalance.workspaceId, workspaceId))
      .limit(1);

    // Get subscription for monthly limit
    const subscription = await db
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.workspaceId, workspaceId),
          eq(subscriptions.status, "ACTIVE")
        )
      )
      .orderBy(desc(subscriptions.currentPeriodEnd))
      .limit(1);

    // Get transaction history
    const transactions = await db
      .select({
        id: creditsLedger.id,
        delta: creditsLedger.delta,
        reason: creditsLedger.reason,
        memo: creditsLedger.memo,
        createdAt: creditsLedger.createdAt,
      })
      .from(creditsLedger)
      .where(eq(creditsLedger.workspaceId, workspaceId))
      .orderBy(desc(creditsLedger.createdAt))
      .limit(limit)
      .offset((page - 1) * limit);

    // Get monthly usage
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyUsageResult = await db
      .select({
        total: sql<number>`COALESCE(SUM(${creditsLedger.delta}), 0)`,
      })
      .from(creditsLedger)
      .where(
        and(
          eq(creditsLedger.workspaceId, workspaceId),
          sql`${creditsLedger.createdAt} >= ${startOfMonth}`,
          sql`${creditsLedger.delta} < 0`
        )
      );

    // Get next billing date
    let nextBillingDate = null;
    let monthlyLimit = 0;
    
    if (subscription.length > 0 && subscription[0].currentPeriodEnd) {
      nextBillingDate = subscription[0].currentPeriodEnd;
      // Get plan details for monthly credits
      const planId = subscription[0].planId;
      if (planId === "starter") monthlyLimit = 150;
      else if (planId === "pro") monthlyLimit = 300;
      else if (planId === "business") monthlyLimit = 1000;
      else if (planId === "free") monthlyLimit = 50;
    }

    const monthlyUsed = Math.abs(monthlyUsageResult[0]?.total || 0);

    // Transform transactions
    const transformedTransactions = transactions.map(t => {
      const isPurchase = t.delta > 0;
      return {
        id: t.id,
        type: t.reason === "CREDITS_PURCHASE" ? "purchase" : 
              t.reason === "JOB_FINALIZE" ? t.memo?.includes("Caption") ? "caption_generation" : "thumbnail_generation" :
              "other",
        amount: t.delta,
        description: t.memo || t.reason,
        date: t.createdAt.toISOString(),
        remaining: 0 // Will be calculated on frontend
      };
    });

    // Calculate running balance for each transaction
    let runningBalance = credits.length > 0 ? credits[0].balance : 0;
    for (let i = transformedTransactions.length - 1; i >= 0; i--) {
      const t = transformedTransactions[i];
      t.amount = runningBalance - (t.amount < 0 ? t.amount : 0);
      runningBalance = t.amount;
    }

    return NextResponse.json({
      credits: credits.length > 0 ? credits[0].balance : 0,
      monthlyUsed,
      monthlyLimit,
      nextBillingDate,
      transactions: transformedTransactions,
      packages: CREDIT_PACKAGES,
      subscription: subscription.length > 0 ? subscription[0] : null,
    });
  } catch (error) {
    console.error("Error fetching credits:", error);
    return NextResponse.json(
      { error: "Failed to fetch credits" },
      { status: 500 }
    );
  }
}

// POST - Purchase credits via Stripe
export async function POST(request: NextRequest) {
  try {
    const workspaceId = await getActiveWorkspaceId();
    const userId = await getCurrentUserId();
    
    if (!workspaceId || !userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Please sign in to purchase credits" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { packageId } = body;

    const creditPackage = CREDIT_PACKAGES.find(p => p.id === packageId);
    if (!creditPackage) {
      return NextResponse.json(
        { error: "Invalid credit package" },
        { status: 400 }
      );
    }

    // Get or create Stripe customer
    let customerId: string | undefined;
    
    const existingCustomer = await db
      .select()
      .from(billingCustomers)
      .where(eq(billingCustomers.workspaceId, workspaceId))
      .limit(1);

    if (existingCustomer.length > 0 && existingCustomer[0].stripeCustomerId) {
      customerId = existingCustomer[0].stripeCustomerId;
    }

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email,
        metadata: {
          workspaceId,
          userId,
        },
      });
      
      customerId = customer.id;

      await db
        .insert(billingCustomers)
        .values({
          workspaceId,
          stripeCustomerId: customerId,
        })
        .onConflictDoUpdate({
          target: billingCustomers.workspaceId,
          set: {
            stripeCustomerId: customerId,
          },
        });
    }

    // Create Stripe checkout session for credits purchase
    const totalCredits = creditPackage.credits + creditPackage.bonus;
    
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${creditPackage.name} - ${totalCredits} Credits`,
              description: `${creditPackage.credits} credits${creditPackage.bonus > 0 ? ` + ${creditPackage.bonus} bonus credits` : ''}`,
            },
            unit_amount: Math.round(creditPackage.price * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        workspaceId,
        packageId,
        credits: totalCredits.toString(),
        bonus: creditPackage.bonus.toString(),
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/credits?purchase=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/credits?purchase=cancelled`,
    });

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });
  } catch (error: any) {
    console.error("Error purchasing credits:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
