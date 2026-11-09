"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { clsx } from "clsx";
import { Logo } from "@/components/brand/logo";
import { MAIN_NAV } from "./nav";
import { ThemeToggle } from "./theme-toggle";
import { TextSizeToggle } from "./text-size-toggle";
import { SearchTrigger } from "@/components/search/site-search";

/**
 * Il percorso corrente serve solo a evidenziare la voce attiva. Sulle pagine dinamiche
 * (area personale) non è noto in prerendering: il layout mostra la versione senza percorso
 * come fallback di Suspense e questa versione "viva" la sostituisce subito dopo.
 */
export function SiteHeader() {
  const pathname = usePathname();
  return <SiteHeaderView pathname={pathname} />;
}

export function SiteHeaderView({ pathname }: { pathname: string | null }) {
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  // Con una sessione attiva il link "Accedi" diventa "Area personale" (controllo leggero, lato client).
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => {
    let alive = true;
    fetch("/api/v1/auth/me", { credentials: "same-origin" })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => alive && setSignedIn(Boolean(j?.user)))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [pathname]);
  const panelRef = useRef<HTMLDivElement>(null);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  // Menu mobile: Esc chiude, lo scroll della pagina resta bloccato, il fuoco resta nel pannello.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>("a[href],button:not([disabled])");
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    panelRef.current?.querySelector<HTMLElement>("a[href]")?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header className="no-print relative sticky top-0 z-40 border-b border-line/70 bg-canvas/90 shadow-[0_1px_0_rgb(255_255_255/0.5)_inset] backdrop-blur-md supports-[backdrop-filter]:bg-canvas/75">
      <div className="container-rc relative z-10 flex h-16 items-center justify-between gap-3 lg:h-20">
        <Link href="/" className="rounded-md">
          <Logo />
        </Link>

        <nav aria-label="Principale" className="hdr-desktop">
          <ul className="flex items-center gap-0.5 xl:gap-1">
            {MAIN_NAV.map((item) => {
              const active = pathname === item.href || !!pathname?.startsWith(item.href + "/");
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={clsx(
                      "relative whitespace-nowrap rounded-full px-1.5 py-2.5 text-[0.9375rem] font-medium transition-colors duration-150 xl:px-3.5 xl:text-[1rem]",
                      active ? "bg-mist text-ink" : "text-ink-soft hover:bg-mist/70 hover:text-ink",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hdr-desktop items-center gap-1.5 xl:gap-2">
          <SearchTrigger variant="compact" className="hidden xl:inline-flex" />
          <TextSizeToggle />
          <ThemeToggle />
          {signedIn ? (
            <Link href="/area-personale" className="btn btn-primary btn-sm whitespace-nowrap">
              Area personale
            </Link>
          ) : (
            <>
              <Link href="/accedi" className="btn btn-ghost btn-sm whitespace-nowrap">
                Accedi
              </Link>
              <Link href="/inizia" className="btn btn-primary btn-sm whitespace-nowrap">
                Inizia
              </Link>
            </>
          )}
        </div>

        <div className="hdr-mobile items-center gap-1.5">
          <SearchTrigger className="h-10 w-10" />
          <TextSizeToggle className="hdr-wide-only inline-flex h-10 min-w-10 items-center justify-center rounded-full border border-line bg-paper px-1.5 font-serif text-ink transition-colors hover:bg-mist" />
          <ThemeToggle className="hdr-wide-only inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-paper text-ink transition-colors hover:bg-mist" />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-paper text-ink"
            aria-expanded={open}
            aria-controls="menu-mobile"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X aria-hidden className="h-5 w-5" /> : <Menu aria-hidden className="h-5 w-5" />}
            <span className="sr-only">{open ? "Chiudi il menu" : "Apri il menu"}</span>
          </button>
        </div>
      </div>

      {open ? (
        <div className="hdr-panel absolute inset-x-0 top-full">
          <button type="button" aria-label="Chiudi il menu" className="modal-backdrop fixed inset-0" onClick={() => setOpen(false)} />
          <div id="menu-mobile" ref={panelRef} className="fade-in relative max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-line bg-canvas shadow-[var(--shadow-lift)]">
            <nav aria-label="Menu mobile" className="container-rc py-4">
              <ul className="flex flex-col">
                {MAIN_NAV.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={pathname === item.href ? "page" : undefined}
                      className={clsx(
                        "flex min-h-13 items-center justify-between border-b border-line/70 text-lg font-medium",
                        pathname === item.href ? "text-teal" : "text-ink",
                      )}
                    >
                      {item.label}
                      <ArrowRight aria-hidden className="h-4 w-4 text-muted" />
                    </Link>
                  </li>
                ))}
              </ul>
              {/* Su schermi molto stretti (sotto 360 px) testo grande e tema stanno qui, non nella testata. */}
              <div className="hdr-narrow-only mt-5 items-center gap-3">
                <TextSizeToggle className="inline-flex h-11 min-w-11 items-center justify-center rounded-full border border-line bg-paper px-2 font-serif text-ink" />
                <ThemeToggle className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-paper text-ink" />
                <span className="text-[0.9375rem] text-muted">Testo grande e tema</span>
              </div>
              <div className="mt-5 grid gap-3 pb-2">
                <Link href="/inizia" className="btn btn-primary w-full">
                  Scegli il servizio per te
                </Link>
                <Link href={signedIn ? "/area-personale" : "/accedi"} className="btn btn-ghost w-full">
                  {signedIn ? "Vai all'area personale" : "Accedi all'area personale"}
                </Link>
              </div>
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}
