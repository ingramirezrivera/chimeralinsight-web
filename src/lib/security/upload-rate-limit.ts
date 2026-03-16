const WINDOW_MS = 15 * 60_000;
const MAX_ATTEMPTS = 20;

const attempts = new Map<string, number[]>();

function prune(values: number[], now: number) {
  return values.filter((value) => now - value < WINDOW_MS);
}

export function assertUploadRateLimit(key: string) {
  const now = Date.now();
  const nextValues = prune(attempts.get(key) || [], now);
  nextValues.push(now);
  attempts.set(key, nextValues);

  return nextValues.length <= MAX_ATTEMPTS;
}
