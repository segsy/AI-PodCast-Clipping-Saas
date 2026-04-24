import { db } from '../db';
import { cmsMenus } from '../db/schema';

const workspaceId = 'ws_8a548caf-02c3-4f40-ac85-1c193fa4ee5a';
const userId = 'user_bfcbc510-843e-4b1f-a32a-b1feeb9b4a28';

const menuItems = [
  // Features
  { category: 'features', name: 'ClipAnything', href: '/features/clipanything', description: 'The fastest way to turn any video into viral shorts', icon: 'Scissors', sortOrder: 1 },
  { category: 'features', name: 'Animated captions', href: '/features/animated-captions', description: 'The fastest way to add animated captions', icon: 'Type', sortOrder: 2 },
  { category: 'features', name: 'AI Reframe', href: '/features/ai-reframe', description: 'Resize any video for every platform in 1 click', icon: 'Maximize2', sortOrder: 3 },
  { category: 'features', name: 'AI B-Roll', href: '/features/ai-broll', description: 'Get relevant AI B-Roll in 1 click, under 1 minute', icon: 'Play', sortOrder: 4 },
  { category: 'features', name: 'Social Scheduler', href: '/features/social-scheduler', description: 'Schedule a month\'s post to all platforms in 10 minutes', icon: 'Calendar', sortOrder: 5 },
  { category: 'features', name: 'Brand template', href: '/features/brand-template', description: 'Easily create and add brand templates in 1 click', icon: 'Palette', sortOrder: 6 },
  { category: 'features', name: 'Editor', href: '/features/editor', description: 'All-in-one AI editor. No editing skills required', icon: 'Layout', sortOrder: 7 },
  { category: 'features', name: 'Export to XML', href: '/features/export-xml', description: 'Schedule a month\'s post to all platforms in 10 minutes', icon: 'FileCode', sortOrder: 8 },
  { category: 'features', name: 'Team workspace', href: '/features/team-workspace', description: 'Maximize your team\'s productivity with AI', icon: 'Users', sortOrder: 9 },
  { category: 'features', name: 'Thumbnail generator', href: '/features/thumbnail-generator', description: 'Drop a link & get YouTube thumbnail in 1 click', icon: 'Image', sortOrder: 10 },
  // Solutions
  { category: 'solutions', name: 'Creators', href: '/solutions?tab=creators', description: 'Fastest way to gain your next 1 million views without burnout', icon: 'Mic', sortOrder: 1 },
  { category: 'solutions', name: 'Media & entertainment', href: '/solutions?tab=media', description: 'Streamline video creation workflow & reach 10x more audiences', icon: 'Video', sortOrder: 2 },
  { category: 'solutions', name: 'Marketers', href: '/solutions?tab=marketers', description: 'Make every marketer a pro video editor', icon: 'Target', sortOrder: 3 },
  { category: 'solutions', name: 'Podcasters', href: '/solutions?tab=podcasters', description: 'Get your next 1 million views in weeks via consistent posting', icon: 'Mic2', sortOrder: 4 },
  { category: 'solutions', name: 'Agencies', href: '/solutions?tab=agencies', description: 'Scale your business and save $2,700 monthly on editing cost', icon: 'Briefcase', sortOrder: 5 },
  { category: 'solutions', name: 'Livestreamers', href: '/solutions?tab=livestreamers', description: 'Drive more traffic back to your livestreams through shorts', icon: 'Monitor', sortOrder: 6 },
  { category: 'solutions', name: 'Advertisers', href: '/solutions?tab=advertisers', description: 'Create high-performing ad creatives at scale', icon: 'Megaphone', sortOrder: 7 },
  { category: 'solutions', name: 'Church', href: '/solutions?tab=church', description: 'Evangelize digitally to reach more people & get more donations', icon: 'Church', sortOrder: 8 },
  { category: 'solutions', name: 'E-commerce', href: '/solutions?tab=ecommerce', description: 'Sell more products & increase exposure with viral shorts', icon: 'ShoppingCart', sortOrder: 9 },
  { category: 'solutions', name: 'Real estate', href: '/solutions?tab=realestate', description: 'Get more leads through shorts to become the top-selling realtor', icon: 'Home', sortOrder: 10 },
  // Resources
  { category: 'resources', name: 'Customer Stories', href: '/resources/customer-stories', description: '', icon: 'Users', sortOrder: 1 },
  { category: 'resources', name: 'Learning Center', href: '/resources/learning-center', description: '', icon: 'BookOpen', sortOrder: 2 },
  { category: 'resources', name: 'Product Changelog', href: '/resources/changelog', description: '', icon: 'Clock', sortOrder: 3 },
  { category: 'resources', name: 'Blog', href: '/resources/blog', description: '', icon: 'FileText', sortOrder: 4 },
  { category: 'resources', name: 'Help Center', href: '/resources/help-center', description: '', icon: 'Folder', sortOrder: 5 },
];

async function addMenuItems() {
  for (const item of menuItems) {
    try {
      await db.insert(cmsMenus).values({
        id: crypto.randomUUID(),
        workspaceId,
        ...item,
        isActive: true,
        createdBy: userId,
      });
      console.log(`Added ${item.name}`);
    } catch (error) {
      console.error(`Failed to add ${item.name}:`, error);
    }
  }
}

addMenuItems().then(() => process.exit(0));