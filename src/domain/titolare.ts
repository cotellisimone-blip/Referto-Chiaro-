/**
 * Chi c'è dietro Cura Privata: dati del titolare mostrati sul sito pubblico.
 * Si leggono dall'ambiente al momento della build (le pagine sono statiche). Finché nome e P.IVA non ci sono,
 * il sito NON mostra un blocco vuoto o inventato: lo nasconde. Nessun dato di esempio.
 */
type Env = Record<string, string | undefined>;

export interface Titolare {
  name: string;
  vat: string;
  address?: string;
  email?: string;
  pec?: string;
}

const clean = (v: string | undefined) => {
  const t = v?.trim();
  return t ? t : undefined;
};

export function readTitolare(env: Env = process.env): Titolare | null {
  const name = clean(env.PUBLIC_OWNER_NAME);
  const vat = clean(env.PUBLIC_OWNER_VAT);
  if (!name || !vat) return null;
  return { name, vat, address: clean(env.PUBLIC_OWNER_ADDRESS), email: clean(env.PUBLIC_OWNER_EMAIL), pec: clean(env.PUBLIC_OWNER_PEC) };
}
