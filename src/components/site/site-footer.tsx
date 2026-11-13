import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Wave } from "@/components/ui/wave";
import { FOOTER_NAV, LEGAL_NAV } from "./nav";
import { puntoDiPartenzaEnabled } from "@/lib/feature-flags";
import { readTitolare } from "@/domain/titolare";
import { PAYOFF } from "@/domain/offerta";
import { SITE_URL } from "@/lib/seo";

/** Titolare in una riga, solo se configurato (nome + P.IVA): mai un segnaposto. */
function OwnerLine() {
  const t = readTitolare();
  if (!t) return null;
  return (
    <p className="mt-4 text-[1.0625rem] text-muted" data-testid="titolare-footer">
      {t.name} · P.IVA {t.vat}
      {t.address ? ` · ${t.address}` : ""}
    </p>
  );
}

/**
 * Piè di pagina «Luce»: fondo petrolio con l'onda in cima, il payoff in grande, il 112 sempre visibile.
 * Sta in uno «scope» forte: i colori dei testi si adattano da soli, in entrambi i temi.
 */
export function SiteFooter() {
  const pdp = puntoDiPartenzaEnabled();
  return (
    <footer className="site-footer no-print">
      {/* L'onda prende il colore della pagina: per questo sta fuori dallo «scope» scuro. */}
      <Wave position="top" className="text-canvas" />
      <div className="scope-strong container-rc relative pb-8 pt-[clamp(5rem,10vw,8.5rem)]">
        <div className="grid grid-cols-2 gap-x-6 gap-y-11 md:grid-cols-3 lg:grid-cols-[1.4fr_1.2fr_1fr_1fr] lg:gap-x-10">
          <div className="col-span-2 max-w-md md:col-span-3 lg:col-span-1">
            {/* «.it» solo quando il sito gira davvero su un dominio .it (PUBLIC_BASE_URL). */}
            <Logo inverse withTld={SITE_URL.endsWith(".it")} />
            <p className="mt-6 text-[1.625rem] font-extrabold leading-[1.18] tracking-[-0.025em] text-ink">{PAYOFF}</p>
            <OwnerLine />
            <p className="footer-emergency mt-7 text-ink">
              <span className="stat-num text-[1.75rem] text-danger">112</span>
              <span>Per le emergenze non usare questo sito: chiama il 112.</span>
            </p>
          </div>
          {Object.entries(FOOTER_NAV).map(([title, links]) => (
            <nav key={title} aria-label={title}>
              <h2 className="eyebrow eyebrow-plain">{title}</h2>
              <ul className="mt-3">
                {links
                  .filter((l) => pdp || l.href !== "/punto-di-partenza")
                  .map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="footer-link">
                        {l.label}
                      </Link>
                    </li>
                  ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-line pt-5 text-[0.9375rem] text-muted lg:flex-row lg:items-center lg:justify-between">
          <p>© 2026 Cura Privata · Le spiegazioni informative non sostituiscono una valutazione medica.</p>
          <nav aria-label="Note legali">
            <ul className="flex flex-wrap gap-x-5">
              {LEGAL_NAV.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-flex min-h-11 items-center hover:text-teal hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
