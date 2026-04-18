ALTER TABLE "uploads" ALTER COLUMN "project_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "cms_pages" ADD COLUMN "content" text;