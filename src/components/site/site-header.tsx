"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { clsx } from "clsx";
import { Logo } from "@/components/brand/logo";
import { MAIN_NAV } from "./nav";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="no-print sticky top-0 z-40 border-b border-line/70 bg-canvas/90 backdrop-blur-md supports-[backdrop-filter]:bg-canvas/75">
      <div className="container-rc flex h-16 items-center justify-between gap-4 lg:h-20">
        <Link href="/" className="rounded-md">
          <Logo />
        </Link>

        <nav aria-label="Principale" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {MAIN_NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={clsx(
                      "rounded-full px-4 py-2.5 text-[0.9375rem] font-medium transition-colors duration-150",
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

        <div className="hidden items-center gap-2 lg:flex">
          <Link href="/esempio" className="btn btn-secondary">
            Prova la demo
          </Link>
          <Link href="/inizia" className="btn btn-primary">
            Inizia ora
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-paper lg:hidden"
          aria-expanded={open}
          aria-controls="menu-mobile"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X aria-hidden className="h-5 w-5" /> : <Menu aria-hidden className="h-5 w-5" />}
          <span className="sr-only">{open ? "Chiudi il menu" : "Apri il menu"}</span>
        </button>
      </div>

      {open ? (
        <div id="menu-mobile" className="fade-in border-t border-line bg-canvas lg:hidden">
          <nav aria-label="Menu mobile" className="container-rc py-4">
            <ul className="flex flex-col">
              {MAIN_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className="flex min-h-12 items-center border-b border-line/70 text-lg font-medium text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-5 grid gap-3">
              <Link href="/inizia" className="btn btn-primary w-full">
                Inizia ora
              </Link>
              <Link href="/esempio" className="btn btn-secondary w-full">
                Prova la demo
              </Link>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
