import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { FOOTER_NAV } from "./nav";

export function SiteFooter() {
  return (
    <footer className="no-print mt-auto border-t border-line bg-paper">
      <div className="container-rc grid gap-12 py-16 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="max-w-sm">
          <Logo withTld />
          <p className="mt-5 font-serif text-2xl leading-snug text-ink">
            Non facciamo diagnosi.
            <br />
            Facciamo chiarezza.
          </p>
          <p className="mt-4 text-[1.0625rem] text-muted">Uno strumento per capire i referti e arrivare dal medico con le domande giuste.</p>
          <p className="mt-5 inline-flex items-center gap-3 rounded-xl border border-line bg-canvas px-4 py-3 text-[0.9375rem] text-ink">
            <span className="stat-num text-2xl text-danger">112</span>
            <span>In caso di emergenza non usare questo sito: chiama il 112.</span>
          </p>
        </div>
        {Object.entries(FOOTER_NAV).map(([title, links]) => (
          <nav key={title} aria-label={title}>
            <h2 className="eyebrow eyebrow-plain">{title}</h2>
            <ul className="mt-4 space-y-1">
              {links.map((l) => (
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
          <p>© 2026 Referto Chiaro · Progetto in fase dimostrativa.</p>
          <p>Le spiegazioni sono informative e non sostituiscono il parere di un medico.</p>
        </div>
      </div>
    </footer>
  );
}
