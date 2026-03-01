export type PersistedSession = {
  uploadId: string;
  key: string;
  partSize: number;
  fileSize: number;
  fileName: string;
  completed: { PartNumber: number; ETag: string; size: number }[];
};
