"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clsx } from "clsx";
import {
  BellRing,
  CircleDashed,
  FilePlus2,
  Files,
  FolderOpen,
  LineChart,
  LogOut,
  Menu,
  Receipt,
  Settings,
  Stethoscope,
  Users,
  Video,
} from "lucide-react";
import { LogoMark } from "@/components/brand/logo";
import { api } from "./api";
import { isFocusPath } from "./area-shell";
import { isDoctorPath, mediciEnabled } from "@/lib/medici";

/** 14/11/2026: senza medici (src/lib/medici.ts) spariscono «Visite e videoconsulti» e «I miei pareri». */
const MEDICI = mediciEnabled();

/** Gerarchia ridotta (pacchetto «Memorabile»): documenti, pareri, appuntamenti. Il resto è di supporto. */
const ITEMS_ALL = [
  {
    href: "/area-personale",
    label: "I miei documenti e report",
    short: "Referti",
    icon: Files,
    exact: true,
  },
  // 13/11/2026: salute nel tempo e famiglia, le ragioni per tornare.
  {
    href: "/area-personale/nel-tempo",
    label: "Nel tempo",
    short: "Numeri",
    icon: LineChart,
    exact: false,
  },
  {
    href: "/area-personale/famiglia",
    label: "La famiglia",
    short: "Famiglia",
    icon: Users,
    exact: false,
  },
  {
    href: "/area-personale/promemoria",
    label: "Promemoria",
    // Nella barra in basso del telefono serve una parola corta: «Promemoria» a 320 px non ci sta intera.
    short: "Agenda",
    icon: BellRing,
    exact: false,
  },
  {
    href: "/richieste",
    label: "Visite e videoconsulti",
    short: "Medico",
    icon: Video,
    exact: false,
  },
  {
    href: "/area-personale/secondo-parere",
    label: "I miei pareri",
    short: "Pareri",
    icon: Stethoscope,
    exact: false,
  },
  {
    href: "/area-personale/dossier",
    label: "Dossier",
    short: "Dossier",
    icon: FolderOpen,
    exact: false,
  },
  {
    href: "/area-personale/ordini",
    label: "Pagamenti",
    short: "Pagamenti",
    icon: Receipt,
    exact: false,
  },
  {
    href: "/area-personale/impostazioni",
    label: "Impostazioni",
    short: "Profilo",
    icon: Settings,
    exact: false,
  },
];

const ITEMS = MEDICI ? ITEMS_ALL : ITEMS_ALL.filter((i) => !isDoctorPath(i.href));
/** Quinta voce della barra in basso su telefono: le richieste al medico oppure, senza medici, i promemoria. */
const LAST_TAB = MEDICI ? ITEMS_ALL[4] : ITEMS_ALL[3];

const COMING = [{ href: "/servizi/prevenzione", label: "Prevenzione" }];

/**
 * Navigazione dell'area personale Cura Privata.
 * Desktop: colonna laterale con orientamento (chi sei, che cosa puoi fare, che cosa arriverà).
 * Mobile: barra in basso con 5 voci etichettate (target ≥ 44px), come chiede il kit.
 */
/** Voci della barra in basso su telefono: referti, nel tempo, nuovo, famiglia, medico (o promemoria). */
const TAB_HREFS = [
  "/area-personale",
  "/area-personale/nel-tempo",
  "/area-personale/famiglia",
  LAST_TAB.href,
];

export function AreaNav({
  email,
  displayName,
  isDemo,
}: {
  email: string;
  displayName: string | null;
  isDemo: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);
  // Nelle pagine di lettura (referto aperto, dossier) su computer la colonna non c'è: lo spazio va al contenuto.
  const focus = isFocusPath(pathname);
  async function logout() {
    await api("/api/v1/auth/logout", { method: "POST", body: {} });
    router.push("/");
    router.refresh();
  }
  // Il nome si accorcia con i puntini, l'etichetta «demo» resta sempre intera accanto.
  const who = (
    <span className="flex min-w-0 items-center gap-2">
      <span className="min-w-0 truncate">{displayName ?? email}</span>
      {isDemo ? (
        <span className="chip shrink-0 bg-cream text-ink">demo</span>
      ) : null}
    </span>
  );
  return (
    <>
      {/* Desktop: colonna laterale */}
      <aside className={clsx("area-side hidden", !focus && "lg:block")}>
        <div className="sticky top-28 space-y-5">
          <div className="card overflow-hidden">
            <div className="flex items-center gap-3 border-b border-line bg-[linear-gradient(135deg,var(--color-marker-soft),var(--color-mist))] px-5 py-4">
              <LogoMark className="h-8 w-8 shrink-0" />
              <div className="min-w-0 text-base leading-snug">
                <p className="font-extrabold text-ink">Il tuo spazio</p>
                <p className="flex items-center text-muted">{who}</p>
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
                          "flex min-h-12 items-center gap-3 rounded-xl px-3.5 py-2 text-[1.0625rem] font-semibold leading-snug transition-colors",
                          active
                            ? "bg-mist text-ink shadow-[inset_3px_0_0_var(--color-teal)]"
                            : "text-ink-soft hover:bg-mist/70 hover:text-ink",
                        )}
                      >
                        <Icon
                          aria-hidden
                          className={clsx(
                            "h-5 w-5 shrink-0",
                            active ? "text-teal" : "text-muted",
                          )}
                        />{" "}
                        {label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <Link
                href="/area-personale/nuovo"
                className="btn btn-primary mt-3 w-full"
              >
                <FilePlus2 aria-hidden className="h-5 w-5" /> Nuovo referto
              </Link>
              <button
                type="button"
                onClick={logout}
                className="mt-1 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl text-base font-bold text-teal-deep hover:bg-mist"
              >
                <LogOut aria-hidden className="h-[1.125rem] w-[1.125rem]" />{" "}
                Esci
              </button>
            </nav>
          </div>
          <div className="rounded-[var(--radius-lg)] border border-dashed border-line p-5">
            <p className="flex items-center gap-2 text-base font-extrabold text-ink">
              <CircleDashed
                aria-hidden
                className="h-[1.125rem] w-[1.125rem] text-teal"
              />{" "}
              In preparazione
            </p>
            <ul className="mt-2">
              {COMING.map((c) => (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    className="inline-flex min-h-11 items-center text-base text-ink-soft hover:text-teal-deep hover:underline"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>

      {/* Mobile: intestazione compatta + barra in basso */}
      <div className="flex items-center justify-between gap-3 border-b border-line pb-4 text-base text-muted lg:hidden">
        <span className="flex min-w-0 items-center gap-2">
          <LogoMark className="h-7 w-7 shrink-0" />
          {who}
        </span>
        <span className="flex shrink-0 items-center gap-1">
          {/* Su telefono le voci che non stanno nella barra in basso: promemoria, pareri, dossier, pagamenti, profilo. */}
          <details className="area-more relative">
            <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-full px-3 font-bold text-teal-deep hover:bg-mist">
              <Menu aria-hidden className="h-[1.125rem] w-[1.125rem]" /> Altro
            </summary>
            <nav
              aria-label="Altre pagine dell'area personale"
              className="absolute right-0 z-50 mt-2 w-64 rounded-2xl border border-line bg-paper p-2 shadow-[var(--shadow-lift)]"
            >
              <ul>
                {ITEMS.filter((it) => !TAB_HREFS.includes(it.href)).map(
                  ({ href, label, icon: Icon }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="flex min-h-12 items-center gap-3 rounded-xl px-3 text-[1.0625rem] font-semibold text-ink hover:bg-mist"
                        onClick={(e) =>
                          (
                            e.currentTarget.closest(
                              "details",
                            ) as HTMLDetailsElement | null
                          )?.removeAttribute("open")
                        }
                      >
                        <Icon
                          aria-hidden
                          className="h-5 w-5 shrink-0 text-teal"
                        />{" "}
                        {label}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </nav>
          </details>
          <button
            type="button"
            onClick={logout}
            className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 font-bold text-teal-deep hover:bg-mist"
          >
            <LogOut aria-hidden className="h-[1.125rem] w-[1.125rem]" /> Esci
          </button>
        </span>
      </div>
      <nav
        aria-label="Area personale"
        className="area-tabbar no-print fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
      >
        <ul className="mx-auto grid max-w-lg grid-cols-5">
          {[
            ITEMS[0],
            ITEMS[1],
            {
              href: "/area-personale/nuovo",
              label: "Nuovo",
              short: "Nuovo",
              icon: FilePlus2,
              exact: true,
            },
            ITEMS[2],
            LAST_TAB,
          ].map(({ href, label, short, icon: Icon, exact }) => {
            const active = isActive(href, exact);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={clsx(
                    "flex min-h-16 flex-col items-center justify-center gap-1 text-[0.875rem] font-bold leading-tight",
                    active ? "text-teal-deep" : "text-muted",
                  )}
                >
                  <span
                    className={clsx(
                      "flex h-8 w-12 items-center justify-center rounded-full",
                      active && "bg-marker-soft",
                    )}
                  >
                    <Icon aria-hidden className="h-5 w-5" />
                  </span>
                  <span className="area-tabbar-label max-w-full truncate">
                    {short}
                    {label === "Nuovo" ? (
                      <span className="sr-only"> referto</span>
                    ) : null}
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
