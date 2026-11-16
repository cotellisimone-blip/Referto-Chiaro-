import type { EmailMessage } from "./types";

/**
 * Modelli delle email transazionali. Regola: MAI dati sanitari nelle email (né nomi di esami,
 * né valori, né titoli dei documenti). Solo il fatto che qualcosa è pronto, con un link all'area personale.
 */

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function layout(title: string, bodyHtml: string): string {
  return `<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${esc(title)}</title></head>
<body style="margin:0;background:#F5FAF8;font-family:Arial,Helvetica,sans-serif;color:#15313C;font-size:17px;line-height:1.55">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" style="max-width:560px;background:#ffffff;border:1px solid #DBE6E5;border-radius:16px" cellpadding="0" cellspacing="0"><tr><td style="padding:32px">
<p style="margin:0 0 24px;font-size:20px;font-weight:bold;color:#00756F">Cura Privata</p>
${bodyHtml}
<p style="margin:32px 0 0;font-size:14px;color:#4F676E">Spiegazioni informative: non sostituiscono il medico. In caso di urgenza chiama il 112.</p>
</td></tr></table></td></tr></table></body></html>`;
}

function button(href: string, label: string): string {
  return `<p style="margin:28px 0"><a href="${esc(href)}" style="display:inline-block;background:#00756F;color:#ffffff;text-decoration:none;font-weight:bold;padding:16px 28px;border-radius:12px;font-size:18px">${esc(label)}</a></p>`;
}

export function magicLinkEmail(to: string, link: string): EmailMessage {
  return {
    to,
    tag: "magic-link",
    subject: "Il tuo link per accedere a Cura Privata",
    text: `Ciao,\n\nper accedere a Cura Privata apri questo link (vale 15 minuti e si usa una sola volta):\n\n${link}\n\nSe non hai chiesto tu l'accesso, ignora questa email: senza il link nessuno può entrare.\n\nCura Privata`,
    html: layout(
      "Accedi a Cura Privata",
      `<p style="margin:0 0 12px">Ciao,</p><p style="margin:0">per accedere premi il pulsante. Il link vale <strong>15 minuti</strong> e si usa una sola volta.</p>
${button(link, "Accedi a Cura Privata")}
<p style="margin:0;font-size:15px;color:#4F676E">Se il pulsante non funziona, copia questo indirizzo nel browser:<br><span style="word-break:break-all">${esc(link)}</span></p>
<p style="margin:20px 0 0;font-size:15px;color:#4F676E">Se non hai chiesto tu l'accesso, ignora questa email: senza il link nessuno può entrare.</p>`,
    ),
  };
}

export function orderPaidEmail(to: string, areaUrl: string, serviceName: string, amount: string): EmailMessage {
  return {
    to,
    tag: "order-paid",
    subject: "Pagamento ricevuto — Cura Privata",
    text: `Abbiamo ricevuto il pagamento di ${amount} per «${serviceName}».\n\nTrovi l'ordine e la ricevuta nella tua area personale: ${areaUrl}\n\nCura Privata`,
    html: layout(
      "Pagamento ricevuto",
      `<p style="margin:0">Abbiamo ricevuto il pagamento di <strong>${esc(amount)}</strong> per «${esc(serviceName)}».</p>${button(areaUrl, "Vai ai tuoi ordini")}`,
    ),
  };
}

export function reportReadyEmail(to: string, areaUrl: string): EmailMessage {
  return {
    to,
    tag: "report-ready",
    subject: "La tua spiegazione è pronta — Cura Privata",
    text: `La spiegazione che hai richiesto è pronta. Per motivi di riservatezza non la inviamo per email: la trovi nella tua area personale.\n\n${areaUrl}\n\nCura Privata`,
    html: layout(
      "La tua spiegazione è pronta",
      `<p style="margin:0">La spiegazione che hai richiesto è pronta. Per riservatezza non la inviamo per email: la trovi nella tua area personale.</p>${button(areaUrl, "Apri la tua area")}`,
    ),
  };
}

export function opinionReadyEmail(to: string, areaUrl: string): EmailMessage {
  return {
    to,
    tag: "opinion-ready",
    subject: "Il parere del medico è disponibile — Cura Privata",
    text: `Il medico ha completato il parere che hai richiesto. Lo trovi nella tua area personale: ${areaUrl}\n\nCura Privata`,
    html: layout(
      "Il parere del medico è disponibile",
      `<p style="margin:0">Il medico ha completato il parere che hai richiesto. Lo trovi nella tua area personale.</p>${button(areaUrl, "Leggi il parere")}`,
    ),
  };
}

/** Promemoria (13/11/2026): solo che c'è un promemoria e quando. Niente titolo, niente persona, niente esami. */
export function reminderEmail(to: string, areaUrl: string, whenText: string): EmailMessage {
  return {
    to,
    tag: "reminder",
    subject: "Hai un promemoria — Cura Privata",
    text: `Hai un promemoria nella tua area personale di Cura Privata: ${whenText}.\n\nPer riservatezza non scriviamo qui di che cosa si tratta: lo trovi entrando.\n\n${areaUrl}\n\nCura Privata`,
    html: layout(
      "Hai un promemoria",
      `<p style="margin:0">Hai un promemoria nella tua area personale: <strong>${esc(whenText)}</strong>.</p><p style="margin:12px 0 0">Per riservatezza non scriviamo qui di che cosa si tratta: lo trovi entrando.</p>${button(areaUrl, "Apri i promemoria")}`,
    ),
  };
}
