import type {
  AbortRequest,
  CompleteRequest,
  CompleteResponse,
  ControlPlane,
  StartMultipartRequest,
  StartMultipartResponse,
  StatusResponse
} from "./types";

export function createControlPlane(
  baseUrl: string,
  getAuthHeader?: () => Promise<Record<string, string>>
): ControlPlane {
  async function headers() {
    return {
      "Content-Type": "application/json",
      ...(getAuthHeader ? await getAuthHeader() : {})
    };
  }

  return {
    async startMultipart(req: StartMultipartRequest): Promise<StartMultipartResponse> {
      const r = await fetch(`${baseUrl}/uploads/multipart/start`, {
        method: "POST",
        headers: await headers(),
        body: JSON.stringify(req)
      });
      if (!r.ok) throw new Error(await r.text());
      return r.json();
    },

    async presign(uploadId, key, fileSize, partSize, preferAccelerate) {
      const r = await fetch(`${baseUrl}/uploads/multipart/presign`, {
        method: "POST",
        headers: await headers(),
        body: JSON.stringify({ uploadId, key, fileSize, partSize, preferAccelerate })
      });
      if (!r.ok) throw new Error(await r.text());
      return r.json();
    },

    async status(uploadId: string, key: string): Promise<StatusResponse> {
      const r = await fetch(
        `${baseUrl}/uploads/multipart/status?uploadId=${encodeURIComponent(uploadId)}&key=${encodeURIComponent(key)}`,
        {
          method: "GET",
          headers: await headers()
        }
      );
      if (!r.ok) throw new Error(await r.text());
      return r.json();
    },

    async complete(req: CompleteRequest): Promise<CompleteResponse> {
      const r = await fetch(`${baseUrl}/uploads/multipart/complete`, {
        method: "POST",
        headers: await headers(),
        body: JSON.stringify(req)
      });
      if (!r.ok) throw new Error(await r.text());
      return r.json();
    },

    async abort(req: AbortRequest): Promise<{ aborted: true }> {
      const r = await fetch(`${baseUrl}/uploads/multipart/abort`, {
        method: "POST",
        headers: await headers(),
        body: JSON.stringify(req)
      });
      if (!r.ok) throw new Error(await r.text());
      return r.json();
    }
  };
}
