import { NextRequest, NextResponse } from "next/server";

// Mock CMS data for demonstration
const mockPages: Record<string, any> = {
  "features-clipanything": {
    id: "1",
    title: "ClipAnything - AI-Powered Video Clipping",
    slug: "features-clipanything",
    content: `
      <div style="max-width: 800px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; border-radius: 16px; margin-bottom: 40px; text-align: center;">
          <h1 style="font-size: 48px; font-weight: bold; margin-bottom: 16px;">ClipAnything</h1>
          <p style="font-size: 20px; opacity: 0.9;">Transform any video into viral clips with AI</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin-bottom: 40px;">
          <div style="background: white; padding: 24px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h3 style="font-size: 24px; font-weight: bold; margin-bottom: 12px;">AI-Powered Detection</h3>
            <p>Our AI automatically identifies the most engaging moments in your videos - hooks, punchlines, key insights, and emotional peaks.</p>
          </div>
          <div style="background: white; padding: 24px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h3 style="font-size: 24px; font-weight: bold; margin-bottom: 12px;">One-Click Viral Clips</h3>
            <p>Transform long-form content into platform-optimized shorts in a single click. Perfect for TikTok, Instagram Reels, and YouTube Shorts.</p>
          </div>
        </div>

        <div style="text-align: center;">
          <a href="/" style="background: #667eea; color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: bold;">Get Started</a>
        </div>
      </div>
    `,
    seo: { title: "ClipAnything - AI Video Clipping Tool" },
    publishedAt: new Date().toISOString(),
  }
};

// GET - Fetch published CMS pages for frontend
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        { error: "Slug parameter is required" },
        { status: 400 }
      );
    }

    // Try database first (commented out since no DB connection)
    /*
    const page = await db
      .select({...})
      .from(cmsPages)
      .where(eq(cmsPages.slug, slug))
      .limit(1);

    if (page.length > 0) {
      return NextResponse.json({ page: page[0] });
    }
    */

    // Fallback to mock data
    const mockPage = mockPages[slug];
    if (mockPage) {
      return NextResponse.json({ page: mockPage });
    }

    return NextResponse.json(
      { error: "Page not found" },
      { status: 404 }
    );
  } catch (error: any) {
    console.error("Error fetching CMS page:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch page" },
      { status: 500 }
    );
  }
}