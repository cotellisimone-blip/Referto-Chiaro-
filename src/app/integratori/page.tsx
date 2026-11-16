import type { Metadata } from "next";
import { Jar } from "@/components/wow/jar";
import Link from "next/link";
import { PercorsoSezioni } from "@/components/sezioni/parts";
import { ArrowRight, ShieldAlert } from "lucide-react";
import { INTEGRATORI, INTEGRATORI_COLORS, INTEGRATORI_GROUPS, INTEGRATORI_PRIMA_DI_TUTTO, type IntegratoreGroup } from "@/content/integratori";
import { NOINDEX_DRAFT, indexingEnabled } from "@/lib/seo";
import "@/components/home/tre-momenti.css";
import "@/components/sezioni/sezioni.css";

export const metadata: Metadata = {
  title: "Guide agli integratori",
  description: "Vitamina D, ferro, B12, acido folico, magnesio, omega-3, probiotici e multivitaminici: che cosa sono, quale esame li riguarda e che cosa chiedere al medico.",
  alternates: { canonical: "/integratori" },
  // Schede in bozza: fuori dai motori finché un medico non le ha riviste (come le guide in bozza).
  ...(indexingEnabled() ? { robots: NOINDEX_DRAFT } : {}),
};

/** Guide agli integratori (sezione Prevenzione, 15/11/2026). Bozze da revisione medica: spiegano, non consigliano. */
export default function IntegratoriPage() {
  const groups = Object.keys(INTEGRATORI_GROUPS) as IntegratoreGroup[];
  return (
    <div className="tm ds">
      <section className="ds-ph ds-ph-1 ds-ph-short" aria-labelledby="int-titolo">
        <div className="tm-wrap">
          <PercorsoSezioni current={1} />
          <p className="ds-sec-tag ds-sec-tag-1">
            <span>1</span> Guide agli integratori
          </p>
          <h1 id="int-titolo">
            Integratori: <em>prima capire,</em> poi chiedere.
          </h1>
          <p className="tm-lead ds-ph-lead">
            {INTEGRATORI.length} schede in parole semplici: che cos’è, dove si trova, perché se ne parla, quale esame del referto lo riguarda e che cosa chiedere al
            medico. Mai quanto prenderne: quello lo decide il medico.
          </p>
          <div className="ds-rule ds-rule-in">
            <ShieldAlert aria-hidden className="tm-ic" />
            <div>
              <h2>Prima di tutto</h2>
              <ul>
                {INTEGRATORI_PRIMA_DI_TUTTO.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      {groups.map((g) => (
        <section key={g} className="ds-sec-light ds-sec-tight" aria-labelledby={`int-${g}`}>
          <div className="tm-wrap">
            <h2 id={`int-${g}`} className="ds-h3">
              {INTEGRATORI_GROUPS[g]}
            </h2>
            <ul className="ds-ints ds-ints-list">
              {INTEGRATORI.filter((i) => i.group === g).map((i) => {
                const [c, d] = INTEGRATORI_COLORS[i.slug] ?? ["#F6B98E", "#A4471F"];
                return (
                  <li key={i.slug}>
                    <Link href={`/integratori/${i.slug}`} className="ds-int">
                      <Jar c={c} d={d} />
                      <span className="ds-int-t">{i.name}</span>
                      <span className="ds-int-d">{i.oneLine}</span>
                      <span className="ds-int-go">
                        Leggi la scheda <ArrowRight aria-hidden className="tm-ic" />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      ))}
      <section className="ds-sec-light ds-sec-tight">
        <div className="tm-wrap">
          <p className="tm-note">Schede in bozza, in attesa della revisione di un medico. Le fonti sono indicate in ogni scheda.</p>
        </div>
      </section>
    </div>
  );
}
