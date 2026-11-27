import { OG_SIZE, ogImage } from "@/lib/og";

export const alt = "Gli esami per te: la prevenzione, spiegata semplice · Cura Privata";
export const size = OG_SIZE;
export const contentType = "image/png";

/** 17/11/2026 (20 interventi, punto 14): ogni sezione ha la sua immagine di condivisione (WhatsApp, Facebook). */
export default function OpenGraphImage() {
  return ogImage({ eyebrow: "Passo 2 · Gli esami per te", title: "La prevenzione,", accent: "spiegata semplice.", lead: "Quali esami conoscere, le guide e i promemoria. Gratis, senza registrarti.", color: "#0C3340" });
}
