import { z } from "zod";
import { isUuid, readJson, requireUser } from "@/lib/auth/guard";
import { json } from "@/lib/api";
import { createDossier, listDossiers } from "@/domain/pipeline/repository";
import { tickJobs } from "@/domain/pipeline/worker";

export async function GET() {
  const g = await requireUser();
  if ("response" in g) return g.response;
  await tickJobs(g.user.id);
  const dossiers = await listDossiers(g.user.id);
  return json({ dossiers: dossiers.map((d) => ({ ...d, content: undefined })) });
}

const Body = z.object({ title: z.string().trim().min(1).max(120), documentIds: z.array(z.string()).min(2).max(10) }).strict();

export async function POST(req: Request) {
  const g = await requireUser();
  if ("response" in g) return g.response;
  const r = await readJson(req, 4_096);
  if ("response" in r) return r.response;
  const parsed = Body.safeParse(r.body);
  if (!parsed.success || !parsed.data.documentIds.every(isUuid)) return json({ error: "invalid-request" }, { status: 400 });
  const id = await createDossier(g.user.id, parsed.data.title, [...new Set(parsed.data.documentIds)]);
  if (!id) return json({ error: "invalid-state", message: "Scegli almeno due referti pronti della stessa persona." }, { status: 409 });
  return json({ id, status: "queued" }, { status: 201 });
}
