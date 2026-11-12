import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, ShieldCheck, X } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { SCENE } from "@/components/offerta/scenes";
import { CORE_SERVICES } from "@/domain/offerta";

export const metadata: Metadata = {
  title: "Come funziona",
  description: "Il percorso di Cura Privata in tre fasi: capisci il referto, chiedi un secondo parere, parla con un medico. Scegli tu fin dove arrivare.",
};

/** Una frase per fase: che cosa fai tu, che cosa ricevi. I dettagli stanno nelle pagine dei servizi. */
const PHASE = {
  capisci: { you: "Carichi il referto e controlli i valori letti, uno per uno.", get: "Un foglio chiaro con ogni valore spiegato e le domande per il medico." },
  "secondo-parere": { you: "Scegli i documenti e scrivi la domanda che hai.", get: "Un parere scritto e firmato da un medico della specialità giusta." },
  "parla-con-un-medico": { you: "Indichi quando sei libero e quali documenti condividere.", get: "Un videoconsulto con un medico che li ha già letti, e un riepilogo scritto." },
} as const;

const CAN = ["Riportare valori, unità e intervalli come stampati", "Spiegare che cosa misura un esame", "Suggerire domande per il medico", "Fermarsi se un dato non si legge"];
const CANNOT = ["Fare diagnosi o dire se un valore è un problema per te", "Valutare l'urgenza o sostituire il pronto soccorso", "Consigliare farmaci o terapie", "Firmarsi come parere medico"];

export default function ComeFunzionaPage() {
  return (
    <>
      <PageHeader compact eyebrow="Come funziona" title="Tre fasi. Scegli tu fin dove arrivare." lead="Puoi fermarti alla prima, o andare avanti con un medico. I documenti caricati restano nella tua area: non li ricarichi." />
      <div className="container-rc py-12 sm:py-16">
        <ol className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-3">
          {CORE_SERVICES.map((s, i) => {
            const Scene = SCENE[s.id];
            const p = PHASE[s.id];
            return (
              <li key={s.id} className={`tone-${s.tone}`}>
                <div className="service-card">
                  <div className="scene-frame">
                    <Scene uid={`-cf${i}`} />
                  </div>
                  <div className="flex flex-1 flex-col p-6 sm:p-7">
                    <p className="tone-text text-lg font-extrabold">Fase {i + 1}</p>
                    <h2 className="mt-1 text-[1.625rem] font-bold leading-tight text-ink">{s.name}</h2>
                    <dl className="mt-4 space-y-3 text-lg">
                      <div>
                        <dt className="font-bold text-ink">Tu</dt>
                        <dd className="text-ink-soft">{p.you}</dd>
                      </div>
                      <div>
                        <dt className="font-bold text-ink">Ricevi</dt>
                        <dd className="text-ink-soft">{p.get}</dd>
                      </div>
                    </dl>
                    <Link href={s.href} className="tone-text mt-auto inline-flex items-center gap-2 pt-6 text-lg font-bold">
                      Scopri il servizio <ArrowRight aria-hidden className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
        <div className="mt-12 flex flex-col items-center gap-3 text-center">
          <Link href="/referti/esempio" className="btn btn-primary btn-lg">
            Prova con un referto di esempio <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
          </Link>
          <p className="text-[1.0625rem] text-muted">Nessuna registrazione. Nessun dato personale.</p>
        </div>
      </div>

      <Section id="limiti" tone="mist" eyebrow="Trasparenza" title="La spiegazione automatica: che cosa fa, e che cosa no.">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-2">
          <div className="card p-6 sm:p-8">
            <h3 className="text-xl font-bold text-ink">Fa</h3>
            <ul className="mt-4 space-y-3 text-lg">
              {CAN.map((c) => (
                <li key={c} className="flex gap-3">
                  <Check aria-hidden className="mt-1.5 h-5 w-5 shrink-0 text-teal" /> {c}
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-6 sm:p-8">
            <h3 className="text-xl font-bold text-ink">Non fa, per scelta</h3>
            <ul className="mt-4 space-y-3 text-lg">
              {CANNOT.map((c) => (
                <li key={c} className="flex gap-3">
                  <X aria-hidden className="mt-1.5 h-5 w-5 shrink-0 text-muted" /> {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-6 text-lg text-ink-soft">Ogni valutazione medica la fa un medico abilitato, con nome e firma.</p>
      </Section>

      <Section id="dati" eyebrow="I tuoi dati" title="Che cosa succede ai documenti.">
        <ul className="grid grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-3">
          {[
            ["Oggi, nella demo", "Nessun documento reale: solo file inventati, niente viene salvato."],
            ["Con il servizio attivo", "Uno spazio privato e cifrato, visibile solo a te e al medico che scegli."],
            ["Mai", "I referti non finiscono in email, statistiche o pubblicità."],
          ].map(([t, d]) => (
            <li key={t} className="card p-6 sm:p-7">
              <ShieldCheck aria-hidden className="h-7 w-7 text-teal" />
              <h3 className="mt-4 text-xl font-bold text-ink">{t}</h3>
              <p className="mt-2 text-lg text-ink-soft">{d}</p>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
