"use client";

import { openSiteSearch } from "@/components/search/site-search";

/** Le ricerche già pronte sotto il campo della sezione «Malattie»: aprono la ricerca del sito con la frase scritta. */
export function RicercheVeloci({ voci }: { voci: string[] }) {
  return (
    <div className="ml-veloci">
      <span className="ml-veloci-t">Per esempio:</span>
      {voci.map((v) => (
        <button key={v} type="button" onClick={() => openSiteSearch(v)}>
          {v}
        </button>
      ))}
    </div>
  );
}
