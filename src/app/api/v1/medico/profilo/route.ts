import { requireRole } from "@/lib/auth/guard";
import { getPhysicianByUser } from "@/domain/cases/repository";
import { json } from "@/lib/api";

export async function GET() {
  const g = await requireRole(["physician"]);
  if ("response" in g) return g.response;
  const p = await getPhysicianByUser(g.user.id);
  if (!p) return json({ error: "no-profile", message: "Nessun profilo medico collegato a questo account." }, { status: 404 });
  return json({ physician: p, user: { email: g.user.email, isDemo: g.user.isDemo } });
}
