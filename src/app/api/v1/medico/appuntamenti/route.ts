import { requireRole } from "@/lib/auth/guard";
import { getPhysicianByUser } from "@/domain/cases/repository";
import { listPhysicianAppointments } from "@/domain/appointments/repository";
import { json } from "@/lib/api";

export async function GET() {
  const g = await requireRole(["physician"]);
  if ("response" in g) return g.response;
  const p = await getPhysicianByUser(g.user.id);
  if (!p || p.status !== "verified") return json({ error: "not-verified", message: "Profilo non verificato." }, { status: 403 });
  return json({ appointments: await listPhysicianAppointments(g.user.id, p.id) });
}
