import type { Autovalutazione } from "@/content/sonno/schema";

/**
 * Calcolo delle autovalutazioni del sonno (22/11/2026). Somma delle risposte che contano nel punteggio, fascia a parole,
 * avvisi legati a una risposta. Tutto nel browser: le risposte non vanno a nessun server.
 *
 * Il risultato si può salvare SUL DISPOSITIVO (localStorage) solo se la persona lo chiede, per aggiungerlo al foglio per
 * il medico del diario del sonno. Si salvano la fascia e una riga, non le singole risposte.
 */

export type Risposte = Record<string, number | undefined>;

export interface Esito {
  punti: number;
  massimo: number;
  fascia: { titolo: string; testo: string };
  avvisi: { tono: "attenzione" | "nota"; titolo: string; testo: string }[];
  completo: boolean;
}

const conta = (d: Autovalutazione["domande"][number]) => d.contaNelPunteggio !== false;

export function calcolaEsito(a: Autovalutazione, r: Risposte): Esito {
  const valide = a.domande.filter(conta);
  const punti = valide.reduce((s, d) => s + (r[d.id] ?? 0), 0);
  const massimo = valide.reduce((s, d) => s + Math.max(...d.opzioni.map((o) => o.v)), 0);
  const fascia = a.fasce.find((f) => punti >= f.min && punti <= f.max) ?? a.fasce[a.fasce.length - 1];
  const avvisi = a.avvisi.filter((v) => (r[v.domanda] ?? -1) >= v.daValore).map(({ tono, titolo, testo }) => ({ tono, titolo, testo }));
  const completo = a.domande.every((d) => r[d.id] !== undefined);
  return { punti, massimo, fascia: { titolo: fascia.titolo, testo: fascia.testo }, avvisi, completo };
}

export interface RisultatoSalvato {
  slug: string;
  porta: string;
  fascia: string;
  punti: number;
  massimo: number;
  data: string;
  /** Avvisi scattati (solo il titolo). */
  avvisi: string[];
}

export const CHIAVE_RISULTATI = "cp-sonno-autovalutazioni";

/** Una riga per il foglio del medico: «Quanto pesa l'insonnia (22/11/2026): molti segnali, 12 su 15 · Da più di tre mesi». */
export function rigaPerIlMedico(x: RisultatoSalvato): string {
  const [a, m, g] = x.data.split("-");
  const extra = x.avvisi.length ? ` · ${x.avvisi.join(" · ")}` : "";
  return `${x.porta} (${g}/${m}/${a}): ${x.fascia.toLowerCase()}, ${x.punti} su ${x.massimo} con le domande di Cura Privata${extra}`;
}

function leggiTutti(): Record<string, RisultatoSalvato> {
  try {
    const raw = window.localStorage.getItem(CHIAVE_RISULTATI);
    const v = raw ? JSON.parse(raw) : {};
    return v && typeof v === "object" ? v : {};
  } catch {
    return {};
  }
}

export function leggiRisultati(): RisultatoSalvato[] {
  return Object.values(leggiTutti()).sort((a, b) => a.slug.localeCompare(b.slug));
}

export function salvaRisultato(x: RisultatoSalvato): boolean {
  try {
    const tutti = leggiTutti();
    tutti[x.slug] = x;
    window.localStorage.setItem(CHIAVE_RISULTATI, JSON.stringify(tutti));
    return true;
  } catch {
    return false;
  }
}

export function cancellaRisultati(): void {
  try {
    window.localStorage.removeItem(CHIAVE_RISULTATI);
  } catch {
    /* niente da fare */
  }
}
