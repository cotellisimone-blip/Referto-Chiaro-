"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, BookOpen, ChartLine, ChevronRight, ClipboardList, Euro, FileText, HeartPulse, Home, Laptop, LogOut, Menu, Pill, Stethoscope, Video, X, type LucideIcon, Users } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { HEADER_CTA, MAIN_NAV, type NavIcon } from "./nav";
import { ThemeToggle } from "./theme-toggle";
import { TextSizeToggle } from "./text-size-toggle";
import { SearchTrigger } from "@/components/search/site-search";
import { AREA_ITEMS, AREA_TAB_HREFS } from "@/components/area/area-nav";

const NAV_ICON: Record<NavIcon, LucideIcon> = { file: FileText, home: Home, video: Video, stethoscope: Stethoscope, euro: Euro, book: BookOpen, users: Users, tools: ClipboardList, chart: ChartLine, laptop: Laptop, pill: Pill, heart: HeartPulse };

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
  const [me, setMe] = useState<{ email: string; displayName: string | null; isDemo: boolean } | null>(null);
  const signedIn = Boolean(me);
  const router = useRouter();
  // 18/11/2026 (secondo giro, punto 4): nell'area personale, su telefono, il menu della testata porta anche le voci che
  // non stanno nella barra in basso (dossier, pagamenti, impostazioni) e «Esci». Prima stavano in una terza barra.
  const inArea = signedIn && Boolean(pathname?.startsWith("/area-personale"));
  async function logout() {
    await fetch("/api/v1/auth/logout", { method: "POST", credentials: "same-origin", headers: { "content-type": "application/json" }, body: "{}" }).catch(() => {});
    setMe(null);
    setOpen(false);
    router.push("/");
    router.refresh();
  }
  useEffect(() => {
    let alive = true;
    fetch("/api/v1/auth/me", { credentials: "same-origin" })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => alive && setMe(j?.user ?? null))
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
        <Link prefetch={false} href="/" className="rounded-md">
          <Logo />
        </Link>

        <nav aria-label="Principale" className="hdr-desktop">
          <ul className="flex items-center gap-0.5">
            {MAIN_NAV.filter((item) => !item.menuOnly).map((item) => {
              const active = pathname === item.href || !!pathname?.startsWith(item.href + "/");
              return (
                <li key={item.href} className={item.wideOnly === "xl" ? "hidden xl:list-item" : item.wideOnly === "2xl" ? "hidden 2xl:list-item" : undefined}>
                  <Link prefetch={false} href={item.href} aria-current={active ? "page" : undefined} className="nav-link">
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
              <Link href={HEADER_CTA.href} className="btn btn-primary btn-sm whitespace-nowrap">
                {HEADER_CTA.label}
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
              {inArea && me ? (
                <div className="menu-area" data-testid="menu-area">
                  <p className="menu-area-who">
                    <span className="menu-area-label">Il tuo spazio</span>
                    <span className="menu-area-name">{me.isDemo ? "Account demo" : (me.displayName ?? me.email)}</span>
                  </p>
                  <ul className="grid gap-0.5">
                    {AREA_ITEMS.filter((it) => !AREA_TAB_HREFS.includes(it.href)).map(({ href, label, icon: Icon }) => (
                      <li key={href}>
                        <Link prefetch={false} href={href} aria-current={pathname === href ? "page" : undefined} className="menu-link">
                          <span aria-hidden className="tile-ico tile-ico-sm">
                            <Icon />
                          </span>
                          {label}
                          <ChevronRight aria-hidden className="h-5 w-5" />
                        </Link>
                      </li>
                    ))}
                    <li>
                      <button type="button" onClick={logout} className="menu-link w-full text-left">
                        <span aria-hidden className="tile-ico tile-ico-sm">
                          <LogOut />
                        </span>
                        Esci
                      </button>
                    </li>
                  </ul>
                  <p className="menu-area-label mt-5">Il sito</p>
                </div>
              ) : null}
              <ul className="grid gap-0.5">
                {MAIN_NAV.map((item) => {
                  const Icon = NAV_ICON[item.icon];
                  return (
                    <li key={item.href}>
                      <Link prefetch={false} href={item.href} aria-current={pathname === item.href ? "page" : undefined} className="menu-link">
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
                <Link href={HEADER_CTA.href} className="btn btn-primary btn-lg w-full">
                  {HEADER_CTA.menu} <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
                </Link>
                <Link href={signedIn ? "/area-personale" : "/accedi"} className="btn btn-secondary w-full">
                  {signedIn ? "Vai all'area personale" : "Accedi all'area personale"}
                </Link>
              </div>
              {/* Su schermi stretti (o con il testo grande) il pulsante «aA» non sta nella testata: qui ha la sua etichetta. */}
              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-[1rem] text-ink-soft">
                <span className="hdr-narrow-only items-center gap-2.5">
                  <TextSizeToggle className="icon-btn icon-btn-solid px-2 font-serif" />
                  <span aria-hidden>Testo più grande</span>
                </span>
                <span className="flex items-center gap-2.5">
                  <ThemeToggle className="icon-btn icon-btn-solid" />
                  <span>Tema chiaro o scuro</span>
                </span>
              </div>
            </nav>
          </div>
        </>
      ) : null}
    </header>
  );
}
