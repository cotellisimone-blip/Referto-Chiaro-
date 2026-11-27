import { pageTitle } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { PageLd } from "@/components/site/page-ld";
import { ProssimoPasso } from "@/components/site/prossimo-passo";
import { mediciEnabled } from "@/lib/medici";

/**
 * 27/11/2026 (fase 6, «livello successivo»; domanda emersa dal cliente simulato «Marco»: «perché pagare, se un'AI
 * gratuita legge il referto?»). Risposta onesta: che cosa fa un'AI generica, che cosa fa in più Cura Privata, e quando
 * la risposta gratuita basta. Nessun confronto con prodotti per nome, nessuna promessa che il sito non mantiene.
 */
export const metadata: Metadata = {
  title: pageTitle("Cura Privata o un’AI gratuita?"),
  description: "Un chatbot gratuito può spiegare una parola del referto. Che cosa fa in più Cura Privata, e quando la risposta gratuita basta: detto chiaramente.",
  alternates: { canonical: "/cura-privata-o-un-ai-gratuita" },
};

const DIFFERENZE = [
  {
    t: "Ogni numero torna alla sua riga",
    d: "Accanto a ogni valore vedi la riga del referto da cui viene, e ti chiediamo di controllarlo prima di andare avanti. Una chat ti risponde, ma non ti mostra da dove ha preso il numero.",
  },
  {
    t: "L’intervallo del tuo laboratorio",
    d: "Il confronto si fa con l’intervallo stampato sul tuo referto, calcolato dal codice, non a memoria. Ogni laboratorio ha il suo.",
  },
  {
    t: "Se un dato non si legge, ci fermiamo",
    d: "Non tiriamo a indovinare: te lo diciamo. Una chat tende a dare comunque una risposta, anche quando il dato è incerto.",
  },
  {
    t: "Regole che non si scavalcano",
    d: "Niente diagnosi, niente farmaci, niente dosi: le frasi che lo farebbero sono bloccate da controlli automatici, sempre, qualunque cosa si chieda.",
  },
  {
    t: "Le domande per il medico, pronte",
    d: "Il report finisce con le domande da portare alla visita e un foglio di una pagina da stampare o mostrare dal telefono.",
  },
  {
    t: "I referti restano tuoi",
    d: "Uno spazio privato e cifrato, visibile solo a te. I referti non finiscono in email, statistiche o pubblicità, e li cancelli quando vuoi.",
  },
];

const BASTA = [
  "Vuoi sapere che cosa vuol dire una sigla, come «MCV» o «PCR»: c’è il glossario, gratis.",
  "Vuoi sapere che cosa misura un esame: ci sono le guide agli esami, gratis.",
  "Vuoi solo un’idea generale, senza il tuo referto davanti: va bene anche una chat.",
];

export default function Page() {
  const medici = mediciEnabled();
  return (
    <>
      <PageLd path="/cura-privata-o-un-ai-gratuita" meta={metadata} name="Cura Privata o un’AI gratuita?" />
      <PageHeader
        eyebrow="Domanda giusta"
        title="Cura Privata o un’AI gratuita?"
        lead="Un chatbot gratuito sa spiegare molte parole di un referto. Qui ti diciamo che cosa facciamo in più, e quando la risposta gratuita basta."
      />

      <section aria-labelledby="differenze-titolo" className="section">
        <div className="container-rc">
          <h2 id="differenze-titolo" className="display-lg max-w-3xl">
            Che cosa facciamo in più.
          </h2>
          <ul className="mt-7 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5">
            {DIFFERENZE.map((x) => (
              <li key={x.t} className="tile-card">
                <span aria-hidden className="tile-ico">
                  <Check />
                </span>
                <div>
                  <h3 className="tile-card-title">{x.t}</h3>
                  <p className="tile-card-text">{x.d}</p>
                </div>
              </li>
            ))}
          </ul>
          {medici ? (
            <p className="mt-6 max-w-3xl text-[1.0625rem] text-ink-soft">
              E se dopo la lettura vuoi parlarne con una persona, c’è un medico in video: legge prima i documenti che scegli, e paghi solo dopo che ha confermato.
            </p>
          ) : null}
        </div>
      </section>

      <section aria-labelledby="basta-titolo" className="section bg-mist">
        <div className="container-rc">
          <h2 id="basta-titolo" className="display-lg max-w-3xl">
            Quando la risposta gratuita basta.
          </h2>
          <ul className="check-list max-w-3xl">
            {BASTA.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link href="/glossario" className="btn btn-secondary">
              Il glossario
            </Link>
            <Link href="/guide" className="btn btn-secondary">
              Le guide agli esami
            </Link>
            <Link href="/referti/esempio" className="btn btn-primary">
              Guarda un report di esempio <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
            </Link>
          </div>
          <p className="mt-6 max-w-3xl text-[1.0625rem] text-ink-soft">
            In ogni caso, nessuna spiegazione, nostra o di una chat, sostituisce il tuo medico. Per un’emergenza chiama il 112.
          </p>
        </div>
      </section>
      <ProssimoPasso passo={3} titolo="Per provare" />
    </>
  );
}
