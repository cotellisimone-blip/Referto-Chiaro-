/**
 * Ciclo 3, fase 4: chi non è una persona non entra nei contatori della vetrina. Elenco prudente di firme note di
 * motori di ricerca, anteprime dei link (WhatsApp, Facebook, Telegram…), strumenti di misura e browser automatici.
 * Nei test automatici del progetto i browser senza interfaccia si possono ammettere con FUNNEL_COUNT_HEADLESS=true.
 */
const BOT = /bot\b|bot\/|crawl|spider|slurp|facebookexternalhit|facebookcatalog|whatsapp|telegram|discord|preview|embedly|lighthouse|pagespeed|gtmetrix|pingdom|uptime|monitor|curl\/|wget\/|python-|httpclient|okhttp|go-http|node-fetch|axios|java\//i;
const HEADLESS = /headless|phantomjs|puppeteer|playwright|selenium|webdriver/i;

export function isAutomatedAgent(ua: string | null | undefined, env: Record<string, string | undefined> = {}): boolean {
  if (!ua || ua.trim().length < 10) return true;
  if (BOT.test(ua)) return true;
  if (HEADLESS.test(ua)) return env.FUNNEL_COUNT_HEADLESS !== "true";
  return false;
}
