import Link from "next/link";
import { FlaskConical } from "lucide-react";

/** Avviso fisso su ogni contenuto editoriale: bozza, informativa, non sostituisce il medico. */
export function ReviewNotice({ lastUpdated, subject = "l'esame", practical = false }: { lastUpdated: string; subject?: "l'esame" | "il termine"; practical?: boolean }) {
  const [y, m, d] = lastUpdated.split("-");
  // Guide pratiche: nessun contenuto clinico da revisionare, ma regole e sportelli cambiano: lo diciamo.
  if (practical)
    return (
      <div role="note" className="flex gap-3 text-base text-muted">
        <FlaskConical aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-warn" />
        <p>
          <strong className="font-semibold text-ink-soft">Guida pratica, senza indicazioni mediche</strong>, aggiornata il {d}/{m}/{y}. Regole, tempi e sportelli possono cambiare da una struttura o da una Regione all&apos;altra: verifica sempre sulla fonte indicata in fondo. Urgenze: 112.{" "}
          <Link href="/sicurezza-e-privacy" className="link">
            Come lavoriamo
          </Link>
        </p>
      </div>
    );
  return (
    <div role="note" className="flex gap-3 text-base text-muted">
      <FlaskConical aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-warn" />
      <p>
        <strong className="font-semibold text-ink-soft">Bozza in attesa di revisione medica</strong>, aggiornata il {d}/{m}/{y}. Spiega {subject}, non che cosa significa il tuo valore: quello lo dice il tuo medico. Urgenze: 112.{" "}
        <Link href="/sicurezza-e-privacy" className="link">
          Come lavoriamo
        </Link>
      </p>
    </div>
  );
}
