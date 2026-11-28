import { z } from "zod";
import { isUuid, readJson, requireRole } from "@/lib/auth/guard";
import { getPhysicianByUser } from "@/domain/cases/repository";
import { getPhysicianAppointment, isSafeVideoUrl, physicianAppointmentAct } from "@/domain/appointments/repository";
import { json } from "@/lib/api";

const Body = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("confirm"), scheduledAt: z.iso.datetime({ offset: true }), videoUrl: z.string().max(300) }).strict(),
  z.object({ kind: z.literal("decline"), reason: z.string().min(10).max(600) }).strict(),
  // Il riepilogo è firmato: va riletto e confermato dal medico.
  z.object({ kind: z.literal("complete"), summary: z.string().min(40).max(4000), confirmResponsibility: z.literal(true) }).strict(),
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
  const r = await getPhysicianAppointment(c.user.id, c.physician.id, id);
  if (!r) return json({ error: "not-found", message: "Appuntamento non trovato o non assegnato a te." }, { status: 404 });
  return json(r);
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const c = await ctx();
  if ("response" in c) return c.response;
  const { id } = await params;
  if (!isUuid(id)) return json({ error: "not-found" }, { status: 404 });
  const b = await readJson(req, 16_384);
  if ("response" in b) return b.response;
  const parsed = Body.safeParse(b.body);
  if (!parsed.success) return json({ error: "invalid-request", message: "Dati non validi." }, { status: 400 });
  if (parsed.data.kind === "confirm") {
    if (!isSafeVideoUrl(parsed.data.videoUrl)) return json({ error: "invalid-video-url", message: "Il collegamento video deve essere un indirizzo https." }, { status: 400 });
    if (new Date(parsed.data.scheduledAt).getTime() <= Date.now()) return json({ error: "invalid-date", message: "Scegli una data futura." }, { status: 400 });
  }
  const action =
    parsed.data.kind === "complete" ? { kind: "complete" as const, summary: parsed.data.summary } : parsed.data;
  const r = await physicianAppointmentAct(c.user.id, c.physician.id, id, action);
  if (!r.ok) return json({ error: r.error, message: r.error === "not-found" ? "Appuntamento non trovato." : "Azione non consentita in questo stato." }, { status: r.error === "not-found" ? 404 : 409 });
  return json({ appointment: r.appointment });
}
