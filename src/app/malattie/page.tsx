import type { Metadata } from "next";
import { MalattieIndice } from "@/components/malattie/indice";
import { MALATTIE } from "@/content/malattie";
import { absoluteUrl, jsonLd, SITE_URL, breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Malattie comuni spiegate bene, con le fonti",
  description: "Pressione alta, diabete, mal di testa, insonnia, peso, asma, colesterolo, tiroide, anemia, fegato grasso: che cosa sono, gli esami e cosa chiedere al medico.",
  alternates: { canonical: absoluteUrl("/malattie") },
};

/** Sezione «Malattie» (22/11/2026): le dieci aree. */
export default function MalattiePage() {
  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Malattie",
      url: absoluteUrl("/malattie"),
      inLanguage: "it-IT",
      isPartOf: { "@type": "WebSite", name: "Cura Privata", url: SITE_URL },
      hasPart: MALATTIE.map((m) => ({ "@type": "MedicalWebPage", name: m.nome, url: absoluteUrl(`/malattie/${m.slug}`) })),
    },
    breadcrumbLd([{ name: "Malattie", path: "/malattie" }]),
  ];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(ld) }} />
      <MalattieIndice />
    </>
  );
}
