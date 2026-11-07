import { isUuid, requireUser } from "@/lib/auth/guard";
import { json } from "@/lib/api";
import { deleteDocument, getDocument, listReports } from "@/domain/pipeline/repository";
import { runPendingJobs } from "@/domain/pipeline/worker";

export async function GET(_req: Request, ctx: RouteContext<"/api/v1/area/documents/[id]">) {
  const g = await requireUser();
  if ("response" in g) return g.response;
  const { id } = await ctx.params;
  if (!isUuid(id)) return json({ error: "not-found" }, { status: 404 });
  await runPendingJobs(g.user.id);
  const doc = await getDocument(g.user.id, id);
  if (!doc) return json({ error: "not-found", message: "Documento non trovato." }, { status: 404 });
  const reports = await listReports(g.user.id, id);
  return json({ document: doc, reports });
}

export async function DELETE(_req: Request, ctx: RouteContext<"/api/v1/area/documents/[id]">) {
  const g = await requireUser();
  if ("response" in g) return g.response;
  const { id } = await ctx.params;
  if (!isUuid(id)) return json({ error: "not-found" }, { status: 404 });
  const ok = await deleteDocument(g.user.id, id);
  return ok ? json({ ok: true }) : json({ error: "not-found" }, { status: 404 });
}
