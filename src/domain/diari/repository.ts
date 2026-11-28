import "server-only";
import { randomUUID } from "node:crypto";
import { audit, withUser } from "@/db/client";
import { ownsPersona } from "@/domain/famiglia/repository";
import { profileIdForDb } from "@/domain/famiglia/persone";
import type { DiarioSlug } from "./catalogo";
import { ordina, type NuovaVoce, type VoceDiario } from "./voci";
import { vociEsempio } from "./esempio";

/** Accesso alle voci dei diari (21/11/2026). Ogni query passa da `withUser`: la RLS limita al titolare. */

/** Tetto per account: anni di misure quotidiane, ma non un deposito senza fondo. */
export const MAX_VOCI = 5000;

function toVoce(r: Record<string, unknown>): VoceDiario {
  return {
    id: String(r.id),
    profileId: (r.profile_id as string | null) ?? null,
    diario: r.diary as DiarioSlug,
    at: String(r.at),
    dati: (typeof r.data === "string" ? JSON.parse(r.data) : r.data) as never,
    note: (r.note as string | null) ?? null,
    createdAt: new Date(r.created_at as string).toISOString(),
  } as VoceDiario;
}

export async function listVoci(userId: string, persona: string | null, diario: DiarioSlug | null): Promise<VoceDiario[]> {
  const pid = profileIdForDb(persona);
  return withUser(userId, async (tx) => {
    const r = await tx.query(
      `SELECT * FROM diary_entries WHERE profile_id IS NOT DISTINCT FROM $1 ${diario ? "AND diary = $2" : ""} ORDER BY at DESC, created_at DESC LIMIT 2000`,
      diario ? [pid, diario] : [pid],
    );
    return ordina(r.rows.map(toVoce));
  });
}

export async function createVoce(userId: string, v: NuovaVoce): Promise<string | null> {
  return withUser(userId, async (tx) => {
    const pid = profileIdForDb(v.profileId);
    if (!(await ownsPersona(tx, pid))) return null;
    const n = Number((await tx.query<{ n: number }>("SELECT count(*)::int AS n FROM diary_entries")).rows[0]?.n ?? 0);
    if (n >= MAX_VOCI) return null;
    const id = randomUUID();
    await tx.query("INSERT INTO diary_entries(id, user_id, profile_id, diary, at, data, note) VALUES ($1, $2, $3, $4, $5, $6, $7)", [id, userId, pid, v.diario, v.at, JSON.stringify(v.dati), v.note]);
    return id;
  });
}

export async function deleteVoce(userId: string, id: string): Promise<boolean> {
  return withUser(userId, async (tx) => {
    const r = await tx.query("DELETE FROM diary_entries WHERE id = $1", [id]);
    if (r.rowCount) await audit(tx, { userId, actor: "user", action: "diary-entry-deleted", target: id });
    return r.rowCount > 0;
  });
}

/** Solo account dimostrativo: carica le voci di esempio per il titolare, se il diario è ancora vuoto. */
export async function loadVociEsempio(userId: string, oggi: string): Promise<number> {
  return withUser(userId, async (tx) => {
    const n = Number((await tx.query<{ n: number }>("SELECT count(*)::int AS n FROM diary_entries WHERE profile_id IS NULL")).rows[0]?.n ?? 0);
    if (n > 0) return 0;
    const voci = vociEsempio(oggi);
    for (const v of voci) await tx.query("INSERT INTO diary_entries(id, user_id, profile_id, diary, at, data, note) VALUES ($1, $2, NULL, $3, $4, $5, $6)", [randomUUID(), userId, v.diario, v.at, JSON.stringify(v.dati), v.note]);
    return voci.length;
  });
}
