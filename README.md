# AI Podcast Clipping SaaS (Starter Blueprint)

Production-style monorepo starter for an **AI Podcast Clipping SaaS** that turns long-form podcasts into viral short-form clips for TikTok, Reels, and Shorts.

## Stack

- **Frontend:** Next.js 15, React, TypeScript, Tailwind CSS, shadcn/ui
- **Auth & billing:** Auth.js + Stripe (credit packs)
- **Backend AI API:** FastAPI (Python)
- **Async orchestration:** Inngest
- **GPU processing:** Modal (serverless GPU worker)
- **Storage:** S3-compatible bucket for uploads and rendered clips

## High-level flow

1. User uploads a podcast in the Next.js dashboard.
2. Frontend stores metadata and triggers an Inngest event.
3. Inngest calls FastAPI `/process` endpoint.
4. FastAPI invokes Modal worker to run the pipeline:
   - whisperX transcription
   - Gemini-based viral segment detection
   - LR-ASD active-speaker detection
   - FFmpegCV crop + subtitle render
5. Rendered clips are stored in S3 and status is updated.
6. User sees generated clips in **My Clips** tab.

## Repository layout

- `apps/web`: Next.js 15 dashboard + API routes (Inngest + Stripe webhook stubs)
- `apps/mobile`: Expo React Native mobile app scaffold consuming web API routes
- `apps/api`: FastAPI orchestration service
- `services/modal`: Modal worker pipeline skeleton

## MVP setup

### 1) Web app

```bash
cd apps/web
npm install
npm run dev
```

### 2) Mobile app

```bash
cd apps/mobile
npm install
npm run start
```

Set `EXPO_PUBLIC_WEB_BASE_URL` in `apps/mobile/.env` to your deployed web app URL.

### 3) API service

```bash
cd apps/api
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 4) Environment variables

Copy `.env.example` files in each app and fill:

- Auth.js secrets/providers
- Stripe keys + webhook secret
- Inngest event key
- Modal token
- Gemini API key
- S3 credentials


### Mobile API support

### Workspace switching (mobile)

Mobile app supports team workspace switching with persisted selection via SecureStore.
- `GET /api/workspaces`
- `POST /api/workspaces` (create workspace)
- `POST /api/workspaces/invite` (owner/admin invite)

All mobile API requests attach `x-workspace-id` and backend routes validate workspace membership.


The web app now includes mobile-oriented API routes and bearer-token auth stubs:

- `POST /api/mobile/login` (returns `accessToken` + rotating `refreshToken`)
- `POST /api/mobile/refresh` (rotates refresh token and issues a new access token)
- `POST /api/mobile/logout` (revokes refresh token)
- `GET /api/mobile/sessions` (list active device sessions)
- `POST /api/mobile/logout-others` (revoke other sessions)
- `POST /api/mobile/push-token` (register Expo push token)
- `GET /api/me`
- `POST /api/upload`
- `GET /api/clips`
- `GET /api/podcasts/status`
- `POST /api/stripe/portal`
- `GET /api/clips/[id]`
- `POST /api/clips/[id]/trim`

Set `MOBILE_JWT_SECRET`, `MOBILE_TOKEN_TTL_SECONDS`, and `MOBILE_REFRESH_TOKEN_TTL_SECONDS` in `apps/web/.env` for mobile token signing and rotation TTLs.

## Core product modules included in this scaffold

- Credit-based billing abstractions
- Queue-first processing contract
- End-to-end clip job data model
- API contracts for async processing and status updates
- Dashboard UI sections: upload, queue status, generated clips, billing

## Next steps

1. Implement real persistence (PostgreSQL + Prisma/Drizzle).
2. Wire Auth.js and Stripe checkout + webhooks.
3. Replace fake queue stubs with live Inngest handlers.
4. Implement full Modal pipeline and callback signing.
5. Add observability (Sentry + structured logging + tracing).
6. Deploy: Vercel (web), Railway/Fly/Render (API), Modal (GPU jobs).





### Device sessions and app lock

- Multi-device refresh-token sessions include `deviceId`, `deviceName`, and `lastUsedAt`.
- Settings screen supports listing sessions and "Log out other devices".
- App lock timeout requires biometric unlock after inactivity (`apps/mobile/lib/appLock.ts`, `apps/mobile/lib/biometric.ts`).

### Push notifications (mobile + API)

End-to-end Expo push flow is wired with:
- mobile token registration: `POST /api/mobile/push-token`
- internal event fanout route: `POST /api/internal/notify` (protected by `x-internal-secret`)
- Expo Push API sender utility (`apps/web/lib/sendPush.ts`)
- deep-link handling in mobile root layout for `clips`, `trim_finished`, and `upload_finished` events

Events currently emitted in starter routes:
- upload finished (`/api/upload`)
- trim finished (`/api/clips/[id]/trim`)
- clips ready (`/api/process`)

You can also use `/api/internal/notify` for subscription-expiry or enterprise SLA alerts.


### Workspace management (multi-tenant)

API support now includes:
- owner-gated workspace creation (`POST /api/workspaces`)
- admin/owner member invites via both legacy and scoped routes:
  - `POST /api/workspaces/invite`
  - `POST /api/workspaces/:id/invite`
- invite acceptance (`POST /api/invite/accept`)
- workspace branding updates (`PATCH /api/workspaces/:id`) for name/avatar/theme
- current workspace metadata (`GET /api/workspaces/current`)

Mobile support includes:
- persisted per-device last-used workspace selection with fallback reconciliation on sign-in
- workspace branding editor and invite role picker in `WorkspaceSwitcher`
- runtime primary theme color updates from selected workspace

### Upload queue manager (Tier 1 / Tier 2)

Tier 1 (Expo Go) is implemented with persistent queue metadata, retries, progress, WiFi-only gating, and local completion notifications via:
- `apps/mobile/lib/uploadQueue/types.ts`
- `apps/mobile/lib/uploadQueue/storage.ts`
- `apps/mobile/lib/uploadQueue/wifi.ts`
- `apps/mobile/lib/uploadQueue/manager.ts`
- `apps/mobile/app/(tabs)/dashboard.tsx`

Tier 2 scaffold (Dev Build) is provided at `apps/mobile/lib/uploadQueue/BackgroundUploadManager.ts` for true pause/resume and app-kill persistence.

### Tier-2 dev build uploads (OS background)

For EAS Dev Build workflows, mobile also includes a native-backed Tier-2 uploader (`react-native-background-upload`) with:
- persistent OS-managed background uploads
- queue + concurrency control
- pause/resume/cancel controls (pause modeled as cancel + queued resume)
- optional pre-upload compression via `ffmpeg-kit-react-native`
- WiFi-only gating and auto-restart on connectivity return
- local completion/failure notifications

Primary modules:
- `apps/mobile/lib/tier2Upload/manager.ts`
- `apps/mobile/lib/tier2Upload/compress.ts`
- `apps/mobile/lib/tier2Upload/settings.ts`
- `apps/mobile/lib/tier2Upload/storage.ts`
- `apps/mobile/app/(tabs)/uploads.tsx`

### Mobile background uploads

The Expo mobile app uses `expo-file-system` background upload tasks for `POST /api/upload` to provide:
- upload progress callbacks
- retry-once after token refresh for 401 responses
- continuation when app is backgrounded (Expo managed workflow behavior)



### Offline & downloads subsystem (mobile)

- Persistent background download queue with progress, pause/resume, retries, and local file cleanup.
- Offline subtitle support using timed transcript overlays rendered over `expo-av` playback.
- Auto-sync on reconnect: refresh cached clips, requeue failed downloads, and restart upload/download workers.
- Storage usage visibility in the Clips tab and offline-only filtering.

Primary modules:
- `apps/mobile/lib/downloadQueue/manager.ts`
- `apps/mobile/lib/downloadQueue/storage.ts`
- `apps/mobile/lib/downloadQueue/types.ts`
- `apps/mobile/lib/sync/syncManager.ts`
- `apps/mobile/components/CaptionOverlay.tsx`

### Offline mode behavior

- Clips tab caches online metadata and falls back when offline.
- Dashboard disables uploads while offline.
- Billing disables portal actions while offline.

### Offline clips and download queue

Mobile app now supports offline-first clip playback with:
- queued background downloads
- encrypted clip file storage in app sandbox
- offline subtitle file download (`.srt`) and rendering in player cards
- auto-sync refresh when network connectivity returns
- dedicated Downloads tab with offline-only toggle, queue controls, and storage usage indicator

Primary modules:
- `apps/mobile/lib/offline.ts`
- `apps/mobile/components/ClipCard.tsx`
- `apps/mobile/app/(tabs)/clips.tsx`


### Advanced mobile features included

- Upload queue manager: background upload tasks with progress and retry (`apps/mobile/lib/backgroundUpload.ts`)
- Offline subtitle playback: SRT download + playback subtitle rendering (`apps/mobile/lib/offline.ts`, `apps/mobile/components/ClipCard.tsx`)
- Advanced clip editing: in-app trim workflow (`apps/mobile/app/clip/[id]/trim.tsx`)
- AI caption editing screen (`apps/mobile/app/clip/[id]/captions.tsx`)
- In-app analytics dashboard (`apps/mobile/app/(tabs)/analytics.tsx`, `/api/analytics`)

### Clip enhancement pipeline (TikTok-style)

FastAPI now exposes `POST /clips/{id}/enhance` with a production-minded enhancement chain:
- optional 9:16 vertical reframe pass
- hook text generation + top overlay burn-in via ASS
- animated/karaoke ASS captions from transcript and word timings
- light emoji injection policy (max sparse inserts)
- deterministic b-roll style overlay layer
- post-enhancement viral re-score with before/after metadata

Key modules:
- `apps/api/app/api/clips_enhance.py`
- `apps/api/app/services/ass_builder.py`
- `apps/api/app/services/hook_generator.py`
- `apps/api/app/services/emoji_injector.py`
- `apps/api/app/services/ffmpeg_render.py`
- `apps/api/app/services/broll_engine.py`
- `apps/api/app/services/reframe.py`
- `apps/api/app/services/viral_scorer.py`
- `apps/api/app/services/storage.py`

FastAPI routes:
- `POST /clips/{id}/enhance` (router in `clips_enhance.py`)

Next.js proxy route:
- `POST /api/clips/[id]/enhance` -> forwards to FastAPI and notifies mobile clients.

## Trim pipeline (mobile in-app trim)

`POST /api/clips/[id]/trim` proxies to FastAPI where the flow is:
1. trim source video window
2. slice transcript to trimmed time window
3. regenerate SRT for trimmed window
4. burn styled subtitles into trimmed video
5. upload final clip and return new clip id/url

