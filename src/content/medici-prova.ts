/**
 * I medici della sezione «A domicilio» in versione di PROVA (15/11/2026, richiesta di Simone: «metti già 2 o 3 medici
 * attivi, scrivendo che per ora è solo per prova»). Persone INVENTATE: nomi, numeri d'iscrizione (DEMO-…) e recapiti
 * non appartengono a nessuno. Mai foto: solo le iniziali. Gli id sono quelli dell'account dimostrativo
 * (src/domain/prestazioni/engine.ts), così le fasce libere mostrate sono le stesse che la richiesta propone.
 * Quando arriveranno i medici veri (verificati sull'Albo) questo elenco si sostituisce, non si ritocca.
 */
export interface MedicoProva {
  id: string;
  name: string;
  initials: string;
  role: string;
  ordine: string;
  /** Che cosa fa per Cura Privata. */
  services: ("domicilio" | "video" | "parere")[];
  zone: string;
  languages: string;
  /** Una frase scritta dal medico (di prova) su come lavora. */
  note: string;
  /** Colore dell'avatar, dalla tavolozza della home. */
  tone: "teal" | "clay" | "petrol";
}

export const MEDICI_PROVA: MedicoProva[] = [
  {
    id: "md-bianchi",
    name: "Dott.ssa Laura Bianchi",
    initials: "LB",
    role: "Medico di medicina generale",
    ordine: "OMCeO Brescia n. DEMO-0001",
    services: ["domicilio", "video"],
    zone: "Brescia città, tutti i CAP",
    languages: "Italiano, inglese",
    note: "Visito a casa soprattutto persone anziane e chi fa fatica a uscire. Lascio sempre un riepilogo scritto.",
    tone: "teal",
  },
  {
    id: "md-ferri",
    name: "Dott. Paolo Ferri",
    initials: "PF",
    role: "Medico di medicina generale",
    ordine: "OMCeO Brescia n. DEMO-0002",
    services: ["domicilio", "video"],
    zone: "Brescia città, tutti i CAP",
    languages: "Italiano, francese",
    note: "Di mattina a domicilio, la sera in video: così chi lavora trova un orario.",
    tone: "petrol",
  },
  {
    id: "md-conti",
    name: "Dott.ssa Giulia Conti",
    initials: "GC",
    role: "Specialista in cardiologia",
    ordine: "OMCeO Milano n. DEMO-0003",
    services: ["parere"],
    zone: "Su documenti e in video, da tutta Italia",
    languages: "Italiano, inglese",
    note: "Leggo i tuoi esami del cuore prima del colloquio e ti lascio una sintesi scritta.",
    tone: "clay",
  },
];

export const SERVIZIO_LABEL: Record<MedicoProva["services"][number], string> = {
  domicilio: "Visita a casa",
  video: "Videoconsulto",
  parere: "Secondo parere",
};
