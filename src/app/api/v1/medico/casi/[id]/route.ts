import { z } from "zod";
import { isUuid, readJson, requireRole } from "@/lib/auth/guard";
import { getPhysicianByUser, getPhysicianCase, physicianAct } from "@/domain/cases/repository";
import { json } from "@/lib/api";

const Body = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("accept") }).strict(),
  z.object({ kind: z.literal("decline"), reason: z.string().min(10).max(600) }).strict(),
  // La firma è un'azione esplicita: il testo deve essere riletto e confermato dal medico.
  z.object({ kind: z.literal("answer"), answer: z.string().min(80).max(8000), confirmResponsibility: z.literal(true) }).strict(),
]);

async function ctx() {
  const g = await requireRole(["physician"]);
  if ("response" in g) return g;
  const p = await getPhysicianByUser(g.user.id);
  if (!p || p.status !== "verified") return { response: json({ error: "not-verified", message: "Profilo non verificato." }, { status: 403 }) };
  return { user: g.user, physician: p };
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const c = await ctx();
  if ("response" in c) return c.response;
  const { id } = await params;
  if (!isUuid(id)) return json({ error: "not-found" }, { status: 404 });
  const r = await getPhysicianCase(c.user.id, c.physician.id, id);
  if (!r) return json({ error: "not-found", message: "Caso non trovato o non assegnato a te." }, { status: 404 });
  return json(r);
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const c = await ctx();
  if ("response" in c) return c.response;
  const { id } = await params;
  if (!isUuid(id)) return json({ error: "not-found" }, { status: 404 });
  const b = await readJson(req, 32_768);
  if ("response" in b) return b.response;
  const parsed = Body.safeParse(b.body);
  if (!parsed.success) return json({ error: "invalid-request", message: "Dati non validi: il parere deve avere almeno 80 caratteri e la conferma di responsabilità." }, { status: 400 });
  const r = await physicianAct(c.user.id, c.physician.id, id, parsed.data);
  if (!r.ok) return json({ error: r.error, message: r.error === "not-found" ? "Caso non trovato." : "Azione non consentita in questo stato." }, { status: r.error === "not-found" ? 404 : 409 });
  return json({ case: r.case });
}
