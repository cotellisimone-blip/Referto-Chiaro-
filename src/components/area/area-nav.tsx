"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clsx } from "clsx";
import { CircleDashed, FilePlus2, Files, FolderOpen, LogOut, Receipt, Settings, Stethoscope } from "lucide-react";
import { LogoMark } from "@/components/brand/logo";
import { api } from "./api";

const ITEMS = [
  { href: "/area-personale", label: "Referti", icon: Files, exact: true },
  { href: "/area-personale/dossier", label: "Dossier", icon: FolderOpen, exact: false },
  { href: "/area-personale/secondo-parere", label: "Secondo parere", icon: Stethoscope, exact: false },
  { href: "/area-personale/ordini", label: "Ordini", icon: Receipt, exact: false },
  { href: "/area-personale/impostazioni", label: "Impostazioni", icon: Settings, exact: false },
];

const COMING = [
  { href: "/servizi/archivio", label: "Archivio salute" },
  { href: "/servizi/visite-e-consulti", label: "Visite e videoconsulti" },
  { href: "/servizi/prevenzione", label: "Prevenzione" },
];

/**
 * Navigazione dell'area personale Cura Privata.
 * Desktop: colonna laterale con orientamento (chi sei, che cosa puoi fare, che cosa arriverà).
 * Mobile: barra in basso con 5 voci etichettate (target ≥ 44px), come chiede il kit.
 */
export function AreaNav({ email, displayName, isDemo }: { email: string; displayName: string | null; isDemo: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = (href: string, exact: boolean) => (exact ? pathname === href : pathname.startsWith(href));
  async function logout() {
    await api("/api/v1/auth/logout", { method: "POST", body: {} });
    router.push("/");
    router.refresh();
  }
  const who = (
    <span className="min-w-0 truncate">
      {displayName ?? email}
      {isDemo ? <span className="chip ml-2 bg-cream text-ink">demo</span> : null}
    </span>
  );
  return (
    <>
      {/* Desktop: colonna laterale */}
      <aside className="area-side hidden lg:block">
        <div className="sticky top-28 space-y-5">
          <div className="card overflow-hidden">
            <div className="flex items-center gap-3 border-b border-line bg-[linear-gradient(135deg,var(--color-marker-soft),var(--color-mist))] px-5 py-4">
              <LogoMark className="h-8 w-8 shrink-0" />
              <div className="min-w-0 text-sm">
                <p className="font-bold text-ink">Il tuo spazio</p>
                <p className="flex text-muted">{who}</p>
              </div>
            </div>
            <nav aria-label="Area personale" className="p-2">
              <ul className="space-y-0.5">
                {ITEMS.map(({ href, label, icon: Icon, exact }) => {
                  const active = isActive(href, exact);
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        aria-current={active ? "page" : undefined}
                        className={clsx(
                          "flex min-h-11 items-center gap-3 rounded-xl px-3.5 text-[1rem] font-semibold transition-colors",
                          active ? "bg-mist text-ink shadow-[inset_3px_0_0_var(--color-teal)]" : "text-ink-soft hover:bg-mist/70 hover:text-ink",
                        )}
                      >
                        <Icon aria-hidden className={clsx("h-5 w-5", active ? "text-teal" : "text-muted")} /> {label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <Link href="/area-personale/nuovo" className="btn btn-primary mt-3 w-full">
                <FilePlus2 aria-hidden className="h-4 w-4" /> Nuovo referto
              </Link>
              <button type="button" onClick={logout} className="mt-1 flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl text-sm font-semibold text-teal hover:bg-mist">
                <LogOut aria-hidden className="h-4 w-4" /> Esci
              </button>
            </nav>
          </div>
          <div className="rounded-[var(--radius-lg)] border border-dashed border-line p-5">
            <p className="flex items-center gap-2 text-sm font-bold text-ink">
              <CircleDashed aria-hidden className="h-4 w-4 text-teal" /> In preparazione
            </p>
            <ul className="mt-3 space-y-1">
              {COMING.map((c) => (
                <li key={c.href}>
                  <Link href={c.href} className="inline-flex min-h-9 items-center text-[0.9375rem] text-muted hover:text-teal">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>

      {/* Mobile: intestazione compatta + barra in basso */}
      <div className="flex items-center justify-between gap-3 border-b border-line pb-4 text-sm text-muted lg:hidden">
        <span className="flex min-w-0 items-center gap-2">
          <LogoMark className="h-7 w-7 shrink-0" />
          {who}
        </span>
        <button type="button" onClick={logout} className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 font-semibold text-teal hover:bg-mist">
          <LogOut aria-hidden className="h-4 w-4" /> Esci
        </button>
      </div>
      <nav aria-label="Area personale" className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        <ul className="mx-auto grid max-w-lg grid-cols-5">
          {[ITEMS[0], ITEMS[1], { href: "/area-personale/nuovo", label: "Nuovo", icon: FilePlus2, exact: true }, ITEMS[2], ITEMS[4]].map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={clsx("flex min-h-16 flex-col items-center justify-center gap-1 px-1 text-[0.75rem] font-semibold leading-tight", active ? "text-teal" : "text-muted")}
                >
                  <span className={clsx("flex h-8 w-12 items-center justify-center rounded-full", active && "bg-marker-soft")}>
                    <Icon aria-hidden className="h-5 w-5" />
                  </span>
                  <span className="max-w-full truncate">
                    {label === "Secondo parere" ? "Parere" : label === "Impostazioni" ? "Profilo" : label}
                    {label === "Nuovo" ? <span className="sr-only"> referto</span> : null}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
