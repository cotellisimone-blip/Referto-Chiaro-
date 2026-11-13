"use client";

import { clsx } from "clsx";
import { Search, X } from "lucide-react";

/**
 * Campo di ricerca «Luce»: una pillola alta 60 px con la lente, il testo grande e il tasto per svuotare.
 * Lo usano domande frequenti, guide e glossario: stesso gesto, stesso aspetto.
 */
export function SearchField({
  value,
  onChange,
  label,
  placeholder,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  /** Nome accessibile del campo (non c'è un'etichetta visibile: la dice il segnaposto). */
  label: string;
  placeholder: string;
  className?: string;
}) {
  return (
    <label className={clsx("search-field", className)}>
      <Search aria-hidden />
      <input type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} autoComplete="off" aria-label={label} />
      {value ? (
        <button type="button" onClick={() => onChange("")}>
          <X aria-hidden className="h-5 w-5" />
          <span className="sr-only">Cancella la ricerca</span>
        </button>
      ) : null}
    </label>
  );
}
