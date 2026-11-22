import type { Metadata } from "next";
import { TemaPage, type TemaSezione } from "@/components/temi/tema";
import { PageLd } from "@/components/site/page-ld";
import { ScaffaleStrip } from "@/components/scaffale/scaffale-strip";
import { prodottiScaffale } from "@/content/scaffale";

export const metadata: Metadata = {
  title: "Lo Scaffale: i criteri per i partner",
  description: "Lo Scaffale di Cura Privata: integratori e probiotici dei negozi partner, sempre segnati come pubblicità e separati dalle spiegazioni. Ecco i criteri, in bozza.",
  alternates: { canonical: "/scaffale" },
};

/**
 * Tessera «Lo Scaffale» della home «chiara e scura» (19/11/2026). Pubblica i criteri (in bozza, da far rivedere a un
 * medico e a un avvocato): pubblicità sempre segnata, separata dalle spiegazioni, nessun dato a chi vende.
 * 22/11/2026 (Simone: «metti dei prodotti che trovi online… così da provare la grafica»): sotto i criteri, prodotti veri
 * di ESEMPIO (src/content/scaffale.ts), detti come tali; niente prezzi né frasi sulla salute. Senza esempi torna «In arrivo».
 */
const SEZIONI: TemaSezione[] = [
  {
    id: "come-funzionera",
    kicker: "Come funzionerà",
    titolo: "Separato da tutto il resto",
    testo: "Lo Scaffale non entra mai nelle spiegazioni dei referti, nelle guide o nella tua guida personale.",
    voci: [
      { titolo: "Sempre segnato", tag: "Pubblicità", testo: "Ogni prodotto porta la scritta «Pubblicità» e il nome dell’azienda che paga lo spazio." },
      { titolo: "In fondo alle pagine", testo: "Mai in mezzo a una spiegazione, mai accanto ai tuoi valori." },
      { titolo: "Nessun dato a chi vende", testo: "Le aziende non ricevono i tuoi referti né i tuoi dati, e non sanno chi sei." },
    ],
  },
  {
    id: "criteri",
    kicker: "Criteri pubblici",
    titolo: "Che cosa deve rispettare un partner",
    testo: "Sono in bozza: li rivedono un medico e un avvocato prima che lo Scaffale apra.",
    voci: [
      { titolo: "Prodotti in regola", testo: "Gli integratori devono essere notificati al Ministero della Salute, con l’etichetta in italiano." },
      { titolo: "Solo le frasi ammesse", testo: "Sulla salute, solo le indicazioni autorizzate dall’Unione europea, scritte come sono state autorizzate." },
      { titolo: "Le prove, dichiarate", testo: "Per ogni prodotto, che cosa dicono gli studi: prove solide, iniziali o da chiarire, come nelle nostre schede." },
      { titolo: "Avvertenze in vista", testo: "Farmaci, gravidanza, allattamento, bambini: le avvertenze stanno accanto al prodotto, non in piccolo." },
      { titolo: "Prezzo chiaro", testo: "Con i partner il prezzo si vede prima di cliccare, senza abbonamenti nascosti. Negli esempi di oggi lo trovi nel negozio." },
      { titolo: "Chi non li rispetta, esce", testo: "Un partner che non rispetta i criteri lascia lo Scaffale." },
    ],
  },
  {
    id: "per-le-aziende",
    kicker: "Per le aziende",
    titolo: "Vuoi uno spazio sullo Scaffale?",
    voci: [{ titolo: "Scrivici", testo: "Ti mandiamo i criteri completi appena sono pronti, insieme alle condizioni.", href: "/contatti", go: "Contatti" }],
  },
];

export default function ScaffalePage() {
  const esempi = prodottiScaffale().length > 0;
  return (
    <>
      <PageLd path="/scaffale" meta={metadata} name="Lo Scaffale" />
      <TemaPage
        tono="sh"
        icona="sh"
        kicker="Lo Scaffale"
        stato={esempi ? "Esempi" : "In arrivo"}
        titolo="Lo Scaffale:"
        em="pubblicità, e lo diciamo."
        lead={
          esempi
            ? "Integratori e probiotici dei negozi partner, in fondo alle pagine e sempre segnati come pubblicità. Oggi non ci sono ancora partner: qui trovi i criteri che dovranno rispettare e alcuni prodotti di esempio."
            : "Integratori, probiotici e prodotti per lo sport di aziende partner. Li troverai in fondo alle pagine, sempre segnati come pubblicità. Oggi non ci sono ancora partner: qui trovi i criteri che dovranno rispettare."
        }
        bozzaTesto="Bozza: i criteri li rivedono un medico e un avvocato prima che lo Scaffale apra."
        sezioni={SEZIONI}
        dopo={
          esempi ? (
            <section className="ht-sec" aria-label="Prodotti di esempio">
              <div className="ht-wrap">
                <ScaffaleStrip id="esempi" titolo="Come apparirà: alcuni prodotti di esempio" criteri={false} />
              </div>
            </section>
          ) : null
        }
        azioni={[
          { href: "/integratori", label: "Integratori, spiegati", primary: true },
          { href: "/", label: "Torna alla home" },
        ]}
      />
    </>
  );
}
