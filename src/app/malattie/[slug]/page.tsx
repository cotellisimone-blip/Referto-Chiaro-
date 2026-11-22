import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MalattiaPagina } from "@/components/malattie/pagina";
import { MALATTIE, getMalattia } from "@/content/malattie";
import { NOINDEX_DRAFT, absoluteUrl, breadcrumbLd, indexingEnabled, jsonLd, malattiaIndexable, pageTitle } from "@/lib/seo";

export function generateStaticParams() {
  return MALATTIE.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: PageProps<"/malattie/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const m = getMalattia(slug);
  if (!m) return {};
  return {
    title: pageTitle(m.seoTitle),
    description: m.metaDescription,
    alternates: { canonical: absoluteUrl(`/malattie/${m.slug}`) },
    openGraph: { title: m.seoTitle, description: m.metaDescription, type: "article", locale: "it_IT" },
    // Bozza: visibile alle persone, fuori da Google anche con l'interruttore acceso, finché un medico non la rivede.
    ...(indexingEnabled() && !malattiaIndexable(m) ? { robots: NOINDEX_DRAFT } : {}),
  };
}

/**
 * Una pagina di malattia (22/11/2026). Dati strutturati: MedicalWebPage con l'argomento (MedicalCondition). Il revisore
 * e la data di revisione compaiono SOLO quando un medico ha rivisto la pagina: non si dichiara a Google ciò che non c'è.
 */
export default async function MalattiaPage({ params }: PageProps<"/malattie/[slug]">) {
  const { slug } = await params;
  const m = getMalattia(slug);
  if (!m) notFound();
  const url = absoluteUrl(`/malattie/${m.slug}`);
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
      { name: "Malattie", path: "/malattie" },
      { name: m.area, path: `/malattie/${m.slug}` },
    ]),
  ];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(ld) }} />
      <MalattiaPagina m={m} />
    </>
  );
}
