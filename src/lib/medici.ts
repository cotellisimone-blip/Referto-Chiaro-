/**
 * «Cura Privata senza medici, per ora» (13/11/2026, decisione del titolare).
 *
 * UN SOLO interruttore: ENABLE_MEDICI="true" accende di nuovo visita a domicilio, videoconsulto, secondo parere,
 * portale medico, prova a tre ruoli e tutto ciò che li presenta (menu, home, prezzi, area personale, ricerca, mappa del
 * sito). Spento (il valore di base) il codice resta tutto, testato, e al pubblico compare soltanto il blocco discreto
 * «Presto anche con un medico» con la lista d'attesa: nessun prezzo, niente da comprare.
 *
 * Il valore viene letto alla build (le pagine sono statiche) e fissato lì da next.config.ts, che lo copia in
 * NEXT_PUBLIC_ENABLE_MEDICI per pagine, server e browser: così pagine e server non possono trovarsi in due stati diversi.
 * Fuori da Next (prove unitarie, script) vale ENABLE_MEDICI. Vale per tutti i profili, vetrina compresa: riacceso, la
 * vetrina torna a presentare i servizi con un medico come prima (pagine con la lista d'attesa, prova nell'account demo).
 *
 * Spento non è solo nascosto: src/proxy.ts risponde 404 agli endpoint dei servizi con un medico (DOCTOR_API) e
 * l'account dimostrativo del medico non si apre. Accesi, gli endpoint restano protetti anche dai loro interruttori
 * (medicalSecondOpinion, medicalVideoConsult).
 */
export function mediciEnabled(): boolean {
  const built = process.env.NEXT_PUBLIC_ENABLE_MEDICI;
  if (built === "true" || built === "false") return built === "true";
  return process.env.ENABLE_MEDICI === "true";
}

/** Indirizzi che esistono solo con i medici accesi: spenti, portano a /con-un-medico. */
export const DOCTOR_PATHS = [
  "/servizi/visita-a-domicilio",
  "/servizi/parla-con-un-medico",
  "/servizi/secondo-parere",
  "/richiedi",
  "/richieste",
  "/prova",
  "/medico",
  "/per-i-medici",
  "/area-personale/appuntamenti",
  "/area-personale/secondo-parere",
] as const;

/**
 * Endpoint che esistono solo con i medici accesi: spenti, il proxy risponde 404 prima di arrivare alla rotta.
 * L'amministrazione (elenco dei medici, casi) resta raggiungibile: serve a preparare i medici prima di riaccendere.
 */
export const DOCTOR_API = ["/api/v1/medico", "/api/v1/area/appuntamenti", "/api/v1/area/casi", "/api/v1/area/medici"] as const;

export function isDoctorApi(pathname: string): boolean {
  return DOCTOR_API.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function isDoctorPath(href: string): boolean {
  const path = href.split(/[?#]/)[0];
  return DOCTOR_PATHS.some((p) => path === p || path.startsWith(`${p}/`));
}

/** Filtra una lista di voci con `href`, togliendo quelle dei servizi con un medico quando sono spenti. */
export function withoutDoctors<T extends { href: string }>(items: readonly T[]): T[] {
  return mediciEnabled() ? [...items] : items.filter((i) => !isDoctorPath(i.href));
}

export const CON_UN_MEDICO_HREF = "/con-un-medico";
