import { requireRole } from "@/lib/auth/guard";
import { getPhysicianByUser, listPhysicianCases } from "@/domain/cases/repository";
import { json } from "@/lib/api";

export async function GET() {
  const g = await requireRole(["physician"]);
  if ("response" in g) return g.response;
  const p = await getPhysicianByUser(g.user.id);
  if (!p) return json({ error: "no-profile" }, { status: 404 });
  if (p.status !== "verified") return json({ error: "not-verified", message: "Il profilo non è ancora verificato dall'amministrazione." }, { status: 403 });
  return json({ cases: await listPhysicianCases(g.user.id, p.id), physician: p });
}
