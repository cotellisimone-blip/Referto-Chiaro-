import { isUuid, requireUser } from "@/lib/auth/guard";
import { json } from "@/lib/api";
import { deleteVoce } from "@/domain/diari/repository";

export async function DELETE(_req: Request, ctx: RouteContext<"/api/v1/area/diari/[id]">) {
  const g = await requireUser();
  if ("response" in g) return g.response;
  const { id } = await ctx.params;
  if (!isUuid(id)) return json({ error: "not-found" }, { status: 404 });
  return (await deleteVoce(g.user.id, id)) ? json({ ok: true }) : json({ error: "not-found", message: "Voce non trovata." }, { status: 404 });
}
