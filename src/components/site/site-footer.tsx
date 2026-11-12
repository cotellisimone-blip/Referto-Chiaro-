import Link from "next/link";
import { Logo } from "@/components/brand/logo";
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

export function SiteFooter() {
  const pdp = puntoDiPartenzaEnabled();
  return (
    <footer className="no-print mt-auto border-t border-line bg-paper">
      <div className="container-rc grid grid-cols-2 gap-x-6 gap-y-10 py-12 sm:py-16 md:grid-cols-3 lg:grid-cols-[1.6fr_repeat(3,1fr)] lg:gap-12">
        <div className="col-span-2 max-w-sm md:col-span-3 lg:col-span-1">
          {/* Ciclo 2, fase 3: «.it» solo quando il sito gira davvero su un dominio .it (PUBLIC_BASE_URL). */}
          <Logo withTld={SITE_URL.endsWith(".it")} />
          <p className="mt-5 font-serif text-2xl leading-snug text-ink">{PAYOFF}</p>
          <OwnerLine />
          <p className="mt-5 inline-flex items-center gap-3 rounded-xl border border-line bg-canvas px-4 py-3 text-[0.9375rem] text-ink">
            <span className="stat-num text-2xl text-danger">112</span>
            <span>In caso di emergenza non usare questo sito: chiama il 112.</span>
          </p>
        </div>
        {Object.entries(FOOTER_NAV).map(([title, links]) => (
          <nav key={title} aria-label={title}>
            <h2 className="eyebrow eyebrow-plain">{title}</h2>
            <ul className="mt-4 space-y-1">
              {links.filter((l) => pdp || l.href !== "/punto-di-partenza").map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="underline-grow inline-flex min-h-11 items-center text-[1.0625rem] text-ink-soft hover:text-teal">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="container-rc flex flex-col gap-2 py-6 text-[0.9375rem] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Cura Privata · Le spiegazioni informative non sostituiscono una valutazione medica.</p>
          <nav aria-label="Note legali">
            <ul className="flex flex-wrap gap-x-5 gap-y-1">
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
