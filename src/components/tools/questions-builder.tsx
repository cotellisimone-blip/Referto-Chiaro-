"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { clsx } from "clsx";
import { ArrowRight, Check, Copy, Link2, ListChecks, Printer, Search, Trash2, X } from "lucide-react";
import { normalizeQuery } from "@/lib/search-index";

export interface ExamOption {
  slug: string;
  name: string;
  aliases: string[];
  category: string;
  questions: string[];
}

const ALWAYS = [
  "Questi risultati, nel mio caso, richiedono qualche controllo o approfondimento?",
  "C'è qualcosa che devo cambiare o tenere d'occhio da qui alla prossima visita?",
  "Tra quanto tempo conviene ripetere questi esami?",
];

/**
 * Compone la lista delle domande dagli esami scelti. La scelta parte dall'URL (?esami=tsh,emocromo) e vi torna
 * a ogni modifica, così la lista si può salvare tra i preferiti o condividere senza che nessun dato lasci il browser.
 * Le spunte sulle singole domande sono locali alla pagina e non si salvano da nessuna parte.
 */
export function QuestionsBuilder({ options, categories }: { options: ExamOption[]; categories: { id: string; title: string }[] }) {
  const params = useSearchParams();
  const bySlug = useMemo(() => new Map(options.map((o) => [o.slug, o])), [options]);
  const [selected, setSelectedState] = useState<string[]>(() =>
    (params.get("esami") ?? "")
      .split(",")
      .filter((s) => bySlug.has(s)),
  );
  const [query, setQuery] = useState("");
  const [done, setDone] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState<"testo" | "link" | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  function setSelected(next: string[]) {
    setSelectedState(next);
    const sp = new URLSearchParams(window.location.search);
    if (next.length) sp.set("esami", next.join(","));
    else sp.delete("esami");
    window.history.replaceState(null, "", `${window.location.pathname}${sp.size ? `?${sp}` : ""}`);
  }
  const toggle = (slug: string) => setSelected(selected.includes(slug) ? selected.filter((s) => s !== slug) : [...selected, slug]);

  const q = normalizeQuery(query);
  const filtered = q
    ? options.filter((o) => {
        const hay = [o.name, ...o.aliases].map(normalizeQuery);
        return hay.some((h) => h.includes(q));
      })
    : options;
  const grouped = categories.map((c) => ({ ...c, items: filtered.filter((o) => o.category === c.id) })).filter((c) => c.items.length);

  // Domande deduplicate, raggruppate per esame; poi quelle "sempre utili".
  const sections = selected.map((s) => bySlug.get(s)!).map((o) => ({ exam: o, questions: o.questions }));
  const seen = new Set<string>();
  for (const sec of sections) sec.questions = sec.questions.filter((x) => (seen.has(x) ? false : (seen.add(x), true)));
  const total = sections.reduce((n, s) => n + s.questions.length, 0) + (selected.length ? ALWAYS.length : 0);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(null), 1800);
    return () => clearTimeout(t);
  }, [copied]);

  async function copyText() {
    const lines = [
      "Domande per il medico (Cura Privata)",
      "",
      ...sections.flatMap((s) => [`${s.exam.name}`, ...s.questions.map((x) => `  • ${x}`), ""]),
      "Da chiedere sempre",
      ...ALWAYS.map((x) => `  • ${x}`),
    ];
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied("testo");
    } catch {}
  }
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied("link");
    } catch {}
  }

  return (
    <div className="container-rc grid gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-12 lg:py-14">
      {/* Colonna 1: scelta degli esami */}
      <section aria-labelledby="scegli-titolo" className="no-print min-w-0">
        <h2 id="scegli-titolo" className="display-lg text-[1.75rem] sm:text-[2.25rem]">
          1. Quali esami hai fatto?
        </h2>
        <label className="mt-5 flex items-center gap-3 rounded-2xl border border-line bg-paper px-4 py-3 shadow-[var(--shadow-card)] focus-within:border-teal">
          <Search aria-hidden className="h-5 w-5 shrink-0 text-teal" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cerca: TSH, emocromo, ecografia…"
            autoComplete="off"
            className="min-w-0 flex-1 bg-transparent text-lg text-ink outline-none placeholder:text-muted"
            aria-label="Cerca un esame"
          />
          {query ? (
            <button type="button" onClick={() => setQuery("")} className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-mist">
              <X aria-hidden className="h-4 w-4" />
              <span className="sr-only">Cancella la ricerca</span>
            </button>
          ) : null}
        </label>
        <p className="mt-2 text-sm text-muted" aria-live="polite">
          {q ? `${filtered.length} ${filtered.length === 1 ? "esame trovato" : "esami trovati"}` : `${options.length} esami disponibili`}
          {selected.length ? ` · ${selected.length} ${selected.length === 1 ? "scelto" : "scelti"}` : ""}
        </p>

        {selected.length ? (
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Esami scelti">
            {selected.map((s) => (
              <li key={s}>
                <button type="button" onClick={() => toggle(s)} className="chip bg-strong text-on-strong hover:bg-strong-soft">
                  {bySlug.get(s)!.name} <X aria-hidden className="h-3.5 w-3.5" />
                  <span className="sr-only">(togli)</span>
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-6 space-y-3">
          {grouped.length === 0 ? <p className="rounded-2xl bg-mist px-5 py-6 text-ink-soft">Nessun esame con questo nome. Prova con la sigla stampata sul referto.</p> : null}
          {grouped.map((c) => {
            const openByDefault = Boolean(q) || c.items.some((o) => selected.includes(o.slug)) || c.id === "emocromo";
            return (
              <details key={`${c.id}-${q ? "q" : "all"}`} open={openByDefault} className="group card overflow-hidden">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-5 py-3 font-semibold text-ink [&::-webkit-details-marker]:hidden">
                  <span>
                    {c.title}
                    <span className="ml-2 text-sm font-normal text-muted">{c.items.length}</span>
                  </span>
                  <span aria-hidden className="flex h-8 w-8 items-center justify-center rounded-full bg-mist text-teal transition-transform group-open:rotate-180">
                    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 8l5 5 5-5" />
                    </svg>
                  </span>
                </summary>
                <ul className="grid gap-2 border-t border-line p-3 sm:grid-cols-2">
                  {c.items.map((o) => {
                    const on = selected.includes(o.slug);
                    return (
                      <li key={o.slug}>
                        <label className="check-row">
                          <input type="checkbox" className="check-box" checked={on} onChange={() => toggle(o.slug)} />
                          <span className="min-w-0">
                            <span className="block font-semibold text-ink">{o.name}</span>
                            <span className="block text-sm text-muted">
                              {o.questions.length} domande{o.aliases.length ? ` · ${o.aliases.slice(0, 2).join(", ")}` : ""}
                            </span>
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </details>
            );
          })}
        </div>
      </section>

      {/* Colonna 2: la lista */}
      <section aria-labelledby="lista-titolo" className="min-w-0 lg:sticky lg:top-24 lg:self-start" ref={listRef}>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="lista-titolo" className="display-lg text-[1.75rem] sm:text-[2.25rem]">
            2. La tua lista
          </h2>
          {total ? (
            <p className="no-print text-[0.9375rem] text-muted" aria-live="polite">
              <span className="tabular font-semibold text-ink">{done.size}</span> / <span className="tabular">{total}</span> fatte in visita
            </p>
          ) : null}
        </div>

        {!selected.length ? (
          <div className="card mt-5 grid gap-6 p-6 sm:grid-cols-[auto_1fr] sm:items-center sm:p-8">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-mist">
              <ListChecks aria-hidden className="h-8 w-8 text-teal" />
            </span>
            <div>
              <p className="text-xl font-bold text-ink">Scegli almeno un esame.</p>
              <p className="mt-1 text-lg text-ink-soft">La lista si compone da sola, qui. Se non trovi un esame, cerca la sigla stampata sul referto.</p>
              <p className="mt-3 flex flex-wrap gap-2">
                {["emocromo", "tsh", "glicemia", "colesterolo-ldl"].filter((s) => bySlug.has(s)).map((s) => (
                  <button key={s} type="button" onClick={() => toggle(s)} className="chip bg-paper text-ink ring-1 ring-line hover:bg-mist">
                    + {bySlug.get(s)!.name}
                  </button>
                ))}
              </p>
            </div>
          </div>
        ) : (
          <div className="print-sheet card mt-5 overflow-hidden">
            <div className="no-print flex flex-wrap items-center gap-2 border-b border-line bg-mist/60 px-4 py-3 sm:px-5">
              <button type="button" onClick={() => window.print()} className="btn btn-primary btn-sm">
                <Printer aria-hidden className="h-4 w-4" /> Stampa
              </button>
              <button type="button" onClick={copyText} className="btn btn-secondary btn-sm">
                {copied === "testo" ? <Check aria-hidden className="h-4 w-4" /> : <Copy aria-hidden className="h-4 w-4" />} {copied === "testo" ? "Copiato" : "Copia il testo"}
              </button>
              <button type="button" onClick={copyLink} className="btn btn-secondary btn-sm">
                {copied === "link" ? <Check aria-hidden className="h-4 w-4" /> : <Link2 aria-hidden className="h-4 w-4" />} {copied === "link" ? "Link copiato" : "Copia il link"}
              </button>
              <button type="button" onClick={() => { setSelected([]); setDone(new Set()); }} className="btn btn-ghost btn-sm ml-auto">
                <Trash2 aria-hidden className="h-4 w-4" /> Svuota
              </button>
            </div>
            <div className="p-5 sm:p-7">
              <p className="eyebrow">Domande per il medico</p>
              <p className="mt-2 text-[0.9375rem] text-muted">
                Esami: {sections.map((s) => s.exam.name).join(", ")}. Lista preparata con Cura Privata, dalle guide agli esami. Non contiene valori né dati personali.
              </p>
              <ol className="mt-6 space-y-7">
                {sections.map((s) => (
                  <li key={s.exam.slug}>
                    <h3 className="flex items-center justify-between gap-3 text-lg font-bold text-ink">
                      {s.exam.name}
                      <Link href={`/guide/${s.exam.slug}`} className="no-print link text-sm font-medium">
                        Guida
                      </Link>
                    </h3>
                    {s.questions.length ? (
                      <ul className="mt-3 space-y-2">
                        {s.questions.map((x) => (
                          <QuestionRow key={x} text={x} checked={done.has(x)} onToggle={() => setDone((d) => { const n = new Set(d); if (n.has(x)) n.delete(x); else n.add(x); return n; })} />
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-2 text-sm text-muted">Le domande di questo esame sono già comprese sopra.</p>
                    )}
                  </li>
                ))}
                <li>
                  <h3 className="text-lg font-bold text-ink">Da chiedere sempre</h3>
                  <ul className="mt-3 space-y-2">
                    {ALWAYS.map((x) => (
                      <QuestionRow key={x} text={x} checked={done.has(x)} onToggle={() => setDone((d) => { const n = new Set(d); if (n.has(x)) n.delete(x); else n.add(x); return n; })} />
                    ))}
                  </ul>
                </li>
              </ol>
              <div className="mt-8 rounded-2xl bg-cream/70 px-4 py-3 text-[0.9375rem] text-ink">
                Spazio per le risposte: porta carta e penna, oppure scrivi le note sul telefono durante la visita. Le spiegazioni informative non sostituiscono una valutazione medica.
              </div>
              <p className="no-print mt-6 text-[0.9375rem] text-muted">
                Vuoi capire anche i valori del referto?{" "}
                <Link href="/referti/esempio" className="link">
                  Prova la demo <ArrowRight aria-hidden className="inline h-3.5 w-3.5" />
                </Link>
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function QuestionRow({ text, checked, onToggle }: { text: string; checked: boolean; onToggle: () => void }) {
  return (
    <li>
      <label className="check-row">
        <input type="checkbox" className="check-box no-print" checked={checked} onChange={onToggle} />
        <span aria-hidden className="print-only check-print" />
        <span className={clsx("text-[1.0625rem] text-ink", checked && "text-muted line-through decoration-teal/60")}>{text}</span>
      </label>
    </li>
  );
}
