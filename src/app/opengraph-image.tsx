import { OG_SIZE, ogImage } from "@/lib/og";

export const alt = "Cura Privata — la tua salute, più chiara e accessibile";
export const size = OG_SIZE;
export const contentType = "image/png";

/** Immagine social generata dal simbolo e dal carattere del sito (nessuna foto di stock, nessun claim). */
export default function OpenGraphImage() {
  return ogImage({ title: "La tua salute,", accent: "più chiara e accessibile.", lead: "Comprendi il linguaggio dei tuoi referti e prepara le domande per il tuo medico." });
}
