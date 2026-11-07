import { cookies } from "next/headers";
import { z } from "zod";
import { loginDemoRole } from "@/lib/auth/service";
import { sessionCookie } from "@/lib/auth/session";
import { readJson } from "@/lib/auth/guard";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { json } from "@/lib/api";

const Body = z.object({ role: z.enum(["physician", "admin"]) }).strict();

/** Accesso agli account di servizio dimostrativi (medico/admin). Solo DEMO_MODE; la 2FA resta obbligatoria. */
export async function POST(req: Request) {
  const rl = rateLimit(`auth-demo-role:${clientKey(req)}`, Number(process.env.AUTH_RATE_LIMIT_PER_10MIN) || 20, 10 * 60_000);
  if (!rl.ok) return json({ error: "rate-limited" }, { status: 429 });
  const b = await readJson(req, 1024);
  if ("response" in b) return b.response;
  const parsed = Body.safeParse(b.body);
  if (!parsed.success) return json({ error: "invalid-request" }, { status: 400 });
  const r = await loginDemoRole(parsed.data.role);
  if (!r.ok) return json({ error: "demo-disabled", message: "Gli account dimostrativi esistono solo in modalità dimostrativa." }, { status: 403 });
  (await cookies()).set(sessionCookie(r.sessionToken));
  return json({ ok: true, role: r.user.role, mfaEnabled: r.user.mfaEnabled });
}
