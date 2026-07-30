import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export type RuleKey = "login" | "contact";

const RULES: Record<
  RuleKey,
  { tokens: number; windowMs: number; duration: `${number} ${"s" | "m" | "h"}` }
> = {
  // 5 login attempts per 15 minutes per IP
  login: { tokens: 5, windowMs: 15 * 60 * 1000, duration: "15 m" },
  // 5 enquiries per 10 minutes per IP
  contact: { tokens: 5, windowMs: 10 * 60 * 1000, duration: "10 m" },
};

const hasUpstash =
  !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = hasUpstash ? Redis.fromEnv() : null;
const limiters = new Map<RuleKey, Ratelimit>();

function upstashLimiter(kind: RuleKey): Ratelimit | null {
  if (!redis) return null;
  let limiter = limiters.get(kind);
  if (!limiter) {
    const rule = RULES[kind];
    limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(rule.tokens, rule.duration),
      prefix: `rl:${kind}`,
      analytics: false,
    });
    limiters.set(kind, limiter);
  }
  return limiter;
}

// In-memory fallback — per serverless instance, so only meaningful for local
// dev / single-instance. Distributed limiting requires Upstash (above).
const mem = new Map<string, { count: number; resetAt: number }>();
function memLimit(kind: RuleKey, key: string): boolean {
  const rule = RULES[kind];
  const now = Date.now();
  const k = `${kind}:${key}`;
  const bucket = mem.get(k);
  if (!bucket || now > bucket.resetAt) {
    mem.set(k, { count: 1, resetAt: now + rule.windowMs });
    return true;
  }
  if (bucket.count >= rule.tokens) return false;
  bucket.count += 1;
  return true;
}

/** Returns { ok:false } once the caller exceeds the limit for `kind`. */
export async function rateLimit(
  kind: RuleKey,
  key: string
): Promise<{ ok: boolean }> {
  const limiter = upstashLimiter(kind);
  if (limiter) {
    try {
      const res = await limiter.limit(`${kind}:${key}`);
      return { ok: res.success };
    } catch (err) {
      // If Redis is unreachable, fall back rather than lock everyone out.
      console.error("[ratelimit] upstash error; using in-memory fallback", err);
      return { ok: memLimit(kind, key) };
    }
  }
  return { ok: memLimit(kind, key) };
}
