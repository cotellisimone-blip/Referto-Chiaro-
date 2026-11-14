import { readJson, requireUser } from "@/lib/auth/guard";
import { json } from "@/lib/api";
import { isPlausibleDue, PromemoriaInputSchema } from "@/domain/famiglia/promemoria";
import { UUID_RE } from "@/domain/famiglia/persone";
import { createPromemoria, listPromemoria, publicPromemoria } from "@/domain/famiglia/repository";

export async function GET() {
  const g = await requireUser();
  if ("response" in g) return g.response;
  const list = await listPromemoria(g.user.id);
  return json({ promemoria: list.map(publicPromemoria) });
}

export async function POST(req: Request) {
  const g = await requireUser();
  if ("response" in g) return g.response;
  const r = await readJson(req, 8_192);
  if ("response" in r) return r.response;
  const parsed = PromemoriaInputSchema.safeParse(r.body);
  if (!parsed.success) return json({ error: "invalid-request", message: parsed.error.issues[0]?.message ?? "Dati non validi." }, { status: 400 });
  if (!isPlausibleDue(parsed.data.dueDate)) return json({ error: "invalid-date", message: "Scegli una data tra un anno fa e i prossimi cinque anni." }, { status: 400 });
  const pid = parsed.data.profileId;
  if (pid && pid !== "io" && !UUID_RE.test(pid)) return json({ error: "invalid-request" }, { status: 400 });
  const id = await createPromemoria(g.user.id, parsed.data);
  if (!id) return json({ error: "not-allowed", message: "Familiare non trovato o troppi promemoria aperti." }, { status: 409 });
  return json({ id }, { status: 201 });
}
