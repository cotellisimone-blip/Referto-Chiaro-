import { autoTitle } from "@/domain/pipeline/titolo";
import { cookies } from "next/headers";
import { loginDemoAccount } from "@/lib/auth/service";
import { sessionCookie } from "@/lib/auth/session";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { json } from "@/lib/api";
import { createSyntheticDocument, getDocument, listDocuments, saveVerification } from "@/domain/pipeline/repository";
import { runPendingJobs } from "@/domain/pipeline/worker";
import { DEMO_DOCUMENT_ID, listSyntheticSamples } from "@/fixtures/synthetic";

/** Il referto di esempio più vecchio con esami in comune con quello principale (colesterolo, glicemia). */
const DEMO_OLDER_DOCUMENT_ID = "demo-referto-lipidico-004";

/** Accesso immediato all'account dimostrativo (solo DEMO_MODE). */
export async function POST(req: Request) {
  const rl = rateLimit(`auth-demo:${clientKey(req)}`, Number(process.env.AUTH_RATE_LIMIT_PER_10MIN) || 20, 10 * 60_000);
  if (!rl.ok) return json({ error: "rate-limited" }, { status: 429 });
  const r = await loginDemoAccount();
  if (!r.ok) return json({ error: "demo-disabled", message: "L'account demo è disponibile solo in modalità dimostrativa." }, { status: 403 });
  // Ciclo 2, fase 1: la pagina di accesso promette «referti inventati già caricati». Se l'account condiviso è vuoto
  // (prima apertura, o qualcuno ha cancellato tutto), ci rimettiamo il referto di esempio principale.
  if ((await listDocuments(r.user.id)).length === 0) {
    // Quarto giro, punto 6: prima un referto più vecchio, già letto e confermato (l'assetto lipidico di maggio), così
    // «Nel tempo» ha già un punto di partenza. Il referto di novembre resta da controllare: confermandolo compare la
    // linea di colesterolo totale, LDL e glicemia. Tutto inventato, come gli altri esempi.
    const older = listSyntheticSamples().find((s) => s.id === DEMO_OLDER_DOCUMENT_ID);
    if (older) {
      const olderId = await createSyntheticDocument(r.user.id, older.id, autoTitle(older.title, older.reportDate ?? ""));
      await runPendingJobs(r.user.id);
      const doc = await getDocument(r.user.id, olderId);
      const ids = doc?.extracted?.observations.filter((o) => o.valueRaw !== null).map((o) => o.id) ?? [];
      if (ids.length) await saveVerification(r.user.id, olderId, ids);
    }
    const sample = listSyntheticSamples().find((s) => s.id === DEMO_DOCUMENT_ID);
    const title = autoTitle(sample?.title ?? "Referto di laboratorio", sample?.reportDate ?? "");
    await createSyntheticDocument(r.user.id, DEMO_DOCUMENT_ID, title);
  }
  (await cookies()).set(sessionCookie(r.sessionToken));
  return json({ ok: true, user: { email: r.user.email, displayName: r.user.displayName } });
}
