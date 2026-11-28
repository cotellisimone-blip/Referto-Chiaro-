import { requireUser } from "@/lib/auth/guard";
import { json } from "@/lib/api";
import { readFlags } from "@/lib/feature-flags";
import { loadDemoHistory } from "@/domain/famiglia/repository";
import { todayIso } from "@/domain/famiglia/promemoria";

/**
 * Solo versione dimostrativa: carica la famiglia di esempio (referti inventati di anni precedenti,
 * il familiare «Lucia», due promemoria). Mai disponibile con i dati reali.
 */
export async function POST() {
  const g = await requireUser();
  if ("response" in g) return g.response;
  if (!readFlags().demoMode) return json({ error: "demo-only", message: "Lo storico di esempio esiste solo nella versione dimostrativa." }, { status: 403 });
  try {
    const out = await loadDemoHistory(g.user.id, todayIso());
    return json({ ok: true, ...out });
  } catch {
    return json({ error: "limit-reached", message: "Hai già cinque familiari: elimina una scheda per caricare l'esempio." }, { status: 409 });
  }
}
