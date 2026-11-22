import type { Blocco, SonnoArgomento, SonnoPagina, Autovalutazione } from "./schema";
import { NON_MI_ADDORMENTO, MI_SVEGLIO_DI_NOTTE, RUSSO_E_SONO_STANCO, LAVORO_A_TURNI, GAMBE_SENZA_RIPOSO } from "./problemi";
import { COME_FUNZIONA, CBT_I, FARMACI, APNEE, ESAME_DEL_SONNO, QUANDO_DAL_MEDICO } from "./spiegazioni";
import { PERCORSO } from "./percorso";
import { AUTOVALUTAZIONI } from "./autovalutazioni";

export type { SonnoPagina, SonnoArgomento, Autovalutazione, Blocco } from "./schema";
export { AUTOVALUTAZIONI } from "./autovalutazioni";

/** Le porte «per problema», nell'ordine in cui compaiono. */
export const SONNO_PROBLEMI: SonnoPagina[] = [NON_MI_ADDORMENTO, MI_SVEGLIO_DI_NOTTE, RUSSO_E_SONO_STANCO, LAVORO_A_TURNI, GAMBE_SENZA_RIPOSO];
/** Le pagine per capire, nell'ordine di lettura. */
export const SONNO_SPIEGAZIONI: SonnoPagina[] = [COME_FUNZIONA, CBT_I, FARMACI, APNEE, ESAME_DEL_SONNO, QUANDO_DAL_MEDICO];
export const SONNO_PERCORSO = PERCORSO;

export const SONNO_PAGINE: SonnoPagina[] = [...SONNO_PROBLEMI, PERCORSO, ...SONNO_SPIEGAZIONI];

export const sonnoHref = (slug: string) => `/malattie/sonno/${slug}`;

export function getSonnoPagina(slug: string): SonnoPagina | null {
  return SONNO_PAGINE.find((p) => p.slug === slug) ?? null;
}
export function getAutovalutazione(slug: string): Autovalutazione | null {
  return AUTOVALUTAZIONI.find((a) => a.slug === slug) ?? null;
}
export function getSonnoTitolo(slug: SonnoArgomento | string): string {
  return getSonnoPagina(slug)?.porta ?? getAutovalutazione(slug)?.porta ?? slug;
}

/** Tutti gli argomenti della sezione (pagine e autovalutazioni): servono a rotte, mappa del sito e controlli. */
export const SONNO_TUTTI: string[] = [...SONNO_PAGINE.map((p) => p.slug), ...AUTOVALUTAZIONI.map((a) => a.slug)];

function testoBlocco(b: Blocco): string[] {
  if ("p" in b) return [b.p];
  if ("punti" in b) return b.punti;
  if ("tabella" in b) return [...b.tabella.colonne, ...b.tabella.righe.flat(), b.nota ?? ""];
  if ("riquadro" in b) return [b.riquadro.titolo, b.riquadro.testo];
  if ("vai" in b) return [b.vai.titolo, b.vai.testo];
  return [];
}

/** Tutto il testo leggibile di una pagina della sezione sonno: per i controlli di linguaggio e per contare le parole. */
export function testoSonno(p: SonnoPagina): string {
  return [
    p.riga,
    p.metaDescription,
    p.titolo,
    p.em,
    ...p.inBreve,
    ...p.sezioni.flatMap((s) => [s.titolo, ...s.blocchi.flatMap(testoBlocco)]),
    ...(p.quandoChiamare ? [...p.quandoChiamare.subito, ...p.quandoChiamare.presto] : []),
    ...p.domande,
    ...p.faq.flatMap((f) => [f.d, f.r]),
  ].join("\n");
}

export function testoAutovalutazione(a: Autovalutazione): string {
  return [
    a.intro,
    a.metaDescription,
    a.titolo,
    a.em,
    a.ispirazione.nota,
    ...a.domande.flatMap((d) => [d.t, d.aiuto ?? "", ...d.opzioni.map((o) => o.l)]),
    ...a.fasce.flatMap((f) => [f.titolo, f.testo]),
    ...a.avvisi.flatMap((v) => [v.titolo, v.testo]),
  ].join("\n");
}

/** Testo della striscia in cima finché la pagina non è rivista (lo stesso delle malattie). */
export const SONNO_BOZZA = "Bozza in attesa di revisione medica. Questa pagina spiega, non visita: per la tua situazione parla con il tuo medico.";
