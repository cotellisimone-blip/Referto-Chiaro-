import "server-only";
import { randomUUID } from "node:crypto";
import { audit, withUser, type Queryable } from "@/db/client";
import { toDocument, type DocumentRow } from "@/domain/pipeline/repository";
import { getSyntheticDocument, DEMO_HISTORY } from "@/fixtures/synthetic";
import {
  DELEGA_VERSION,
  MAX_FAMILIARI,
  SELF_ID,
  profileIdForDb,
  type Persona,
  type PersonaInput,
} from "./persone";
import { buildTimeline, type Timeline } from "./nel-tempo";
import {
  sortPromemoria,
  type Promemoria,
  type PromemoriaInput,
} from "./promemoria";
import { LUCIA, demoReminders } from "./storico-demo";

/** Accesso ai dati di «salute nel tempo e famiglia». Ogni query passa da `withUser`: la RLS limita al titolare. */

const iso = (v: unknown) => (v ? new Date(v as string).toISOString() : null);
const day = (v: unknown) =>
  v instanceof Date ? v.toISOString().slice(0, 10) : String(v).slice(0, 10);

function toPersona(r: Record<string, unknown>): Persona {
  return {
    id: String(r.id),
    name: String(r.name),
    relation: r.relation as Persona["relation"],
    birthYear: (r.birth_year as number | null) ?? null,
    basis: r.basis as Persona["basis"],
    basisDeclaredAt: iso(r.basis_declared_at),
    createdAt: iso(r.created_at),
  };
}

function toPromemoria(
  r: Record<string, unknown>,
): Promemoria & { emailSentAt: string | null } {
  return {
    id: String(r.id),
    profileId: (r.profile_id as string | null) ?? null,
    kind: r.kind as Promemoria["kind"],
    title: String(r.title),
    dueDate: day(r.due_date),
    note: (r.note as string | null) ?? null,
    questions: Array.isArray(r.questions) ? (r.questions as string[]) : [],
    doneAt: iso(r.done_at),
    createdAt: iso(r.created_at)!,
    emailSentAt: iso(r.email_sent_at),
  };
}

/** Il promemoria come lo vede l'interfaccia: senza la data dell'email inviata. */
export function publicPromemoria(
  r: Promemoria & { emailSentAt?: string | null },
): Promemoria {
  return {
    id: r.id,
    profileId: r.profileId,
    kind: r.kind,
    title: r.title,
    dueDate: r.dueDate,
    note: r.note,
    questions: r.questions,
    doneAt: r.doneAt,
    createdAt: r.createdAt,
  };
}

export async function listPersone(userId: string): Promise<Persona[]> {
  return withUser(userId, async (tx) =>
    (
      await tx.query("SELECT * FROM family_profiles ORDER BY created_at")
    ).rows.map(toPersona),
  );
}

/** Un familiare esiste ed è dell'utente corrente (la RLS nasconde gli altri). */
export async function ownsPersona(
  tx: Queryable,
  id: string | null,
): Promise<boolean> {
  if (!id) return true;
  return (
    (await tx.query("SELECT 1 FROM family_profiles WHERE id = $1", [id])).rows
      .length > 0
  );
}

export async function createPersona(
  userId: string,
  input: PersonaInput,
): Promise<{ ok: true; id: string } | { ok: false; error: "limit-reached" }> {
  return withUser(userId, (tx) => insertPersona(tx, userId, input));
}

async function insertPersona(
  tx: Queryable,
  userId: string,
  input: PersonaInput,
): Promise<{ ok: true; id: string } | { ok: false; error: "limit-reached" }> {
  const n = Number(
    (
      await tx.query<{ n: number }>(
        "SELECT count(*)::int AS n FROM family_profiles",
      )
    ).rows[0]?.n ?? 0,
  );
  if (n >= MAX_FAMILIARI) return { ok: false, error: "limit-reached" };
  const id = randomUUID();
  await tx.query(
    "INSERT INTO family_profiles(id, user_id, name, relation, birth_year, basis, basis_version) VALUES ($1, $2, $3, $4, $5, $6, $7)",
    [
      id,
      userId,
      input.name,
      input.relation,
      input.birthYear ?? null,
      input.basis,
      DELEGA_VERSION,
    ],
  );
  // La dichiarazione entra anche tra i consensi (con la versione e il familiare a cui si riferisce) e nel registro.
  await tx.query(
    "INSERT INTO consents(id, user_id, kind, version, granted) VALUES (gen_random_uuid(), $1, 'family-delegation', $2, true)",
    [userId, `${DELEGA_VERSION}:${input.basis}:${id}`],
  );
  await audit(tx, {
    userId,
    actor: "user",
    action: "family-profile-created",
    target: id,
  });
  return { ok: true, id };
}

/** Elimina il familiare con tutti i suoi documenti, report e promemoria (cascata sul database). */
export async function deletePersona(
  userId: string,
  id: string,
): Promise<boolean> {
  return withUser(userId, async (tx) => {
    const r = await tx.query("DELETE FROM family_profiles WHERE id = $1", [id]);
    if (r.rowCount === 0) return false;
    await tx.query(
      "INSERT INTO consents(id, user_id, kind, version, granted) VALUES (gen_random_uuid(), $1, 'family-delegation', $2, false)",
      [userId, `${DELEGA_VERSION}:revoca:${id}`],
    );
    await audit(tx, {
      userId,
      actor: "user",
      action: "family-profile-deleted",
      target: id,
    });
    return true;
  });
}

/** Documenti di una persona: «io» = quelli senza familiare. */
async function documentsOf(
  tx: Queryable,
  personaId: string,
): Promise<DocumentRow[]> {
  const r =
    personaId === SELF_ID
      ? await tx.query(
          "SELECT * FROM documents WHERE profile_id IS NULL ORDER BY created_at",
        )
      : await tx.query(
          "SELECT * FROM documents WHERE profile_id = $1 ORDER BY created_at",
          [personaId],
        );
  return r.rows.map(toDocument);
}

export function timelineFrom(docs: DocumentRow[]): Timeline {
  return buildTimeline(
    docs
      .filter(
        (d) =>
          d.extracted &&
          d.verification &&
          (d.status === "verified" || d.status === "ready"),
      )
      .map((d) => ({
        documentId: d.id,
        title: d.title,
        extracted: d.extracted!,
        confirmedObservationIds: d.verification!.confirmedObservationIds,
      })),
  );
}

export async function timelineFor(
  userId: string,
  personaId: string,
): Promise<{ timeline: Timeline; pending: number } | null> {
  return withUser(userId, async (tx) => {
    if (personaId !== SELF_ID && !(await ownsPersona(tx, personaId)))
      return null;
    const docs = await documentsOf(tx, personaId);
    return {
      timeline: timelineFrom(docs),
      pending: docs.filter((d) => d.status === "needs-verification").length,
    };
  });
}

/** Sposta un documento su un'altra persona della famiglia (o sul titolare). */
export async function assignDocument(
  userId: string,
  documentId: string,
  personaId: string,
): Promise<boolean> {
  return withUser(userId, async (tx) => {
    const pid = profileIdForDb(personaId);
    if (!(await ownsPersona(tx, pid))) return false;
    const r = await tx.query(
      "UPDATE documents SET profile_id = $2, updated_at = now() WHERE id = $1",
      [documentId, pid],
    );
    if (r.rowCount)
      await audit(tx, {
        userId,
        actor: "user",
        action: "document-assigned",
        target: documentId,
      });
    return r.rowCount > 0;
  });
}

// ---- Promemoria ----

export async function listPromemoria(
  userId: string,
): Promise<(Promemoria & { emailSentAt: string | null })[]> {
  return withUser(userId, async (tx) =>
    sortPromemoria(
      (await tx.query("SELECT * FROM reminders ORDER BY due_date")).rows.map(
        toPromemoria,
      ),
    ),
  );
}

export async function getPromemoria(userId: string, id: string) {
  return withUser(userId, async (tx) => {
    const r = await tx.query("SELECT * FROM reminders WHERE id = $1", [id]);
    return r.rows[0] ? toPromemoria(r.rows[0]) : null;
  });
}

async function insertPromemoria(
  tx: Queryable,
  userId: string,
  input: PromemoriaInput,
): Promise<string | null> {
  const pid = profileIdForDb(input.profileId);
  if (!(await ownsPersona(tx, pid))) return null;
  const n = Number(
    (
      await tx.query<{ n: number }>(
        "SELECT count(*)::int AS n FROM reminders WHERE done_at IS NULL",
      )
    ).rows[0]?.n ?? 0,
  );
  if (n >= 50) return null;
  const id = randomUUID();
  await tx.query(
    "INSERT INTO reminders(id, user_id, profile_id, kind, title, due_date, note, questions) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
    [
      id,
      userId,
      pid,
      input.kind,
      input.title,
      input.dueDate,
      input.note || null,
      JSON.stringify(input.questions ?? []),
    ],
  );
  await audit(tx, {
    userId,
    actor: "user",
    action: "reminder-created",
    target: id,
  });
  return id;
}

export async function createPromemoria(
  userId: string,
  input: PromemoriaInput,
): Promise<string | null> {
  return withUser(userId, (tx) => insertPromemoria(tx, userId, input));
}

export async function updatePromemoria(
  userId: string,
  id: string,
  patch: { done?: boolean; addQuestions?: string[]; removeQuestion?: number },
): Promise<boolean> {
  return withUser(userId, async (tx) => {
    const r = await tx.query("SELECT * FROM reminders WHERE id = $1", [id]);
    if (!r.rows[0]) return false;
    const cur = toPromemoria(r.rows[0]);
    let questions = cur.questions;
    if (patch.addQuestions?.length)
      questions = [
        ...questions,
        ...patch.addQuestions.filter((q) => !questions.includes(q)),
      ].slice(0, 12);
    if (patch.removeQuestion !== undefined)
      questions = questions.filter((_, i) => i !== patch.removeQuestion);
    const doneAt =
      patch.done === undefined
        ? cur.doneAt
        : patch.done
          ? new Date().toISOString()
          : null;
    await tx.query(
      "UPDATE reminders SET questions = $2, done_at = $3 WHERE id = $1",
      [id, JSON.stringify(questions), doneAt],
    );
    return true;
  });
}

export async function deletePromemoria(
  userId: string,
  id: string,
): Promise<boolean> {
  return withUser(userId, async (tx) => {
    const r = await tx.query("DELETE FROM reminders WHERE id = $1", [id]);
    if (r.rowCount)
      await audit(tx, {
        userId,
        actor: "user",
        action: "reminder-deleted",
        target: id,
      });
    return r.rowCount > 0;
  });
}

// ---- Storico di esempio (solo demo) ----

/**
 * Carica la famiglia di esempio: «Lucia» con i suoi esami, i controlli annuali del titolare e due promemoria.
 * I referti entrano già confermati (tutti i valori leggibili): sono inventati e servono a vedere l'andamento.
 * Idempotente: ciò che c'è già non si duplica.
 */
export async function loadDemoHistory(
  userId: string,
  today: string,
): Promise<{ added: number; luciaId: string }> {
  return withUser(userId, async (tx) => {
    let luciaId =
      (
        await tx.query<{ id: string }>(
          "SELECT id FROM family_profiles WHERE name = $1",
          [LUCIA.name],
        )
      ).rows[0]?.id ?? null;
    if (!luciaId) {
      const r = await insertPersona(tx, userId, LUCIA);
      if (!r.ok) throw new Error("limit-reached");
      luciaId = r.id;
    }
    const existing = new Set(
      (
        await tx.query<{ source_ref: string }>(
          "SELECT source_ref FROM documents",
        )
      ).rows.map((r) => r.source_ref),
    );
    let added = 0;
    for (const h of DEMO_HISTORY) {
      if (existing.has(h.sampleId)) continue;
      const doc = getSyntheticDocument(h.sampleId);
      if (!doc) continue;
      const ids = doc.observations
        .filter((o) => o.valueRaw !== null)
        .map((o) => o.id);
      await tx.query(
        "INSERT INTO documents(id, user_id, profile_id, title, source_kind, source_ref, status, extracted, verification, created_at, updated_at) VALUES ($1, $2, $3, $4, 'synthetic', $5, 'verified', $6, $7, $8, $8)",
        [
          randomUUID(),
          userId,
          h.owner === "lucia" ? luciaId : null,
          h.title,
          h.sampleId,
          JSON.stringify(doc),
          JSON.stringify({
            confirmedObservationIds: ids,
            verifiedAt: new Date().toISOString(),
          }),
          `${doc.reportDate}T09:00:00Z`,
        ],
      );
      added++;
    }
    const hasReminders =
      (await tx.query("SELECT 1 FROM reminders LIMIT 1")).rows.length > 0;
    if (!hasReminders) {
      const lucia = timelineFrom(
        (
          await tx.query("SELECT * FROM documents WHERE profile_id = $1", [
            luciaId,
          ])
        ).rows.map(toDocument),
      );
      for (const r of demoReminders(today, luciaId))
        await insertPromemoria(
          tx,
          userId,
          r.kind === "visita"
            ? { ...r, questions: lucia.questions.slice(0, 4) }
            : r,
        );
    }
    await audit(tx, { userId, actor: "user", action: "demo-history-loaded" });
    return { added, luciaId };
  });
}
