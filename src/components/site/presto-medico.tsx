import Link from "next/link";
import { ArrowRight, Home, Stethoscope, Video } from "lucide-react";
import { CON_UN_MEDICO_HREF } from "@/lib/medici";

/**
 * «Presto anche con un medico» (13/11/2026): l'unico posto in cui, con i medici spenti, il pubblico vede i servizi con un
 * medico. Nessun prezzo, niente da comprare: solo che cosa arriverà e la lista d'attesa (sulla pagina /con-un-medico).
 */
export const PRESTO_SERVIZI = [
  { icon: Home, t: "Visita a domicilio", d: "Un medico generalista a casa tua." },
  { icon: Video, t: "Videoconsulto", d: "Un medico in video, che ha già letto i tuoi documenti." },
  { icon: Stethoscope, t: "Secondo parere", d: "Uno specialista esamina i documenti e scrive una sintesi." },
] as const;

export function PrestoMedico({ className = "", headingLevel = 2 }: { className?: string; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <aside aria-labelledby="presto-medico-t" className={`presto-medico ${className}`}>
      <div className="min-w-0">
        <p className="presto-medico-kicker">
          <span aria-hidden className="presto-medico-dot" />
          In preparazione
        </p>
        <H id="presto-medico-t" className="presto-medico-title">
          Presto anche con un medico.
        </H>
        <p className="presto-medico-lead">
          {PRESTO_SERVIZI.map((s) => s.t).join(", ").replace(/, ([^,]*)$/, " e $1")}: arrivano quando avremo scelto i medici con cui lavorare.
        </p>
      </div>
      <Link href={CON_UN_MEDICO_HREF} className="btn btn-secondary shrink-0" data-track="cta-presto-medico">
        Avvisami quando parte <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
      </Link>
    </aside>
  );
}
