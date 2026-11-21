import { GUIDES } from "@/content/guides";
import { GUIDE_CATEGORIES } from "@/content/guides/schema";
import { GLOSSARY } from "@/content/glossario";
import { INTEGRATORI, INTEGRATORI_GROUPS } from "@/content/integratori";
import { MAIN_NAV, FOOTER_NAV, LEGAL_NAV, EXTRA_PAGES } from "@/components/site/nav";
import { puntoDiPartenzaEnabled } from "@/lib/feature-flags";
import { isDoctorPath, mediciEnabled } from "@/lib/medici";

/**
 * Indice compatto per la ricerca del sito: guide, schede degli integratori, voci di glossario e pagine.
 * Niente testi lunghi, solo titolo, sinonimi e una riga di contesto: viaggia leggero fino al browser.
 * Modulo server-safe (nessun "use client"): la ricerca vera e propria è in `searchIndex`.
 */
export type { SearchItem, SearchKind } from "./search-core";
export { normalizeQuery, searchIndex, searchSite } from "./search-core";
import type { SearchItem } from "./search-core";

const PAGE_CONTEXT: Record<string, string> = {
  "/prevenzione": "Sezione 1, gratis: quali controlli conoscere, guide agli esami e agli integratori, promemoria",
  "/lettura-referti": "Sezione 2: il tuo referto spiegato riga per riga, in parole semplici",
  "/medici": mediciEnabled() ? "Sezione 3: videoconsulto, visita a casa e secondo parere" : "Sezione 3, in arrivo: videoconsulto, visita a casa e secondo parere. Lista d'attesa",
  "/guide": "Che cosa misura un esame e come si legge, con le fonti",
  "/integratori": "Che cosa sono, quale esame li riguarda e che cosa chiedere al medico",
  "/referti/esempio": "Guarda un referto di esempio, inventato",
  "/servizi/secondo-parere": "Uno specialista esamina i documenti, ne parlate in video, ricevi una sintesi scritta",
  "/servizi/parla-con-un-medico": "Videoconsulto con un medico, con i documenti già letti",
  "/servizi/visita-a-domicilio": "Un medico di medicina generale a casa tua, a Brescia città",
  "/prezzi": "Quanto costa far spiegare un referto e che cosa è gratis",
  "/inizia": "Ti aiutiamo a scegliere da dove cominciare",
  "/punto-di-partenza": "Gratis: 10 aree da conoscere e una scheda da portare al medico",
  "/strumenti/preparati-alla-visita": "Gratis: cosa portare e cosa chiedere, in 2 minuti",
  "/famiglia": "I referti di tutta la famiglia, i numeri nel tempo, i promemoria",
  "/strumenti/domande-per-il-medico": "Prepara la lista delle domande per la visita",
  "/diari": "Gratis: pressione, glicemia, mal di testa. Come misurare bene e il diario da stampare",
};

/** Parole con cui si cerca una pagina senza conoscerne il nome. */
const PAGE_ALIASES: Record<string, string[]> = {
  "/famiglia": ["famiglia", "genitore", "mamma", "papà", "andamento", "nel tempo", "storico", "promemoria", "archivio"],
  "/punto-di-partenza": ["check-up", "checkup", "controlli", "da dove partire", "esami da fare", "scheda per il medico"],
  "/prevenzione": ["prevenzione", "prevenire", "controlli periodici", "esami da fare"],
  "/lettura-referti": ["referto", "referti", "analisi", "esami del sangue", "caricare", "carica", "capisci il tuo referto", "spiegazione"],
  "/medici": ["medico", "medici", "visita a domicilio", "visita a casa", "videoconsulto", "secondo parere", "dottore", "dottoressa", "visita", "specialista"],
  "/integratori": ["integratori", "integratore", "vitamine", "supplementi"],
  "/prezzi": ["costo", "costa", "quanto costa", "tariffe", "pagare", "prezzo", "listino", "pagamento", "abbonamento", "gratis"],
  "/accedi": ["accedi", "accesso", "entra", "login", "account", "registrazione", "registrarsi", "password"],
  "/sicurezza-e-privacy": ["cancellare account", "eliminare account", "cancellare i dati", "eliminare i dati", "sicurezza", "dati personali", "chi vede i miei dati"],
  "/referti/esempio": ["esempio", "prova", "demo", "pdf", "report"],
  "/contatti": ["assistenza", "aiuto", "email", "telefono", "scrivere"],
  "/strumenti": ["strumenti", "strumenti gratuiti", "gratis"],
  "/diari": ["diario", "diari", "pressione", "misurare la pressione", "pressione a casa", "ipertensione", "glicemia a casa", "glucometro", "diabete", "mal di testa", "cefalea", "emicrania", "diario pressorio"],
  "/glossario": ["glossario", "sigle", "parole", "dizionario", "significato"],
};

/**
 * 18/11/2026 (secondo giro, punto 1): parole di tutti i giorni che portano alla guida dell'esame. Non sono diagnosi:
 * chi scrive «diabete» o «anemia» cerca gli esami di cui ha sentito parlare, e la guida spiega che cosa misurano.
 */
const GUIDE_TOPICS: Record<string, string[]> = {
  glicemia: ["diabete", "zucchero", "zuccheri", "glucosio"],
  "emoglobina-glicata": ["diabete", "glicata", "zucchero"],
  "curva-da-carico-di-glucosio": ["diabete", "curva glicemica"],
  emocromo: ["anemia", "esami del sangue", "analisi del sangue", "sangue"],
  emoglobina: ["anemia"],
  ferritina: ["anemia", "ferro", "carenza di ferro"],
  sideremia: ["ferro", "carenza di ferro"],
  "transferrina-e-saturazione": ["ferro"],
  "colesterolo-ldl": ["colesterolo cattivo"],
  "colesterolo-hdl": ["colesterolo buono"],
  trigliceridi: ["grassi nel sangue"],
  "globuli-bianchi-e-formula-leucocitaria": ["globuli bianchi", "leucociti", "infezione"],
  "globuli-rossi": ["globuli rossi", "eritrociti"],
  "transaminasi-alt-ast": ["fegato"],
  "gamma-gt": ["fegato"],
  creatinina: ["reni", "rene"],
  "egfr-filtrato-glomerulare": ["reni", "filtrato"],
  "azotemia-urea": ["reni"],
  tsh: ["tiroide"],
  "ft4-tiroxina-libera": ["tiroide"],
  "ft3-triiodotironina-libera": ["tiroide"],
  "pcr-proteina-c-reattiva": ["infiammazione"],
  ves: ["infiammazione"],
  "esame-delle-urine": ["urine", "pipì"],
  psa: ["prostata"],
  "pt-inr": ["coagulazione"],
  "acido-urico": ["gotta", "uricemia"],
  "holter-pressorio": ["pressione"],
  "elettrocardiogramma-ecg": ["cuore", "ecg"],
  "moc-densitometria-ossea": ["osteoporosi", "ossa"],
};

export function buildSearchIndex(): SearchItem[] {
  const guides: SearchItem[] = GUIDES.map((g) => ({
    kind: "guida",
    title: g.examName,
    href: `/guide/${g.slug}`,
    context: GUIDE_CATEGORIES[g.category].title,
    aliases: [...g.aliases, g.title, ...(GUIDE_TOPICS[g.slug] ?? [])],
  }));
  const terms: SearchItem[] = GLOSSARY.map((e) => ({
    kind: "termine",
    title: e.term,
    href: `/glossario/${e.slug}`,
    context: shorten(e.definition, 110),
    aliases: e.aliases,
  }));
  // 17/11/2026 (punto 8): le schede degli integratori si trovano per nome e per sinonimo («colecalciferolo», «D3»).
  const supplements: SearchItem[] = INTEGRATORI.map((i) => ({
    kind: "integratore",
    title: i.name,
    href: `/integratori/${i.slug}`,
    context: `${INTEGRATORI_GROUPS[i.group]} · ${shorten(i.oneLine, 90)}`,
    aliases: i.aka,
  }));
  const seen = new Set<string>();
  const pages: SearchItem[] = [];
  const add = (href: string, label: string, section: string) => {
    if (seen.has(href)) return;
    if (href === "/punto-di-partenza" && !puntoDiPartenzaEnabled()) return;
    if (!mediciEnabled() && isDoctorPath(href)) return;
    seen.add(href);
    pages.push({ kind: "pagina", title: label, href, context: PAGE_CONTEXT[href] ?? section, aliases: PAGE_ALIASES[href] ?? [] });
  };
  add("/strumenti/domande-per-il-medico", "Domande per il medico", "Strumenti");
  for (const n of MAIN_NAV) add(n.href, n.label, "Cura Privata");
  for (const [section, links] of Object.entries(FOOTER_NAV)) for (const l of links) add(l.href, l.label, section);
  for (const l of [...EXTRA_PAGES, ...LEGAL_NAV]) add(l.href, l.label, "Cura Privata");
  add("/strumenti", "Strumenti gratuiti", "Gratis");
  add("/glossario", "Glossario", "Gratis");
  return [...guides, ...supplements, ...terms, ...pages];
}

function shorten(s: string, max: number) {
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(" "), 40))}…`;
}
