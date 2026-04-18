CREATE TYPE "public"."platform" AS ENUM('YOUTUBE', 'TIKTOK', 'INSTAGRAM', 'FACEBOOK', 'TWITTER', 'LINKEDIN', 'PINTEREST', 'SNAPCHAT');--> statement-breakpoint
CREATE TYPE "public"."post_status" AS ENUM('DRAFT', 'SCHEDULED', 'PUBLISHED', 'FAILED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."social_account_status" AS ENUM('CONNECTED', 'DISCONNECTED', 'EXPIRED', 'ERROR');--> statement-breakpoint
CREATE TABLE "analytics_summary" (
	"id" text PRIMARY KEY NOT NULL,
	"workspace_id" text NOT NULL,
	"platform" "platform",
	"date" timestamp with time zone NOT NULL,
	"total_views" bigint DEFAULT 0 NOT NULL,
	"total_likes" bigint DEFAULT 0 NOT NULL,
	"total_shares" bigint DEFAULT 0 NOT NULL,
	"total_comments" bigint DEFAULT 0 NOT NULL,
	"new_followers" bigint DEFAULT 0 NOT NULL,
	"avg_watch_time" double precision DEFAULT 0 NOT NULL,
	"total_videos" integer DEFAULT 0 NOT NULL,
	"engagement_rate" double precision DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "asset_library" (
	"id" text PRIMARY KEY NOT NULL,
	"workspace_id" text NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"s3_key" text NOT NULL,
	"url" text,
	"thumbnail_url" text,
	"bytes" bigint,
	"content_type" text,
	"width" integer,
	"height" integer,
	"duration_sec" integer,
	"folder" text,
	"tags" text[],
	"created_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_methods" (
	"id" text PRIMARY KEY NOT NULL,
	"workspace_id" text NOT NULL,
	"stripe_payment_method_id" text,
	"type" text NOT NULL,
	"brand" text,
	"last4" text,
	"expiry_month" integer,
	"expiry_year" integer,
	"is_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "payment_methods_stripe_payment_method_id_unique" UNIQUE("stripe_payment_method_id")
);
--> statement-breakpoint
CREATE TABLE "scheduled_posts" (
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
	"status" "post_status" DEFAULT 'DRAFT' NOT NULL,
	"published_at" timestamp with time zone,
	"post_url" text,
	"media_urls" text[],
	"caption" text,
	"hashtags" text[],
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "social_accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"workspace_id" text NOT NULL,
	"user_id" text,
	"platform" "platform" NOT NULL,
	"platform_account_id" text NOT NULL,
	"platform_username" text,
	"platform_profile_url" text,
	"platform_profile_image" text,
	"access_token" text,
	"refresh_token" text,
	"token_expires_at" timestamp with time zone,
	"status" "social_account_status" DEFAULT 'CONNECTED' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "analytics_summary" ADD CONSTRAINT "analytics_summary_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset_library" ADD CONSTRAINT "asset_library_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset_library" ADD CONSTRAINT "asset_library_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_methods" ADD CONSTRAINT "payment_methods_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scheduled_posts" ADD CONSTRAINT "scheduled_posts_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scheduled_posts" ADD CONSTRAINT "scheduled_posts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scheduled_posts" ADD CONSTRAINT "scheduled_posts_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scheduled_posts" ADD CONSTRAINT "scheduled_posts_clip_id_clips_id_fk" FOREIGN KEY ("clip_id") REFERENCES "public"."clips"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scheduled_posts" ADD CONSTRAINT "scheduled_posts_social_account_id_social_accounts_id_fk" FOREIGN KEY ("social_account_id") REFERENCES "public"."social_accounts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "social_accounts" ADD CONSTRAINT "social_accounts_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "social_accounts" ADD CONSTRAINT "social_accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "analytics_summary_workspace_idx" ON "analytics_summary" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "analytics_summary_date_idx" ON "analytics_summary" USING btree ("date");--> statement-breakpoint
CREATE INDEX "analytics_summary_platform_idx" ON "analytics_summary" USING btree ("platform");--> statement-breakpoint
CREATE INDEX "asset_library_workspace_idx" ON "asset_library" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "asset_library_folder_idx" ON "asset_library" USING btree ("folder");--> statement-breakpoint
CREATE INDEX "payment_methods_workspace_idx" ON "payment_methods" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "scheduled_posts_workspace_idx" ON "scheduled_posts" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "scheduled_posts_scheduled_at_idx" ON "scheduled_posts" USING btree ("scheduled_at");--> statement-breakpoint
CREATE INDEX "scheduled_posts_status_idx" ON "scheduled_posts" USING btree ("status");--> statement-breakpoint
CREATE INDEX "social_accounts_workspace_idx" ON "social_accounts" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "social_accounts_platform_idx" ON "social_accounts" USING btree ("platform");