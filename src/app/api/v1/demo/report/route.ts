import { json } from "@/lib/api";
import { handleDemoReportRequest } from "./request";

export async function POST(req: Request) {
  const r = await handleDemoReportRequest(req);
  if ("response" in r) return r.response;
  const { explanation, generatedAt } = r.result;
  return json({ explanation, generatedAt, isSynthetic: true });
}
