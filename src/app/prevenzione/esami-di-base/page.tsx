import { ProssimoPasso } from "@/components/site/prossimo-passo";
import type { Metadata } from "next";
import Link from "next/link";
import { TemaPage, type TemaSezione } from "@/components/temi/tema";
import { PageLd } from "@/components/site/page-ld";

export const metadata: Metadata = {
  title: "L’elenco degli esami di base",
  description: "Gli esami del sangue e delle urine che si chiedono più spesso in un controllo generale da adulti, spiegati in parole semplici. Quali fare lo decide il medico.",
  alternates: { canonical: "/prevenzione/esami-di-base" },
};

/**
 * Tessera 2 della home «chiara e scura» (19/11/2026): «L’elenco degli esami di base» (una delle quattro frasi prudenti
 * approvate da Simone). È un elenco generale per adulti, in bozza: lo rivede e lo firma un medico prima della
 * pubblicazione. Niente valori, niente «devi fare»: che cosa misura ciascun esame, e il rimando alla guida.
 */
const SEZIONI: TemaSezione[] = [
  {
    id: "sangue",
    kicker: "Esami del sangue",
    titolo: "Un prelievo, di solito al mattino",
    testo: "Per alcuni esami serve il digiuno: il laboratorio te lo dice quando prenoti.",
    voci: [
      { titolo: "Emocromo", testo: "Conta globuli rossi, globuli bianchi e piastrine. È tra gli esami più chiesti in un controllo generale.", href: "/guide/emocromo" },
      { titolo: "Glicemia", tag: "A digiuno", testo: "Lo zucchero nel sangue in quel momento.", href: "/guide/glicemia" },
      { titolo: "Colesterolo e trigliceridi", testo: "Colesterolo totale, HDL e LDL, trigliceridi: i grassi nel sangue, che il medico legge insieme.", href: "/guide/colesterolo-totale" },
      { titolo: "Creatinina ed eGFR", testo: "Due modi per guardare come lavorano i reni.", href: "/guide/creatinina" },
      { titolo: "Transaminasi (ALT e AST)", testo: "Enzimi che il medico guarda per farsi un’idea di come sta il fegato.", href: "/guide/transaminasi-alt-ast" },
      { titolo: "Emoglobina glicata", testo: "Racconta l’andamento della glicemia negli ultimi due o tre mesi. Il medico la chiede in alcune situazioni.", href: "/guide/emoglobina-glicata" },
    ],
  },
  {
    id: "urine",
    kicker: "Esame delle urine",
    titolo: "Un campione, raccolto a casa",
    testo: "Di solito la prima urina del mattino, in un contenitore sterile che trovi in farmacia.",
    voci: [
      { titolo: "Esame delle urine", testo: "Aspetto, chimica e sedimento: un esame semplice che dice molte cose al medico.", href: "/guide/esame-delle-urine" },
      { titolo: "Prima del prelievo", testo: "Digiuno, farmaci, acqua, attività fisica: come prepararti al prelievo e alla raccolta.", href: "/guide/prima-del-prelievo" },
    ],
  },
  {
    id: "su-indicazione",
    kicker: "Su indicazione del medico",
    titolo: "Esami che si aggiungono, quando servono",
    testo: "Non fanno parte di ogni controllo: il medico li chiede in base all’età, alla storia personale e familiare, ai sintomi.",
    voci: [
      { titolo: "TSH", testo: "L’ormone che regola la tiroide.", href: "/guide/tsh" },
      { titolo: "Ferritina", testo: "Le scorte di ferro dell’organismo.", href: "/guide/ferritina" },
      { titolo: "Vitamina D", testo: "Si misura in alcune situazioni particolari, non come esame per tutti.", href: "/guide/vitamina-d" },
      { titolo: "PSA", testo: "Per gli uomini, da decidere con il medico: ha vantaggi e limiti, e se ne parla prima.", href: "/guide/psa" },
    ],
  },
];

export default function EsamiDiBasePage() {
  return (
    <>
      <PageLd path="/prevenzione/esami-di-base" meta={metadata} name="Esami di base" trail={[{ name: "Prevenzione", path: "/prevenzione" }]} />
      <TemaPage
        tono="es"
        icona="es"
        kicker="Esami di base"
        titolo="L’elenco degli"
        em="esami di base."
        lead="Gli esami del sangue e delle urine che si chiedono più spesso in un controllo generale da adulti, con che cosa misura ciascuno. Quali fare, e ogni quanto, lo decide il tuo medico."
        sezioni={SEZIONI}
        dopo={
          <section className="ht-sec" aria-label="Ricetta e prezzi">
            <div className="ht-wrap">
              <div className="ht-nota" id="senza-ricetta">
                <p>
                  <b>* Senza ricetta.</b> In molti laboratori privati gli esami di base si fanno a pagamento anche senza ricetta. Con la ricetta del tuo medico, molti sono a carico del servizio sanitario, con il ticket quando è dovuto. Le regole cambiano da Regione a Regione: chiedi quando prenoti.
                </p>
                <p>
                  <b>Un elenco, non una prescrizione.</b> È in bozza e lo firma un medico prima della pubblicazione. Non vale per tutti allo stesso modo: portalo al tuo medico e decidete insieme. Quando hai i risultati, <Link href="/lettura-referti">li capisci in parole semplici</Link>.
                </p>
              </div>
            </div>
          </section>
        }
        azioni={[
          { href: "/lettura-referti", label: "Ho già un referto", primary: true },
          { href: "/punto-di-partenza", label: "Fai il primo controllo, gratis" },
          { href: "/guide", label: "Tutte le guide agli esami" },
        ]}
      />
      <ProssimoPasso passo={3} />
    </>
  );
}
