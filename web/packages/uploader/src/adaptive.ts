import type { NetworkHint } from "./types";

export function initialPolicy(network: NetworkHint) {
  if (network === "wifi") return { partSize: 16 * 1024 * 1024, concurrency: 4 };
  if (network === "cellular") return { partSize: 8 * 1024 * 1024, concurrency: 2 };
  return { partSize: 8 * 1024 * 1024, concurrency: 2 };
}

export function adaptPartSize(current: number, bps: number, recentErrors: number) {
  const MIN = 5 * 1024 * 1024;
  const MAX = 32 * 1024 * 1024;

  let next = current;

  if (recentErrors >= 2) {
    next = Math.max(MIN, Math.floor(current * 0.7));
  } else {
    const mbps = bps / (1024 * 1024);
    if (mbps > 10) next = Math.min(MAX, current + 8 * 1024 * 1024);
    else if (mbps > 5) next = Math.min(MAX, current + 4 * 1024 * 1024);
    else if (mbps < 1.5) next = Math.max(MIN, Math.floor(current * 0.75));
  }

  next = Math.round(next / (1024 * 1024)) * (1024 * 1024);
  return Math.max(MIN, Math.min(MAX, next));
}
