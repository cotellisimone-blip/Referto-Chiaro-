import { OG_SIZE, ogImage } from "@/lib/og";
import { MALATTIE, getMalattia } from "@/content/malattie";

export const alt = "Malattie spiegate bene · Cura Privata";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return MALATTIE.map((x) => ({ slug: x.slug }));
}

/** 22/11/2026: l'immagine di condivisione di ogni pagina della sezione «Malattie», con il nome comune. */
export default async function OpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const x = getMalattia(slug);
  return ogImage({ eyebrow: "Malattie spiegate bene", title: x ? x.nome : "Cura Privata", lead: "Che cos'è, gli esami, quando chiamare e le domande per il medico.", color: "#0C3340" });
}
