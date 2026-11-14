import type { Metadata } from "next";
import Link from "next/link";
import { ALargeSmall, ArrowRight, BookOpenCheck, CircleHelp, Footprints, SearchCheck, TextAlignStart, X } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Photo } from "@/components/ui/photo";
import { Section } from "@/components/ui/section";
import { ILLUSTRATIVE_PHOTOS, SHOW_ILLUSTRATIVE_PHOTOS } from "@/content/media";
import { mediciEnabled } from "@/lib/medici";

/** 14/11/2026: senza medici (src/lib/medici.ts) i testi dicono solo quello che c'è. */
const MEDICI = mediciEnabled();

export const metadata: Metadata = {
  title: "Chi siamo",
  description: MEDICI
    ? "Perché esiste Cura Privata: spiegare i referti in parole semplici e portarti da un medico quando serve. In che cosa crediamo e che cosa qui non troverai."
    : "Perché esiste Cura Privata: spiegare i referti in parole semplici e prepararti a parlarne con il tuo medico. In che cosa crediamo e che cosa qui non troverai.",
  alternates: { canonical: "/chi-siamo" },
};

const BELIEFS = [
  { icon: BookOpenCheck, title: "Capire è un tuo diritto", text: "Sapere che cosa c'è scritto nel tuo referto ti spetta. Non sostituisce il medico: ti prepara a parlargli." },
  { icon: SearchCheck, title: "La fiducia si verifica", text: "Ogni numero rimanda alla riga del referto da cui viene, e ogni spiegazione alla sua fonte." },
  { icon: CircleHelp, title: "Meglio «non lo so»", text: "Se un dato non si legge, ci fermiamo e te lo diciamo. Non tiriamo a indovinare." },
];

const CARE = [
  { icon: ALargeSmall, title: "Testo grande", text: "Caratteri grandi già in partenza, e un tasto per ingrandirli ancora." },
  { icon: TextAlignStart, title: "Poche parole", text: "Frasi brevi, e nessuna sigla lasciata senza spiegazione." },
  { icon: Footprints, title: "Un passo per volta", text: "Ogni schermata ti chiede una cosa sola e ti dice che cosa succede dopo." },
];

const NOT_HERE = ["Testimonianze inventate", "Numeri di utenti gonfiati", "Medici o collaborazioni che non esistono"];

export default function Page() {
  const photo = ILLUSTRATIVE_PHOTOS.mani;
  return (
    <>
      <PageHeader
        eyebrow="Chi siamo"
        title="Un referto non dovrebbe fare paura."
        lead={MEDICI ? "Spesso spaventa solo perché è scritto in un'altra lingua. Cura Privata nasce per tradurlo in parole semplici e, quando serve una persona, portarti da un medico." : "Spesso spaventa solo perché è scritto in un'altra lingua. Cura Privata nasce per tradurlo in parole semplici e prepararti a parlarne con il tuo medico."}
      />

      <section aria-labelledby="storia-titolo" className="section">
        <div className="container-rc story">
          {SHOW_ILLUSTRATIVE_PHOTOS ? (
            <figure className="story-photo">
              <Photo photo={photo} sizes="(min-width: 900px) 44vw, 92vw" />
              <figcaption className="caption-illus bottom-4 left-4">Immagine illustrativa</figcaption>
            </figure>
          ) : null}
          <div>
            <h2 id="storia-titolo" className="display-lg">
              Prima capisci. Poi decidi, con il tuo medico.
            </h2>
            <p className="lead mt-5">
              Con un referto in mano ci si sente soli: sigle, asterischi, numeri fuori colonna. Noi partiamo da lì. Ti diciamo che cosa misura ogni esame e dove cade il tuo valore rispetto all&apos;intervallo del laboratorio, senza giudicarlo.
            </p>
            <p className="lead mt-4">{MEDICI ? "Se vuoi andare avanti c'è un medico abilitato: a casa, in video o per un secondo parere. Le decisioni restano tue e del tuo medico." : "Poi ne parli con il tuo medico, con le domande già pronte. Le decisioni restano tue e sue."}</p>
          </div>
        </div>
      </section>

      <Section id="valori" title="In che cosa crediamo.">
        <ul className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:gap-5 lg:grid-cols-3">
          {BELIEFS.map(({ icon: Icon, title, text }) => (
            <li key={title} className="tile-card">
              <span aria-hidden className="tile-ico">
                <Icon />
              </span>
              <div>
                <h3 className="tile-card-title">{title}</h3>
                <p className="tile-card-text">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="per-chi" tone="mist" eyebrow="Per chi è pensato" title="Per chi ha più di sessant'anni, e per chi aiuta un genitore.">
        <ul className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:gap-5 lg:grid-cols-3">
          {CARE.map(({ icon: Icon, title, text }) => (
            <li key={title} className="tile-card">
              <span aria-hidden className="tile-ico">
                <Icon />
              </span>
              <div>
                <h3 className="tile-card-title">{title}</h3>
                <p className="tile-card-text">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="non-troverai" eyebrow="Per chiarezza" title="Che cosa qui non troverai." size="md">
        <ul className="excl-grid">
          {NOT_HERE.map((x) => (
            <li key={x}>
              <span aria-hidden className="cross-dot">
                <X />
              </span>
              {x}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-lg text-ink-soft">Quando ci saranno persone e numeri da mostrare, li potrai verificare.</p>
      </Section>

      <section aria-labelledby="punto-titolo" className="section">
        <div className="container-rc">
          <div className="cta-card">
            <div>
              <h2 id="punto-titolo" className="display-md">
                A che punto siamo.
              </h2>
              <p className="lead mt-3 max-w-[40rem]">
                Cura Privata è un progetto italiano in fase di sviluppo, nato come «Referto Chiaro». Oggi è una versione dimostrativa: {MEDICI ? "provi tutti i servizi su documenti inventati, con medici di prova" : "provi tutto su documenti inventati"}. Ogni servizio apre davvero solo dopo le verifiche che un
                servizio sanitario richiede.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link href="/referti/esempio" className="btn btn-primary btn-lg">
                Prova con un referto di esempio <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
              </Link>
              <Link href="/stato-del-progetto" className="btn btn-secondary btn-lg">
                Guarda lo stato del progetto
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
