import { OG_SIZE, ogImage } from "@/lib/og";

export const alt = "Parla con un medico · Cura Privata";
export const size = OG_SIZE;
export const contentType = "image/png";

/** Ciclo 3, fase 3: immagine di condivisione della pagina (WhatsApp, Facebook). */
export default function OpenGraphImage() {
  return ogImage({ eyebrow: "Parla con un medico", title: "Non sai quale specialista ti serve?", accent: "Parti da un medico.", lead: "Un videoconsulto con un medico che ha già letto i tuoi documenti.", color: "#9A4F1C" });
}
