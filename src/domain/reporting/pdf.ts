import { PDFDocument, StandardFonts, rgb, degrees, type PDFFont, type PDFPage } from "pdf-lib";
import type { ExtractedDocument } from "@/domain/extraction/schema";
import type { Explanation } from "./explanation-schema";

const INK = rgb(0x16 / 255, 0x2d / 255, 0x39 / 255);
const TEAL = rgb(0x22 / 255, 0x5f / 255, 0x75 / 255);
const MUTED = rgb(0x4a / 255, 0x5c / 255, 0x66 / 255);
const LINE = rgb(0xdb / 255, 0xe6 / 255, 0xe5 / 255);
const MIST = rgb(0xee / 255, 0xf4 / 255, 0xf2 / 255);
const CREAM = rgb(0xf4 / 255, 0xec / 255, 0xdc / 255);

const A4 = { w: 595.28, h: 841.89 };
const M = 56; // margine

/** I font standard PDF usano WinAnsi: sostituiamo i caratteri non rappresentabili invece di fallire. */
export function toWinAnsi(s: string): string {
  return s
    .replace(/[≤]/g, "<=")
    .replace(/[≥]/g, ">=")
    .replace(/[→]/g, "->")
    .replace(/[^\x20-\x7E\xA0-\xFF—–’‘“”•€\n]/g, "?");
}

interface Ctx {
  pdf: PDFDocument;
  page: PDFPage;
  y: number;
  sans: PDFFont;
  sansBold: PDFFont;
  serif: PDFFont;
  demo: boolean;
}

function wrap(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const out: string[] = [];
  for (const para of toWinAnsi(text).split("\n")) {
    let line = "";
    for (const word of para.split(/\s+/)) {
      const next = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(next, size) > maxWidth && line) {
        out.push(line);
        line = word;
      } else line = next;
    }
    out.push(line);
  }
  return out;
}

function newPage(ctx: Ctx) {
  ctx.page = ctx.pdf.addPage([A4.w, A4.h]);
  ctx.y = A4.h - M;
}

function ensure(ctx: Ctx, needed: number) {
  if (ctx.y - needed < M + 40) newPage(ctx);
}

function text(ctx: Ctx, s: string, opts: { font?: PDFFont; size?: number; color?: ReturnType<typeof rgb>; indent?: number; gap?: number; lh?: number } = {}) {
  const font = opts.font ?? ctx.sans;
  const size = opts.size ?? 10.5;
  const lh = opts.lh ?? size * 1.5;
  const x = M + (opts.indent ?? 0);
  for (const l of wrap(s, font, size, A4.w - M - x)) {
    ensure(ctx, lh);
    ctx.page.drawText(l, { x, y: ctx.y - size, size, font, color: opts.color ?? INK });
    ctx.y -= lh;
  }
  ctx.y -= opts.gap ?? 0;
}

function heading(ctx: Ctx, s: string) {
  ensure(ctx, 60);
  ctx.y -= 10;
  text(ctx, s, { font: ctx.serif, size: 15, color: INK, gap: 4 });
}

function drawMark(page: PDFPage, x: number, y: number, scale: number) {
  // Simbolo: bolla di dialogo-documento con check (stessa geometria del logo SVG, viewBox 64).
  page.drawSvgPath("M12 10h30l12 12v22a8 8 0 0 1-8 8H30l-12 9v-9h-6a8 8 0 0 1-8-8V18a8 8 0 0 1 8-8z", {
    x,
    y,
    scale,
    color: TEAL,
  });
  page.drawSvgPath("M42 10v8a4 4 0 0 0 4 4h8z", { x, y, scale, color: rgb(0x5e / 255, 0x96 / 255, 0x7e / 255) });
  page.drawSvgPath("M19 31l7 7 13-14", { x, y, scale, borderColor: rgb(1, 1, 1), borderWidth: 4.5, borderLineCap: 1 });
}

function formatDateIt(iso: string): string {
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${d}/${m}/${y}`;
}

export async function renderReportPdf(args: {
  document: ExtractedDocument;
  explanation: Explanation;
  generatedAt: string;
}): Promise<Uint8Array> {
  const { document: doc, explanation: exp, generatedAt } = args;
  const pdf = await PDFDocument.create();
  pdf.setTitle(toWinAnsi(`Referto Chiaro — ${doc.isSynthetic ? "ESEMPIO DEMO" : "Report"}`));
  pdf.setAuthor("Referto Chiaro");
  pdf.setSubject("Spiegazione informativa, non clinica");
  pdf.setProducer("Referto Chiaro");
  pdf.setCreationDate(new Date(generatedAt));

  const ctx: Ctx = {
    pdf,
    page: undefined as unknown as PDFPage,
    y: 0,
    sans: await pdf.embedFont(StandardFonts.Helvetica),
    sansBold: await pdf.embedFont(StandardFonts.HelveticaBold),
    serif: await pdf.embedFont(StandardFonts.TimesRoman),
    demo: doc.isSynthetic,
  };
  newPage(ctx);

  // Testata
  drawMark(ctx.page, M - 2, A4.h - M + 4, 0.5);
  ctx.page.drawText("Referto", { x: M + 32, y: A4.h - M - 20, size: 15, font: ctx.serif, color: INK });
  ctx.page.drawText("Chiaro", {
    x: M + 32 + ctx.serif.widthOfTextAtSize("Referto", 15),
    y: A4.h - M - 20,
    size: 15,
    font: ctx.serif,
    color: TEAL,
  });
  ctx.y -= 50;

  if (ctx.demo) {
    ctx.page.drawRectangle({ x: M, y: ctx.y - 26, width: A4.w - 2 * M, height: 26, color: CREAM });
    ctx.page.drawText(toWinAnsi("ESEMPIO DIMOSTRATIVO — DATI SINTETICI — NON È UN DOCUMENTO MEDICO"), {
      x: M + 10,
      y: ctx.y - 17,
      size: 9,
      font: ctx.sansBold,
      color: INK,
    });
    ctx.y -= 40;
  }

  text(ctx, "Il tuo referto, in parole semplici", { font: ctx.serif, size: 24, lh: 30, gap: 6 });
  text(ctx, `${doc.laboratoryName} · Data del documento: ${formatDateIt(doc.reportDate)} · ${doc.patientLabel}`, {
    size: 9,
    color: MUTED,
    gap: 10,
  });

  heading(ctx, "In breve");
  text(ctx, exp.summary, { gap: 6 });

  // Tabella valori
  heading(ctx, "I valori, esattamente come stampati");
  const cols = [M, M + 210, M + 320, M + 430];
  const rowH = 22;
  ensure(ctx, rowH * (exp.items.length + 1) + 10);
  ctx.page.drawRectangle({ x: M, y: ctx.y - rowH, width: A4.w - 2 * M, height: rowH, color: MIST });
  ["Nome riportato", "Risultato", "Intervallo stampato", "Fonte"].forEach((h, i) =>
    ctx.page.drawText(h, { x: cols[i] + 6, y: ctx.y - 15, size: 8.5, font: ctx.sansBold, color: MUTED }),
  );
  ctx.y -= rowH;
  for (const it of exp.items) {
    const cells = [
      it.nameExact,
      `${it.originalValueExact} ${it.originalUnitExact ?? ""}`.trim(),
      it.originalReferenceExact ?? "non riportato",
      `pag. ${it.sourceCitation.page}, riga ${it.sourceCitation.line}`,
    ];
    cells.forEach((c, i) =>
      ctx.page.drawText(toWinAnsi(c), { x: cols[i] + 6, y: ctx.y - 15, size: 9.5, font: i === 1 ? ctx.sansBold : ctx.sans, color: INK }),
    );
    ctx.page.drawLine({ start: { x: M, y: ctx.y - rowH }, end: { x: A4.w - M, y: ctx.y - rowH }, thickness: 0.5, color: LINE });
    ctx.y -= rowH;
  }
  ctx.y -= 8;
  if (exp.excludedObservations.length) {
    text(ctx, `Non inclusi: ${exp.excludedObservations.map((e) => `${e.nameExact} (${e.reason.replace(/\.$/, "").toLowerCase()})`).join("; ")}.`, {
      size: 8.5,
      color: MUTED,
      gap: 4,
    });
  }

  heading(ctx, "Che cosa significano i termini");
  for (const it of exp.items) {
    ensure(ctx, 70);
    text(ctx, it.nameExact, { font: ctx.sansBold, size: 11, gap: 1 });
    text(ctx, it.plainLanguageDefinition, { gap: 1 });
    text(ctx, `Nel documento: ${it.originalValueExact} ${it.originalUnitExact ?? ""} — intervallo stampato ${it.originalReferenceExact ?? "non riportato"}. ${it.printedRangeNote}`, {
      size: 9.5,
      color: TEAL,
      gap: 8,
    });
  }
  text(ctx, "Queste definizioni sono generali e non equivalgono alla valutazione del referto da parte di un medico.", {
    size: 9,
    color: MUTED,
    gap: 4,
  });

  heading(ctx, "Domande da portare al medico");
  exp.questionsForDoctor.forEach((q) => text(ctx, `•  ${q}`, { indent: 4, gap: 2 }));

  heading(ctx, "Limiti");
  exp.limitations.forEach((l) => text(ctx, `•  ${l}`, { indent: 4, size: 9.5, color: MUTED, gap: 2 }));

  // Watermark e piè di pagina su ogni pagina
  const pages = pdf.getPages();
  pages.forEach((p, i) => {
    if (ctx.demo) {
      p.drawText("DEMO – DATI SINTETICI", {
        x: 120,
        y: 260,
        size: 46,
        font: ctx.sansBold,
        color: TEAL,
        opacity: 0.08,
        rotate: degrees(40),
      });
    }
    p.drawLine({ start: { x: M, y: M }, end: { x: A4.w - M, y: M }, thickness: 0.5, color: LINE });
    p.drawText(
      toWinAnsi(
        `Generato il ${formatDateIt(generatedAt)} · ${exp.modelAndPromptVersion} · Strumento informativo, non una diagnosi${ctx.demo ? " · DEMO" : ""}`,
      ),
      { x: M, y: M - 14, size: 7.5, font: ctx.sans, color: MUTED },
    );
    const label = `Pagina ${i + 1} di ${pages.length}`;
    p.drawText(label, { x: A4.w - M - ctx.sans.widthOfTextAtSize(label, 7.5), y: M - 14, size: 7.5, font: ctx.sans, color: MUTED });
  });

  return pdf.save();
}
