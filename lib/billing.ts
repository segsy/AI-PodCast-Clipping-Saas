// Billing API client for the frontend

const API_BASE = "/api/stripe";

export interface CheckoutRequest {
  planId: string;
  interval: "monthly" | "annual";
  workspaceId: string;
  trial?: boolean;
}

export interface PortalRequest {
  workspaceId: string;
}

export interface SubscriptionInfo {
  id: string;
  status: string;
  planId: string;
  interval: string;
  currentPeriodEnd: string;
  credits: number;
}

// Create checkout session
export async function createCheckoutSession(data: CheckoutRequest): Promise<{ sessionId: string; url: string }> {
  const response = await fetch(`${API_BASE}/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || "Failed to create checkout session");
  }

  return response.json();
}

// Create customer portal session
export async function createPortalSession(data: PortalRequest): Promise<{ url: string }> {
  const response = await fetch(`${API_BASE}/portal`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || "Failed to create portal session");
  }

  return response.json();
}

// Get current subscription (for authenticated users)
export async function getCurrentSubscription(): Promise<SubscriptionInfo | null> {
  const response = await fetch(`${API_BASE}/subscription`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || "Failed to get subscription");
  }

  const data = await response.json();
  
  // Return null if no subscription exists
  if (!data.subscription) {
    return null;
  }

  return {
    id: data.subscription.id,
    status: data.subscription.status,
    planId: data.subscription.planId,
    interval: data.subscription.interval,
    currentPeriodEnd: data.subscription.currentPeriodEnd,
    credits: data.credits,
  };
}

// Plan configurations (matching server-side)
export const PLANS = {
  starter: {
    name: "Starter",
    priceIdMonthly: "price_starter_monthly",
    priceIdAnnual: "price_starter_annual",
    credits: 150,
    priceMonthly: 15,
    priceAnnual: 144,
    description: "For individual creators",
  },
  pro: {
    name: "Pro",
    priceIdMonthly: "price_pro_monthly",
    priceIdAnnual: "price_pro_annual",
    credits: 3600,
    priceMonthly: 29,
    priceAnnual: 290,
    description: "For professional creators, marketers, & teams",
  },
  business: {
    name: "Business",
    priceIdMonthly: "price_business_monthly",
    priceIdAnnual: "price_business_annual",
    credits: 10000,
    priceMonthly: 99,
    priceAnnual: 990,
    description: "For organizations that need tailored solutions",
  },
};

export type PlanType = keyof typeof PLANS;
