"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { FaqList } from "./faq-list";
import { normalizeQuery } from "@/lib/search-index";

type Item = { q: string; a: string; topic: string };

/** Domande frequenti con ricerca dal vivo: senza query, i gruppi per argomento. */
export function FaqFinder({ items, groups }: { items: Item[]; groups: readonly { key: string; title: string }[] }) {
  const [query, setQuery] = useState("");
  const q = normalizeQuery(query);
  const found = useMemo(() => {
    if (!q) return null;
    const words = q.split(" ");
    return items.filter((f) => {
      const text = normalizeQuery(`${f.q} ${f.a}`);
      return words.every((w) => text.includes(w));
    });
  }, [items, q]);
  return (
    <div className="container-rc space-y-10 py-10 sm:py-14">
      <div>
        <label className="flex max-w-2xl items-center gap-3 rounded-2xl border border-line bg-paper px-4 py-3 shadow-[var(--shadow-card)] focus-within:border-teal">
          <Search aria-hidden className="h-5 w-5 shrink-0 text-teal" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cerca: prezzo, email, familiare…"
            autoComplete="off"
            aria-label="Cerca tra le domande"
            className="min-w-0 flex-1 bg-transparent text-lg text-ink outline-none placeholder:text-muted"
          />
          {query ? (
            <button type="button" onClick={() => setQuery("")} className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-mist">
              <X aria-hidden className="h-4 w-4" />
              <span className="sr-only">Cancella la ricerca</span>
            </button>
          ) : null}
        </label>
        {found ? (
          <p className="mt-3 text-[1.0625rem] text-muted" aria-live="polite">
            {found.length} {found.length === 1 ? "risposta" : "risposte"} per «{query.trim()}»
          </p>
        ) : null}
      </div>
      {found ? (
        found.length ? (
          <FaqList items={found} />
        ) : (
          <p className="rounded-[var(--radius-lg)] bg-mist px-6 py-8 text-lg text-ink">Nessuna risposta con queste parole. Prova con una parola sola, oppure scrivici dalla pagina Contatti.</p>
        )
      ) : (
        groups.map((g) => (
          <section key={g.key} aria-labelledby={`faq-${g.key}`}>
            <h2 id={`faq-${g.key}`} className="mb-5 text-[1.75rem] font-bold text-ink">
              {g.title}
            </h2>
            <FaqList items={items.filter((f) => f.topic === g.key)} />
          </section>
        ))
      )}
    </div>
  );
}
