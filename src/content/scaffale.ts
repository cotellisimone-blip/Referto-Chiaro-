/**
 * Lo Scaffale: integratori e probiotici dei negozi partner, sempre segnati come pubblicità.
 *
 * 22/11/2026 (Simone, thread «Rendere più chiari progetto e offerta»): «vorrei creare delle affiliazioni con altri
 * negozi… intanto metti dei prodotti che trovi online che ti piacciono così da provare la grafica».
 *
 * QUESTI PRODOTTI SONO ESEMPI (`esempio: true`): prodotti veri, venduti davvero nelle farmacie online indicate, scelti
 * solo per provare la grafica. Nessuna di queste aziende o farmacie è un partner e nessun collegamento è un'affiliazione.
 * Niente foto dei prodotti (diritti delle aziende): il barattolo è il nostro disegno. Niente prezzi (cambiano ogni giorno
 * e non li controlliamo) né frasi sulla salute: le spiegazioni restano nelle schede degli integratori.
 *
 * Il giorno delle affiliazioni: per ogni negozio si mette in `affiliateUrl` il collegamento con il codice del
 * programma di affiliazione (resta `url` come pagina pulita) e si toglie `esempio`. Spegnere tutti gli esempi:
 * SCAFFALE_ESEMPI="false".
 */
export type NegozioScaffale = {
  /** Nome del negozio online, come lo scrive lui. */
  nome: string;
  /** La pagina del prodotto nel negozio. */
  url: string;
  /** Il collegamento con il codice di affiliazione, quando c'è il contratto. Finché è null si usa `url`. */
  affiliateUrl: string | null;
};

export type ProdottoScaffale = {
  id: string;
  /** La scheda dei nostri integratori che va letta prima (src/content/integratori.ts). */
  scheda: string;
  marca: string;
  nome: string;
  formato: string;
  negozi: NegozioScaffale[];
  /** true = prodotto messo solo per provare la grafica, senza accordi con l'azienda o con i negozi. */
  esempio: boolean;
};

export const PRODOTTI_SCAFFALE: ProdottoScaffale[] = [
  {
    id: "solgar-natural-vita-d3-1000",
    scheda: "vitamina-d",
    marca: "Solgar",
    nome: "Natural Vita D3 1000",
    formato: "100 perle softgel",
    negozi: [
      { nome: "TopFarmacia", url: "https://www.topfarmacia.it/p-solgar-natural-vita-d3-1000-integratore-vitamina-d3-100-perle-softgel", affiliateUrl: null },
      { nome: "Farmacosmo", url: "https://www.farmacosmo.it/integratori/natural-vita-d3-1000-integratore-ossa-e-articolazioni-100-softgels-190477/", affiliateUrl: null },
    ],
    esempio: true,
  },
  {
    id: "lactoflorene-plus-30",
    scheda: "probiotici",
    marca: "Lactoflorene",
    nome: "Lactoflorene Plus",
    formato: "30 capsule",
    negozi: [
      { nome: "TopFarmacia", url: "https://www.topfarmacia.it/fermenti-lattici/473-lactoflorene-plus-integratore-alimentare-di-fermenti-lattici-30-capsule.html", affiliateUrl: null },
      { nome: "1000Farmacie", url: "https://www.1000farmacie.it/lactoflorene-plus-30-capsule.html", affiliateUrl: null },
    ],
    esempio: true,
  },
  {
    id: "enerzona-omega-3-rx-60",
    scheda: "omega-3",
    marca: "Enerzona",
    nome: "Omega 3 RX",
    formato: "60 capsule",
    negozi: [
      { nome: "TopFarmacia", url: "https://www.topfarmacia.it/p-enerzona-omega-3-rx-integratore-60-capsule", affiliateUrl: null },
      { nome: "Farmacia Igea", url: "https://farmaciaigea.com/enerzona-omega-3rx-60-capsule", affiliateUrl: null },
    ],
    esempio: true,
  },
  {
    id: "magnesio-supremo-150",
    scheda: "magnesio",
    marca: "Natural Point",
    nome: "Magnesio Supremo",
    formato: "polvere, 150 g",
    negozi: [
      { nome: "TopFarmacia", url: "https://www.topfarmacia.it/stress/1664-magnesio-supremo-polvere-150-grammi-8055732260002.html", affiliateUrl: null },
      { nome: "Farmacia Loreto", url: "https://farmacialoreto.it/natural-point-magnesio-supremo-integratore-alimentare-150g", affiliateUrl: null },
    ],
    esempio: true,
  },
];

/** Gli esempi si vedono finché SCAFFALE_ESEMPI non è "false" (letto alla build). */
export function scaffaleEsempiVisibili(): boolean {
  const v = process.env.NEXT_PUBLIC_SCAFFALE_ESEMPI ?? process.env.SCAFFALE_ESEMPI;
  return v !== "false";
}

/** I prodotti da mostrare: tutti, oppure quelli collegati a una scheda. Vuoto se gli esempi sono spenti. */
export function prodottiScaffale(scheda?: string): ProdottoScaffale[] {
  const list = PRODOTTI_SCAFFALE.filter((p) => scaffaleEsempiVisibili() || !p.esempio);
  return scheda ? list.filter((p) => p.scheda === scheda) : list;
}

/** Il collegamento da usare: quello di affiliazione quando c'è, altrimenti la pagina del prodotto. */
export function linkNegozio(n: NegozioScaffale): string {
  return n.affiliateUrl ?? n.url;
}
