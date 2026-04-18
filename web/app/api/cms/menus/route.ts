import { NextRequest, NextResponse } from "next/server";

// Mock CMS menu data for demonstration
const mockMenus = {
  features: [
    { id: "1", category: "features", name: "ClipAnything", href: "/features/clipanything", description: "AI-powered video clipping", sortOrder: 0 },
    { id: "2", category: "features", name: "Animated Captions", href: "/features/animated-captions", description: "Dynamic text overlays", sortOrder: 1 },
    { id: "3", category: "features", name: "AI Reframe", href: "/features/ai-reframe", description: "Smart cropping and reframing", sortOrder: 2 },
  ],
  solutions: [
    { id: "4", category: "solutions", name: "Creators", href: "/solutions?tab=creators", description: "For content creators", sortOrder: 0 },
    { id: "5", category: "solutions", name: "Marketers", href: "/solutions?tab=marketers", description: "For marketing teams", sortOrder: 1 },
  ],
  resources: [
    { id: "6", category: "resources", name: "Blog", href: "/resources/blog", description: "Latest articles and guides", sortOrder: 0 },
    { id: "7", category: "resources", name: "Help Center", href: "/resources/help-center", description: "Support and documentation", sortOrder: 1 },
  ]
};

// GET - Fetch active CMS menus for frontend
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");

    // Try database first (commented out since no DB connection)
    /*
    const menus = await db.select(...).from(cmsMenus)...
    if (menus.length > 0) {
      return NextResponse.json({ menus: groupedMenus });
    }
    */

    // Fallback to mock data
    if (category && mockMenus[category as keyof typeof mockMenus]) {
      return NextResponse.json({
        menus: { [category]: mockMenus[category as keyof typeof mockMenus] }
      });
    }

    return NextResponse.json({ menus: mockMenus });
  } catch (error: any) {
    console.error("Error fetching CMS menus:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch menus" },
      { status: 500 }
    );
  }
}