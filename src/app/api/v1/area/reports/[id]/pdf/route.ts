import { isUuid, requireUser } from "@/lib/auth/guard";
import { json } from "@/lib/api";
import { getDocument, getReport } from "@/domain/pipeline/repository";
import { renderReportPdf } from "@/domain/reporting/pdf";

export async function GET(_req: Request, ctx: RouteContext<"/api/v1/area/reports/[id]/pdf">) {
  const g = await requireUser();
  if ("response" in g) return g.response;
  const { id } = await ctx.params;
  if (!isUuid(id)) return json({ error: "not-found" }, { status: 404 });
  const report = await getReport(g.user.id, id);
  if (!report?.explanation || !report.generatedAt) return json({ error: "not-ready" }, { status: 409 });
  const doc = await getDocument(g.user.id, report.documentId);
  if (!doc?.extracted) return json({ error: "not-found" }, { status: 404 });
  const bytes = await renderReportPdf({ document: doc.extracted, explanation: report.explanation, generatedAt: report.generatedAt });
  return new Response(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="referto-chiaro-${doc.extracted.isSynthetic ? "DEMO-" : ""}${report.id.slice(0, 8)}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
