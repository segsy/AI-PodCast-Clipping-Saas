import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getActiveWorkspaceId } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // First try to get workspace ID from query params (client-side)
    const searchParams = request.nextUrl.searchParams;
    let workspaceId = searchParams.get("workspaceId");

    // If not in query params, try to get from session (server-side)
    if (!workspaceId) {
      workspaceId = await getActiveWorkspaceId();
    }

    if (!workspaceId) {
      return NextResponse.json({ error: "Workspace ID required" }, { status: 400 });
    }

    const projectList = await db
      .select({
        id: projects.id,
        name: projects.name,
        description: projects.description,
        createdAt: projects.createdAt,
        updatedAt: projects.updatedAt,
      })
      .from(projects)
      .where(eq(projects.workspaceId, workspaceId))
      .orderBy(projects.createdAt);

    return NextResponse.json({ projects: projectList }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'Pragma': 'no-cache',
      },
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { workspaceId, name, description, createdBy } = body;

    if (!workspaceId || !name || !createdBy) {
      return NextResponse.json(
        { error: "Workspace ID, name, and createdBy are required" },
        { status: 400 }
      );
    }

    const newProject = await db
      .insert(projects)
      .values({
        id: crypto.randomUUID(),
        workspaceId,
        name,
        description,
        createdBy,
      })
      .returning();

    return NextResponse.json({ project: newProject[0] });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
