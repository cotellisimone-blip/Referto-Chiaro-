/**
 * Preferenze di lettura salvate nel browser (tema, dimensione del testo).
 * Script inline eseguito prima del rendering, così la pagina appare subito con la scelta della persona.
 * Modulo senza "use client": importabile dal layout server.
 */
export const THEME_KEY = "rc-theme";
export const SIZE_KEY = "rc-size";

export const PREFS_INIT_SCRIPT =
  `(function(){try{var t=localStorage.getItem(${JSON.stringify(THEME_KEY)});if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t)}` +
  `if(localStorage.getItem(${JSON.stringify(SIZE_KEY)})==="large"){document.documentElement.setAttribute("data-size","large")}}catch(e){}})();`;
