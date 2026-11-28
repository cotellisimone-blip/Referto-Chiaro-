import { OG_SIZE, ogImage } from "@/lib/og";

export const alt = "Referto di esempio · Cura Privata";
export const size = OG_SIZE;
export const contentType = "image/png";

/** Ciclo 3, fase 3: immagine di condivisione della pagina (WhatsApp, Facebook). */
export default function OpenGraphImage() {
  return ogImage({ eyebrow: "Prova senza registrarti", title: "Un referto di esempio,", accent: "spiegato riga per riga.", lead: "Dati inventati: guarda come funziona prima di usarlo.", color: "#00756F" });
}
