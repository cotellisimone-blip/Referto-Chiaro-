import Link from "next/link";
import { ArrowRight, LifeBuoy } from "lucide-react";

/** Barra fissa in basso, solo su telefono: un'azione principale e l'aiuto sempre a portata di pollice. */
export function MobileHelpBar() {
  return (
    <div className="mobile-help-bar fixed inset-x-0 bottom-0 z-40 border-t border-line bg-canvas/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_24px_rgba(12,51,64,0.08)] backdrop-blur lg:hidden">
      <nav aria-label="Azioni rapide" className="mx-auto flex max-w-xl gap-3">
        <Link href="/inizia" className="btn btn-primary min-h-14 min-w-0 flex-1 px-3 text-lg">
          Inizia <ArrowRight aria-hidden className="h-5 w-5" />
        </Link>
        <Link href="/domande-frequenti" className="btn btn-secondary min-h-14 min-w-0 flex-1 px-3 text-lg">
          <LifeBuoy aria-hidden className="h-5 w-5" /> Aiuto
        </Link>
      </nav>
    </div>
  );
}
