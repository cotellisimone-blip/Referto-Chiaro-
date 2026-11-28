"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 27/11/2026 (fase 3, percorsi più corti da telefono): sulle pagine lunghe (sonno 18 schermate, pressione alta 17)
 * l'indice «In questa pagina» restava in cima. Su telefono, appena l'indice esce dallo schermo, compare una barra
 * sottile agganciata sotto la testata, con le stesse voci in fila e quella che stai leggendo evidenziata.
 * Si nasconde da sola tornando su. Su schermi larghi non serve: l'indice resta dov'è.
 */
export function IndiceAgganciato({ voci, ancora }: { voci: { id: string; label: string }[]; ancora: string }) {
  const [visibile, setVisibile] = useState(false);
  const [attiva, setAttiva] = useState<string | null>(null);
  const lista = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const el = document.getElementById(ancora);
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setVisibile(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, [ancora]);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const sezioni = voci.map((v) => document.getElementById(v.id)).filter((x): x is HTMLElement => !!x);
    const io = new IntersectionObserver(
      (entries) => {
        const sopra = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (sopra) setAttiva(sopra.target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    sezioni.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [voci]);

  // La voce attiva resta sempre in vista dentro la barra.
  useEffect(() => {
    if (!attiva || !lista.current) return;
    const a = lista.current.querySelector<HTMLElement>(`[data-voce="${attiva}"]`);
    a?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [attiva]);

  return (
    <nav className="ml-aggancio" data-visibile={visibile ? "" : undefined} aria-label="Vai a una parte della pagina" aria-hidden={!visibile} inert={!visibile}>
      <ul ref={lista}>
        {voci.map((v) => (
          <li key={v.id}>
            <a href={`#${v.id}`} data-voce={v.id} aria-current={attiva === v.id ? "location" : undefined}>
              {v.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
