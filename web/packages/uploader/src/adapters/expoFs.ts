import * as FileSystem from "expo-file-system";

import type { PartUploaderAdapter, PutResult } from "../types";

function base64ToBytes(base64: string) {
  const binary = globalThis.atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export function createExpoFsAdapter(fileUri: string): PartUploaderAdapter {
  return {
    name: "expo-fs-slice",
    async putPart({ url, fallbackUrl, startByte, endByte, onChunkProgress }): Promise<PutResult> {
      const t0 = Date.now();
      const base64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
        position: startByte,
        length: endByte - startByte
      } as never);

      const body = base64ToBytes(base64);
      let response = await fetch(url, { method: "PUT", body });
      if (!response.ok && fallbackUrl) {
        response = await fetch(fallbackUrl, { method: "PUT", body });
      }
      if (!response.ok) throw new Error(await response.text());

      onChunkProgress?.(endByte - startByte);
      return {
        etag: response.headers.get("ETag") || "",
        bytesSent: endByte - startByte,
        ms: Date.now() - t0
      };
    }
  };
}
