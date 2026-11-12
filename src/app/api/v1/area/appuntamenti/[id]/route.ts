import { isUuid, requireUser } from "@/lib/auth/guard";
import { cancelAppointment, getAppointment } from "@/domain/appointments/repository";
import { getOrderForRef } from "@/domain/orders/repository";
import { json } from "@/lib/api";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const g = await requireUser();
  if ("response" in g) return g.response;
  const { id } = await params;
  if (!isUuid(id)) return json({ error: "not-found" }, { status: 404 });
  const r = await getAppointment(g.user.id, id);
  if (!r) return json({ error: "not-found", message: "Appuntamento non trovato." }, { status: 404 });
  return json({ ...r, order: await getOrderForRef(g.user.id, id) });
}

/** Annullamento da parte del paziente, solo prima della conferma del medico. */
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const g = await requireUser();
  if ("response" in g) return g.response;
  const { id } = await params;
  if (!isUuid(id)) return json({ error: "not-found" }, { status: 404 });
  const ok = await cancelAppointment(g.user.id, id);
  return ok ? json({ ok: true }) : json({ error: "invalid-state", message: "L'appuntamento non può essere annullato in questo stato." }, { status: 409 });
}
