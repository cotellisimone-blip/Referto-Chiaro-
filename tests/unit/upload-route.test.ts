import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { randomUUID } from "node:crypto";
import { PDFDocument, StandardFonts } from "pdf-lib";

const user = { id: randomUUID() };
const pending: Promise<unknown>[] = [];
vi.mock("@/lib/auth/guard", () => ({ requireUser: async () => ({ user }) }));
vi.mock("@/lib/auth/service", () => ({ hasHealthDataConsent: async () => true }));
vi.mock("next/server", () => ({ after: (fn: () => Promise<unknown>) => pending.push(fn()) }));

const { resetDatabaseForTests, withSystem } = await import("@/db/client");
const { POST } = await import("@/app/api/v1/area/documents/upload/route");
const { getDocument } = await import("@/domain/pipeline/repository");

const ENV = { DEMO_MODE: "false", PRODUCTION_COMPLIANCE_APPROVED: "true", ENABLE_REAL_UPLOADS: "true", ENABLE_AI_PROCESSING: "false", FILE_ENCRYPTION_KEY: "c".repeat(64) };
const saved: Record<string, string | undefined> = {};

function form(bytes: Uint8Array, name: string, type: string) {
  const fd = new FormData();
  fd.append("file", new File([Buffer.from(bytes)], name, { type }));
  return new Request("http://localhost/api/v1/area/documents/upload", { method: "POST", body: fd });
}

describe("API di caricamento (gate aperti)", () => {
  beforeAll(async () => {
    for (const k of Object.keys(ENV)) saved[k] = process.env[k];
    Object.assign(process.env, ENV);
    await resetDatabaseForTests();
    await withSystem((tx) => tx.query("INSERT INTO users(id, email) VALUES ($1, 'upload@test.invalid')", [user.id]));
  });
  afterAll(() => {
    for (const [k, v] of Object.entries(saved)) if (v === undefined) delete process.env[k];
      else process.env[k] = v;
  });

  it("accetta un PDF, lo cifra e lo legge dopo la risposta", async () => {
    const pdf = await PDFDocument.create();
    const page = pdf.addPage();
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    [["Glicemia", "90", "mg/dL", "70 - 99"], ["Sodio", "140", "mmol/L", "136 - 145"], ["Potassio", "4,2", "mmol/L", "3,5 - 5,1"]].forEach((r, i) =>
      r.forEach((c, j) => page.drawText(c, { x: [40, 250, 330, 420][j], y: 700 - i * 20, size: 10, font })),
    );
    const res = await POST(form(await pdf.save(), "Esami.pdf", "application/pdf"));
    expect(res.status).toBe(201);
    const { id } = (await res.json()) as { id: string };
    await Promise.all(pending);
    const doc = await getDocument(user.id, id);
    expect(doc?.title).toBe("Esami");
    expect(doc?.status).toBe("needs-verification");
    expect(doc?.extracted?.observations).toHaveLength(3);
  });

  it("rifiuta un file che finge di essere un PDF", async () => {
    const res = await POST(form(new TextEncoder().encode("<script>alert(1)</script>"), "finto.pdf", "application/pdf"));
    expect(res.status).toBe(415);
  });

  it("senza chiave di cifratura non accetta nulla", async () => {
    delete process.env.FILE_ENCRYPTION_KEY;
    const res = await POST(form(new TextEncoder().encode("%PDF-1.4"), "a.pdf", "application/pdf"));
    expect(res.status).toBe(503);
    process.env.FILE_ENCRYPTION_KEY = ENV.FILE_ENCRYPTION_KEY;
  });

  it("in demo il gate risponde 403 prima di leggere il file", async () => {
    process.env.DEMO_MODE = "true";
    const res = await POST(form(new TextEncoder().encode("%PDF-1.4"), "a.pdf", "application/pdf"));
    expect(res.status).toBe(403);
    process.env.DEMO_MODE = "false";
  });
});
