import { requireUser } from "@/lib/auth/guard";
import { json } from "@/lib/api";
import { readFlags } from "@/lib/feature-flags";
import { todayIso } from "@/domain/famiglia/promemoria";
import { loadVociEsempio } from "@/domain/diari/repository";

/** Solo versione dimostrativa: carica le voci di esempio dei tre diari (numeri inventati). */
export async function POST() {
  const g = await requireUser();
  if ("response" in g) return g.response;
  if (!readFlags().demoMode) return json({ error: "demo-only", message: "L'esempio esiste solo nella versione dimostrativa." }, { status: 403 });
  return json({ ok: true, added: await loadVociEsempio(g.user.id, todayIso()) });
}
