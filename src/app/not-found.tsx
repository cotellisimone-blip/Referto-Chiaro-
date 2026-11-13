import Link from "next/link";
import { ArrowRight, BookOpenText, Compass, Home, LayoutGrid, MessageCircleQuestionMark, Search } from "lucide-react";
import { HeroTiles } from "@/components/ui/page-header";
import { LinkCards } from "@/components/ui/link-cards";

const ELSEWHERE = [
  { icon: LayoutGrid, title: "I servizi", href: "/servizi", text: "Dal referto al medico, un passo alla volta.", go: "Vedi" },
  { icon: BookOpenText, title: "Guide agli esami", href: "/guide", text: "Che cosa misura un esame e come si legge.", go: "Leggi" },
  { icon: MessageCircleQuestionMark, title: "Domande frequenti", href: "/domande-frequenti", text: "Prezzi, tempi, dati: le risposte dirette.", go: "Leggi" },
];

export default function NotFound() {
  return (
    <>
      <section aria-labelledby="nf-titolo" className="page-hero">
        <div className="container-rc page-hero-inner page-hero-flat page-hero-split">
          <div>
            <p className="eyebrow">Errore 404</p>
            <h1 id="nf-titolo" className="page-title mt-4">
              Questa pagina non esiste.
            </h1>
            <p className="lead mt-5 max-w-[36rem]">Forse il collegamento è cambiato. Nessun problema: da qui riparti.</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/" className="btn btn-primary btn-lg">
                Torna alla home
              </Link>
              <Link href="/referti/esempio" className="btn btn-secondary btn-lg">
                Guarda un referto di esempio <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
              </Link>
            </div>
          </div>
          <HeroTiles icons={[Compass, Home, Search]} />
        </div>
      </section>
      <section aria-label="Altre pagine utili" className="section">
        <div className="container-rc">
          <LinkCards items={ELSEWHERE} />
        </div>
      </section>
    </>
  );
}
