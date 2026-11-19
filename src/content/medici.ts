/**
 * I medici di Cura Privata (19/11/2026, Simone: «ne abbiamo 3, Sara e Elena e Riccardo, tutti a Brescia, tutti medici
 * generali»). Persone VERE: qui si scrive solo quello che Simone ha detto. Tutto il resto resta `null` e sul sito
 * compare come «da completare» (data-segnaposto), come per i dati del titolare. Non si indovina niente:
 * - il titolo (Dott. o Dott.ssa) lo scrive Simone: non si ricava dal nome;
 * - cognome e iscrizione all'Ordine servono prima di andare online (le schede si verificano sull'Albo);
 * - mai fotografie di medici (scelta del titolare): solo l'iniziale.
 * Che cosa fanno: sono medici di medicina generale, quindi videoconsulto e visita a casa (Brescia città). Zona e
 * giorni di ciascuno sono da confermare con Simone. Il secondo parere chiede uno specialista: per ora è «In arrivo».
 *
 * Le prenotazioni della versione dimostrativa usano ancora i profili dimostrativi (src/domain/prestazioni/engine.ts):
 * sono simulazioni, e un nome vero non va mai dentro una visita inventata.
 */
export interface Medico {
  id: string;
  nome: string;
  cognome: string | null;
  /** «Dott.» o «Dott.ssa»: solo quando lo dice Simone. */
  titolo: string | null;
  ruolo: string;
  citta: string;
  /** Iscrizione verificata sull'Albo: Ordine provinciale e numero. */
  ordine: string | null;
  servizi: ("domicilio" | "video")[];
  /** Zona e giorni, quando li conferma Simone. */
  zona: string | null;
  tone: "teal" | "clay" | "petrol";
}

export const MEDICI: Medico[] = [
  { id: "sara", nome: "Sara", cognome: null, titolo: null, ruolo: "Medico di medicina generale", citta: "Brescia", ordine: null, servizi: ["domicilio", "video"], zona: null, tone: "teal" },
  { id: "elena", nome: "Elena", cognome: null, titolo: null, ruolo: "Medico di medicina generale", citta: "Brescia", ordine: null, servizi: ["domicilio", "video"], zona: null, tone: "clay" },
  { id: "riccardo", nome: "Riccardo", cognome: null, titolo: null, ruolo: "Medico di medicina generale", citta: "Brescia", ordine: null, servizi: ["domicilio", "video"], zona: null, tone: "petrol" },
];

export function nomeMedico(m: Medico): string {
  return [m.titolo, m.nome, m.cognome].filter(Boolean).join(" ");
}

export function inizialiMedico(m: Medico): string {
  return (m.nome[0] + (m.cognome?.[0] ?? "")).toUpperCase();
}

/** Che cosa manca a una scheda prima di andare online. Vuoto = scheda completa. */
export function datiMancanti(m: Medico): string[] {
  const out: string[] = [];
  if (!m.titolo || !m.cognome) out.push("titolo e cognome");
  if (!m.ordine) out.push("iscrizione all’Ordine");
  if (!m.zona) out.push("zona e giorni");
  return out;
}

/** «Sara, Elena e Riccardo». */
export function nomiMedici(list: Medico[] = MEDICI): string {
  const n = list.map((m) => m.nome);
  return n.length > 1 ? `${n.slice(0, -1).join(", ")} e ${n[n.length - 1]}` : (n[0] ?? "");
}
