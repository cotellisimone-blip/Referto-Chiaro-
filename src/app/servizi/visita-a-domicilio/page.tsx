import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarClock, CheckCircle2, ClipboardCheck, FileText, Home, Pill, Signpost, X } from "lucide-react";
import { TrackView } from "@/components/site/track";
import { WaitlistForm } from "@/components/site/waitlist-form";
import { cancelTerms } from "@/domain/prestazioni/engine";
import { FaqList } from "@/components/ui/faq-list";
import { CoverageCheck, PrestazioniGrid } from "@/components/prestazioni/public";
import { EmergencyNumbers } from "@/components/prestazioni/ui";
import { PRESTAZIONI, prestazionePrice } from "@/domain/prestazioni/listino";
import { PRICE_NOTE, isVetrina, publicPricesEnabled } from "@/domain/offerta";

export const metadata: Metadata = {
  title: "Visita a domicilio con medico generalista",
  description: "Un medico di medicina generale a casa tua o di un familiare, per esigenze non urgenti. Brescia città come area pilota, prezzo fisso, fasce davvero disponibili.",
  alternates: { canonical: "/servizi/visita-a-domicilio" },
};

const STEPS = [
  { icon: Home, title: "Verifichi comune e CAP", text: "Vedi subito se arriviamo da te e le fasce davvero libere." },
  { icon: CalendarClock, title: "Scegli una fascia", text: "È una richiesta: il medico la conferma o ne propone un'altra." },
  { icon: ClipboardCheck, title: "Confermi quando sai tutto", text: "Nome del medico, orario, indirizzo e prezzo totale prima di pagare." },
];

const NOT_FOR = [
  "Emergenze: chiama il 112",
  "Continuità assistenziale pubblica (ex guardia medica): chiama il 116117 negli orari previsti",
  "Certificati di malattia, ricette del Servizio sanitario o visite specialistiche",
];

/** Ciclo 4: che cosa resta in mano dopo la visita. La prescrizione è una decisione del medico, mai una promessa. */
const AFTER = [
  { icon: FileText, title: "Un riepilogo scritto", text: "Che cosa ha controllato il medico e che cosa ti ha indicato. Lo ritrovi nella tua richiesta e lo puoi stampare." },
  { icon: Signpost, title: "Il prossimo passo", text: "Una riga chiara: nessun altro passo, il tuo medico di famiglia, esami, uno specialista o un controllo." },
  { icon: Pill, title: "Se serve, una prescrizione", text: "Dopo averti visitato il medico può lasciarti una prescrizione su ricetta bianca, se la ritiene necessaria. I farmaci su ricetta bianca sono a tuo carico." },
];

const FAQ_DOMICILIO = [
  { q: "Per chi è la visita a domicilio?", a: "Per chi ha un'esigenza non urgente e preferisce, o ha bisogno, di essere visitato a casa: per sé o per un familiare. La valutazione clinica è sempre del medico, che decide se serve altro." },
  { q: "Dove arrivate?", a: "Partiamo da Brescia città come area pilota. Inserisci comune e CAP: se non siamo ancora nella tua zona te lo diciamo subito e ti proponiamo un videoconsulto." },
  { q: "Quanto costa e quando pago?", a: "Il prezzo è fisso e comprende lo spostamento nell'area coperta. Non paghi nulla quando invii la richiesta: paghi solo dopo che il medico ha confermato l'orario e hai visto nome, orario, indirizzo e importo." },
  { q: "Posso annullare?", a: `Sì. Prima della conferma non c'è alcun addebito. Dopo la conferma: ${cancelTerms("domicilio").charAt(0).toLowerCase()}${cancelTerms("domicilio").slice(1)}` },
  { q: "Il medico può prescrivere farmaci?", a: "Decide il medico dopo averti visitato: se lo ritiene necessario può lasciarti una prescrizione su ricetta bianca, con i farmaci a tuo carico. Non rilascia certificati di malattia né ricette del Servizio sanitario: per quelli resta il tuo medico di famiglia." },
  { q: "Che cosa mi resta dopo la visita?", a: "Un riepilogo scritto nella tua richiesta, con il prossimo passo indicato dal medico. Lo puoi stampare o mostrare al tuo medico di famiglia." },
  { q: "E se ho bisogno subito?", a: "Questo non è un servizio di urgenza. Per le emergenze sanitarie chiama il 112. Per la continuità assistenziale pubblica chiama il 116117 negli orari previsti." },
];

export default function VisitaADomicilioPage() {
  const info = PRESTAZIONI.domicilio;
  const prices = publicPricesEnabled();
  const vetrina = isVetrina();
  return (
    <>
      <TrackView event="visita-domicilio" />
      <section aria-labelledby="dom-titolo" className="tone-medico stage-warm">
        <div className="container-rc grid grid-cols-[minmax(0,1fr)] gap-8 pb-12 pt-10 sm:pt-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="eyebrow">Novità · Brescia città, area pilota</p>
            <h1 id="dom-titolo" className="display-xl mt-4">Il medico a casa tua.</h1>
            <p className="mt-5 max-w-2xl text-xl text-ink-soft">{info.title}: per esigenze non urgenti, per te o per un familiare. Vedi solo le fasce davvero disponibili.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href={info.startHref} data-track="cta-domicilio" className="btn btn-primary btn-lg">
                {vetrina ? "Provala nella demo" : "Richiedi la visita"} <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
              </Link>
              <a href="#copertura" className="btn btn-secondary btn-lg">Arrivate da me?</a>
            </div>
          </div>
          <div className="card p-6 sm:p-8">
            <p className="text-[0.9375rem] font-semibold uppercase tracking-wide text-muted">{info.mode}</p>
            {prices ? <p className="mt-2 text-[2.75rem] font-bold leading-none text-ink">{prestazionePrice("domicilio")}</p> : null}
            <p className="mt-1 text-[1.0625rem] text-ink-soft">prezzo fisso, {info.durationLabel}</p>
            <ul className="mt-5 space-y-2 text-[1.0625rem] text-ink">
              {info.includes.map((x) => (
                <li key={x} className="flex gap-2"><CheckCircle2 aria-hidden className="mt-1 h-5 w-5 shrink-0 text-teal" /> {x}</li>
              ))}
            </ul>
            {prices ? <p className="mt-4 text-sm text-muted">{PRICE_NOTE}</p> : null}
          </div>
        </div>
      </section>

      <section aria-labelledby="come-titolo" className="py-10 sm:py-16">
        <div className="container-rc">
          <h2 id="come-titolo" className="display-lg">Come funziona</h2>
          <ol className="mt-7 grid gap-4 md:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="card p-6">
                <Icon aria-hidden className="h-8 w-8 text-teal" />
                <p className="mt-3 text-xl font-bold text-ink">{i + 1}. {title}</p>
                <p className="mt-1 text-[1.0625rem] text-ink-soft">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="copertura" aria-labelledby="copertura-titolo" className="scroll-mt-28 bg-mist py-10 sm:py-16">
        <div className="container-rc grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-2 lg:items-start">
          <div>
            <h2 id="copertura-titolo" className="display-lg">Dove arriviamo</h2>
            <p className="mt-4 text-xl text-ink-soft">Brescia città, come area pilota. Allargheremo la zona quando avremo medici sufficienti per garantire le fasce che mostriamo.</p>
            <div className="mt-6"><EmergencyNumbers /></div>
          </div>
          <CoverageCheck />
        </div>
      </section>

      <section aria-labelledby="dopo-titolo" className="py-10 sm:py-16">
        <div className="container-rc">
          <h2 id="dopo-titolo" className="display-lg">Che cosa ti resta dopo la visita</h2>
          <ul className="mt-7 grid gap-4 md:grid-cols-3">
            {AFTER.map(({ icon: Icon, title, text }) => (
              <li key={title} className="card p-6">
                <Icon aria-hidden className="h-8 w-8 text-teal" />
                <p className="mt-3 text-xl font-bold text-ink">{title}</p>
                <p className="mt-1 text-[1.0625rem] text-ink-soft">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {vetrina ? (
        <section id="avvisami" aria-labelledby="avvisami-titolo" className="scroll-mt-28 bg-mist py-10 sm:py-16">
          <div className="container-rc grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-2 lg:items-start">
            <div>
              <h2 id="avvisami-titolo" className="display-lg">Avvisami quando parte nella mia zona</h2>
              <p className="mt-4 text-xl text-ink-soft">Il servizio non è ancora attivo. Lascia email e CAP: partiamo dalle zone in cui c&apos;è più richiesta.</p>
            </div>
            <WaitlistForm interest="domicilio" />
          </div>
        </section>
      ) : null}

      <section aria-labelledby="nonper-titolo" className="bg-paper py-10 sm:py-16">
        <div className="container-rc">
          <h2 id="nonper-titolo" className="display-lg">Quando non è il servizio giusto</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-3">
            {NOT_FOR.map((x) => (
              <li key={x} className="flex gap-3 rounded-xl border border-line bg-paper px-5 py-4 text-[1.0625rem] text-ink"><X aria-hidden className="mt-1 h-5 w-5 shrink-0 text-danger" /> {x}</li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="altre-titolo" className="bg-ivory-wash py-10 sm:py-16">
        <div className="container-rc">
          <h2 id="altre-titolo" className="display-lg">Se ti serve altro</h2>
          <p className="mt-3 max-w-2xl text-xl text-ink-soft">Per un dubbio che si chiarisce a distanza basta un videoconsulto. Per un&apos;altra valutazione su una diagnosi o una proposta di cura c&apos;è il secondo parere di uno specialista.</p>
          <div className="mt-7"><PrestazioniGrid only={["video", "parere"]} /></div>
        </div>
      </section>

      <section aria-labelledby="faq-dom-titolo" className="py-10 sm:py-16">
        <div className="container-rc">
          <h2 id="faq-dom-titolo" className="display-lg">Domande sulla visita a domicilio</h2>
          <div className="mt-7"><FaqList items={FAQ_DOMICILIO} /></div>
        </div>
      </section>
    </>
  );
}
