import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { captionJobs, uploads, creditsBalance, creditsLedger, workspaces } from "@/db/schema";
import { eq, and, desc, count } from "drizzle-orm";
import { getActiveWorkspaceId, getCurrentUserId } from "@/lib/auth";

// Credit costs
const CREDIT_COST_PER_MINUTE = 5;

// GET - List all caption jobs for workspace
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
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const conditions = [eq(captionJobs.workspaceId, workspaceId)];

    if (status) {
      conditions.push(eq(captionJobs.status, status.toUpperCase() as any));
    }

    const whereClause = and(...conditions);

    // Get total count
    const totalCount = await db
      .select({ count: count() })
      .from(captionJobs)
      .where(whereClause);

    // Get caption jobs with upload info
    const jobs = await db
      .select({
        id: captionJobs.id,
        status: captionJobs.status,
        style: captionJobs.style,
        fontSize: captionJobs.fontSize,
        showTimestamps: captionJobs.showTimestamps,
        speakerIdentification: captionJobs.speakerIdentification,
        soundEffects: captionJobs.soundEffects,
        aiModel: captionJobs.aiModel,
        creditsUsed: captionJobs.creditsUsed,
        durationSec: captionJobs.durationSec,
        errorMessage: captionJobs.errorMessage,
        createdAt: captionJobs.createdAt,
        updatedAt: captionJobs.updatedAt,
        uploadId: captionJobs.uploadId,
        projectId: captionJobs.projectId,
        filename: uploads.filename,
      })
      .from(captionJobs)
      .leftJoin(uploads, eq(captionJobs.uploadId, uploads.id))
      .where(whereClause)
      .orderBy(desc(captionJobs.createdAt))
      .limit(limit)
      .offset((page - 1) * limit);

    // Get status counts
    const statusCounts = await db
      .select({
        status: captionJobs.status,
        count: count(),
      })
      .from(captionJobs)
      .where(eq(captionJobs.workspaceId, workspaceId))
      .groupBy(captionJobs.status);

    // Get credit balance
    const credits = await db
      .select()
      .from(creditsBalance)
      .where(eq(creditsBalance.workspaceId, workspaceId))
      .limit(1);

    // Get this month's usage
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyUsage = await db
      .select({
        total: count(),
      })
      .from(creditsLedger)
      .where(
        and(
          eq(creditsLedger.workspaceId, workspaceId),
          eq(creditsLedger.reason, "JOB_FINALIZE"),
          // Would add date comparison here
        )
      );

    const stats = {
      total: totalCount[0]?.count || 0,
      completed: statusCounts.find(s => s.status === "COMPLETED")?.count || 0,
      processing: statusCounts.find(s => s.status === "PROCESSING")?.count || 0,
      pending: statusCounts.find(s => s.status === "PENDING")?.count || 0,
      failed: statusCounts.find(s => s.status === "FAILED")?.count || 0,
    };

    return NextResponse.json({
      jobs,
      total: stats.total,
      stats,
      credits: credits.length > 0 ? credits[0].balance : 0,
      page,
      limit,
    });
  } catch (error) {
    console.error("Error fetching caption jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch caption jobs" },
      { status: 500 }
    );
  }
}

// POST - Create a new caption generation job
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

    const body = await request.json();
    const { 
      uploadId, 
      projectId, 
      style, 
      fontSize, 
      showTimestamps, 
      speakerIdentification,
      soundEffects,
      aiModel 
    } = body;

    if (!uploadId) {
      return NextResponse.json(
        { error: "Upload ID is required" },
        { status: 400 }
      );
    }

    // Get upload details
    const upload = await db
      .select()
      .from(uploads)
      .where(eq(uploads.id, uploadId))
      .limit(1);

    if (upload.length === 0) {
      return NextResponse.json(
        { error: "Upload not found" },
        { status: 404 }
      );
    }

    // Calculate credits needed
    const durationSec = upload[0].durationSec || 0;
    const creditsNeeded = Math.ceil((durationSec / 60) * CREDIT_COST_PER_MINUTE);

    // Check credit balance
    const credits = await db
      .select()
      .from(creditsBalance)
      .where(eq(creditsBalance.workspaceId, workspaceId))
      .limit(1);

    const currentBalance = credits.length > 0 ? credits[0].balance : 0;

    if (currentBalance < creditsNeeded) {
      return NextResponse.json(
        { error: "Insufficient credits", creditsNeeded, currentBalance },
        { status: 400 }
      );
    }

    // Reserve credits
    await db
      .insert(creditsLedger)
      .values({
        workspaceId,
        delta: -creditsNeeded,
        reason: "JOB_RESERVE",
        memo: `Caption generation - ${creditsNeeded} credits reserved`,
        createdBy: userId,
      });

    // Update balance
    await db
      .update(creditsBalance)
      .set({ 
        balance: currentBalance - creditsNeeded,
        updatedAt: new Date()
      })
      .where(eq(creditsBalance.workspaceId, workspaceId));

    // Create caption job
    const job = await db
      .insert(captionJobs)
      .values({
        id: `capjob_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        workspaceId,
        uploadId,
        projectId: projectId || upload[0].projectId,
        status: "PENDING",
        style: style || "modern",
        fontSize: fontSize || "medium",
        showTimestamps: showTimestamps ?? true,
        speakerIdentification: speakerIdentification ?? true,
        soundEffects: soundEffects ?? false,
        aiModel: aiModel || "gemini",
        creditsUsed: creditsNeeded,
        durationSec,
        createdBy: userId,
      })
      .returning();

    // TODO: Queue job for processing with AI service

    return NextResponse.json({
      job: job[0],
      creditsUsed: creditsNeeded,
      creditsRemaining: currentBalance - creditsNeeded,
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating caption job:", error);
    return NextResponse.json(
      { error: "Failed to create caption job" },
      { status: 500 }
    );
  }
}

// PUT - Update caption job status (for webhooks from worker)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobId, status, s3Key, errorMessage } = body;

    if (!jobId) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 }
      );
    }

    const job = await db
      .select()
      .from(captionJobs)
      .where(eq(captionJobs.id, jobId))
      .limit(1);

    if (job.length === 0) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    const updateData: any = {
      status: status?.toUpperCase() || job[0].status,
      updatedAt: new Date(),
    };

    if (s3Key) {
      updateData.s3Key = s3Key;
    }

    if (errorMessage) {
      updateData.errorMessage = errorMessage;

      // If job failed, release reserved credits
      if (status === "FAILED") {
        const workspaceId = job[0].workspaceId;
        const creditsUsed = job[0].creditsUsed;

        await db
          .insert(creditsLedger)
          .values({
            workspaceId,
            jobId,
            delta: creditsUsed,
            reason: "JOB_RELEASE",
            memo: "Caption job failed - credits released",
          });

        const credits = await db
          .select()
          .from(creditsBalance)
          .where(eq(creditsBalance.workspaceId, workspaceId))
          .limit(1);

        if (credits.length > 0) {
          await db
            .update(creditsBalance)
            .set({
              balance: credits[0].balance + creditsUsed,
              updatedAt: new Date()
            })
            .where(eq(creditsBalance.workspaceId, workspaceId));
        }
      }
    }

    // If job completed, finalize credits
    if (status === "COMPLETED") {
      const workspaceId = job[0].workspaceId;
      
      // Move from reserved to finalized
      await db
        .insert(creditsLedger)
        .values({
          workspaceId,
          jobId,
          delta: -job[0].creditsUsed,
          reason: "JOB_FINALIZE",
          memo: "Caption job completed",
        });
    }

    const updatedJob = await db
      .update(captionJobs)
      .set(updateData)
      .where(eq(captionJobs.id, jobId))
      .returning();

    return NextResponse.json({ job: updatedJob[0] });
  } catch (error) {
    console.error("Error updating caption job:", error);
    return NextResponse.json(
      { error: "Failed to update caption job" },
      { status: 500 }
    );
  }
}
