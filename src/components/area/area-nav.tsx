"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clsx } from "clsx";
import { FilePlus2, Files, FolderOpen, LogOut, Settings } from "lucide-react";
import { api } from "./api";

const ITEMS = [
  { href: "/area", label: "Referti", icon: Files, exact: true },
  { href: "/area/dossier", label: "Dossier", icon: FolderOpen, exact: false },
  { href: "/area/impostazioni", label: "Impostazioni", icon: Settings, exact: false },
];

export function AreaNav({ email, displayName, isDemo }: { email: string; displayName: string | null; isDemo: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  async function logout() {
    await api("/api/v1/auth/logout", { method: "POST", body: {} });
    router.push("/");
    router.refresh();
  }
  return (
    <div className="flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-center sm:justify-between">
      <nav aria-label="Area personale">
        <ul className="flex flex-wrap items-center gap-1">
          {ITEMS.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link href={href} aria-current={active ? "page" : undefined} className={clsx("inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-[0.9375rem] font-medium transition-colors", active ? "bg-mist text-ink" : "text-ink-soft hover:bg-mist/70 hover:text-ink")}>
                  <Icon aria-hidden className="h-4 w-4" /> {label}
                </Link>
              </li>
            );
          })}
          <li>
            <Link href="/area/nuovo" className="btn btn-primary ml-1 min-h-11 px-4 text-sm">
              <FilePlus2 aria-hidden className="h-4 w-4" /> Nuovo referto
            </Link>
          </li>
        </ul>
      </nav>
      <div className="flex items-center justify-between gap-3 text-sm text-muted sm:justify-end">
        <span className="truncate">
          {displayName ?? email}
          {isDemo ? <span className="chip ml-2 bg-cream text-ink">demo</span> : null}
        </span>
        <button type="button" onClick={logout} className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 font-semibold text-teal hover:bg-mist">
          <LogOut aria-hidden className="h-4 w-4" /> Esci
        </button>
      </div>
    </div>
  );
}
