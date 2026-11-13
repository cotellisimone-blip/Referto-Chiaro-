import { GUIDES } from "@/content/guides";
import { GUIDE_CATEGORIES } from "@/content/guides/schema";
import { GLOSSARY } from "@/content/glossario";
import { MAIN_NAV, FOOTER_NAV, LEGAL_NAV, EXTRA_PAGES } from "@/components/site/nav";
import { puntoDiPartenzaEnabled } from "@/lib/feature-flags";

/**
 * Indice compatto per la ricerca del sito: guide, voci di glossario e pagine.
 * Niente testi lunghi, solo titolo, sinonimi e una riga di contesto: viaggia leggero fino al browser.
 * Modulo server-safe (nessun "use client"): la ricerca vera e propria è in `searchIndex`.
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

const PAGE_CONTEXT: Record<string, string> = {
  "/referti": "Capisci il tuo referto: valori e sigle in parole semplici",
  "/referti/esempio": "Guarda un referto di esempio, inventato",
  "/servizi": "Tutti i servizi e il loro stato reale",
  "/servizi/secondo-parere": "Uno specialista esamina i documenti, ne parlate in video, ricevi una sintesi scritta",
  "/servizi/parla-con-un-medico": "Videoconsulto con un medico, con i documenti già letti",
  "/servizi/visita-a-domicilio": "Un medico di medicina generale a casa tua, a Brescia città",
  "/prezzi": "I servizi a confronto, con prezzi e tempi",
  "/inizia": "Ti aiutiamo a scegliere il servizio adatto",
  "/punto-di-partenza": "Gratis: 10 aree da conoscere e una scheda da portare al medico",
  "/strumenti/preparati-alla-visita": "Gratis: cosa portare e cosa chiedere, in 2 minuti",
  "/servizi/archivio": "In preparazione",
  "/servizi/prevenzione": "In preparazione",
  "/strumenti/domande-per-il-medico": "Prepara la lista delle domande per la visita",
};

/** Parole con cui si cerca una pagina senza conoscerne il nome. */
const PAGE_ALIASES: Record<string, string[]> = {
  "/punto-di-partenza": ["check-up", "checkup", "prevenzione", "controlli", "da dove partire", "esami da fare", "scheda per il medico"],
};

export function buildSearchIndex(): SearchItem[] {
  const guides: SearchItem[] = GUIDES.map((g) => ({
    kind: "guida",
    title: g.examName,
    href: `/guide/${g.slug}`,
    context: GUIDE_CATEGORIES[g.category].title,
    aliases: [...g.aliases, g.title],
  }));
  const terms: SearchItem[] = GLOSSARY.map((e) => ({
    kind: "termine",
    title: e.term,
    href: `/glossario/${e.slug}`,
    context: shorten(e.definition, 110),
    aliases: e.aliases,
  }));
  const seen = new Set<string>();
  const pages: SearchItem[] = [];
  const add = (href: string, label: string, section: string) => {
    if (seen.has(href)) return;
    if (href === "/punto-di-partenza" && !puntoDiPartenzaEnabled()) return;
    seen.add(href);
    pages.push({ kind: "pagina", title: label, href, context: PAGE_CONTEXT[href] ?? section, aliases: PAGE_ALIASES[href] ?? [] });
  };
  add("/strumenti/domande-per-il-medico", "Domande per il medico", "Strumenti");
  for (const n of MAIN_NAV) add(n.href, n.label, "Cura Privata");
  for (const [section, links] of Object.entries(FOOTER_NAV)) for (const l of links) add(l.href, l.label, section);
  for (const l of [...EXTRA_PAGES, ...LEGAL_NAV]) add(l.href, l.label, "Cura Privata");
  return [...guides, ...terms, ...pages];
}

function shorten(s: string, max: number) {
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(" "), 40))}…`;
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
