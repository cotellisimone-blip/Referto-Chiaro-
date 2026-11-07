import Link from "next/link";
import { FlaskConical } from "lucide-react";

/** Indica sempre, in modo sincero, che il sito è in modalità dimostrativa. */
export function DemoRibbon() {
  return (
    <div className="no-print bg-strong text-on-strong">
      <p className="container-rc flex min-h-9 items-center justify-center gap-2 py-1.5 text-center text-[0.8125rem] leading-snug">
        <FlaskConical aria-hidden className="h-3.5 w-3.5 shrink-0 opacity-80" />
        <span>
          Versione dimostrativa: usiamo solo referti inventati e non accettiamo documenti reali.{" "}
          <Link href="/sicurezza" className="underline underline-offset-2 hover:no-underline">
            Perché
          </Link>
        </span>
      </p>
    </div>
  );
}
