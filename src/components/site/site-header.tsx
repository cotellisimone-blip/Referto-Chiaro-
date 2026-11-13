"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, BookOpen, ChevronRight, Euro, FileText, Home, Menu, Stethoscope, Video, X, type LucideIcon } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { MAIN_NAV, type NavIcon } from "./nav";
import { ThemeToggle } from "./theme-toggle";
import { TextSizeToggle } from "./text-size-toggle";
import { SearchTrigger } from "@/components/search/site-search";

const NAV_ICON: Record<NavIcon, LucideIcon> = { file: FileText, home: Home, video: Video, stethoscope: Stethoscope, euro: Euro, book: BookOpen };

/**
 * Il percorso corrente serve solo a evidenziare la voce attiva. Sulle pagine dinamiche
 * (area personale) non è noto in prerendering: il layout mostra la versione senza percorso
 * come fallback di Suspense e questa versione "viva" la sostituisce subito dopo.
 */
export function SiteHeader() {
  const pathname = usePathname();
  return <SiteHeaderView pathname={pathname} />;
}

/**
 * Testata «Luce» (12/11/2026): vetro leggero, voci a pillola, comandi senza bordo. Su telefono restano tre comandi
 * (cerca, testo grande, menu); il tema sta nel menu. Il menu è un pannello che scende dalla testata e oscura la pagina.
 */
export function SiteHeaderView({ pathname }: { pathname: string | null }) {
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const [scrolled, setScrolled] = useState(false);
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
  // La testata sta in un confine di Suspense e può idratarsi dopo il resto: segnale proprio per i test (vedi tests/e2e/_lib/ready.ts).
  const headerRef = useRef<HTMLElement>(null);
  useEffect(() => headerRef.current?.setAttribute("data-hydrated", "1"), []);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  // Un filo d'ombra sotto la testata appena la pagina scorre.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    <header ref={headerRef} className="site-header no-print" data-scrolled={scrolled ? "1" : undefined} data-open={open ? "1" : undefined}>
      <div className="container-rc site-header-row">
        <Link href="/" className="rounded-md">
          <Logo />
        </Link>

        <nav aria-label="Principale" className="hdr-desktop">
          <ul className="flex items-center gap-0.5">
            {MAIN_NAV.map((item) => {
              const active = pathname === item.href || !!pathname?.startsWith(item.href + "/");
              return (
                <li key={item.href} className={item.wideOnly ? "hidden xl:list-item" : undefined}>
                  <Link href={item.href} aria-current={active ? "page" : undefined} className="nav-link">
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hdr-desktop items-center gap-0.5">
          <SearchTrigger variant="compact" className="hdr-roomy" />
          <TextSizeToggle className="icon-btn px-2 font-serif" />
          <ThemeToggle className="hdr-roomy icon-btn" />
          <span aria-hidden className="hdr-sep hdr-roomy" />
          {signedIn ? (
            <Link href="/area-personale" className="btn btn-primary btn-sm ml-1 whitespace-nowrap">
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

        <div className="hdr-mobile items-center gap-1">
          <SearchTrigger className="icon-btn" />
          <TextSizeToggle className="hdr-wide-only icon-btn px-2 font-serif" />
          <button type="button" className="icon-btn icon-btn-solid ml-1" aria-expanded={open} aria-controls="menu-mobile" onClick={() => setOpen((v) => !v)}>
            {open ? <X aria-hidden className="h-5 w-5" /> : <Menu aria-hidden className="h-5 w-5" />}
            <span className="sr-only">{open ? "Chiudi il menu" : "Apri il menu"}</span>
          </button>
        </div>
      </div>

      {open ? (
        <>
          <button type="button" aria-label="Chiudi il menu" tabIndex={-1} className="menu-backdrop" onClick={() => setOpen(false)} />
          <div id="menu-mobile" ref={panelRef} className="menu-panel fade-in">
            <nav aria-label="Menu mobile" className="container-rc pb-6 pt-2">
              <ul className="grid gap-0.5">
                {MAIN_NAV.map((item) => {
                  const Icon = NAV_ICON[item.icon];
                  return (
                    <li key={item.href}>
                      <Link href={item.href} aria-current={pathname === item.href ? "page" : undefined} className="menu-link">
                        <span aria-hidden className="tile-ico tile-ico-sm">
                          <Icon />
                        </span>
                        {item.label}
                        <ChevronRight aria-hidden className="h-5 w-5" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-4 grid gap-3 border-t border-line pt-5">
                <Link href="/inizia" className="btn btn-primary btn-lg w-full">
                  Scegli il servizio per te <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
                </Link>
                <Link href={signedIn ? "/area-personale" : "/accedi"} className="btn btn-secondary w-full">
                  {signedIn ? "Vai all'area personale" : "Accedi all'area personale"}
                </Link>
              </div>
              <div className="mt-5 flex items-center gap-2 text-[1rem] text-muted">
                <TextSizeToggle className="hdr-narrow-only icon-btn icon-btn-solid px-2 font-serif" />
                <ThemeToggle className="icon-btn icon-btn-solid" />
                <span className="ml-1">Tema chiaro o scuro</span>
              </div>
            </nav>
          </div>
        </>
      ) : null}
    </header>
  );
}
