import "server-only";
import { withSystem } from "@/db/client";
import { rateLimit } from "./rate-limit";

/**
 * Limitatore condiviso tra istanze (necessario su Vercel, dove ogni funzione ha la sua memoria).
 * Con DATABASE_URL usa una tabella PostgreSQL (finestra fissa, upsert atomico); senza, la memoria locale.
 * Le chiavi sono già pseudonime (hash IP o id utente): nessun dato personale in chiaro.
 */
export async function rateLimitShared(key: string, limit: number, windowMs: number): Promise<{ ok: boolean; retryAfterSec: number }> {
  const local = rateLimit(key, limit, windowMs);
  if (!local.ok || !process.env.DATABASE_URL) return local;
  const windowStart = new Date(Math.floor(Date.now() / windowMs) * windowMs);
  try {
    const r = await withSystem((tx) =>
      tx.query<{ count: number }>(
        "INSERT INTO rate_limits(key, window_start, count) VALUES ($1, $2, 1) ON CONFLICT (key, window_start) DO UPDATE SET count = rate_limits.count + 1 RETURNING count",
        [key, windowStart.toISOString()],
      ),
    );
    const count = Number(r.rows[0]?.count ?? 0);
    const retryAfterSec = Math.ceil((windowStart.getTime() + windowMs - Date.now()) / 1000);
    return { ok: count <= limit, retryAfterSec: count <= limit ? 0 : retryAfterSec };
  } catch {
    return local; // il database non deve diventare un punto di blocco del login
  }
}
