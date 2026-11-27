import { hasHealthDataConsent } from "@/lib/auth/service";
import { requireUser } from "@/lib/auth/guard";
import { json } from "@/lib/api";
import { readFlags } from "@/lib/feature-flags";
import { todayIso } from "@/domain/famiglia/promemoria";
import { loadVociEsempio } from "@/domain/diari/repository";

/** Solo versione dimostrativa: carica le voci di esempio dei tre diari (numeri inventati). */
export async function POST() {
  const g = await requireUser();
  if ("response" in g) return g.response;
  // 27/11/2026 (fase 1): dopo la revoca del consenso ai dati sanitari non si salva nulla di sanitario (prima i diari sì).
  if (!(await hasHealthDataConsent(g.user.id))) return json({ error: "consent-withdrawn", message: "Hai revocato il consenso al trattamento dei dati sanitari: per salvare serve un nuovo consenso, dalle Impostazioni." }, { status: 403 });
  if (!readFlags().demoMode) return json({ error: "demo-only", message: "L'esempio esiste solo nella versione dimostrativa." }, { status: 403 });
  return json({ ok: true, added: await loadVociEsempio(g.user.id, todayIso()) });
}
