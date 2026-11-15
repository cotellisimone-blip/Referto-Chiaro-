"use client";

import { useState, useSyncExternalStore, type ReactNode } from "react";
import { ChevronDown, Search } from "lucide-react";
import { openSiteSearch } from "@/components/search/site-search";

const PHONE = "(max-width: 820px)";
function subscribe(cb: () => void) {
  const mq = window.matchMedia(PHONE);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
const isPhone = () => window.matchMedia(PHONE).matches;

/**
 * Le sei domande: su computer tutte aperte, su telefono a fisarmonica (la prima aperta). Senza JavaScript, o prima che
 * la pagina sia pronta, il CSS mostra già lo stato giusto: qui si aggiungono solo i pulsanti per aprire e chiudere.
 */
export function Domande({ items }: { items: readonly { icon: ReactNode; q: string; a: ReactNode }[] }) {
  const phone = useSyncExternalStore(subscribe, isPhone, () => false);
  const [open, setOpen] = useState(0);
  return (
    <dl className="tm-qa">
      {items.map((it, i) => (
        <div key={it.q} data-open={i === open ? "1" : undefined}>
          {it.icon}
          <dt>
            {phone ? (
              <button type="button" aria-expanded={i === open} aria-controls={`tm-qa-${i}`} onClick={() => setOpen(i === open ? -1 : i)}>
                {it.q}
                <span className="tm-pl" aria-hidden>
                  <ChevronDown className="tm-ic" />
                </span>
              </button>
            ) : (
              it.q
            )}
          </dt>
          <dd id={`tm-qa-${i}`}>{it.a}</dd>
        </div>
      ))}
    </dl>
  );
}

/** «Cerca una parola»: un campo vero, che apre la ricerca del sito (guide, glossario, pagine) con la parola già scritta. */
export function CercaParola({ examples }: { examples: readonly string[] }) {
  const [q, setQ] = useState("");
  return (
    <>
      <form
        role="search"
        className="tm-sbox"
        onSubmit={(e) => {
          e.preventDefault();
          openSiteSearch(q.trim());
        }}
      >
        <Search aria-hidden className="tm-ic" />
        <label htmlFor="tm-cerca" className="sr-only">
          Cerca un esame o una parola
        </label>
        <input
          id="tm-cerca"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Es. ferritina, TSH, VES…"
          autoComplete="off"
          enterKeyHint="search"
          data-track="home-cerca"
        />
        <button type="submit">Cerca</button>
      </form>
      <p className="tm-chips">
        <span>Per esempio</span>
        {examples.map((t) => (
          <button key={t} type="button" onClick={() => openSiteSearch(t)}>
            {t}
          </button>
        ))}
      </p>
    </>
  );
}
