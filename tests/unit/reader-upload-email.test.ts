import { describe, expect, it, vi } from "vitest";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { getSyntheticDocument } from "@/fixtures/synthetic";
import { parseColumnLines, findReportDate } from "@/providers/ocr/heuristic-parser";
import { groundObservations, DocumentReader } from "@/providers/ocr/reader";
import { pdfTextLines } from "@/providers/ocr/pdf-text";
import { redactLines, REDACTED } from "@/providers/ocr/redact";
import { checkUpload, safeTitle, sniffMime } from "@/providers/upload/validate";
import { openFile, sealFile, FileKeyMissingError } from "@/lib/crypto/file-box";
import { ScriptedLlm } from "@/providers/ai/scripted-llm";
import { getEmailProvider, magicLinkEmail, reportReadyEmail, devOutbox } from "@/lib/email";
import { resendProvider, postmarkProvider } from "@/lib/email/providers";

const KEY = { FILE_ENCRYPTION_KEY: "a".repeat(64) };

async function labPdf(rows: string[][]): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const cols = [40, 250, 330, 420];
  let y = 780;
  page.drawText("Laboratorio di prova - referto sintetico", { x: 40, y, size: 12, font });
  y -= 24;
  page.drawText("Data prelievo: 03/10/2026", { x: 40, y, size: 10, font });
  for (const r of rows) {
    y -= 20;
    r.forEach((c, i) => page.drawText(c, { x: cols[i], y, size: 10, font }));
  }
  return pdf.save();
}

describe("lettura deterministica", () => {
  it("il lettore colonnare ritrova le righe dei referti sintetici, senza indovinare la cifra illeggibile", () => {
    const doc = getSyntheticDocument("demo-referto-lab-001")!;
    const raw = parseColumnLines(doc.sourceLines);
    const { observations } = groundObservations(raw, doc.sourceLines);
    const byName = Object.fromEntries(observations.map((o) => [o.nameRaw, o]));
    for (const exp of doc.observations) {
      const got = byName[exp.nameRaw];
      expect(got, exp.nameRaw).toBeDefined();
      expect(got.valueRaw).toBe(exp.valueRaw);
      expect(got.unitRaw).toBe(exp.unitRaw);
      expect(got.referenceRaw).toBe(exp.referenceRaw);
    }
    expect(byName["Trigliceridi"].parseConfidence).toBe("low");
  });

  it("legge un PDF digitale riga per riga e ne estrae gli esami", async () => {
    const bytes = await labPdf([
      ["ESAME", "RISULTATO", "UNITA", "INTERVALLO"],
      ["Glicemia", "88", "mg/dL", "70 - 99"],
      ["Creatinina", "0,91", "mg/dL", "0,70 - 1,20"],
      ["Ferritina", "45", "ng/mL", "30 - 400"],
    ]);
    const { lines, pageCount } = await pdfTextLines(bytes);
    expect(pageCount).toBe(1);
    expect(lines.some((l) => l.text.startsWith("Glicemia") && l.text.includes("88"))).toBe(true);
    const out = await new DocumentReader({ llm: null }).extract({ documentId: "d1", bytes, mimeType: "application/pdf", title: "Prova" });
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.document.isSynthetic).toBe(false);
    expect(out.document.reportDate).toBe("2026-10-03");
    expect(out.document.observations.map((o) => [o.nameRaw, o.valueRaw, o.unitRaw, o.referenceRaw])).toEqual([
      ["Glicemia", "88", "mg/dL", "70 - 99"],
      ["Creatinina", "0,91", "mg/dL", "0,70 - 1,20"],
      ["Ferritina", "45", "ng/mL", "30 - 400"],
    ]);
    expect(out.trace.method).toBe("pdf-text");
  });

  it("senza AI una foto non viene letta (messaggio chiaro, nessuna invenzione)", async () => {
    const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]);
    const out = await new DocumentReader({ llm: null }).extract({ documentId: "d2", bytes: png, mimeType: "image/png", title: "Foto" });
    expect(out).toMatchObject({ ok: false });
  });

  it("la data di nascita non viene scambiata per la data del referto", () => {
    expect(findReportDate([{ page: 1, line: 1, text: "Nato il 02/03/1950" }, { page: 1, line: 2, text: "Data prelievo 05/10/2026" }])).toBe("2026-10-05");
  });
});

describe("ancoraggio alla lettera (anti-allucinazione)", () => {
  const lines = [{ page: 1, line: 4, text: "Glicemia                      92          mg/dL    70 - 99" }];
  it("scarta un valore che non compare nella riga", () => {
    const { observations } = groundObservations([{ page: 1, line: 4, nameRaw: "Glicemia", valueRaw: "95", unitRaw: "mg/dL", referenceRaw: "70 - 99", methodRaw: null }], lines);
    expect(observations[0].valueRaw).toBeNull();
    expect(observations[0].parseConfidence).toBe("low");
  });
  it("scarta righe inesistenti o nomi non presenti", () => {
    const { observations, dropped } = groundObservations(
      [
        { page: 1, line: 9, nameRaw: "Glicemia", valueRaw: "92", unitRaw: null, referenceRaw: null, methodRaw: null },
        { page: 1, line: 4, nameRaw: "Sodio", valueRaw: "92", unitRaw: null, referenceRaw: null, methodRaw: null },
      ],
      lines,
    );
    expect(observations).toHaveLength(0);
    expect(dropped).toBe(2);
  });

  it("con il modello: trascrizione → righe nascoste → strutturazione ancorata", async () => {
    const llm = new ScriptedLlm(({ system }) =>
      system.startsWith("Trascrivi")
        ? { legible: true, pages: [{ page: 1, lines: ["Paziente: MARIO ROSSI  CF RSSMRA50C02H501X", "Data prelievo 05/10/2026", "TSH   2,10   mUI/L   0,40 - 4,00", "FT4   1,2   ng/dL   0,8 - 1,8"] }] }
        : { inScope: true, outOfScopeReason: "", laboratoryName: "Lab", reportDate: "2026-10-05", observations: [
            { page: 1, line: 3, nameRaw: "TSH", valueRaw: "2,10", unitRaw: "mUI/L", referenceRaw: "0,40 - 4,00", methodRaw: null },
            { page: 1, line: 4, nameRaw: "FT4", valueRaw: "1,4", unitRaw: "ng/dL", referenceRaw: "0,8 - 1,8", methodRaw: null },
            { page: 1, line: 1, nameRaw: "Paziente", valueRaw: "MARIO", unitRaw: null, referenceRaw: null, methodRaw: null },
          ] },
    );
    const jpg = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 1, 2, 3]);
    const out = await new DocumentReader({ llm }).extract({ documentId: "d3", bytes: jpg, mimeType: "image/jpeg", title: "Foto" });
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(JSON.stringify(out.document)).not.toContain("ROSSI");
    expect(llm.calls[1].text).not.toContain("ROSSI");
    expect(out.document.observations.map((o) => [o.nameRaw, o.valueRaw])).toEqual([["TSH", "2,10"], ["FT4", null]]);
    expect(out.trace.method).toBe("vision");
  });

  it("documento fuori ambito: rifiutato con spiegazione", async () => {
    const llm = new ScriptedLlm(() => ({ inScope: false, outOfScopeReason: "È il referto di un'ecografia.", laboratoryName: "", reportDate: "", observations: [] }));
    const bytes = await labPdf([["Glicemia", "88", "mg/dL", "70 - 99"], ["Sodio", "140", "mmol/L", "135 - 145"], ["Potassio", "4,1", "mmol/L", "3,5 - 5,1"]]);
    const out = await new DocumentReader({ llm }).extract({ documentId: "d4", bytes, mimeType: "application/pdf", title: "x" });
    expect(out).toMatchObject({ ok: false });
    if (!out.ok) expect(out.reason).toContain("ecografia");
  });

  it("nasconde le righe con dati personali", () => {
    const r = redactLines([{ page: 1, line: 1, text: "Codice fiscale RSSMRA50C02H501X" }, { page: 1, line: 2, text: "Sodio 140" }]);
    expect(r[0].text).toBe(REDACTED);
    expect(r[1].text).toBe("Sodio 140");
  });
});

describe("caricamento e cifratura", () => {
  it("riconosce i formati dalla firma dei byte", () => {
    expect(sniffMime(new TextEncoder().encode("%PDF-1.7"))).toBe("application/pdf");
    expect(sniffMime(new Uint8Array([0xff, 0xd8, 0xff]))).toBe("image/jpeg");
    expect(sniffMime(new TextEncoder().encode("<html>"))).toBeNull();
  });
  it("rifiuta file vuoti, troppo grandi, di tipo sbagliato o PDF con script", () => {
    expect(checkUpload(new Uint8Array())).toMatchObject({ ok: false, code: "empty" });
    expect(checkUpload(new Uint8Array(4 * 1024 * 1024 + 1))).toMatchObject({ ok: false, code: "too-large" });
    expect(checkUpload(new TextEncoder().encode("MZ executable"))).toMatchObject({ ok: false, code: "unsupported-type" });
    expect(checkUpload(new TextEncoder().encode("%PDF-1.4 /OpenAction << /S /JavaScript /JS (app.alert(1)) >>"))).toMatchObject({ ok: false, code: "unsafe-pdf" });
  });
  it("ripulisce il nome del file", () => {
    expect(safeTitle("../../etc/<script>referto.pdf")).not.toMatch(/[<>/\\.]/);
    expect(safeTitle("C:\\Users\\x\\Esami ottobre.pdf")).toBe("Esami ottobre");
    expect(safeTitle(".pdf")).toBe("Referto caricato");
  });
  it("cifra e decifra; senza chiave non salva nulla", () => {
    const data = new TextEncoder().encode("contenuto del referto");
    const sealed = sealFile(data, KEY);
    expect(Buffer.from(sealed).includes(Buffer.from("contenuto"))).toBe(false);
    expect(openFile(sealed, KEY).toString()).toBe("contenuto del referto");
    expect(() => sealFile(data, {})).toThrow(FileKeyMissingError);
    sealed[sealed.length - 1] ^= 1;
    expect(() => openFile(sealed, KEY)).toThrow();
  });
});

describe("email", () => {
  it("in produzione senza fornitore: errore esplicito; in sviluppo: casella locale", () => {
    expect(() => getEmailProvider({ NODE_ENV: "production", DEMO_MODE: "false" })).toThrow();
    expect(getEmailProvider({ NODE_ENV: "development" }).id).toBe("dev-outbox");
    expect(getEmailProvider({ EMAIL_PROVIDER: "resend", RESEND_API_KEY: "re_x" }).id).toBe("resend");
    expect(getEmailProvider({ EMAIL_PROVIDER: "postmark", POSTMARK_SERVER_TOKEN: "t" }).id).toBe("postmark");
    expect(() => getEmailProvider({ EMAIL_PROVIDER: "resend" })).toThrow();
  });
  it("Resend e Postmark ricevono la richiesta corretta", async () => {
    const f = vi.fn(async () => new Response(JSON.stringify({ id: "1", MessageID: "2" }), { status: 200 }));
    await resendProvider("re_key", f as unknown as typeof fetch).send(magicLinkEmail("a@b.it", "https://x/y"), "RC <n@r.it>");
    const [url, init] = f.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.resend.com/emails");
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer re_key");
    await postmarkProvider("pm", f as unknown as typeof fetch).send(magicLinkEmail("a@b.it", "https://x/y"), "RC <n@r.it>");
    expect((f.mock.calls[1] as unknown as [string])[0]).toBe("https://api.postmarkapp.com/email");
    const bad = vi.fn(async () => new Response("no", { status: 422 }));
    await expect(resendProvider("k", bad as unknown as typeof fetch).send(magicLinkEmail("a@b.it", "l"), "f")).rejects.toThrow();
  });
  it("le email non contengono dati sanitari e scappano l'HTML", () => {
    const m = reportReadyEmail("a@b.it", "https://x/area");
    expect(m.text + m.html).not.toMatch(/glicemia|colesterolo|valore|mg\/dL/i);
    expect(magicLinkEmail("a@b.it", 'https://x/?t="><script>').html).not.toContain("<script>");
  });
  it("la casella di sviluppo conserva i messaggi senza inviarli", async () => {
    await getEmailProvider({ NODE_ENV: "development" }).send(magicLinkEmail("x@y.test", "https://l"), "f");
    expect(devOutbox().at(-1)?.to).toBe("x@y.test");
  });
});
