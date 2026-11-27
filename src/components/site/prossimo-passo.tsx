import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PERCORSO } from "@/components/site/nav";
import { mediciEnabled } from "@/lib/medici";

/**
 * 27/11/2026 (fase 3, percorsi più corti): in fondo alle pagine lunghe c'era solo il piè di pagina. Ora c'è sempre un
 * «passo successivo» del percorso in cinque passi, con il suo nome di sempre (lo stesso del menu e della home).
 * Senza medici il passo 4 si salta.
 */
export function ProssimoPasso({ passo, titolo = "Il passo successivo" }: { passo: 1 | 2 | 3 | 4 | 5; titolo?: string }) {
  const p = passo === 4 && !mediciEnabled() ? PERCORSO[4] : PERCORSO[passo - 1];
  return (
    <aside className="prossimo-passo no-print" aria-labelledby={`prossimo-${p.n}`} data-testid="prossimo-passo">
      <div className="container-rc">
        <div className="prossimo-passo-box">
          <p className="prossimo-passo-k" id={`prossimo-${p.n}`}>
            {titolo}
          </p>
          <Link href={p.href} className="prossimo-passo-link">
            <span aria-hidden className="prossimo-passo-n">
              {p.n}
            </span>
            <span className="min-w-0">
              <b>{p.label}</b>
              <small>{p.desc}</small>
            </span>
            <ArrowRight aria-hidden className="h-5 w-5 shrink-0" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
