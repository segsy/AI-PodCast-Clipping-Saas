/** @type {import('next').NextConfig} */
const nextConfig = {
  // Explicitly set the dev server port to 3000
  // This ensures Turbopack uses port 3000 to match NEXTAUTH_URL
  
  // For Next.js 15+ with Turbopack, use the CLI flag instead:
  // next dev --turbopack -p 3000
  // 
  // This config ensures consistency when not using Turbopack
  reactStrictMode: true,
};

module.exports = nextConfig;
