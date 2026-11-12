import { OG_SIZE, ogImage } from "@/lib/og";

export const alt = "Chiedi un secondo parere · Cura Privata";
export const size = OG_SIZE;
export const contentType = "image/png";

/** Ciclo 3, fase 3: immagine di condivisione della pagina (WhatsApp, Facebook). */
export default function OpenGraphImage() {
  return ogImage({ eyebrow: "Chiedi un secondo parere", title: "Un'altra valutazione,", accent: "da uno specialista.", lead: "Un parere scritto, sui documenti che scegli di condividere.", color: "#24618A" });
}
