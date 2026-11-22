import { OG_SIZE, ogImage } from "@/lib/og";

export const alt = "Il sonno, spiegato bene · Cura Privata";
export const size = OG_SIZE;
export const contentType = "image/png";

/** 22/11/2026: l'immagine di condivisione dell'area Sonno di «Prenditi cura di te». */
export default async function OpenGraphImage() {
  return ogImage({ eyebrow: "Prenditi cura di te", title: "Il sonno", lead: "Da dove parti, il percorso di due settimane e un foglio per il medico.", color: "#0C3340" });
}
