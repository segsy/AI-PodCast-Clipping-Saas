export type NetworkHint = "wifi" | "cellular" | "unknown";

export type StartMultipartRequest = {
  fileName: string;
  fileSize: number;
  preferAccelerate?: boolean;
  networkHint?: NetworkHint;
  partSize?: number;
};

export type PartUrl = {
  partNumber: number;
  url: string;
  fallbackUrl?: string;
};

export type StartMultipartResponse = {
  uploadId: string;
  key: string;
  bucket?: string;
  region?: string;
  partSize: number;
  totalParts: number;
  parts: PartUrl[];
};

export type StatusResponse = {
  parts: { partNumber: number; etag: string; size: number }[];
};

export type CompleteRequest = {
  uploadId: string;
  key: string;
  parts: { PartNumber: number; ETag: string }[];
};

export type CompleteResponse = { url: string };

export type AbortRequest = { uploadId: string; key: string };

export type ControlPlane = {
  startMultipart(req: StartMultipartRequest): Promise<StartMultipartResponse>;
  presign(uploadId: string, key: string, fileSize: number, partSize: number, preferAccelerate?: boolean): Promise<{ parts: PartUrl[] }>;
  status(uploadId: string, key: string): Promise<StatusResponse>;
  complete(req: CompleteRequest): Promise<CompleteResponse>;
  abort(req: AbortRequest): Promise<{ aborted: true }>;
};

export type UploadSource = {
  fileName: string;
  fileSize: number;
};

export type PutResult = {
  etag: string;
  bytesSent: number;
  ms: number;
};

export type PartUploaderAdapter = {
  name: string;
  putPart(args: {
    url: string;
    fallbackUrl?: string;
    partNumber: number;
    startByte: number;
    endByte: number;
    totalSize: number;
    onChunkProgress?: (bytesSent: number) => void;
  }): Promise<PutResult>;
};

export type UploadProgress = {
  uploadedBytes: number;
  totalBytes: number;
  progress: number;
  bps: number;
  etaSec: number;
  partNumber?: number;
};

export type UploadOptions = {
  networkHint: NetworkHint;
  preferAccelerate?: boolean;
  concurrency?: number;
  maxRetries?: number;
  adaptive?: boolean;
  resume?: boolean;
  persist?: {
    load: (key: string) => Promise<unknown | null>;
    save: (key: string, value: unknown) => Promise<void>;
    clear: (key: string) => Promise<void>;
    sessionKey: string;
  };
  onProgress?: (p: UploadProgress) => void;
};

export type UploadResult = {
  url: string;
  uploadId: string;
  key: string;
  parts: { PartNumber: number; ETag: string }[];
};
