import { OG_SIZE, ogImage } from "@/lib/og";

export const alt = "Capisci il referto: il tuo referto, in parole semplici · Cura Privata";
export const size = OG_SIZE;
export const contentType = "image/png";

/** Ciclo 3, fase 3: immagine di condivisione della pagina (WhatsApp, Facebook). */
export default function OpenGraphImage() {
  return ogImage({ eyebrow: "3 · Capisci il referto", title: "Il tuo referto,", accent: "in parole semplici.", lead: "Riga per riga: che cosa misura ogni esame e dove sta il tuo numero.", color: "#00756F" });
}
