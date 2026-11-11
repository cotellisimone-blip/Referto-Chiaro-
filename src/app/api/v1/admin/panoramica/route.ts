import { requireRole } from "@/lib/auth/guard";
import { adminFunnel, adminOverview } from "@/lib/admin";
import { json } from "@/lib/api";

export async function GET() {
  const g = await requireRole(["admin"]);
  if ("response" in g) return g.response;
  return json({ overview: await adminOverview(g.user.id), funnel: await adminFunnel(g.user.id) });
}
