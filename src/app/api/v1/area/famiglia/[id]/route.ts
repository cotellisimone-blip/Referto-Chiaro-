import { isUuid, requireUser } from "@/lib/auth/guard";
import { json } from "@/lib/api";
import { deletePersona } from "@/domain/famiglia/repository";

/** Elimina un familiare con tutti i suoi documenti, report e promemoria. */
export async function DELETE(_req: Request, ctx: RouteContext<"/api/v1/area/famiglia/[id]">) {
  const g = await requireUser();
  if ("response" in g) return g.response;
  const { id } = await ctx.params;
  if (!isUuid(id)) return json({ error: "not-found" }, { status: 404 });
  return (await deletePersona(g.user.id, id)) ? json({ ok: true }) : json({ error: "not-found", message: "Familiare non trovato." }, { status: 404 });
}
