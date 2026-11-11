import Link from "next/link";
import { ArrowRight, Ban, Cpu, Eye, LockKeyhole, Stethoscope } from "lucide-react";

const POINTS = [
  { icon: Eye, q: "Chi vede i documenti", a: "Tu. Un medico vede solo quelli che scegli di condividere." },
  { icon: Stethoscope, q: "Quando interviene un medico", a: "Nel videoconsulto e nel secondo parere: abilitato e identificabile." },
  { icon: Cpu, q: "Che cosa resta automatico", a: "La spiegazione del referto. Nessun medico la rivede, e i numeri restano quelli del documento." },
  { icon: LockKeyhole, q: "Dati e privacy", a: "Mai venduti né usati per la pubblicità. Nelle email, mai il contenuto del referto." },
  { icon: Ban, q: "Che cosa non facciamo", a: "Diagnosi automatiche, prescrizioni, urgenze." },
];

/**
 * Fiducia, detta con fatti: chi vede che cosa, quando c'è un medico, che cosa resta automatico, che cosa non si fa.
 * Un elenco editoriale (dl) su fondo forte, non una griglia di schede. Va dentro una sezione `.scope-strong`.
 */
export function Trust() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <p className="eyebrow">Fiducia</p>
        <h2 id="fiducia-titolo" className="display-lg mt-4 text-ink">
          Chiaro per te. Rigoroso per il tuo medico.
        </h2>
        <div className="mt-8 flex flex-col items-start gap-3">
          <Link href="/sicurezza-e-privacy" className="btn btn-mint btn-lg">
            Sicurezza e privacy <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
          </Link>
          <Link href="/per-i-medici" className="link min-h-11 py-2 text-lg font-semibold">
            Sei un medico? Scopri come lavoriamo
          </Link>
        </div>
      </div>
      <dl className="trust-list">
        {POINTS.map(({ icon: Icon, q, a }) => (
          <div key={q}>
            <dt className="flex items-center gap-3 text-xl font-bold text-ink">
              <Icon aria-hidden className="h-6 w-6 shrink-0 text-teal" strokeWidth={1.8} />
              {q}
            </dt>
            <dd className="text-xl leading-snug text-ink-soft">{a}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
