import { OG_SIZE, ogImage } from "@/lib/og";

export const alt = "Lettura referti: il tuo referto, in parole semplici · Cura Privata";
export const size = OG_SIZE;
export const contentType = "image/png";

/** Ciclo 3, fase 3: immagine di condivisione della pagina (WhatsApp, Facebook). */
export default function OpenGraphImage() {
  return ogImage({ eyebrow: "2 · Lettura referti", title: "Il tuo referto,", accent: "in parole semplici.", lead: "Riga per riga: che cosa misura ogni esame e dove sta il tuo numero.", color: "#00756F" });
}
