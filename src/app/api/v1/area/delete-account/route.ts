import { cookies } from "next/headers";
import { z } from "zod";
import { readJson, requireUser } from "@/lib/auth/guard";
import { deleteAccount } from "@/lib/auth/service";
import { clearedSessionCookie } from "@/lib/auth/session";
import { json } from "@/lib/api";

const Body = z.object({ confirm: z.literal("ELIMINA") }).strict();

/** Eliminazione dell'account: richiede la parola di conferma. L'account demo condiviso non si elimina. */
export async function POST(req: Request) {
  const g = await requireUser();
  if ("response" in g) return g.response;
  const r = await readJson(req, 512);
  if ("response" in r) return r.response;
  if (!Body.safeParse(r.body).success) return json({ error: "confirmation-required", message: "Scrivi ELIMINA per confermare." }, { status: 400 });
  if (g.user.email === "demo@esempio.cura-privata.invalid") return json({ error: "demo-account", message: "L'account demo condiviso non può essere eliminato." }, { status: 403 });
  await deleteAccount(g.user.id);
  (await cookies()).set(clearedSessionCookie());
  return json({ ok: true });
}
