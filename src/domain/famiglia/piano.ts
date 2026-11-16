import { mediciEnabled } from "@/lib/medici";
import { formatEuro, priceCents } from "@/domain/offerta";

/**
 * «Cura Privata Famiglia» (13/11/2026): PROPOSTA di abbonamento, non un listino deciso.
 * Il titolare decide prezzo e contenuto; finché `PIANO_FAMIGLIA_STATO` è «proposta» le pagine lo dicono
 * accanto al prezzo e l'unica azione è «Avvisami quando parte». Nessun pagamento ricorrente è attivo.
 *
 * Idea: lo spazio personale (archivio, numeri nel tempo, promemoria per sé) resta gratuito, perché è ciò che fa
 * tornare. Si paga quando si segue qualcun altro e quando si vogliono le spiegazioni senza contare i referti.
 */
export const PIANO_FAMIGLIA_STATO: "proposta" | "attivo" = "proposta";
export const FAMIGLIA_YEAR_DEFAULT_CENTS = 3900;
/** Referti «Capisci» inclusi ogni anno per tutta la famiglia (uso ragionevole). */
export const FAMIGLIA_CAPISCI_INCLUSI = 24;
/** Sconto proposto su visita a domicilio e videoconsulto, in centesimi. */
export const FAMIGLIA_SCONTO_VISITA_CENTS = 1000;

type Env = Record<string, string | undefined>;

export function famigliaYearCents(env: Env = process.env): number {
  const raw = env.PRICE_FAMIGLIA_YEAR_CENTS?.trim();
  if (raw && /^\d{1,6}$/.test(raw) && Number(raw) <= 100_000)
    return Number(raw);
  return FAMIGLIA_YEAR_DEFAULT_CENTS;
}

export function famigliaPrice(env: Env = process.env) {
  const year = famigliaYearCents(env);
  const month = Math.round(year / 12);
  const capisci = priceCents("capisci", env);
  // Dal referto numero N in poi il piano costa meno che pagarli uno per uno.
  const breakEven = capisci > 0 ? Math.ceil(year / capisci) : null;
  return {
    amount: formatEuro(year),
    per: "l'anno",
    monthly: `circa ${formatEuro(month)} al mese`,
    discount: formatEuro(FAMIGLIA_SCONTO_VISITA_CENTS),
    breakEven,
    label: `${formatEuro(year)} l'anno`,
    proposal: PIANO_FAMIGLIA_STATO === "proposta",
  };
}

export const SPAZIO_GRATUITO = [
  "I tuoi referti in archivio, ordinati per data",
  "I tuoi numeri nel tempo, esame per esame",
  "Promemoria per le tue visite e i tuoi controlli",
] as const;

export function famigliaIncludes(env: Env = process.env): string[] {
  const p = famigliaPrice(env);
  return [
    "Fino a cinque familiari, ognuno con la sua scheda",
    "Numeri nel tempo e promemoria per tutta la famiglia",
    `«Capisci il tuo referto» incluso, fino a ${FAMIGLIA_CAPISCI_INCLUSI} referti l'anno`,
    "Il foglio per ogni visita, con domande e ultimi numeri",
    // Lo sconto sulle visite ha senso solo con i medici accesi (src/lib/medici.ts).
    ...(mediciEnabled() ? [`${p.discount} in meno su ogni visita a domicilio e videoconsulto`] : []),
  ];
}
