import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  console.error("❌ STRIPE_SECRET_KEY is not set in environment variables");
  throw new Error("STRIPE_SECRET_KEY is required");
}

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2026-01-28.clover",
  typescript: true,
});

// Plan configuration - maps to Stripe Price IDs
export const PLANS = {
  starter: {
    name: "Starter",
    priceIdMonthly: process.env.STRIPE_STARTER_MONTHLY_PRICE_ID || "price_starter_monthly",
    priceIdAnnual: process.env.STRIPE_STARTER_ANNUAL_PRICE_ID || "price_starter_annual",
    credits: 150,
    priceMonthly: 15,
    priceAnnual: 144, // $12/month equivalent
  },
  pro: {
    name: "Pro",
    priceIdMonthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || "price_pro_monthly",
    priceIdAnnual: process.env.STRIPE_PRO_ANNUAL_PRICE_ID || "price_pro_annual",
    credits: 3600, // 300/month equivalent
    priceMonthly: 29,
    priceAnnual: 290,
  },
  business: {
    name: "Business",
    priceIdMonthly: process.env.STRIPE_BUSINESS_MONTHLY_PRICE_ID || "price_business_monthly",
    priceIdAnnual: process.env.STRIPE_BUSINESS_ANNUAL_PRICE_ID || "price_business_annual",
    credits: 10000,
    priceMonthly: 99,
    priceAnnual: 990,
  },
};

export type PlanType = keyof typeof PLANS;

export function getPlan(planId: string): typeof PLANS.starter | undefined {
  const planKey = planId.toLowerCase() as PlanType;
  return PLANS[planKey];
}

export function getPlanByPriceId(priceId: string): { plan: typeof PLANS.starter; interval: "monthly" | "annual" } | undefined {
  for (const [key, plan] of Object.entries(PLANS)) {
    if (plan.priceIdMonthly === priceId) {
      return { plan, interval: "monthly" };
    }
    if (plan.priceIdAnnual === priceId) {
      return { plan, interval: "annual" };
    }
  }
  return undefined;
}
