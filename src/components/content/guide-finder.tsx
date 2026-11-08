"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, X } from "lucide-react";
import { clsx } from "clsx";
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
        <p role="note" className="max-w-3xl rounded-2xl border border-dashed border-warn/60 bg-cream px-5 py-4 text-sm text-ink-soft">
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
              <button type="button" onClick={() => setQuery("")} className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-mist">
                <X aria-hidden className="h-4 w-4" />
                <span className="sr-only">Cancella la ricerca</span>
              </button>
            ) : null}
          </label>
          <Link href="/strumenti/domande-per-il-medico" className="btn btn-secondary lg:min-h-[60px]">
            Prepara le domande per il medico <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
          </Link>
        </div>
        <nav aria-label="Categorie" className="mt-5">
          <ul className="flex flex-wrap gap-2">
            <li>
              <button type="button" onClick={() => setCat(null)} aria-pressed={cat === null} className={clsx("chip", cat === null ? "bg-strong text-on-strong" : "bg-mist text-ink hover:bg-marker-soft")}>
                Tutte
              </button>
            </li>
            {categories.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => setCat(cat === c.id ? null : c.id)}
                  aria-pressed={cat === c.id}
                  className={clsx("chip", cat === c.id ? "bg-strong text-on-strong" : "bg-mist text-ink hover:bg-marker-soft")}
                >
                  {c.title}
                </button>
              </li>
            ))}
            <li>
              <Link href="/glossario" className="chip bg-cream text-ink">
                Glossario
              </Link>
            </li>
          </ul>
        </nav>
        <p className="mt-3 text-sm text-muted" aria-live="polite">
          {filtering ? `${filtered.length} ${filtered.length === 1 ? "guida" : "guide"}${q ? ` per «${query.trim()}»` : ""}` : `${guides.length} guide in ${categories.length} categorie`}
        </p>
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
          categories.map((c) => {
            const list = guides.filter((g) => g.category === c.id);
            if (!list.length) return null;
            return (
              <section key={c.id} id={c.id} aria-labelledby={`${c.id}-titolo`} className="scroll-mt-28">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h2 id={`${c.id}-titolo`} className="font-serif text-2xl text-ink sm:text-3xl">{c.title}</h2>
                    <p className="mt-1 text-muted">{c.lead}</p>
                  </div>
                  <span className="chip bg-mist text-muted">{list.length} guide</span>
                </div>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((g) => (
                    <Card key={g.slug} g={g} />
                  ))}
                </ul>
              </section>
            );
          })
        )}
      </div>
    </div>
  );
}

function Card({ g }: { g: GuideCard }) {
  return (
    <li>
      <Link href={`/guide/${g.slug}`} className="card card-lift card-glow group flex h-full flex-col p-5">
        <span className="text-lg font-bold text-ink">{g.examName}</span>
        {g.aliases.length ? <span className="mt-0.5 text-xs uppercase tracking-wide text-muted">{g.aliases.slice(0, 3).join(" · ")}</span> : null}
        <span className="mt-2 line-clamp-3 text-sm text-muted">{g.metaDescription}</span>
        <span className="link mt-auto inline-flex items-center gap-1 pt-3 text-sm">
          Leggi la guida <ArrowRight aria-hidden className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </Link>
    </li>
  );
}
