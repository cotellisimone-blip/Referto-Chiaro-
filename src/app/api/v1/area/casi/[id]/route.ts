import { isUuid, requireUser } from "@/lib/auth/guard";
import { closeCase, getCase } from "@/domain/cases/repository";
import { json } from "@/lib/api";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const g = await requireUser();
  if ("response" in g) return g.response;
  const { id } = await params;
  if (!isUuid(id)) return json({ error: "not-found" }, { status: 404 });
  const r = await getCase(g.user.id, id);
  if (!r) return json({ error: "not-found", message: "Richiesta non trovata." }, { status: 404 });
  return json(r);
}

/** Chiusura da parte del paziente (dopo risposta o rifiuto). */
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const g = await requireUser();
  if ("response" in g) return g.response;
  const { id } = await params;
  if (!isUuid(id)) return json({ error: "not-found" }, { status: 404 });
  const ok = await closeCase(g.user.id, id);
  return ok ? json({ ok: true }) : json({ error: "invalid-state", message: "La richiesta non può essere chiusa in questo stato." }, { status: 409 });
}
