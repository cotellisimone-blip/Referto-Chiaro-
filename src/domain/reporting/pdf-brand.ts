import { rgb, type PDFPage } from "pdf-lib";

/** Elementi grafici comuni ai PDF di Cura Privata (report e scheda Punto di Partenza). Nessuna dipendenza da Node. */
// Palette Cura Privata, coerente con i token del sito (src/app/globals.css). MARKER = menta chiara dietro testo scuro.
export const INK = rgb(0x15 / 255, 0x31 / 255, 0x3c / 255);
export const TEAL = rgb(0x00 / 255, 0x75 / 255, 0x6f / 255);
export const SAGE = rgb(0x00 / 255, 0x8f / 255, 0x87 / 255);
export const SAGE_DEEP = rgb(0x00 / 255, 0x75 / 255, 0x6f / 255);
export const MUTED = rgb(0x4f / 255, 0x67 / 255, 0x6e / 255);
export const LINE = rgb(0xdc / 255, 0xe9 / 255, 0xe7 / 255);
export const MIST = rgb(0xe8 / 255, 0xf4 / 255, 0xf1 / 255);
export const CREAM = rgb(0xf4 / 255, 0xf0 / 255, 0xe6 / 255);
export const WHITE = rgb(1, 1, 1);
export const PETROL = rgb(0x0c / 255, 0x33 / 255, 0x40 / 255);
export const MINT = rgb(0x7b / 255, 0xe0 / 255, 0xd2 / 255);
export const MARKER = rgb(0xcf / 255, 0xf3 / 255, 0xec / 255);

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

export function drawMark(page: PDFPage, x: number, y: number, scale: number, inverse = false) {
  // Simbolo Cura Privata (stessa geometria del logo SVG, viewBox 64): «C» aperta, curva interna, punto di menta.
  const outer = inverse ? WHITE : PETROL;
  const inner = inverse ? MINT : SAGE;
  page.drawSvgPath("M49.09 16.61A23 23 0 1 0 49.09 47.39", { x, y, scale, borderColor: outer, borderWidth: 8, borderLineCap: 1 });
  page.drawSvgPath("M31 20C39.5 20 44 26 44 32C44 38 39.5 44 31 44", { x, y, scale, borderColor: inner, borderWidth: 7, borderLineCap: 1 });
  page.drawCircle({ x: x + 31 * scale, y: y - 32 * scale, size: 3.6 * scale, color: MINT });
}

