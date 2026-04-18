export async function withRetries<T>(fn: () => Promise<T>, maxRetries: number, baseMs = 500): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (error) {
      attempt += 1;
      if (attempt > maxRetries) throw error;
      const jitter = Math.random() * 250;
      const wait = baseMs * Math.pow(2, attempt - 1) + jitter;
      await new Promise((resolve) => setTimeout(resolve, wait));
    }
  }
}
