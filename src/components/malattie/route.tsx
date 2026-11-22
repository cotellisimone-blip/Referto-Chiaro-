import type { Metadata } from "next";
import { MalattiaPagina } from "@/components/malattie/pagina";
import { malattiaHref, type Malattia } from "@/content/malattie";
import { NOINDEX_DRAFT, absoluteUrl, breadcrumbLd, indexingEnabled, jsonLd, malattiaIndexable, pageTitle } from "@/lib/seo";

/**
 * Metadati e corpo di una pagina di malattia, comuni a /malattie/{slug} e (22/11/2026) a /prenditi-cura-di-te/sonno,
 * dove il sonno si è spostato. L'indirizzo canonico viene da malattiaHref.
 */
export function malattiaMetadata(m: Malattia): Metadata {
  return {
    title: pageTitle(m.seoTitle),
    description: m.metaDescription,
    alternates: { canonical: absoluteUrl(malattiaHref(m.slug)) },
    openGraph: { title: m.seoTitle, description: m.metaDescription, type: "article", locale: "it_IT" },
    // Bozza: visibile alle persone, fuori da Google anche con l'interruttore acceso, finché un medico non la rivede.
    ...(indexingEnabled() && !malattiaIndexable(m) ? { robots: NOINDEX_DRAFT } : {}),
  };
}

export function MalattiaRoute({ m }: { m: Malattia }) {
  const url = absoluteUrl(malattiaHref(m.slug));
  const rivista = m.revisione.stato === "rivista" ? m.revisione : null;
  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "MedicalWebPage",
      name: m.seoTitle,
      headline: `${m.titolo} ${m.em}`,
      description: m.metaDescription,
      url,
      inLanguage: "it-IT",
      dateModified: m.aggiornato,
      audience: { "@type": "PeopleAudience", audienceType: "Pazienti e familiari" },
      about: { "@type": "MedicalCondition", name: m.nomeMedico, alternateName: [m.nome, ...m.altriNomi] },
      citation: m.fonti.map((f) => ({ "@type": "CreativeWork", name: f.titolo, url: f.url, publisher: f.ente })),
      publisher: { "@type": "Organization", name: "Cura Privata" },
      ...(rivista
        ? { lastReviewed: rivista.data, reviewedBy: { "@type": "Person", name: rivista.medico, jobTitle: rivista.qualifica, description: rivista.ordine } }
        : {}),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: m.faq.map((f) => ({ "@type": "Question", name: f.d, acceptedAnswer: { "@type": "Answer", text: f.r } })),
    },
    breadcrumbLd([
      m.slug === "sonno" ? { name: "Prenditi cura di te", path: "/prenditi-cura-di-te" } : { name: "Malattie", path: "/malattie" },
      { name: m.area, path: malattiaHref(m.slug) },
    ]),
  ];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(ld) }} />
      <MalattiaPagina m={m} />
    </>
  );
}
