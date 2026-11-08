import { renderReportPdf } from "@/domain/reporting/pdf";
import { handleDemoReportRequest } from "../request";

export async function POST(req: Request) {
  const r = await handleDemoReportRequest(req);
  if ("response" in r) return r.response;
  const bytes = await renderReportPdf(r.result);
  return new Response(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="cura-privata-esempio-DEMO.pdf"',
      "Cache-Control": "no-store",
    },
  });
}
