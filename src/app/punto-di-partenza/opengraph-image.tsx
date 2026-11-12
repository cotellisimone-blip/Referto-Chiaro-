import { OG_SIZE, ogImage } from "@/lib/og";

export const alt = "Punto di Partenza · Cura Privata";
export const size = OG_SIZE;
export const contentType = "image/png";

/** Ciclo 3, fase 3: immagine di condivisione della pagina (WhatsApp, Facebook). */
export default function OpenGraphImage() {
  return ogImage({ eyebrow: "Gratis", title: "Conosci meglio la tua salute.", accent: "Parti da qui.", lead: "Un percorso guidato per capire che cosa chiedere al medico.", color: "#00756F" });
}
