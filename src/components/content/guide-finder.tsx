"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Bean,
  BookOpenText,
  Camera,
  Candy,
  Droplet,
  Droplets,
  Flame,
  FlaskConical,
  Gauge,
  HeartPulse,
  Pill,
  Plus,
  ScanLine,
  Search,
  TestTubes,
  type LucideIcon,
} from "lucide-react";
import { SearchField } from "@/components/ui/search-field";
import { normalizeQuery } from "@/lib/search-index";

export interface GuideCard {
  slug: string;
  examName: string;
  metaDescription: string;
  aliases: string[];
  category: string;
}

/** Un'icona per argomento: aiuta a ritrovare la categoria a colpo d'occhio. Solo decorazione. */
const CATEGORY_ICON: Record<string, LucideIcon> = {
  "come-leggere": BookOpenText,
  emocromo: Droplets,
  metabolismo: Candy,
  lipidi: Droplet,
  fegato: FlaskConical,
  reni: Bean,
  tiroide: Gauge,
  ferro: Pill,
  infiammazione: Flame,
  ormoni: TestTubes,
  immagini: ScanLine,
  "cuore-e-funzionali": HeartPulse,
  endoscopie: Camera,
};

/**
 * Hub delle guide, grafica «Luce»: un campo di ricerca grande, le più consultate, gli argomenti con la loro icona.
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
    <div className="container-rc finder">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
        <SearchField value={query} onChange={setQuery} label="Cerca una guida" placeholder={`Cerca tra ${guides.length} guide: TSH, emocromo…`} />
        <Link href="/strumenti/domande-per-il-medico" className="btn btn-secondary btn-lg">
          Prepara le domande per il medico <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
        </Link>
      </div>
      <p className="mt-3 text-base text-muted" aria-live="polite">
        {filtering ? `${filtered.length} ${filtered.length === 1 ? "guida" : "guide"}${q ? ` per «${query.trim()}»` : ""}` : `${guides.length} guide in ${categories.length} argomenti`}
      </p>
      <p role="note" className="mt-1 max-w-3xl text-base text-muted">
        Le guide sono bozze editoriali in attesa di revisione medica. Sono informative: non sostituiscono il parere del tuo medico.
      </p>

      {cat ? (
        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
          <h2 className="display-md">{categories.find((c) => c.id === cat)?.title}</h2>
          <button type="button" onClick={() => setCat(null)} className="btn btn-secondary btn-sm">
            <ArrowLeft aria-hidden className="h-4 w-4" /> Tutti gli argomenti
          </button>
        </div>
      ) : null}

      <div className="mt-8 space-y-12 sm:mt-10 sm:space-y-16">
        {filtering ? (
          filtered.length ? (
            <ul className="guide-grid">
              {filtered.map((g) => (
                <Card key={g.slug} g={g} />
              ))}
            </ul>
          ) : (
            <div className="empty-state">
              <p className="text-xl font-bold text-ink">Nessuna guida con questo nome.</p>
              <p className="mt-2 text-lg text-ink-soft">Prova con la sigla stampata sul referto, oppure cerca la parola nel glossario.</p>
              <Link href="/glossario" className="btn btn-secondary mt-5">
                Apri il glossario
              </Link>
            </div>
          )
        ) : (
          <>
            <section aria-labelledby="piu-consultate">
              <h2 id="piu-consultate" className="display-md">
                Le più consultate
              </h2>
              <ul className="guide-grid mt-5 sm:mt-7">
                {POPULAR.map((slug) => guides.find((g) => g.slug === slug))
                  .filter((g): g is GuideCard => Boolean(g))
                  .map((g) => (
                    <Card key={g.slug} g={g} />
                  ))}
              </ul>
            </section>
            <section aria-labelledby="categorie-titolo">
              <h2 id="categorie-titolo" className="display-md">
                Per argomento
              </h2>
              <ul className="guide-grid mt-5 sm:mt-7">
                {categories.map((c) => {
                  const n = guides.filter((g) => g.category === c.id).length;
                  if (!n) return null;
                  const Icon = CATEGORY_ICON[c.id] ?? BookOpenText;
                  return (
                    <li key={c.id}>
                      <button type="button" onClick={() => setCat(c.id)} className="row-card">
                        <span aria-hidden className="tile-ico tile-ico-sm">
                          <Icon />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="row-card-title">{c.title}</span>
                          <span className="row-card-meta">{n} guide</span>
                        </span>
                        <ArrowRight aria-hidden className="row-card-go" />
                      </button>
                    </li>
                  );
                })}
                <li>
                  <Link href="/glossario" className="row-card row-card-warm">
                    <span aria-hidden className="tile-ico tile-ico-sm">
                      <Search />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="row-card-title">Glossario</span>
                      <span className="row-card-meta">Le sigle del referto, in una riga</span>
                    </span>
                    <ArrowRight aria-hidden className="row-card-go" />
                  </Link>
                </li>
              </ul>
            </section>
            <div className="faq-list">
              <details>
                <summary>
                  Tutte le {guides.length} guide, dalla A alla Z
                  <span aria-hidden className="faq-plus">
                    <Plus className="h-5 w-5" />
                  </span>
                </summary>
                <ul className="columns-1 gap-8 px-5 pb-5 sm:columns-2 sm:px-7 lg:columns-3">
                  {[...guides]
                    .sort((a, b) => a.examName.localeCompare(b.examName, "it"))
                    .map((g) => (
                      <li key={g.slug} className="break-inside-avoid">
                        <Link href={`/guide/${g.slug}`} className="link inline-flex min-h-11 min-w-11 items-center text-[1.0625rem]">
                          {g.examName}
                        </Link>
                      </li>
                    ))}
                </ul>
              </details>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Card({ g }: { g: GuideCard }) {
  return (
    <li>
      <Link href={`/guide/${g.slug}`} className="guide-card">
        <span className="guide-card-title">{g.examName}</span>
        <span className="guide-card-text">{g.metaDescription}</span>
        <span className="guide-card-go">
          Leggi la guida <ArrowRight aria-hidden className="h-5 w-5" />
        </span>
      </Link>
    </li>
  );
}
