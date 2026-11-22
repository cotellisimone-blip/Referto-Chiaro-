import type { Malattia, MalattiaSlug } from "./schema";
import { PRESSIONE_ALTA } from "./voci/pressione-alta";
import { DIABETE } from "./voci/diabete";
import { MAL_DI_TESTA } from "./voci/mal-di-testa";
import { SONNO } from "./voci/sonno";
import { PESO } from "./voci/peso";
import { ASMA } from "./voci/asma";
import { COLESTEROLO_ALTO } from "./voci/colesterolo-alto";
import { TIROIDE } from "./voci/tiroide";
import { ANEMIA } from "./voci/anemia";
import { FEGATO_GRASSO } from "./voci/fegato-grasso";

export type { Malattia, MalattiaSlug } from "./schema";

/**
 * Le dieci aree della sezione «Malattie» (22/11/2026). Le prime sei sono quelle dei diari, nello stesso ordine;
 * poi colesterolo, tiroide, anemia e fegato, che hanno già più guide agli esami nel sito.
 */
export const MALATTIE: Malattia[] = [PRESSIONE_ALTA, DIABETE, MAL_DI_TESTA, SONNO, PESO, ASMA, COLESTEROLO_ALTO, TIROIDE, ANEMIA, FEGATO_GRASSO];

export function getMalattia(slug: string): Malattia | null {
  return MALATTIE.find((m) => m.slug === slug) ?? null;
}

/** 22/11/2026: il sonno vive in «Prenditi cura di te» (passo 5); in Malattie resta la sua scheda, che porta lì. */
export const malattiaHref = (slug: MalattiaSlug) => (slug === "sonno" ? "/prenditi-cura-di-te/sonno" : `/malattie/${slug}`);

/** Le pagine di malattia che parlano di una guida agli esami: servono al rimando «Se vuoi capire la malattia». */
export function malattiePerGuida(guida: string): Malattia[] {
  return MALATTIE.filter((m) => m.esami.some((e) => e.guida === guida));
}

/** La pagina di malattia legata a un diario. */
export function malattiaPerDiario(diario: string): Malattia | null {
  return MALATTIE.find((m) => m.diario?.slug === diario) ?? null;
}

/** Tutto il testo leggibile di una pagina: per i controlli di linguaggio e per contare le parole. */
export function testoMalattia(m: Malattia): string {
  return [
    m.riga,
    m.metaDescription,
    m.titolo,
    m.em,
    ...m.inBreve,
    ...m.cheCose,
    ...(m.inNumeri ? [m.inNumeri.titolo, m.inNumeri.intro, ...m.inNumeri.righe.flatMap((r) => [r.etichetta, r.valore]), m.inNumeri.nota] : []),
    ...m.comeSiManifesta.testo,
    ...m.comeSiManifesta.segni,
    ...m.quandoChiamare.subito,
    ...m.quandoChiamare.presto,
    ...m.esami.map((e) => e.perche),
    m.esamiNota ?? "",
    ...m.ogniGiorno,
    m.diario?.testo ?? "",
    ...m.domande,
    ...m.faq.flatMap((f) => [f.d, f.r]),
  ].join("\n");
}

export const contaParole = (s: string) => s.split(/\s+/).filter((w) => /[a-zà-ù0-9]/i.test(w)).length;

/** Testo della striscia in cima finché la pagina non è rivista. */
export const MALATTIE_BOZZA =
  "Bozza in attesa di revisione medica. Questa pagina spiega, non visita: per la tua situazione parla con il tuo medico.";
