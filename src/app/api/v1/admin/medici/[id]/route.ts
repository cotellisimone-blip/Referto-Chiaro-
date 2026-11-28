import { z } from "zod";
import { isUuid, readJson, requireRole } from "@/lib/auth/guard";
import { adminSetPhysicianStatus } from "@/domain/cases/repository";
import { json } from "@/lib/api";

const Body = z.object({ status: z.enum(["verified", "suspended", "pending"]) }).strict();

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const g = await requireRole(["admin"]);
  if ("response" in g) return g.response;
  const { id } = await params;
  if (!isUuid(id)) return json({ error: "not-found" }, { status: 404 });
  const b = await readJson(req, 1024);
  if ("response" in b) return b.response;
  const parsed = Body.safeParse(b.body);
  if (!parsed.success) return json({ error: "invalid-request" }, { status: 400 });
  const ok = await adminSetPhysicianStatus(g.user.id, id, parsed.data.status);
  return ok ? json({ ok: true }) : json({ error: "not-found" }, { status: 404 });
}
