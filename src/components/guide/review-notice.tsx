import Link from "next/link";
import { FlaskConical } from "lucide-react";

/** Avviso fisso su ogni contenuto editoriale: bozza, informativa, non sostituisce il medico. */
export function ReviewNotice({ lastUpdated }: { lastUpdated: string }) {
  const [y, m, d] = lastUpdated.split("-");
  return (
    <div role="note" className="flex gap-3 text-[0.9375rem] text-muted">
      <FlaskConical aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-warn" />
      <p>
        <strong className="font-semibold text-ink-soft">Bozza in attesa di revisione medica</strong>, aggiornata il {d}/{m}/{y}. Spiega l&apos;esame, non che cosa significa il tuo valore: quello lo dice il tuo medico. Urgenze: 112.{" "}
        <Link href="/sicurezza-e-privacy" className="link">
          Come lavoriamo
        </Link>
      </p>
    </div>
  );
}
