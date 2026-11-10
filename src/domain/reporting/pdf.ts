import { PDFDocument, StandardFonts, rgb, degrees, type PDFFont, type PDFPage } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ExtractedDocument } from "@/domain/extraction/schema";
import type { Explanation } from "./explanation-schema";

// Palette Cura Privata, coerente con i token del sito (src/app/globals.css). MARKER = menta chiara dietro testo scuro.
const INK = rgb(0x15 / 255, 0x31 / 255, 0x3c / 255);
const TEAL = rgb(0x00 / 255, 0x75 / 255, 0x6f / 255);
const SAGE = rgb(0x00 / 255, 0x8f / 255, 0x87 / 255);
const SAGE_DEEP = rgb(0x00 / 255, 0x75 / 255, 0x6f / 255);
const MUTED = rgb(0x4f / 255, 0x67 / 255, 0x6e / 255);
const LINE = rgb(0xdc / 255, 0xe9 / 255, 0xe7 / 255);
const MIST = rgb(0xe8 / 255, 0xf4 / 255, 0xf1 / 255);
const CREAM = rgb(0xf4 / 255, 0xf0 / 255, 0xe6 / 255);
const WHITE = rgb(1, 1, 1);
const PETROL = rgb(0x0c / 255, 0x33 / 255, 0x40 / 255);
const MINT = rgb(0x7b / 255, 0xe0 / 255, 0xd2 / 255);
const MARKER = rgb(0xcf / 255, 0xf3 / 255, 0xec / 255);

const A4 = { w: 595.28, h: 841.89 };
const M = 56; // margine
const CONTENT_W = A4.w - 2 * M;

/**
 * Con i font incorporati gestiamo i caratteri latini estesi; i simboli fuori dal sottoinsieme
 * (es. «▒» dei dati illeggibili) vengono sostituiti invece di far fallire la generazione.
 */
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
  serifBold: PDFFont;
  demo: boolean;
}

interface Fonts {
  sans: Uint8Array;
  sansBold: Uint8Array;
  serif: Uint8Array;
  serifBold: Uint8Array;
}

let fontCache: Promise<Fonts | null> | null = null;

/** Carica i font del sito (istanze statiche, sottoinsieme latino). Se mancano, si usano gli standard PDF. */
async function loadSiteFonts(): Promise<Fonts | null> {
  if (!fontCache) {
    fontCache = (async () => {
      try {
        const dir = path.join(process.cwd(), "src/domain/reporting/fonts");
        const [sans, sansBold, serif, serifBold] = await Promise.all(
          ["manrope-400.ttf", "manrope-600.ttf", "manrope-700.ttf", "manrope-700.ttf"].map((f) => readFile(path.join(dir, f))),
        );
        return { sans, sansBold, serif, serifBold };
      } catch {
        return null;
      }
    })();
  }
  return fontCache;
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
  if (ctx.y - needed < M + 44) newPage(ctx);
}

function text(
  ctx: Ctx,
  s: string,
  opts: { font?: PDFFont; size?: number; color?: ReturnType<typeof rgb>; indent?: number; gap?: number; lh?: number; maxWidth?: number } = {},
) {
  const font = opts.font ?? ctx.sans;
  const size = opts.size ?? 10.5;
  const lh = opts.lh ?? size * 1.5;
  const x = M + (opts.indent ?? 0);
  for (const l of wrap(s, font, size, opts.maxWidth ?? A4.w - M - x)) {
    ensure(ctx, lh);
    ctx.page.drawText(l, { x, y: ctx.y - size, size, font, color: opts.color ?? INK });
    ctx.y -= lh;
  }
  ctx.y -= opts.gap ?? 0;
}

/** Titolo di sezione: numero in sage, titolo in serif, filetto sottile. */
function heading(ctx: Ctx, n: number, s: string) {
  ensure(ctx, 150); // mai un titolo orfano a fondo pagina
  ctx.y -= 14;
  const label = String(n).padStart(2, "0");
  ctx.page.drawText(label, { x: M, y: ctx.y - 14, size: 11, font: ctx.sansBold, color: SAGE_DEEP });
  ctx.page.drawText(toWinAnsi(s), { x: M + 24, y: ctx.y - 15, size: 17, font: ctx.serif, color: INK });
  ctx.y -= 24;
  ctx.page.drawLine({ start: { x: M, y: ctx.y }, end: { x: A4.w - M, y: ctx.y }, thickness: 0.6, color: LINE });
  ctx.y -= 12;
}

function drawMark(page: PDFPage, x: number, y: number, scale: number, inverse = false) {
  // Simbolo Cura Privata (stessa geometria del logo SVG, viewBox 64): «C» aperta, curva interna, punto di menta.
  const outer = inverse ? WHITE : PETROL;
  const inner = inverse ? MINT : SAGE;
  page.drawSvgPath("M49.09 16.61A23 23 0 1 0 49.09 47.39", { x, y, scale, borderColor: outer, borderWidth: 8, borderLineCap: 1 });
  page.drawSvgPath("M31 20C39.5 20 44 26 44 32C44 38 39.5 44 31 44", { x, y, scale, borderColor: inner, borderWidth: 7, borderLineCap: 1 });
  page.drawCircle({ x: x + 31 * scale, y: y - 32 * scale, size: 3.6 * scale, color: MINT });
}

function formatDateIt(iso: string): string {
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${d}/${m}/${y}`;
}

/** Pillola di testo (es. stato DEMO) con sfondo. */
function pill(page: PDFPage, x: number, y: number, label: string, font: PDFFont, bg: ReturnType<typeof rgb>, fg: ReturnType<typeof rgb>) {
  const size = 8;
  const w = font.widthOfTextAtSize(label, size) + 16;
  page.drawRectangle({ x, y: y - 6, width: w, height: 18, color: bg, borderWidth: 0 });
  page.drawText(label, { x: x + 8, y, size, font, color: fg });
  return w;
}

export async function renderReportPdf(args: {
  document: ExtractedDocument;
  explanation: Explanation;
  generatedAt: string;
}): Promise<Uint8Array> {
  const { document: doc, explanation: exp, generatedAt } = args;
  const pdf = await PDFDocument.create();
  pdf.setTitle(toWinAnsi(`Cura Privata — Capisci il tuo referto — ${doc.isSynthetic ? "ESEMPIO DEMO" : "Report"}`));
  pdf.setAuthor("Cura Privata");
  pdf.setSubject("Spiegazione informativa, non clinica");
  pdf.setProducer("Cura Privata");
  pdf.setCreationDate(new Date(generatedAt));

  const fonts = await loadSiteFonts();
  let sans: PDFFont, sansBold: PDFFont, serif: PDFFont, serifBold: PDFFont;
  if (fonts) {
    pdf.registerFontkit(fontkit);
    [sans, sansBold, serif, serifBold] = await Promise.all([
      pdf.embedFont(fonts.sans, { subset: true }),
      pdf.embedFont(fonts.sansBold, { subset: true }),
      pdf.embedFont(fonts.serif, { subset: true }),
      pdf.embedFont(fonts.serifBold, { subset: true }),
    ]);
  } else {
    [sans, sansBold, serif, serifBold] = await Promise.all([
      pdf.embedFont(StandardFonts.Helvetica),
      pdf.embedFont(StandardFonts.HelveticaBold),
      pdf.embedFont(StandardFonts.TimesRoman),
      pdf.embedFont(StandardFonts.TimesRomanBold),
    ]);
  }

  const ctx: Ctx = { pdf, page: undefined as unknown as PDFPage, y: 0, sans, sansBold, serif, serifBold, demo: doc.isSynthetic };
  newPage(ctx);

  // ── Copertina editoriale (prima pagina) ──────────────────────────────────
  const coverH = 300;
  ctx.page.drawRectangle({ x: 0, y: A4.h - coverH, width: A4.w, height: coverH, color: PETROL });
  // Trama di "righe di referto" in trasparenza sulla copertina
  for (let r = 0; r < 7; r++) {
    for (let c = 0; c < 3; c++) {
      const w = 40 + ((r * 13 + c * 29) % 70);
      ctx.page.drawRectangle({
        x: A4.w / 2 + c * 150 + ((r * 17) % 40),
        y: A4.h - 40 - r * 34,
        width: w,
        height: 5,
        color: WHITE,
        opacity: 0.07,
      });
    }
  }
  drawMark(ctx.page, M - 2, A4.h - M + 2, 0.5, true);
  ctx.page.drawText("Cura ", { x: M + 32, y: A4.h - M - 20, size: 15, font: serif, color: WHITE });
  ctx.page.drawText("Privata", { x: M + 32 + serif.widthOfTextAtSize("Cura ", 15), y: A4.h - M - 20, size: 15, font: serif, color: MINT });

  let cy = A4.h - M - 76;
  if (ctx.demo) {
    pill(ctx.page, M, cy, toWinAnsi("ESEMPIO DIMOSTRATIVO · DATI SINTETICI · NON È UN DOCUMENTO MEDICO"), sansBold, CREAM, INK);
    cy -= 34;
  }
  // Titolo in due righe: "in parole semplici" ha la traccia di menta, la firma visiva del sito.
  const titleLines = ["Il tuo referto,", "in parole semplici"];
  titleLines.forEach((l, i) => {
    if (i === 1) {
      const w = serif.widthOfTextAtSize(l, 30);
      ctx.page.drawRectangle({ x: M - 6, y: cy - 39, width: w + 14, height: 40, color: MARKER });
    }
    ctx.page.drawText(l, { x: M, y: cy - 30, size: 30, font: serif, color: i === 1 ? INK : WHITE });
    cy -= 36;
  });
  cy -= 10;
  const meta = [
    ["Laboratorio", doc.laboratoryName],
    ["Data del documento", formatDateIt(doc.reportDate)],
    ["Riferimento", doc.patientLabel],
    ["Generato il", formatDateIt(generatedAt)],
  ];
  const fractions = [0.34, 0.2, 0.3, 0.16];
  meta.forEach(([k, v], i) => {
    const x = M + fractions.slice(0, i).reduce((a, f) => a + f * CONTENT_W, 0);
    const colW = fractions[i] * CONTENT_W;
    ctx.page.drawText(toWinAnsi(k.toUpperCase()), { x, y: cy - 8, size: 7, font: sansBold, color: MIST, opacity: 0.8 });
    wrap(v, sans, 9.5, colW - 12)
      .slice(0, 2)
      .forEach((l, li) => ctx.page.drawText(l, { x, y: cy - 24 - li * 12, size: 9.5, font: sans, color: WHITE }));
  });
  ctx.y = A4.h - coverH - 28;

  // Riquadro "In breve"
  const summaryLines = wrap(exp.summary, sans, 11, CONTENT_W - 44);
  const boxH = summaryLines.length * 16.5 + 46;
  ctx.page.drawRectangle({ x: M, y: ctx.y - boxH, width: CONTENT_W, height: boxH, color: MIST, borderColor: LINE, borderWidth: 0.6 });
  ctx.page.drawRectangle({ x: M, y: ctx.y - boxH, width: 4, height: boxH, color: TEAL });
  ctx.page.drawText("IN BREVE", { x: M + 22, y: ctx.y - 20, size: 8, font: sansBold, color: SAGE_DEEP });
  let sy = ctx.y - 40;
  for (const l of summaryLines) {
    ctx.page.drawText(l, { x: M + 22, y: sy, size: 11, font: sans, color: INK });
    sy -= 16.5;
  }
  ctx.y -= boxH + 10;

  // ── 01 Tabella valori ─────────────────────────────────────────────────────
  heading(ctx, 1, "I valori, esattamente come stampati");
  const cols = [M, M + 200, M + 300, M + 410];
  const rowH = 24;
  ensure(ctx, rowH * (exp.items.length + 1) + 10);
  ctx.page.drawRectangle({ x: M, y: ctx.y - rowH, width: CONTENT_W, height: rowH, color: MIST });
  ["Nome riportato", "Risultato", "Intervallo stampato", "Fonte"].forEach((h, i) =>
    ctx.page.drawText(h, { x: cols[i] + 8, y: ctx.y - 15.5, size: 8, font: sansBold, color: MUTED }),
  );
  ctx.y -= rowH;
  exp.items.forEach((it, idx) => {
    if (idx % 2 === 1) ctx.page.drawRectangle({ x: M, y: ctx.y - rowH, width: CONTENT_W, height: rowH, color: MIST, opacity: 0.45 });
    const cells = [
      it.nameExact,
      `${it.originalValueExact} ${it.originalUnitExact ?? ""}`.trim(),
      it.originalReferenceExact ?? "non riportato",
      `pag. ${it.sourceCitation.page}, riga ${it.sourceCitation.line}`,
    ];
    cells.forEach((c, i) =>
      ctx.page.drawText(toWinAnsi(c), {
        x: cols[i] + 8,
        y: ctx.y - 16,
        size: i === 3 ? 8.5 : 9.5,
        font: i === 1 ? sansBold : sans,
        color: i === 3 ? MUTED : INK,
      }),
    );
    ctx.page.drawLine({ start: { x: M, y: ctx.y - rowH }, end: { x: A4.w - M, y: ctx.y - rowH }, thickness: 0.5, color: LINE });
    ctx.y -= rowH;
  });
  ctx.y -= 10;
  if (exp.excludedObservations.length) {
    text(ctx, `Non inclusi: ${exp.excludedObservations.map((e) => `${e.nameExact} (${e.reason.replace(/\.$/, "").toLowerCase()})`).join("; ")}.`, {
      size: 8.5,
      color: MUTED,
      gap: 4,
    });
  }

  // ── 02 Glossario ──────────────────────────────────────────────────────────
  heading(ctx, 2, "Che cosa significano i termini");
  for (const it of exp.items) {
    ensure(ctx, 84);
    const top = ctx.y;
    ctx.page.drawText(toWinAnsi(it.nameExact), { x: M + 14, y: ctx.y - 13, size: 12, font: serifBold, color: INK });
    ctx.y -= 22;
    text(ctx, it.plainLanguageDefinition, { indent: 14, gap: 2, maxWidth: CONTENT_W - 14 });
    text(ctx, `Nel documento: ${it.originalValueExact} ${it.originalUnitExact ?? ""} — intervallo stampato ${it.originalReferenceExact ?? "non riportato"}. ${it.printedRangeNote}`, {
      size: 9.5,
      color: TEAL,
      indent: 14,
      gap: 12,
      maxWidth: CONTENT_W - 14,
    });
    // filetto laterale per il blocco (solo se non è cambiata pagina)
    if (ctx.y < top) ctx.page.drawLine({ start: { x: M + 2, y: top - 4 }, end: { x: M + 2, y: ctx.y + 10 }, thickness: 2, color: SAGE, opacity: 0.6 });
  }
  text(ctx, "Queste definizioni sono generali e non equivalgono alla valutazione del referto da parte di un medico.", {
    size: 9,
    color: MUTED,
    gap: 4,
  });

  // ── 03 Domande ────────────────────────────────────────────────────────────
  heading(ctx, 3, "Domande da portare al medico");
  exp.questionsForDoctor.forEach((q, i) => {
    ensure(ctx, 30);
    ctx.page.drawCircle({ x: M + 8, y: ctx.y - 7, size: 7, color: TEAL });
    ctx.page.drawText(String(i + 1), { x: M + 5.2, y: ctx.y - 9.5, size: 7.5, font: sansBold, color: WHITE });
    text(ctx, q, { indent: 24, gap: 4 });
  });

  // ── 04 Limiti ─────────────────────────────────────────────────────────────
  heading(ctx, 4, "Limiti");
  exp.limitations.forEach((l) => text(ctx, `•  ${l}`, { indent: 4, size: 9.5, color: MUTED, gap: 2 }));

  // Watermark e piè di pagina su ogni pagina
  const pages = pdf.getPages();
  pages.forEach((p, i) => {
    if (ctx.demo) {
      p.drawText("DEMO – DATI SINTETICI", {
        x: 120,
        y: 260,
        size: 46,
        font: sansBold,
        color: TEAL,
        opacity: 0.08,
        rotate: degrees(40),
      });
    }
    p.drawLine({ start: { x: M, y: M }, end: { x: A4.w - M, y: M }, thickness: 0.5, color: LINE });
    p.drawText(
      toWinAnsi(`Generato il ${formatDateIt(generatedAt)} · ${exp.modelAndPromptVersion} · Strumento informativo, non una diagnosi${ctx.demo ? " · DEMO" : ""}`),
      { x: M, y: M - 14, size: 7.5, font: sans, color: MUTED },
    );
    const label = `Pagina ${i + 1} di ${pages.length}`;
    p.drawText(label, { x: A4.w - M - sans.widthOfTextAtSize(label, 7.5), y: M - 14, size: 7.5, font: sans, color: MUTED });
    if (i > 0) {
      drawMark(p, M - 2, A4.h - M + 10, 0.32);
      p.drawText("Cura Privata · Capisci il tuo referto", { x: M + 20, y: A4.h - M + 2, size: 8.5, font: serif, color: MUTED });
      ctx.y = Math.min(ctx.y, A4.h - M);
    }
  });

  return pdf.save();
}
