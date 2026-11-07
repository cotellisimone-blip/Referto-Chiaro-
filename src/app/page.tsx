import Link from "next/link";
import { ArrowRight, BookOpenText, CircleHelp, FileCheck2, ListChecks, MessageSquareText, ScanSearch, Stethoscope, Check, X } from "lucide-react";
import { HeroDocument } from "@/components/demo/hero-document";
import { DocumentLinesPattern, MethodLine } from "@/components/brand/illustrations";
import { Section } from "@/components/ui/section";
import { ServiceCards } from "@/components/ui/service-cards";
import { FaqList } from "@/components/ui/faq-list";
import { FAQ } from "@/content/faq";

const PROMISES = [
  { icon: FileCheck2, title: "Valori verificabili", text: "Ogni numero resta identico al documento e indica la riga da cui proviene." },
  { icon: BookOpenText, title: "Linguaggio semplice", text: "Le parole tecniche diventano frasi chiare, senza trasformarsi in una diagnosi." },
  { icon: MessageSquareText, title: "Domande per la visita", text: "Arrivi dal medico con un riepilogo ordinato e domande pertinenti." },
];

const STEPS = [
  {
    n: "01",
    icon: ScanSearch,
    title: "Leggiamo il documento, senza cambiare i numeri.",
    text: "Ogni valore viene estratto con unità, intervallo stampato e posizione nel referto. Se qualcosa non è leggibile, non lo indoviniamo.",
  },
  {
    n: "02",
    icon: ListChecks,
    title: "Controlli tu, prima di tutto.",
    text: "Confermi che i valori corrispondano al documento. Solo i dati confermati passano alla spiegazione.",
  },
  {
    n: "03",
    icon: BookOpenText,
    title: "Spieghiamo i termini con parole comuni.",
    text: "Una spiegazione generale di che cosa misura ogni esame, collegata alla riga originale. Nessun giudizio sulla tua salute.",
  },
  {
    n: "04",
    icon: Stethoscope,
    title: "Prepariamo le domande per il tuo medico.",
    text: "Un PDF stampabile con valori, spiegazioni e domande. Le decisioni restano al professionista.",
  },
];

const AUDIENCE = [
  { title: "Hai ricevuto un referto?", text: "Vuoi capire che cosa c'è scritto prima di parlarne con il tuo medico, senza perderti tra sigle e unità di misura." },
  { title: "Devi preparare una visita?", text: "Hai più documenti di date e laboratori diversi e vuoi portarli in ordine, con le domande giuste." },
  {
    title: "Aiuti un familiare?",
    text: "Lo accompagni nella gestione dei documenti. Servirà il suo consenso o un titolo adeguato per trattare i suoi dati.",
  },
];

const COMPARISON = [
  { label: "I numeri restano identici al documento, con controllo automatico", us: true, chatbot: false },
  { label: "Ogni valore indica pagina e riga del referto", us: true, chatbot: false },
  { label: "Ti chiede di confermare i valori prima di spiegarli", us: true, chatbot: false },
  { label: "Se un dato è illeggibile si ferma, invece di indovinare", us: true, chatbot: false },
  { label: "Evita diagnosi e consigli su terapie per scelta di progetto", us: true, chatbot: false },
  { label: "Risponde a qualsiasi domanda medica", us: false, chatbot: true },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section aria-labelledby="hero-titolo" className="relative overflow-hidden">
        <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-[620px] bg-[linear-gradient(180deg,var(--color-mist)_0%,var(--color-canvas)_100%)]" />
        <div className="container-rc grid items-center gap-12 pb-16 pt-12 sm:pt-16 lg:grid-cols-[1.12fr_0.88fr] lg:gap-16 lg:pb-24 lg:pt-20">
          <div>
            <p className="eyebrow">I referti, spiegati in modo umano</p>
            <h1 id="hero-titolo" className="display mt-4 text-[2.5rem] sm:text-[3.5rem] lg:text-[4rem]">
              I tuoi referti, <em className="font-serif not-italic text-teal">finalmente</em> comprensibili.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted sm:text-xl">
              Una spiegazione semplice dei documenti, un dossier ordinato e le domande giuste per il tuo medico.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/esempio" className="btn btn-primary">
                Esplora un referto di esempio <ArrowRight aria-hidden className="h-4 w-4" />
              </Link>
              <Link href="/accedi" className="btn btn-secondary">
                Crea il tuo archivio gratuito
              </Link>
              <Link href="/servizi-prezzi" className="btn btn-ghost">
                Scopri servizi e prezzi
              </Link>
            </div>
            <p className="mt-6 max-w-lg border-l-2 border-sage pl-4 text-[0.9375rem] text-muted">
              <strong className="font-semibold text-ink">Uno strumento di comprensione. Non una diagnosi.</strong> I contenuti automatici possono contenere errori: confrontati sempre con un professionista sanitario.
            </p>
          </div>
          <div>
            <HeroDocument />
          </div>
        </div>
      </section>

      {/* PROMESSE */}
      <section aria-label="Le nostre promesse" className="border-y border-line bg-paper">
        <ul className="container-rc grid gap-8 py-10 md:grid-cols-3 md:gap-6">
          {PROMISES.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-mist">
                <Icon aria-hidden className="h-5 w-5 text-teal" />
              </span>
              <div>
                <h2 className="font-semibold text-ink">{title}</h2>
                <p className="mt-1 text-[0.9375rem] text-muted">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* PROBLEMA */}
      <section aria-labelledby="problema-titolo" className="py-16 sm:py-24">
        <div className="container-rc grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <p className="eyebrow lg:pt-3">Il problema</p>
          <div>
            <h2 id="problema-titolo" className="display text-[1.875rem] sm:text-[2.5rem]">
              Un referto può essere preciso per chi lo ha scritto, ma difficile per chi lo deve leggere.
            </h2>
            <p className="mt-6 max-w-2xl text-lg text-muted">
              Sigle, numeri e parole tecniche non dovrebbero impedirti di fare domande consapevoli. Cercare ogni termine online porta spesso a risposte che mescolano il dato del tuo documento con supposizioni. Noi teniamo le due cose separate.
            </p>
          </div>
        </div>
      </section>

      {/* METODO */}
      <Section
        id="metodo"
        tone="paper"
        eyebrow="Il metodo"
        title="Dal documento alla comprensione, un passaggio alla volta."
        lead="Dove c'è un valore, trovi anche la sua fonte nel documento."
      >
        <div className="relative">
          <MethodLine />
          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ n, icon: Icon, title, text }) => (
            <li key={n} className="relative rounded-[var(--radius-lg)] border border-line bg-canvas p-6 transition-transform duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <span className="tabular font-serif text-3xl text-sage-deep">{n}</span>
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-mist">
                  <Icon aria-hidden className="h-5 w-5 text-teal" />
                </span>
              </div>
              <h3 className="mt-6 text-lg font-semibold leading-snug text-ink">{title}</h3>
              <p className="mt-2 text-[0.9375rem] text-muted">{text}</p>
            </li>
          ))}
          </ol>
        </div>
      </Section>

      {/* PRIMA / DOPO */}
      <Section id="prima-dopo" eyebrow="Prima e dopo" title="Lo stesso dato, finalmente leggibile.">
        <div className="grid gap-5 lg:grid-cols-2">
          <figure className="card doc-paper p-6 sm:p-8">
            <figcaption className="-mx-6 -mt-6 flex items-center justify-between gap-3 rounded-t-[var(--radius-lg)] border-b border-line bg-paper px-6 py-4 text-sm text-muted sm:-mx-8 sm:-mt-8 sm:px-8">
              <span className="font-semibold text-ink">Nel referto</span>
              <span className="chip bg-cream text-ink">Esempio sintetico</span>
            </figcaption>
            <p className="tabular mt-8 font-mono text-[0.9375rem] leading-8 text-ink sm:text-base">
              Emoglobina glicata (HbA1c) &nbsp; 5,1 % &nbsp; [4,0 - 5,6]
            </p>
            <p className="mt-4 text-sm text-muted">Pagina 1, riga 5</p>
          </figure>
          <figure className="card bg-mist/40 p-6 sm:p-8">
            <figcaption className="text-sm font-semibold text-ink">In parole semplici</figcaption>
            <p className="mt-6 text-lg leading-relaxed text-ink">
              L&apos;emoglobina glicata è un esame che riflette l&apos;andamento medio del glucosio nel sangue nelle settimane precedenti al prelievo, non solo nel giorno dell&apos;esame.
            </p>
            <p className="mt-4 text-[0.9375rem] text-muted">
              Il dato riportato è <strong className="tabular text-ink">5,1 %</strong> e rientra nell&apos;intervallo stampato dal laboratorio. Che cosa significa per te lo può dire solo il medico.
            </p>
          </figure>
        </div>
      </Section>

      {/* PER CHI */}
      <Section id="per-chi" tone="mist" eyebrow="A chi serve" title="Pensato per chi vuole arrivare preparato.">
        <ul className="grid gap-5 md:grid-cols-3">
          {AUDIENCE.map((a) => (
            <li key={a.title} className="card p-6 sm:p-7">
              <h3 className="font-serif text-2xl leading-tight">{a.title}</h3>
              <p className="mt-3 text-muted">{a.text}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-muted">
          Non adatto a emergenze, minori, gravidanza, referti istologici o genetici e immagini diagnostiche.
        </p>
      </Section>

      {/* DIFFERENZA */}
      <Section
        id="differenza"
        eyebrow="Perché non un chatbot qualsiasi"
        title="Meno risposte a tutto. Più cura per i tuoi dati."
        lead="Un assistente generico può spiegare molte cose. Referto Chiaro fa una cosa sola, e la fa in modo verificabile."
      >
        <div className="card overflow-hidden">
          <table className="w-full text-left text-[0.9375rem]">
            <caption className="sr-only">Confronto tra Referto Chiaro e un chatbot generico</caption>
            <thead className="bg-mist/60 text-sm text-muted">
              <tr>
                <th scope="col" className="px-5 py-3 font-semibold">Caratteristica</th>
                <th scope="col" className="w-[4.5rem] px-2 py-3 text-center text-xs font-semibold text-ink sm:w-40 sm:px-3 sm:text-sm">Referto Chiaro</th>
                <th scope="col" className="w-[4.5rem] px-2 py-3 text-center text-xs font-semibold sm:w-40 sm:px-3 sm:text-sm">Chatbot generico</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {COMPARISON.map((r) => (
                <tr key={r.label}>
                  <th scope="row" className="px-4 py-4 font-normal text-ink sm:px-5">{r.label}</th>
                  {[r.us, r.chatbot].map((v, i) => (
                    <td key={i} className="px-2 py-4 text-center sm:px-3">
                      {v ? <Check aria-label="Sì" className="mx-auto h-5 w-5 text-sage-deep" /> : <X aria-label="Non previsto" className="mx-auto h-5 w-5 text-muted/60" />}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-muted">Confronto basato sulle scelte di progetto di Referto Chiaro, non su test di prodotti specifici.</p>
      </Section>

      {/* SERVIZI */}
      <Section
        id="servizi"
        tone="paper"
        eyebrow="Servizi"
        title="Scegli quanta chiarezza ti serve."
        lead="Prezzi indicativi in fase di validazione. Oggi puoi esplorare solo l'esempio: nessun acquisto è attivo."
      >
        <ServiceCards />
        <div className="mt-8 text-center">
          <Link href="/servizi-prezzi" className="btn btn-ghost">
            Confronta i servizi nel dettaglio <ArrowRight aria-hidden className="h-4 w-4" />
          </Link>
        </div>
      </Section>

      {/* FAQ */}
      <Section id="faq" eyebrow="Domande frequenti" title="Quello che ci chiedono più spesso.">
        <FaqList items={FAQ.slice(0, 5)} />
        <div className="mt-6">
          <Link href="/faq" className="btn btn-ghost">
            <CircleHelp aria-hidden className="h-4 w-4" /> Tutte le domande
          </Link>
        </div>
      </Section>

      {/* CTA FINALE */}
      <section aria-labelledby="cta-titolo" className="pb-20">
        <div className="container-rc">
          <div className="relative overflow-hidden rounded-[var(--radius-xl)] bg-strong px-6 py-14 text-on-strong sm:px-14 sm:py-20">
            <DocumentLinesPattern className="text-on-strong opacity-[0.07] [mask-image:linear-gradient(90deg,transparent_35%,black)]" />
            <div className="relative max-w-2xl">
              <h2 id="cta-titolo" className="display text-[2rem] sm:text-[2.75rem]">
                Comincia da un esempio. Capirai subito come funziona.
              </h2>
              <p className="mt-4 text-lg text-on-strong-soft">Due minuti, nessuna registrazione, nessun dato personale.</p>
              <Link href="/esempio" className="btn btn-on-strong mt-8">
                Esplora un referto di esempio <ArrowRight aria-hidden className="h-4 w-4" />
              </Link>
              <p className="mt-6 text-[0.9375rem] text-on-strong-soft">
                Sei una struttura?{" "}
                <Link href="/per-le-strutture" className="font-semibold underline underline-offset-4">
                  Scopri il programma pilota
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
