/**
 * 27/11/2026 (fase 1, sicurezza): in modalità dimostrativa chiunque può aprire l'account admin di prova (la 2FA mostra
 * il codice a schermo). Quell'account non deve vedere dati di persone vere: le email delle liste d'attesa e degli
 * ordini arrivano mascherate, e note e organizzazione non arrivano affatto. Un admin vero (non demo) vede tutto.
 */
export function maskEmail(email: string): string {
  const [user, domain] = email.split("@");
  if (!domain) return "•••";
  const dot = domain.lastIndexOf(".");
  const tld = dot >= 0 ? domain.slice(dot) : "";
  return `${user.slice(0, 1)}•••@${domain.slice(0, 1)}•••${tld}`;
}
