"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FaqList } from "./faq-list";
import { SearchField } from "./search-field";
import { normalizeQuery } from "@/lib/search-core";

type Item = { q: string; a: string; topic: string };

/**
 * Domande frequenti, grafica «Luce»: a sinistra la ricerca e gli argomenti (restano in vista mentre scorri),
 * a destra le risposte. Su telefono gli argomenti diventano una riga di pillole. Senza query: i gruppi per argomento.
 */
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
    <div className="container-rc faq-layout">
      <div className="faq-side">
        <SearchField value={query} onChange={setQuery} label="Cerca tra le domande" placeholder="Cerca: prezzo, email…" />
        {found ? (
          <p className="mt-3 text-[1.0625rem] text-muted" aria-live="polite">
            {found.length} {found.length === 1 ? "risposta" : "risposte"} per «{query.trim()}»
          </p>
        ) : (
          <nav aria-label="Argomenti" className="mt-4">
            <ul className="faq-topics">
              {groups.map((g) => (
                <li key={g.key}>
                  <a href={`#faq-${g.key}`} className="faq-topic">
                    {g.title}
                    <span aria-hidden>{items.filter((f) => f.topic === g.key).length}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
      <div className="min-w-0 space-y-9 sm:space-y-12">
        {found ? (
          found.length ? (
            <FaqList items={found} />
          ) : (
            <div className="empty-state">
              <p className="text-xl font-bold text-ink">Nessuna risposta con queste parole.</p>
              <p className="mt-2 text-lg text-ink-soft">Prova con una parola sola, più semplice.</p>
              <Link href="/contatti" className="btn btn-secondary mt-5">
                Vai ai contatti
              </Link>
            </div>
          )
        ) : (
          groups.map((g) => (
            <section key={g.key} id={`faq-${g.key}`} aria-labelledby={`faq-${g.key}-titolo`} className="scroll-mt-28">
              <h2 id={`faq-${g.key}-titolo`} className="display-md mb-5">
                {g.title}
              </h2>
              <FaqList items={items.filter((f) => f.topic === g.key)} />
            </section>
          ))
        )}
      </div>
    </div>
  );
}
