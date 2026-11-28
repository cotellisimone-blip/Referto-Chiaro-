import { OG_SIZE, ogImage } from "@/lib/og";

export const alt = "Cura Privata — Conosciti. Capisci. Prenditi cura di te.";
export const size = OG_SIZE;
export const contentType = "image/png";

/** Immagine social generata dal simbolo e dal carattere del sito (nessuna foto di stock, nessun claim). */
export default function OpenGraphImage() {
  return ogImage({ eyebrow: "La tua salute, in cinque passi", title: "Conosciti. Capisci.", accent: "Prenditi cura di te.", lead: "Poche domande su di te, gli esami da conoscere, il referto spiegato, un medico in video, sonno e alimentazione." });
}
