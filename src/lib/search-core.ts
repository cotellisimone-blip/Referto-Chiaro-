/**
 * Parte «pura» della ricerca del sito: tipi, normalizzazione e punteggio. Non importa nessun contenuto.
 * Ciclo 5, fase 4: i componenti del browser importano da qui. Prima importavano da `search-index.ts`, che porta con sé
 * tutte le guide e il glossario: finivano nel JavaScript di ogni pagina, anche se l'indice arriva già dal server
 * alla prima apertura della ricerca.
 */
export type SearchKind = "guida" | "termine" | "pagina";

export interface SearchItem {
  kind: SearchKind;
  title: string;
  href: string;
  /** Riga di contesto: categoria della guida, inizio della definizione, sezione del sito. */
  context: string;
  /** Sinonimi e sigle con cui la persona potrebbe cercare. */
  aliases: string[];
}

/** Normalizza per il confronto: minuscolo, senza accenti, senza punteggiatura. */
export function normalizeQuery(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9%\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Ricerca con punteggio: titolo che inizia con la query > sinonimo che inizia > contiene nel titolo > contiene nei sinonimi > contiene nel contesto.
 * Le guide pesano un po' di più dei termini a parità di corrispondenza; le pagine un po' meno.
 */
export function searchIndex(index: SearchItem[], query: string, limit = 12): SearchItem[] {
  const q = normalizeQuery(query);
  if (q.length < 1) return [];
  const words = q.split(" ");
  const scored: { item: SearchItem; score: number }[] = [];
  for (const item of index) {
    const title = normalizeQuery(item.title);
    const aliases = item.aliases.map(normalizeQuery);
    const context = normalizeQuery(item.context);
    let score = 0;
    if (title === q) score = 100;
    else if (title.startsWith(q)) score = 80;
    else if (aliases.some((a) => a === q)) score = 75;
    else if (aliases.some((a) => a.startsWith(q))) score = 60;
    else if (title.split(" ").some((w) => w.startsWith(q))) score = 55;
    else if (words.every((w) => title.includes(w))) score = 40;
    else if (words.every((w) => aliases.some((a) => a.includes(w)))) score = 30;
    else if (q.length >= 3 && words.every((w) => context.includes(w))) score = 12;
    if (!score) continue;
    if (item.kind === "guida") score += 25; // la guida è più ricca della voce di glossario: a parità vince
    if (item.kind === "pagina") score -= 2;
    // A parità, i titoli brevi (sigle) vincono: chi scrive «tsh» vuole TSH, non «Anticorpi anti-TSH».
    score -= Math.min(title.length, 60) / 100;
    scored.push({ item, score });
  }
  return scored
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title, "it"))
    .slice(0, limit)
    .map((s) => s.item);
}
