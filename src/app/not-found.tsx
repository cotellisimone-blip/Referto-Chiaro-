import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-rc flex min-h-[60vh] flex-col items-start justify-center py-20">
      <p className="eyebrow">Errore 404</p>
      <h1 className="display mt-3 text-[2.5rem] sm:text-[3.25rem]">Questa pagina non esiste.</h1>
      <p className="mt-4 max-w-xl text-lg text-muted">Forse il collegamento è cambiato. Puoi tornare alla home o provare il referto di esempio.</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className="btn btn-primary">
          Torna alla home
        </Link>
        <Link href="/esempio" className="btn btn-secondary">
          Referto di esempio
        </Link>
      </div>
    </div>
  );
}
