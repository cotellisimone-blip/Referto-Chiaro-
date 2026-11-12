import { describe, expect, it } from "vitest";
import { PDFDocument } from "pdf-lib";
import { buildDemoReport } from "@/domain/reporting/demo-report-service";
import { renderReportPdf, toWinAnsi } from "@/domain/reporting/pdf";
import { DEMO_DOCUMENT_ID, getSyntheticDocument } from "@/fixtures/synthetic";

describe("PDF report demo", () => {
  it("genera un PDF valido con titolo DEMO", async () => {
    const ids = getSyntheticDocument(DEMO_DOCUMENT_ID)!.observations.map((o) => o.id);
    const r = await buildDemoReport(DEMO_DOCUMENT_ID, ids);
    if (!r.ok) throw new Error(r.message);
    const bytes = await renderReportPdf(r);
    expect(Buffer.from(bytes.slice(0, 5)).toString()).toBe("%PDF-");
    const pdf = await PDFDocument.load(bytes);
    expect(pdf.getPageCount()).toBeGreaterThanOrEqual(1);
    expect(pdf.getTitle()).toContain("DEMO");
  });

  it("sostituisce i caratteri non rappresentabili", () => {
    expect(toWinAnsi("1▒8 ≤ 5 è")).toBe("1?8 <= 5 è");
  });
});
