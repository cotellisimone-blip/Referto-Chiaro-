import "server-only";
import { z } from "zod";
import { withSystem } from "@/db/client";

/** Versione dell'informativa privacy (bozza) a cui si riferisce il consenso alla lista d'attesa. */
export const WAITLIST_CONSENT_VERSION = "bozza-2026-11";

export const WAITLIST_INTERESTS = ["completo", "secondo-parere", "strutture"] as const;
export type WaitlistInterest = (typeof WAITLIST_INTERESTS)[number];

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : undefined));

export const WaitlistEntry = z
  .object({
    email: z.string().trim().toLowerCase().max(254).email(),
    interest: z.enum(WAITLIST_INTERESTS),
    organization: optionalText(120),
    note: optionalText(500),
  })
  .strict();

export type WaitlistInput = z.input<typeof WaitlistEntry>;

export type WaitlistRow = {
  id: string;
  email: string;
  interest: WaitlistInterest;
  organization: string | null;
  note: string | null;
  consent_version: string;
  created_at: string;
};

/** Iscrive alla lista d'attesa. Idempotente su (email, interesse). Lancia ZodError se i dati non sono validi. */
export async function addToWaitlist(input: WaitlistInput): Promise<{ ok: true; already?: true }> {
  const d = WaitlistEntry.parse(input);
  const r = await withSystem((tx) =>
    tx.query(
      `INSERT INTO waitlist(id, email, interest, organization, note, consent_version)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5)
       ON CONFLICT (email, interest) DO NOTHING`,
      [d.email, d.interest, d.organization ?? null, d.note ?? null, WAITLIST_CONSENT_VERSION],
    ),
  );
  return r.rowCount === 0 ? { ok: true, already: true } : { ok: true };
}

/** Elenco per il pannello admin, dal più recente. */
export async function listWaitlist(): Promise<WaitlistRow[]> {
  const r = await withSystem((tx) =>
    tx.query<Omit<WaitlistRow, "created_at"> & { created_at: Date | string }>(
      "SELECT id, email, interest, organization, note, consent_version, created_at FROM waitlist ORDER BY created_at DESC, id",
    ),
  );
  return r.rows.map((x) => ({ ...x, created_at: new Date(x.created_at).toISOString() }));
}
