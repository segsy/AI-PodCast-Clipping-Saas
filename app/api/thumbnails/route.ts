import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { thumbnailJobs, uploads, creditsBalance, creditsLedger } from "@/db/schema";
import { eq, and, desc, count } from "drizzle-orm";
import { getActiveWorkspaceId, getCurrentUserId } from "@/lib/auth";

// Credit costs
const CREDIT_COST_PER_THUMBNAIL = 10;
const DEFAULT_VARIANTS = 3;

// GET - List all thumbnail jobs for workspace
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

    const conditions = [eq(thumbnailJobs.workspaceId, workspaceId)];

    if (status) {
      conditions.push(eq(thumbnailJobs.status, status.toUpperCase() as any));
    }

    const whereClause = and(...conditions);

    // Get total count
    const totalCount = await db
      .select({ count: count() })
      .from(thumbnailJobs)
      .where(whereClause);

    // Get thumbnail jobs with upload info
    const jobs = await db
      .select({
        id: thumbnailJobs.id,
        status: thumbnailJobs.status,
        style: thumbnailJobs.style,
        aspectRatio: thumbnailJobs.aspectRatio,
        titleText: thumbnailJobs.titleText,
        addTitle: thumbnailJobs.addTitle,
        addEpisodeNumber: thumbnailJobs.addEpisodeNumber,
        addGlowEffect: thumbnailJobs.addGlowEffect,
        aiModel: thumbnailJobs.aiModel,
        creditsUsed: thumbnailJobs.creditsUsed,
        generatedVariants: thumbnailJobs.generatedVariants,
        s3Key: thumbnailJobs.s3Key,
        errorMessage: thumbnailJobs.errorMessage,
        createdAt: thumbnailJobs.createdAt,
        updatedAt: thumbnailJobs.updatedAt,
        uploadId: thumbnailJobs.uploadId,
        projectId: thumbnailJobs.projectId,
        filename: uploads.filename,
      })
      .from(thumbnailJobs)
      .leftJoin(uploads, eq(thumbnailJobs.uploadId, uploads.id))
      .where(whereClause)
      .orderBy(desc(thumbnailJobs.createdAt))
      .limit(limit)
      .offset((page - 1) * limit);

    // Get status counts
    const statusCounts = await db
      .select({
        status: thumbnailJobs.status,
        count: count(),
      })
      .from(thumbnailJobs)
      .where(eq(thumbnailJobs.workspaceId, workspaceId))
      .groupBy(thumbnailJobs.status);

    // Get credit balance
    const credits = await db
      .select()
      .from(creditsBalance)
      .where(eq(creditsBalance.workspaceId, workspaceId))
      .limit(1);

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
    console.error("Error fetching thumbnail jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch thumbnail jobs" },
      { status: 500 }
    );
  }
}

// POST - Create a new thumbnail generation job
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
      aspectRatio, 
      titleText,
      addTitle,
      addEpisodeNumber,
      addGlowEffect,
      aiModel,
      variants 
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
    const numVariants = variants || DEFAULT_VARIANTS;
    const creditsNeeded = numVariants * CREDIT_COST_PER_THUMBNAIL;

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
        memo: `Thumbnail generation - ${creditsNeeded} credits reserved (${numVariants} variants)`,
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

    // Create thumbnail job
    const job = await db
      .insert(thumbnailJobs)
      .values({
        id: `thumbjob_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        workspaceId,
        uploadId,
        projectId: projectId || upload[0].projectId,
        status: "PENDING",
        style: style || "vibrant",
        aspectRatio: aspectRatio || "16:9",
        titleText: titleText || "",
        addTitle: addTitle ?? true,
        addEpisodeNumber: addEpisodeNumber ?? true,
        addGlowEffect: addGlowEffect ?? false,
        aiModel: aiModel || "gemini",
        creditsUsed: creditsNeeded,
        generatedVariants: [],
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
    console.error("Error creating thumbnail job:", error);
    return NextResponse.json(
      { error: "Failed to create thumbnail job" },
      { status: 500 }
    );
  }
}

// PUT - Update thumbnail job status (for webhooks from worker)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobId, status, s3Key, generatedVariants, errorMessage } = body;

    if (!jobId) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 }
      );
    }

    const job = await db
      .select()
      .from(thumbnailJobs)
      .where(eq(thumbnailJobs.id, jobId))
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

    if (generatedVariants) {
      updateData.generatedVariants = generatedVariants;
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
            memo: "Thumbnail job failed - credits released",
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
          memo: "Thumbnail job completed",
        });
    }

    const updatedJob = await db
      .update(thumbnailJobs)
      .set(updateData)
      .where(eq(thumbnailJobs.id, jobId))
      .returning();

    return NextResponse.json({ job: updatedJob[0] });
  } catch (error) {
    console.error("Error updating thumbnail job:", error);
    return NextResponse.json(
      { error: "Failed to update thumbnail job" },
      { status: 500 }
    );
  }
}
