import Link from "next/link";
import { ArrowRight, BookOpen, Compass, FileText, Pill } from "lucide-react";
import { puntoDiPartenzaEnabled } from "@/lib/feature-flags";
import { GUIDES } from "@/content/guides";
import { INTEGRATORI } from "@/content/integratori";
import { coreService, firstPromoEnabled, firstRefertoCents, formatEuro, priceCents, publicPricesEnabled } from "@/domain/offerta";

/** Le quattro cose della sezione «Online», con un piccolo disegno ciascuna. Usate in home e in /online. */
export function OnlineCards() {
  const prices = publicPricesEnabled();
  const promo = firstPromoEnabled() && firstRefertoCents() < priceCents("capisci");
  const std = formatEuro(priceCents("capisci"));
  const first = formatEuro(firstRefertoCents());
  const items = [
    ...(puntoDiPartenzaEnabled()
      ? [{ href: "/punto-di-partenza", icon: Compass, k: "Gratis", t: "Primo controllo", d: "Non hai esami recenti? 10 aree da conoscere e una scheda da portare al medico.", v: "pdp" }]
      : []),
    {
      href: coreService("capisci").href,
      icon: FileText,
      k: prices ? (promo ? `Il primo ${first}` : `${std} a referto`) : "Il servizio principale",
      t: "Il tuo referto, spiegato",
      d: "Carichi il referto, controlli i valori, lo leggi in parole semplici. Di norma in pochi minuti.",
      v: "ref",
    },
    { href: "/guide", icon: BookOpen, k: "Gratis", t: "Guide agli esami", d: `${GUIDES.length} esami spiegati: che cosa misurano e come si leggono, con le fonti.`, v: "gui" },
    { href: "/integratori", icon: Pill, k: "Gratis · nuovo", t: "Guide agli integratori", d: `${INTEGRATORI.length} schede: vitamina D, ferro, omega-3 e altri. Che cosa sono e che cosa chiedere.`, v: "int" },
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
