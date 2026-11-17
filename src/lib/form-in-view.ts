/**
 * 17/11/2026 (20 interventi, punto 16): su telefono gli elementi fissi in basso (barra «Ho un referto / Aiutami»,
 * pulsante «torna su») coprivano i moduli mentre li si compilava. Qui si chiede: c'è un modulo della pagina al centro
 * dello schermo, o un campo in cui si sta scrivendo? Se sì, gli elementi fissi si fanno da parte.
 * Vale sotto i 1024 px: su computer non coprono niente.
 */
export function formNeedsRoom(): boolean {
  if (typeof window === "undefined" || window.innerWidth >= 1024) return false;
  const active = document.activeElement;
  if (active instanceof HTMLTextAreaElement || active instanceof HTMLSelectElement) return true;
  if (active instanceof HTMLInputElement && !["range", "checkbox", "radio", "button", "submit"].includes(active.type)) return true;
  const h = window.innerHeight;
  for (const f of document.querySelectorAll("main form")) {
    const r = f.getBoundingClientRect();
    if (r.height > 0 && r.top < h * 0.8 && r.bottom > h * 0.3) return true;
  }
  return false;
}
