import { z } from "zod";
import { readJson, requireUser } from "@/lib/auth/guard";
import { listConsents, recordConsent, withdrawHealthDataConsent } from "@/lib/auth/service";
import { json } from "@/lib/api";

export async function GET() {
  const g = await requireUser();
  if ("response" in g) return g.response;
  return json({ consents: await listConsents(g.user.id) });
}

const Body = z.union([
  z.object({ kind: z.literal("marketing"), granted: z.boolean() }).strict(),
  // Il consenso ai dati sanitari si può solo revocare da qui: cancella subito i contenuti sanitari.
  z.object({ kind: z.literal("health-data"), granted: z.literal(false) }).strict(),
]);

/** Marketing: concesso o revocato. Dati sanitari: solo revoca. Termini e privacy si revocano eliminando l'account. */
export async function POST(req: Request) {
  const g = await requireUser();
  if ("response" in g) return g.response;
  const r = await readJson(req, 512);
  if ("response" in r) return r.response;
  const parsed = Body.safeParse(r.body);
  if (!parsed.success) return json({ error: "invalid-request" }, { status: 400 });
  if (parsed.data.kind === "health-data") {
    if (g.user.email === "demo@esempio.cura-privata.invalid") return json({ error: "demo-account", message: "Sull'account demo condiviso non si revoca il consenso." }, { status: 403 });
    await withdrawHealthDataConsent(g.user.id);
    return json({ ok: true, purged: true });
  }
  await recordConsent(g.user.id, parsed.data.kind, parsed.data.granted);
  return json({ ok: true });
}
