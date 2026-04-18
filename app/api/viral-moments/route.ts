import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { uploads, creditsBalance, creditsLedger, workspaces } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getActiveWorkspaceId, getCurrentUserId } from "@/lib/auth";
import { 
  extractViralMoments, 
  extractViralMomentsFromSRT,
  TranscriptSegment,
  ViralMoment 
} from "@/lib/ai-viral-moments";

// Credit costs
const CREDIT_COST_PER_CLIP = 2;

/**
 * POST - Extract viral moments from transcript
 * 
 * Request body:
 * {
 *   segments: TranscriptSegment[] - Array of transcript segments with timestamps
 *   srtContent?: string - Optional SRT format transcript (alternative to segments)
 *   maxMoments?: number - Maximum number of moments to extract (default: 10)
 *   workspaceId?: string - Optional workspace ID
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { segments, srtContent, maxMoments = 10, workspaceId: bodyWorkspaceId } = body;

    // Get workspace from body or session
    let workspaceId = bodyWorkspaceId;
    if (!workspaceId) {
      workspaceId = await getActiveWorkspaceId();
    }
    
    let userId = await getCurrentUserId();
    
    if (!workspaceId || !userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Validate input
    if (!segments && !srtContent) {
      return NextResponse.json(
        { error: "Either 'segments' or 'srtContent' is required" },
        { status: 400 }
      );
    }

    // Check credit balance
    const credits = await db
      .select()
      .from(creditsBalance)
      .where(eq(creditsBalance.workspaceId, workspaceId))
      .limit(1);

    const currentBalance = credits.length > 0 ? credits[0].balance : 0;
    const creditsNeeded = CREDIT_COST_PER_CLIP;

    if (currentBalance < creditsNeeded) {
      return NextResponse.json(
        { error: "Insufficient credits", creditsNeeded, currentBalance },
        { status: 400 }
      );
    }

    // Deduct credits
    await db
      .insert(creditsLedger)
      .values({
        workspaceId,
        delta: -creditsNeeded,
        reason: "JOB_RESERVE",
        memo: `Viral moments extraction - ${creditsNeeded} credits`,
        createdBy: userId,
      });

    await db
      .update(creditsBalance)
      .set({ 
        balance: currentBalance - creditsNeeded,
        updatedAt: new Date()
      })
      .where(eq(creditsBalance.workspaceId, workspaceId));

    // Extract viral moments
    let result;
    try {
      if (srtContent) {
        result = await extractViralMomentsFromSRT(srtContent, maxMoments);
      } else {
        result = await extractViralMoments(segments as TranscriptSegment[], maxMoments);
      }
    } catch (aiError) {
      console.error("AI extraction error:", aiError);
      
      // Release credits on failure
      await db
        .insert(creditsLedger)
        .values({
          workspaceId,
          delta: creditsNeeded,
          reason: "JOB_RELEASE",
          memo: "Viral moments extraction failed - credits released",
          createdBy: userId,
        });

      await db
        .update(creditsBalance)
        .set({
          balance: currentBalance,
          updatedAt: new Date()
        })
        .where(eq(creditsBalance.workspaceId, workspaceId));

      return NextResponse.json(
        { error: "Failed to extract viral moments" },
        { status: 500 }
      );
    }

    // Finalize credits (move from reserved to used)
    await db
      .insert(creditsLedger)
      .values({
        workspaceId,
        delta: -creditsNeeded,
        reason: "JOB_FINALIZE",
        memo: "Viral moments extraction completed",
        createdBy: userId,
      });

    return NextResponse.json({
      moments: result.moments,
      modelUsed: result.modelUsed,
      creditsUsed: creditsNeeded,
      creditsRemaining: currentBalance - creditsNeeded,
      count: result.moments.length,
    }, { status: 201 });
  } catch (error) {
    console.error("Error extracting viral moments:", error);
    return NextResponse.json(
      { error: "Failed to extract viral moments" },
      { status: 500 }
    );
  }
}

/**
 * GET - Get viral moments extraction info
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const exampleSegments: TranscriptSegment[] = [
    { start: 0, end: 10, text: "Welcome to the podcast! Today we're discussing AI and content creation." },
    { start: 10, end: 20, text: "The biggest mistake most creators make is thinking virality is luck." },
    { start: 20, end: 30, text: "It's actually a science. I've seen creators go from 100 to a million followers." },
    { start: 30, end: 40, text: "The secret is understanding what makes people stop scrolling." },
    { start: 40, end: 50, text: "Most videos fail in the first 3 seconds. That is where you lose your audience." },
    { start: 50, end: 60, text: "But here's the controversial part - I think most marketing advice is garbage." },
  ];

  return NextResponse.json({
    service: "Viral Moments Extraction",
    model: "gemini-2.0-flash-exp (Gemini Flash 1.5)",
    description: "Analyzes podcast transcripts to extract the most viral-worthy moments",
    creditCost: CREDIT_COST_PER_CLIP,
    constraints: {
      minClipDuration: 20, // seconds
      maxClipDuration: 60, // seconds
      maxMoments: 10,
    },
    inputFormat: {
      segments: "Array of { start: number, end: number, text: string }",
      srtContent: "Optional SRT format string",
    },
    example: {
      segments: exampleSegments,
    },
  });
}
