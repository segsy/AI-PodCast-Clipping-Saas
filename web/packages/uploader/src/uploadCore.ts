import { adaptPartSize, initialPolicy } from "./adaptive";
import { withRetries } from "./retry";
import { createSpeedEstimator, etaSeconds } from "./speed";
import type { PersistedSession } from "./state";
import type { ControlPlane, PartUploaderAdapter, UploadOptions, UploadResult, UploadSource, PartUrl } from "./types";

export async function uploadMultipart(
  control: ControlPlane,
  adapter: PartUploaderAdapter,
  source: UploadSource,
  options: UploadOptions
): Promise<UploadResult> {
  const policy = initialPolicy(options.networkHint);
  const concurrency = Math.max(1, options.concurrency ?? policy.concurrency);
  const maxRetries = options.maxRetries ?? 5;
  let partSize = policy.partSize;
  let recentErrors = 0;

  const speed = createSpeedEstimator(0.2);
  const totalBytes = source.fileSize;

  let session: PersistedSession | null = null;
  if (options.persist) {
    session = (await options.persist.load(options.persist.sessionKey)) as PersistedSession | null;
  }

  let uploadId: string;
  let key: string;
  let partsUrls: PartUrl[];

  if (session && options.resume) {
    uploadId = session.uploadId;
    key = session.key;
    partSize = session.partSize;
    const presigned = await control.presign(uploadId, key, source.fileSize, partSize, options.preferAccelerate);
    partsUrls = presigned.parts;
  } else {
    const start = await control.startMultipart({
      fileName: source.fileName,
      fileSize: source.fileSize,
      partSize,
      preferAccelerate: options.preferAccelerate,
      networkHint: options.networkHint
    });

    uploadId = start.uploadId;
    key = start.key;
    partSize = start.partSize;
    partsUrls = start.parts;

    if (options.persist) {
      await options.persist.save(options.persist.sessionKey, {
        uploadId,
        key,
        partSize,
        fileSize: source.fileSize,
        fileName: source.fileName,
        completed: []
      } satisfies PersistedSession);
    }
  }

  let uploadedParts: { PartNumber: number; ETag: string }[] = [];
  const completedSizes: Record<number, number> = {};

  if (options.resume) {
    try {
      const st = await control.status(uploadId, key);
      uploadedParts = st.parts
        .slice()
        .sort((a, b) => a.partNumber - b.partNumber)
        .map((part) => ({ PartNumber: part.partNumber, ETag: part.etag }));
      for (const part of st.parts) completedSizes[part.partNumber] = part.size;
    } catch {
      if (session?.completed?.length) {
        uploadedParts = session.completed.map((part) => ({ PartNumber: part.PartNumber, ETag: part.ETag }));
        for (const part of session.completed) completedSizes[part.PartNumber] = part.size;
      }
    }
  }

  const totalParts = Math.ceil(totalBytes / partSize);
  let uploadedBytes = Object.values(completedSizes).reduce((sum, size) => sum + size, 0);

  const done = new Set(uploadedParts.map((part) => part.PartNumber));
  const queue = Array.from({ length: totalParts }, (_, i) => i + 1).filter((pn) => !done.has(pn));

  const rangeFor = (partNumber: number) => {
    const startByte = (partNumber - 1) * partSize;
    const endByte = Math.min(startByte + partSize, totalBytes);
    return { startByte, endByte };
  };

  const report = (partNumber?: number, approxBytes?: number) => {
    const seen = approxBytes ?? uploadedBytes;
    const { bps } = speed(seen);
    options.onProgress?.({
      uploadedBytes: seen,
      totalBytes,
      progress: totalBytes ? seen / totalBytes : 0,
      bps,
      etaSec: etaSeconds(totalBytes, seen, bps),
      partNumber
    });
  };
  report();

  let cursor = 0;
  async function worker() {
    while (true) {
      const idx = cursor;
      cursor += 1;
      if (idx >= queue.length) break;
      const partNumber = queue[idx];
      const { startByte, endByte } = rangeFor(partNumber);
      const partUrl = partsUrls.find((part) => part.partNumber === partNumber);
      if (!partUrl) throw new Error(`Missing presigned url for part ${partNumber}`);

      const put = await withRetries(
        async () =>
          adapter.putPart({
            url: partUrl.url,
            fallbackUrl: partUrl.fallbackUrl,
            partNumber,
            startByte,
            endByte,
            totalSize: totalBytes,
            onChunkProgress: (bytesSent: number) => report(partNumber, uploadedBytes + bytesSent)
          }),
        maxRetries
      ).catch((error: unknown) => {
        recentErrors += 1;
        throw error;
      });

      const size = endByte - startByte;
      uploadedBytes += size;
      recentErrors = 0;
      const { bps } = speed(uploadedBytes);
      if (options.adaptive) partSize = adaptPartSize(partSize, bps, recentErrors);

      uploadedParts.push({ PartNumber: partNumber, ETag: put.etag });
      report(partNumber);

      if (options.persist) {
        const persisted = (await options.persist.load(options.persist.sessionKey)) as PersistedSession | null;
        if (persisted) {
          const next: PersistedSession = {
            ...persisted,
            completed: [
              ...persisted.completed.filter((p) => p.PartNumber !== partNumber),
              { PartNumber: partNumber, ETag: put.etag, size }
            ]
          };
          await options.persist.save(options.persist.sessionKey, next);
        }
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, queue.length || 1) }, () => worker()));

  uploadedParts = uploadedParts.slice().sort((a, b) => a.PartNumber - b.PartNumber);
  const completed = await control.complete({ uploadId, key, parts: uploadedParts });
  if (options.persist) await options.persist.clear(options.persist.sessionKey);

  return { url: completed.url, uploadId, key, parts: uploadedParts };
}
