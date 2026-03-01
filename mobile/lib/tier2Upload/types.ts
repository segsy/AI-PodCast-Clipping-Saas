export type UploadStatus =
  | "queued"
  | "compressing"
  | "uploading"
  | "paused"
  | "failed"
  | "completed"
  | "canceled";

export type UploadItem = {
  id: string;
  uploadId?: string;

  fileUri: string;
  compressedUri?: string;
  fileName: string;
  mimeType: string;

  status: UploadStatus;
  progress: number;
  error?: string;

  createdAt: number;
  updatedAt: number;

  podcastId?: string;
};
