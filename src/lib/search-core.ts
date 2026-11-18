/**
 * Parte «pura» della ricerca del sito: tipi, normalizzazione e punteggio. Non importa nessun contenuto.
 * Ciclo 5, fase 4: i componenti del browser importano da qui. Prima importavano da `search-index.ts`, che porta con sé
 * tutte le guide e il glossario: finivano nel JavaScript di ogni pagina, anche se l'indice arriva già dal server
 * alla prima apertura della ricerca.
 */
/** 17/11/2026 (20 interventi, punto 8): entrano le schede degli integratori. */
export type SearchKind = "guida" | "integratore" | "termine" | "pagina";

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
 * 18/11/2026 (secondo giro, punto 1): parole che chi ha un referto in mano aggiunge al nome dell'esame («glicemia
 * alta», «ferro basso», «valori del colesterolo»). Non cambiano che cosa si cerca: se la ricerca intera non trova
 * niente, si riprova senza. Il sito non dice se un valore è alto o basso: porta alla guida dell'esame.
 */
const QUALIFIERS = new Set([
  "alto", "alta", "alti", "alte", "basso", "bassa", "bassi", "basse", "elevato", "elevata", "elevati", "elevate", "aumentato", "aumentata", "aumentati",
  "diminuito", "diminuita", "diminuiti", "sballato", "sballata", "sballati", "fuori", "norma", "normale", "normali", "troppo", "poco", "molto",
  "valore", "valori", "esame", "esami", "analisi", "risultato", "risultati", "referto", "significa", "significato", "vuol", "dire", "cosa", "che", "cos",
  "il", "lo", "la", "i", "gli", "le", "un", "una", "di", "del", "dello", "della", "dei", "degli", "delle", "nel", "nella", "nei", "al", "alla", "e", "a", "per", "con", "mio", "mia", "miei", "ho", "e'",
]);

/** La ricerca senza le parole di contorno («glicemia alta» → «glicemia»). Vuota se resterebbe niente. */
export function stripQualifiers(query: string): string {
  return normalizeQuery(query)
    .split(" ")
    .filter((w) => w && !QUALIFIERS.has(w))
    .join(" ");
}

/** Distanza di modifica con scambio di lettere vicine («emocrmo» → «emocromo» vale 1), fermata oltre `max`. */
export function editDistance(a: string, b: string, max = 2): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev2: number[] = [];
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, prev2[j - 2] + 1);
      cur[j] = v;
      if (v < rowMin) rowMin = v;
    }
    if (rowMin > max) return max + 1;
    prev2 = prev;
    prev = cur;
  }
  return prev[b.length];
}

/** Quanti errori di battitura si perdonano: nessuno sulle sigle, uno sulle parole medie, due su quelle lunghe. */
function tolerance(word: string) {
  return word.length < 5 ? 0 : word.length < 8 ? 1 : 2;
}

export interface SearchOutcome {
  items: SearchItem[];
  /** "esatta": la ricerca così com'è. "senza-aggettivi": tolte parole come «alta» o «basso». "simile": corretto un errore di battitura. */
  mode: "esatta" | "senza-aggettivi" | "simile";
  /** Le parole effettivamente cercate, quando non sono quelle scritte. */
  used?: string;
}

/**
 * La ricerca che usa il sito: prima così com'è scritta; se non trova niente, senza gli aggettivi; se ancora niente,
 * perdonando gli errori di battitura. Dice quale strada ha preso, così la pagina può spiegarlo.
 */
export function searchSite(index: SearchItem[], query: string, limit = 12): SearchOutcome {
  const exact = searchIndex(index, query, limit);
  if (exact.length) return { items: exact, mode: "esatta" };
  const q = normalizeQuery(query);
  const kept = q.split(" ").filter((w) => w && !QUALIFIERS.has(w));
  const stripped = kept.join(" ");
  if (stripped && stripped !== q) {
    const again = searchIndex(index, stripped, limit);
    if (again.length) return { items: again, mode: "senza-aggettivi", used: stripped };
  }
  const words = (kept.length ? kept : q.split(" ")).filter((w) => tolerance(w) > 0);
  if (!words.length) return { items: [], mode: "esatta" };
  const scored: { item: SearchItem; score: number }[] = [];
  let best = "";
  let bestScore = -1;
  for (const item of index) {
    const vocab = new Set([...normalizeQuery(item.title).split(" "), ...item.aliases.flatMap((a) => normalizeQuery(a).split(" "))]);
    let total = 0;
    let matched = "";
    for (const w of words) {
      let d = 3;
      let hit = "";
      for (const v of vocab) {
        if (v.length < 5) continue; // le parole corte («test», «alto») somigliano a troppe cose
        // Si confronta anche con l'inizio della parola: «colestrolo» trova «colesterolo», «emocrom» trova «emocromo».
        // Solo per parole di almeno 6 lettere: con 5 «testa» (di «mal di testa») diventava «testosterone».
        const dist = Math.min(editDistance(w, v, tolerance(w)), w.length >= 6 && v.length > w.length ? editDistance(w, v.slice(0, w.length), tolerance(w)) : 3);
        if (dist < d) {
          d = dist;
          hit = v;
        }
      }
      if (d > tolerance(w)) {
        total = -1;
        break;
      }
      total += 10 - d * 3;
      matched = matched ? `${matched} ${hit}` : hit;
    }
    if (total < 0) continue;
    let score = total + (item.kind === "guida" ? 5 : item.kind === "pagina" ? -1 : 0);
    if (normalizeQuery(item.title).split(" ").some((t) => matched.split(" ").includes(t))) score += 4; // la parola è nel titolo, non solo in un sinonimo
    score -= Math.min(item.title.length, 60) / 100;
    scored.push({ item, score });
    if (score > bestScore) {
      bestScore = score;
      best = matched;
    }
  }
  const items = scored
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title, "it"))
    .slice(0, limit)
    .map((s) => s.item);
  return items.length ? { items, mode: "simile", used: best } : { items: [], mode: "esatta" };
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
