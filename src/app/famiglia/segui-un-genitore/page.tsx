import { pageTitle } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { PageLd } from "@/components/site/page-ld";
import { ProssimoPasso } from "@/components/site/prossimo-passo";

/**
 * 27/11/2026 (fase 6, «livello successivo»; idea emersa dal cliente simulato «Marco», 41 anni, che segue la madre da
 * lontano). Un percorso guidato che mette in fila quello che il sito sa già fare: la scheda del familiare, i referti,
 * i numeri nel tempo, i promemoria e il foglio per la visita. Niente di nuovo promesso: ogni passo porta a una pagina
 * che esiste. Il consenso del genitore viene prima di tutto.
 */
export const metadata: Metadata = {
  title: pageTitle("Segui la salute di un genitore"),
  description: "Come seguire gli esami e le visite di un genitore, anche da lontano: il suo permesso, una scheda sua, i referti in fila, i promemoria e il foglio per il medico.",
  alternates: { canonical: "/famiglia/segui-un-genitore" },
};

const PASSI = [
  {
    t: "Chiedi il suo permesso",
    d: "Sono i suoi dati. Parlane con lui o con lei prima di cominciare: che cosa vuoi tenere in ordine, chi lo vedrà, che può dirti di smettere quando vuole. Quando crei la scheda ti chiediamo di dichiarare perché puoi gestire i suoi dati, e la dichiarazione resta registrata con la data.",
    href: "/famiglia",
    l: "Come funziona la Famiglia",
  },
  {
    t: "Crea la sua scheda",
    d: "Nel tuo spazio aggiungi una scheda con il suo nome. I suoi referti restano separati dai tuoi e non si mescolano mai. Non deve registrarsi.",
    href: "/accedi?next=/area-personale/famiglia",
    l: "Apri il tuo spazio",
  },
  {
    t: "Raccogli i referti",
    d: "Una foto del foglio va bene, se è dritta e leggibile. Molti laboratori danno anche il referto online o per email: scaricalo e caricalo nella sua scheda.",
    href: "/guide/fotografare-un-referto",
    l: "Come fotografare un referto",
  },
  {
    t: "Guarda i numeri nel tempo",
    d: "Ogni referto nuovo si mette in fila con i precedenti, con l’intervallo del laboratorio accanto. Non diciamo se un andamento va bene o male: lo guardate insieme con il medico.",
    href: "/area-personale/nel-tempo",
    l: "I numeri nel tempo",
  },
  {
    t: "Segna le visite e i promemoria",
    d: "Metti la data della prossima visita o del prossimo esame. Tre giorni prima ti arriva un’email, senza dettagli sanitari.",
    href: "/area-personale/promemoria",
    l: "I promemoria",
  },
  {
    t: "Prepara la visita",
    d: "Prima di andare dal medico, scrivete insieme che cosa è cambiato e che cosa volete chiedere. Il foglio sta in una pagina: si stampa o si mostra dal telefono.",
    href: "/strumenti/preparati-alla-visita",
    l: "Preparati alla visita",
  },
];

const LONTANO = [
  "Tieni a portata di mano il nome e il numero del suo medico di famiglia, e gli orari dello studio.",
  "In molte regioni il Fascicolo sanitario elettronico permette di delegare un familiare: chiedi all’ASL o guarda il sito del Fascicolo della sua regione.",
  "Se segui le visite in video, chiedi di poter essere collegato anche tu, con il suo permesso.",
  "Accordati con un vicino o un parente che possa passare da lui o da lei, se non risponde al telefono.",
];

export default function Page() {
  return (
    <>
      <PageLd path="/famiglia/segui-un-genitore" meta={metadata} name="Segui la salute di un genitore" />
      <PageHeader
        eyebrow="Famiglia"
        title="Segui la salute di un genitore, anche da lontano."
        lead="Sei passi per tenere in ordine esami e visite di tua madre o di tuo padre, con il loro permesso. Ogni passo porta a uno strumento che c’è già."
      />

      <section aria-labelledby="passi-titolo" className="section">
        <div className="container-rc">
          <h2 id="passi-titolo" className="display-lg max-w-3xl">
            Sei passi, in quest’ordine.
          </h2>
          <ol className="mt-7 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5" data-testid="genitore-passi">
            {PASSI.map((x, i) => (
              <li key={x.t} className="tile-card">
                <span aria-hidden className="tile-ico font-bold">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <h3 className="tile-card-title">{x.t}</h3>
                  <p className="tile-card-text">{x.d}</p>
                  <Link href={x.href} className="link mt-2 inline-flex min-h-11 items-center font-semibold">
                    {x.l} <ArrowRight aria-hidden className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="lontano-titolo" className="section bg-mist">
        <div className="container-rc">
          <h2 id="lontano-titolo" className="display-lg max-w-3xl">
            Se abiti lontano.
          </h2>
          <ul className="check-list max-w-3xl">
            {LONTANO.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <div className="callout callout-danger mt-8 max-w-3xl" role="note" data-testid="genitore-112">
            <span aria-hidden className="callout-ico">
              <Phone className="h-5 w-5" />
            </span>
            <div className="min-w-0">
            <p className="text-[1.125rem] font-bold">Quando non aspettare</p>
            <p className="mt-2 text-[1.0625rem]">
              Se ti dice, o qualcuno ti racconta, che ha un dolore al petto, che fa fatica a parlare o a muovere un braccio, che è confuso all’improvviso o che respira male: chiama subito il 112, anche da lontano, e dai il suo indirizzo. Non scrivere a noi e non aspettare il medico di famiglia.
            </p>
            </div>
          </div>
          <p className="mt-6 max-w-3xl text-[1.0625rem] text-ink-soft">
            Cura Privata non fa diagnosi e non sostituisce il suo medico: tiene in ordine le carte e vi aiuta a fare le domande giuste.
          </p>
        </div>
      </section>
      <ProssimoPasso passo={3} titolo="Per cominciare" />
    </>
  );
}
