import { z } from "zod";
import { VerificationSchema } from "@/domain/extraction/schema";
import { buildDemoReport, type DemoReportResult } from "@/domain/reporting/demo-report-service";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { json } from "@/lib/api";

const MAX_BODY = 4_096;

/** Parsing condiviso fra report JSON e PDF: body piccolo, schema stretto, rate limit. */
export async function handleDemoReportRequest(req: Request): Promise<{ result: Extract<DemoReportResult, { ok: true }> } | { response: Response }> {
  const rl = rateLimit(`demo-report:${clientKey(req)}`, 30, 60_000);
  if (!rl.ok) {
    return { response: json({ error: "rate-limited", message: "Troppe richieste. Riprova tra poco." }, { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }) };
  }
  const raw = await req.text();
  if (raw.length > MAX_BODY) return { response: json({ error: "payload-too-large" }, { status: 413 }) };
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return { response: json({ error: "invalid-json" }, { status: 400 }) };
  }
  const parsed = VerificationSchema.strict().safeParse(body);
  if (!parsed.success) {
    return { response: json({ error: "invalid-request", details: z.treeifyError(parsed.error) }, { status: 400 }) };
  }
  const result = await buildDemoReport(parsed.data.documentId, parsed.data.confirmedObservationIds);
  if (!result.ok) {
    return { response: json({ error: result.code, message: result.message, issues: result.issues }, { status: result.status }) };
  }
  return { result };
}
