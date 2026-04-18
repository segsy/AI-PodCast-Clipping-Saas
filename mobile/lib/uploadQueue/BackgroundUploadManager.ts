/**
 * Tier-2 (Dev Build) scaffold:
 * - integrate `react-native-background-upload` for OS-level persistence
 * - persist task IDs and restore on app boot
 * - support true pause/resume and survive app kill
 *
 * This file intentionally provides a minimal contract for future swap-in.
 */

export type BackgroundTask = {
  taskId: string;
  fileUri: string;
  status: "uploading" | "paused" | "failed" | "completed";
};

export async function startPersistentUpload(_fileUri: string): Promise<BackgroundTask> {
  throw new Error("Tier-2 background upload requires Dev Build + react-native-background-upload");
}

export async function pausePersistentUpload(_taskId: string) {
  throw new Error("Tier-2 pause/resume requires Dev Build + react-native-background-upload");
}

export async function resumePersistentUpload(_taskId: string) {
  throw new Error("Tier-2 pause/resume requires Dev Build + react-native-background-upload");
}

export async function restorePersistentTasks(): Promise<BackgroundTask[]> {
  return [];
}
