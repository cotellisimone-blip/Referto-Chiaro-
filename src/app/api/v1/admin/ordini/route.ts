import { requireRole } from "@/lib/auth/guard";
import { adminListOrders } from "@/lib/admin";
import { json } from "@/lib/api";
import { maskEmail } from "@/lib/demo-mask";

export async function GET() {
  const g = await requireRole(["admin"]);
  if ("response" in g) return g.response;
  const orders = await adminListOrders(g.user.id);
  // L'admin dimostrativo non vede le email vere (src/lib/demo-mask.ts).
  return json({ orders: g.user.isDemo ? orders.map((o) => ({ ...o, email: maskEmail(o.email) })) : orders });
}
