import { cookies } from "next/headers";
import { loginDemoAccount } from "@/lib/auth/service";
import { sessionCookie } from "@/lib/auth/session";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { json } from "@/lib/api";

/** Accesso immediato all'account dimostrativo (solo DEMO_MODE). */
export async function POST(req: Request) {
  const rl = rateLimit(`auth-demo:${clientKey(req)}`, Number(process.env.AUTH_RATE_LIMIT_PER_10MIN) || 20, 10 * 60_000);
  if (!rl.ok) return json({ error: "rate-limited" }, { status: 429 });
  const r = await loginDemoAccount();
  if (!r.ok) return json({ error: "demo-disabled", message: "L'account demo è disponibile solo in modalità dimostrativa." }, { status: 403 });
  (await cookies()).set(sessionCookie(r.sessionToken));
  return json({ ok: true, user: { email: r.user.email, displayName: r.user.displayName } });
}
