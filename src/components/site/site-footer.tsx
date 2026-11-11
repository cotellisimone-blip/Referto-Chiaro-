import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { FOOTER_NAV, LEGAL_NAV } from "./nav";
import { puntoDiPartenzaEnabled } from "@/lib/feature-flags";

export function SiteFooter() {
  const pdp = puntoDiPartenzaEnabled();
  return (
    <footer className="no-print mt-auto border-t border-line bg-paper">
      <div className="container-rc grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.6fr_repeat(3,1fr)]">
        <div className="max-w-sm">
          <Logo withTld />
          <p className="mt-5 font-serif text-2xl leading-snug text-ink">Capisci. Chiedi un secondo parere. Parla con un medico.</p>
          <p className="mt-4 text-[1.0625rem] text-muted">Versione dimostrativa: nessun pagamento e nessun medico sono reali finché non lo diciamo.</p>
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
