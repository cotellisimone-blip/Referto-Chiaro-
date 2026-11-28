"use client";

import { useEffect, useId, useRef, useState } from "react";

/**
 * Conferma dentro la pagina, in due tocchi: il comando lascia il posto alla domanda, con «No» e la risposta che conferma.
 * Niente finestre del browser: la domanda segue il tema e il testo grande, e funziona anche dove le finestre
 * di sistema non compaiono (per esempio quando il sito è mostrato dentro un'altra pagina).
 */
export function ConfirmButton({
  children,
  question,
  yes,
  onConfirm,
  className,
}: {
  children: React.ReactNode;
  question: string;
  yes: string;
  onConfirm: () => void;
  className: string;
}) {
  const [asking, setAsking] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const wasAsking = useRef(false);
  const questionId = useId();

  useEffect(() => {
    // Chiusa la domanda, il fuoco torna sul comando di partenza: chi usa la tastiera non perde il punto.
    if (!asking && wasAsking.current) trigger.current?.focus();
    wasAsking.current = asking;
  }, [asking]);

  if (!asking) {
    return (
      <button ref={trigger} type="button" className={className} onClick={() => setAsking(true)}>
        {children}
      </button>
    );
  }
  return (
    <span
      role="group"
      aria-labelledby={questionId}
      data-conferma
      className="flex min-w-0 flex-wrap items-center gap-2 rounded-[1.25rem] border border-warn/50 bg-cream px-4 py-3"
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.stopPropagation();
          setAsking(false);
        }
      }}
    >
      <span id={questionId} className="w-full text-base font-semibold text-ink sm:w-auto sm:flex-1">
        {question}
      </span>
      <button type="button" className="btn btn-sm min-h-11 btn-secondary" onClick={() => setAsking(false)} autoFocus>
        No
      </button>
      <button
        type="button"
        className="btn btn-sm min-h-11 btn-primary"
        onClick={() => {
          setAsking(false);
          onConfirm();
        }}
      >
        {yes}
      </button>
    </span>
  );
}
