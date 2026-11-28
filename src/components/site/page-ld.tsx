import type { Metadata } from "next";
import { capisciPriceCents, publicPricesEnabled } from "@/domain/offerta";
import { absoluteUrl, breadcrumbLd, jsonLd, SITE_URL } from "@/lib/seo";

/**
 * 18/11/2026 (secondo giro, punto 17): dati strutturati per le pagine che non ne avevano. Dicono ai motori solo quello
 * che la pagina mostra: nome, descrizione, posizione nel sito; le domande e i prezzi solo dove sono scritti in pagina.
 * Niente recensioni, niente voti, niente organizzazione senza i dati veri del titolare (quella sta in layout.tsx).
 */
const titleOf = (m: Metadata, fallback: string): string => {
  const t = m.title;
  if (typeof t === "string") return t;
  if (t && typeof t === "object" && "absolute" in t && typeof t.absolute === "string") return t.absolute;
  return fallback;
};

export type LdOffer = { name: string; cents: number; description?: string };

export function PageLd({
  path,
  meta,
  name,
  trail = [],
  faq,
  service,
}: {
  path: string;
  meta: Metadata;
  /** Nome breve per le briciole (se diverso dal titolo). */
  name?: string;
  /** Pagine sopra questa, dalla più alta. */
  trail?: { name: string; path: string }[];
  faq?: { q: string; a: string }[];
  service?: { name: string; description: string; offers: LdOffer[] };
}) {
  const title = titleOf(meta, "Cura Privata");
  const home = path === "/";
  const data: unknown[] = [];
  if (home) {
    data.push({ "@context": "https://schema.org", "@type": "WebSite", name: "Cura Privata", url: SITE_URL, inLanguage: "it-IT", description: typeof meta.description === "string" ? meta.description : undefined });
  } else {
    data.push({
      "@context": "https://schema.org",
      "@type": faq ? "FAQPage" : "WebPage",
      name: title,
      url: absoluteUrl(path),
      inLanguage: "it-IT",
      ...(typeof meta.description === "string" ? { description: meta.description } : {}),
      isPartOf: { "@type": "WebSite", name: "Cura Privata", url: SITE_URL },
      ...(faq ? { mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) } : {}),
    });
    data.push(breadcrumbLd([...trail, { name: name ?? title, path }]));
  }
  if (service && service.offers.length) {
    data.push({
      "@context": "https://schema.org",
      "@type": "Service",
      name: service.name,
      description: service.description,
      areaServed: "IT",
      url: absoluteUrl(path),
      offers: service.offers.map((o) => ({
        "@type": "Offer",
        name: o.name,
        price: (o.cents / 100).toFixed(2),
        priceCurrency: "EUR",
        ...(o.description ? { description: o.description } : {}),
        url: absoluteUrl(path),
      })),
    });
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(data) }} />;
}

/** Il servizio che si compra oggi, con i due prezzi scritti in pagina (dal listino: mai a mano). Senza prezzi pubblici, niente offerte. */
export function capisciServiceLd() {
  if (!publicPricesEnabled()) return undefined;
  return {
    name: "Capisci il referto",
    description: "Spiegazione informativa, in parole semplici, di un referto di laboratorio. Automatica, senza medico: non è una diagnosi.",
    offers: [
      { name: "Primo referto", cents: capisciPriceCents(true), description: "Una volta per cliente." },
      { name: "Ogni referto successivo", cents: capisciPriceCents(false) },
    ],
  };
}
