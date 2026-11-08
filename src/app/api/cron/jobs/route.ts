import { timingSafeEqual } from "node:crypto";
import { json } from "@/lib/api";
import { runPendingJobs, usersWithPendingJobs } from "@/domain/pipeline/worker";

/**
 * Cron (Vercel Cron, ogni 5 minuti — vedi vercel.json): riprende i lavori rimasti in coda o interrotti
 * quando nessuno sta guardando la pagina. Protetto da CRON_SECRET (header Authorization: Bearer …).
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  const got = req.headers.get("authorization") ?? "";
  const expected = `Bearer ${secret}`;
  if (!secret || got.length !== expected.length || !timingSafeEqual(Buffer.from(got), Buffer.from(expected))) {
    return json({ error: "unauthorized" }, { status: 401 });
  }
  const started = Date.now();
  let jobs = 0;
  for (const userId of await usersWithPendingJobs(20)) {
    if (Date.now() - started > 45_000) break;
    jobs += await runPendingJobs(userId, 3);
  }
  return json({ ok: true, jobs });
}
