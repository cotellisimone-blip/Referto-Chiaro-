import { OG_SIZE, ogImage } from "@/lib/og";
import { AUTOVALUTAZIONI, SONNO_PAGINE, getAutovalutazione, getSonnoPagina } from "@/content/sonno";

export const alt = "Il sonno, spiegato bene · Cura Privata";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return [...SONNO_PAGINE.map((p) => p.slug), ...AUTOVALUTAZIONI.map((a) => a.slug)].map((argomento) => ({ argomento }));
}

/** 22/11/2026: l'immagine di condivisione delle pagine della sezione sonno. */
export default async function OpenGraphImage({ params }: { params: Promise<{ argomento: string }> }) {
  const { argomento } = await params;
  const p = getSonnoPagina(argomento);
  const a = p ? undefined : getAutovalutazione(argomento);
  const title = p ? p.porta : a ? a.titolo : "Il sonno";
  const lead = a ? "Domande scritte da noi, con le fonti. Non danno una diagnosi." : "Il problema, i conti del diario e le domande per il medico.";
  return ogImage({ eyebrow: "Il sonno, spiegato bene", title, lead, color: "#0C3340" });
}
