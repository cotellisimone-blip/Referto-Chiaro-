import { OG_SIZE, ogImage } from "@/lib/og";

export const alt = "Capisci il tuo referto · Cura Privata";
export const size = OG_SIZE;
export const contentType = "image/png";

/** Ciclo 3, fase 3: immagine di condivisione della pagina (WhatsApp, Facebook). */
export default function OpenGraphImage() {
  return ogImage({ eyebrow: "Capisci il tuo referto", title: "Il tuo referto,", accent: "finalmente leggibile.", lead: "Valori, sigle e domande per il medico, in parole semplici.", color: "#00756F" });
}
