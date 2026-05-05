import {
  pgTable,
  text,
  timestamp,
  integer,
  bigint,
  boolean,
  doublePrecision,
  jsonb,
  pgEnum,
  serial,
  varchar,
  primaryKey,
  index,
  uniqueIndex,
  date,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============================================================================
// ENUMS
// ============================================================================

export const jobStatusEnum = pgEnum("job_status", [
  "UPLOAD_READY",
  "UPLOAD_COMPLETE",
  "QUEUED",
  "PREPROCESS",
  "TRANSCRIBE",
  "SEGMENT_DETECT",
  "SCENE_SPEAKER",
  "RENDER",
  "THUMBNAILS",
  "PUBLISH_READY",
  "DONE",
  "FAILED",
  "CANCELLED",
]);

export const uploadStatusEnum = pgEnum("upload_status", [
  "UPLOAD_READY",
  "UPLOADING",
  "UPLOAD_COMPLETE",
  "FAILED",
]);

export const clipStatusEnum = pgEnum("clip_status", [
  "PENDING",
  "RENDERING",
  "READY",
  "FAILED",
  "ARCHIVED",
]);

export const assetTypeEnum = pgEnum("asset_type", [
  "MP4",
  "THUMBNAIL",
  "CAPTIONS_SRT",
  "CAPTIONS_JSON",
  "TRANSCRIPT_JSON",
  "SEGMENTS_JSON",
  "WAVEFORM_JSON",
  "PREVIEW_GIF",
  "EXPORT_XML",
]);

export const memberRoleEnum = pgEnum("member_role", [
  "OWNER",
  "ADMIN",
  "MEMBER",
  "VIEWER",
]);

export const adminRoleEnum = pgEnum("admin_role", [
  "SUPER_ADMIN",
  "ADMIN",
  "SUPPORT",
  "ANALYST",
]);

export const ledgerReasonEnum = pgEnum("ledger_reason", [
  "JOB_RESERVE",
  "JOB_FINALIZE",
  "JOB_RELEASE",
  "CREDITS_PURCHASE",
  "REFUND",
  "ADJUSTMENT",
]);

export const planIntervalEnum = pgEnum("plan_interval", ["MONTHLY", "ANNUAL"]);

export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "TRIALING",
  "ACTIVE",
  "PAST_DUE",
  "CANCELLED",
  "UNPAID",
]);

export const leadStatusEnum = pgEnum("lead_status", [
  "NEW",
  "IN_PROGRESS",
  "WON",
  "LOST",
  "SPAM",
]);

export const eventSourceEnum = pgEnum("event_source", [
  "WEB",
  "ADMIN",
  "WORKER",
  "STRIPE",
  "SYSTEM",
]);

export const pageStatusEnum = pgEnum("page_status", [
  "DRAFT",
  "PUBLISHED",
  "SCHEDULED",
]);

export const resourceTypeEnum = pgEnum("resource_type", [
  "BLOG",
  "CUSTOMER_STORY",
  "LEARNING",
  "HELP",
  "CHANGELOG",
]);

export const platformEnum = pgEnum("platform", [
  "YOUTUBE",
  "TIKTOK",
  "INSTAGRAM",
  "FACEBOOK",
  "TWITTER",
  "LINKEDIN",
  "PINTEREST",
  "SNAPCHAT",
]);

export const postStatusEnum = pgEnum("post_status", [
  "DRAFT",
  "SCHEDULED",
  "PUBLISHED",
  "FAILED",
  "CANCELLED",
]);

export const socialAccountStatusEnum = pgEnum("social_account_status", [
  "CONNECTED",
  "DISCONNECTED",
  "EXPIRED",
  "ERROR",
]);

// ============================================================================
// 3) Organization + Auth tables
// ============================================================================

export const users = pgTable("users", {
  id: text("id").primaryKey(),

  // Auth.js requires email
  email: text("email").unique().notNull(),

  // Auth.js optional fields
  name: text("name"),
  image: text("image"), // NEW (Auth.js uses this)

  // Password for credentials auth
  password: text("password"),

  // Keep your existing app field
  avatarUrl: text("avatar_url"), // keep if your app uses it

  // Auth.js optional but recommended
  emailVerified: timestamp("email_verified", { withTimezone: true }), // NEW

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const workspaces = pgTable("workspaces", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").unique().notNull(),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const workspaceMembers = pgTable(
  "workspace_members",
  {
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: memberRoleEnum("role").notNull().default("MEMBER"),
    status: text("status").notNull().default("ACTIVE"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
  pk: primaryKey({ columns: [table.workspaceId, table.userId] }),
})
);

export const adminUsersTable = pgTable("admin_users", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  role: adminRoleEnum("role").notNull().default("ADMIN"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// Team Invitations
export const teamInvitations = pgTable("team_invitations", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  role: memberRoleEnum("role").notNull().default("MEMBER"),
  status: text("status").notNull().default("PENDING"),
  invitedBy: text("invited_by")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (table) => ({
  workspaceIdx: index("team_invitations_workspace_idx").on(table.workspaceId),
}));

// AI Caption Generation Jobs
export const captionJobs = pgTable("caption_jobs", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  uploadId: text("upload_id").references(() => uploads.id, { onDelete: "cascade" }),
  projectId: text("project_id").references(() => projects.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("PENDING"),
  style: text("style").notNull().default("modern"),
  fontSize: text("font_size").notNull().default("medium"),
  showTimestamps: boolean("show_timestamps").notNull().default(true),
  speakerIdentification: boolean("speaker_identification").notNull().default(true),
  soundEffects: boolean("sound_effects").notNull().default(false),
  aiModel: text("ai_model").notNull().default("gemini"),
  creditsUsed: integer("credits_used").notNull().default(0),
  durationSec: integer("duration_sec"),
  s3Key: text("s3_key"),
  errorMessage: text("error_message"),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (table) => ({
  workspaceIdx: index("caption_jobs_workspace_idx").on(table.workspaceId),
}));

// AI Thumbnail Generation Jobs
export const thumbnailJobs = pgTable("thumbnail_jobs", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  uploadId: text("upload_id").references(() => uploads.id, { onDelete: "cascade" }),
  projectId: text("project_id").references(() => projects.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("PENDING"),
  style: text("style").notNull().default("vibrant"),
  aspectRatio: text("aspect_ratio").notNull().default("16:9"),
  titleText: text("title_text"),
  addTitle: boolean("add_title").notNull().default(true),
  addEpisodeNumber: boolean("add_episode_number").notNull().default(true),
  addGlowEffect: boolean("add_glow_effect").notNull().default(false),
  aiModel: text("ai_model").notNull().default("gemini"),
  creditsUsed: integer("credits_used").notNull().default(0),
  generatedVariants: jsonb("generated_variants").notNull().default([]),
  s3Key: text("s3_key"),
  errorMessage: text("error_message"),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (table) => ({
  workspaceIdx: index("thumbnail_jobs_workspace_idx").on(table.workspaceId),
}));

// ============================================================================
// 4) Projects + Uploads + Jobs + Clips + Assets
// ============================================================================

export const projects = pgTable("projects", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (table) => ({
  workspaceIdx: index("projects_workspace_idx").on(table.workspaceId),
}));

export const uploads = pgTable("uploads", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  projectId: text("project_id")
    .references(() => projects.id, { onDelete: "cascade" }),
  status: uploadStatusEnum("status").notNull().default("UPLOAD_READY"),
  filename: text("filename").notNull(),
  contentType: text("content_type").notNull(),
  bytes: bigint("bytes", { mode: "number" }).notNull(),
  durationSec: integer("duration_sec"),
  s3Key: text("s3_key").notNull(),
  etag: text("etag"),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (table) => ({
  projectIdx: index("uploads_project_idx").on(table.projectId),
  workspaceIdx: index("uploads_workspace_idx").on(table.workspaceId),
}));

export const clipJobs = pgTable("clip_jobs", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  uploadId: text("upload_id")
    .notNull()
    .references(() => uploads.id, { onDelete: "cascade" }),
  status: jobStatusEnum("status").notNull().default("UPLOAD_READY"),
  stage: text("stage").notNull().default("init"),
  progress: integer("progress").notNull().default(0),
  optionsJson: jsonb("options_json").notNull().default("{}"),
  pipelineVersion: text("pipeline_version").notNull().default("v1"),
  reservedCredits: integer("reserved_credits").notNull().default(0),
  finalCredits: integer("final_credits").notNull().default(0),
  lastHeartbeatAt: timestamp("last_heartbeat_at", { withTimezone: true }),
  startedAt: timestamp("started_at", { withTimezone: true }),
  finishedAt: timestamp("finished_at", { withTimezone: true }),
  failureCode: text("failure_code"),
  failureMessage: text("failure_message"),
  failureRetryable: boolean("failure_retryable").notNull().default(false),
  idempotencyKey: text("idempotency_key"),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (table) => ({
  workspaceIdx: index("clip_jobs_workspace_idx").on(table.workspaceId),
  projectIdx: index("clip_jobs_project_idx").on(table.projectId),
  statusIdx: index("clip_jobs_status_idx").on(table.status),
}));

export const jobEvents = pgTable("job_events", {
  id: serial("id").primaryKey(),
  jobId: text("job_id")
    .notNull()
    .references(() => clipJobs.id, { onDelete: "cascade" }),
  source: eventSourceEnum("source").notNull(),
  type: text("type").notNull(),
  stage: text("stage"),
  progress: integer("progress"),
  message: text("message"),
  payload: jsonb("payload").notNull().default("{}"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (table) => ({
  jobIdx: index("job_events_job_idx").on(table.jobId),
  createdIdx: index("job_events_created_idx").on(table.createdAt),
}));

export const clips = pgTable("clips", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  jobId: text("job_id")
    .references(() => clipJobs.id, { onDelete: "cascade" }),
  title: text("title"),
  startMs: integer("start_ms").notNull(),
  endMs: integer("end_ms").notNull(),
  score: doublePrecision("score"),
  status: clipStatusEnum("status").notNull().default("PENDING"),
  variant: text("variant"),
  templateId: text("template_id"),
  captionStyleId: text("caption_style_id"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (table) => ({
  jobIdx: index("clips_job_idx").on(table.jobId),
  projectIdx: index("clips_project_idx").on(table.projectId),
}));

export const clipAssets = pgTable("clip_assets", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  clipId: text("clip_id").references(() => clips.id, { onDelete: "cascade" }),
  jobId: text("job_id")
    .notNull()
    .references(() => clipJobs.id, { onDelete: "cascade" }),
  type: assetTypeEnum("type").notNull(),
  s3Key: text("s3_key").notNull(),
  bytes: bigint("bytes", { mode: "number" }),
  contentType: text("content_type"),
  meta: jsonb("meta").notNull().default("{}"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (table) => ({
  clipIdx: index("clip_assets_clip_idx").on(table.clipId),
  jobIdx: index("clip_assets_job_idx").on(table.jobId),
  typeIdx: index("clip_assets_type_idx").on(table.type),
}));

// ============================================================================
// 5) Templates + Caption styles + Export presets
// ============================================================================

export const brandTemplates = pgTable("brand_templates", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  config: jsonb("config").notNull().default("{}"),
  isDefault: boolean("is_default").notNull().default(false),
  status: text("status").notNull().default("ACTIVE"),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const captionStyles = pgTable("caption_styles", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  config: jsonb("config").notNull().default("{}"),
  isDefault: boolean("is_default").notNull().default(false),
  status: text("status").notNull().default("ACTIVE"),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const exportPresets = pgTable("export_presets", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: assetTypeEnum("type").notNull(),
  config: jsonb("config").notNull().default("{}"),
  isDefault: boolean("is_default").notNull().default(false),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const exportsTable = pgTable("exports", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  presetId: text("preset_id").references(() => exportPresets.id),
  type: assetTypeEnum("type").notNull(),
  status: text("status").notNull().default("PENDING"),
  s3Key: text("s3_key"),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (table) => ({
  projectIdx: index("exports_project_idx").on(table.projectId),
}));

// ============================================================================
// 6) Billing: Stripe + Credits ledger
// ============================================================================

export const billingCustomers = pgTable("billing_customers", {
  workspaceId: text("workspace_id")
    .primaryKey()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  stripeCustomerId: text("stripe_customer_id").unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const subscriptions = pgTable("subscriptions", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  stripeSubscriptionId: text("stripe_subscription_id").unique(),
  status: subscriptionStatusEnum("status").notNull(),
  planId: text("plan_id"),
  interval: planIntervalEnum("interval").notNull(),
  trialEndsAt: timestamp("trial_ends_at", { withTimezone: true }),
  currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const creditsLedger = pgTable("credits_ledger", {
  id: serial("id").primaryKey(),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  jobId: text("job_id").references(() => clipJobs.id, { onDelete: "set null" }),
  stripeEventId: text("stripe_event_id"),
  delta: integer("delta").notNull(),
  reason: ledgerReasonEnum("reason").notNull(),
  memo: text("memo"),
  meta: jsonb("meta").notNull().default("{}"),
  createdBy: text("created_by"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (table) => ({
  wsIdx: index("credits_ledger_ws_idx").on(table.workspaceId),
  jobIdx: index("credits_ledger_job_idx").on(table.jobId),
}));

export const creditsBalance = pgTable("credits_balance", {
  workspaceId: text("workspace_id")
    .primaryKey()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  balance: integer("balance").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ============================================================================
// 7) Marketing CMS
// ============================================================================

export const cmsPages = pgTable("cms_pages", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").references(() => workspaces.id, {
    onDelete: "cascade",
  }),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  content: text("content"),
  status: pageStatusEnum("status").notNull().default("DRAFT"),
  seo: jsonb("seo").notNull().default("{}"),
  visibility: jsonb("visibility").notNull().default("{}"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdBy: text("created_by").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const cmsPageSections = pgTable("cms_page_sections", {
  id: text("id").primaryKey(),
  pageId: text("page_id")
    .notNull()
    .references(() => cmsPages.id, { onDelete: "cascade" }),
  sortOrder: integer("sort_order").notNull(),
  sectionType: text("section_type").notNull(),
  props: jsonb("props").notNull().default("{}"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (table) => ({
  pageIdx: index("cms_sections_page_idx").on(table.pageId),
}));

export const cmsResources = pgTable("cms_resources", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").references(() => workspaces.id, {
    onDelete: "cascade",
  }),
  type: resourceTypeEnum("type").notNull(),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  status: pageStatusEnum("status").notNull().default("DRAFT"),
  excerpt: text("excerpt"),
  coverS3Key: text("cover_s3_key"),
  body: jsonb("body").notNull().default("{}"),
  tags: text("tags").array().notNull().default([]),
  authorName: text("author_name"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  seo: jsonb("seo").notNull().default("{}"),
  createdBy: text("created_by").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const cmsMenus = pgTable("cms_menus", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").references(() => workspaces.id, {
    onDelete: "cascade",
  }),
  category: text("category").notNull(), // "features", "solutions", "resources", "pricing"
  name: text("name").notNull(),
  href: text("href").notNull(),
  description: text("description"),
  icon: text("icon"), // icon name or component
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdBy: text("created_by").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (table) => ({
  categoryIdx: index("cms_menus_category_idx").on(table.category),
}));

// ============================================================================
// 8) Leads + analytics events
// ============================================================================

export const leads = pgTable("leads", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").references(() => workspaces.id, {
    onDelete: "cascade",
  }),
  email: text("email"),
  name: text("name"),
  company: text("company"),
  message: text("message"),
  source: text("source"),
  status: leadStatusEnum("status").notNull().default("NEW"),
  utm: jsonb("utm").notNull().default("{}"),
  meta: jsonb("meta").notNull().default("{}"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (table) => ({
  createdIdx: index("leads_created_idx").on(table.createdAt),
}));

export const analyticsEvents = pgTable("analytics_events", {
  id: serial("id").primaryKey(),
  workspaceId: text("workspace_id").references(() => workspaces.id, {
    onDelete: "set null",
  }),
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
  sessionId: text("session_id"),
  name: text("name").notNull(),
  path: text("path"),
  properties: jsonb("properties").notNull().default("{}"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (table) => ({
  nameIdx: index("analytics_events_name_idx").on(table.name),
  createdIdx: index("analytics_events_created_idx").on(table.createdAt),
}));

// ============================================================================
// 9) Webhooks + audit logs
// ============================================================================

export const webhookEvents = pgTable("webhook_events", {
  id: serial("id").primaryKey(),
  provider: text("provider").notNull(),
  externalId: text("external_id"),
  payload: jsonb("payload").notNull(),
  receivedAt: timestamp("received_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  handledAt: timestamp("handled_at", { withTimezone: true }),
  status: text("status").notNull().default("RECEIVED"),
  error: text("error"),
});

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  workspaceId: text("workspace_id").references(() => workspaces.id, {
    onDelete: "set null",
  }),
  actorUserId: text("actor_user_id").references(() => users.id, {
    onDelete: "set null",
  }),
  action: text("action").notNull(),
  targetType: text("target_type"),
  targetId: text("target_id"),
  meta: jsonb("meta").notNull().default("{}"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (table) => ({
  workspaceIdx: index("audit_logs_workspace_idx").on(table.workspaceId),
  createdIdx: index("audit_logs_created_idx").on(table.createdAt),
}));

// ============================================================================
// 10) Sales transactions
// ============================================================================

export const salesTransactions = pgTable("sales_transactions", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  stripeChargeId: text("stripe_charge_id"),
  stripeInvoiceId: text("stripe_invoice_id"),
  amountCents: bigint("amount_cents", { mode: "number" }).notNull(),
  currency: text("currency").notNull().default("usd"),
  type: text("type").notNull(),
  status: text("status").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (table) => ({
  wsIdx: index("sales_transactions_ws_idx").on(table.workspaceId),
  createdIdx: index("sales_transactions_created_idx").on(table.createdAt),
}));

// ============================================================================
// 11) Social Accounts - Connected social media platforms
// ============================================================================

export const socialAccounts = pgTable("social_accounts", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  platform: platformEnum("platform").notNull(),
  platformAccountId: text("platform_account_id").notNull(),
  platformUsername: text("platform_username"),
  platformProfileUrl: text("platform_profile_url"),
  platformProfileImage: text("platform_profile_image"),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  tokenExpiresAt: timestamp("token_expires_at", { withTimezone: true }),
  status: socialAccountStatusEnum("status").notNull().default("CONNECTED"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (table) => ({
  workspaceIdx: index("social_accounts_workspace_idx").on(table.workspaceId),
  platformIdx: index("social_accounts_platform_idx").on(table.platform),
}));

// ============================================================================
// 12) Scheduled Posts - Calendar functionality
// ============================================================================

export const scheduledPosts = pgTable("scheduled_posts", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  projectId: text("project_id").references(() => projects.id, { onDelete: "cascade" }),
  clipId: text("clip_id").references(() => clips.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  platform: platformEnum("platform").notNull(),
  socialAccountId: text("social_account_id").references(() => socialAccounts.id, { onDelete: "set null" }),
  scheduledAt: timestamp("scheduled_at", { withTimezone: true }).notNull(),
  status: postStatusEnum("status").notNull().default("DRAFT"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  postUrl: text("post_url"),
  mediaUrls: text("media_urls").array(),
  caption: text("caption"),
  hashtags: text("hashtags").array(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (table) => ({
  workspaceIdx: index("scheduled_posts_workspace_idx").on(table.workspaceId),
  scheduledAtIdx: index("scheduled_posts_scheduled_at_idx").on(table.scheduledAt),
  statusIdx: index("scheduled_posts_status_idx").on(table.status),
}));

// ============================================================================
// 13) Analytics Summary - Cached analytics data
// ============================================================================

export const analyticsSummary = pgTable("analytics_summary", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  platform: platformEnum("platform"),
  date: timestamp("date", { withTimezone: true }).notNull(),
  totalViews: bigint("total_views", { mode: "number" }).notNull().default(0),
  totalLikes: bigint("total_likes", { mode: "number" }).notNull().default(0),
  totalShares: bigint("total_shares", { mode: "number" }).notNull().default(0),
  totalComments: bigint("total_comments", { mode: "number" }).notNull().default(0),
  newFollowers: bigint("new_followers", { mode: "number" }).notNull().default(0),
  avgWatchTime: doublePrecision("avg_watch_time").notNull().default(0),
  totalVideos: integer("total_videos").notNull().default(0),
  engagementRate: doublePrecision("engagement_rate").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (table) => ({
  workspaceIdx: index("analytics_summary_workspace_idx").on(table.workspaceId),
  dateIdx: index("analytics_summary_date_idx").on(table.date),
  platformIdx: index("analytics_summary_platform_idx").on(table.platform),
}));

// ============================================================================
// 14) Payment Methods
// ============================================================================

export const paymentMethods = pgTable("payment_methods", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  stripePaymentMethodId: text("stripe_payment_method_id").unique(),
  type: text("type").notNull(), // card, bank_account, etc.
  brand: text("brand"), // Visa, Mastercard, etc.
  last4: text("last4"),
  expiryMonth: integer("expiry_month"),
  expiryYear: integer("expiry_year"),
  isDefault: boolean("is_default").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (table) => ({
  workspaceIdx: index("payment_methods_workspace_idx").on(table.workspaceId),
}));

// ============================================================================
// 15) Asset Library
// ============================================================================

export const assetLibrary = pgTable("asset_library", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: text("type").notNull(), // image, video, audio, document
  s3Key: text("s3_key").notNull(),
  url: text("url"),
  thumbnailUrl: text("thumbnail_url"),
  bytes: bigint("bytes", { mode: "number" }),
  contentType: text("content_type"),
  width: integer("width"),
  height: integer("height"),
  durationSec: integer("duration_sec"),
  folder: text("folder"),
  tags: text("tags").array(),
  createdBy: text("created_by").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (table) => ({
  workspaceIdx: index("asset_library_workspace_idx").on(table.workspaceId),
  folderIdx: index("asset_library_folder_idx").on(table.folder),
}));

// ============================================================================
// RELATIONS
// ============================================================================

export const usersRelations = relations(users, ({ many }) => ({
  workspaces: many(workspaceMembers),
  adminUsers: many(adminUsersTable),
  accounts: many(accounts),
}));

export const workspacesRelations = relations(workspaces, ({ many }) => ({
  projects: many(projects),
  members: many(workspaceMembers),
  uploads: many(uploads),
  clipJobs: many(clipJobs),
  billingCustomers: many(billingCustomers),
  subscriptions: many(subscriptions),
  creditsLedger: many(creditsLedger),
  creditsBalance: many(creditsBalance),
}));

export const workspaceMembersRelations = relations(
  workspaceMembers,
  ({ one }) => ({
    workspace: one(workspaces, {
      fields: [workspaceMembers.workspaceId],
      references: [workspaces.id],
    }),
    user: one(users, {
      fields: [workspaceMembers.userId],
      references: [users.id],
    }),
  })
);

export const projectsRelations = relations(projects, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [projects.workspaceId],
    references: [workspaces.id],
  }),
  uploads: many(uploads),
  clipJobs: many(clipJobs),
  exports: many(exportsTable),
}));

export const uploadsRelations = relations(uploads, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [uploads.workspaceId],
    references: [workspaces.id],
  }),
  project: one(projects, {
    fields: [uploads.projectId],
    references: [projects.id],
  }),
}));

export const clipJobsRelations = relations(clipJobs, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [clipJobs.workspaceId],
    references: [workspaces.id],
  }),
  project: one(projects, {
    fields: [clipJobs.projectId],
    references: [projects.id],
  }),
  upload: one(uploads, {
    fields: [clipJobs.uploadId],
    references: [uploads.id],
  }),
  clips: many(clips),
  jobEvents: many(jobEvents),
  clipAssets: many(clipAssets),
}));

export const clipsRelations = relations(clips, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [clips.workspaceId],
    references: [workspaces.id],
  }),
  project: one(projects, {
    fields: [clips.projectId],
    references: [projects.id],
  }),
  job: one(clipJobs, {
    fields: [clips.jobId],
    references: [clipJobs.id],
  }),
  clipAssets: many(clipAssets),
}));

export const clipAssetsRelations = relations(clipAssets, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [clipAssets.workspaceId],
    references: [workspaces.id],
  }),
  clip: one(clips, {
    fields: [clipAssets.clipId],
    references: [clips.id],
  }),
  job: one(clipJobs, {
    fields: [clipAssets.jobId],
    references: [clipJobs.id],
  }),
}));

export const jobEventsRelations = relations(jobEvents, ({ one }) => ({
  job: one(clipJobs, {
    fields: [jobEvents.jobId],
    references: [clipJobs.id],
  }),
}));

export const brandTemplatesRelations = relations(brandTemplates, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [brandTemplates.workspaceId],
    references: [workspaces.id],
  }),
}));

export const captionStylesRelations = relations(captionStyles, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [captionStyles.workspaceId],
    references: [workspaces.id],
  }),
}));

export const exportPresetsRelations = relations(exportPresets, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [exportPresets.workspaceId],
    references: [workspaces.id],
  }),
}));

export const exportsRelations = relations(exportsTable, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [exportsTable.workspaceId],
    references: [workspaces.id],
  }),
  project: one(projects, {
    fields: [exportsTable.projectId],
    references: [projects.id],
  }),
  preset: one(exportPresets, {
    fields: [exportsTable.presetId],
    references: [exportPresets.id],
  }),
}));

export const billingCustomersRelations = relations(
  billingCustomers,
  ({ one }) => ({
    workspace: one(workspaces, {
      fields: [billingCustomers.workspaceId],
      references: [workspaces.id],
    }),
  })
);

export const subscriptionsRelations = relations(
  subscriptions,
  ({ one }) => ({
    workspace: one(workspaces, {
      fields: [subscriptions.workspaceId],
      references: [workspaces.id],
    }),
  })
);

export const creditsLedgerRelations = relations(creditsLedger, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [creditsLedger.workspaceId],
    references: [workspaces.id],
  }),
  job: one(clipJobs, {
    fields: [creditsLedger.jobId],
    references: [clipJobs.id],
  }),
}));

export const creditsBalanceRelations = relations(
  creditsBalance,
  ({ one }) => ({
    workspace: one(workspaces, {
      fields: [creditsBalance.workspaceId],
      references: [workspaces.id],
    }),
  })
);

export const cmsPagesRelations = relations(cmsPages, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [cmsPages.workspaceId],
    references: [workspaces.id],
  }),
  sections: many(cmsPageSections),
}));

export const cmsPageSectionsRelations = relations(
  cmsPageSections,
  ({ one }) => ({
    page: one(cmsPages, {
      fields: [cmsPageSections.pageId],
      references: [cmsPages.id],
    }),
  })
);

export const cmsResourcesRelations = relations(cmsResources, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [cmsResources.workspaceId],
    references: [workspaces.id],
  }),
}));

export const cmsMenusRelations = relations(cmsMenus, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [cmsMenus.workspaceId],
    references: [workspaces.id],
  }),
  creator: one(users, {
    fields: [cmsMenus.createdBy],
    references: [users.id],
  }),
}));

export const leadsRelations = relations(leads, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [leads.workspaceId],
    references: [workspaces.id],
  }),
}));

export const analyticsEventsRelations = relations(
  analyticsEvents,
  ({ one }) => ({
    workspace: one(workspaces, {
      fields: [analyticsEvents.workspaceId],
      references: [workspaces.id],
    }),
    user: one(users, {
      fields: [analyticsEvents.userId],
      references: [users.id],
    }),
  })
);

export const webhookEventsRelations = relations(webhookEvents, () => ({}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [auditLogs.workspaceId],
    references: [workspaces.id],
  }),
  actorUser: one(users, {
    fields: [auditLogs.actorUserId],
    references: [users.id],
  }),
}));

export const salesTransactionsRelations = relations(
  salesTransactions,
  ({ one }) => ({
    workspace: one(workspaces, {
      fields: [salesTransactions.workspaceId],
      references: [workspaces.id],
    }),
  })
);

// ============================================================================
// New Tables Relations
// ============================================================================

export const socialAccountsRelations = relations(socialAccounts, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [socialAccounts.workspaceId],
    references: [workspaces.id],
  }),
  user: one(users, {
    fields: [socialAccounts.userId],
    references: [users.id],
  }),
}));

export const scheduledPostsRelations = relations(scheduledPosts, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [scheduledPosts.workspaceId],
    references: [workspaces.id],
  }),
  user: one(users, {
    fields: [scheduledPosts.userId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [scheduledPosts.projectId],
    references: [projects.id],
  }),
  clip: one(clips, {
    fields: [scheduledPosts.clipId],
    references: [clips.id],
  }),
  socialAccount: one(socialAccounts, {
    fields: [scheduledPosts.socialAccountId],
    references: [socialAccounts.id],
  }),
}));

export const analyticsSummaryRelations = relations(analyticsSummary, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [analyticsSummary.workspaceId],
    references: [workspaces.id],
  }),
}));

export const paymentMethodsRelations = relations(paymentMethods, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [paymentMethods.workspaceId],
    references: [workspaces.id],
  }),
}));

export const assetLibraryRelations = relations(assetLibrary, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [assetLibrary.workspaceId],
    references: [workspaces.id],
  }),
  creator: one(users, {
    fields: [assetLibrary.createdBy],
    references: [users.id],
  }),
}));

// ============================================================================
// BETTER-AUTH TABLES
// ============================================================================

// ============================================================================
// Auth.js / NextAuth tables (required for DrizzleAdapter)
// ============================================================================

export const accounts = pgTable(
  "accounts",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),

    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.provider, table.providerAccountId] }),
    userIdx: index("accounts_user_idx").on(table.userId),
  })
);

export const sessions = pgTable(
  "sessions",
  {
    sessionToken: text("session_token").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { withTimezone: true }).notNull(),
  },
  (table) => ({
    userIdx: index("sessions_user_idx").on(table.userId),
  })
);

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { withTimezone: true }).notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.identifier, table.token] }),
  })
);
export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Workspace = typeof workspaces.$inferSelect;
export type NewWorkspace = typeof workspaces.$inferInsert;
export type WorkspaceMember = typeof workspaceMembers.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type Upload = typeof uploads.$inferSelect;
export type NewUpload = typeof uploads.$inferInsert;
export type ClipJob = typeof clipJobs.$inferSelect;
export type NewClipJob = typeof clipJobs.$inferInsert;
export type Clip = typeof clips.$inferSelect;
export type NewClip = typeof clips.$inferInsert;
export type ClipAsset = typeof clipAssets.$inferSelect;
export type JobEvent = typeof jobEvents.$inferSelect;
export type SocialAccount = typeof socialAccounts.$inferSelect;
export type NewSocialAccount = typeof socialAccounts.$inferInsert;
export type ScheduledPost = typeof scheduledPosts.$inferSelect;
export type NewScheduledPost = typeof scheduledPosts.$inferInsert;
export type AnalyticsSummary = typeof analyticsSummary.$inferSelect;
export type NewAnalyticsSummary = typeof analyticsSummary.$inferInsert;
export type PaymentMethod = typeof paymentMethods.$inferSelect;
export type NewPaymentMethod = typeof paymentMethods.$inferInsert;
export type AssetLibraryItem = typeof assetLibrary.$inferSelect;
export type NewAssetLibraryItem = typeof assetLibrary.$inferInsert;
export type CmsMenu = typeof cmsMenus.$inferSelect;
export type NewCmsMenu = typeof cmsMenus.$inferInsert;

// ============================================================================
// 12) Google Drive Integration - OAuth tokens for Google Drive access
// ============================================================================

export const googleDriveTokens = pgTable("google_drive_tokens", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token"),
  tokenType: text("token_type").notNull().default("Bearer"),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  scope: text("scope"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (table) => ({
  userIdx: uniqueIndex("google_drive_tokens_user_idx").on(table.userId),
  workspaceIdx: index("google_drive_tokens_workspace_idx").on(table.workspaceId),
}));

export type GoogleDriveToken = typeof googleDriveTokens.$inferSelect;
export type NewGoogleDriveToken = typeof googleDriveTokens.$inferInsert;


 