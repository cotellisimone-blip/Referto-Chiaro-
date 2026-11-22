import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage, type RGB } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { INK, LINE, MARKER, MINT, MIST, MUTED, PETROL, SAGE_DEEP, WHITE, drawMark, toWinAnsi } from "@/domain/reporting/pdf-brand";
import type { Diario } from "./catalogo";
import {
  INTENSITA,
  MOMENTI_GLICEMIA,
  QUALITA_SONNO,
  SINTOMI,
  dataIt,
  dayOf,
  durataTesto,
  fascia,
  giornoBreve,
  kgTesto,
  minutiTra,
  oreMinuti,
  ordina,
  periodo,
  riepilogoCefalea,
  riepilogoGlicemia,
  riepilogoPeso,
  riepilogoPressione,
  riepilogoRespiro,
  riepilogoSonno,
  scartoBreve,
  sonnoStimato,
  efficienzaNotte,
  type VoceDiario,
} from "./voci";

/**
 * PDF dei diari (21/11/2026), generati nel browser con pdf-lib: stessi colori e logo del report.
 *  - il diario vuoto da stampare (pagina pubblica, senza dati: niente lascia il dispositivo);
 *  - il foglio per il medico, una pagina: periodo, medie calcolate, le misure una per una. Nessuna valutazione.
 */

export interface DiarioFonts {
  regular: Uint8Array;
  bold: Uint8Array;
}

const A4 = { w: 595.28, h: 841.89 };
const M = 40;
const W = A4.w - 2 * M;
const SOFT = rgb(0xf6 / 255, 0xfa / 255, 0xf9 / 255);

interface Ctx {
  pdf: PDFDocument;
  page: PDFPage;
  sans: PDFFont;
  bold: PDFFont;
}

async function open(title: string, subject: string, fonts: DiarioFonts | null | undefined, date: Date): Promise<Ctx> {
  const pdf = await PDFDocument.create();
  pdf.setTitle(toWinAnsi(title));
  pdf.setAuthor("Cura Privata");
  pdf.setSubject(toWinAnsi(subject));
  pdf.setProducer("Cura Privata");
  pdf.setCreationDate(date);
  let sans: PDFFont, bold: PDFFont;
  if (fonts) {
    pdf.registerFontkit(fontkit);
    [sans, bold] = await Promise.all([pdf.embedFont(fonts.regular, { subset: true }), pdf.embedFont(fonts.bold, { subset: true })]);
  } else {
    [sans, bold] = await Promise.all([pdf.embedFont(StandardFonts.Helvetica), pdf.embedFont(StandardFonts.HelveticaBold)]);
  }
  return { pdf, page: pdf.addPage([A4.w, A4.h]), sans, bold };
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

/** Scrive un paragrafo a capo dentro `max`; restituisce la y sotto l'ultima riga. */
function para(c: Ctx, s: string, x: number, y: number, max: number, o: { size?: number; font?: PDFFont; color?: RGB; lead?: number; maxLines?: number } = {}): number {
  const size = o.size ?? 9.5;
  const lead = o.lead ?? size * 1.35;
  let lines = wrap(s, o.font ?? c.sans, size, max);
  if (o.maxLines && lines.length > o.maxLines) lines = [...lines.slice(0, o.maxLines - 1), `${lines[o.maxLines - 1].replace(/\s+\S*$/, "")}…`];
  for (const l of lines) {
    c.page.drawText(l, { x, y: y - size, size, font: o.font ?? c.sans, color: o.color ?? INK });
    y -= lead;
  }
  return y;
}

function txt(c: Ctx, s: string, x: number, y: number, size: number, font: PDFFont, color: RGB = INK) {
  c.page.drawText(toWinAnsi(s), { x, y, size, font, color });
}

/** Testata petrolio con logo, il titolo con l'evidenziatore e, a destra, una riga di contesto. */
function testata(c: Ctx, sopra: string, titolo: string, destra: string): number {
  const h = 96;
  c.page.drawRectangle({ x: 0, y: A4.h - h, width: A4.w, height: h, color: PETROL });
  drawMark(c.page, M - 2, A4.h - 22, 0.36, true);
  txt(c, "Cura ", M + 26, A4.h - 37, 11.5, c.bold, WHITE);
  txt(c, "Privata", M + 26 + c.bold.widthOfTextAtSize("Cura ", 11.5), A4.h - 37, 11.5, c.bold, MINT);
  const r = toWinAnsi(destra);
  txt(c, r, A4.w - M - c.sans.widthOfTextAtSize(r, 9), A4.h - 36, 9, c.sans, MIST);
  txt(c, sopra, M, A4.h - 62, 10, c.bold, MINT);
  const t = toWinAnsi(titolo);
  const tw = c.bold.widthOfTextAtSize(t, 19);
  c.page.drawRectangle({ x: M - 4, y: A4.h - 88, width: tw + 10, height: 24, color: MARKER });
  txt(c, t, M, A4.h - 82, 19, c.bold, INK);
  return A4.h - h - 16;
}

function piede(c: Ctx, s: string) {
  c.page.drawLine({ start: { x: M, y: 34 }, end: { x: A4.w - M, y: 34 }, thickness: 0.5, color: LINE });
  para(c, s, M, 30, W, { size: 7.5, color: MUTED, lead: 9.5, maxLines: 2 });
}

function etichetta(c: Ctx, s: string, x: number, y: number) {
  txt(c, s.toUpperCase(), x, y - 8, 7.5, c.bold, SAGE_DEEP);
}

interface Col {
  t: string;
  w: number;
  sub?: string;
}

/** Tabella a righe alterne; `rows` contiene il testo delle celle (vuoto nel diario da stampare). */
function tabella(c: Ctx, cols: Col[], rows: string[][], y: number, rowH: number, o: { size?: number; headH?: number } = {}): number {
  const total = cols.reduce((a, x) => a + x.w, 0);
  const scale = W / total;
  const headH = o.headH ?? 26;
  c.page.drawRectangle({ x: M, y: y - headH, width: W, height: headH, color: MIST });
  let x = M;
  for (const col of cols) {
    const w = col.w * scale;
    para(c, col.t, x + 4, y - 4, w - 8, { size: 7.8, font: c.bold, lead: 9, maxLines: col.sub ? 1 : 2 });
    if (col.sub) para(c, col.sub, x + 4, y - 14, w - 8, { size: 7, color: MUTED, lead: 8.5, maxLines: 1 });
    x += w;
  }
  y -= headH;
  rows.forEach((r, i) => {
    if (i % 2 === 1) c.page.drawRectangle({ x: M, y: y - rowH, width: W, height: rowH, color: SOFT });
    let cx = M;
    r.forEach((cell, j) => {
      const w = cols[j].w * scale;
      if (cell) para(c, cell, cx + 4, y - Math.max(2, (rowH - (o.size ?? 8.5) * 1.25) / 2), w - 8, { size: o.size ?? 8.5, lead: (o.size ?? 8.5) * 1.2, maxLines: Math.max(1, Math.floor(rowH / ((o.size ?? 8.5) * 1.25))) });
      cx += w;
    });
    y -= rowH;
    c.page.drawLine({ start: { x: M, y }, end: { x: A4.w - M, y }, thickness: 0.4, color: LINE });
  });
  // Linee verticali
  let vx = M;
  for (const col of cols.slice(0, -1)) {
    vx += col.w * scale;
    c.page.drawLine({ start: { x: vx, y: y }, end: { x: vx, y: y + rows.length * rowH + headH }, thickness: 0.4, color: LINE });
  }
  c.page.drawRectangle({ x: M, y, width: W, height: rows.length * rowH + headH, borderColor: LINE, borderWidth: 0.6 });
  return y;
}

function colonneVuote(d: Diario): { cols: Col[]; rows: number } {
  if (d.slug === "pressione")
    return {
      rows: 7,
      cols: [
        { t: "Giorno", w: 11, sub: "data" },
        { t: "Mattina", w: 7, sub: "ora" },
        { t: "1ª misura", w: 11, sub: "max / min" },
        { t: "2ª misura", w: 11, sub: "max / min" },
        { t: "Sera", w: 7, sub: "ora" },
        { t: "1ª misura", w: 11, sub: "max / min" },
        { t: "2ª misura", w: 11, sub: "max / min" },
        { t: "Battiti", w: 8, sub: "se li vedi" },
        { t: "Note", w: 17, sub: "farmaci presi, malesseri" },
      ],
    };
  if (d.slug === "glicemia")
    return {
      rows: 14,
      cols: [
        { t: "Giorno", w: 10, sub: "data" },
        { t: "A digiuno", w: 9, sub: "mg/dL" },
        { t: "Prima pranzo", w: 9, sub: "mg/dL" },
        { t: "Dopo pranzo", w: 9, sub: "2 ore" },
        { t: "Prima cena", w: 9, sub: "mg/dL" },
        { t: "Dopo cena", w: 9, sub: "2 ore" },
        { t: "Prima di dormire", w: 9, sub: "mg/dL" },
        { t: "Note", w: 22, sub: "pasti, movimento, malesseri" },
      ],
    };
  if (d.slug === "sonno")
    return {
      rows: 14,
      cols: [
        { t: "Mattino del", w: 11, sub: "data" },
        { t: "A letto", w: 9, sub: "luce spenta" },
        { t: "Per addormentarti", w: 11, sub: "minuti" },
        { t: "Risvegli", w: 9, sub: "quante volte" },
        { t: "In piedi", w: 9, sub: "ora" },
        { t: "Com'è andata", w: 13, sub: "male · così così · bene" },
        { t: "Note", w: 28, sub: "pisolini, caffè, alcol, farmaci" },
      ],
    };
  if (d.slug === "peso")
    return {
      rows: 31,
      cols: [
        { t: "Giorno", w: 10 },
        { t: "Ora", w: 9 },
        { t: "Peso", w: 12, sub: "kg" },
        { t: "Note", w: 59, sub: "gonfiore, fiato corto, cambi nella cura" },
      ],
    };
  if (d.slug === "respiro")
    return {
      rows: 14,
      cols: [
        { t: "Giorno", w: 10, sub: "data" },
        { t: "Mattina", w: 9, sub: "ora" },
        { t: "Migliore dei 3", w: 12, sub: "L/min" },
        { t: "Sera", w: 9, sub: "ora" },
        { t: "Migliore dei 3", w: 12, sub: "L/min" },
        { t: "Spray al bisogno", w: 12, sub: "quante volte" },
        { t: "Note", w: 26, sub: "tosse, notte, raffreddore" },
      ],
    };
  return {
    rows: 31,
    cols: [
      { t: "Giorno", w: 7 },
      { t: "Mal di testa?", w: 12, sub: "no · L · M · F" },
      { t: "Inizio", w: 8, sub: "ora" },
      { t: "Durata", w: 8, sub: "ore" },
      { t: "Nausea, luce, rumori, vista", w: 16 },
      { t: "Preso per il dolore", w: 18, sub: "nome e ora" },
      { t: "Possibili fattori", w: 18, sub: "sonno, ciclo, stress, cibo" },
    ],
  };
}

/** Il diario vuoto da stampare: i cinque passi in alto, la griglia sotto, le fonti in fondo. */
export async function renderDiarioVuoto(d: Diario, opts: { fonts?: DiarioFonts | null; date?: Date } = {}): Promise<Uint8Array> {
  const date = opts.date ?? new Date();
  const c = await open(`Cura Privata — Diario: ${d.nome}`, "Diario da compilare a mano. Informativo, non diagnostico.", opts.fonts, date);
  let y = testata(c, "Diario da stampare", `${d.titolo} ${d.em.replace(/\.$/, "")}`, "Nome: ______________________");

  // Riga per chi e quando
  y = para(c, d.quando, M, y, W, { size: 9.5, font: c.bold, lead: 12.5 });
  y -= 6;

  // Cinque passi su due colonne
  etichetta(c, "Come misurare bene", M, y);
  y -= 14;
  const colW = (W - 16) / 2;
  const rowsY: number[] = [];
  let left = y;
  let right = y;
  d.passi.forEach((p, i) => {
    const isLeft = i % 2 === 0;
    const x = isLeft ? M : M + colW + 16;
    const yy = isLeft ? left : right;
    c.page.drawCircle({ x: x + 7, y: yy - 6, size: 7, color: MARKER });
    txt(c, String(i + 1), x + (i + 1 >= 10 ? 3 : 4.6), yy - 9.2, 8.5, c.bold, INK);
    let ny = para(c, p.titolo, x + 20, yy, colW - 20, { size: 8.8, font: c.bold, lead: 11 });
    ny = para(c, p.testo, x + 20, ny, colW - 20, { size: 8, color: MUTED, lead: 10, maxLines: 3 });
    ny -= 6;
    if (isLeft) left = ny;
    else right = ny;
    rowsY.push(ny);
  });
  y = Math.min(left, right) - 4;

  // Griglia
  const { cols, rows } = colonneVuote(d);
  etichetta(c, d.slug === "cefalea" || d.slug === "peso" ? "Mese di ____________" : d.slug === "pressione" ? "I 7 giorni prima della visita" : "Due settimane", M, y);
  y -= 14;
  const avail = y - 60 - 26;
  const rowH = Math.min(40, Math.floor(avail / rows));
  const empty = Array.from({ length: rows }, (_, i) => cols.map((_, j) => (j === 0 && (d.slug === "cefalea" || d.slug === "peso") ? String(i + 1) : "")));
  tabella(c, cols, empty, y, rowH);

  piede(c, `Diario di Cura Privata, costruito seguendo le indicazioni di: ${d.fonti.map((f) => f.ente).join("; ")}. Informativo, non diagnostico: le decisioni sulla cura spettano al medico. In emergenza chiama il 112. Bozza da far rivedere a un medico.`);
  return c.pdf.save();
}

/** Il foglio per il medico: una pagina, solo numeri, medie e date. */
export async function renderFoglioMedico(
  d: Diario,
  voci: VoceDiario[],
  opts: {
    persona: string;
    giorni: number;
    oggi: string;
    fonts?: DiarioFonts | null;
    date?: Date;
    /** 22/11/2026, sezione sonno: righe delle autovalutazioni scelte dalla persona (già scritte per il medico). */
    autovalutazioni?: string[];
  },
): Promise<Uint8Array> {
  const date = opts.date ?? new Date();
  const c = await open(`Cura Privata — Foglio per il medico: ${d.nome}`, "Valori scritti dalla persona; medie calcolate, senza valutazioni.", opts.fonts, date);
  const xs = ordina(periodo(voci.filter((v) => v.diario === d.slug), opts.giorni, opts.oggi));
  const dal = xs[0] ? dayOf(xs[0].at) : opts.oggi;
  let y = testata(c, `Foglio per il medico · ${opts.persona}`, `Diario: ${d.nome.toLowerCase()}`, `Preparato il ${date.toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric" })}`);

  y = para(c, `Periodo: dal ${dataIt(dal)} al ${dataIt(opts.oggi)} · ${xs.length} ${xs.length === 1 ? "voce" : "voci"}. I valori li ha scritti la persona, con il suo apparecchio; il sito ha calcolato le medie e non le valuta.`, M, y, W, { size: 9, color: MUTED, lead: 11.5 });
  y -= 8;

  // Riquadri del riepilogo (il sonno ne ha una seconda fila, dal 22/11/2026)
  const boxes: { t: string; v: string; s: string }[] = [];
  const boxes2: { t: string; v: string; s: string }[] = [];
  if (d.slug === "pressione") {
    const r = riepilogoPressione(voci, opts.giorni, opts.oggi);
    boxes.push(
      { t: "Media complessiva", v: r.totale ? `${r.totale.sys}/${r.totale.dia}` : "—", s: r.totale ? `${r.totale.n} misure${r.senzaPrimoGiorno ? ", senza il 1° giorno" : ""}` : "nessuna misura" },
      { t: "Media del mattino", v: r.mattina ? `${r.mattina.sys}/${r.mattina.dia}` : "—", s: r.mattina ? `${r.mattina.n} misure` : "nessuna misura" },
      { t: "Media della sera", v: r.sera ? `${r.sera.sys}/${r.sera.dia}` : "—", s: r.sera ? `${r.sera.n} misure` : "nessuna misura" },
      { t: "Battiti, media", v: r.bpm ? String(r.bpm) : "—", s: `${r.giorni} giorni con misure` },
    );
  } else if (d.slug === "glicemia") {
    const r = riepilogoGlicemia(voci, opts.giorni, opts.oggi);
    for (const s of r.perMomento.slice(0, 4)) boxes.push({ t: MOMENTI_GLICEMIA[s.momento], v: `${s.media}`, s: `media di ${s.n} · da ${s.min} a ${s.max} mg/dL` });
    if (!boxes.length) boxes.push({ t: "Misure", v: "0", s: "nessuna misura nel periodo" });
  } else if (d.slug === "sonno") {
    const r = riepilogoSonno(voci, opts.giorni, opts.oggi);
    boxes.push(
      { t: "Tempo a letto, media", v: r.aLettoMin !== null ? oreMinuti(r.aLettoMin) : "—", s: r.oraLetto ? `${r.notti} notti · in media dalle ${r.oraLetto} alle ${r.oraInPiedi}` : "nessuna notte" },
      { t: "Per addormentarsi, media", v: r.addormentarsiMin !== null ? `${r.addormentarsiMin} min` : "—", s: "stima della persona" },
      { t: "Risvegli, media", v: r.risvegli !== null ? String(r.risvegli).replace(".", ",") : "—", s: "per notte" },
      { t: "Com'è andata", v: `${r.perQualita.bene} bene`, s: `così così ${r.perQualita.cosi} · male ${r.perQualita.male}` },
    );
    boxes2.push(
      { t: "Sonno stimato, media", v: r.sonnoMin !== null ? oreMinuti(r.sonnoMin) : "—", s: `${r.nottiComplete} notti con tutti i numeri · svegli di notte ${r.svegliMin !== null ? `${r.svegliMin} min` : "—"}` },
      { t: "Efficienza del sonno", v: r.efficienza !== null ? `${r.efficienza}%` : "—", s: "sonno stimato / tempo a letto (Consensus Sleep Diary)" },
      { t: "Variabilità degli orari", v: r.variabilitaLetto !== null ? `± ${r.variabilitaLetto} min` : "—", s: r.variabilitaInPiedi !== null ? `a letto · in piedi ± ${r.variabilitaInPiedi} min (dev. standard)` : "servono almeno 4 notti" },
      { t: "Notti oltre 30 minuti", v: `${r.nottiAddormentarsiOltre30} · ${r.nottiSvegliOltre30}`, s: `per addormentarsi · svegli di notte${r.scartoFineSettimana !== null ? ` · fine sett. ${scartoBreve(r.scartoFineSettimana)}` : ""}` },
    );
  } else if (d.slug === "peso") {
    const r = riepilogoPeso(voci, opts.giorni, opts.oggi);
    boxes.push(
      { t: "Ultimo peso", v: r.ultimo !== null ? kgTesto(r.ultimo) : "—", s: r.al ? giornoBreve(r.al) : "nessuna misura" },
      { t: "Dal primo all'ultimo", v: r.differenza !== null && r.misure > 1 ? kgTesto(r.differenza, true) : "—", s: r.dal ? `primo: ${r.primo !== null ? kgTesto(r.primo) : ""}, ${giornoBreve(r.dal)}` : "" },
      { t: "In 3 giorni", v: r.in3Giorni !== null ? kgTesto(r.in3Giorni, true) : "—", s: "ultima misura rispetto a 3 giorni prima" },
      { t: "Media del periodo", v: r.media !== null ? kgTesto(r.media) : "—", s: `${r.misure} misure in ${r.giorni} giorni` },
    );
  } else if (d.slug === "respiro") {
    const r = riepilogoRespiro(voci, opts.giorni, opts.oggi);
    boxes.push(
      { t: "Media del mattino", v: r.mattina ? `${r.mattina.media}` : "—", s: r.mattina ? `${r.mattina.n} misure · L/min` : "nessuna misura" },
      { t: "Media della sera", v: r.sera ? `${r.sera.media}` : "—", s: r.sera ? `${r.sera.n} misure · L/min` : "nessuna misura" },
      { t: "Più alto · più basso", v: r.max !== null ? `${r.max} · ${r.min}` : "—", s: "L/min, nel periodo" },
      { t: "Spray al bisogno", v: `${r.giorniConSpray} giorni`, s: `${r.sprayTotale} volte in tutto` },
    );
  } else {
    const r = riepilogoCefalea(voci, opts.giorni, opts.oggi);
    boxes.push(
      { t: "Giorni con mal di testa", v: `${r.giorniConDolore}`, s: `su ${r.giorniPeriodo} giorni · ${r.giorniSegnati} giorni compilati` },
      { t: "Episodi", v: `${r.episodi}`, s: `lievi ${r.perIntensita.lieve} · medi ${r.perIntensita.media} · forti ${r.perIntensita.forte}` },
      { t: "Giorni con qualcosa per il dolore", v: `${r.giorniConFarmaco}`, s: "contati dal diario" },
      { t: "Durata media", v: r.durataMedia !== null ? durataTesto(r.durataMedia) : "—", s: "degli episodi con durata" },
    );
  }
  for (const fila of [boxes, boxes2]) {
    if (!fila.length) continue;
    const bw = (W - 10 * (fila.length - 1)) / fila.length;
    fila.forEach((b, i) => {
      const x = M + i * (bw + 10);
      c.page.drawRectangle({ x, y: y - 62, width: bw, height: 62, color: MIST });
      para(c, b.t, x + 8, y - 6, bw - 16, { size: 7.8, font: c.bold, color: SAGE_DEEP, lead: 9.5, maxLines: 2 });
      txt(c, b.v, x + 8, y - 42, 17, c.bold, INK);
      para(c, b.s, x + 8, y - 46, bw - 16, { size: 7, color: MUTED, lead: 8.5, maxLines: 2 });
    });
    y -= 72;
  }
  y -= 4;

  // Autovalutazioni fatte sul sito (solo se la persona le ha aggiunte)
  if (opts.autovalutazioni?.length) {
    etichetta(c, "Autovalutazioni fatte sul sito (questionari di orientamento, non validati)", M, y);
    y -= 13;
    for (const r of opts.autovalutazioni.slice(0, 4)) y = para(c, `• ${r}`, M, y, W, { size: 8.2, color: INK, lead: 10.5, maxLines: 2 }) - 2;
    y -= 8;
  }

  // Calendario del mal di testa
  if (d.slug === "cefalea") {
    const r = riepilogoCefalea(voci, opts.giorni, opts.oggi);
    etichetta(c, "Giorno per giorno", M, y);
    y -= 14;
    const n = r.calendario.length;
    const cw = Math.min(17, (W - (n - 1) * 1.5) / n);
    const TONE: Record<string, RGB> = { vuoto: WHITE, nessuno: SOFT, lieve: rgb(0.86, 0.83, 0.95), media: rgb(0.66, 0.6, 0.86), forte: rgb(0.33, 0.27, 0.54) };
    r.calendario.forEach((g, i) => {
      const x = M + i * (cw + 1.5);
      c.page.drawRectangle({ x, y: y - cw, width: cw, height: cw, color: TONE[g.stato], borderColor: LINE, borderWidth: 0.5 });
      if (g.farmaco) c.page.drawCircle({ x: x + cw / 2, y: y - cw - 4, size: 1.6, color: INK });
      if (i % 5 === 0) txt(c, g.day.slice(8), x, y - cw - 14, 6.5, c.sans, MUTED);
    });
    y -= cw + 20;
    txt(c, "Chiaro: lieve · medio: media · scuro: forte · grigio: nessun mal di testa · bianco: giorno non compilato · punto: preso qualcosa per il dolore", M, y - 7, 7, c.sans, MUTED);
    y -= 18;
  }

  // Le misure una per una
  etichetta(c, { pressione: "Le misure, giorno per giorno", glicemia: "Le misure, una per una", cefalea: "Gli episodi", sonno: "Le notti, una per una", peso: "Le misure, una per una", respiro: "Le misure, giorno per giorno" }[d.slug], M, y);
  y -= 14;
  const footY = 60;
  let cols: Col[];
  let rows: string[][];
  if (d.slug === "pressione") {
    const days = [...new Set(xs.map((x) => dayOf(x.at)))];
    cols = [
      { t: "Giorno", w: 13 },
      { t: "Mattina", w: 24, sub: "max/min · ora" },
      { t: "Sera", w: 24, sub: "max/min · ora" },
      { t: "Altre ore", w: 16 },
      { t: "Battiti", w: 8 },
      { t: "Note", w: 15 },
    ];
    rows = days.map((day) => {
      const v = xs.filter((x): x is Extract<VoceDiario, { diario: "pressione" }> => x.diario === "pressione" && dayOf(x.at) === day);
      const cell = (f: string) => v.filter((x) => fascia(x.at) === f).map((x) => `${x.dati.sys}/${x.dati.dia} (${x.at.slice(11)})`).join("  ");
      const b = v.map((x) => x.dati.bpm).filter((n): n is number => n !== null);
      return [giornoBreve(day), cell("mattina"), cell("sera"), cell("giorno"), b.length ? String(Math.round(b.reduce((a, n) => a + n, 0) / b.length)) : "", v.map((x) => x.note).filter(Boolean).join("; ")];
    });
  } else if (d.slug === "glicemia") {
    cols = [
      { t: "Giorno", w: 14 },
      { t: "Ora", w: 8 },
      { t: "Momento", w: 22 },
      { t: "mg/dL", w: 10 },
      { t: "Note", w: 46 },
    ];
    rows = xs.map((x) => (x.diario === "glicemia" ? [giornoBreve(dayOf(x.at)), x.at.slice(11), MOMENTI_GLICEMIA[x.dati.momento], String(x.dati.mgdl), x.note ?? ""] : []));
  } else if (d.slug === "sonno") {
    cols = [
      { t: "Mattino del", w: 11 },
      { t: "A letto", w: 7 },
      { t: "In piedi", w: 7 },
      { t: "Tempo a letto", w: 10 },
      { t: "Per addorm.", w: 9 },
      { t: "Risvegli", w: 9, sub: "volte · min" },
      { t: "Sveglio dalle", w: 8 },
      { t: "Sonno stim.", w: 12, sub: "efficienza" },
      { t: "Com'è andata", w: 9 },
      { t: "Note", w: 18 },
    ];
    rows = xs.map((x) => {
      if (x.diario !== "sonno") return [];
      const st = sonnoStimato(x.dati);
      const ris = [x.dati.risvegli !== null ? String(x.dati.risvegli) : "", x.dati.svegliMin != null ? `${x.dati.svegliMin}'` : ""].filter(Boolean).join(" · ");
      return [
        giornoBreve(dayOf(x.at)),
        x.dati.aLetto,
        x.dati.inPiedi,
        oreBrevi(minutiTra(x.dati.aLetto, x.dati.inPiedi)),
        x.dati.addormentarsiMin !== null ? `${x.dati.addormentarsiMin} min` : "",
        ris,
        x.dati.sveglia ?? "",
        st !== null ? `${oreBrevi(st)} · ${efficienzaNotte(x.dati)}%` : "",
        QUALITA_SONNO[x.dati.qualita],
        x.note ?? "",
      ];
    });
  } else if (d.slug === "peso") {
    cols = [
      { t: "Giorno", w: 14 },
      { t: "Ora", w: 8 },
      { t: "Peso", w: 12 },
      { t: "Rispetto alla misura prima", w: 18 },
      { t: "Note", w: 48 },
    ];
    rows = xs.map((x, i) => {
      if (x.diario !== "peso") return [];
      const p = xs[i - 1];
      const diff = p && p.diario === "peso" ? kgTesto(Math.round((x.dati.kg - p.dati.kg) * 10) / 10, true) : "";
      return [giornoBreve(dayOf(x.at)), x.at.slice(11), kgTesto(x.dati.kg), diff, x.note ?? ""];
    });
  } else if (d.slug === "respiro") {
    const days = [...new Set(xs.map((x) => dayOf(x.at)))];
    cols = [
      { t: "Giorno", w: 13 },
      { t: "Mattina", w: 18, sub: "L/min · ora" },
      { t: "Sera", w: 18, sub: "L/min · ora" },
      { t: "Altro momento", w: 15 },
      { t: "Spray al bisogno", w: 12 },
      { t: "Note", w: 24 },
    ];
    rows = days.map((day) => {
      const v = xs.filter((x): x is Extract<VoceDiario, { diario: "respiro" }> => x.diario === "respiro" && dayOf(x.at) === day);
      const cell = (m: string) => v.filter((x) => x.dati.momento === m).map((x) => `${x.dati.pef} (${x.at.slice(11)})`).join("  ");
      const spray = v.reduce((a, x) => a + (x.dati.spray ?? 0), 0);
      return [giornoBreve(day), cell("mattina"), cell("sera"), cell("altro"), spray ? `${spray} ${spray === 1 ? "volta" : "volte"}` : "", v.map((x) => x.note).filter(Boolean).join("; ")];
    });
  } else {
    cols = [
      { t: "Giorno", w: 13 },
      { t: "Inizio", w: 8 },
      { t: "Intensità", w: 10 },
      { t: "Durata", w: 10 },
      { t: "Insieme al dolore", w: 22 },
      { t: "Preso per il dolore", w: 17 },
      { t: "Note", w: 20 },
    ];
    rows = xs
      .filter((x) => x.diario === "cefalea" && x.dati.tipo === "episodio")
      .map((x) =>
        x.diario === "cefalea"
          ? [giornoBreve(dayOf(x.at)), x.at.slice(11), x.dati.intensita ? INTENSITA[x.dati.intensita] : "", x.dati.durataOre !== null ? durataTesto(x.dati.durataOre) : "", x.dati.sintomi.map((s) => SINTOMI[s]).join(", "), x.dati.farmaco ?? "", x.note ?? ""]
          : [],
      );
  }
  const rowH = d.slug === "pressione" || d.slug === "respiro" ? 22 : 17;
  const room = Math.max(1, Math.floor((y - footY - 26 - 60) / rowH));
  let hidden = 0;
  if (rows.length > room) {
    hidden = rows.length - room;
    rows = rows.slice(-room);
  }
  if (!rows.length) rows = [cols.map((_, j) => (j === 0 ? "Nessuna voce nel periodo" : ""))];
  y = tabella(c, cols, rows, y, rowH, { size: 8.2, headH: 24 });
  if (hidden) {
    y -= 4;
    txt(c, `Le ${hidden} voci più vecchie del periodo non stanno nella pagina: sono nell'area personale.`, M, y - 8, 7.5, c.sans, MUTED);
    y -= 12;
  }

  // Spazio per il medico
  y -= 10;
  const boxH = Math.max(36, Math.min(80, y - footY));
  c.page.drawRectangle({ x: M, y: y - boxH, width: W, height: boxH, borderColor: LINE, borderWidth: 0.8 });
  txt(c, "Note del medico", M + 8, y - 14, 8, c.bold, MUTED);

  piede(c, "Cura Privata registra i valori scritti dalla persona e ne calcola le medie: non li valuta e non dà indicazioni sulla cura. Le medie della pressione escludono il primo giorno quando i giorni sono almeno 4 (linee guida ESH). In emergenza: 112.");
  return c.pdf.save();
}

export function nomeFileVuoto(d: Pick<Diario, "slug">) {
  return `diario-${d.slug}-cura-privata.pdf`;
}
export function nomeFileFoglio(d: Pick<Diario, "slug">, oggi: string) {
  return `foglio-per-il-medico-${d.slug}-${oggi}.pdf`;
}

/** «4h50», per le celle strette della tabella del sonno. */
function oreBrevi(min: number): string {
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  return `${h}h${String(m).padStart(2, "0")}`;
}
