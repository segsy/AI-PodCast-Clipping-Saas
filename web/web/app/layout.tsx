import "./globals.css";
import type { ReactNode } from "react";
import { Providers } from "@/components/providers";

export const metadata = {
  title: "AI Podcast - Turn Your Podcast Into Viral Shorts",
  description: "AI-powered video clipping that helps you reach millions of new viewers. No editing skills required.",
  keywords: "podcast, video clipping, AI, viral videos, content creation",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-white antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
