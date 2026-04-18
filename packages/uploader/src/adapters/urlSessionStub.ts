import type { PartUploaderAdapter, PutResult } from "../types";

export function createUrlSessionAdapter(): PartUploaderAdapter {
  return {
    name: "native-background-stub",
    async putPart(): Promise<PutResult> {
      throw new Error("URLSession/OkHttp adapter not implemented. Use createExpoFsAdapter until native module is wired.");
    }
  };
}
