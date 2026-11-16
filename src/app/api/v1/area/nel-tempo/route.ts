import { isUuid, requireUser } from "@/lib/auth/guard";
import { json } from "@/lib/api";
import { SELF_ID } from "@/domain/famiglia/persone";
import { NEL_TEMPO_LIMITI } from "@/domain/famiglia/nel-tempo";
import { timelineFor } from "@/domain/famiglia/repository";
import { tickJobs } from "@/domain/pipeline/worker";

/** Andamento dei valori confermati di una persona (?persona=io | uuid del familiare). Calcolato dal codice. */
export async function GET(req: Request) {
  const g = await requireUser();
  if ("response" in g) return g.response;
  const persona = new URL(req.url).searchParams.get("persona") ?? SELF_ID;
  if (persona !== SELF_ID && !isUuid(persona)) return json({ error: "invalid-request" }, { status: 400 });
  await tickJobs(g.user.id);
  const out = await timelineFor(g.user.id, persona);
  if (!out) return json({ error: "not-found", message: "Familiare non trovato." }, { status: 404 });
  return json({ ...out, limits: NEL_TEMPO_LIMITI });
}
