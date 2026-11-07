import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { IllustrationLost } from "@/components/brand/illustrations";

export default function NotFound() {
  return (
    <div className="container-rc grid min-h-[60vh] items-center gap-10 py-16 lg:grid-cols-[1fr_0.8fr] lg:py-24">
      <div>
        <p className="eyebrow">Errore 404</p>
        <h1 className="display-lg mt-3">Questa pagina non esiste.</h1>
        <p className="mt-4 max-w-xl text-lg text-muted">Forse il collegamento è cambiato. Puoi tornare alla home o provare il referto di esempio.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="btn btn-primary">
            Torna alla home
          </Link>
          <Link href="/esempio" className="btn btn-secondary">
            Referto di esempio <ArrowRight aria-hidden className="h-4 w-4" />
          </Link>
        </div>
      </div>
      <div className="rise-in-2 float-soft mx-auto w-full max-w-[360px]">
        <IllustrationLost />
      </div>
    </div>
  );
}
