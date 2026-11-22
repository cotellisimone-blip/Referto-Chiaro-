"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Activity, ArrowRight, BookOpen, ChartLine, ChevronRight, ClipboardList, Euro, FileText, HeartPulse, Home, Laptop, Leaf, LogOut, Menu, NotebookPen, Pill, Stethoscope, UserCheck, Video, X, type LucideIcon, Users } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { CONSULTA, HEADER_CTA, MENU_FOOT, PERCORSO, type NavIcon } from "./nav";
import { ThemeToggle } from "./theme-toggle";
import { TextSizeToggle } from "./text-size-toggle";
import { SearchTrigger } from "@/components/search/site-search";
import { AREA_ITEMS, AREA_TAB_HREFS } from "@/components/area/area-nav";

const NAV_ICON: Record<NavIcon, LucideIcon> = { file: FileText, home: Home, video: Video, stethoscope: Stethoscope, euro: Euro, book: BookOpen, users: Users, tools: ClipboardList, chart: ChartLine, laptop: Laptop, pill: Pill, heart: HeartPulse, activity: Activity, leaf: Leaf, notebook: NotebookPen, userCheck: UserCheck };

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
 * Testata «Luce» (12/11/2026): vetro leggero, voci a pillola. Il menu è un pannello che scende dalla testata e oscura la pagina.
 * 19/11/2026 (home «chiara e scura», approvata da Simone): comandi rotondi con il filo e, accanto alla lente, il pulsante
 * della luce, su telefono e su computer. Su telefono: cerca, luce, testo grande, menu. Dove non c'è posto «Aa» va nel menu.
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
            {/* 22/11/2026: i cinque passi del percorso, con il numero; le pagine da consultare stanno nel menu e nel fondo. */}
            {PERCORSO.map((item) => {
              const active = pathname === item.href || !!pathname?.startsWith(item.href + "/");
              return (
                <li key={item.href}>
                  <Link prefetch={false} href={item.href} aria-current={active ? "page" : undefined} className={`nav-link nav-step${item.cuore ? " nav-step-cuore" : ""}`}>
                    <span aria-hidden className="nav-step-n">
                      {item.n}
                    </span>
                    <span className="sr-only">Passo {item.n}: </span>
                    {item.short}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hdr-desktop items-center gap-0.5">
          <SearchTrigger variant="compact" className="hdr-roomy" />
          <ThemeToggle className="ml-1" />
          <TextSizeToggle className="icon-btn hdr-round ml-1 px-2" />
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
          <SearchTrigger className="icon-btn hdr-round" />
          <ThemeToggle />
          <TextSizeToggle className="hdr-wide-only icon-btn hdr-round px-2" />
          <button type="button" className="icon-btn hdr-round" aria-expanded={open} aria-controls="menu-mobile" onClick={() => setOpen((v) => !v)}>
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
              {/* 22/11/2026: in cima il punto di partenza (o il tuo spazio, se sei entrato), poi i cinque passi del percorso,
                  poi ciò che si consulta, il referto da caricare e le pagine di servizio. */}
              {inArea ? null : (
                <Link prefetch={false} href={signedIn ? "/area-personale" : "/punto-di-partenza"} className="menu-me" data-testid="menu-me">
                  <span aria-hidden className="menu-me-av">
                    {signedIn ? <UserCheck /> : "1"}
                  </span>
                  <span>
                    <b>{signedIn ? "Il tuo spazio" : "Comincia da qui"}</b>
                    <small>{signedIn ? "Referti, diari, promemoria: riprendi da dove eri" : "Poche domande, gratis: ricevi la tua mappa"}</small>
                  </span>
                  <ChevronRight aria-hidden className="h-5 w-5" />
                </Link>
              )}
              <p className="menu-grp">Il tuo percorso</p>
              <ol className="menu-steps" aria-label="Il percorso in cinque passi">
                {PERCORSO.map((item) => {
                  const Icon = NAV_ICON[item.icon];
                  const active = pathname === item.href || !!pathname?.startsWith(item.href + "/");
                  return (
                    <li key={item.href} className={item.cuore ? "menu-step menu-step-cuore" : "menu-step"}>
                      <Link prefetch={false} href={item.href} aria-current={active ? "page" : undefined} className="menu-step-a">
                        <span aria-hidden className="menu-step-n">
                          {item.n}
                        </span>
                        <span className="menu-step-t">
                          <b>
                            {item.label}
                            {item.cuore ? <span className="menu-step-tag">Il cuore</span> : null}
                          </b>
                          <small>{item.desc}</small>
                        </span>
                        <Icon aria-hidden className="menu-step-ic" />
                      </Link>
                    </li>
                  );
                })}
              </ol>
              <p className="menu-grp">Da consultare, gratis</p>
              <ul className="menu-cons">
                {CONSULTA.map((c) => {
                  const Icon = NAV_ICON[c.icon];
                  return (
                    <li key={c.href}>
                      <Link prefetch={false} href={c.href} aria-current={pathname === c.href ? "page" : undefined} className="menu-cons-a">
                        <Icon aria-hidden />
                        <b>{c.label}</b>
                        <small>{c.desc}</small>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-5 grid gap-3 border-t border-line pt-5">
                <Link href={HEADER_CTA.href} className="btn btn-primary btn-lg w-full">
                  {HEADER_CTA.menu} <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
                </Link>
                {signedIn ? null : (
                  <Link href="/accedi" className="btn btn-secondary w-full">
                    Accedi all&apos;area personale
                  </Link>
                )}
              </div>
              <ul className="menu-foot">
                {MENU_FOOT.map((l) => (
                  <li key={l.href}>
                    <Link prefetch={false} href={l.href}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
              {/* Su schermi stretti (o con il testo grande) il pulsante «Aa» non sta nella testata: qui ha la sua etichetta.
                  Il pulsante della luce invece resta sempre nella testata, accanto alla lente (19/11/2026). */}
              <div className="hdr-narrow-only mt-5 items-center gap-2.5 text-[1rem] text-ink-soft">
                <TextSizeToggle className="icon-btn hdr-round px-2" />
                <span aria-hidden>Testo più grande</span>
              </div>
            </nav>
          </div>
        </>
      ) : null}
    </header>
  );
}
