import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage, type RGB } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { INK, LINE, MARKER, MINT, MIST, MUTED, PETROL, SAGE_DEEP, WHITE, CREAM, drawMark, toWinAnsi } from "@/domain/reporting/pdf-brand";
import { CATEGORY_LABEL, COMPLETENESS_NOTE, PDP_DISCLAIMER } from "@/content/punto-di-partenza";
import type { PdpMap } from "@/domain/punto-di-partenza";

/**
 * Scheda A4 «Punto di Partenza», generata nel browser con pdf-lib (stessi colori, logo e font del report).
 * Niente server: le risposte non lasciano il dispositivo e il PDF non viene salvato da nessuna parte.
 */

export interface PdpFonts {
  regular: Uint8Array;
  bold: Uint8Array;
}

const A4 = { w: 595.28, h: 841.89 };
const M = 50;
const W = A4.w - 2 * M;

interface Ctx {
  pdf: PDFDocument;
  page: PDFPage;
  y: number;
  sans: PDFFont;
  bold: PDFFont;
}

function wrap(text: string, font: PDFFont, size: number, max: number): string[] {
  const out: string[] = [];
  for (const para of toWinAnsi(text).split("\n")) {
    let line = "";
    for (const word of para.split(/\s+/)) {
      const next = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(next, size) > max && line) {
        out.push(line);
        line = word;
      } else line = next;
    }
    out.push(line);
  }
  return out;
}

function footer(ctx: Ctx) {
  const t = toWinAnsi("Cura Privata · Punto di Partenza · informativo, non diagnostico · non per le emergenze: 112");
  ctx.page.drawLine({ start: { x: M, y: 40 }, end: { x: A4.w - M, y: 40 }, thickness: 0.5, color: LINE });
  ctx.page.drawText(t, { x: M, y: 26, size: 7.5, font: ctx.sans, color: MUTED });
}

function newPage(ctx: Ctx) {
  ctx.page = ctx.pdf.addPage([A4.w, A4.h]);
  ctx.y = A4.h - M;
  footer(ctx);
}

function ensure(ctx: Ctx, h: number) {
  if (ctx.y - h < 56) newPage(ctx);
}

function text(ctx: Ctx, s: string, o: { size?: number; font?: PDFFont; color?: RGB; indent?: number; gap?: number } = {}) {
  const size = o.size ?? 10;
  const font = o.font ?? ctx.sans;
  const x = M + (o.indent ?? 0);
  for (const l of wrap(s, font, size, W - (o.indent ?? 0))) {
    ensure(ctx, size * 1.5);
    ctx.page.drawText(l, { x, y: ctx.y - size, size, font, color: o.color ?? INK });
    ctx.y -= size * 1.5;
  }
  ctx.y -= o.gap ?? 0;
}

function section(ctx: Ctx, title: string, tag?: { label: string; bg: RGB }) {
  ensure(ctx, 70);
  ctx.y -= 10;
  ctx.page.drawText(toWinAnsi(title), { x: M, y: ctx.y - 14, size: 14, font: ctx.bold, color: INK });
  if (tag) {
    const tw = ctx.bold.widthOfTextAtSize(toWinAnsi(title), 14);
    const lw = ctx.bold.widthOfTextAtSize(toWinAnsi(tag.label), 8) + 14;
    ctx.page.drawRectangle({ x: M + tw + 10, y: ctx.y - 15, width: lw, height: 15, color: tag.bg });
    ctx.page.drawText(toWinAnsi(tag.label), { x: M + tw + 17, y: ctx.y - 11, size: 8, font: ctx.bold, color: INK });
  }
  ctx.y -= 22;
  ctx.page.drawLine({ start: { x: M, y: ctx.y }, end: { x: A4.w - M, y: ctx.y }, thickness: 0.6, color: LINE });
  ctx.y -= 10;
}

function bullet(ctx: Ctx, s: string, mark = "•", sub?: string) {
  ensure(ctx, 16);
  ctx.page.drawText(toWinAnsi(mark), { x: M + 2, y: ctx.y - 10.5, size: 10.5, font: ctx.bold, color: SAGE_DEEP });
  text(ctx, s, { indent: 18, size: 10.5, font: ctx.bold });
  if (sub) text(ctx, sub, { indent: 18, size: 9.5, color: MUTED });
  ctx.y -= 3;
}

const BLUE = rgb(0xe7 / 255, 0xf1 / 255, 0xf8 / 255);

export async function renderPdpPdf(map: PdpMap, opts: { fonts?: PdpFonts | null; notes?: string; date?: Date } = {}): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const date = opts.date ?? new Date();
  pdf.setTitle(toWinAnsi("Cura Privata — Il mio Punto di Partenza"));
  pdf.setAuthor("Cura Privata");
  pdf.setSubject("Scheda informativa da portare al medico, non diagnostica");
  pdf.setProducer("Cura Privata");
  pdf.setCreationDate(date);
  let sans: PDFFont, bold: PDFFont;
  if (opts.fonts) {
    pdf.registerFontkit(fontkit);
    [sans, bold] = await Promise.all([pdf.embedFont(opts.fonts.regular, { subset: true }), pdf.embedFont(opts.fonts.bold, { subset: true })]);
  } else {
    [sans, bold] = await Promise.all([pdf.embedFont(StandardFonts.Helvetica), pdf.embedFont(StandardFonts.HelveticaBold)]);
  }
  const ctx: Ctx = { pdf, page: undefined as unknown as PDFPage, y: 0, sans, bold };
  newPage(ctx);

  // Testata petrolio con logo e titolo, come la copertina del report.
  const headH = 150;
  ctx.page.drawRectangle({ x: 0, y: A4.h - headH, width: A4.w, height: headH, color: PETROL });
  drawMark(ctx.page, M - 2, A4.h - 34, 0.45, true);
  ctx.page.drawText("Cura ", { x: M + 30, y: A4.h - 52, size: 13, font: bold, color: WHITE });
  ctx.page.drawText("Privata", { x: M + 30 + bold.widthOfTextAtSize("Cura ", 13), y: A4.h - 52, size: 13, font: bold, color: MINT });
  const d = date.toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric" });
  const right = toWinAnsi(`Scheda del ${d}`);
  ctx.page.drawText(right, { x: A4.w - M - sans.widthOfTextAtSize(right, 9), y: A4.h - 50, size: 9, font: sans, color: MIST });
  const t1 = "Il mio";
  const t2 = "Punto di Partenza";
  ctx.page.drawText(t1, { x: M, y: A4.h - 92, size: 24, font: bold, color: WHITE });
  const w2 = bold.widthOfTextAtSize(t2, 24);
  ctx.page.drawRectangle({ x: M - 5, y: A4.h - 130, width: w2 + 12, height: 32, color: MARKER });
  ctx.page.drawText(t2, { x: M, y: A4.h - 122, size: 24, font: bold, color: INK });
  ctx.y = A4.h - headH - 20;

  // Obiettivo + completezza
  if (map.goalLabel) {
    text(ctx, "OBIETTIVO", { size: 8, font: bold, color: SAGE_DEEP });
    text(ctx, map.goalLabel, { size: 13, font: bold, gap: 6 });
  }
  ensure(ctx, 52);
  ctx.page.drawRectangle({ x: M, y: ctx.y - 44, width: W, height: 44, color: MIST });
  ctx.page.drawText(`${map.completeness}%`, { x: M + 14, y: ctx.y - 31, size: 22, font: bold, color: INK });
  ctx.page.drawText(toWinAnsi("Completezza delle informazioni"), { x: M + 90, y: ctx.y - 18, size: 10.5, font: bold, color: INK });
  ctx.page.drawText(toWinAnsi(COMPLETENESS_NOTE), { x: M + 90, y: ctx.y - 33, size: 9, font: sans, color: MUTED });
  ctx.y -= 56;

  section(ctx, "Informazioni già disponibili");
  if (map.available.length) map.available.forEach((x) => bullet(ctx, x, "•"));
  else text(ctx, "Nessuna indicata. Va benissimo: la scheda serve proprio a partire.", { color: MUTED });
  for (const n of map.generalNotes) text(ctx, n, { size: 9.5, color: MUTED, gap: 2 });

  section(ctx, "Già documentato");
  if (map.documented.length) map.documented.forEach((x) => bullet(ctx, x.area.title, "•", CATEGORY_LABEL[x.area.category]));
  else text(ctx, "Nessuna area segnata come già documentata.", { color: MUTED });

  section(ctx, "Da discutere con il medico", { label: "Base", bg: MARKER });
  if (map.toDiscussBase.length) map.toDiscussBase.forEach((x) => bullet(ctx, x.area.title, "•", [x.area.whatToDiscuss, ...x.notes].join(" ")));
  else text(ctx, "Tutte le aree di base risultano già documentate.", { color: MUTED });

  section(ctx, "Da discutere, se pertinente", { label: "Contestuale", bg: BLUE });
  map.toDiscussContextual.forEach((x) => bullet(ctx, x.area.title, "•", [x.area.whatToDiscuss, ...x.notes].join(" ")));

  section(ctx, "Più esami non significa più prevenzione", { label: "Non di routine", bg: CREAM });
  text(ctx, "Esempi di controlli da non aggiungere in modo automatico senza disturbi o un sospetto clinico:", { size: 9.5, color: MUTED, gap: 2 });
  map.notRoutine.forEach((x) => bullet(ctx, x.title, "–", x.why));

  section(ctx, "Domande per il medico");
  map.questions.forEach((q, i) => bullet(ctx, q, `${i + 1}.`));

  section(ctx, "Note");
  const notes = (opts.notes ?? "").trim();
  if (notes) text(ctx, notes, { gap: 4 });
  for (let i = 0; i < (notes ? 2 : 4); i++) {
    ensure(ctx, 24);
    ctx.y -= 20;
    ctx.page.drawLine({ start: { x: M, y: ctx.y }, end: { x: A4.w - M, y: ctx.y }, thickness: 0.5, color: LINE });
  }
  ctx.y -= 14;
  text(ctx, PDP_DISCLAIMER, { size: 8.5, color: MUTED });
  text(ctx, `Contenuti versione ${map.version}.`, { size: 8, color: MUTED });
  return pdf.save();
}
