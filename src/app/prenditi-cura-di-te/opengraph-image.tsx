import { OG_SIZE, ogImage } from "@/lib/og";

export const alt = "Prenditi cura di te · Cura Privata";
export const size = OG_SIZE;
export const contentType = "image/png";

/** 22/11/2026: l immagine di condivisione del passo 5, «Prenditi cura di te». */
export default async function OpenGraphImage() {
  return ogImage({ eyebrow: "Prenditi cura di te", title: "Quello che puoi migliorare, da oggi", lead: "Sonno, alimentazione, intestino, integratori: percorsi guidati e un foglio per il medico.", color: "#0C3340" });
}
