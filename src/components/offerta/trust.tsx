import { mediciEnabled } from "@/lib/medici";
import Link from "next/link";
import { ArrowRight, Ban, Building2, Eye, LockKeyhole, Sparkles } from "lucide-react";
import { readTitolare } from "@/domain/titolare";

const POINTS = [
  { icon: Eye, q: "Chi vede i tuoi documenti", a: "Tu. E soltanto chi scegli tu, quando lo scegli." },
  { icon: Sparkles, q: "Che cosa è automatico", a: "La spiegazione del referto. Nessun medico la rivede, e i numeri restano quelli del tuo documento." },
  { icon: LockKeyhole, q: "I tuoi dati", a: "Mai venduti, mai usati per la pubblicità. Nelle email non scriviamo mai che cosa c'è nel referto." },
  { icon: Ban, q: "Che cosa non facciamo", a: "Diagnosi automatiche e urgenze. Se stai male adesso, il numero giusto è il 112." },
];

/**
 * Fiducia, detta con fatti: chi vede che cosa, che cosa resta automatico, come trattiamo i dati, che cosa non si fa.
 * Quattro riquadri di vetro su fondo petrolio. Va dentro una sezione `.scope-strong`.
 */
export function Trust() {
  const t = readTitolare();
  // «Chi c'è dietro» compare solo con i dati veri del titolare (nome + P.IVA): nessun segnaposto.
  const points = t ? [{ icon: Building2, q: "Chi c'è dietro", a: `${t.name}, P.IVA ${t.vat}${t.address ? `, ${t.address}` : ""}.` }, ...POINTS] : POINTS;
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-9 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16">
      <div>
        <p className="eyebrow">In chiaro</p>
        <h2 id="fiducia-titolo" className="display-lg mt-4 text-ink">
          Pochi fatti, detti chiari.
        </h2>
        <p className="lead mt-4">Niente promesse: solo come funziona, davvero.</p>
        <div className="mt-8 flex flex-col items-start gap-2">
          <Link href="/sicurezza-e-privacy" className="btn btn-mint btn-lg">
            Sicurezza e privacy <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
          </Link>
          {mediciEnabled() ? (
          <Link href="/per-i-medici" className="link min-h-11 py-2 text-lg font-semibold">
            Sei un medico? Scopri come lavoriamo
          </Link>
          ) : null}
        </div>
      </div>
      <dl className="fact-grid">
        {points.map(({ icon: Icon, q, a }) => (
          <div key={q} className="fact">
            <dt>
              <Icon aria-hidden strokeWidth={1.8} />
              {q}
            </dt>
            <dd>{a}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
