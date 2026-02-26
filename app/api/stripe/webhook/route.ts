import { NextRequest, NextResponse } from "next/server";
import { stripe, getPlanByPriceId } from "@/lib/stripe";
import { db } from "@/db";
import { subscriptions, billingCustomers, creditsBalance, creditsLedger } from "@/db/schema";
import { eq } from "drizzle-orm";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature") as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;
        await handleCheckoutCompleted(session);
        break;
      }
      
      case "customer.subscription.created": {
        const subscription = event.data.object as any;
        await handleSubscriptionCreated(subscription);
        break;
      }
      
      case "customer.subscription.updated": {
        const subscription = event.data.object as any;
        await handleSubscriptionUpdated(subscription);
        break;
      }
      
      case "customer.subscription.deleted": {
        const subscription = event.data.object as any;
        await handleSubscriptionDeleted(subscription);
        break;
      }
      
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as any;
        await handlePaymentSucceeded(invoice);
        break;
      }
      
      case "invoice.payment_failed": {
        const invoice = event.data.object as any;
        await handlePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

async function handleCheckoutCompleted(session: any) {
  const workspaceId = session.metadata?.workspaceId;
  const planId = session.metadata?.planId;
  const creditsStr = session.metadata?.credits;
  
  if (!workspaceId) {
    console.error("No workspaceId in checkout session metadata");
    return;
  }

  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  // Get subscription details
  const subscription: any = await stripe.subscriptions.retrieve(subscriptionId);
  const priceId = subscription.items.data[0]?.price.id;
  
  // Determine interval
  const interval = subscription.items.data[0]?.price.recurring?.interval || "monthly";
  
  // Get plan info
  const planInfo = getPlanByPriceId(priceId);
  const credits = planInfo ? planInfo.plan.credits : parseInt(creditsStr || "0");

  // Upsert billing customer
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

  // Upsert subscription
  await db
    .insert(subscriptions)
    .values({
      id: subscriptionId,
      workspaceId,
      stripeSubscriptionId: subscriptionId,
      status: "ACTIVE",
      planId: planId || "starter",
      interval: interval.toUpperCase() as "MONTHLY" | "ANNUAL",
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      trialEndsAt: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
    })
    .onConflictDoUpdate({
      target: subscriptions.id,
      set: {
        status: "ACTIVE",
        planId: planId || "starter",
        interval: interval.toUpperCase() as "MONTHLY" | "ANNUAL",
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        stripeSubscriptionId: subscriptionId,
        updatedAt: new Date(),
      },
    });

  // Add credits to balance
  if (credits > 0) {
    // Insert or update credits balance
    await db
      .insert(creditsBalance)
      .values({
        workspaceId,
        balance: credits,
      })
      .onConflictDoUpdate({
        target: creditsBalance.workspaceId,
        set: {
          balance: credits,
          updatedAt: new Date(),
        },
      });

    // Record the transaction
    await db.insert(creditsLedger).values({
      workspaceId,
      delta: credits,
      reason: "CREDITS_PURCHASE",
      memo: `Initial credits for ${planId} plan`,
      stripeEventId: session.id,
    });
  }

  console.log(`Checkout completed for workspace ${workspaceId}, plan: ${planId}`);
}

async function handleSubscriptionCreated(subscription: any) {
  const workspaceId = subscription.metadata?.workspaceId;
  
  if (!workspaceId) {
    console.log("No workspaceId in subscription metadata");
    return;
  }

  const priceId = subscription.items.data[0]?.price.id;
  const interval = subscription.items.data[0]?.price.recurring?.interval || "monthly";

  await db
    .update(subscriptions)
    .set({
      status: "ACTIVE",
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.workspaceId, workspaceId));

  console.log(`Subscription created for workspace ${workspaceId}`);
}

async function handleSubscriptionUpdated(subscription: any) {
  const workspaceId = subscription.metadata?.workspaceId;
  
  const statusMap: Record<string, string> = {
    active: "ACTIVE",
    trialing: "TRIALING",
    past_due: "PAST_DUE",
    canceled: "CANCELLED",
    unpaid: "UNPAID",
    paused: "PAST_DUE",
    incomplete: "PAST_DUE",
    incomplete_expired: "CANCELLED",
  };

  if (!workspaceId) {
    // Try to find by stripe subscription ID
    const existing = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.stripeSubscriptionId, subscription.id))
      .limit(1);
    
    if (existing.length > 0) {
      await db
        .update(subscriptions)
        .set({
          status: statusMap[subscription.status] as any || "PAST_DUE",
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.stripeSubscriptionId, subscription.id));
    }
    return;
  }

  await db
    .update(subscriptions)
    .set({
      status: statusMap[subscription.status] as any || "PAST_DUE",
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.workspaceId, workspaceId));

  console.log(`Subscription updated for workspace ${workspaceId}, status: ${subscription.status}`);
}

async function handleSubscriptionDeleted(subscription: any) {
  const workspaceId = subscription.metadata?.workspaceId;
  
  if (!workspaceId) {
    return;
  }

  await db
    .update(subscriptions)
    .set({
      status: "CANCELLED",
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.workspaceId, workspaceId));

  console.log(`Subscription cancelled for workspace ${workspaceId}`);
}

async function handlePaymentSucceeded(invoice: any) {
  const subscriptionId = invoice.subscription;
  
  if (!subscriptionId) return;

  // Add credits on recurring payments
  const subscription: any = await stripe.subscriptions.retrieve(subscriptionId);
  const priceId = subscription.items.data[0]?.price.id;
  const planInfo = getPlanByPriceId(priceId);
  
  if (!planInfo) return;

  const workspaceId = subscription.metadata?.workspaceId || 
    (await db.select().from(subscriptions).where(eq(subscriptions.stripeSubscriptionId, subscriptionId)).limit(1))[0]?.workspaceId;

  if (!workspaceId) return;

  // Add credits for the new billing period
  const credits = planInfo.plan.credits;

  // Update credits balance
  const existing = await db
    .select()
    .from(creditsBalance)
    .where(eq(creditsBalance.workspaceId, workspaceId))
    .limit(1);

  const newBalance = existing.length > 0 ? existing[0].balance + credits : credits;

  await db
    .update(creditsBalance)
    .set({
      balance: newBalance,
      updatedAt: new Date(),
    })
    .where(eq(creditsBalance.workspaceId, workspaceId));

  // Record transaction
  await db.insert(creditsLedger).values({
    workspaceId,
    delta: credits,
    reason: "CREDITS_PURCHASE",
    memo: `Monthly credits for ${planInfo.plan.name} plan`,
    stripeEventId: invoice.id,
  });

  console.log(`Payment succeeded for workspace ${workspaceId}, added ${credits} credits`);
}

async function handlePaymentFailed(invoice: any) {
  const subscriptionId = invoice.subscription;
  
  if (!subscriptionId) return;

  const subscription: any = await stripe.subscriptions.retrieve(subscriptionId);
  const workspaceId = subscription.metadata?.workspaceId;

  if (!workspaceId) return;

  // Update subscription status to past_due
  await db
    .update(subscriptions)
    .set({
      status: "PAST_DUE",
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.workspaceId, workspaceId));

  console.log(`Payment failed for workspace ${workspaceId}`);
}
