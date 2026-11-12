import "server-only";
import { randomUUID } from "node:crypto";
import { audit, withUser, type Queryable } from "@/db/client";
import type { ExtractedDocument } from "@/domain/extraction/schema";
import type { Explanation } from "@/domain/reporting/explanation-schema";
import type { DossierContent } from "@/domain/dossier/build-dossier";

export type DocumentStatus = "queued" | "extracting" | "needs-verification" | "verified" | "ready" | "error";
export type ReportStatus = "queued" | "processing" | "ready" | "error";

export interface DocumentRow {
  id: string;
  title: string;
  sourceKind: "synthetic" | "upload";
  sourceRef: string;
  status: DocumentStatus;
  extracted: ExtractedDocument | null;
  verification: { confirmedObservationIds: string[]; verifiedAt: string } | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReportRow {
  id: string;
  documentId: string;
  service: "essenziale" | "completo";
  status: ReportStatus;
  explanation: Explanation | null;
  policyVersion: string | null;
  errorMessage: string | null;
  createdAt: string;
  generatedAt: string | null;
}

export interface DossierRow {
  id: string;
  title: string;
  documentIds: string[];
  status: ReportStatus;
  content: DossierContent | null;
  errorMessage: string | null;
  createdAt: string;
  generatedAt: string | null;
}

const iso = (v: unknown) => (v ? new Date(v as string).toISOString() : null);

export function toDocument(r: Record<string, unknown>): DocumentRow {
  return {
    id: String(r.id),
    title: String(r.title),
    sourceKind: r.source_kind as DocumentRow["sourceKind"],
    sourceRef: String(r.source_ref),
    status: r.status as DocumentStatus,
    extracted: (r.extracted as ExtractedDocument | null) ?? null,
    verification: (r.verification as DocumentRow["verification"]) ?? null,
    errorMessage: (r.error_message as string | null) ?? null,
    createdAt: iso(r.created_at)!,
    updatedAt: iso(r.updated_at)!,
  };
}

export function toReport(r: Record<string, unknown>): ReportRow {
  return {
    id: String(r.id),
    documentId: String(r.document_id),
    service: r.service as ReportRow["service"],
    status: r.status as ReportStatus,
    explanation: (r.explanation as Explanation | null) ?? null,
    policyVersion: (r.policy_version as string | null) ?? null,
    errorMessage: (r.error_message as string | null) ?? null,
    createdAt: iso(r.created_at)!,
    generatedAt: iso(r.generated_at),
  };
}

export function toDossier(r: Record<string, unknown>): DossierRow {
  return {
    id: String(r.id),
    title: String(r.title),
    documentIds: (r.document_ids as string[]) ?? [],
    status: r.status as ReportStatus,
    content: (r.content as DossierContent | null) ?? null,
    errorMessage: (r.error_message as string | null) ?? null,
    createdAt: iso(r.created_at)!,
    generatedAt: iso(r.generated_at),
  };
}

export async function listDocuments(userId: string): Promise<DocumentRow[]> {
  return withUser(userId, async (tx) => (await tx.query("SELECT * FROM documents ORDER BY created_at DESC")).rows.map(toDocument));
}

export async function getDocument(userId: string, id: string): Promise<DocumentRow | null> {
  return withUser(userId, async (tx) => {
    const r = await tx.query("SELECT * FROM documents WHERE id = $1", [id]);
    return r.rows[0] ? toDocument(r.rows[0]) : null;
  });
}

export async function listReports(userId: string, documentId?: string): Promise<ReportRow[]> {
  return withUser(userId, async (tx) => {
    const r = documentId
      ? await tx.query("SELECT * FROM reports WHERE document_id = $1 ORDER BY created_at DESC", [documentId])
      : await tx.query("SELECT * FROM reports ORDER BY created_at DESC");
    return r.rows.map(toReport);
  });
}

export async function getReport(userId: string, id: string): Promise<ReportRow | null> {
  return withUser(userId, async (tx) => {
    const r = await tx.query("SELECT * FROM reports WHERE id = $1", [id]);
    return r.rows[0] ? toReport(r.rows[0]) : null;
  });
}

export async function listDossiers(userId: string): Promise<DossierRow[]> {
  return withUser(userId, async (tx) => (await tx.query("SELECT * FROM dossiers ORDER BY created_at DESC")).rows.map(toDossier));
}

export async function getDossier(userId: string, id: string): Promise<DossierRow | null> {
  return withUser(userId, async (tx) => {
    const r = await tx.query("SELECT * FROM dossiers WHERE id = $1", [id]);
    return r.rows[0] ? toDossier(r.rows[0]) : null;
  });
}

/** Crea un documento da un referto sintetico e mette in coda l'estrazione. */
export async function createSyntheticDocument(userId: string, sampleId: string, title: string): Promise<string> {
  return withUser(userId, async (tx) => {
    const id = randomUUID();
    await tx.query("INSERT INTO documents(id, user_id, title, source_kind, source_ref, status) VALUES ($1, $2, $3, 'synthetic', $4, 'queued')", [id, userId, title, sampleId]);
    await enqueue(tx, userId, "extract-document", id);
    await audit(tx, { userId, actor: "user", action: "document-created", target: id });
    return id;
  });
}

export async function saveVerification(userId: string, documentId: string, confirmedObservationIds: string[]): Promise<boolean> {
  return withUser(userId, async (tx) => {
    const r = await tx.query(
      "UPDATE documents SET verification = $1, status = 'verified', updated_at = now() WHERE id = $2 AND status IN ('needs-verification', 'verified', 'ready')",
      [JSON.stringify({ confirmedObservationIds, verifiedAt: new Date().toISOString() }), documentId],
    );
    if (r.rowCount) await audit(tx, { userId, actor: "user", action: "document-verified", target: documentId });
    return r.rowCount > 0;
  });
}

export async function createReport(userId: string, documentId: string, service: "essenziale" | "completo"): Promise<string | null> {
  return withUser(userId, (tx) => createReportIn(tx, userId, documentId, service));
}

/** Variante dentro una transazione già aperta (es. insieme al passaggio dell'ordine a «pagato»). */
export async function createReportIn(tx: Queryable, userId: string, documentId: string, service: "essenziale" | "completo"): Promise<string | null> {
  const d = await tx.query("SELECT status FROM documents WHERE id = $1 AND user_id = $2", [documentId, userId]);
  if (!d.rows[0] || !["verified", "ready"].includes(String(d.rows[0].status))) return null;
  const id = randomUUID();
  await tx.query("INSERT INTO reports(id, user_id, document_id, service, status) VALUES ($1, $2, $3, $4, 'queued')", [id, userId, documentId, service]);
  await enqueue(tx, userId, "generate-report", id);
  await audit(tx, { userId, actor: "user", action: "report-requested", target: id });
  return id;
}

export async function createDossier(userId: string, title: string, documentIds: string[]): Promise<string | null> {
  return withUser(userId, async (tx) => {
    const d = await tx.query("SELECT id FROM documents WHERE id = ANY($1::uuid[]) AND status = 'ready'", [documentIds]);
    if (d.rows.length !== documentIds.length || documentIds.length < 2) return null;
    const id = randomUUID();
    await tx.query("INSERT INTO dossiers(id, user_id, title, document_ids, status) VALUES ($1, $2, $3, $4::uuid[], 'queued')", [id, userId, title, documentIds]);
    await enqueue(tx, userId, "generate-dossier", id);
    await audit(tx, { userId, actor: "user", action: "dossier-requested", target: id });
    return id;
  });
}

export async function deleteDocument(userId: string, id: string): Promise<boolean> {
  return withUser(userId, async (tx) => {
    const r = await tx.query("DELETE FROM documents WHERE id = $1", [id]);
    if (r.rowCount) await audit(tx, { userId, actor: "user", action: "document-deleted", target: id });
    return r.rowCount > 0;
  });
}

export async function deleteDossier(userId: string, id: string): Promise<boolean> {
  return withUser(userId, async (tx) => {
    const r = await tx.query("DELETE FROM dossiers WHERE id = $1", [id]);
    return r.rowCount > 0;
  });
}

async function enqueue(tx: Queryable, userId: string, kind: "extract-document" | "generate-report" | "generate-dossier", targetId: string) {
  await tx.query("INSERT INTO jobs(id, user_id, kind, target_id, status) VALUES ($1, $2, $3, $4, 'queued')", [randomUUID(), userId, kind, targetId]);
}
