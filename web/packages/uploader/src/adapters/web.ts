import type { PartUploaderAdapter, PutResult } from "../types";

export function createWebAdapter(file: File): PartUploaderAdapter {
  return {
    name: "web-blob-slice",
    async putPart({ url, fallbackUrl, startByte, endByte, onChunkProgress }): Promise<PutResult> {
      const blob = file.slice(startByte, endByte);
      const t0 = performance.now();

      let response = await fetch(url, { method: "PUT", body: blob });
      if (!response.ok && fallbackUrl) {
        response = await fetch(fallbackUrl, { method: "PUT", body: blob });
      }
      if (!response.ok) throw new Error(await response.text());

      onChunkProgress?.(endByte - startByte);
      return {
        etag: response.headers.get("ETag") || "",
        bytesSent: endByte - startByte,
        ms: performance.now() - t0
      };
    }
  };
}
