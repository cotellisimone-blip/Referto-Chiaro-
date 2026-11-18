import { OG_SIZE, ogImage } from "@/lib/og";
import { GLOSSARY, getGlossaryEntry } from "@/content/glossario";

export const alt = "Una parola del referto, spiegata · Cura Privata";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return GLOSSARY.map((x) => ({ slug: x.slug }));
}

/** 18/11/2026 (secondo giro, punto 16): un'immagine di condivisione per pagina (WhatsApp, Facebook), con il titolo. */
export default async function OpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const x = getGlossaryEntry(slug);
  return ogImage({ eyebrow: "Glossario dei referti", title: x ? x.term : "Cura Privata", lead: "Che cosa vuol dire, in parole semplici." });
}
