/**
 * Preferenze di lettura salvate nel browser (luce, dimensione del testo).
 * Script inline eseguito prima del rendering, così la pagina appare subito con la scelta della persona.
 * Modulo senza "use client": importabile dal layout server.
 *
 * 19/11/2026: il sito nasce chiaro per tutti (decisione di Simone, home «chiara e scura»). Il layout scrive già
 * `data-theme="light"`; questo script lo cambia in «dark» solo se la persona l'ha scelto con il pulsante della luce.
 * L'impostazione del telefono non conta più. `data-luce-vista` dice che il pulsante è già stato usato (niente richiamo).
 * Sulla home lo stesso script accende anche il movimento del primo sguardo (`hb-anim`, `hb-primo`).
 */
export const THEME_KEY = "rc-theme";
export const SIZE_KEY = "rc-size";
export const THEME_SEEN_KEY = "rc-theme-vista";

/** Colore della barra del browser nelle due luci (stesso fondo della pagina). */
export const THEME_COLOR = { light: "#FBFAF6", dark: "#061A22" } as const;

export const PREFS_INIT_SCRIPT =
  `(function(){try{var d=document.documentElement,t=localStorage.getItem(${JSON.stringify(THEME_KEY)})==="dark"?"dark":"light";d.setAttribute("data-theme",t);` +
  `if(t==="dark"){var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content",${JSON.stringify(THEME_COLOR.dark)})}` +
  `if(localStorage.getItem(${JSON.stringify(THEME_SEEN_KEY)})==="1"){d.setAttribute("data-luce-vista","1")}` +
  `if(localStorage.getItem(${JSON.stringify(SIZE_KEY)})==="large"){d.setAttribute("data-size","large")}}catch(e){}` +
  // Home «chiara e scura»: il movimento del primo sguardo parte con la prima pittura (vedi src/components/home-b/moto.tsx).
  `try{if(location.pathname==="/"&&!(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches)){var h=document.documentElement;h.classList.add("hb-anim","hb-primo");setTimeout(function(){h.classList.remove("hb-primo")},1800)}}catch(e){}})();`;
