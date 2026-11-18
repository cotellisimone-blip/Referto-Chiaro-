"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight, RotateCw } from "lucide-react";

/**
 * 18/11/2026 (secondo giro, punto 6): la pagina che compare quando qualcosa si rompe mentre si prepara una pagina.
 * Prima non c'era: compariva la schermata tecnica del framework, in inglese. Qui: che cosa è successo in una riga,
 * «Riprova» (che rifà solo la parte rotta, senza ricaricare il sito), e due strade per ripartire.
 * Non mostra mai il testo dell'errore: può contenere dettagli tecnici. Resta solo il codice breve, utile all'assistenza.
 */
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <section aria-labelledby="err-titolo" className="page-hero">
      <div className="container-rc page-hero-inner page-hero-flat">
        <div role="alert">
          <p className="eyebrow">Qualcosa non ha funzionato</p>
          <h1 id="err-titolo" className="page-title mt-4">
            Questa pagina non si è aperta.
          </h1>
          <p className="lead mt-5 max-w-[36rem]">
            Non dipende da te e non hai perso niente di quello che avevi già salvato. Riprova: di solito basta. Se stavi pagando, controlla in «Pagamenti» prima di ripetere.
          </p>
        </div>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={reset} className="btn btn-primary btn-lg">
            <RotateCw aria-hidden className="h-5 w-5" /> Riprova
          </button>
          <Link href="/" className="btn btn-secondary btn-lg">
            Torna alla home <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
          </Link>
        </div>
        <p className="meta mt-6">
          Per un&apos;urgenza di salute non usare questo sito: chiama il 112.
          {error.digest ? <> Codice dell&apos;errore: <span className="font-mono">{error.digest}</span>.</> : null}
        </p>
      </div>
    </section>
  );
}
