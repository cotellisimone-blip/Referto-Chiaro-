import { OG_SIZE, ogImage } from "@/lib/og";

export const alt = "Malattie spiegate bene · Cura Privata";
export const size = OG_SIZE;
export const contentType = "image/png";

/** 22/11/2026: l'immagine di condivisione dell'indice «Malattie». */
export default async function OpenGraphImage() {
  return ogImage({ eyebrow: "Gratis", title: "Le malattie più comuni, spiegate bene", lead: "Dieci aree, in parole semplici e con le fonti.", color: "#0C3340" });
}
