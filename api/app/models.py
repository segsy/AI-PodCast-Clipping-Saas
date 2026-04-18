"""
Pydantic models for the AI Podcast Clips API.
These models mirror the TypeScript database schema defined in db/schema.ts.
"""

from datetime import datetime
from enum import Enum
from typing import Optional, Any
from pydantic import BaseModel, Field, ConfigDict


# ============================================================================
# ENUMS
# ============================================================================

class JobStatus(str, Enum):
    """Job status enum matching jobStatusEnum in schema"""
    UPLOAD_READY = "UPLOAD_READY"
    UPLOAD_COMPLETE = "UPLOAD_COMPLETE"
    QUEUED = "QUEUED"
    PREPROCESS = "PREPROCESS"
    TRANSCRIBE = "TRANSCRIBE"
    SEGMENT_DETECT = "SEGMENT_DETECT"
    SCENE_SPEAKER = "SCENE_SPEAKER"
    RENDER = "RENDER"
    THUMBNAILS = "THUMBNAILS"
    PUBLISH_READY = "PUBLISH_READY"
    DONE = "DONE"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"


class UploadStatus(str, Enum):
    """Upload status enum matching uploadStatusEnum in schema"""
    UPLOAD_READY = "UPLOAD_READY"
    UPLOADING = "UPLOADING"
    UPLOAD_COMPLETE = "UPLOAD_COMPLETE"
    FAILED = "FAILED"


class ClipStatus(str, Enum):
    """Clip status enum matching clipStatusEnum in schema"""
    PENDING = "PENDING"
    RENDERING = "RENDERING"
    READY = "READY"
    FAILED = "FAILED"
    ARCHIVED = "ARCHIVED"


class AssetType(str, Enum):
    """Asset type enum matching assetTypeEnum in schema"""
    MP4 = "MP4"
    THUMBNAIL = "THUMBNAIL"
    CAPTIONS_SRT = "CAPTIONS_SRT"
    CAPTIONS_JSON = "CAPTIONS_JSON"
    TRANSCRIPT_JSON = "TRANSCRIPT_JSON"
    SEGMENTS_JSON = "SEGMENTS_JSON"
    WAVEFORM_JSON = "WAVEFORM_JSON"
    PREVIEW_GIF = "PREVIEW_GIF"
    EXPORT_XML = "EXPORT_XML"


class MemberRole(str, Enum):
    """Member role enum matching memberRoleEnum in schema"""
    OWNER = "OWNER"
    ADMIN = "ADMIN"
    MEMBER = "MEMBER"
    VIEWER = "VIEWER"


class AdminRole(str, Enum):
    """Admin role enum matching adminRoleEnum in schema"""
    SUPER_ADMIN = "SUPER_ADMIN"
    ADMIN = "ADMIN"
    SUPPORT = "SUPPORT"
    ANALYST = "ANALYST"


class LedgerReason(str, Enum):
    """Ledger reason enum matching ledgerReasonEnum in schema"""
    JOB_RESERVE = "JOB_RESERVE"
    JOB_FINALIZE = "JOB_FINALIZE"
    JOB_RELEASE = "JOB_RELEASE"
    CREDITS_PURCHASE = "CREDITS_PURCHASE"
    REFUND = "REFUND"
    ADJUSTMENT = "ADJUSTMENT"


class PlanInterval(str, Enum):
    """Plan interval enum matching planIntervalEnum in schema"""
    MONTHLY = "MONTHLY"
    ANNUAL = "ANNUAL"


class SubscriptionStatus(str, Enum):
    """Subscription status enum matching subscriptionStatusEnum in schema"""
    TRIALING = "TRIALING"
    ACTIVE = "ACTIVE"
    PAST_DUE = "PAST_DUE"
    CANCELLED = "CANCELLED"
    UNPAID = "UNPAID"


class LeadStatus(str, Enum):
    """Lead status enum matching leadStatusEnum in schema"""
    NEW = "NEW"
    IN_PROGRESS = "IN_PROGRESS"
    WON = "WON"
    LOST = "LOST"
    SPAM = "SPAM"


class EventSource(str, Enum):
    """Event source enum matching eventSourceEnum in schema"""
    WEB = "WEB"
    ADMIN = "ADMIN"
    WORKER = "WORKER"
    STRIPE = "STRIPE"
    SYSTEM = "SYSTEM"


class PageStatus(str, Enum):
    """Page status enum matching pageStatusEnum in schema"""
    DRAFT = "DRAFT"
    PUBLISHED = "PUBLISHED"
    SCHEDULED = "SCHEDULED"


class ResourceType(str, Enum):
    """Resource type enum matching resourceTypeEnum in schema"""
    BLOG = "BLOG"
    CUSTOMER_STORY = "CUSTOMER_STORY"
    LEARNING = "LEARNING"
    HELP = "HELP"
    CHANGELOG = "CHANGELOG"


class Platform(str, Enum):
    """Platform enum matching platformEnum in schema"""
    YOUTUBE = "YOUTUBE"
    TIKTOK = "TIKTOK"
    INSTAGRAM = "INSTAGRAM"
    FACEBOOK = "FACEBOOK"
    TWITTER = "TWITTER"
    LINKEDIN = "LINKEDIN"
    PINTEREST = "PINTEREST"
    SNAPCHAT = "SNAPCHAT"


class PostStatus(str, Enum):
    """Post status enum matching postStatusEnum in schema"""
    DRAFT = "DRAFT"
    SCHEDULED = "SCHEDULED"
    PUBLISHED = "PUBLISHED"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"


class SocialAccountStatus(str, Enum):
    """Social account status enum matching socialAccountStatusEnum in schema"""
    CONNECTED = "CONNECTED"
    DISCONNECTED = "DISCONNECTED"
    EXPIRED = "EXPIRED"
    ERROR = "ERROR"


# ============================================================================
# USER & AUTH MODELS
# ============================================================================

class UserBase(BaseModel):
    """Base user model"""
    email: str
    name: Optional[str] = None
    image: Optional[str] = None
    avatarUrl: Optional[str] = None


class UserCreate(UserBase):
    """User creation model"""
    password: Optional[str] = None


class User(UserBase):
    """User response model"""
    id: str
    emailVerified: Optional[datetime] = None
    createdAt: datetime
    updatedAt: datetime

    model_config = ConfigDict(from_attributes=True)


class UserWithRelations(User):
    """User with related data"""
    workspaces: list["Workspace"] = []
    memberships: list["WorkspaceMember"] = []


# ============================================================================
# WORKSPACE MODELS
# ============================================================================

class WorkspaceBase(BaseModel):
    """Base workspace model"""
    name: str
    slug: str


class WorkspaceCreate(WorkspaceBase):
    """Workspace creation model"""
    createdBy: str


class Workspace(WorkspaceBase):
    """Workspace response model"""
    id: str
    createdBy: str
    createdAt: datetime
    updatedAt: datetime

    model_config = ConfigDict(from_attributes=True)


class WorkspaceMemberBase(BaseModel):
    """Base workspace member model"""
    role: MemberRole = MemberRole.MEMBER
    status: str = "ACTIVE"


class WorkspaceMemberCreate(WorkspaceMemberBase):
    """Workspace member creation model"""
    workspaceId: str
    userId: str


class WorkspaceMember(WorkspaceMemberBase):
    """Workspace member response model"""
    workspaceId: str
    userId: str
    createdAt: datetime

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# ADMIN MODELS
# ============================================================================

class AdminUserBase(BaseModel):
    """Base admin user model"""
    role: AdminRole = AdminRole.ADMIN


class AdminUserCreate(AdminUserBase):
    """Admin user creation model"""
    userId: str


class AdminUser(AdminUserBase):
    """Admin user response model"""
    userId: str
    createdAt: datetime

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# TEAM INVITATION MODELS
# ============================================================================

class TeamInvitationBase(BaseModel):
    """Base team invitation model"""
    email: str
    role: MemberRole = MemberRole.MEMBER
    status: str = "PENDING"


class TeamInvitationCreate(TeamInvitationBase):
    """Team invitation creation model"""
    workspaceId: str
    invitedBy: str
    expiresAt: datetime


class TeamInvitation(TeamInvitationBase):
    """Team invitation response model"""
    id: str
    workspaceId: str
    invitedBy: str
    expiresAt: datetime
    createdAt: datetime

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# PROJECT MODELS
# ============================================================================

class ProjectBase(BaseModel):
    """Base project model"""
    name: str
    description: Optional[str] = None


class ProjectCreate(ProjectBase):
    """Project creation model"""
    workspaceId: str
    createdBy: str


class Project(ProjectBase):
    """Project response model"""
    id: str
    workspaceId: str
    createdBy: str
    createdAt: datetime
    updatedAt: datetime

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# UPLOAD MODELS
# ============================================================================

class UploadBase(BaseModel):
    """Base upload model"""
    filename: str
    contentType: str
    bytes: int
    durationSec: Optional[int] = None
    s3Key: str
    etag: Optional[str] = None


class UploadCreate(UploadBase):
    """Upload creation model"""
    workspaceId: str
    projectId: Optional[str] = None
    createdBy: str


class Upload(UploadBase):
    """Upload response model"""
    id: str
    workspaceId: str
    projectId: Optional[str] = None
    status: UploadStatus = UploadStatus.UPLOAD_READY
    createdBy: str
    createdAt: datetime
    updatedAt: datetime

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# CLIP JOB MODELS
# ============================================================================

class ClipJobBase(BaseModel):
    """Base clip job model"""
    status: JobStatus = JobStatus.UPLOAD_READY
    stage: str = "init"
    progress: int = 0
    optionsJson: dict[str, Any] = Field(default_factory=dict)
    pipelineVersion: str = "v1"
    reservedCredits: int = 0
    finalCredits: int = 0


class ClipJobCreate(ClipJobBase):
    """Clip job creation model"""
    workspaceId: str
    projectId: str
    uploadId: str
    createdBy: str


class ClipJobUpdate(BaseModel):
    """Clip job update model"""
    status: Optional[JobStatus] = None
    stage: Optional[str] = None
    progress: Optional[int] = None
    lastHeartbeatAt: Optional[datetime] = None
    startedAt: Optional[datetime] = None
    finishedAt: Optional[datetime] = None
    failureCode: Optional[str] = None
    failureMessage: Optional[str] = None
    failureRetryable: Optional[bool] = None
    finalCredits: Optional[int] = None


class ClipJob(ClipJobBase):
    """Clip job response model"""
    id: str
    workspaceId: str
    projectId: str
    uploadId: str
    lastHeartbeatAt: Optional[datetime] = None
    startedAt: Optional[datetime] = None
    finishedAt: Optional[datetime] = None
    failureCode: Optional[str] = None
    failureMessage: Optional[str] = None
    failureRetryable: bool = False
    idempotencyKey: Optional[str] = None
    createdBy: str
    createdAt: datetime
    updatedAt: datetime

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# JOB EVENT MODELS
# ============================================================================

class JobEventBase(BaseModel):
    """Base job event model"""
    type: str
    stage: Optional[str] = None
    progress: Optional[int] = None
    message: Optional[str] = None
    payload: dict[str, Any] = Field(default_factory=dict)


class JobEventCreate(JobEventBase):
    """Job event creation model"""
    jobId: str
    source: EventSource


class JobEvent(JobEventBase):
    """Job event response model"""
    id: int
    jobId: str
    source: EventSource
    createdAt: datetime

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# CLIP MODELS
# ============================================================================

class ClipBase(BaseModel):
    """Base clip model"""
    title: Optional[str] = None
    startMs: int
    endMs: int
    score: Optional[float] = None
    variant: Optional[str] = None
    templateId: Optional[str] = None
    captionStyleId: Optional[str] = None


class ClipCreate(ClipBase):
    """Clip creation model"""
    workspaceId: str
    projectId: str
    jobId: Optional[str] = None


class Clip(ClipBase):
    """Clip response model"""
    id: str
    workspaceId: str
    projectId: str
    jobId: Optional[str] = None
    status: ClipStatus = ClipStatus.PENDING
    createdAt: datetime
    updatedAt: datetime

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# CLIP ASSET MODELS
# ============================================================================

class ClipAssetBase(BaseModel):
    """Base clip asset model"""
    type: AssetType
    s3Key: str
    bytes: Optional[int] = None
    contentType: Optional[str] = None
    meta: dict[str, Any] = Field(default_factory=dict)


class ClipAssetCreate(ClipAssetBase):
    """Clip asset creation model"""
    workspaceId: str
    jobId: str
    clipId: Optional[str] = None


class ClipAsset(ClipAssetBase):
    """Clip asset response model"""
    id: str
    workspaceId: str
    clipId: Optional[str] = None
    jobId: str
    createdAt: datetime

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# CAPTION JOB MODELS
# ============================================================================

class CaptionJobBase(BaseModel):
    """Base caption job model"""
    status: str = "PENDING"
    style: str = "modern"
    fontSize: str = "medium"
    showTimestamps: bool = True
    speakerIdentification: bool = True
    soundEffects: bool = False
    aiModel: str = "gemini"
    creditsUsed: int = 0
    durationSec: Optional[int] = None
    s3Key: Optional[str] = None
    errorMessage: Optional[str] = None


class CaptionJobCreate(CaptionJobBase):
    """Caption job creation model"""
    workspaceId: str
    uploadId: Optional[str] = None
    projectId: Optional[str] = None
    createdBy: str


class CaptionJob(CaptionJobBase):
    """Caption job response model"""
    id: str
    workspaceId: str
    uploadId: Optional[str] = None
    projectId: Optional[str] = None
    createdBy: str
    createdAt: datetime
    updatedAt: datetime

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# THUMBNAIL JOB MODELS
# ============================================================================

class ThumbnailJobBase(BaseModel):
    """Base thumbnail job model"""
    status: str = "PENDING"
    style: str = "vibrant"
    aspectRatio: str = "16:9"
    titleText: Optional[str] = None
    addTitle: bool = True
    addEpisodeNumber: bool = True
    addGlowEffect: bool = False
    aiModel: str = "gemini"
    creditsUsed: int = 0
    generatedVariants: list[dict[str, Any]] = Field(default_factory=list)
    s3Key: Optional[str] = None
    errorMessage: Optional[str] = None


class ThumbnailJobCreate(ThumbnailJobBase):
    """Thumbnail job creation model"""
    workspaceId: str
    uploadId: Optional[str] = None
    projectId: Optional[str] = None
    createdBy: str


class ThumbnailJob(ThumbnailJobBase):
    """Thumbnail job response model"""
    id: str
    workspaceId: str
    uploadId: Optional[str] = None
    projectId: Optional[str] = None
    createdBy: str
    createdAt: datetime
    updatedAt: datetime

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# TEMPLATE MODELS
# ============================================================================

class BrandTemplateBase(BaseModel):
    """Base brand template model"""
    name: str
    config: dict[str, Any] = Field(default_factory=dict)
    isDefault: bool = False
    status: str = "ACTIVE"


class BrandTemplateCreate(BrandTemplateBase):
    """Brand template creation model"""
    workspaceId: str
    createdBy: str


class BrandTemplate(BrandTemplateBase):
    """Brand template response model"""
    id: str
    workspaceId: str
    createdBy: str
    createdAt: datetime
    updatedAt: datetime

    model_config = ConfigDict(from_attributes=True)


class CaptionStyleBase(BaseModel):
    """Base caption style model"""
    name: str
    config: dict[str, Any] = Field(default_factory=dict)
    isDefault: bool = False
    status: str = "ACTIVE"


class CaptionStyleCreate(CaptionStyleBase):
    """Caption style creation model"""
    workspaceId: str
    createdBy: str


class CaptionStyle(CaptionStyleBase):
    """Caption style response model"""
    id: str
    workspaceId: str
    createdBy: str
    createdAt: datetime
    updatedAt: datetime

    model_config = ConfigDict(from_attributes=True)


class ExportPresetBase(BaseModel):
    """Base export preset model"""
    name: str
    type: AssetType
    config: dict[str, Any] = Field(default_factory=dict)
    isDefault: bool = False


class ExportPresetCreate(ExportPresetBase):
    """Export preset creation model"""
    workspaceId: str
    createdBy: str


class ExportPreset(ExportPresetBase):
    """Export preset response model"""
    id: str
    workspaceId: str
    createdBy: str
    createdAt: datetime
    updatedAt: datetime

    model_config = ConfigDict(from_attributes=True)


class ExportBase(BaseModel):
    """Base export model"""
    type: AssetType
    status: str = "PENDING"
    s3Key: Optional[str] = None


class ExportCreate(ExportBase):
    """Export creation model"""
    workspaceId: str
    projectId: str
    presetId: Optional[str] = None
    createdBy: str


class Export(ExportBase):
    """Export response model"""
    id: str
    workspaceId: str
    projectId: str
    presetId: Optional[str] = None
    createdBy: str
    createdAt: datetime
    updatedAt: datetime

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# BILLING MODELS
# ============================================================================

class BillingCustomerBase(BaseModel):
    """Base billing customer model"""
    stripeCustomerId: Optional[str] = None


class BillingCustomerCreate(BillingCustomerBase):
    """Billing customer creation model"""
    workspaceId: str


class BillingCustomer(BillingCustomerBase):
    """Billing customer response model"""
    workspaceId: str
    createdAt: datetime

    model_config = ConfigDict(from_attributes=True)


class SubscriptionBase(BaseModel):
    """Base subscription model"""
    status: SubscriptionStatus
    planId: Optional[str] = None
    interval: PlanInterval
    trialEndsAt: Optional[datetime] = None
    currentPeriodEnd: Optional[datetime] = None


class SubscriptionCreate(SubscriptionBase):
    """Subscription creation model"""
    workspaceId: str
    stripeSubscriptionId: Optional[str] = None


class Subscription(SubscriptionBase):
    """Subscription response model"""
    id: str
    workspaceId: str
    stripeSubscriptionId: Optional[str] = None
    createdAt: datetime
    updatedAt: datetime

    model_config = ConfigDict(from_attributes=True)


class CreditsLedgerBase(BaseModel):
    """Base credits ledger model"""
    delta: int
    reason: LedgerReason
    memo: Optional[str] = None
    meta: dict[str, Any] = Field(default_factory=dict)


class CreditsLedgerCreate(CreditsLedgerBase):
    """Credits ledger creation model"""
    workspaceId: str
    jobId: Optional[str] = None
    stripeEventId: Optional[str] = None
    createdBy: Optional[str] = None


class CreditsLedger(CreditsLedgerBase):
    """Credits ledger response model"""
    id: int
    workspaceId: str
    jobId: Optional[str] = None
    stripeEventId: Optional[str] = None
    createdBy: Optional[str] = None
    createdAt: datetime

    model_config = ConfigDict(from_attributes=True)


class CreditsBalanceBase(BaseModel):
    """Base credits balance model"""
    balance: int = 0


class CreditsBalanceCreate(CreditsBalanceBase):
    """Credits balance creation model"""
    workspaceId: str


class CreditsBalance(CreditsBalanceBase):
    """Credits balance response model"""
    workspaceId: str
    updatedAt: datetime

    model_config = ConfigDict(from_attributes=True)


class PaymentMethodBase(BaseModel):
    """Base payment method model"""
    type: str
    brand: Optional[str] = None
    last4: Optional[str] = None
    expiryMonth: Optional[int] = None
    expiryYear: Optional[int] = None
    isDefault: bool = False


class PaymentMethodCreate(PaymentMethodBase):
    """Payment method creation model"""
    workspaceId: str
    stripePaymentMethodId: Optional[str] = None


class PaymentMethod(PaymentMethodBase):
    """Payment method response model"""
    id: str
    workspaceId: str
    stripePaymentMethodId: Optional[str] = None
    createdAt: datetime
    updatedAt: datetime

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# CMS MODELS
# ============================================================================

class CmsPageBase(BaseModel):
    """Base CMS page model"""
    title: str
    slug: str
    status: PageStatus = PageStatus.DRAFT
    seo: dict[str, Any] = Field(default_factory=dict)
    visibility: dict[str, Any] = Field(default_factory=dict)
    publishedAt: Optional[datetime] = None


class CmsPageCreate(CmsPageBase):
    """CMS page creation model"""
    workspaceId: Optional[str] = None
    createdBy: Optional[str] = None


class CmsPage(CmsPageBase):
    """CMS page response model"""
    id: str
    workspaceId: Optional[str] = None
    createdBy: Optional[str] = None
    createdAt: datetime
    updatedAt: datetime

    model_config = ConfigDict(from_attributes=True)


class CmsPageSectionBase(BaseModel):
    """Base CMS page section model"""
    sortOrder: int
    sectionType: str
    props: dict[str, Any] = Field(default_factory=dict)


class CmsPageSectionCreate(CmsPageSectionBase):
    """CMS page section creation model"""
    pageId: str


class CmsPageSection(CmsPageSectionBase):
    """CMS page section response model"""
    id: str
    pageId: str
    createdAt: datetime
    updatedAt: datetime

    model_config = ConfigDict(from_attributes=True)


class CmsResourceBase(BaseModel):
    """Base CMS resource model"""
    type: ResourceType
    title: str
    slug: str
    status: PageStatus = PageStatus.DRAFT
    excerpt: Optional[str] = None
    coverS3Key: Optional[str] = None
    body: dict[str, Any] = Field(default_factory=dict)
    tags: list[str] = Field(default_factory=list)
    authorName: Optional[str] = None
    publishedAt: Optional[datetime] = None
    seo: dict[str, Any] = Field(default_factory=dict)


class CmsResourceCreate(CmsResourceBase):
    """CMS resource creation model"""
    workspaceId: Optional[str] = None
    createdBy: Optional[str] = None


class CmsResource(CmsResourceBase):
    """CMS resource response model"""
    id: str
    workspaceId: Optional[str] = None
    createdBy: Optional[str] = None
    createdAt: datetime
    updatedAt: datetime

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# LEAD MODELS
# ============================================================================

class LeadBase(BaseModel):
    """Base lead model"""
    email: Optional[str] = None
    name: Optional[str] = None
    company: Optional[str] = None
    message: Optional[str] = None
    source: Optional[str] = None
    status: LeadStatus = LeadStatus.NEW
    utm: dict[str, Any] = Field(default_factory=dict)
    meta: dict[str, Any] = Field(default_factory=dict)


class LeadCreate(LeadBase):
    """Lead creation model"""
    workspaceId: Optional[str] = None


class Lead(LeadBase):
    """Lead response model"""
    id: str
    workspaceId: Optional[str] = None
    createdAt: datetime

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# ANALYTICS MODELS
# ============================================================================

class AnalyticsEventBase(BaseModel):
    """Base analytics event model"""
    name: str
    path: Optional[str] = None
    properties: dict[str, Any] = Field(default_factory=dict)


class AnalyticsEventCreate(AnalyticsEventBase):
    """Analytics event creation model"""
    workspaceId: Optional[str] = None
    userId: Optional[str] = None
    sessionId: Optional[str] = None


class AnalyticsEvent(AnalyticsEventBase):
    """Analytics event response model"""
    id: int
    workspaceId: Optional[str] = None
    userId: Optional[str] = None
    sessionId: Optional[str] = None
    createdAt: datetime

    model_config = ConfigDict(from_attributes=True)


class AnalyticsSummaryBase(BaseModel):
    """Base analytics summary model"""
    date: datetime
    totalViews: int = 0
    totalLikes: int = 0
    totalShares: int = 0
    totalComments: int = 0
    newFollowers: int = 0
    avgWatchTime: float = 0
    totalVideos: int = 0
    engagementRate: float = 0


class AnalyticsSummaryCreate(AnalyticsSummaryBase):
    """Analytics summary creation model"""
    workspaceId: str
    platform: Optional[Platform] = None


class AnalyticsSummary(AnalyticsSummaryBase):
    """Analytics summary response model"""
    id: str
    workspaceId: str
    platform: Optional[Platform] = None
    createdAt: datetime
    updatedAt: datetime

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# WEBHOOK & AUDIT MODELS
# ============================================================================

class WebhookEventBase(BaseModel):
    """Base webhook event model"""
    provider: str
    externalId: Optional[str] = None
    payload: dict[str, Any]
    status: str = "RECEIVED"
    error: Optional[str] = None


class WebhookEventCreate(WebhookEventBase):
    """Webhook event creation model"""
    pass


class WebhookEvent(WebhookEventBase):
    """Webhook event response model"""
    id: int
    receivedAt: datetime
    handledAt: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class AuditLogBase(BaseModel):
    """Base audit log model"""
    action: str
    targetType: Optional[str] = None
    targetId: Optional[str] = None
    meta: dict[str, Any] = Field(default_factory=dict)


class AuditLogCreate(AuditLogBase):
    """Audit log creation model"""
    workspaceId: Optional[str] = None
    actorUserId: Optional[str] = None


class AuditLog(AuditLogBase):
    """Audit log response model"""
    id: int
    workspaceId: Optional[str] = None
    actorUserId: Optional[str] = None
    createdAt: datetime

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# SALES MODELS
# ============================================================================

class SalesTransactionBase(BaseModel):
    """Base sales transaction model"""
    amountCents: int
    currency: str = "usd"
    type: str
    status: str
    stripeChargeId: Optional[str] = None
    stripeInvoiceId: Optional[str] = None


class SalesTransactionCreate(SalesTransactionBase):
    """Sales transaction creation model"""
    workspaceId: str


class SalesTransaction(SalesTransactionBase):
    """Sales transaction response model"""
    id: str
    workspaceId: str
    createdAt: datetime

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# SOCIAL ACCOUNT MODELS
# ============================================================================

class SocialAccountBase(BaseModel):
    """Base social account model"""
    platform: Platform
    platformAccountId: str
    platformUsername: Optional[str] = None
    platformProfileUrl: Optional[str] = None
    platformProfileImage: Optional[str] = None
    accessToken: Optional[str] = None
    refreshToken: Optional[str] = None
    tokenExpiresAt: Optional[datetime] = None
    status: SocialAccountStatus = SocialAccountStatus.CONNECTED


class SocialAccountCreate(SocialAccountBase):
    """Social account creation model"""
    workspaceId: str
    userId: Optional[str] = None


class SocialAccountUpdate(BaseModel):
    """Social account update model"""
    accessToken: Optional[str] = None
    refreshToken: Optional[str] = None
    tokenExpiresAt: Optional[datetime] = None
    status: Optional[SocialAccountStatus] = None


class SocialAccount(SocialAccountBase):
    """Social account response model"""
    id: str
    workspaceId: str
    userId: Optional[str] = None
    createdAt: datetime
    updatedAt: datetime

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# SCHEDULED POST MODELS
# ============================================================================

class ScheduledPostBase(BaseModel):
    """Base scheduled post model"""
    title: str
    description: Optional[str] = None
    platform: Platform
    scheduledAt: datetime
    status: PostStatus = PostStatus.DRAFT
    publishedAt: Optional[datetime] = None
    postUrl: Optional[str] = None
    mediaUrls: Optional[list[str]] = None
    caption: Optional[str] = None
    hashtags: Optional[list[str]] = None


class ScheduledPostCreate(ScheduledPostBase):
    """Scheduled post creation model"""
    workspaceId: str
    userId: Optional[str] = None
    projectId: Optional[str] = None
    clipId: Optional[str] = None
    socialAccountId: Optional[str] = None


class ScheduledPostUpdate(BaseModel):
    """Scheduled post update model"""
    title: Optional[str] = None
    description: Optional[str] = None
    scheduledAt: Optional[datetime] = None
    status: Optional[PostStatus] = None
    publishedAt: Optional[datetime] = None
    postUrl: Optional[str] = None
    mediaUrls: Optional[list[str]] = None
    caption: Optional[str] = None
    hashtags: Optional[list[str]] = None


class ScheduledPost(ScheduledPostBase):
    """Scheduled post response model"""
    id: str
    workspaceId: str
    userId: Optional[str] = None
    projectId: Optional[str] = None
    clipId: Optional[str] = None
    socialAccountId: Optional[str] = None
    createdAt: datetime
    updatedAt: datetime

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# API RESPONSE MODELS
# ============================================================================

class PaginatedResponse(BaseModel):
    """Generic paginated response"""
    items: list[Any]
    total: int
    page: int
    pageSize: int
    hasMore: bool


class JobWithProgress(BaseModel):
    """Job with calculated progress"""
    job: ClipJob
    events: list[JobEvent] = []


class WorkspaceWithMembers(Workspace):
    """Workspace with member details"""
    members: list[WorkspaceMember] = []
    memberCount: int = 0


class ProjectWithStats(Project):
    """Project with statistics"""
    uploadCount: int = 0
    clipCount: int = 0
    totalDurationSec: int = 0
