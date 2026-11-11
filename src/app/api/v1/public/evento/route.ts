import { withSystem } from "@/db/client";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { isPublicEvent, toSource } from "@/domain/metrics/funnel";

/**
 * Contatore anonimo del funnel pubblico: accetta solo eventi noti, incrementa un totale giornaliero.
 * Nessun cookie, nessun identificativo, nessun IP salvato (l'IP serve solo al limite di frequenza in memoria).
 */
export async function POST(req: Request) {
  const rl = rateLimit(`evento:${clientKey(req)}`, 60, 10 * 60_000);
  if (!rl.ok) return new Response(null, { status: 204 });
  let event: unknown = null;
  let rawSource: unknown = undefined;
  try {
    const text = (await req.text()).slice(0, 200);
    const body = JSON.parse(text) as { event?: unknown; source?: unknown };
    event = body.event;
    rawSource = body.source;
  } catch {
    return new Response(null, { status: 400 });
  }
  if (!isPublicEvent(event)) return new Response(null, { status: 400 });
  // Ciclo 2: la sorgente è facoltativa e passa da un elenco chiuso; un valore sconosciuto diventa «altro».
  const source = rawSource === undefined ? null : toSource(rawSource);
  await withSystem(async (tx) => {
    await tx.query("INSERT INTO funnel_daily(day, event, count) VALUES (current_date, $1, 1) ON CONFLICT (day, event) DO UPDATE SET count = funnel_daily.count + 1", [event]);
    if (source) {
      await tx.query(
        "INSERT INTO funnel_source_daily(day, source, event, count) VALUES (current_date, $1, $2, 1) ON CONFLICT (day, source, event) DO UPDATE SET count = funnel_source_daily.count + 1",
        [source, event],
      );
    }
  });
  return new Response(null, { status: 204 });
}
