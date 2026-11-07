import { z } from "zod";
import { readJson, requireUser } from "@/lib/auth/guard";
import { listConsents, recordConsent } from "@/lib/auth/service";
import { json } from "@/lib/api";

export async function GET() {
  const g = await requireUser();
  if ("response" in g) return g.response;
  return json({ consents: await listConsents(g.user.id) });
}

const Body = z.object({ kind: z.enum(["marketing"]), granted: z.boolean() }).strict();

/** Solo il consenso facoltativo (marketing) è modificabile qui; quelli necessari si revocano eliminando l'account. */
export async function POST(req: Request) {
  const g = await requireUser();
  if ("response" in g) return g.response;
  const r = await readJson(req, 512);
  if ("response" in r) return r.response;
  const parsed = Body.safeParse(r.body);
  if (!parsed.success) return json({ error: "invalid-request" }, { status: 400 });
  await recordConsent(g.user.id, parsed.data.kind, parsed.data.granted);
  return json({ ok: true });
}
