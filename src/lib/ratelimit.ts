import "server-only";

/**
 * Minimal in-memory fixed-window rate limiter — a baseline that works for a
 * single instance / local dev. For multi-instance production, swap this for
 * @upstash/ratelimit (Vercel KV / Upstash Redis) keyed the same way.
 */
type Bucket = { count: number; resetAt: number };
const store = new Map<string, Bucket>();

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const bucket = store.get(key);

  if (!bucket || now > bucket.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }
  if (bucket.count >= limit) {
    return { ok: false, remaining: 0 };
  }
  bucket.count += 1;
  return { ok: true, remaining: limit - bucket.count };
}
