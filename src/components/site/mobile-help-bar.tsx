"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, LifeBuoy } from "lucide-react";
import { formNeedsRoom } from "@/lib/form-in-view";

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
      setShown(y > window.innerHeight * 0.85 && !nearEnd && !formNeedsRoom());
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    // 17/11/2026 (punto 16): davanti a un modulo, o mentre si scrive in un campo, la barra si ritira.
    document.addEventListener("focusin", update);
    document.addEventListener("focusout", update);
    return () => {
      document.removeEventListener("focusin", update);
      document.removeEventListener("focusout", update);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  return (
    <div data-shown={shown} className="mobile-help-bar fixed inset-x-0 bottom-0 z-40 border-t border-line bg-canvas/90 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-12px_30px_-12px_rgba(12,51,64,0.18)] backdrop-blur-lg lg:hidden">
      <nav aria-label="Azioni rapide" className="mx-auto flex max-w-xl gap-3">
        <Link href="/lettura-referti" className="btn btn-primary min-h-14 min-w-0 flex-[1.4] px-3 text-lg">
          Ho un referto <ArrowRight aria-hidden className="h-5 w-5" />
        </Link>
        <Link href="/inizia" className="btn btn-secondary min-h-14 min-w-0 flex-1 px-3 text-lg">
          <LifeBuoy aria-hidden className="h-5 w-5" /> Aiutami
        </Link>
      </nav>
    </div>
  );
}
