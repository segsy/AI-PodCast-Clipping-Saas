export function createSpeedEstimator(alpha = 0.2) {
  let ema = 0;
  let lastT = Date.now();
  let lastBytes = 0;

  return function update(totalUploadedBytes: number) {
    const now = Date.now();
    const dt = (now - lastT) / 1000;
    if (dt < 0.25) return { bps: ema };

    const db = Math.max(0, totalUploadedBytes - lastBytes);
    const current = db / dt;

    ema = ema ? alpha * current + (1 - alpha) * ema : current;
    lastT = now;
    lastBytes = totalUploadedBytes;

    return { bps: ema };
  };
}

export function etaSeconds(totalBytes: number, uploadedBytes: number, bps: number) {
  if (!bps || bps <= 1) return Number.POSITIVE_INFINITY;
  return Math.max(0, (totalBytes - uploadedBytes) / bps);
}
