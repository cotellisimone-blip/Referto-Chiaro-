import { isUuid, requireUser } from "@/lib/auth/guard";
import { json } from "@/lib/api";
import { deleteDocument, getDocument, listDocuments, listReports, renameDocument } from "@/domain/pipeline/repository";
import { cleanTitle, findOlderTwin } from "@/domain/pipeline/titolo";
import { enrichReport } from "@/domain/reporting/enrich";
import { buildGuidaPersonale } from "@/domain/reporting/guida-personale";
import { tickJobs } from "@/domain/pipeline/worker";
import { assignDocument } from "@/domain/famiglia/repository";
import { SELF_ID } from "@/domain/famiglia/persone";

export async function GET(_req: Request, ctx: RouteContext<"/api/v1/area/documents/[id]">) {
  const g = await requireUser();
  if ("response" in g) return g.response;
  const { id } = await ctx.params;
  if (!isUuid(id)) return json({ error: "not-found" }, { status: 404 });
  await tickJobs(g.user.id);
  const doc = await getDocument(g.user.id, id);
  if (!doc) return json({ error: "not-found", message: "Documento non trovato." }, { status: 404 });
  const reports = await listReports(g.user.id, id);
  // Report pronto: fattori generali dalle guide e confronto con referti precedenti davvero confrontabili.
  const ready = reports.find((r) => r.status === "ready" && r.explanation);
  let enrichment = null;
  if (ready?.explanation && doc.extracted) {
    const others = (await listDocuments(g.user.id)).filter((d) => d.id !== doc.id && d.profileId === doc.profileId && d.extracted && d.verification);
    enrichment = {
      ...enrichReport({
        current: doc.extracted,
        explanation: ready.explanation,
        previous: others.map((d) => ({ document: d.extracted!, confirmedObservationIds: d.verification!.confirmedObservationIds })),
      }),
      // 19/11/2026: la guida personale è inclusa nel report a pagamento, senza costi in più.
      guida: buildGuidaPersonale(ready.explanation),
    };
  }
  // Terzo giro, punto 4: lo stesso referto (stessa data, stesse righe) già presente per la stessa persona.
  const older = doc.extracted ? findOlderTwin(doc, await listDocuments(g.user.id)) : null;
  const twin = older ? { id: older.id, title: older.title, createdAt: older.createdAt } : null;
  return json({ document: doc, reports, enrichment, twin });
}

export async function DELETE(_req: Request, ctx: RouteContext<"/api/v1/area/documents/[id]">) {
  const g = await requireUser();
  if ("response" in g) return g.response;
  const { id } = await ctx.params;
  if (!isUuid(id)) return json({ error: "not-found" }, { status: 404 });
  const ok = await deleteDocument(g.user.id, id);
  return ok ? json({ ok: true }) : json({ error: "not-found" }, { status: 404 });
}

/** Famiglia: sposta il referto su un'altra persona (body: { profileId: "io" | uuid }). */
export async function PATCH(req: Request, ctx: RouteContext<"/api/v1/area/documents/[id]">) {
  const g = await requireUser();
  if ("response" in g) return g.response;
  const { id } = await ctx.params;
  if (!isUuid(id)) return json({ error: "not-found" }, { status: 404 });
  const body = (await req.json().catch(() => ({}))) as { profileId?: unknown; title?: unknown };
  // Cambio del nome (body: { title }): una riga, al massimo 80 caratteri.
  if (body.title !== undefined) {
    const title = cleanTitle(body.title);
    if (!title) return json({ error: "invalid-request", message: "Scrivi un nome per il referto." }, { status: 400 });
    const renamed = await renameDocument(g.user.id, id, title);
    return renamed ? json({ ok: true, title }) : json({ error: "not-found", message: "Documento non trovato." }, { status: 404 });
  }
  const pid = typeof body.profileId === "string" ? body.profileId : "";
  if (pid !== SELF_ID && !isUuid(pid)) return json({ error: "invalid-request" }, { status: 400 });
  const ok = await assignDocument(g.user.id, id, pid);
  return ok ? json({ ok: true }) : json({ error: "not-found", message: "Documento o familiare non trovato." }, { status: 404 });
}
