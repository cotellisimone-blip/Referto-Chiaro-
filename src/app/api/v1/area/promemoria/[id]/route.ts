import { isUuid, readJson, requireUser } from "@/lib/auth/guard";
import { json } from "@/lib/api";
import { PromemoriaPatchSchema } from "@/domain/famiglia/promemoria";
import { deletePromemoria, getPromemoria, publicPromemoria, updatePromemoria } from "@/domain/famiglia/repository";

export async function GET(_req: Request, ctx: RouteContext<"/api/v1/area/promemoria/[id]">) {
  const g = await requireUser();
  if ("response" in g) return g.response;
  const { id } = await ctx.params;
  if (!isUuid(id)) return json({ error: "not-found" }, { status: 404 });
  const r = await getPromemoria(g.user.id, id);
  if (!r) return json({ error: "not-found", message: "Promemoria non trovato." }, { status: 404 });
  return json({ promemoria: publicPromemoria(r) });
}

/** Segna come fatto (o da fare) e aggiunge o toglie domande per il medico. */
export async function PATCH(req: Request, ctx: RouteContext<"/api/v1/area/promemoria/[id]">) {
  const g = await requireUser();
  if ("response" in g) return g.response;
  const { id } = await ctx.params;
  if (!isUuid(id)) return json({ error: "not-found" }, { status: 404 });
  const r = await readJson(req, 8_192);
  if ("response" in r) return r.response;
  const parsed = PromemoriaPatchSchema.safeParse(r.body);
  if (!parsed.success) return json({ error: "invalid-request" }, { status: 400 });
  return (await updatePromemoria(g.user.id, id, parsed.data)) ? json({ ok: true }) : json({ error: "not-found" }, { status: 404 });
}

export async function DELETE(_req: Request, ctx: RouteContext<"/api/v1/area/promemoria/[id]">) {
  const g = await requireUser();
  if ("response" in g) return g.response;
  const { id } = await ctx.params;
  if (!isUuid(id)) return json({ error: "not-found" }, { status: 404 });
  return (await deletePromemoria(g.user.id, id)) ? json({ ok: true }) : json({ error: "not-found" }, { status: 404 });
}
