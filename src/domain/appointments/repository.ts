import "server-only";
import { createHash, randomUUID } from "node:crypto";
import { audit, withPhysician, withSystem, withUser } from "@/db/client";
import { refundForRef } from "@/domain/orders/repository";

/**
 * Videoconsulti («Parla con un medico»). Percorso: richiesta (specialità, motivo breve, fasce orarie, documenti
 * scelti) → pagamento → il medico conferma data e collegamento → colloquio → riepilogo scritto e firmato.
 * Il medico vede l'appuntamento SOLO dopo il pagamento e solo se assegnato a lui (RLS su app.physician_id).
 * Con il gate `medicalVideoConsult` chiuso (sempre, in demo) è una SIMULAZIONE su documenti sintetici.
 */
export type AppointmentStatus = "requested" | "confirmed" | "declined" | "completed" | "cancelled";
export type SlotWindow = "mattina" | "pomeriggio" | "sera";

export interface Slot {
  day: string;
  window: SlotWindow;
}

export interface AppointmentRow {
  id: string;
  userId: string;
  physicianId: string | null;
  specialty: string;
  reason: string;
  preferredSlots: Slot[];
  documentIds: string[];
  status: AppointmentStatus;
  awaitingPayment: boolean;
  scheduledAt: string | null;
  videoUrl: string | null;
  summary: string | null;
  summaryHash: string | null;
  declineReason: string | null;
  isSimulated: boolean;
  createdAt: string;
  completedAt: string | null;
}

const iso = (v: unknown) => (v ? new Date(v as string).toISOString() : null);

function toAppointment(r: Record<string, unknown>): AppointmentRow {
  return {
    id: String(r.id),
    userId: String(r.user_id),
    physicianId: (r.physician_id as string | null) ?? null,
    specialty: String(r.specialty),
    reason: String(r.reason),
    preferredSlots: (typeof r.preferred_slots === "string" ? JSON.parse(r.preferred_slots) : r.preferred_slots) as Slot[],
    documentIds: ((r.document_ids as string[] | null) ?? []).map(String),
    status: r.status as AppointmentStatus,
    awaitingPayment: Boolean(r.awaiting_payment),
    scheduledAt: iso(r.scheduled_at),
    videoUrl: (r.video_url as string | null) ?? null,
    summary: (r.summary as string | null) ?? null,
    summaryHash: (r.summary_hash as string | null) ?? null,
    declineReason: (r.decline_reason as string | null) ?? null,
    isSimulated: Boolean(r.is_simulated),
    createdAt: iso(r.created_at)!,
    completedAt: iso(r.completed_at),
  };
}

/** Il collegamento video deve essere https e senza credenziali: niente link arbitrari o javascript:. */
export function isSafeVideoUrl(raw: string): boolean {
  try {
    const u = new URL(raw);
    return u.protocol === "https:" && !u.username && !u.password && u.hostname.includes(".") && raw.length <= 300;
  } catch {
    return false;
  }
}

// ---------- Paziente ----------

export async function listAppointments(userId: string): Promise<AppointmentRow[]> {
  return withUser(userId, async (tx) => (await tx.query("SELECT * FROM appointments ORDER BY created_at DESC")).rows.map(toAppointment));
}

export async function getAppointment(userId: string, id: string): Promise<{ appointment: AppointmentRow; physician: { fullName: string; specialty: string } | null; documents: { id: string; title: string }[] } | null> {
  return withUser(userId, async (tx) => {
    const r = await tx.query("SELECT * FROM appointments WHERE id = $1", [id]);
    if (!r.rows[0]) return null;
    const a = toAppointment(r.rows[0]);
    const p = a.physicianId ? await tx.query("SELECT full_name, specialty FROM physicians WHERE id = $1", [a.physicianId]) : null;
    const d = a.documentIds.length ? await tx.query("SELECT id, title FROM documents WHERE id = ANY($1::uuid[]) ORDER BY created_at", [a.documentIds]) : { rows: [] };
    return {
      appointment: a,
      physician: p?.rows[0] ? { fullName: String(p.rows[0].full_name), specialty: String(p.rows[0].specialty) } : null,
      documents: d.rows.map((x) => ({ id: String(x.id), title: String(x.title) })),
    };
  });
}

export async function createAppointment(
  userId: string,
  args: { specialty: string; reason: string; slots: Slot[]; documentIds: string[]; isSimulated: boolean },
): Promise<{ id: string } | { error: "document-not-found" | "limit-reached" }> {
  return withUser(userId, async (tx) => {
    if (args.documentIds.length) {
      const d = await tx.query("SELECT count(*)::int AS n FROM documents WHERE id = ANY($1::uuid[])", [args.documentIds]);
      if (Number(d.rows[0].n) !== args.documentIds.length) return { error: "document-not-found" as const };
    }
    const n = await tx.query("SELECT count(*)::int AS n FROM appointments WHERE status IN ('requested', 'confirmed')");
    if (Number(n.rows[0].n) >= 3) return { error: "limit-reached" as const };
    // Assegnazione semplice: il medico verificato della specialità con meno appuntamenti aperti.
    const p = await tx.query(
      `SELECT p.id FROM physicians p WHERE p.status = 'verified' AND p.specialty = $1
       ORDER BY (SELECT count(*) FROM appointments a WHERE a.physician_id = p.id AND a.status IN ('requested', 'confirmed')) ASC, p.created_at ASC LIMIT 1`,
      [args.specialty],
    );
    const id = randomUUID();
    await tx.query(
      `INSERT INTO appointments(id, user_id, physician_id, specialty, reason, preferred_slots, document_ids, status, awaiting_payment, is_simulated)
       VALUES ($1, $2, $3, $4, $5, $6, $7::uuid[], 'requested', true, $8)`,
      [id, userId, p.rows[0] ? String(p.rows[0].id) : null, args.specialty, args.reason, JSON.stringify(args.slots), args.documentIds, args.isSimulated],
    );
    await tx.query("INSERT INTO consents(id, user_id, kind, version, granted) VALUES (gen_random_uuid(), $1, 'video-consult', $2, true)", [userId, `appuntamento:${id}`]);
    await audit(tx, { userId, actor: "user", action: "appointment-created", target: id });
    return { id };
  });
}

/** Annulla prima della conferma del medico (nessun addebito se non ancora pagato). */
export async function cancelAppointment(userId: string, id: string): Promise<boolean> {
  const ok = await withUser(userId, async (tx) => {
    const r = await tx.query("UPDATE appointments SET status = 'cancelled', updated_at = now() WHERE id = $1 AND status = 'requested' RETURNING id", [id]);
    if (!r.rows[0]) return false;
    await audit(tx, { userId, actor: "user", action: "appointment-cancelled", target: id });
    return true;
  });
  // Annullato prima della conferma: se era già pagato, si rimborsa.
  if (ok) await refundForRef(id, userId);
  return ok;
}

// ---------- Medico ----------

export async function listPhysicianAppointments(userId: string, physicianId: string): Promise<AppointmentRow[]> {
  return withPhysician(userId, physicianId, async (tx) =>
    (await tx.query("SELECT * FROM appointments WHERE physician_id = $1 AND awaiting_payment = false ORDER BY created_at DESC", [physicianId])).rows.map(toAppointment),
  );
}

/**
 * Dettaglio per il medico: i documenti condivisi si leggono SOLO dopo aver verificato (sotto RLS) che
 * l'appuntamento è suo e pagato, e solo finché non è concluso. Ogni lettura è registrata.
 */
export async function getPhysicianAppointment(userId: string, physicianId: string, id: string) {
  const found = await withPhysician(userId, physicianId, async (tx) => {
    const r = await tx.query("SELECT * FROM appointments WHERE id = $1 AND physician_id = $2 AND awaiting_payment = false", [id, physicianId]);
    return r.rows[0] ? toAppointment(r.rows[0]) : null;
  });
  if (!found) return null;
  const documents =
    found.documentIds.length && ["requested", "confirmed"].includes(found.status)
      ? await withSystem(async (tx) => {
          const d = await tx.query("SELECT id, title, extracted FROM documents WHERE id = ANY($1::uuid[]) AND user_id = $2 ORDER BY created_at", [found.documentIds, found.userId]);
          await audit(tx, { userId, actor: "physician", action: "appointment-documents-viewed", target: id });
          return d.rows.map((x) => ({ id: String(x.id), title: String(x.title), extracted: x.extracted ?? null }));
        })
      : [];
  return { appointment: found, documents };
}

export async function physicianAppointmentAct(
  userId: string,
  physicianId: string,
  id: string,
  action: { kind: "confirm"; scheduledAt: string; videoUrl: string } | { kind: "decline"; reason: string } | { kind: "complete"; summary: string },
): Promise<{ ok: true; appointment: AppointmentRow } | { ok: false; error: "not-found" | "invalid-state" }> {
  const res = await withPhysician(userId, physicianId, async (tx) => {
    const r = await tx.query("SELECT * FROM appointments WHERE id = $1 AND physician_id = $2 AND awaiting_payment = false", [id, physicianId]);
    if (!r.rows[0]) return { ok: false as const, error: "not-found" as const };
    const a = toAppointment(r.rows[0]);
    let updated;
    if (action.kind === "confirm") {
      if (a.status !== "requested") return { ok: false as const, error: "invalid-state" as const };
      updated = await tx.query("UPDATE appointments SET status = 'confirmed', scheduled_at = $2, video_url = $3, updated_at = now() WHERE id = $1 RETURNING *", [id, action.scheduledAt, action.videoUrl]);
    } else if (action.kind === "decline") {
      if (!["requested", "confirmed"].includes(a.status)) return { ok: false as const, error: "invalid-state" as const };
      updated = await tx.query("UPDATE appointments SET status = 'declined', decline_reason = $2, updated_at = now() WHERE id = $1 RETURNING *", [id, action.reason]);
    } else {
      if (a.status !== "confirmed") return { ok: false as const, error: "invalid-state" as const };
      const at = new Date().toISOString();
      const hash = createHash("sha256").update(`${id}\n${physicianId}\n${at}\n${action.summary}`).digest("hex");
      updated = await tx.query("UPDATE appointments SET status = 'completed', summary = $2, summary_hash = $3, completed_at = $4, updated_at = now() WHERE id = $1 RETURNING *", [id, action.summary, hash, at]);
    }
    await audit(tx, { userId, actor: "physician", action: `appointment-${action.kind}`, target: id });
    return { ok: true as const, appointment: toAppointment(updated.rows[0]) };
  });
  // Rifiuto di un caso già pagato: rimborso (fuori dalla transazione del medico, che non vede gli ordini).
  if (res.ok && action.kind === "decline") await refundForRef(id, userId);
  return res;
}
