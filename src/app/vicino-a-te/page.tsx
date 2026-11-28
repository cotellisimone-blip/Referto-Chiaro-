import { ProssimoPasso } from "@/components/site/prossimo-passo";
import type { Metadata } from "next";
import { TemaPage, type TemaSezione } from "@/components/temi/tema";
import { PageLd } from "@/components/site/page-ld";

export const metadata: Metadata = {
  title: "Vicino a te: i servizi pubblici",
  description: "Medico di famiglia, CUP, Fascicolo sanitario, screening gratuiti, guardia medica pubblica: che cosa sono e come si usano. Gratis.",
  alternates: { canonical: "/vicino-a-te" },
};

/**
 * Tessera «Vicino a te» della home «chiara e scura» (19/11/2026): «Medico di famiglia, CUP, screening gratuiti,
 * guardia medica pubblica». Il servizio pubblico spiegato, gratis. Nomi, numeri e siti cambiano da Regione a Regione:
 * la pagina lo dice e non indica sportelli che non abbiamo verificato. La mappa dei servizi è in preparazione.
 */
const SEZIONI: TemaSezione[] = [
  {
    id: "medico-di-famiglia",
    kicker: "Il tuo medico",
    titolo: "Il medico di famiglia e il pediatra",
    testo: "Sono gratuiti, e sono il primo riferimento per la tua salute.",
    voci: [
      { titolo: "Medico di medicina generale", testo: "Lo scegli all’ATS o all’ASL, oppure online sul sito della tua Regione. Ti prescrive esami e visite con la ricetta del servizio sanitario." },
      { titolo: "Pediatra di libera scelta", testo: "Per bambini e ragazzi, di solito fino ai 14 anni." },
      { titolo: "Cambiare medico", testo: "Si può fare quando vuoi, tra i medici con posti liberi nella tua zona." },
    ],
  },
  {
    id: "prenotare",
    kicker: "Prenotare",
    titolo: "CUP, ricetta e Fascicolo sanitario",
    testo: "Con la ricetta del medico prenoti esami e visite del servizio sanitario.",
    voci: [
      { titolo: "CUP", testo: "Il Centro unico di prenotazione: per telefono, allo sportello, in farmacia o online. Ti serve la ricetta." },
      { titolo: "Le classi di priorità", testo: "Le lettere U, B, D e P sulla ricetta dicono entro quanto tempo va fatta la prestazione.", href: "/guide/leggere-la-ricetta-classi-di-priorita" },
      { titolo: "Fascicolo sanitario elettronico", testo: "Raccoglie referti, ricette e vaccinazioni. Ci entri con SPID, CIE o tessera sanitaria.", href: "/guide/fascicolo-sanitario-elettronico" },
    ],
  },
  {
    id: "screening",
    kicker: "Screening gratuiti",
    titolo: "Gli screening arrivano su invito",
    testo: "L’ATS o l’ASL ti scrive quando è il momento. Se l’invito non arriva, chiedi al medico o al centro screening della tua zona.",
    voci: [
      { titolo: "Seno, collo dell’utero, colon retto", testo: "Per chi sono, ogni quanto, e come funziona l’invito.", href: "/prevenzione/screening", go: "Gli screening" },
      { titolo: "Vaccinazioni per gli adulti", testo: "Alcune sono gratuite per età o per condizione: chiedi al medico o al centro vaccinale." },
    ],
  },
  {
    id: "urgenze",
    kicker: "Di notte, nei festivi, in emergenza",
    titolo: "Guardia medica, 116117 e 112",
    testo: "A chi rivolgerti quando il tuo medico non c’è.",
    voci: [
      { titolo: "112", tag: "Emergenza", testo: "Il numero unico per le emergenze. Gratuito, da qualunque telefono." },
      { titolo: "116117", tag: "Gratuito", testo: "La guardia medica pubblica: di notte, nel fine settimana e nei festivi. Dove il numero non è ancora attivo, trovi il recapito sul sito della tua ATS o ASL." },
      { titolo: "Farmacie di turno", testo: "Di notte e nei festivi c’è una farmacia di turno: l’elenco è esposto sulla porta di ogni farmacia e sul sito della tua Regione." },
      { titolo: "Consultori", testo: "Per la salute della donna, la gravidanza, la contraccezione e la famiglia. Gratuiti, spesso senza ricetta." },
    ],
  },
];

export default function VicinoATePage() {
  return (
    <>
      <PageLd path="/vicino-a-te" meta={metadata} name="Vicino a te" />
      <TemaPage
        tono="vi"
        icona="vi"
        kicker="Vicino a te"
        titolo="Il servizio pubblico,"
        em="vicino a te."
        lead="Medico di famiglia, CUP, screening gratuiti, guardia medica pubblica: che cosa sono e come si usano. Gratis, per tutti."
        bozzaTesto="Informazioni generali: nomi, numeri e siti cambiano da Regione a Regione. Per la tua zona guarda il sito della tua Regione e della tua ATS o ASL. La mappa dei servizi vicini è in preparazione."
        sezioni={SEZIONI}
        azioni={[
          { href: "/prevenzione/screening", label: "Gli screening gratuiti", primary: true },
          { href: "/guide/fascicolo-sanitario-elettronico", label: "Il Fascicolo sanitario" },
          { href: "/lettura-referti", label: "Ho già un referto" },
        ]}
      />
      <ProssimoPasso passo={2} />
    </>
  );
}
