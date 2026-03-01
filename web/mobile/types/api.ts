export type MobileSession = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

export type MeResponse = {
  id: string;
  email: string;
  credits: number;
  workspaceId: string;
};

export type UploadResponse = {
  podcastId: string;
  videoUrl: string;
  audioUrl: string;
};

export type PodcastStatus = {
  podcastId: string;
  status: "queued" | "processing" | "completed";
  progress: number;
  done?: boolean;
};

export type TranscriptSegment = {
  start: number;
  end: number;
  text: string;
};

export type Clip = {
  id: string;
  title: string;
  viralScore: number;
  previewUrl: string;
  downloadUrl: string;
  srtUrl?: string;
  transcript?: TranscriptSegment[];
  localUri?: string;
  localSrtUri?: string;
  localTranscriptUri?: string;
};

export type ClipDetail = {
  id: string;
  title: string;
  viralScore: number;
  url: string;
  previewUrl: string;
  durationSec: number;
  srtUrl?: string;
};

export type TrimClipResponse = {
  newClipId: string;
  clip: ClipDetail;
  srtUrl: string;
};

export type Workspace = {
  id: string;
  name: string;
  role: "owner" | "admin" | "editor" | "viewer";
  avatar: string;
  themeColor: string;
};

export type MobileSessionDevice = {
  id: string;
  deviceId: string;
  deviceName: string;
  lastUsedAt: number;
  current: boolean;
};
