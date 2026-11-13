import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = { title: "Modelli di home", robots: { index: false, follow: false } };

const MODELLI = [
  { id: "a", name: "A · Sportello", d: "Si apre con una domanda, «Di che cosa hai bisogno oggi?», e quattro risposte grandi. Sotto, tutto il catalogo in quattro colonne ordinate con i prezzi. Il più chiaro e il più veloce: per chi arriva con un bisogno preciso." },
  { id: "b", name: "B · Racconto", d: "Una storia in quattro capitoli lungo un filo: prima di tutto (gratis), arriva un referto, quando serve una persona, negli anni per chi ami. Ogni capitolo ha un pezzo vero di prodotto e i suoi servizi. Il più caldo: ci si riconosce in un momento." },
  { id: "c", name: "C · Vetrina", d: "Il più audace. Apertura scura con un titolo enorme e pezzi di prodotto sospesi, poi un mosaico di tessere: ogni servizio con il suo oggetto (report, mappa della visita, videochiamata, sintesi firmata, grafico) e il prezzo. Fa vedere in un colpo d'occhio quanto c'è." },
];

export default function Modelli() {
  return (
    <>
      <PageHeader eyebrow="Da approvare" title="Tre modelli di home." lead="Stessa offerta, stessi prezzi, tre modi diversi di presentarla. Il piano Famiglia non è in primo piano in nessuno dei tre. Si sceglie un modello, poi lo rifiniamo." />
      <section className="section-tight">
        <ul className="container-rc grid gap-5 lg:grid-cols-3">
          {MODELLI.map((m) => (
            <li key={m.id} className="fam-pillar">
              <h2 className="text-[1.5rem] font-extrabold text-ink">{m.name}</h2>
              <p className="text-[1.0625rem] leading-relaxed text-ink-soft">{m.d}</p>
              <Link href={`/modelli-home/${m.id}`} className="btn btn-primary mt-auto self-start">
                Apri il modello {m.id.toUpperCase()} <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
