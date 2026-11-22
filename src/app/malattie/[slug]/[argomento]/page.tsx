import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SonnoPaginaView } from "@/components/sonno/pagina";
import { AutovalutazioneView } from "@/components/sonno/autovalutazione";
import { AUTOVALUTAZIONI, SONNO_PAGINE, getAutovalutazione, getSonnoPagina } from "@/content/sonno";
import { NOINDEX_DRAFT, absoluteUrl, breadcrumbLd, indexingEnabled, jsonLd, malattiaIndexable, pageTitle } from "@/lib/seo";

/**
 * Sezione sonno (22/11/2026): /malattie/sonno/{argomento}. Per ora solo l'area sonno ha pagine figlie; le altre aree
 * danno 404. Bozze: fuori da Google finché un medico non le firma, anche con l'indicizzazione accesa.
 */

export function generateStaticParams() {
  return [...SONNO_PAGINE.map((p) => p.slug), ...AUTOVALUTAZIONI.map((a) => a.slug)].map((argomento) => ({ slug: "sonno", argomento }));
}

function trova(slug: string, argomento: string) {
  if (slug !== "sonno") return null;
  const p = getSonnoPagina(argomento);
  if (p) return { tipo: "pagina" as const, p };
  const a = getAutovalutazione(argomento);
  if (a) return { tipo: "autovalutazione" as const, a };
  return null;
}

export async function generateMetadata({ params }: PageProps<"/malattie/[slug]/[argomento]">): Promise<Metadata> {
  const { slug, argomento } = await params;
  const x = trova(slug, argomento);
  // notFound() anche qui: i metadati si risolvono prima dello streaming, così l'indirizzo sbagliato risponde 404.
  if (!x) notFound();
  const v = x.tipo === "pagina" ? x.p : x.a;
  return {
    title: pageTitle(v.seoTitle),
    description: v.metaDescription,
    alternates: { canonical: absoluteUrl(`/malattie/sonno/${argomento}`) },
    openGraph: { title: v.seoTitle, description: v.metaDescription, type: "article", locale: "it_IT" },
    ...(indexingEnabled() && !malattiaIndexable(v) ? { robots: NOINDEX_DRAFT } : {}),
  };
}

export default async function SonnoArgomentoPage({ params }: PageProps<"/malattie/[slug]/[argomento]">) {
  const { slug, argomento } = await params;
  const x = trova(slug, argomento);
  if (!x) notFound();
  const v = x.tipo === "pagina" ? x.p : x.a;
  const url = absoluteUrl(`/malattie/sonno/${argomento}`);
  const rivista = v.revisione.stato === "rivista" ? v.revisione : null;
  const ld: object[] = [
    {
      "@context": "https://schema.org",
      "@type": "MedicalWebPage",
      name: v.seoTitle,
      headline: `${v.titolo} ${v.em}`,
      description: v.metaDescription,
      url,
      inLanguage: "it-IT",
      dateModified: v.aggiornato,
      audience: { "@type": "PeopleAudience", audienceType: "Pazienti e familiari" },
      about: { "@type": "MedicalCondition", name: "Disturbi del sonno" },
      citation: v.fonti.map((f) => ({ "@type": "CreativeWork", name: f.titolo, url: f.url, publisher: f.ente })),
      publisher: { "@type": "Organization", name: "Cura Privata" },
      ...(rivista ? { lastReviewed: rivista.data, reviewedBy: { "@type": "Person", name: rivista.medico, jobTitle: rivista.qualifica, description: rivista.ordine } } : {}),
    },
    breadcrumbLd([
      { name: "Malattie", path: "/malattie" },
      { name: "Sonno", path: "/malattie/sonno" },
      { name: v.porta, path: `/malattie/sonno/${argomento}` },
    ]),
  ];
  if (x.tipo === "pagina" && x.p.faq.length)
    ld.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: x.p.faq.map((f) => ({ "@type": "Question", name: f.d, acceptedAnswer: { "@type": "Answer", text: f.r } })),
    });
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(ld) }} />
      {x.tipo === "pagina" ? <SonnoPaginaView p={x.p} /> : <AutovalutazioneView a={x.a} />}
    </>
  );
}
