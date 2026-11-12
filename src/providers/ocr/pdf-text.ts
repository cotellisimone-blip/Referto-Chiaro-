import { extractTextItems } from "unpdf";

export interface SourceLine {
  page: number;
  line: number;
  text: string;
}

/**
 * Testo di un PDF «digitale» (con livello di testo), riga per riga, senza alcun modello AI:
 * è la lettura più fedele possibile perché i caratteri sono quelli scritti dal laboratorio.
 * Gli elementi con la stessa coordinata verticale formano una riga; colonne lontane sono separate da 3 spazi.
 */
export async function pdfTextLines(bytes: Uint8Array): Promise<{ pageCount: number; lines: SourceLine[] }> {
  const { totalPages, items } = await extractTextItems(new Uint8Array(bytes));
  const lines: SourceLine[] = [];
  items.forEach((pageItems, p) => {
    const rows: { y: number; parts: { x: number; w: number; s: string; h: number }[] }[] = [];
    for (const it of pageItems) {
      if (!it.str || !it.str.trim()) continue;
      const tol = Math.max(2, (it.height || it.fontSize || 10) * 0.4);
      let row = rows.find((r) => Math.abs(r.y - it.y) <= tol);
      if (!row) rows.push((row = { y: it.y, parts: [] }));
      row.parts.push({ x: it.x, w: it.width, s: it.str, h: it.fontSize || it.height || 10 });
    }
    rows.sort((a, b) => b.y - a.y);
    let n = 0;
    for (const r of rows) {
      r.parts.sort((a, b) => a.x - b.x);
      let text = "";
      let end = -Infinity;
      for (const part of r.parts) {
        if (text) {
          const gap = part.x - end;
          text += gap > part.h * 1.2 ? "   " : gap > part.h * 0.15 ? " " : "";
        }
        text += part.s;
        end = part.x + part.w;
      }
      text = text.replace(/\s+$/g, "");
      if (text.trim()) lines.push({ page: p + 1, line: ++n, text });
    }
  });
  return { pageCount: Math.max(1, totalPages), lines };
}

/** Un PDF ha un livello di testo utile se contiene abbastanza righe con cifre. */
export function hasUsefulText(lines: SourceLine[]): boolean {
  return lines.filter((l) => /\d/.test(l.text) && /[a-zA-Z]{3,}/.test(l.text)).length >= 3;
}
