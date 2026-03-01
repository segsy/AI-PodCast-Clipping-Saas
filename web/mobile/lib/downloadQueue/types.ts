export type DownloadStatus = "queued" | "downloading" | "paused" | "failed" | "completed";

export type TranscriptSegment = {
  start: number;
  end: number;
  text: string;
};

export type DownloadItem = {
  id: string;
  clipId: string;
  title: string;

  remoteUrl: string;
  remoteSrtUrl?: string;
  remoteTranscript?: TranscriptSegment[];

  localVideoUri?: string;
  localSrtUri?: string;
  localTranscriptUri?: string;

  status: DownloadStatus;
  progress: number;
  error?: string;
  retries: number;
  resumeData?: string | null;

  createdAt: number;
  updatedAt: number;
};
