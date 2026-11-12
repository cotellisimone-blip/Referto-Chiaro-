"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, LifeBuoy } from "lucide-react";

/**
 * Barra fissa in basso, solo su telefono: un'azione principale e l'aiuto a portata di pollice.
 * Compare soltanto dopo la prima schermata (la hero ha già le sue due azioni) e si ritira in fondo alla pagina,
 * così non copre né la chiusura né il piè di pagina. Finché è nascosta non riceve il fuoco (visibility: hidden).
 */
export function MobileHelpBar() {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const update = () => {
      const y = window.scrollY;
      const nearEnd = y + window.innerHeight > document.documentElement.scrollHeight - 520;
      setShown(y > window.innerHeight * 0.85 && !nearEnd);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  return (
    <div data-shown={shown} className="mobile-help-bar fixed inset-x-0 bottom-0 z-40 border-t border-line bg-canvas/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_24px_rgba(12,51,64,0.08)] backdrop-blur lg:hidden">
      <nav aria-label="Azioni rapide" className="mx-auto flex max-w-xl gap-3">
        <Link href="/referti" className="btn btn-primary min-h-14 min-w-0 flex-[1.4] px-3 text-lg">
          Ho un referto <ArrowRight aria-hidden className="h-5 w-5" />
        </Link>
        <Link href="/inizia" className="btn btn-secondary min-h-14 min-w-0 flex-1 px-3 text-lg">
          <LifeBuoy aria-hidden className="h-5 w-5" /> Aiutami
        </Link>
      </nav>
    </div>
  );
}
