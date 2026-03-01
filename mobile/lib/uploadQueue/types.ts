export type UploadStatus = "queued" | "uploading" | "paused" | "failed" | "completed";

export type UploadItem = {
  id: string;
  fileUri: string;
  fileName: string;
  mimeType: string;
  sizeBytes?: number;

  status: UploadStatus;
  progress: number;
  error?: string;
  retries: number;

  createdAt: number;
  updatedAt: number;

  podcastId?: string;
};
