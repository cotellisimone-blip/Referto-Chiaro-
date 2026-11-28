import { OG_SIZE, ogImage } from "@/lib/og";
import { GUIDES, getGuide } from "@/content/guides";

export const alt = "Guida all'esame · Cura Privata";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return GUIDES.map((x) => ({ slug: x.slug }));
}

/** 18/11/2026 (secondo giro, punto 16): un'immagine di condivisione per pagina (WhatsApp, Facebook), con il titolo. */
export default async function OpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const x = getGuide(slug);
  return ogImage({ eyebrow: "Guide agli esami", title: x ? x.examName : "Cura Privata", lead: "Che cos'è, come si legge e che cosa chiedere al medico.", color: "#0C3340" });
}
