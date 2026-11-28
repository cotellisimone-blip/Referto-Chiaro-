import { requireRole } from "@/lib/auth/guard";
import { adminListPhysicians } from "@/domain/cases/repository";
import { json } from "@/lib/api";

export async function GET() {
  const g = await requireRole(["admin"]);
  if ("response" in g) return g.response;
  return json({ physicians: await adminListPhysicians(g.user.id) });
}
