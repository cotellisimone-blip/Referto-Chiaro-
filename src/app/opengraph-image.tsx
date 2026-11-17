import { OG_SIZE, ogImage } from "@/lib/og";

export const alt = "Cura Privata — Previeni. Capisci. Un medico, se serve.";
export const size = OG_SIZE;
export const contentType = "image/png";

/** Immagine social generata dal simbolo e dal carattere del sito (nessuna foto di stock, nessun claim). */
export default function OpenGraphImage() {
  return ogImage({ eyebrow: "La tua salute, in tre passi", title: "Previeni. Capisci.", accent: "Un medico, se serve.", lead: "Quali esami conoscere, il tuo referto in parole semplici, un medico quando serve." });
}
