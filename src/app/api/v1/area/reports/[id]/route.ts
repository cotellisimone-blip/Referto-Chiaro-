import { isUuid, requireUser } from "@/lib/auth/guard";
import { json } from "@/lib/api";
import { getReport } from "@/domain/pipeline/repository";
import { runPendingJobs } from "@/domain/pipeline/worker";

export async function GET(_req: Request, ctx: RouteContext<"/api/v1/area/reports/[id]">) {
  const g = await requireUser();
  if ("response" in g) return g.response;
  const { id } = await ctx.params;
  if (!isUuid(id)) return json({ error: "not-found" }, { status: 404 });
  await runPendingJobs(g.user.id);
  const report = await getReport(g.user.id, id);
  if (!report) return json({ error: "not-found", message: "Report non trovato." }, { status: 404 });
  return json({ report });
}
