import "dotenv/config";
import { db, cmsMenus, cmsPages, cmsPageSections, workspaces, adminUsersTable } from "../db";
import { eq } from "drizzle-orm";
import puppeteer from "puppeteer";

// Define the menu items from the task
const menuItems = [
  // Features
  { category: "features", name: "ClipAnything", href: "/features/clipanything" },
  { category: "features", name: "Animated Captions", href: "/features/animated-captions" },
  { category: "features", name: "AI Reframe", href: "/features/ai-reframe" },
  { category: "features", name: "AI B-Roll", href: "/features/ai-broll" },
  { category: "features", name: "Social Scheduler", href: "/features/social-scheduler" },
  { category: "features", name: "Brand Template", href: "/features/brand-template" },

  // Solutions - these are dynamic with tabs
  { category: "solutions", name: "Creators", href: "/solutions?tab=creators" },
  { category: "solutions", name: "Media", href: "/solutions?tab=media" },
  { category: "solutions", name: "Marketers", href: "/solutions?tab=marketers" },
  { category: "solutions", name: "Podcasters", href: "/solutions?tab=podcasters" },
  { category: "solutions", name: "Agencies", href: "/solutions?tab=agencies" },
  { category: "solutions", name: "Livestreamers", href: "/solutions?tab=livestreamers" },

  // Resources
  { category: "resources", name: "Customer Stories", href: "/resources/customer-stories" },
  { category: "resources", name: "Learning Center", href: "/resources/learning-center" },
  { category: "resources", name: "Changelog", href: "/resources/changelog" },
  { category: "resources", name: "Blog", href: "/resources/blog" },
  { category: "resources", name: "Help Center", href: "/resources/help-center" },

  // Case Studies
  { category: "case-studies", name: "Marketing Agencies", href: "/resources/case-studies/marketing-agencies" },
  { category: "case-studies", name: "Creators Views", href: "/resources/case-studies/creators-views" },
];

async function extractContentFromUrl(url: string): Promise<string> {
  const browser = await puppeteer.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Wait a bit for dynamic content to load
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Extract the main content - look for common content containers
    const content = await page.evaluate(() => {
      // Try to find main content areas
      const selectors = [
        'main',
        '[data-content]',
        '.content',
        '#content',
        'article',
        '.prose',
        'body'
      ];

      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element && element.textContent && element.textContent.trim().length > 100) {
          return element.textContent.trim();
        }
      }

      // Fallback to body text
      return document.body.textContent?.trim() || '';
    });

    return content;
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    return "";
  } finally {
    await browser.close();
  }
}

async function main() {
  console.log("Starting content scraping...");

  // Get or create a default workspace (assuming there's a default one)
  const workspaceList = await db.select().from(workspaces).limit(1);
  if (workspaceList.length === 0) {
    console.error("No workspace found");
    return;
  }
  const workspaceId = workspaceList[0].id;

  // Get admin user
  const adminUsers = await db.select().from(adminUsersTable).limit(1);
  if (adminUsers.length === 0) {
    console.error("No admin user found");
    return;
  }
  const createdBy = adminUsers[0].userId;

  for (let i = 0; i < menuItems.length; i++) {
    const item = menuItems[i];

    console.log(`Processing ${item.name}...`);

    // Extract content from URL
    const url = `http://localhost:3000${item.href}`;
    const content = await extractContentFromUrl(url);

    // Create CMS page
    const pageId = crypto.randomUUID();
    await db.insert(cmsPages).values({
      id: pageId,
      workspaceId,
      title: item.name,
      slug: item.href.replace("/", "").replace("?", "-").replace("/", "-"),
      content,
      status: "PUBLISHED",
      createdBy,
    });

    // Create menu item
    await db.insert(cmsMenus).values({
      id: crypto.randomUUID(),
      workspaceId,
      category: item.category,
      name: item.name,
      href: item.href,
      sortOrder: i,
      isActive: true,
      createdBy,
    });

    console.log(`Created page and menu for ${item.name}`);
  }

  console.log("Content scraping completed!");
}

main().catch(console.error);