import { NextRequest, NextResponse } from "next/server";
import { stripe, PLANS } from "@/lib/stripe";
import { db } from "@/db";
import { subscriptions, billingCustomers, creditsBalance, workspaces, workspaceMembers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";

export async function POST(request: NextRequest) {
  try {
    // Get the current user session
    let session;
    try {
      session = await getServerSession(authOptions);
      console.log("[STRIPE CHECKOUT] Auth result:", { 
        hasSession: !!session, 
        sessionType: typeof session,
        error: session?.error 
      });
    } catch (authError: any) {
      console.error("[STRIPE CHECKOUT] Auth error:", authError?.message || authError);
      return NextResponse.json({ error: "Authentication failed. Please sign in again." }, { status: 401 });
    }
    
    console.log("[STRIPE CHECKOUT] Session check:", { 
      hasSession: !!session, 
      hasUser: !!session?.user, 
      hasEmail: !!session?.user?.email,
      userId: session?.user?.id 
    });
    
    if (!session?.user?.email) {
      console.log("[STRIPE CHECKOUT] Unauthorized: No valid session");
      return NextResponse.json({ error: "Unauthorized. Please sign in to subscribe." }, { status: 401 });
    }

    const body = await request.json();
    const { planId, interval = "monthly" } = body;

    // Validate plan
    const plan = PLANS[planId as keyof typeof PLANS];
    if (!plan) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // Get user's workspace from database based on their user ID from session
    let userWorkspaces;
    try {
      // First get the user from the session to find their workspace
      const userEmail = session?.user?.email;
      
      // Query workspaces that the user has access to via workspaceMembers
      userWorkspaces = await db
        .select({
          id: workspaces.id,
          name: workspaces.name,
        })
        .from(workspaces)
        .innerJoin(workspaceMembers, eq(workspaceMembers.workspaceId, workspaces.id))
        .where(eq(workspaceMembers.userId, session?.user?.id as string))
        .limit(1);
      
      // If no workspace found via membership, try to find by user's email
      if (userWorkspaces.length === 0 && userEmail) {
        userWorkspaces = await db
          .select({
            id: workspaces.id,
            name: workspaces.name,
          })
          .from(workspaces)
          .where(eq(workspaces.createdBy, session?.user?.id as string))
          .limit(1);
      }
    } catch (dbError) {
      console.error("[STRIPE CHECKOUT] Database error fetching workspaces:", dbError);
      return NextResponse.json({ error: "Database error. Please try again later." }, { status: 500 });
    }

    if (userWorkspaces.length === 0) {
      return NextResponse.json({ error: "No workspace found. Please create a workspace first." }, { status: 400 });
    }

    const workspaceId = (!body.workspaceId || body.workspaceId === "default") ? userWorkspaces[0].id : body.workspaceId;
    
    if (!workspaceId) {
      return NextResponse.json({ error: "Workspace ID required" }, { status: 400 });
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

    // If no customer exists, create one
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email!,
        metadata: {
          workspaceId,
          userId: (session.user as any).id || "",
        },
      });
      
      customerId = customer.id;

      // Save customer to database - use onConflictDoUpdate instead
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

    // Get the appropriate price ID
    const priceId = interval === "annual" ? plan.priceIdAnnual : plan.priceIdMonthly;

    // Create checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        workspaceId,
        planId,
        credits: plan.credits.toString(),
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?subscription=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/resources/pricing?subscription=cancelled`,
      subscription_data: {
        metadata: {
          workspaceId,
          planId,
        },
        trial_period_days: 7, // 7-day free trial
      },
    });

    return NextResponse.json({ 
      sessionId: checkoutSession.id,
      url: checkoutSession.url 
    });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
