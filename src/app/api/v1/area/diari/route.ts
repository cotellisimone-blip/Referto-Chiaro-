import { readJson, requireUser } from "@/lib/auth/guard";
import { json } from "@/lib/api";
import { SELF_ID, UUID_RE } from "@/domain/famiglia/persone";
import { DIARIO_SLUGS, type DiarioSlug } from "@/domain/diari/catalogo";
import { VoceInputSchema, isPlausibleAt, normalizza } from "@/domain/diari/voci";
import { createVoce, listVoci } from "@/domain/diari/repository";

/** Diari della salute (21/11/2026): le voci di una persona, di un diario o di tutti. */
export async function GET(req: Request) {
  const g = await requireUser();
  if ("response" in g) return g.response;
  const u = new URL(req.url);
  const persona = u.searchParams.get("persona") ?? SELF_ID;
  const diario = u.searchParams.get("diario");
  if (persona !== SELF_ID && !UUID_RE.test(persona)) return json({ error: "invalid-request" }, { status: 400 });
  if (diario && !DIARIO_SLUGS.includes(diario as DiarioSlug)) return json({ error: "invalid-request" }, { status: 400 });
  return json({ voci: await listVoci(g.user.id, persona, (diario as DiarioSlug | null) ?? null) });
}

export async function POST(req: Request) {
  const g = await requireUser();
  if ("response" in g) return g.response;
  const r = await readJson(req, 4_096);
  if ("response" in r) return r.response;
  const parsed = VoceInputSchema.safeParse(r.body);
  if (!parsed.success) return json({ error: "invalid-request", message: parsed.error.issues[0]?.message ?? "Dati non validi." }, { status: 400 });
  if (!isPlausibleAt(parsed.data.at)) return json({ error: "invalid-date", message: "Controlla data e ora: non possono essere nel futuro." }, { status: 400 });
  const pid = parsed.data.profileId;
  if (pid && pid !== SELF_ID && !UUID_RE.test(pid)) return json({ error: "invalid-request" }, { status: 400 });
  const id = await createVoce(g.user.id, normalizza(parsed.data));
  if (!id) return json({ error: "not-allowed", message: "Familiare non trovato o diario pieno." }, { status: 409 });
  return json({ id }, { status: 201 });
}
