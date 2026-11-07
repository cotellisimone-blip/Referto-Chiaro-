import "server-only";
import { createHash, randomUUID } from "node:crypto";
import { audit, withPhysician, withSystem, withUser, type Queryable } from "@/db/client";
import type { ExtractedDocument } from "@/domain/extraction/schema";

/**
 * Casi di secondo parere. Finché il gate `medicalSecondOpinion` è chiuso ogni caso è una
 * SIMULAZIONE su referti sintetici: lo stato lo dice e l'interfaccia lo ripete.
 * Il paziente vede i propri casi (RLS su user_id); il medico solo quelli assegnati (RLS su app.physician_id).
 */
export type CaseStatus = "submitted" | "accepted" | "declined" | "answered" | "closed";

export interface CaseRow {
  id: string;
  userId: string;
  documentId: string | null;
  physicianId: string | null;
  specialty: string;
  question: string;
  status: CaseStatus;
  answer: string | null;
  answerHash: string | null;
  declineReason: string | null;
  isSimulated: boolean;
  createdAt: string;
  updatedAt: string;
  answeredAt: string | null;
}

export interface PhysicianRow {
  id: string;
  userId: string;
  fullName: string;
  specialty: string;
  registrationRef: string | null;
  status: "pending" | "verified" | "suspended";
  verifiedAt: string | null;
  createdAt: string;
}

export interface CaseEvent {
  id: string;
  kind: string;
  detail: string | null;
  createdAt: string;
}

const iso = (v: unknown) => (v ? new Date(v as string).toISOString() : null);

export function toCase(r: Record<string, unknown>): CaseRow {
  return {
    id: String(r.id),
    userId: String(r.user_id),
    documentId: (r.document_id as string | null) ?? null,
    physicianId: (r.physician_id as string | null) ?? null,
    specialty: String(r.specialty),
    question: String(r.question),
    status: r.status as CaseStatus,
    answer: (r.answer as string | null) ?? null,
    answerHash: (r.answer_hash as string | null) ?? null,
    declineReason: (r.decline_reason as string | null) ?? null,
    isSimulated: Boolean(r.is_simulated),
    createdAt: iso(r.created_at)!,
    updatedAt: iso(r.updated_at)!,
    answeredAt: iso(r.answered_at),
  };
}

export function toPhysician(r: Record<string, unknown>): PhysicianRow {
  return {
    id: String(r.id),
    userId: String(r.user_id),
    fullName: String(r.full_name),
    specialty: String(r.specialty),
    registrationRef: (r.registration_ref as string | null) ?? null,
    status: r.status as PhysicianRow["status"],
    verifiedAt: iso(r.verified_at),
    createdAt: iso(r.created_at)!,
  };
}

const toEvent = (r: Record<string, unknown>): CaseEvent => ({ id: String(r.id), kind: String(r.kind), detail: (r.detail as string | null) ?? null, createdAt: iso(r.created_at)! });

async function addEvent(tx: Queryable, caseId: string, actorUserId: string | null, kind: string, detail?: string) {
  await tx.query("INSERT INTO case_events(id, case_id, actor_user_id, kind, detail) VALUES ($1, $2, $3, $4, $5)", [randomUUID(), caseId, actorUserId, kind, detail ?? null]);
}

/** Specialità per cui esiste almeno un medico verificato (nome e specialità sono pubblici per chi crea un caso). */
export async function listVerifiedPhysicians(userId: string): Promise<Pick<PhysicianRow, "id" | "fullName" | "specialty">[]> {
  return withUser(userId, async (tx) => (await tx.query("SELECT id, full_name, specialty FROM physicians WHERE status = 'verified' ORDER BY specialty, full_name")).rows.map((r) => ({ id: String(r.id), fullName: String(r.full_name), specialty: String(r.specialty) })));
}

// ---------- Paziente ----------

export async function listCases(userId: string): Promise<CaseRow[]> {
  return withUser(userId, async (tx) => (await tx.query("SELECT * FROM cases ORDER BY created_at DESC")).rows.map(toCase));
}

export async function getCase(userId: string, caseId: string): Promise<{ case: CaseRow; events: CaseEvent[]; physician: Pick<PhysicianRow, "fullName" | "specialty"> | null } | null> {
  return withUser(userId, async (tx) => {
    const r = await tx.query("SELECT * FROM cases WHERE id = $1", [caseId]);
    if (!r.rows[0]) return null;
    const c = toCase(r.rows[0]);
    const ev = await tx.query("SELECT * FROM case_events WHERE case_id = $1 ORDER BY created_at", [caseId]);
    const p = c.physicianId ? await tx.query("SELECT full_name, specialty FROM physicians WHERE id = $1", [c.physicianId]) : null;
    return { case: c, events: ev.rows.map(toEvent), physician: p?.rows[0] ? { fullName: String(p.rows[0].full_name), specialty: String(p.rows[0].specialty) } : null };
  });
}

export async function createCase(userId: string, args: { documentId: string; specialty: string; question: string; isSimulated: boolean }): Promise<{ id: string } | { error: "document-not-ready" | "limit-reached" }> {
  return withUser(userId, async (tx) => {
    const d = await tx.query("SELECT id, status FROM documents WHERE id = $1", [args.documentId]);
    if (!d.rows[0] || !["verified", "ready"].includes(String(d.rows[0].status))) return { error: "document-not-ready" as const };
    const n = await tx.query("SELECT count(*)::int AS n FROM cases WHERE status IN ('submitted', 'accepted')");
    if (Number(n.rows[0].n) >= 5) return { error: "limit-reached" as const };
    // Assegnazione semplice: il medico verificato della specialità con meno casi aperti.
    const p = await tx.query(
      `SELECT p.id FROM physicians p WHERE p.status = 'verified' AND p.specialty = $1
       ORDER BY (SELECT count(*) FROM cases c WHERE c.physician_id = p.id AND c.status IN ('submitted', 'accepted')) ASC, p.created_at ASC LIMIT 1`,
      [args.specialty],
    );
    const physicianId = p.rows[0] ? String(p.rows[0].id) : null;
    const id = randomUUID();
    await tx.query(
      "INSERT INTO cases(id, user_id, document_id, physician_id, specialty, question, status, is_simulated) VALUES ($1, $2, $3, $4, $5, $6, 'submitted', $7)",
      [id, userId, args.documentId, physicianId, args.specialty, args.question, args.isSimulated],
    );
    await tx.query("INSERT INTO consents(id, user_id, kind, version, granted) VALUES (gen_random_uuid(), $1, 'second-opinion', $2, true)", [userId, `caso:${id}`]);
    await addEvent(tx, id, userId, "submitted", physicianId ? "Assegnato a un medico della specialità richiesta." : "In attesa di assegnazione.");
    await audit(tx, { userId, actor: "user", action: "case-created", target: id });
    return { id };
  });
}

export async function closeCase(userId: string, caseId: string): Promise<boolean> {
  return withUser(userId, async (tx) => {
    const r = await tx.query("UPDATE cases SET status = 'closed', updated_at = now() WHERE id = $1 AND status IN ('answered', 'declined') RETURNING id", [caseId]);
    if (!r.rows[0]) return false;
    await addEvent(tx, caseId, userId, "closed");
    await audit(tx, { userId, actor: "user", action: "case-closed", target: caseId });
    return true;
  });
}

// ---------- Medico ----------

export async function getPhysicianByUser(userId: string): Promise<PhysicianRow | null> {
  return withUser(userId, async (tx) => {
    const r = await tx.query("SELECT * FROM physicians WHERE user_id = $1", [userId]);
    return r.rows[0] ? toPhysician(r.rows[0]) : null;
  });
}

export async function listPhysicianCases(userId: string, physicianId: string): Promise<CaseRow[]> {
  return withPhysician(userId, physicianId, async (tx) => (await tx.query("SELECT * FROM cases WHERE physician_id = $1 ORDER BY created_at DESC", [physicianId])).rows.map(toCase));
}

/**
 * Dettaglio per il medico: il documento del paziente viene letto dal sistema SOLO dopo aver
 * verificato (sotto RLS) che il caso è assegnato a questo medico, e l'accesso viene registrato.
 */
export async function getPhysicianCase(userId: string, physicianId: string, caseId: string): Promise<{ case: CaseRow; events: CaseEvent[]; document: { title: string; extracted: ExtractedDocument | null } | null } | null> {
  const found = await withPhysician(userId, physicianId, async (tx) => {
    const r = await tx.query("SELECT * FROM cases WHERE id = $1 AND physician_id = $2", [caseId, physicianId]);
    if (!r.rows[0]) return null;
    const ev = await tx.query("SELECT * FROM case_events WHERE case_id = $1 ORDER BY created_at", [caseId]);
    return { case: toCase(r.rows[0]), events: ev.rows.map(toEvent) };
  });
  if (!found) return null;
  // Il referto è leggibile dal medico solo finché il caso è in lavorazione (inviato o preso in carico).
  const document = found.case.documentId && ["submitted", "accepted"].includes(found.case.status)
    ? await withSystem(async (tx) => {
        const d = await tx.query("SELECT title, extracted FROM documents WHERE id = $1", [found.case.documentId]);
        await audit(tx, { userId, actor: "physician", action: "case-document-viewed", target: caseId });
        return d.rows[0] ? { title: String(d.rows[0].title), extracted: (d.rows[0].extracted as ExtractedDocument | null) ?? null } : null;
      })
    : null;
  return { ...found, document };
}

export async function physicianAct(
  userId: string,
  physicianId: string,
  caseId: string,
  action: { kind: "accept" } | { kind: "decline"; reason: string } | { kind: "answer"; answer: string },
): Promise<{ ok: true; case: CaseRow } | { ok: false; error: "not-found" | "invalid-state" }> {
  return withPhysician(userId, physicianId, async (tx) => {
    const r = await tx.query("SELECT * FROM cases WHERE id = $1 AND physician_id = $2", [caseId, physicianId]);
    if (!r.rows[0]) return { ok: false as const, error: "not-found" as const };
    const c = toCase(r.rows[0]);
    let updated;
    if (action.kind === "accept") {
      if (c.status !== "submitted") return { ok: false as const, error: "invalid-state" as const };
      updated = await tx.query("UPDATE cases SET status = 'accepted', updated_at = now() WHERE id = $1 RETURNING *", [caseId]);
      await addEvent(tx, caseId, userId, "accepted");
    } else if (action.kind === "decline") {
      if (!["submitted", "accepted"].includes(c.status)) return { ok: false as const, error: "invalid-state" as const };
      updated = await tx.query("UPDATE cases SET status = 'declined', decline_reason = $2, updated_at = now() WHERE id = $1 RETURNING *", [caseId, action.reason]);
      await addEvent(tx, caseId, userId, "declined", action.reason);
    } else {
      if (c.status !== "accepted") return { ok: false as const, error: "invalid-state" as const };
      const answeredAt = new Date().toISOString();
      // Impronta del parere: lega testo, caso, medico e momento della firma. Verificabile a posteriori.
      const hash = createHash("sha256").update(`${caseId}\n${physicianId}\n${answeredAt}\n${action.answer}`).digest("hex");
      updated = await tx.query("UPDATE cases SET status = 'answered', answer = $2, answer_hash = $3, answered_at = $4, updated_at = now() WHERE id = $1 RETURNING *", [caseId, action.answer, hash, answeredAt]);
      await addEvent(tx, caseId, userId, "answered", `Firmato con impronta ${hash.slice(0, 12)}`);
    }
    await audit(tx, { userId, actor: "physician", action: `case-${action.kind}`, target: caseId });
    return { ok: true as const, case: toCase(updated.rows[0]) };
  });
}

// ---------- Admin (solo dopo requireRole admin + 2FA; letture di sistema, registrate) ----------

export async function adminListCases(adminId: string): Promise<(CaseRow & { patientEmail: string; physicianName: string | null })[]> {
  return withSystem(async (tx) => {
    await audit(tx, { userId: adminId, actor: "admin", action: "cases-listed" });
    const r = await tx.query(
      `SELECT c.*, u.email AS patient_email, p.full_name AS physician_name FROM cases c JOIN users u ON u.id = c.user_id
       LEFT JOIN physicians p ON p.id = c.physician_id ORDER BY c.created_at DESC LIMIT 200`,
    );
    return r.rows.map((row) => ({ ...toCase(row), patientEmail: String(row.patient_email), physicianName: (row.physician_name as string | null) ?? null }));
  });
}

export async function adminAssignCase(adminId: string, caseId: string, physicianId: string): Promise<boolean> {
  return withSystem(async (tx) => {
    const p = await tx.query("SELECT id FROM physicians WHERE id = $1 AND status = 'verified'", [physicianId]);
    if (!p.rows[0]) return false;
    const r = await tx.query("UPDATE cases SET physician_id = $2, updated_at = now() WHERE id = $1 AND status = 'submitted' RETURNING id", [caseId, physicianId]);
    if (!r.rows[0]) return false;
    await addEvent(tx, caseId, adminId, "assigned", "Assegnato dall'amministrazione.");
    await audit(tx, { userId: adminId, actor: "admin", action: "case-assigned", target: caseId });
    return true;
  });
}

export async function adminListPhysicians(adminId: string): Promise<(PhysicianRow & { email: string; openCases: number })[]> {
  return withSystem(async (tx) => {
    await audit(tx, { userId: adminId, actor: "admin", action: "physicians-listed" });
    const r = await tx.query(
      `SELECT p.*, u.email, (SELECT count(*)::int FROM cases c WHERE c.physician_id = p.id AND c.status IN ('submitted','accepted')) AS open_cases
       FROM physicians p JOIN users u ON u.id = p.user_id ORDER BY p.created_at DESC`,
    );
    return r.rows.map((row) => ({ ...toPhysician(row), email: String(row.email), openCases: Number(row.open_cases) }));
  });
}

export async function adminSetPhysicianStatus(adminId: string, physicianId: string, status: "verified" | "suspended" | "pending"): Promise<boolean> {
  return withSystem(async (tx) => {
    const r = await tx.query(
      "UPDATE physicians SET status = $2, verified_at = CASE WHEN $2 = 'verified' THEN now() ELSE verified_at END, verified_by = $3 WHERE id = $1 RETURNING id",
      [physicianId, status, adminId],
    );
    if (!r.rows[0]) return false;
    await audit(tx, { userId: adminId, actor: "admin", action: `physician-${status}`, target: physicianId });
    return true;
  });
}
