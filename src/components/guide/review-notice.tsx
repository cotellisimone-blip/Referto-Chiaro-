import Link from "next/link";
import { FlaskConical } from "lucide-react";

/** Avviso fisso su ogni contenuto editoriale: bozza, informativa, non sostituisce il medico. */
export function ReviewNotice({ lastUpdated }: { lastUpdated: string }) {
  const [y, m, d] = lastUpdated.split("-");
  return (
    <div role="note" className="rounded-2xl border border-dashed border-warn/60 bg-cream p-5">
      <p className="flex items-center gap-2 text-sm font-semibold text-ink">
        <FlaskConical aria-hidden className="h-4 w-4 text-warn" /> Bozza in attesa di revisione medica · aggiornata il {d}/{m}/{y}
      </p>
      <p className="mt-1 text-sm text-ink-soft">
        Questa guida spiega che cosa misura un esame e come è fatto un referto. Non dice che cosa significa un valore per te: questo può dirlo solo il tuo medico. In caso di urgenza chiama il 112.{" "}
        <Link href="/sicurezza-e-privacy" className="link">
          Come lavoriamo
        </Link>
      </p>
    </div>
  );
}
