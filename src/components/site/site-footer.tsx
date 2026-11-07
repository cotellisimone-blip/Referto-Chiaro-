import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { FOOTER_NAV } from "./nav";

export function SiteFooter() {
  return (
    <footer className="no-print mt-auto border-t border-line bg-paper">
      <div className="container-rc grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="max-w-sm">
          <Logo withTld />
          <p className="mt-4 text-[0.9375rem] text-muted">
            Non facciamo diagnosi: facciamo chiarezza. Uno strumento per capire i referti e prepararsi al confronto con il proprio medico.
          </p>
          <p className="mt-4 rounded-md bg-cream/70 px-3 py-2 text-sm text-ink">
            In caso di emergenza non usare questo sito: chiama il <strong>112</strong>.
          </p>
        </div>
        {Object.entries(FOOTER_NAV).map(([title, links]) => (
          <nav key={title} aria-label={title}>
            <h2 className="text-sm font-semibold text-ink">{title}</h2>
            <ul className="mt-3 space-y-1">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-flex min-h-11 items-center text-[0.9375rem] text-muted hover:text-teal">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-line">
        <p className="container-rc py-5 text-sm text-muted">
          © 2026 Referto Chiaro · Progetto in fase dimostrativa. Le spiegazioni sono informative e non sostituiscono il parere di un medico.
        </p>
      </div>
    </footer>
  );
}
