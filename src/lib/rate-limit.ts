/**
 * Rate limiter in memoria (finestra fissa). Sufficiente per la demo su singola istanza.
 * In produzione va sostituito da uno store condiviso (es. Redis/Postgres).
 */
const buckets = new Map<string, { count: number; resetAt: number }>();
const MAX_BUCKETS = 10_000;

function prune(now: number) {
  if (buckets.size < MAX_BUCKETS) return;
  for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
  if (buckets.size >= MAX_BUCKETS) buckets.clear();
}

export function rateLimit(key: string, limit: number, windowMs: number, now = Date.now()): { ok: boolean; retryAfterSec: number } {
  prune(now);
  const b = buckets.get(key);
  if (!b || b.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSec: 0 };
  }
  b.count += 1;
  if (b.count > limit) return { ok: false, retryAfterSec: Math.ceil((b.resetAt - now) / 1000) };
  return { ok: true, retryAfterSec: 0 };
}

/**
 * Chiave del client. Gli header X-Forwarded-For / X-Real-IP sono scritti dal client a meno che
 * un proxy fidato li sovrascriva: si usano solo con TRUST_PROXY="true" (impostato dall'operatore).
 */
export function clientKey(req: Request, env: Record<string, string | undefined> = process.env): string {
  if (env.TRUST_PROXY !== "true") return "local";
  const fwd = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return fwd || req.headers.get("x-real-ip") || "local";
}
