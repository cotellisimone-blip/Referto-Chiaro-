import { z } from "zod";
import { requestMagicLink } from "@/lib/auth/service";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { json } from "@/lib/api";
import { readJson } from "@/lib/auth/guard";

const Body = z.object({ email: z.string().max(254), consents: z.array(z.enum(["terms", "privacy", "health-data", "subject-declaration"])).default([]) }).strict();

/**
 * Richiesta del link di accesso. In demo non esiste un servizio email: il link viene restituito
 * nella risposta e mostrato sullo schermo, dichiarandolo in modo esplicito.
 */
export async function POST(req: Request) {
  const limit = Number(process.env.AUTH_RATE_LIMIT_PER_10MIN) || 10;
  const rl = rateLimit(`auth:${clientKey(req)}`, limit, 10 * 60_000);
  if (!rl.ok) return json({ error: "rate-limited", message: "Troppe richieste. Riprova tra qualche minuto." }, { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } });
  const r = await readJson(req, 2_048);
  if ("response" in r) return r.response;
  const parsed = Body.safeParse(r.body);
  if (!parsed.success) return json({ error: "invalid-request" }, { status: 400 });
  const out = await requestMagicLink(parsed.data);
  if (!out.ok) {
    const messages = { "invalid-email": "Indirizzo email non valido.", "signup-closed": "Le registrazioni non sono ancora aperte.", "consent-required": "Per registrarti devi accettare termini, privacy e trattamento dei dati sanitari." };
    return json({ error: out.code, message: messages[out.code] }, { status: out.code === "signup-closed" ? 403 : 400 });
  }
  // Nessuna indicazione se l'indirizzo era già registrato: la risposta è la stessa.
  return json({ ok: true, delivery: out.delivery, link: out.link });
}
