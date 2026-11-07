import { z } from "zod";
import { readJson, requireUser } from "@/lib/auth/guard";
import { json } from "@/lib/api";
import { createSyntheticDocument, listDocuments, listReports } from "@/domain/pipeline/repository";
import { runPendingJobs } from "@/domain/pipeline/worker";
import { getSyntheticDocument, listSyntheticSamples } from "@/fixtures/synthetic";

export async function GET() {
  const g = await requireUser();
  if ("response" in g) return g.response;
  await runPendingJobs(g.user.id);
  const [documents, reports] = await Promise.all([listDocuments(g.user.id), listReports(g.user.id)]);
  return json({ documents: documents.map((d) => ({ ...d, extracted: undefined, observationCount: d.extracted?.observations.length ?? null })), reports: reports.map((r) => ({ ...r, explanation: undefined })) });
}

const Body = z.object({ sampleId: z.string().max(64) }).strict();

/** Nuovo documento. In demo si può solo scegliere un referto di esempio: nessun file reale viene accettato. */
export async function POST(req: Request) {
  const g = await requireUser();
  if ("response" in g) return g.response;
  const r = await readJson(req, 1_024);
  if ("response" in r) return r.response;
  const parsed = Body.safeParse(r.body);
  if (!parsed.success) return json({ error: "invalid-request" }, { status: 400 });
  const sample = getSyntheticDocument(parsed.data.sampleId);
  if (!sample) return json({ error: "sample-not-found", message: "Referto di esempio non trovato." }, { status: 404 });
  const count = (await listDocuments(g.user.id)).length;
  if (count >= 30) return json({ error: "limit-reached", message: "Hai raggiunto il limite di documenti per questo account." }, { status: 409 });
  const title = listSyntheticSamples().find((s) => s.id === sample.documentId)?.title ?? sample.displayTitle;
  const id = await createSyntheticDocument(g.user.id, sample.documentId, title);
  return json({ id, status: "queued" }, { status: 201 });
}

