import type { Metadata } from "next";
import { TemaPage, type TemaSezione } from "@/components/temi/tema";
import { PageLd } from "@/components/site/page-ld";

export const metadata: Metadata = {
  title: "Screening ed esami particolari",
  description: "I tre screening gratuiti del servizio sanitario (seno, collo dell’utero, colon retto): per chi e ogni quanto. E gli esami particolari da decidere con il medico.",
  alternates: { canonical: "/prevenzione/screening" },
};

/**
 * Tessera «Screening ed esami particolari» della home «chiara e scura» (19/11/2026). Età e intervalli sono quelli dei
 * programmi organizzati nazionali (mammografia ogni 2 anni 50–69, in alcune Regioni 45–74; Pap test ogni 3 anni a
 * 25–29 anni e test HPV ogni 5 anni a 30–64; sangue occulto ogni 2 anni 50–69, in alcune Regioni fino a 74).
 * In bozza: li rivede un medico prima della pubblicazione.
 */
const SEZIONI: TemaSezione[] = [
  {
    id: "programmi",
    kicker: "Screening organizzati",
    titolo: "I tre programmi gratuiti",
    testo: "L’invito ti arriva per lettera dall’ATS o dall’ASL della tua zona. Se non l’hai ricevuto, chiedi al tuo medico o al centro screening.",
    voci: [
      { titolo: "Mammografia", tag: "Ogni 2 anni", testo: "Per le donne dai 50 ai 69 anni. Alcune Regioni la offrono già dai 45 e fino ai 74.", href: "/guide/mammografia" },
      { titolo: "Pap test e test HPV", tag: "Ogni 3 o 5 anni", testo: "Per le donne dai 25 ai 64 anni: Pap test ogni 3 anni fino ai 29, poi test HPV ogni 5 anni.", href: "/guide/pap-test-e-hpv-test" },
      { titolo: "Sangue occulto nelle feci", tag: "Ogni 2 anni", testo: "Per donne e uomini dai 50 ai 69 anni, in alcune Regioni fino ai 74. In molte Regioni il kit si ritira in farmacia.", href: "/guide/sangue-occulto-nelle-feci" },
    ],
  },
  {
    id: "dopo-l-esame",
    kicker: "Dopo l’esame",
    titolo: "Se arriva un richiamo",
    testo: "Un richiamo non è una diagnosi: spesso serve solo un esame in più per chiarire.",
    voci: [
      { titolo: "Esito negativo", testo: "Ricevi una lettera, e il prossimo invito arriva alla scadenza." },
      { titolo: "Richiamo per approfondire", testo: "Ti propongono un esame in più, dentro lo stesso programma e senza pagare." },
      { titolo: "Il referto, in parole semplici", testo: "Puoi farlo spiegare e preparare le domande per il medico.", href: "/lettura-referti", go: "Lettura referti" },
    ],
  },
  {
    id: "esami-particolari",
    kicker: "Esami particolari",
    titolo: "Da decidere con il medico, caso per caso",
    testo: "Non sono screening per tutti: il medico li propone in base all’età, alla storia personale e familiare, ai sintomi.",
    voci: [
      { titolo: "PSA", testo: "Per gli uomini: un esame del sangue con vantaggi e limiti, da discutere prima di farlo.", href: "/guide/psa" },
      { titolo: "Densitometria ossea (MOC)", testo: "Misura la densità delle ossa. Il medico la chiede in alcune situazioni.", href: "/guide/moc-densitometria-ossea" },
      { titolo: "Colonscopia", testo: "Segue un sangue occulto positivo, oppure il medico la chiede in alcuni casi.", href: "/guide/colonscopia" },
      { titolo: "Un neo che cambia", testo: "Se un neo cambia forma, colore o dimensione, mostralo al medico." },
    ],
  },
];

export default function ScreeningPage() {
  return (
    <>
      <PageLd path="/prevenzione/screening" meta={metadata} name="Screening" trail={[{ name: "Prevenzione", path: "/prevenzione" }]} />
      <TemaPage
        tono="sc"
        icona="sc"
        kicker="Screening ed esami particolari"
        titolo="Gli screening gratuiti,"
        em="per chi e quando."
        lead="In Italia tre screening per i tumori sono gratuiti e arrivano su invito: seno, collo dell’utero, colon retto. Età e intervalli sono quelli dei programmi nazionali; alcune Regioni li allargano."
        sezioni={SEZIONI}
        azioni={[
          { href: "/punto-di-partenza", label: "Fai il primo controllo, gratis", primary: true },
          { href: "/vicino-a-te", label: "I servizi vicino a te" },
          { href: "/guide", label: "Le guide agli esami" },
        ]}
      />
    </>
  );
}
