"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { normalizeQuery } from "@/lib/search-index";

export interface TermCard {
  slug: string;
  term: string;
  aliases: string[];
  definition: string;
}

/** Glossario con filtro dal vivo: senza query, l'elenco per lettera con la barra alfabetica. */
export function GlossaryFinder({ groups }: { groups: { letter: string; entries: TermCard[] }[] }) {
  const [query, setQuery] = useState("");
  const q = normalizeQuery(query);
  const all = useMemo(() => groups.flatMap((g) => g.entries), [groups]);
  const filtered = useMemo(() => {
    if (!q) return null;
    return all
      .map((e) => {
        const t = normalizeQuery(e.term);
        const al = e.aliases.map(normalizeQuery);
        let score = 0;
        if (t.startsWith(q)) score = 3;
        else if (al.some((a) => a.startsWith(q))) score = 2.5;
        else if (t.includes(q) || al.some((a) => a.includes(q))) score = 2;
        else if (q.length >= 4 && normalizeQuery(e.definition).includes(q)) score = 1;
        return { e, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((x) => x.e);
  }, [all, q]);

  return (
    <>
      <div className="container-rc py-6">
        <p role="note" className="max-w-3xl rounded-2xl border border-dashed border-warn/60 bg-cream px-5 py-4 text-sm text-ink-soft">
          Bozze editoriali in attesa di revisione medica. Per le guide complete sugli esami vedi{" "}
          <Link href="/guide" className="link">
            Guide
          </Link>
          .
        </p>
        <label className="mt-6 flex max-w-2xl items-center gap-3 rounded-2xl border border-line bg-paper px-4 py-3 shadow-[var(--shadow-card)] focus-within:border-teal">
          <Search aria-hidden className="h-5 w-5 shrink-0 text-teal" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Cerca tra ${all.length} termini: HbA1c, VES, ematocrito…`}
            autoComplete="off"
            aria-label="Cerca un termine"
            className="min-w-0 flex-1 bg-transparent text-lg text-ink outline-none placeholder:text-muted"
          />
          {query ? (
            <button type="button" onClick={() => setQuery("")} className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-mist">
              <X aria-hidden className="h-4 w-4" />
              <span className="sr-only">Cancella la ricerca</span>
            </button>
          ) : null}
        </label>
        {filtered ? (
          <p className="mt-3 text-sm text-muted" aria-live="polite">
            {filtered.length} {filtered.length === 1 ? "termine" : "termini"} per «{query.trim()}»
          </p>
        ) : (
          <nav aria-label="Lettere" className="mt-6">
            <ul className="flex flex-wrap gap-1">
              {groups.map((g) => (
                <li key={g.letter}>
                  <a href={`#lettera-${g.letter}`} className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-mist font-semibold text-ink hover:bg-marker-soft">
                    {g.letter}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
      <div className="container-rc space-y-10 py-10 sm:py-14">
        {filtered ? (
          filtered.length ? (
            <dl className="divide-y divide-line rounded-[var(--radius-lg)] border border-line bg-paper">
              {filtered.map((e) => (
                <Row key={e.slug} e={e} />
              ))}
            </dl>
          ) : (
            <div className="rounded-[var(--radius-lg)] bg-mist px-6 py-10 text-center">
              <p className="text-xl font-bold text-ink">Nessun termine con questo nome.</p>
              <p className="mt-2 text-ink-soft">Prova con una parte della parola, oppure cerca l&apos;esame tra le guide.</p>
              <Link href="/guide" className="btn btn-secondary mt-5">
                Vai alle guide
              </Link>
            </div>
          )
        ) : (
          groups.map((g) => (
            <section key={g.letter} id={`lettera-${g.letter}`} aria-labelledby={`lettera-${g.letter}-titolo`} className="scroll-mt-28">
              <h2 id={`lettera-${g.letter}-titolo`} className="font-serif text-3xl text-ink">{g.letter}</h2>
              <dl className="mt-4 divide-y divide-line rounded-[var(--radius-lg)] border border-line bg-paper">
                {g.entries.map((e) => (
                  <Row key={e.slug} e={e} />
                ))}
              </dl>
            </section>
          ))
        )}
      </div>
    </>
  );
}

function Row({ e }: { e: TermCard }) {
  return (
    <div className="grid gap-1 px-5 py-4 sm:grid-cols-[220px_1fr] sm:gap-6">
      <dt className="font-semibold text-ink">
        <Link href={`/glossario/${e.slug}`} className="link">
          {e.term}
        </Link>
        {e.aliases.length ? <span className="block text-xs font-normal uppercase tracking-wide text-muted">{e.aliases.slice(0, 2).join(" · ")}</span> : null}
      </dt>
      <dd className="text-[0.9375rem] text-ink-soft">{e.definition}</dd>
    </div>
  );
}
