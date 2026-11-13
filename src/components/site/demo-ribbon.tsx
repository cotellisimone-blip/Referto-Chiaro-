import Link from "next/link";
import { FlaskConical } from "lucide-react";

/** Indica sempre, in modo sincero, che il sito è in modalità dimostrativa. */
export function DemoRibbon() {
  return (
    <div className="demo-ribbon no-print">
      <p className="container-rc flex min-h-9 items-center justify-center gap-2 py-1.5 text-center">
        <FlaskConical aria-hidden className="h-4 w-4 shrink-0 opacity-80" />
        <span>
          Versione dimostrativa: usiamo solo referti inventati e non accettiamo documenti reali.{" "}
          <Link href="/sicurezza-e-privacy">Perché</Link>
        </span>
      </p>
    </div>
  );
}
