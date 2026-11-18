import { cheCose } from "@/lib/italiano";
import { OG_SIZE, ogImage } from "@/lib/og";
import { INTEGRATORI, getIntegratore } from "@/content/integratori";

export const alt = "Guida a un integratore · Cura Privata";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return INTEGRATORI.map((x) => ({ slug: x.slug }));
}

/** 18/11/2026 (secondo giro, punto 16): un'immagine di condivisione per pagina (WhatsApp, Facebook), con il titolo. */
export default async function OpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const x = getIntegratore(slug);
  return ogImage({ eyebrow: "Guide agli integratori", title: x ? x.name : "Cura Privata", lead: `${x && cheCose(x.name) === "che cosa sono" ? "Che cosa sono" : "Che cos'è"}, che cosa dicono le fonti e che cosa chiedere.`, color: "#0C3340" });
}
