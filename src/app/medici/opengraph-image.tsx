import { OG_SIZE, ogImage } from "@/lib/og";
import { mediciEnabled } from "@/lib/medici";

export const alt = "Medici: un medico, quando serve · Cura Privata";
export const size = OG_SIZE;
export const contentType = "image/png";

/** 17/11/2026 (20 interventi, punto 14). Con i medici spenti l'immagine dice «In arrivo», come la pagina. */
export default function OpenGraphImage() {
  const attivo = mediciEnabled();
  return ogImage({
    eyebrow: attivo ? "3 · Medici" : "3 · Medici · In arrivo",
    title: "Un medico,",
    accent: "quando serve.",
    lead: attivo ? "In video, a casa o per un secondo parere. Per esigenze non urgenti." : "In video, a casa o per un secondo parere. Lascia l'email: ti avvisiamo.",
    color: "#A4471F",
  });
}
