import { z } from "zod";
import { isUuid, readJson, requireUser } from "@/lib/auth/guard";
import { createCase, listCases } from "@/domain/cases/repository";
import { isCapabilityEnabled } from "@/lib/feature-flags";
import { getDocument } from "@/domain/pipeline/repository";
import { json } from "@/lib/api";

const Body = z
  .object({
    documentId: z.string(),
    specialty: z.string().min(2).max(80),
    question: z.string().min(20).max(1500),
    acknowledgeSimulation: z.boolean(),
  })
  .strict();

export async function GET() {
  const g = await requireUser();
  if ("response" in g) return g.response;
  return json({ cases: await listCases(g.user.id) });
}

/**
 * Nuovo caso di secondo parere. Con il gate `medicalSecondOpinion` chiuso (sempre, in demo)
 * il caso è una SIMULAZIONE e accetta solo referti sintetici: nessun dato reale, nessun medico reale.
 */
export async function POST(req: Request) {
  const g = await requireUser();
  if ("response" in g) return g.response;
  const b = await readJson(req, 8192);
  if ("response" in b) return b.response;
  const parsed = Body.safeParse(b.body);
  if (!parsed.success || !isUuid(parsed.data.documentId)) return json({ error: "invalid-request" }, { status: 400 });
  const real = isCapabilityEnabled("medicalSecondOpinion");
  if (!real && !parsed.data.acknowledgeSimulation) return json({ error: "simulation-ack-required", message: "In questa versione il secondo parere è una simulazione: serve la conferma esplicita." }, { status: 400 });
  const doc = await getDocument(g.user.id, parsed.data.documentId);
  if (!doc) return json({ error: "not-found", message: "Documento non trovato." }, { status: 404 });
  if (!real && doc.sourceKind !== "synthetic") return json({ error: "capability-disabled", message: "Il secondo parere su documenti reali non è attivo." }, { status: 403 });
  const r = await createCase(g.user.id, { documentId: doc.id, specialty: parsed.data.specialty, question: parsed.data.question, isSimulated: !real });
  if ("error" in r) {
    const msg = r.error === "document-not-ready" ? "Prima conferma i valori del documento." : "Hai già 5 richieste aperte.";
    return json({ error: r.error, message: msg }, { status: 409 });
  }
  return json({ id: r.id, status: "submitted" }, { status: 201 });
}
