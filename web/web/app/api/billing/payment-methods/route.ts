import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { paymentMethods } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const workspaceId = searchParams.get("workspaceId");

    if (!workspaceId) {
      return NextResponse.json({ error: "Workspace ID required" }, { status: 400 });
    }

    const methods = await db
      .select()
      .from(paymentMethods)
      .where(eq(paymentMethods.workspaceId, workspaceId))
      .orderBy(desc(paymentMethods.isDefault), desc(paymentMethods.createdAt));

    return NextResponse.json({ paymentMethods: methods });
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    return NextResponse.json({ error: "Failed to fetch payment methods" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      workspaceId,
      stripePaymentMethodId,
      type,
      brand,
      last4,
      expiryMonth,
      expiryYear,
      isDefault,
    } = body;

    if (!workspaceId || !stripePaymentMethodId || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      await db
        .update(paymentMethods)
        .set({ isDefault: false })
        .where(eq(paymentMethods.workspaceId, workspaceId));
    }

    const id = `pm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const [newMethod] = await db
      .insert(paymentMethods)
      .values({
        id,
        workspaceId,
        stripePaymentMethodId,
        type,
        brand,
        last4,
        expiryMonth,
        expiryYear,
        isDefault: isDefault || false,
      })
      .returning();

    return NextResponse.json({ paymentMethod: newMethod }, { status: 201 });
  } catch (error) {
    console.error("Error creating payment method:", error);
    return NextResponse.json({ error: "Failed to create payment method" }, { status: 500 });
  }
}
