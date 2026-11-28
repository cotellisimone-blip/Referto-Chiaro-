import { z } from "zod";
import { isUuid, readJson, requireRole } from "@/lib/auth/guard";
import { adminAssignCase } from "@/domain/cases/repository";
import { json } from "@/lib/api";

const Body = z.object({ physicianId: z.string() }).strict();

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const g = await requireRole(["admin"]);
  if ("response" in g) return g.response;
  const { id } = await params;
  const b = await readJson(req, 1024);
  if ("response" in b) return b.response;
  const parsed = Body.safeParse(b.body);
  if (!isUuid(id) || !parsed.success || !isUuid(parsed.data.physicianId)) return json({ error: "invalid-request" }, { status: 400 });
  const ok = await adminAssignCase(g.user.id, id, parsed.data.physicianId);
  return ok ? json({ ok: true }) : json({ error: "invalid-state", message: "Caso non assegnabile (già assegnato, chiuso o medico non verificato)." }, { status: 409 });
}
