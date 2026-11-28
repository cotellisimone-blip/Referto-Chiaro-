import { z } from "zod";
import { json } from "@/lib/api";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { WAITLIST_INTERESTS, addToWaitlist } from "@/lib/waitlist";
import { SOURCES } from "@/domain/metrics/funnel";

const MAX_BYTES = 4_096;

const Body = z
  .object({
    email: z.string().max(254),
    interest: z.enum(WAITLIST_INTERESTS),
    organization: z.string().max(120).optional(),
    note: z.string().max(500).optional(),
    consent: z.literal(true),
    // Ciclo 2: sorgente della visita, dallo stesso elenco chiuso del funnel (facoltativa).
    source: z.enum(SOURCES).optional(),
    // Ciclo 4: CAP della zona, facoltativo (obbligatorio nel modulo del domicilio).
    cap: z.string().regex(/^\d{5}$/).optional(),
  })
  .strict();

/** Iscrizione alla lista d'attesa (interesse non vincolante). Non invia email e non registra l'indirizzo nei log. */
export async function POST(req: Request) {
  const limit = Number(process.env.WAITLIST_RATE_LIMIT_PER_10MIN) || 5;
  const rl = rateLimit(`waitlist:${clientKey(req)}`, limit, 10 * 60_000);
  if (!rl.ok) {
    return json(
      { error: "rate-limited", message: "Troppe richieste. Riprova tra qualche minuto." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
    );
  }
  const raw = await req.text();
  if (new TextEncoder().encode(raw).length > MAX_BYTES) return json({ error: "payload-too-large" }, { status: 413 });
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ error: "invalid-json" }, { status: 400 });
  }
  const parsed = Body.safeParse(body);
  if (!parsed.success) {
    const consentMissing = parsed.error.issues.some((i) => i.path[0] === "consent");
    return json(
      { error: consentMissing ? "consent-required" : "invalid-request", message: consentMissing ? "Per iscriverti devi accettare l'informativa privacy (bozza)." : "Controlla i dati inseriti." },
      { status: 400 },
    );
  }
  const { consent: _consent, ...entry } = parsed.data;
  void _consent;
  try {
    const out = await addToWaitlist(entry);
    return json(out);
  } catch (e) {
    if (e instanceof z.ZodError) return json({ error: "invalid-request", message: "Indirizzo email o dati non validi." }, { status: 400 });
    console.error("waitlist: errore interno"); // mai l'indirizzo email nei log
    return json({ error: "internal", message: "Si è verificato un errore. Riprova." }, { status: 500 });
  }
}
