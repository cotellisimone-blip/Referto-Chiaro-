import { requireRole } from "@/lib/auth/guard";
import { adminConfig } from "@/lib/admin";
import { json } from "@/lib/api";

export async function GET() {
  const g = await requireRole(["admin"]);
  if ("response" in g) return g.response;
  return json(adminConfig());
}
