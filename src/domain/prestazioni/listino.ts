import { formatEuro, priceCents } from "@/domain/offerta";

/**
 * Le tre prestazioni con un medico (prompt «Medico a domicilio», 12/11/2026). Listino fisso:
 * visita a domicilio 149 €, videoconsulto con medico generalista 69 €, secondo parere specialistico 149 €.
 * I prezzi di video e secondo parere vengono da src/domain/offerta.ts (unica fonte); quello del domicilio da qui,
 * sovrascrivibile con PRICE_DOMICILIO_CENTS. Schede, pagine, richieste e riepiloghi leggono da questo file.
 */
export type PrestazioneKind = "domicilio" | "video" | "parere";

export const DOMICILIO_DEFAULT_CENTS = 14900;

type Env = Record<string, string | undefined>;

export function prestazioneCents(kind: PrestazioneKind, env: Env = process.env): number {
  if (kind === "video") return priceCents("parla-con-un-medico", env);
  if (kind === "parere") return priceCents("secondo-parere", env);
  const raw = env.PRICE_DOMICILIO_CENTS?.trim();
  if (raw && /^\d{1,6}$/.test(raw) && Number(raw) <= 100_000) return Number(raw);
  return DOMICILIO_DEFAULT_CENTS;
}

export interface PrestazioneInfo {
  kind: PrestazioneKind;
  /** Titolo che distingue i due servizi a 149 €. */
  title: string;
  short: string;
  /** Tipo di visita, in tre parole, per le schede. */
  mode: string;
  href: string;
  startHref: string;
  includes: string[];
  durationLabel: string;
}

export const PRESTAZIONI: Record<PrestazioneKind, PrestazioneInfo> = {
  domicilio: {
    kind: "domicilio",
    title: "Visita a domicilio con medico generalista",
    short: "Visita a domicilio",
    mode: "In presenza, a casa",
    href: "/servizi/visita-a-domicilio",
    startHref: "/richiedi/domicilio",
    includes: [
      "Un medico di medicina generale viene a casa tua o del tuo familiare",
      "Visita per esigenze non urgenti, di circa 45 minuti",
      "Un riepilogo scritto con il prossimo passo; se il medico lo ritiene, una prescrizione su ricetta bianca",
      "Prezzo fisso, comprensivo dello spostamento nell'area coperta",
    ],
    durationLabel: "circa 45 minuti a casa",
  },
  video: {
    kind: "video",
    title: "Videoconsulto con medico generalista",
    short: "Videoconsulto",
    mode: "In video, su appuntamento",
    href: "/servizi/parla-con-un-medico",
    startHref: "/richiedi/videoconsulto",
    includes: [
      "Circa 20–25 minuti in video con un medico di medicina generale",
      "Il medico legge prima i documenti che scegli tu",
      "Ti orienta sul prossimo passo e ti dice se serve una visita",
      "Un breve riepilogo scritto dopo il colloquio",
    ],
    durationLabel: "circa 20–25 minuti in video",
  },
  parere: {
    kind: "parere",
    title: "Secondo parere specialistico",
    short: "Secondo parere",
    mode: "Documenti, video e sintesi",
    href: "/servizi/secondo-parere",
    startHref: "/richiedi/secondo-parere",
    includes: [
      "Per un quesito clinico circoscritto, accettato dallo specialista",
      "Esame della documentazione pertinente",
      "Un videoconsulto con lo specialista",
      "Una sintesi scritta a cura dello specialista, nei tempi concordati",
    ],
    durationLabel: "documenti, video e sintesi scritta",
  },
};

export const PRESTAZIONI_ORDER: PrestazioneKind[] = ["domicilio", "video", "parere"];

export const prestazionePrice = (kind: PrestazioneKind, env: Env = process.env) => formatEuro(prestazioneCents(kind, env));

/** Numeri utili per la Lombardia, mostrati nel percorso domiciliare (fonte: Regione Lombardia). */
export const NUMERI_UTILI = {
  emergenza: "112",
  continuitaAssistenziale: "116117",
  testo: "Per le emergenze sanitarie chiama il 112. Per la continuità assistenziale pubblica chiama il 116117 negli orari previsti.",
} as const;
