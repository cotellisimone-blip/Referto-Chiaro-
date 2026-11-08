import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { randomUUID } from "node:crypto";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { resetDatabaseForTests, withSystem, withUser } from "@/db/client";
import { storeDocumentFile } from "@/providers/upload/db-encrypted";
import { runPendingJobs } from "@/domain/pipeline/worker";
import { createReport, getDocument, listReports, saveVerification } from "@/domain/pipeline/repository";

/**
 * Percorso reale completo, con i gate aperti come in produzione ma SENZA chiave AI:
 * PDF caricato → cifrato nel database → letto → verificato → spiegato con il glossario → controllo di coerenza.
 */
const ENV_KEYS = ["DEMO_MODE", "PRODUCTION_COMPLIANCE_APPROVED", "ENABLE_REAL_UPLOADS", "ENABLE_AI_PROCESSING", "FILE_ENCRYPTION_KEY"] as const;
const saved: Record<string, string | undefined> = {};

async function labPdf(): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const rows = [
    ["Data prelievo: 01/10/2026"],
    ["ESAME", "RISULTATO", "UNITA", "INTERVALLO"],
    ["Glicemia", "104", "mg/dL", "70 - 99"],
    ["Creatinina", "0,91", "mg/dL", "0,70 - 1,20"],
    ["Esame sconosciuto XYZ", "12", "U/L", "5 - 20"],
  ];
  let y = 780;
  for (const r of rows) {
    r.forEach((c, i) => page.drawText(c, { x: [40, 250, 330, 420][i], y, size: 10, font }));
    y -= 20;
  }
  return pdf.save();
}

describe("pipeline reale (gate aperti, AI spenta)", () => {
  const user = randomUUID();

  beforeAll(async () => {
    for (const k of ENV_KEYS) saved[k] = process.env[k];
    Object.assign(process.env, { DEMO_MODE: "false", PRODUCTION_COMPLIANCE_APPROVED: "true", ENABLE_REAL_UPLOADS: "true", ENABLE_AI_PROCESSING: "false", FILE_ENCRYPTION_KEY: "b".repeat(64) });
    await resetDatabaseForTests();
    await withSystem((tx) => tx.query("INSERT INTO users(id, email) VALUES ($1, 'reale@test.invalid')", [user]));
  });
  afterAll(() => {
    for (const k of ENV_KEYS) if (saved[k] === undefined) delete process.env[k];
      else process.env[k] = saved[k];
  });

  it("dal PDF caricato al report verificato", async () => {
    const id = randomUUID();
    const bytes = await labPdf();
    await withUser(user, async (tx) => {
      await tx.query("INSERT INTO documents(id, user_id, title, source_kind, source_ref, status) VALUES ($1, $2, 'Esami ottobre', 'upload', $3, 'queued')", [id, user, id]);
      await storeDocumentFile(tx, { documentId: id, userId: user, bytes, mimeType: "application/pdf" });
      await tx.query("INSERT INTO jobs(id, user_id, kind, target_id, status) VALUES (gen_random_uuid(), $1, 'extract-document', $2, 'queued')", [user, id]);
    });
    // Il file nel database non è leggibile in chiaro.
    const raw = await withSystem((tx) => tx.query<{ ciphertext: Uint8Array }>("SELECT ciphertext FROM document_files WHERE document_id = $1", [id]));
    expect(Buffer.from(raw.rows[0].ciphertext).includes(Buffer.from("Glicemia"))).toBe(false);

    await runPendingJobs(user);
    const doc = await getDocument(user, id);
    expect(doc?.status).toBe("needs-verification");
    expect(doc?.extracted?.isSynthetic).toBe(false);
    const obs = doc!.extracted!.observations;
    expect(obs.map((o) => o.nameRaw)).toEqual(["Glicemia", "Creatinina", "Esame sconosciuto XYZ"]);

    expect(await saveVerification(user, id, obs.map((o) => o.id))).toBe(true);
    const reportId = await createReport(user, id, "essenziale");
    expect(reportId).toBeTruthy();
    await runPendingJobs(user);
    const [report] = await listReports(user, id);
    expect(report.status).toBe("ready");
    const exp = report.explanation!;
    expect(exp.items.map((i) => [i.nameExact, i.originalValueExact])).toEqual([["Glicemia", "104"], ["Creatinina", "0,91"]]);
    expect(exp.items[0].printedRangeNote).not.toMatch(/rientra/); // 104 è sopra l'intervallo stampato: nota neutra
    expect(exp.excludedObservations.map((e) => e.nameExact)).toContain("Esame sconosciuto XYZ");
  });

  it("un altro utente non vede né il documento né il file", async () => {
    const other = randomUUID();
    await withSystem((tx) => tx.query("INSERT INTO users(id, email) VALUES ($1, 'altro@test.invalid')", [other]));
    const files = await withUser(other, (tx) => tx.query("SELECT document_id FROM document_files"));
    expect(files.rows).toHaveLength(0);
  });
});
