import { cookies } from "next/headers";
import { z } from "zod";
import { readJson, requireUser } from "@/lib/auth/guard";
import { confirmMfaSetup } from "@/lib/auth/mfa";
import { SESSION_COOKIE } from "@/lib/auth/tokens";
import { rateLimit } from "@/lib/rate-limit";
import { json } from "@/lib/api";

const Body = z.object({ code: z.string().min(6).max(8) }).strict();

/** Conferma la configurazione della 2FA con il primo codice valido. */
export async function POST(req: Request) {
  const g = await requireUser();
  if ("response" in g) return g.response;
  const rl = rateLimit(`mfa:${g.user.id}`, 10, 10 * 60_000);
  if (!rl.ok) return json({ error: "rate-limited" }, { status: 429 });
  const b = await readJson(req, 1024);
  if ("response" in b) return b.response;
  const parsed = Body.safeParse(b.body);
  if (!parsed.success) return json({ error: "invalid-request" }, { status: 400 });
  const token = (await cookies()).get(SESSION_COOKIE)?.value ?? "";
  const ok = await confirmMfaSetup(g.user.id, token, parsed.data.code);
  if (!ok) return json({ error: "invalid-code", message: "Codice non valido. Controlla l'ora del dispositivo e riprova." }, { status: 400 });
  return json({ ok: true });
}
