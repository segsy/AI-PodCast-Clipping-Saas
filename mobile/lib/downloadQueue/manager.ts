import * as FileSystem from "expo-file-system";
import { v4 as uuidv4 } from "uuid";

import { loadDownloads, saveDownloads } from "./storage";
import type { DownloadItem, TranscriptSegment } from "./types";

const CLIP_DIR = `${FileSystem.documentDirectory}clips/`;
const SUB_DIR = `${FileSystem.documentDirectory}subs/`;

let running = false;
const active: Record<string, FileSystem.DownloadResumable> = {};

async function ensureDirs() {
  const a = await FileSystem.getInfoAsync(CLIP_DIR);
  if (!a.exists) await FileSystem.makeDirectoryAsync(CLIP_DIR, { intermediates: true });

  const b = await FileSystem.getInfoAsync(SUB_DIR);
  if (!b.exists) await FileSystem.makeDirectoryAsync(SUB_DIR, { intermediates: true });
}

async function updateItem(downloadId: string, mapper: (item: DownloadItem) => DownloadItem, onUpdate?: (q: DownloadItem[]) => void) {
  const latest = await loadDownloads();
  const updated = latest.map((it) => (it.id === downloadId ? mapper(it) : it));
  await saveDownloads(updated);
  onUpdate?.(updated);
  return updated;
}

export async function enqueueDownload(params: {
  clipId: string;
  title: string;
  remoteUrl: string;
  remoteSrtUrl?: string;
  remoteTranscript?: TranscriptSegment[];
}) {
  await ensureDirs();
  const q = await loadDownloads();

  const existing = q.find((it) => it.clipId === params.clipId && (it.status === "queued" || it.status === "downloading" || it.status === "paused" || it.status === "completed"));
  if (existing) return existing;

  const item: DownloadItem = {
    id: uuidv4(),
    clipId: params.clipId,
    title: params.title,
    remoteUrl: params.remoteUrl,
    remoteSrtUrl: params.remoteSrtUrl,
    remoteTranscript: params.remoteTranscript,
    status: "queued",
    progress: 0,
    retries: 0,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  await saveDownloads([item, ...q]);
  return item;
}

export async function pauseDownload(downloadId: string) {
  await updateItem(downloadId, (it) => (
    it.status === "downloading" || it.status === "queued"
      ? { ...it, status: "paused", updatedAt: Date.now() }
      : it
  ));

  const resumable = active[downloadId];
  if (resumable) {
    try {
      const pauseData = await resumable.pauseAsync();
      await updateItem(downloadId, (it) => ({ ...it, resumeData: pauseData.resumeData ?? null, updatedAt: Date.now() }));
    } catch {
      // ignore pause race if already finished
    }
  }
}

export async function resumeDownload(downloadId: string) {
  await updateItem(downloadId, (it) => (
    it.status === "paused" || it.status === "failed"
      ? { ...it, status: "queued", error: undefined, updatedAt: Date.now() }
      : it
  ));
}

export async function retryFailedDownloads() {
  const q = await loadDownloads();
  const next = q.map((it) => (it.status === "failed" ? { ...it, status: "queued", error: undefined, updatedAt: Date.now() } : it));
  await saveDownloads(next);
  return next;
}

export async function removeDownload(downloadId: string) {
  const q = await loadDownloads();
  const item = q.find((it) => it.id === downloadId);

  if (item?.localVideoUri) await FileSystem.deleteAsync(item.localVideoUri, { idempotent: true });
  if (item?.localSrtUri) await FileSystem.deleteAsync(item.localSrtUri, { idempotent: true });
  if (item?.localTranscriptUri) await FileSystem.deleteAsync(item.localTranscriptUri, { idempotent: true });

  delete active[downloadId];
  await saveDownloads(q.filter((it) => it.id !== downloadId));
}

async function downloadTextToFile(url: string, localPath: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Subtitle download failed");
  const text = await res.text();
  await FileSystem.writeAsStringAsync(localPath, text, { encoding: FileSystem.EncodingType.UTF8 });
}

async function saveTranscriptToFile(transcript: TranscriptSegment[], localPath: string) {
  await FileSystem.writeAsStringAsync(localPath, JSON.stringify(transcript), { encoding: FileSystem.EncodingType.UTF8 });
}

async function startOne(item: DownloadItem, onUpdate?: (q: DownloadItem[]) => void, maxRetries = 2) {
  const localVideo = `${CLIP_DIR}${item.clipId}.mp4`;
  const localSrt = item.remoteSrtUrl ? `${SUB_DIR}${item.clipId}.srt` : undefined;
  const localTranscript = item.remoteTranscript ? `${SUB_DIR}${item.clipId}.json` : undefined;

  const dl = FileSystem.createDownloadResumable(
    item.remoteUrl,
    localVideo,
    {},
    async (progress) => {
      const pct = progress.totalBytesExpectedToWrite
        ? progress.totalBytesWritten / progress.totalBytesExpectedToWrite
        : 0;

      await updateItem(item.id, (it) => ({ ...it, progress: pct, updatedAt: Date.now() }), onUpdate);
    },
    item.resumeData ?? undefined
  );

  active[item.id] = dl;

  const result = item.resumeData ? await dl.resumeAsync() : await dl.downloadAsync();
  if (!result?.uri) throw new Error("Download failed");

  if (localSrt && item.remoteSrtUrl) {
    await downloadTextToFile(item.remoteSrtUrl, localSrt);
  }

  if (localTranscript && item.remoteTranscript) {
    await saveTranscriptToFile(item.remoteTranscript, localTranscript);
  }

  await updateItem(item.id, (it) => ({
    ...it,
    status: "completed",
    progress: 1,
    localVideoUri: localVideo,
    localSrtUri: localSrt,
    localTranscriptUri: localTranscript,
    resumeData: null,
    updatedAt: Date.now()
  }), onUpdate);

  delete active[item.id];

  if (maxRetries < 0) return;
}

export async function startDownloadWorker(onUpdate?: (q: DownloadItem[]) => void, concurrency = 2, maxRetries = 2) {
  if (running) return;
  running = true;
  await ensureDirs();

  const tick = async () => {
    if (!running) return;

    const q = await loadDownloads();
    const downloading = q.filter((it) => it.status === "downloading").length;
    const slots = Math.max(0, concurrency - downloading);
    const toStart = q.filter((it) => it.status === "queued").slice(0, slots);

    for (const candidate of toStart) {
      await updateItem(candidate.id, (it) => ({
        ...it,
        status: "downloading",
        error: undefined,
        updatedAt: Date.now()
      }), onUpdate);

      try {
        const latest = (await loadDownloads()).find((it) => it.id === candidate.id);
        if (!latest || latest.status !== "downloading") continue;
        await startOne(latest, onUpdate, maxRetries);
      } catch (e) {
        await updateItem(candidate.id, (it) => {
          const retries = it.retries + 1;
          if (retries <= maxRetries) {
            return {
              ...it,
              retries,
              status: "queued",
              error: e instanceof Error ? e.message : "Download failed",
              updatedAt: Date.now()
            };
          }

          return {
            ...it,
            retries,
            status: "failed",
            error: e instanceof Error ? e.message : "Download failed",
            updatedAt: Date.now()
          };
        }, onUpdate);
        delete active[candidate.id];
      }
    }

    setTimeout(tick, 700);
  };

  tick();
}

export function stopDownloadWorker() {
  running = false;
}

export async function getDownloadStorageUsageBytes() {
  const q = await loadDownloads();
  let total = 0;
  for (const item of q) {
    for (const uri of [item.localVideoUri, item.localSrtUri, item.localTranscriptUri]) {
      if (!uri) continue;
      const info = await FileSystem.getInfoAsync(uri);
      if (info.exists && typeof info.size === "number") total += info.size;
    }
  }
  return total;
}
