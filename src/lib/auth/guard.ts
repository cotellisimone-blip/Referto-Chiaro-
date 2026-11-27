import "server-only";
import { json } from "@/lib/api";
import { getCurrentUser } from "./session";
import type { Role, User } from "./service";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Utente autenticato o risposta 401. Le API dell'area personale iniziano tutte da qui. */
export async function requireUser(): Promise<{ user: User } | { response: Response }> {
  const user = await getCurrentUser();
  if (!user) return { response: json({ error: "unauthenticated", message: "Accedi per continuare." }, { status: 401 }) };
  return { user };
}

/**
 * Ruolo richiesto + seconda verifica (TOTP) già superata nella sessione corrente.
 * 401 senza sessione, 403 con ruolo diverso, 403 `mfa-required` se la 2FA manca o non è stata verificata.
 */
export async function requireRole(roles: Role[]): Promise<{ user: User } | { response: Response }> {
  const g = await requireUser();
  if ("response" in g) return g;
  if (!roles.includes(g.user.role)) return { response: json({ error: "forbidden", message: "Non hai i permessi per questa operazione." }, { status: 403 }) };
  if (!g.user.mfaEnabled || !g.user.mfaVerified) {
    return { response: json({ error: "mfa-required", setup: !g.user.mfaEnabled, message: "Serve la seconda verifica (codice dall'app di autenticazione)." }, { status: 403 }) };
  }
  return g;
}

export function isUuid(v: string): boolean {
  return UUID.test(v);
}

/**
 * 27/11/2026 (fase 1, sicurezza): una richiesta che arriva dal browser con un Origin di un altro sito viene rifiutata,
 * oltre al cookie SameSite. Senza Origin (strumenti, webhook, test) si lascia passare: il cookie resta la difesa.
 */
export function crossOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin || origin === "null") return false;
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  try {
    return !host || new URL(origin).host !== host;
  } catch {
    return true;
  }
}

export async function readJson(req: Request, maxBytes = 16_384): Promise<{ body: unknown } | { response: Response }> {
  if (crossOrigin(req)) return { response: json({ error: "forbidden-origin" }, { status: 403 }) };
  const raw = await req.text();
  if (raw.length > maxBytes) return { response: json({ error: "payload-too-large" }, { status: 413 }) };
  try {
    return { body: raw ? JSON.parse(raw) : {} };
  } catch {
    return { response: json({ error: "invalid-json" }, { status: 400 }) };
  }
}
