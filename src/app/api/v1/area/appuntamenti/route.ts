import { z } from "zod";
import { isUuid, readJson, requireUser } from "@/lib/auth/guard";
import { createAppointment, listAppointments } from "@/domain/appointments/repository";
import { createServiceOrder } from "@/domain/orders/repository";
import { getDocument } from "@/domain/pipeline/repository";
import { isCapabilityEnabled } from "@/lib/feature-flags";
import { openCheckout, providerOrResponse } from "@/lib/payments/checkout";
import { json } from "@/lib/api";

const DAY = /^\d{4}-\d{2}-\d{2}$/;

const Body = z
  .object({
    /** Ignorata: il videoconsulto è sempre con un medico di medicina generale o internista. */
    specialty: z.string().max(80).optional(),
    /** Motivo breve, in parole proprie: non è un questionario clinico. */
    reason: z.string().min(10).max(300),
    slots: z.array(z.object({ day: z.string().regex(DAY), window: z.enum(["mattina", "pomeriggio", "sera"]) }).strict()).min(1).max(3),
    documentIds: z.array(z.string()).max(5),
    acknowledgeSimulation: z.boolean(),
    /** Consenso esplicito a condividere i documenti scelti con il medico assegnato (art. 9). */
    consentToShare: z.literal(true),
  })
  .strict();

export async function GET() {
  const g = await requireUser();
  if ("response" in g) return g.response;
  return json({ appointments: await listAppointments(g.user.id) });
}

/** Le fasce scelte devono essere giorni futuri entro 30 giorni. */
function validSlots(slots: { day: string }[], now = new Date()): boolean {
  const today = new Date(now.toISOString().slice(0, 10) + "T00:00:00Z").getTime();
  return slots.every((s) => {
    const t = new Date(s.day + "T00:00:00Z").getTime();
    return Number.isFinite(t) && t > today && t <= today + 30 * 86_400_000;
  });
}

/**
 * Nuova richiesta di videoconsulto. Con il gate `medicalVideoConsult` chiuso (sempre, in demo) è una SIMULAZIONE:
 * solo documenti sintetici, medico dimostrativo, pagamento simulato.
 */
export async function POST(req: Request) {
  const g = await requireUser();
  if ("response" in g) return g.response;
  const b = await readJson(req, 8192);
  if ("response" in b) return b.response;
  const parsed = Body.safeParse(b.body);
  if (!parsed.success || !parsed.data.documentIds.every(isUuid)) return json({ error: "invalid-request", message: "Controlla i campi: motivo di almeno 10 caratteri e da 1 a 3 fasce orarie." }, { status: 400 });
  if (!validSlots(parsed.data.slots)) return json({ error: "invalid-slots", message: "Scegli giorni a partire da domani, entro 30 giorni." }, { status: 400 });
  const real = isCapabilityEnabled("medicalVideoConsult");
  if (!real && !parsed.data.acknowledgeSimulation) return json({ error: "simulation-ack-required", message: "In questa versione il videoconsulto è una simulazione: serve la conferma esplicita." }, { status: 400 });
  const docs = Array.from(new Set(parsed.data.documentIds));
  for (const id of docs) {
    const d = await getDocument(g.user.id, id);
    if (!d) return json({ error: "not-found", message: "Documento non trovato." }, { status: 404 });
    if (!real && d.sourceKind !== "synthetic") return json({ error: "capability-disabled", message: "Il videoconsulto con documenti reali non è attivo." }, { status: 403 });
  }
  const pr = providerOrResponse();
  if ("response" in pr) return pr.response;
  const r = await createAppointment(g.user.id, { reason: parsed.data.reason, slots: parsed.data.slots, documentIds: docs, isSimulated: !real });
  if ("error" in r) return json({ error: r.error, message: r.error === "limit-reached" ? "Hai già 3 appuntamenti aperti." : "Documento non trovato." }, { status: r.error === "limit-reached" ? 409 : 404 });
  const order = await createServiceOrder(g.user.id, { service: "videoconsulto", refId: r.id, documentIds: docs, provider: pr.provider.kind });
  const c = await openCheckout(req, g.user.id, pr.provider, order);
  if ("response" in c) return json({ id: r.id, checkoutUrl: null, paymentError: true }, { status: 201 });
  return json({ id: r.id, orderId: order.id, checkoutUrl: c.checkoutUrl }, { status: 201 });
}
