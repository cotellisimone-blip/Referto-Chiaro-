import { isDoctorPath, mediciEnabled } from "@/lib/medici";

/**
 * Navigazione Cura Privata: i servizi per primi (ciclo 1), poi prezzi e guide. 12/11/2026: entra la visita a domicilio;
 * «Parla con un medico» diventa «Videoconsulto». «Guide» si vede dai 1280 px in su (sotto resta nel menu, nel fondo
 * pagina e nella ricerca), così la testata non va a capo a 1024 px.
 */
export type NavIcon = "file" | "home" | "video" | "stethoscope" | "euro" | "book" | "users" | "tools" | "chart" | "laptop" | "pill" | "heart" | "activity" | "leaf" | "notebook" | "userCheck";

/**
 * 22/11/2026 (Simone, thread «Riorganizzare menu e percorso del paziente»): il menu segue il percorso del paziente in
 * cinque passi, numerati, con il quinto («Prenditi cura di te») segnato come il cuore del sito. Sotto, ciò che si
 * consulta (Malattie, Guide, Diari, Glossario), poi il referto da caricare e qualche pagina di servizio.
 * Prima (15–22/11) il menu era una fila di otto voci: Prevenzione, Lettura referti, Malattie, Medici, Guide,
 * Integratori, Prezzi, Strumenti gratuiti.
 */
export type PassoPercorso = { n: 1 | 2 | 3 | 4 | 5; href: string; label: string; short: string; desc: string; icon: NavIcon; cuore?: boolean };
export const PERCORSO: readonly PassoPercorso[] = [
  { n: 1, href: "/punto-di-partenza", label: "Inizia da te", short: "Inizia", desc: "Poche domande, gratis: la tua mappa", icon: "userCheck" },
  { n: 2, href: "/prevenzione", label: "Gli esami per te", short: "Esami", desc: "Gli esami da conoscere, per la tua età", icon: "heart" },
  { n: 3, href: "/lettura-referti", label: "Capisci il referto", short: "Referti", desc: "Il referto spiegato riga per riga", icon: "file" },
  { n: 4, href: "/medici", label: "Un medico", short: "Medico", desc: "In video, o un secondo parere", icon: "stethoscope" },
  { n: 5, href: "/prenditi-cura-di-te", label: "Prenditi cura di te", short: "Cura di te", desc: "Sonno, alimentazione, intestino, integratori", icon: "leaf", cuore: true },
];
/** Da consultare, gratis: non sono passi, ma ogni passo ci porta. */
export const CONSULTA: readonly { href: string; label: string; desc: string; icon: NavIcon }[] = [
  { href: "/malattie", label: "Malattie", desc: "10 aree spiegate", icon: "activity" },
  { href: "/guide", label: "Guide agli esami", desc: "Che cosa misura ogni esame", icon: "book" },
  { href: "/diari", label: "Diari della salute", desc: "Misura bene a casa", icon: "notebook" },
  { href: "/glossario", label: "Glossario", desc: "Le parole dei referti", icon: "tools" },
];
/** In fondo al menu del telefono: le pagine di servizio. */
export const MENU_FOOT: readonly { href: string; label: string }[] = [
  { href: "/strumenti", label: "Strumenti gratuiti" },
  { href: "/prezzi", label: "Prezzi" },
  { href: "/come-funziona", label: "Come funziona" },
  { href: "/domande-frequenti", label: "Domande frequenti" },
  { href: "/chi-siamo", label: "Chi siamo" },
];
/** Per la ricerca del sito e per chi cercava l'elenco piatto: i cinque passi e ciò che si consulta. */
export const MAIN_NAV: readonly { href: string; label: string }[] = [...PERCORSO.map((p) => ({ href: p.href, label: p.label })), ...CONSULTA.map((c) => ({ href: c.href, label: c.label }))];
/**
 * Azione principale della testata: il referto, che è la cosa che si fa subito.
 * 17/11/2026 (20 interventi, punto 2): «Carica un referto» porta al caricamento (chi non è entrato passa dall'accesso e
 * poi arriva lì), non a una pagina che lo descrive. In vetrina il caricamento è chiuso: porta alla sezione, che lo dice
 * e ha la lista d'attesa.
 */
export const CARICA_HREF = process.env.NEXT_PUBLIC_VETRINA === "true" ? "/lettura-referti" : "/area-personale/nuovo";
export const HEADER_CTA = { href: CARICA_HREF, label: "Carica un referto", menu: "Carica un referto" };

/** Fondo pagina snello: tre colonne, una dozzina di voci. Le note legali stanno nella riga in basso. */
const FOOTER_NAV_ALL = {
  "Il percorso": [
    { href: "/punto-di-partenza", label: "1 · Inizia da te" },
    { href: "/prevenzione", label: "2 · Gli esami per te" },
    { href: "/lettura-referti", label: "3 · Capisci il referto" },
    { href: "/medici", label: "4 · Un medico" },
    { href: "/prenditi-cura-di-te", label: "5 · Prenditi cura di te" },
    { href: "/famiglia", label: "Famiglia e salute nel tempo" },
    { href: "/prezzi", label: "Prezzi" },
  ],
  Gratis: [
    { href: "/prevenzione/esami-di-base", label: "Esami di base" },
    { href: "/prevenzione/screening", label: "Screening gratuiti" },
    { href: "/prenditi-cura-di-te/sonno", label: "Sonno" },
    { href: "/prevenzione/alimentazione", label: "Alimentazione" },
    { href: "/prevenzione/intestino-e-microbiota", label: "Intestino e microbiota" },
    { href: "/integratori", label: "Guide agli integratori" },
    { href: "/malattie", label: "Malattie spiegate" },
    { href: "/guide", label: "Guide agli esami" },
    { href: "/diari", label: "Diari della salute" },
    { href: "/glossario", label: "Glossario" },
    { href: "/strumenti", label: "Tutti gli strumenti gratuiti" },
  ],
  "Cura Privata": [
    { href: "/come-funziona", label: "Come funziona" },
    { href: "/cura-privata-o-un-ai-gratuita", label: "Perché non un’AI gratuita?" },
    { href: "/per-i-medici", label: "Per i medici" },
    { href: "/domande-frequenti", label: "Domande frequenti" },
    { href: "/chi-siamo", label: "Chi siamo" },
    { href: "/contatti", label: "Contatti" },
  ],
} as const;

type FooterLink = { href: string; label: string };
/** Con i medici spenti: via le loro pagine (la sezione «A domicilio» resta, con l'etichetta «In arrivo»). */
export const FOOTER_NAV: Record<string, readonly FooterLink[]> = mediciEnabled()
  ? FOOTER_NAV_ALL
  : Object.fromEntries(
      Object.entries(FOOTER_NAV_ALL).map(([k, links]) => {
        const kept: FooterLink[] = links.filter((l) => !isDoctorPath(l.href));
        return [k, kept];
      }),
    );

export const LEGAL_NAV = [
  { href: "/privacy-policy", label: "Privacy" },
  { href: "/cookie-policy", label: "Cookie" },
  { href: "/termini", label: "Termini" },
  { href: "/sicurezza-e-privacy", label: "Sicurezza" },
  { href: "/accessibilita", label: "Accessibilità" },
  { href: "/stato-del-progetto", label: "Stato del progetto" },
] as const;

/** Pagine che non stanno nel fondo pagina ma devono restare trovabili nella ricerca del sito. */
export const EXTRA_PAGES = [
  { href: "/referti/esempio", label: "Referto di esempio" },
  // 19/11/2026: le pagine delle tessere della home «chiara e scura».
  { href: "/vicino-a-te", label: "Vicino a te: medico di famiglia, CUP, guardia medica" },
  { href: "/strumenti/preparati-alla-visita", label: "Preparati alla visita" },
  { href: "/scaffale", label: "Lo Scaffale: i criteri per i partner" },
  { href: "/per-le-strutture", label: "Per le strutture" },
  { href: "/accedi", label: "Area personale" },
] as const;
