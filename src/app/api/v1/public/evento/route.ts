import { withSystem } from "@/db/client";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { isPublicEvent } from "@/domain/metrics/funnel";

/**
 * Contatore anonimo del funnel pubblico: accetta solo eventi noti, incrementa un totale giornaliero.
 * Nessun cookie, nessun identificativo, nessun IP salvato (l'IP serve solo al limite di frequenza in memoria).
 */
export async function POST(req: Request) {
  const rl = rateLimit(`evento:${clientKey(req)}`, 60, 10 * 60_000);
  if (!rl.ok) return new Response(null, { status: 204 });
  let event: unknown = null;
  try {
    const text = (await req.text()).slice(0, 200);
    event = (JSON.parse(text) as { event?: unknown }).event;
  } catch {
    return new Response(null, { status: 400 });
  }
  if (!isPublicEvent(event)) return new Response(null, { status: 400 });
  await withSystem((tx) =>
    tx.query("INSERT INTO funnel_daily(day, event, count) VALUES (current_date, $1, 1) ON CONFLICT (day, event) DO UPDATE SET count = funnel_daily.count + 1", [event]),
  );
  return new Response(null, { status: 204 });
}
