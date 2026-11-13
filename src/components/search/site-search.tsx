"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { ArrowRight, BookOpenText, FileText, Search, SpellCheck, X } from "lucide-react";
import { searchIndex, type SearchItem, type SearchKind } from "@/lib/search-index";

export const SEARCH_OPEN_EVENT = "cp-search-open";
const RECENT_KEY = "cp-search-recent";

/** Apre la ricerca da qualsiasi punto del sito (pulsante in testata, campo nella home, scorciatoia da tastiera). */
export function openSiteSearch(prefill = "") {
  window.dispatchEvent(new CustomEvent(SEARCH_OPEN_EVENT, { detail: { prefill } }));
}

const SUGGESTIONS = ["Emocromo", "TSH", "Glicemia", "Colesterolo LDL", "Ferritina", "Creatinina", "Vitamina D", "PCR", "Intervallo di riferimento"];

const KIND: Record<SearchKind, { label: string; Icon: typeof FileText }> = {
  guida: { label: "Guide agli esami", Icon: BookOpenText },
  termine: { label: "Glossario", Icon: SpellCheck },
  pagina: { label: "Pagine", Icon: FileText },
};

function readRecent(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    const arr = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(arr) ? arr.filter((x): x is string => typeof x === "string").slice(0, 6) : [];
  } catch {
    return [];
  }
}
function pushRecent(term: string) {
  try {
    const next = [term, ...readRecent().filter((t) => t !== term)].slice(0, 6);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {}
}

/**
 * Ricerca del sito: una finestra con un campo unico su guide, glossario e pagine.
 * L'indice (piccolo, senza dati personali) si scarica alla prima apertura e resta in memoria.
 * Tastiera: ⌘K / Ctrl+K apre, ↑↓ spostano il fuoco tra i risultati (link veri), Invio apre, Esc chiude. Niente si salva tranne le ultime ricerche, nel browser.
 */
export function SiteSearch() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<SearchItem[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);

  const ensureIndex = useCallback(async () => {
    if (index) return;
    try {
      const r = await fetch("/api/v1/public/ricerca");
      if (!r.ok) throw new Error(String(r.status));
      const j = (await r.json()) as { items: SearchItem[] };
      setIndex(j.items);
    } catch {
      setLoadError(true);
    }
  }, [index]);

  // Apertura: evento globale + scorciatoia da tastiera.
  useEffect(() => {
    const onOpen = (e: Event) => {
      const prefill = (e as CustomEvent<{ prefill?: string }>).detail?.prefill ?? "";
      setQuery(prefill);
      setRecent(readRecent());
      setOpen(true);
      void ensureIndex();
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openSiteSearch();
      }
    };
    window.addEventListener(SEARCH_OPEN_EVENT, onOpen);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener(SEARCH_OPEN_EVENT, onOpen);
      window.removeEventListener("keydown", onKey);
    };
  }, [ensureIndex]);

  // Il <dialog> nativo gestisce fuoco, Esc e sfondo inerte.
  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      requestAnimationFrame(() => inputRef.current?.select());
      document.body.style.overflow = "hidden";
    } else if (!open && d.open) {
      d.close();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const results = useMemo(() => (index && query.trim() ? searchIndex(index, query, 14) : []), [index, query]);
  const grouped = useMemo(() => {
    const g: { kind: SearchKind; items: SearchItem[] }[] = [];
    for (const kind of ["guida", "termine", "pagina"] as SearchKind[]) {
      const items = results.filter((r) => r.kind === kind);
      if (items.length) g.push({ kind, items });
    }
    return g;
  }, [results]);

  function remember() {
    if (query.trim()) pushRecent(query.trim());
    setOpen(false);
  }

  /** ↑↓ spostano il fuoco tra campo e risultati; Esc chiude anche se il browser non manda «cancel». */
  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      return;
    }
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    const links = Array.from(e.currentTarget.querySelectorAll<HTMLElement>("[data-result]"));
    if (!links.length) return;
    e.preventDefault();
    const i = links.indexOf(document.activeElement as HTMLElement);
    if (e.key === "ArrowDown") (i < 0 ? links[0] : links[Math.min(i + 1, links.length - 1)]).focus();
    else if (i <= 0) inputRef.current?.focus();
    else links[i - 1].focus();
  }

  const showEmptyState = !query.trim();
  const noResults = index && query.trim() && results.length === 0;

  return (
    <dialog
      ref={dialogRef}
      onClose={() => setOpen(false)}
      onClick={(e) => {
        if (e.target === dialogRef.current) setOpen(false);
      }}
      onCancel={(e) => {
        e.preventDefault();
        setOpen(false);
      }}
      aria-label="Cerca nel sito"
      className="search-dialog"
    >
      {open ? (
      <div className="search-panel" onClick={(e) => e.stopPropagation()} onKeyDown={onKeyDown}>
        <div className="flex items-center gap-3 border-b border-line px-4 py-3 sm:px-5">
          <Search aria-hidden className="h-5 w-5 shrink-0 text-teal" />
          <input
            ref={inputRef}
            type="search"
            aria-controls={listId}
            aria-label="Cerca una sigla, un esame o una pagina"
            placeholder="Cerca una sigla, un esame, una parola…"
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-w-0 flex-1 bg-transparent text-lg text-ink outline-none placeholder:text-muted sm:text-xl"
          />
          <button type="button" onClick={() => setOpen(false)} className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink hover:bg-mist">
            <X aria-hidden className="h-5 w-5" />
            <span className="sr-only">Chiudi la ricerca</span>
          </button>
        </div>

        <div className="search-body" id={listId}>
          <p className="sr-only" aria-live="polite">{index && query.trim() ? `${results.length} risultati` : ""}</p>
          {showEmptyState ? (
            <div className="px-4 py-5 sm:px-5">
              {recent.length ? (
                <>
                  <p className="eyebrow eyebrow-plain">Le tue ultime ricerche</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {recent.map((t) => (
                      <li key={t}>
                        <button type="button" onClick={() => setQuery(t)} className="chip bg-mist text-ink hover:bg-marker-soft">
                          {t}
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
              <p className={clsx("eyebrow eyebrow-plain", recent.length && "mt-6")}>Si cerca spesso</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {SUGGESTIONS.map((t) => (
                  <li key={t}>
                    <button type="button" onClick={() => setQuery(t)} className="chip bg-paper text-ink ring-1 ring-line hover:bg-mist">
                      {t}
                    </button>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-[0.9375rem] text-muted">Trovi spiegazioni generali di esami e sigle. Che cosa significhi un valore per te lo dice il medico.</p>
            </div>
          ) : null}

          {!index && !showEmptyState && !loadError ? <p className="px-5 py-6 text-muted">Carico l&apos;indice…</p> : null}
          {loadError ? <p className="px-5 py-6 text-danger">La ricerca non è disponibile in questo momento. Prova dalle pagine Guide e Glossario.</p> : null}

          {noResults ? (
            <div className="px-5 py-8 text-center">
              <p className="text-lg font-semibold text-ink">Nessun risultato per «{query.trim()}».</p>
              <p className="mt-2 text-muted">Prova con la sigla stampata sul referto (per esempio «ALT», «HbA1c») o sfoglia il glossario.</p>
              <Link href="/glossario" onClick={remember} className="btn btn-secondary mt-5">
                Apri il glossario <ArrowRight aria-hidden className="h-4 w-4" />
              </Link>
            </div>
          ) : null}

          {grouped.map((g) => {
            const { label, Icon } = KIND[g.kind];
            return (
              <div key={g.kind} className="px-2 py-2 sm:px-3">
                <p className="flex items-center gap-2 px-3 pb-1 pt-2 text-[0.9375rem] font-bold text-muted">
                  <Icon aria-hidden className="h-4 w-4" /> {label}
                </p>
                <ul aria-label={label}>
                  {g.items.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} data-result onClick={remember} className="search-result">
                        <span className="min-w-0">
                          <span className="block truncate text-[1.0625rem] font-semibold text-ink">
                            <Highlight text={item.title} query={query} />
                          </span>
                          <span className="block text-[0.9375rem] leading-snug text-muted max-sm:line-clamp-2 sm:truncate">{item.context}</span>
                        </span>
                        <ArrowRight aria-hidden className="h-4 w-4 shrink-0 text-teal opacity-0 transition-opacity" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-4 py-2.5 text-[0.9375rem] text-muted sm:px-5">
          <span className="hidden sm:inline">
            <kbd className="kbd">↑</kbd> <kbd className="kbd">↓</kbd> per scorrere · <kbd className="kbd">Invio</kbd> per aprire · <kbd className="kbd">Esc</kbd> per chiudere
          </span>
          <span>{index ? `${index.length} voci` : ""}</span>
        </div>
      </div>
      ) : null}
    </dialog>
  );
}

/** Evidenzia la parte che corrisponde (solo il primo tratto, in grassetto con traccia di menta). */
function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  if (!q) return <>{text}</>;
  const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const i = norm(text).indexOf(norm(q));
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="search-mark">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}

/** Pulsante o campo che apre la ricerca. `variant="field"` sembra un campo di testo (home, hub guide). */
export function SearchTrigger({ variant = "icon", className, placeholder = "Cerca una sigla o un esame…" }: { variant?: "icon" | "field" | "compact"; className?: string; placeholder?: string }) {
  if (variant === "field") {
    return (
      <button type="button" onClick={() => openSiteSearch()} className={clsx("search-field", className)}>
        <Search aria-hidden className="h-5 w-5 shrink-0 text-teal" />
        <span className="min-w-0 flex-1 truncate text-left text-muted">{placeholder}</span>
        <span aria-hidden className="hidden items-center gap-1 sm:flex">
          <kbd className="kbd">⌘</kbd>
          <kbd className="kbd">K</kbd>
        </span>
        <span className="sr-only">Apri la ricerca</span>
      </button>
    );
  }
  if (variant === "compact") {
    return (
      <button type="button" onClick={() => openSiteSearch()} className={clsx("search-compact", className)}>
        <Search aria-hidden className="h-5 w-5 shrink-0" />
        <span className="hidden truncate 2xl:inline">Cerca</span>
        <kbd aria-hidden className="kbd ml-1 hidden 2xl:inline">⌘K</kbd>
        <span className="sr-only">Apri la ricerca</span>
      </button>
    );
  }
  return (
    <button type="button" onClick={() => openSiteSearch()} className={className ?? "icon-btn icon-btn-solid"}>
      <Search aria-hidden className="h-5 w-5" />
      <span className="sr-only">Cerca nel sito</span>
    </button>
  );
}
