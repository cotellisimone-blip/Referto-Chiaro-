import Link from "next/link";
import { ArrowRight, BookOpen, CalendarCheck, ClipboardCheck } from "lucide-react";
import { EXAM_GUIDE_COUNT } from "@/content/guides";
import "@/components/sezioni/tre-momenti.css";
import "@/components/sezioni/sezioni.css";

/**
 * Le cose del passo 2 «I controlli per te» (22/11/2026: prima erano le quattro della sezione Prevenzione; il Punto di
 * Partenza è diventato il passo 1, gli integratori il passo 5). Mai «fai questo esame»: che cosa esiste e che cosa
 * dicono le linee guida, da discutere con il medico.
 */
export function PrevenzioneCards() {
  const items = [
    { href: "/prevenzione/esami-di-base", icon: ClipboardCheck, k: "Gratis", t: "Gli esami di base", d: "Sangue e urine: quali sono, che cosa misurano, quando parlarne con il medico.", v: "pdp", art: ["Emocromo", "Glicemia", "Colesterolo"] },
    { href: "/prevenzione/screening", icon: CalendarCheck, k: "Gratis · per età", t: "Screening gratuiti", d: "Gli esami che il Servizio sanitario offre per età, e come prenotarli.", v: "pro", art: ["Mammografia", "Pap test e HPV", "Sangue occulto"] },
    { href: "/guide", icon: BookOpen, k: "Gratis", t: "Guide agli esami", d: `${EXAM_GUIDE_COUNT} esami spiegati: a che cosa servono, come si fanno, come si leggono. Con le fonti.`, v: "gui", art: [] as string[] },
  ];
  return (
    <ul className={`ds-cards${items.length === 3 ? " ds-cards-3" : ""}`}>
      {items.map(({ href, icon: Icon, k, t, d, v, art }) => (
        <li key={href}>
          <Link href={href} className={`ds-card ds-card-${v}`}>
            <span className="ds-card-art" aria-hidden>
              <CardArt v={v} items={art} />
            </span>
            <span className="ds-card-k">{k}</span>
            <span className="ds-card-t">
              <Icon aria-hidden className="tm-ic" />
              {t}
            </span>
            <span className="ds-card-d">{d}</span>
            <span className="ds-card-go">
              Apri <ArrowRight aria-hidden className="tm-ic" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Piccoli disegni in testa alle schede: una lista, un foglio con la barra, delle guide, delle capsule. */
function CardArt({ v, items }: { v: string; items: string[] }) {
  if (v === "pdp" || v === "pro")
    return (
      <span className={v === "pro" ? "ds-art ds-art-pdp ds-art-pro" : "ds-art ds-art-pdp"}>
        {items.map((x) => (
          <i key={x}>{x}</i>
        ))}
      </span>
    );
  if (v === "ref")
    return (
      <span className="ds-art ds-art-ref">
        <i className="ds-art-row">
          GLICEMIA <b>92</b>
        </i>
        <i className="ds-art-bar">
          <s />
        </i>
      </span>
    );
  if (v === "gui")
    return (
      <span className="ds-art ds-art-gui">
        <i>Emocromo</i>
        <i>TSH</i>
        <i>Ferritina</i>
        <i>PCR</i>
      </span>
    );
  return (
    <span className="ds-art ds-art-int">
      <i>Vitamina D</i>
      <i>Ferro</i>
      <i>Omega-3</i>
    </span>
  );
}
