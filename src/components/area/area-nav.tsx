"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clsx } from "clsx";
import {
  BellRing,
  FilePlus2,
  Files,
  FolderOpen,
  LineChart,
  LogOut,
  NotebookPen,
  Receipt,
  Settings,
  Stethoscope,
  Users,
  Video,
} from "lucide-react";
import { LogoMark } from "@/components/brand/logo";
import { api } from "./api";
import { isFocusPath } from "./area-shell";
import { isDoctorPath, mediciEnabled, secondoParereEnabled } from "@/lib/medici";
import { cancellaDatiSanitariSulDispositivo } from "@/lib/dati-sul-dispositivo";

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
  // 21/11/2026: diari della salute (pressione, glicemia, mal di testa).
  {
    href: "/area-personale/diari",
    label: "Diari della salute",
    short: "Diari",
    icon: NotebookPen,
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

// 27/11/2026 (fase 1): con il secondo parere «In arrivo» la voce «I miei pareri» non c'è (prima portava a pagare).
export const AREA_ITEMS = (MEDICI ? ITEMS_ALL : ITEMS_ALL.filter((i) => !isDoctorPath(i.href))).filter((i) => secondoParereEnabled() || i.href !== "/area-personale/secondo-parere");
/** Quinta voce della barra in basso su telefono: le richieste al medico oppure, senza medici, i promemoria. */
const byHref = (h: string) => ITEMS_ALL.find((i) => i.href === h)!;
// 21/11/2026: le voci si cercano per indirizzo, non per posizione (i diari si sono aggiunti in mezzo).
const LAST_TAB = MEDICI ? byHref("/richieste") : byHref("/area-personale/promemoria");

/**
 * Navigazione dell'area personale Cura Privata.
 * Desktop: colonna laterale con orientamento (chi sei, che cosa puoi fare, che cosa arriverà).
 * Mobile: barra in basso con 5 voci etichettate (target ≥ 44px), come chiede il kit.
 */
/** Voci della barra in basso su telefono: referti, nel tempo, nuovo, famiglia, medico (o promemoria). */
export const AREA_TAB_HREFS = [
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
    cancellaDatiSanitariSulDispositivo(); // 27/11/2026: su un telefono condiviso non restano risposte sanitarie
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
                {AREA_ITEMS.map(({ href, label, icon: Icon, exact }) => {
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
        </div>
      </aside>

      {/*
        Mobile: solo la barra in basso. 18/11/2026 (secondo giro, punto 4): la riga con marchio, nome, «Altro» ed «Esci»
        non c'è più: era una terza barra sotto l'avviso e la testata, con il nome tagliato («Acco…»). Le stesse voci
        stanno nel menu della testata (src/components/site/site-header.tsx), in cima, sotto «Il tuo spazio».
      */}
      <nav
        aria-label="Area personale"
        className="area-tabbar no-print fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
      >
        <ul className="mx-auto grid max-w-lg grid-cols-5">
          {[
            AREA_ITEMS[0],
            AREA_ITEMS[1],
            {
              href: "/area-personale/nuovo",
              label: "Nuovo",
              short: "Nuovo",
              icon: FilePlus2,
              exact: true,
            },
            byHref("/area-personale/famiglia"),
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
