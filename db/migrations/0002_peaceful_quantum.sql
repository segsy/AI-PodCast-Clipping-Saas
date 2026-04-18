-- Migration: Add scheduled_posts table for social media scheduling
-- Create enum types if they don't exist
DO $ BEGIN
    CREATE TYPE "public"."platform" AS ENUM('YOUTUBE', 'TIKTOK', 'INSTAGRAM', 'FACEBOOK', 'TWITTER', 'LINKEDIN', 'PINTEREST', 'SNAPCHAT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $;

DO $ BEGIN
    CREATE TYPE "public"."post_status" AS ENUM('DRAFT', 'SCHEDULED', 'PUBLISHED', 'FAILED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $;

-- Create scheduled_posts table
CREATE TABLE IF NOT EXISTS "scheduled_posts" (
    "id" text PRIMARY KEY NOT NULL,
    "workspace_id" text NOT NULL,
    "user_id" text,
    "project_id" text,
    "clip_id" text,
    "title" text NOT NULL,
    "description" text,
    "platform" "platform" NOT NULL,
    "social_account_id" text,
    "scheduled_at" timestamp with time zone NOT NULL,
    "status" "post_status" NOT NULL DEFAULT 'DRAFT',
    "published_at" timestamp with time zone,
    "post_url" text,
    "media_urls" text[],
    "caption" text,
    "hashtags" text[],
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "scheduled_posts_workspace_idx" ON "scheduled_posts" USING btree ("workspace_id");
CREATE INDEX IF NOT EXISTS "scheduled_posts_scheduled_at_idx" ON "scheduled_posts" USING btree ("scheduled_at");
CREATE INDEX IF NOT EXISTS "scheduled_posts_status_idx" ON "scheduled_posts" USING btree ("status");
CREATE INDEX IF NOT EXISTS "scheduled_posts_platform_idx" ON "scheduled_posts" USING btree ("platform");
CREATE INDEX IF NOT EXISTS "scheduled_posts_created_at_idx" ON "scheduled_posts" USING btree ("created_at");
