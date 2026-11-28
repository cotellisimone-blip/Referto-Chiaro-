import type { Metadata } from "next";
import { TemaPage, type TemaSezione } from "@/components/temi/tema";
import { PageLd } from "@/components/site/page-ld";

export const metadata: Metadata = {
  title: "Intestino: fibre, fermentati, probiotici",
  description: "Che cos’è il microbiota, che cosa dice la ricerca su fibre, fermentati e probiotici, e quali segnali portare al medico. Informazioni generali, senza promesse.",
  alternates: { canonical: "/prevenzione/intestino-e-microbiota" },
};

/**
 * Tessera «Intestino e microbiota» della home «chiara e scura» (19/11/2026). Il titolo è la frase prudente approvata da
 * Simone: «Equilibrio intestinale: fibre, fermentati, probiotici». Niente promesse sul microbiota (molti legami sono
 * osservati, non dimostrati), niente dosi, e i segnali per cui sentire il medico ben in vista.
 */
const SEZIONI: TemaSezione[] = [
  {
    id: "microbiota",
    kicker: "Il microbiota",
    titolo: "Un ecosistema che la ricerca studia da poco",
    testo: "Nell’intestino vivono moltissimi microrganismi: insieme formano il microbiota. Se ne sa sempre di più, e molte domande sono ancora aperte.",
    voci: [
      { titolo: "Che cos’è", testo: "L’insieme di batteri e altri microrganismi che vivono nell’intestino. Cambia da persona a persona, e nel corso della vita." },
      { titolo: "Che cosa lo cambia", testo: "Quello che mangi, alcuni farmaci come gli antibiotici, l’età, il sonno, il movimento." },
      { titolo: "Che cosa non sappiamo ancora", testo: "Molti legami tra microbiota e salute sono stati osservati, ma non ancora dimostrati. Diffida di chi promette risultati." },
    ],
  },
  {
    id: "a-tavola",
    kicker: "A tavola",
    titolo: "Fibre e cibi fermentati",
    testo: "Le linee guida italiane per una sana alimentazione mettono le fibre tra le basi di una dieta varia.",
    voci: [
      { titolo: "Fibre", testo: "Si trovano in verdura, frutta, legumi, cereali integrali e frutta secca." },
      { titolo: "Cibi fermentati", testo: "Yogurt, kefir e altri alimenti fermentati contengono microrganismi vivi. Gli studi sono interessanti, ma ancora limitati." },
      { titolo: "Acqua e movimento", testo: "Bere a sufficienza e muoversi ogni giorno aiutano anche la regolarità dell’intestino." },
    ],
  },
  {
    id: "probiotici",
    kicker: "Probiotici",
    titolo: "Probiotici: che cosa sono, e quando parlarne",
    testo: "Sono microrganismi vivi che si trovano in alcuni integratori e alimenti. Non sono tutti uguali: ogni ceppo ha i suoi studi.",
    voci: [
      { titolo: "Probiotici", testo: "Che cosa dice la ricerca, ceppo per ceppo, e quando chiedere al medico o al farmacista.", href: "/integratori/probiotici", go: "Leggi la scheda" },
      { titolo: "Prebiotici", testo: "Sono fibre che fanno da nutrimento ai batteri dell’intestino. Si trovano per esempio in cipolle, porri, asparagi." },
      { titolo: "Durante un antibiotico", testo: "Se ti chiedi se prendere un probiotico durante o dopo una terapia, chiedilo al medico o al farmacista: dipende dal farmaco e da te." },
    ],
  },
  {
    id: "segnali",
    kicker: "Quando sentire il medico",
    titolo: "Segnali da non rimandare",
    testo: "Se noti uno di questi segnali, parlane con il tuo medico senza aspettare.",
    voci: [
      { titolo: "Sangue nelle feci", testo: "Anche poco: parlane con il medico. Se invece le feci sono nere come catrame, o il sangue è abbondante, chiama subito il 112." },
      { titolo: "Cambiamenti che durano", testo: "Diarrea o stitichezza che vanno avanti per settimane, senza un motivo chiaro." },
      { titolo: "Dolore e peso", testo: "Un dolore alla pancia che non passa, o una perdita di peso senza volerlo." },
    ],
  },
  {
    id: "esami",
    kicker: "Gli esami dell’intestino",
    titolo: "Quando li chiede il medico",
    voci: [
      { titolo: "Sangue occulto nelle feci", tag: "Screening", testo: "L’esame dello screening del colon retto: gratuito, su invito, dai 50 anni.", href: "/guide/sangue-occulto-nelle-feci" },
      { titolo: "Calprotectina fecale", testo: "Un esame delle feci che il medico può chiedere per capire se c’è un’infiammazione dell’intestino.", href: "/guide/calprotectina-fecale" },
      { titolo: "Esami per la celiachia", testo: "Si fanno mentre si mangia ancora il glutine, non dopo averlo tolto: parlane prima con il medico.", href: "/guide/esami-per-la-celiachia" },
      { titolo: "Helicobacter pylori", testo: "Un batterio dello stomaco: come si cerca, e perché.", href: "/guide/helicobacter-pylori" },
      { titolo: "Colonscopia", testo: "Come si prepara, come si svolge e che cosa dice il referto.", href: "/guide/colonscopia" },
    ],
  },
];

export default function IntestinoPage() {
  return (
    <>
      <PageLd path="/prevenzione/intestino-e-microbiota" meta={metadata} name="Intestino e microbiota" trail={[{ name: "Prevenzione", path: "/prevenzione" }]} />
      <TemaPage
        tono="mi"
        icona="mi"
        kicker="Intestino e microbiota"
        titolo="Equilibrio intestinale:"
        em="fibre, fermentati, probiotici."
        lead="Che cos’è il microbiota, che cosa dice la ricerca su fibre, cibi fermentati e probiotici, e quali segnali portare al medico. Informazioni generali, senza promesse."
        sezioni={SEZIONI}
        azioni={[
          { href: "/integratori/probiotici", label: "La scheda sui probiotici", primary: true },
          { href: "/integratori", label: "Tutti gli integratori" },
          { href: "/prevenzione/screening", label: "Gli screening gratuiti" },
        ]}
      />
    </>
  );
}
