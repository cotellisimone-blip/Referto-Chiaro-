import { isUuid, requireUser } from "@/lib/auth/guard";
import { json } from "@/lib/api";
import { getOrder } from "@/domain/orders/repository";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const g = await requireUser();
  if ("response" in g) return g.response;
  const { id } = await ctx.params;
  if (!isUuid(id)) return json({ error: "not-found" }, { status: 404 });
  const order = await getOrder(g.user.id, id);
  if (!order) return json({ error: "not-found" }, { status: 404 });
  return json({ order });
}
