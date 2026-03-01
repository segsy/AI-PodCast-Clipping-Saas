import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { salesTransactions } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const workspaceId = searchParams.get("workspaceId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!workspaceId) {
      return NextResponse.json({ error: "Workspace ID required" }, { status: 400 });
    }

    const transactions = await db
      .select({
        id: salesTransactions.id,
        stripeChargeId: salesTransactions.stripeChargeId,
        stripeInvoiceId: salesTransactions.stripeInvoiceId,
        amountCents: salesTransactions.amountCents,
        currency: salesTransactions.currency,
        type: salesTransactions.type,
        status: salesTransactions.status,
        createdAt: salesTransactions.createdAt,
      })
      .from(salesTransactions)
      .where(eq(salesTransactions.workspaceId, workspaceId))
      .orderBy(desc(salesTransactions.createdAt));

    // Calculate totals
    const totalSpent = transactions.reduce((sum, t) => sum + Number(t.amountCents), 0);
    const totalTransactions = transactions.length;

    // Group by month for chart
    const monthlyData: Record<string, number> = {};
    transactions.forEach((t) => {
      const month = new Date(t.createdAt).toISOString().slice(0, 7);
      monthlyData[month] = (monthlyData[month] || 0) + Number(t.amountCents);
    });

    return NextResponse.json({
      transactions: transactions.map((t) => ({
        ...t,
        amountCents: Number(t.amountCents),
        amountFormatted: `$${(Number(t.amountCents) / 100).toFixed(2)}`,
      })),
      totalSpent,
      totalSpentFormatted: `$${(totalSpent / 100).toFixed(2)}`,
      totalTransactions,
      monthlyData,
    });
  } catch (error) {
    console.error("Error fetching billing history:", error);
    return NextResponse.json({ error: "Failed to fetch billing history" }, { status: 500 });
  }
}
