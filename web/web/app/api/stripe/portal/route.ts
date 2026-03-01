import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/db";
import { billingCustomers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { workspaceId } = body;

    if (!workspaceId) {
      return NextResponse.json({ error: "Workspace ID required" }, { status: 400 });
    }

    // Get Stripe customer
    const customer = await db
      .select()
      .from(billingCustomers)
      .where(eq(billingCustomers.workspaceId, workspaceId))
      .limit(1);

    if (customer.length === 0 || !customer[0].stripeCustomerId) {
      return NextResponse.json({ error: "No billing account found" }, { status: 404 });
    }

    // Create customer portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customer[0].stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error: any) {
    console.error("Stripe portal error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create portal session" },
      { status: 500 }
    );
  }
}
