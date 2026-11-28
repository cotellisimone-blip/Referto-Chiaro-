import type { ReactNode } from "react";

/**
 * Titoli in stile «Carta» (16/11/2026): l'ultima parte del titolo in corsivo evidenziato, come nella home.
 * Divide dopo l'ultima virgola o i due punti; senza punteggiatura evidenzia l'ultima parola. Il testo resta identico
 * (lettori di schermo, ricerca e prove lo leggono uguale): cambia solo l'aspetto.
 */
export function enfasi(title: ReactNode): ReactNode {
  if (typeof title !== "string") return title;
  const m = title.match(/^(.*[,:]\s)(\S.*)$/);
  if (m) return (
    <>
      {m[1]}
      <em>{m[2]}</em>
    </>
  );
  const i = title.lastIndexOf(" ");
  if (i < 0) return title;
  return (
    <>
      {title.slice(0, i + 1)}
      <em>{title.slice(i + 1)}</em>
    </>
  );
}
