import { cookies } from "next/headers";
import { loginDemoAccount } from "@/lib/auth/service";
import { sessionCookie } from "@/lib/auth/session";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { json } from "@/lib/api";
import { createSyntheticDocument, listDocuments } from "@/domain/pipeline/repository";
import { DEMO_DOCUMENT_ID, listSyntheticSamples } from "@/fixtures/synthetic";

/** Accesso immediato all'account dimostrativo (solo DEMO_MODE). */
export async function POST(req: Request) {
  const rl = rateLimit(`auth-demo:${clientKey(req)}`, Number(process.env.AUTH_RATE_LIMIT_PER_10MIN) || 20, 10 * 60_000);
  if (!rl.ok) return json({ error: "rate-limited" }, { status: 429 });
  const r = await loginDemoAccount();
  if (!r.ok) return json({ error: "demo-disabled", message: "L'account demo è disponibile solo in modalità dimostrativa." }, { status: 403 });
  // Ciclo 2, fase 1: la pagina di accesso promette «referti inventati già caricati». Se l'account condiviso è vuoto
  // (prima apertura, o qualcuno ha cancellato tutto), ci rimettiamo il referto di esempio principale.
  if ((await listDocuments(r.user.id)).length === 0) {
    const title = listSyntheticSamples().find((s) => s.id === DEMO_DOCUMENT_ID)?.title ?? "Referto di laboratorio";
    await createSyntheticDocument(r.user.id, DEMO_DOCUMENT_ID, title);
  }
  (await cookies()).set(sessionCookie(r.sessionToken));
  return json({ ok: true, user: { email: r.user.email, displayName: r.user.displayName } });
}
