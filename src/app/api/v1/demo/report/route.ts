import { json } from "@/lib/api";
import { handleDemoReportRequest } from "./request";
import { buildGuidaPersonale } from "@/domain/reporting/guida-personale";

export async function POST(req: Request) {
  const r = await handleDemoReportRequest(req);
  if ("response" in r) return r.response;
  const { explanation, generatedAt } = r.result;
  // La guida personale fa parte del report anche nell'esempio (19/11/2026).
  return json({ explanation, generatedAt, guida: buildGuidaPersonale(explanation), isSynthetic: true });
}
