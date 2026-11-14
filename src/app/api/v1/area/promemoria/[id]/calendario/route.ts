import { isUuid, requireUser } from "@/lib/auth/guard";
import { json } from "@/lib/api";
import { buildIcs, icsFileName } from "@/domain/famiglia/promemoria";
import { getPromemoria, listPersone } from "@/domain/famiglia/repository";

/** Il promemoria come evento di calendario (.ics), con un avviso il giorno prima. */
export async function GET(_req: Request, ctx: RouteContext<"/api/v1/area/promemoria/[id]/calendario">) {
  const g = await requireUser();
  if ("response" in g) return g.response;
  const { id } = await ctx.params;
  if (!isUuid(id)) return json({ error: "not-found" }, { status: 404 });
  const r = await getPromemoria(g.user.id, id);
  if (!r) return json({ error: "not-found" }, { status: 404 });
  const person = r.profileId ? ((await listPersone(g.user.id)).find((p) => p.id === r.profileId)?.name ?? null) : null;
  return new Response(buildIcs(r, person), {
    headers: { "Content-Type": "text/calendar; charset=utf-8", "Content-Disposition": `attachment; filename="${icsFileName(r)}"`, "Cache-Control": "no-store" },
  });
}
