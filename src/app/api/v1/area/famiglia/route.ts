import { readJson, requireUser } from "@/lib/auth/guard";
import { json } from "@/lib/api";
import { hasHealthDataConsent } from "@/lib/auth/service";
import { PersonaInputSchema, selfPersona } from "@/domain/famiglia/persone";
import { createPersona, listPersone, listPromemoria } from "@/domain/famiglia/repository";
import { listDocuments } from "@/domain/pipeline/repository";

/** Le persone della famiglia (il titolare per primo) con quanti referti e il prossimo promemoria. */
export async function GET() {
  const g = await requireUser();
  if ("response" in g) return g.response;
  const [persone, docs, reminders] = await Promise.all([listPersone(g.user.id), listDocuments(g.user.id), listPromemoria(g.user.id)]);
  const all = [selfPersona(g.user.displayName), ...persone];
  return json({
    persone: all.map((p) => {
      const pid = p.id === "io" ? null : p.id;
      const next = reminders.find((r) => !r.doneAt && r.profileId === pid) ?? null;
      return { ...p, documentCount: docs.filter((d) => d.profileId === pid).length, nextReminder: next ? { id: next.id, title: next.title, dueDate: next.dueDate, kind: next.kind } : null };
    }),
  });
}

export async function POST(req: Request) {
  const g = await requireUser();
  if ("response" in g) return g.response;
  const r = await readJson(req, 2_048);
  if ("response" in r) return r.response;
  const parsed = PersonaInputSchema.safeParse(r.body);
  if (!parsed.success) return json({ error: "invalid-request", message: parsed.error.issues[0]?.message ?? "Dati non validi." }, { status: 400 });
  if (!(await hasHealthDataConsent(g.user.id))) return json({ error: "consent-withdrawn", message: "Hai revocato il consenso al trattamento dei dati sanitari: per aggiungere un familiare serve un nuovo consenso." }, { status: 403 });
  const out = await createPersona(g.user.id, parsed.data);
  if (!out.ok) return json({ error: "limit-reached", message: "Puoi seguire al massimo cinque familiari." }, { status: 409 });
  return json({ id: out.id }, { status: 201 });
}
