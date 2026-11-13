import { PDFDocument, StandardFonts, rgb, degrees, type PDFFont, type PDFPage } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ExtractedDocument } from "@/domain/extraction/schema";
import type { Explanation } from "./explanation-schema";
import { reportGlance } from "./glance";
import { INK, TEAL, SAGE, SAGE_DEEP, MUTED, LINE, MIST, CREAM, WHITE, PETROL, MINT, MARKER, toWinAnsi, drawMark } from "./pdf-brand";

export { toWinAnsi } from "./pdf-brand";

const A4 = { w: 595.28, h: 841.89 };
const M = 56; // margine
const CONTENT_W = A4.w - 2 * M;

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
  // Dalla seconda pagina in cima c'è la riga con il marchio: il testo parte sotto.
  ctx.y = ctx.pdf.getPageCount() > 1 ? A4.h - M - 20 : A4.h - M;
}

function ensure(ctx: Ctx, needed: number) {
  if (ctx.y - needed < M + 14) newPage(ctx);
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
function heading(ctx: Ctx, n: number, s: string, room = 150) {
  ensure(ctx, room); // mai un titolo orfano a fondo pagina
  ctx.y -= 14;
  const label = String(n).padStart(2, "0");
  ctx.page.drawText(label, { x: M, y: ctx.y - 14, size: 11, font: ctx.sansBold, color: SAGE_DEEP });
  ctx.page.drawText(toWinAnsi(s), { x: M + 24, y: ctx.y - 15, size: 17, font: ctx.serif, color: INK });
  ctx.y -= 24;
  ctx.page.drawLine({ start: { x: M, y: ctx.y }, end: { x: A4.w - M, y: ctx.y }, thickness: 0.6, color: LINE });
  ctx.y -= 12;
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

  // Ciclo 5, fase 3: la prima pagina è «il foglio per il medico»: testata bassa, colpo d'occhio, valori con la
  // posizione rispetto all'intervallo stampato, domande. Le spiegazioni dei termini e i limiti stanno a pagina 2.
  // Ogni posizione è scritta a parole e ha un segno: si legge anche stampata in bianco e nero.
  const g = reportGlance(exp);

  // ── Testata ───────────────────────────────────────────────────────────────
  const coverH = 178;
  ctx.page.drawRectangle({ x: 0, y: A4.h - coverH, width: A4.w, height: coverH, color: PETROL });
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 3; c++) {
      const w = 40 + ((r * 13 + c * 29) % 70);
      ctx.page.drawRectangle({ x: A4.w / 2 + c * 150 + ((r * 17) % 40), y: A4.h - 40 - r * 34, width: w, height: 5, color: WHITE, opacity: 0.07 });
    }
  }
  drawMark(ctx.page, M - 2, A4.h - M + 2, 0.5, true);
  ctx.page.drawText("Cura ", { x: M + 32, y: A4.h - M - 20, size: 15, font: serif, color: WHITE });
  ctx.page.drawText("Privata", { x: M + 32 + serif.widthOfTextAtSize("Cura ", 15), y: A4.h - M - 20, size: 15, font: serif, color: MINT });
  if (ctx.demo) {
    const demoLabel = toWinAnsi("ESEMPIO DIMOSTRATIVO · DATI SINTETICI");
    pill(ctx.page, A4.w - M - (sansBold.widthOfTextAtSize(demoLabel, 8) + 16), A4.h - M - 19, demoLabel, sansBold, CREAM, INK);
  }
  // Titolo su una riga: «in parole semplici» ha la traccia di menta, la firma visiva del sito.
  const t1 = "Il tuo referto, ";
  const t2 = "in parole semplici";
  const tY = A4.h - M - 62;
  const t1w = serif.widthOfTextAtSize(t1, 23);
  ctx.page.drawRectangle({ x: M + t1w - 4, y: tY - 7, width: serif.widthOfTextAtSize(t2, 23) + 9, height: 30, color: MARKER });
  ctx.page.drawText(t1, { x: M, y: tY, size: 23, font: serif, color: WHITE });
  ctx.page.drawText(t2, { x: M + t1w, y: tY, size: 23, font: serif, color: INK });
  const meta = [
    ["Laboratorio", doc.laboratoryName],
    ["Data del documento", formatDateIt(doc.reportDate)],
    ["Riferimento", doc.patientLabel],
    ["Generato il", formatDateIt(generatedAt)],
  ];
  const fractions = [0.34, 0.2, 0.3, 0.16];
  const mY = tY - 24;
  meta.forEach(([k, v], i) => {
    const x = M + fractions.slice(0, i).reduce((a, f) => a + f * CONTENT_W, 0);
    const colW = fractions[i] * CONTENT_W;
    ctx.page.drawText(toWinAnsi(k.toUpperCase()), { x, y: mY - 8, size: 7, font: sansBold, color: MIST, opacity: 0.8 });
    wrap(v, sans, 9.5, colW - 12)
      .slice(0, 2)
      .forEach((l, li) => ctx.page.drawText(l, { x, y: mY - 22 - li * 12, size: 9.5, font: sans, color: WHITE }));
  });
  ctx.y = A4.h - coverH - 22;

  // ── A colpo d'occhio ──────────────────────────────────────────────────────
  {
    const innerW = CONTENT_W - 44;
    const headline = wrap(`${g.total === 1 ? "Un valore letto" : `${g.total} valori letti`}: ${g.sentence}`, sansBold, 14, innerW);
    const watch = g.ordered.filter((r) => r.glance.position === "above-range" || r.glance.position === "below-range");
    const watchText = watch.length
      ? watch.map((r) => `${r.item.nameExact} (${r.item.originalValueExact}${r.item.originalUnitExact ? ` ${r.item.originalUnitExact}` : ""}, ${r.glance.short.toLowerCase()} l'intervallo stampato)`).join("; ")
      : g.notComparable === 0
        ? "Nessun numero è fuori dall'intervallo stampato dal laboratorio."
        : "";
    const watchLabel = watch.length ? "Da chiedere al medico: " : "";
    const watchLines = watchText ? wrap(watchLabel + watchText, sans, 10.5, innerW) : [];
    const note = "Confronto tra i numeri e gli intervalli stampati sul referto: non è una valutazione clinica.";
    const boxH = 34 + headline.length * 19 + (watchLines.length ? 6 + watchLines.length * 15 : 0) + 22;
    ctx.page.drawRectangle({ x: M, y: ctx.y - boxH, width: CONTENT_W, height: boxH, color: MIST, borderColor: LINE, borderWidth: 0.6 });
    ctx.page.drawRectangle({ x: M, y: ctx.y - boxH, width: 4, height: boxH, color: TEAL });
    ctx.page.drawText("A COLPO D'OCCHIO", { x: M + 22, y: ctx.y - 20, size: 8, font: sansBold, color: SAGE_DEEP });
    let sy = ctx.y - 41;
    for (const l of headline) {
      ctx.page.drawText(l, { x: M + 22, y: sy, size: 14, font: sansBold, color: INK });
      sy -= 19;
    }
    if (watchLines.length) {
      sy -= 3;
      watchLines.forEach((l, li) => {
        // Solo l'etichetta iniziale è in grassetto.
        if (li === 0 && watchLabel && l.startsWith(watchLabel)) {
          ctx.page.drawText(toWinAnsi(watchLabel), { x: M + 22, y: sy, size: 10.5, font: sansBold, color: INK });
          ctx.page.drawText(l.slice(toWinAnsi(watchLabel).length), { x: M + 22 + sansBold.widthOfTextAtSize(toWinAnsi(watchLabel), 10.5), y: sy, size: 10.5, font: sans, color: INK });
        } else ctx.page.drawText(l, { x: M + 22, y: sy, size: 10.5, font: sans, color: INK });
        sy -= 15;
      });
    }
    ctx.page.drawText(toWinAnsi(note), { x: M + 22, y: ctx.y - boxH + 11, size: 8, font: sans, color: MUTED });
    ctx.y -= boxH + 6;
  }

  // ── 01 Valori con posizione ───────────────────────────────────────────────
  heading(ctx, 1, "I valori e l'intervallo stampato");
  const cols = [M, M + 152, M + 240, M + 326, M + 436];
  const headH = 22;
  ctx.page.drawRectangle({ x: M, y: ctx.y - headH, width: CONTENT_W, height: headH, color: MIST });
  ["Nome riportato", "Risultato", "Intervallo stampato", "Posizione", "Fonte"].forEach((h, i) =>
    ctx.page.drawText(h, { x: cols[i] + 8, y: ctx.y - 14.5, size: 8, font: sansBold, color: MUTED }),
  );
  ctx.y -= headH;
  for (const { item: it, glance: ig } of g.ordered) {
    const out = ig.position === "above-range" || ig.position === "below-range";
    const nameLines = wrap(it.nameExact, out ? sansBold : sans, 9.5, cols[1] - cols[0] - 14).slice(0, 3);
    const rowH = Math.max(26, 14 + nameLines.length * 12);
    ensure(ctx, rowH);
    const top = ctx.y;
    const mid = top - rowH / 2;
    if (out) {
      ctx.page.drawRectangle({ x: M, y: top - rowH, width: CONTENT_W, height: rowH, color: CREAM });
      ctx.page.drawRectangle({ x: M, y: top - rowH, width: 3, height: rowH, color: INK });
    }
    nameLines.forEach((l, li) => ctx.page.drawText(l, { x: cols[0] + 8, y: mid + (nameLines.length - 1) * 6 - 3.5 - li * 12, size: 9.5, font: out ? sansBold : sans, color: INK }));
    ctx.page.drawText(toWinAnsi(`${it.originalValueExact} ${it.originalUnitExact ?? ""}`.trim()), { x: cols[1] + 8, y: mid - 3.5, size: 9.5, font: sansBold, color: INK });
    ctx.page.drawText(toWinAnsi(it.originalReferenceExact ?? "non riportato"), { x: cols[2] + 8, y: mid - 3.5, size: 9.5, font: sans, color: INK });
    // Posizione: barra schematica (fascia = intervallo stampato, punto = numero) e la stessa cosa a parole.
    const bx = cols[3] + 8;
    const bw = 50;
    let wx = bx;
    if (ig.bar) {
      ctx.page.drawRectangle({ x: bx, y: mid - 2.5, width: bw, height: 5, color: WHITE, borderColor: MUTED, borderWidth: 0.4 });
      ctx.page.drawRectangle({ x: bx + (ig.bar.bandStart / 100) * bw, y: mid - 2.5, width: ((ig.bar.bandEnd - ig.bar.bandStart) / 100) * bw, height: 5, color: MINT, borderColor: TEAL, borderWidth: 0.4 });
      ctx.page.drawCircle({ x: bx + (ig.bar.marker / 100) * bw, y: mid, size: 4, color: out ? INK : TEAL, borderColor: WHITE, borderWidth: 1 });
      wx = bx + bw + 8;
    }
    if (out) {
      // Triangolo pieno: verso l'alto «sopra», verso il basso «sotto».
      const up = ig.position === "above-range";
      ctx.page.drawSvgPath(up ? "M0 0 L3.5 -6 L7 0 Z" : "M0 -6 L3.5 0 L7 -6 Z", { x: wx, y: mid - 3, color: INK });
      wx += 10;
    }
    ctx.page.drawText(toWinAnsi(ig.bar ? ig.short : "Non confrontabile"), { x: wx, y: mid - 3.5, size: ig.bar ? 9.5 : 8.5, font: out ? sansBold : sans, color: out ? INK : ig.bar ? TEAL : MUTED });
    ctx.page.drawText(`p. ${it.sourceCitation.page}, r. ${it.sourceCitation.line}`, { x: cols[4] + 8, y: mid - 3, size: 8, font: sans, color: MUTED });
    ctx.page.drawLine({ start: { x: M, y: top - rowH }, end: { x: A4.w - M, y: top - rowH }, thickness: 0.5, color: LINE });
    ctx.y -= rowH;
  }
  ctx.y -= 8;
  text(ctx, "Posizione: dove cade il numero rispetto all'intervallo stampato dal laboratorio su questo referto. Fonte: pagina e riga del documento.", { size: 8, color: MUTED, gap: 2 });
  if (exp.excludedObservations.length) {
    text(ctx, `Non inclusi: ${exp.excludedObservations.map((e) => `${e.nameExact} (${e.reason.replace(/\.$/, "").toLowerCase()})`).join("; ")}.`, {
      size: 8,
      color: MUTED,
      gap: 2,
    });
  }

  // ── 02 Domande ────────────────────────────────────────────────────────────
  heading(ctx, 2, "Domande da portare al medico");
  exp.questionsForDoctor.forEach((q, i) => {
    ensure(ctx, 30);
    ctx.page.drawCircle({ x: M + 8, y: ctx.y - 7, size: 7, color: TEAL });
    ctx.page.drawText(String(i + 1), { x: M + 5.2, y: ctx.y - 9.5, size: 7.5, font: sansBold, color: WHITE });
    text(ctx, q, { indent: 24, gap: 5 });
  });
  // Se in fondo alla prima pagina resta posto, qualche riga per gli appunti presi in visita.
  if (pdf.getPageCount() === 1 && ctx.y - (M + 16) >= 70) {
    ctx.y -= 10;
    ctx.page.drawText("APPUNTI DELLA VISITA", { x: M, y: ctx.y - 8, size: 8, font: sansBold, color: MUTED });
    ctx.y -= 12;
    const rows = Math.min(6, Math.floor((ctx.y - (M + 16)) / 24));
    for (let r = 0; r < rows; r++) {
      ctx.y -= 24;
      ctx.page.drawLine({ start: { x: M, y: ctx.y }, end: { x: A4.w - M, y: ctx.y }, thickness: 0.5, color: MUTED, opacity: 0.55 });
    }
  }

  // ── Pagina delle spiegazioni ──────────────────────────────────────────────
  // Le spiegazioni partono su una pagina nuova solo se la prima è ancora «il foglio»: se le domande sono già
  // andate a pagina 2, si prosegue lì.
  if (pdf.getPageCount() === 1) newPage(ctx);

  // ── 03 Glossario ──────────────────────────────────────────────────────────
  heading(ctx, 3, "Che cosa significano i termini");
  for (const { item: it } of g.ordered) {
    ensure(ctx, 84);
    const top = ctx.y;
    ctx.page.drawText(toWinAnsi(it.nameExact), { x: M + 14, y: ctx.y - 13, size: 12, font: serifBold, color: INK });
    ctx.y -= 22;
    text(ctx, it.plainLanguageDefinition, { indent: 14, gap: 2, maxWidth: CONTENT_W - 14 });
    text(ctx, `Nel documento: ${it.originalValueExact} ${it.originalUnitExact ?? ""} — intervallo stampato ${it.originalReferenceExact ?? "non riportato"}. ${it.printedRangeNote}`, {
      size: 9.5,
      color: TEAL,
      indent: 14,
      gap: 10,
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

  // ── 04 In breve e limiti ──────────────────────────────────────────────────
  const closing = [exp.summary, ...exp.limitations];
  const closingLines = closing.reduce((n, l) => n + wrap(`•  ${l}`, sans, 9.5, CONTENT_W - 4).length, 0);
  heading(ctx, 4, "In breve e limiti", 52 + closingLines * 14.25 + closing.length * 2);
  closing.forEach((l) => text(ctx, `•  ${l}`, { indent: 4, size: 9.5, color: MUTED, gap: 2 }));

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
