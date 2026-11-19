import type { Metadata } from "next";
import { TemaPage, type TemaSezione } from "@/components/temi/tema";
import { PageLd } from "@/components/site/page-ld";

export const metadata: Metadata = {
  title: "Alimentazione, peso e forma",
  description: "Le basi di una sana alimentazione dalle linee guida pubbliche, e le schede in preparazione su diete, proteine e aminoacidi, recupero dopo lo sport.",
  alternates: { canonical: "/prevenzione/alimentazione" },
};

/**
 * Tessera «Alimentazione, peso e forma» della home «chiara e scura» (19/11/2026): «Diete, proteine e aminoacidi,
 * recupero». Le schede vere sono in preparazione e la pagina lo dice; intanto le basi delle linee guida pubbliche
 * (CREA, Organizzazione mondiale della sanità), nessuna dieta su misura, nessuna dose.
 */
const SEZIONI: TemaSezione[] = [
  {
    id: "basi",
    kicker: "Le basi",
    titolo: "Quello che vale per quasi tutti gli adulti",
    testo: "Sono le indicazioni generali delle linee guida italiane per una sana alimentazione e dell’Organizzazione mondiale della sanità. Se hai una condizione seguita da un medico, contano le sue indicazioni.",
    voci: [
      { titolo: "Varietà nel piatto", testo: "Verdura e frutta ogni giorno, legumi più volte a settimana, cereali meglio se integrali." },
      { titolo: "Meno sale e zuccheri aggiunti", testo: "Ci sono anche dove non si vedono, nei prodotti confezionati: l’etichetta aiuta a capire." },
      { titolo: "Acqua", testo: "È la bevanda di ogni giorno. Per l’alcol, meno se ne beve e meglio è." },
      { titolo: "Movimento", testo: "Per gli adulti, l’Organizzazione mondiale della sanità indica almeno 150 minuti a settimana di attività moderata, come camminare a passo svelto." },
    ],
  },
  {
    id: "diete",
    kicker: "Diete",
    titolo: "Prima di cominciare una dieta",
    testo: "Se una dieta toglie interi gruppi di alimenti, o promette molti chili in poche settimane, è meglio parlarne prima con il medico o con un dietista.",
    voci: [
      { titolo: "Peso e girovita", tag: "In preparazione", testo: "Che cosa dicono l’indice di massa corporea e la circonferenza della vita, e i loro limiti." },
      { titolo: "Le diete più note, in breve", tag: "In preparazione", testo: "Mediterranea, chetogenica, digiuno intermittente: che cosa sappiamo, e che cosa no." },
      { titolo: "Senza glutine, senza lattosio", testo: "Toglierli ha senso quando lo indica il medico. Per la celiachia, gli esami si fanno prima di togliere il glutine.", href: "/guide/esami-per-la-celiachia" },
    ],
  },
  {
    id: "proteine",
    kicker: "Proteine e aminoacidi",
    titolo: "Proteine, anche per chi fa sport",
    testo: "Di solito il cibo ne porta abbastanza; per alcune persone, come gli anziani o chi si allena molto, i bisogni cambiano. Prima di un integratore proteico chiedi al medico o al farmacista, soprattutto se hai problemi ai reni.",
    voci: [
      { titolo: "Dove si trovano", testo: "Legumi, pesce, uova, latte e latticini, carne, frutta secca, cereali." },
      { titolo: "Aminoacidi", tag: "In preparazione", testo: "Sono i mattoni delle proteine. La scheda sugli integratori di aminoacidi, con le prove a favore e quelle che mancano." },
      { titolo: "Prodotti per lo sport", tag: "In preparazione", testo: "Creatina, barrette, bevande: che cosa dicono gli studi, a chi possono servire, quando evitarli." },
    ],
  },
  {
    id: "recupero",
    kicker: "Recupero",
    titolo: "Il recupero dopo lo sport",
    testo: "Sonno, acqua e un pasto vario dopo l’allenamento: sono le basi su cui la ricerca è più d’accordo.",
    voci: [
      { titolo: "Sonno", testo: "Per la maggior parte degli adulti, almeno 7 ore a notte." },
      { titolo: "Acqua e sali", testo: "Dopo uno sforzo lungo, o al caldo, si perdono acqua e sali: si recuperano bevendo e mangiando." },
      { titolo: "Un dolore che non passa", testo: "Se dura, o peggiora, fallo vedere al medico." },
    ],
  },
  {
    id: "con-i-tuoi-esami",
    kicker: "Con i tuoi esami",
    titolo: "Quando il referto parla di alimentazione",
    testo: "Alcuni valori del referto dipendono anche da quello che mangi. La tua guida personale, inclusa nel report, li mette in fila per parlarne con il medico.",
    voci: [
      { titolo: "Colesterolo LDL", testo: "Il colesterolo che il medico guarda di più per il cuore e i vasi.", href: "/guide/colesterolo-ldl" },
      { titolo: "Glicemia", testo: "Lo zucchero nel sangue, di solito misurato a digiuno.", href: "/guide/glicemia" },
      { titolo: "La tua guida personale", tag: "Nel report", testo: "Costruita sui tuoi esami: per preparare il tuo piano insieme al medico o al farmacista.", href: "/lettura-referti#guida-personale", go: "Come funziona" },
    ],
  },
];

export default function AlimentazionePage() {
  return (
    <>
      <PageLd path="/prevenzione/alimentazione" meta={metadata} name="Alimentazione" trail={[{ name: "Prevenzione", path: "/prevenzione" }]} />
      <TemaPage
        tono="al"
        icona="al"
        kicker="Alimentazione, peso e forma"
        stato="In preparazione"
        titolo="Mangiare bene,"
        em="senza mode."
        lead="Diete, proteine e aminoacidi, recupero dopo lo sport: stiamo preparando le schede, scritte sulle linee guida pubbliche e riviste da un medico. Qui trovi già le basi."
        sezioni={SEZIONI}
        azioni={[
          { href: "/lettura-referti#guida-personale", label: "La tua guida personale", primary: true },
          { href: "/integratori", label: "Integratori, spiegati" },
          { href: "/guide", label: "Le guide agli esami" },
        ]}
      />
    </>
  );
}
