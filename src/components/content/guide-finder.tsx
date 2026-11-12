"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Search, X } from "lucide-react";
import { normalizeQuery } from "@/lib/search-index";

export interface GuideCard {
  slug: string;
  examName: string;
  metaDescription: string;
  aliases: string[];
  category: string;
}

/**
 * Hub delle guide con filtro dal vivo: un campo e le categorie come chip.
 * Senza JavaScript o senza query si vede l'elenco completo, per categoria (stessi link di prima).
 */
const POPULAR = ["emocromo", "glicemia", "colesterolo-ldl", "tsh", "creatinina", "esame-delle-urine"];

export function GuideFinder({ guides, categories }: { guides: GuideCard[]; categories: { id: string; title: string; lead: string }[] }) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const q = normalizeQuery(query);
  const filtered = useMemo(() => {
    let list = guides;
    if (cat) list = list.filter((g) => g.category === cat);
    if (q) {
      const words = q.split(" ");
      list = list
        .map((g) => {
          const name = normalizeQuery(g.examName);
          const aliases = g.aliases.map(normalizeQuery);
          let score = 0;
          if (name.startsWith(q)) score = 3;
          else if (aliases.some((a) => a.startsWith(q))) score = 2.5;
          else if (words.every((w) => name.includes(w) || aliases.some((a) => a.includes(w)))) score = 2;
          else if (q.length >= 4 && words.every((w) => normalizeQuery(g.metaDescription).includes(w))) score = 1;
          return { g, score };
        })
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((x) => x.g);
    }
    return list;
  }, [guides, cat, q]);
  const filtering = Boolean(q) || Boolean(cat);

  return (
    <div>
      <div className="container-rc py-6">
        <p role="note" className="max-w-3xl text-[0.9375rem] text-muted">
          Le guide sono bozze editoriali in attesa di revisione medica. Sono informative: non sostituiscono il parere del tuo medico.
        </p>
        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
          <label className="flex items-center gap-3 rounded-2xl border border-line bg-paper px-4 py-3 shadow-[var(--shadow-card)] focus-within:border-teal">
            <Search aria-hidden className="h-5 w-5 shrink-0 text-teal" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Cerca tra ${guides.length} guide: TSH, emocromo, ecografia…`}
              autoComplete="off"
              aria-label="Cerca una guida"
              className="min-w-0 flex-1 bg-transparent text-lg text-ink outline-none placeholder:text-muted"
            />
            {query ? (
              <button type="button" onClick={() => setQuery("")} className="inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-mist">
                <X aria-hidden className="h-4 w-4" />
                <span className="sr-only">Cancella la ricerca</span>
              </button>
            ) : null}
          </label>
          <Link href="/strumenti/domande-per-il-medico" className="btn btn-secondary lg:min-h-[60px]">
            Prepara le domande per il medico <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
          </Link>
        </div>

        <p className="mt-3 text-sm text-muted" aria-live="polite">
          {filtering ? `${filtered.length} ${filtered.length === 1 ? "guida" : "guide"}${q ? ` per «${query.trim()}»` : ""}` : `${guides.length} guide in ${categories.length} categorie`}
        </p>
        {cat ? (
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <h2 className="text-[1.75rem] font-bold text-ink">{categories.find((c) => c.id === cat)?.title}</h2>
            <button type="button" onClick={() => setCat(null)} className="btn btn-secondary btn-sm">
              <ArrowLeft aria-hidden className="h-4 w-4" /> Tutte le categorie
            </button>
          </div>
        ) : null}
      </div>

      <div className="container-rc space-y-14 py-8 sm:py-12">
        {filtering ? (
          filtered.length ? (
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((g) => (
                <Card key={g.slug} g={g} />
              ))}
            </ul>
          ) : (
            <div className="rounded-[var(--radius-lg)] bg-mist px-6 py-10 text-center">
              <p className="text-xl font-bold text-ink">Nessuna guida con questo nome.</p>
              <p className="mt-2 text-ink-soft">Prova con la sigla stampata sul referto, oppure cerca la parola nel glossario.</p>
              <Link href="/glossario" className="btn btn-secondary mt-5">
                Apri il glossario
              </Link>
            </div>
          )
        ) : (
          <>
            <section aria-labelledby="piu-consultate">
              <h2 id="piu-consultate" className="text-[1.75rem] font-bold text-ink">Le più consultate</h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {POPULAR.map((slug) => guides.find((g) => g.slug === slug))
                  .filter((g): g is GuideCard => Boolean(g))
                  .map((g) => (
                    <Card key={g.slug} g={g} />
                  ))}
              </ul>
            </section>
            <section aria-labelledby="categorie-titolo">
              <h2 id="categorie-titolo" className="text-[1.75rem] font-bold text-ink">Per argomento</h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((c) => {
                  const n = guides.filter((g) => g.category === c.id).length;
                  if (!n) return null;
                  return (
                    <li key={c.id}>
                      <button type="button" onClick={() => setCat(c.id)} className="card card-lift group flex h-full w-full items-center gap-4 p-5 text-left">
                        <span className="min-w-0 flex-1">
                          <span className="block text-xl font-bold text-ink">{c.title}</span>
                          <span className="mt-1 block text-[1.0625rem] text-ink-soft">{n} guide</span>
                        </span>
                        <ArrowRight aria-hidden className="h-5 w-5 shrink-0 text-teal transition-transform group-hover:translate-x-1" />
                      </button>
                    </li>
                  );
                })}
                <li>
                  <Link href="/glossario" className="card card-lift group flex h-full items-center gap-4 bg-cream p-5">
                    <span className="min-w-0 flex-1">
                      <span className="block text-xl font-bold text-ink">Glossario</span>
                      <span className="mt-1 block text-[1.0625rem] text-ink-soft">Le sigle del referto, in una riga</span>
                    </span>
                    <ArrowRight aria-hidden className="h-5 w-5 shrink-0 text-teal" />
                  </Link>
                </li>
              </ul>
            </section>
            <details className="rounded-[var(--radius-lg)] border border-line bg-paper">
              <summary className="flex min-h-14 cursor-pointer items-center px-5 text-lg font-bold text-ink">Tutte le {guides.length} guide, dalla A alla Z</summary>
              <ul className="columns-1 gap-8 px-5 pb-5 sm:columns-2 lg:columns-3">
                {[...guides].sort((a, b) => a.examName.localeCompare(b.examName, "it")).map((g) => (
                  <li key={g.slug} className="break-inside-avoid">
                    <Link href={`/guide/${g.slug}`} className="link inline-flex min-h-11 min-w-11 items-center text-[1.0625rem]">
                      {g.examName}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          </>
        )}
      </div>
    </div>
  );
}

function Card({ g }: { g: GuideCard }) {
  return (
    <li>
      <Link href={`/guide/${g.slug}`} className="card card-lift card-glow group flex h-full flex-col p-5">
        <span className="text-xl font-bold text-ink">{g.examName}</span>
        <span className="mt-2 line-clamp-2 text-[1.0625rem] text-ink-soft">{g.metaDescription}</span>
        <span className="link mt-auto inline-flex items-center gap-1 pt-3 text-[1.0625rem] font-semibold">
          Leggi la guida <ArrowRight aria-hidden className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </Link>
    </li>
  );
}
