import { z } from "zod";
import { isUuid, readJson, requireUser } from "@/lib/auth/guard";
import { json } from "@/lib/api";
import { getDocument, saveVerification } from "@/domain/pipeline/repository";
import { isReadable } from "@/domain/extraction/schema";

const Body = z.object({ confirmedObservationIds: z.array(z.string().max(32)).min(1).max(50) }).strict();

/** Salva quali valori la persona ha confermato. Solo valori leggibili ed esistenti nel documento. */
export async function POST(req: Request, ctx: RouteContext<"/api/v1/area/documents/[id]/verification">) {
  const g = await requireUser();
  if ("response" in g) return g.response;
  const { id } = await ctx.params;
  if (!isUuid(id)) return json({ error: "not-found" }, { status: 404 });
  const r = await readJson(req, 4_096);
  if ("response" in r) return r.response;
  const parsed = Body.safeParse(r.body);
  if (!parsed.success) return json({ error: "invalid-request" }, { status: 400 });
  const doc = await getDocument(g.user.id, id);
  if (!doc?.extracted) return json({ error: "not-ready", message: "Il documento non è ancora stato letto." }, { status: 409 });
  const readable = new Set(doc.extracted.observations.filter(isReadable).map((o) => o.id));
  const ids = [...new Set(parsed.data.confirmedObservationIds)].filter((x) => readable.has(x));
  if (ids.length === 0) return json({ error: "nothing-confirmed", message: "Conferma almeno un valore leggibile." }, { status: 400 });
  const ok = await saveVerification(g.user.id, id, ids);
  return ok ? json({ ok: true, confirmed: ids.length }) : json({ error: "invalid-state" }, { status: 409 });
}
