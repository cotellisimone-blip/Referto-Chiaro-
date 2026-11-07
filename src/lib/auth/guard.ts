import "server-only";
import { json } from "@/lib/api";
import { getCurrentUser } from "./session";
import type { User } from "./service";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Utente autenticato o risposta 401. Le API dell'area personale iniziano tutte da qui. */
export async function requireUser(): Promise<{ user: User } | { response: Response }> {
  const user = await getCurrentUser();
  if (!user) return { response: json({ error: "unauthenticated", message: "Accedi per continuare." }, { status: 401 }) };
  return { user };
}

export function isUuid(v: string): boolean {
  return UUID.test(v);
}

export async function readJson(req: Request, maxBytes = 16_384): Promise<{ body: unknown } | { response: Response }> {
  const raw = await req.text();
  if (raw.length > maxBytes) return { response: json({ error: "payload-too-large" }, { status: 413 }) };
  try {
    return { body: raw ? JSON.parse(raw) : {} };
  } catch {
    return { response: json({ error: "invalid-json" }, { status: 400 }) };
  }
}
