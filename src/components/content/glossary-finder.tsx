"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SearchField } from "@/components/ui/search-field";
import { normalizeQuery } from "@/lib/search-core";

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
      <div className="container-rc finder-head">
        <SearchField value={query} onChange={setQuery} label="Cerca un termine" placeholder={`Cerca tra ${all.length} termini: HbA1c, VES…`} className="max-w-2xl" />
        {filtered ? (
          <p className="mt-3 text-base text-muted" aria-live="polite">
            {filtered.length} {filtered.length === 1 ? "termine" : "termini"} per «{query.trim()}»
          </p>
        ) : null}
        <p role="note" className="mt-3 max-w-3xl text-base text-muted">
          Bozze editoriali in attesa di revisione medica. Per le guide complete sugli esami vedi{" "}
          <Link href="/guide" className="link">
            Guide
          </Link>
          .
        </p>
      </div>
      {filtered ? null : (
        <nav aria-label="Lettere" className="glossary-letters sticky z-30 border-b border-line/70 bg-canvas/95 py-2 backdrop-blur">
          <ul className="container-rc flex gap-1.5 overflow-x-auto sm:flex-wrap">
            {groups.map((g) => (
              <li key={g.letter}>
                <a href={`#lettera-${g.letter}`} className="letter-pill">
                  {g.letter}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
      <div className="container-rc finder-body space-y-10">
        {filtered ? (
          filtered.length ? (
            <dl className="term-list">
              {filtered.map((e) => (
                <Row key={e.slug} e={e} />
              ))}
            </dl>
          ) : (
            <div className="empty-state">
              <p className="text-xl font-bold text-ink">Nessun termine con questo nome.</p>
              <p className="mt-2 text-lg text-ink-soft">Prova con una parte della parola, oppure cerca l&apos;esame tra le guide.</p>
              <Link href="/guide" className="btn btn-secondary mt-5">
                Vai alle guide
              </Link>
            </div>
          )
        ) : (
          groups.map((g) => (
            <section key={g.letter} id={`lettera-${g.letter}`} aria-labelledby={`lettera-${g.letter}-titolo`} className="scroll-mt-44">
              <h2 id={`lettera-${g.letter}-titolo`} className="letter-head">
                {g.letter}
              </h2>
              <dl className="term-list mt-3">
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
    <div className="grid gap-1 px-5 py-4 text-lg sm:grid-cols-[260px_1fr] sm:gap-6 sm:px-7">
      <dt className="font-bold text-ink">
        <Link href={`/glossario/${e.slug}`} className="link inline-flex min-h-11 items-center">
          {e.term}
        </Link>
        {e.aliases.length ? <span className="block text-[0.9375rem] font-normal text-muted">{e.aliases.slice(0, 2).join(" · ")}</span> : null}
      </dt>
      {/* Ciclo 2, fase 4: su telefono due righe per voce (la definizione intera è nella scheda del termine). */}
      <dd className="line-clamp-2 text-[1.0625rem] text-ink-soft sm:line-clamp-none">{e.definition}</dd>
    </div>
  );
}
