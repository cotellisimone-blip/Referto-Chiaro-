import Link from "next/link";
import { ArrowRight, BellRing, BookOpen, Compass, Pill } from "lucide-react";
import { puntoDiPartenzaEnabled } from "@/lib/feature-flags";
import { EXAM_GUIDE_COUNT } from "@/content/guides";
import { INTEGRATORI } from "@/content/integratori";

/** Le quattro cose della sezione 1 «Prevenzione», con un piccolo disegno ciascuna. Usate in home e in /prevenzione. */
export function PrevenzioneCards() {
  const items = [
    ...(puntoDiPartenzaEnabled()
      ? [{ href: "/punto-di-partenza", icon: Compass, k: "Gratis · 2 minuti", t: "Quali esami conoscere", d: "Il primo controllo: 10 aree della salute da conoscere e una scheda da portare al medico.", v: "pdp" }]
      : []),
    { href: "/guide", icon: BookOpen, k: "Gratis", t: "Guide agli esami", d: `${EXAM_GUIDE_COUNT} esami spiegati: a che cosa servono, come si fanno, come si leggono. Con le fonti.`, v: "gui" },
    { href: "/integratori", icon: Pill, k: "Gratis · nuovo", t: "Guide agli integratori", d: `${INTEGRATORI.length} schede: vitamina D, ferro, omega-3 e altri. Che cosa sono e che cosa chiedere.`, v: "int" },
    { href: "/famiglia", icon: BellRing, k: "Gratis", t: "Promemoria dei controlli", d: "Segna quando rifare un esame, per te e per i tuoi cari: te lo ricordiamo noi.", v: "pro" },
  ];
  return (
    <ul className={`ds-cards${items.length === 3 ? " ds-cards-3" : ""}`}>
      {items.map(({ href, icon: Icon, k, t, d, v }) => (
        <li key={href}>
          <Link href={href} className={`ds-card ds-card-${v}`}>
            <span className="ds-card-art" aria-hidden>
              <CardArt v={v} />
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
function CardArt({ v }: { v: string }) {
  if (v === "pdp")
    return (
      <span className="ds-art ds-art-pdp">
        <i>Cuore e pressione</i>
        <i>Zuccheri</i>
        <i>Vista</i>
      </span>
    );
  if (v === "pro")
    return (
      <span className="ds-art ds-art-pdp ds-art-pro">
        <i>Esami del sangue · marzo</i>
        <i>Vista · giugno</i>
        <i>Pressione · ottobre</i>
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
