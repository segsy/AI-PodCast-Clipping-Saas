import { enqueueDownload, removeDownload } from "./downloadQueue/manager";
import { loadDownloads } from "./downloadQueue/storage";
import type { Clip } from "../types/api";

export type OfflineClip = Clip;

export async function queueOfflineDownload(clip: Clip, _onProgress?: (progress: number) => void) {
  await enqueueDownload({
    clipId: clip.id,
    title: clip.title,
    remoteUrl: clip.downloadUrl,
    remoteSrtUrl: clip.srtUrl,
    remoteTranscript: clip.transcript
  });
  return clip;
}

export async function getOfflineClips(): Promise<OfflineClip[]> {
  const items = await loadDownloads();
  return items
    .filter((it) => it.status === "completed" && it.localVideoUri)
    .map((it) => ({
      id: it.clipId,
      title: it.title,
      viralScore: 0,
      previewUrl: it.localVideoUri ?? it.remoteUrl,
      downloadUrl: it.remoteUrl,
      srtUrl: it.remoteSrtUrl,
      transcript: it.remoteTranscript,
      localUri: it.localVideoUri,
      localSrtUri: it.localSrtUri,
      localTranscriptUri: it.localTranscriptUri
    }));
}

export async function deleteOfflineClip(clipId: string) {
  const q = await loadDownloads();
  const item = q.find((it) => it.clipId === clipId);
  if (item) await removeDownload(item.id);
}

export async function getQueueSize() {
  const q = await loadDownloads();
  return q.filter((it) => it.status === "queued" || it.status === "downloading" || it.status === "paused").length;
}
