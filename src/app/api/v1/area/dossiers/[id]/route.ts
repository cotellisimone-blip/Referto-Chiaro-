import { isUuid, requireUser } from "@/lib/auth/guard";
import { json } from "@/lib/api";
import { deleteDossier, getDossier } from "@/domain/pipeline/repository";
import { tickJobs } from "@/domain/pipeline/worker";

export async function GET(_req: Request, ctx: RouteContext<"/api/v1/area/dossiers/[id]">) {
  const g = await requireUser();
  if ("response" in g) return g.response;
  const { id } = await ctx.params;
  if (!isUuid(id)) return json({ error: "not-found" }, { status: 404 });
  await tickJobs(g.user.id);
  const dossier = await getDossier(g.user.id, id);
  return dossier ? json({ dossier }) : json({ error: "not-found" }, { status: 404 });
}

export async function DELETE(_req: Request, ctx: RouteContext<"/api/v1/area/dossiers/[id]">) {
  const g = await requireUser();
  if ("response" in g) return g.response;
  const { id } = await ctx.params;
  if (!isUuid(id)) return json({ error: "not-found" }, { status: 404 });
  return (await deleteDossier(g.user.id, id)) ? json({ ok: true }) : json({ error: "not-found" }, { status: 404 });
}
