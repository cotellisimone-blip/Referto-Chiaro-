"use client";

import Link from "next/link";
import { ArrowRight, FlaskConical, ShieldCheck, Stethoscope, UserRound } from "lucide-react";
import { prestazionePrice } from "@/domain/prestazioni/listino";
import { ConfirmButton, DemoNotice, RoleBar } from "./ui";
import { PatientPathsProvider } from "./paths";
import { resetDemo } from "./store";
import { ProvaAvvisami } from "@/components/site/prova-avvisami";

export function ProvaShell({ role, children }: { role: "paziente" | "medico" | "amministrazione" | null; children: React.ReactNode }) {
  return (
    <PatientPathsProvider mode="prova">
      <RoleBar active={role} />
      <div className="container-rc py-8 pb-28 sm:py-12" data-prova={role ?? "hub"}>
        {children}
      </div>
    </PatientPathsProvider>
  );
}

/**
 * Cornice del percorso del paziente a cui portano home e pagine servizio (ciclo 4): niente barra dei ruoli,
 * il modulo parte subito. In fondo, una sola riga dice che è una prova e porta alla prova a tre ruoli.
 */
export function PatientShell({ children, vetrina = false }: { children: React.ReactNode; vetrina?: boolean }) {
  return (
    <PatientPathsProvider mode="public">
      <div className="container-rc py-6 pb-28 sm:py-10" data-percorso-paziente>
        {children}
        {vetrina ? <ProvaAvvisami titolo="Ti interessa davvero? Avvisami quando parte." /> : null}
        <div role="note" className="callout callout-warn mt-12 print:hidden">
          <span aria-hidden className="callout-ico">
            <FlaskConical />
          </span>
          <div className="min-w-0">
            <p className="callout-title">Prova dimostrativa</p>
            <p className="callout-text">Medici, fasce, pagamenti e documenti sono simulati e restano in questo browser.</p>
            <p className="mt-1 flex flex-wrap items-center gap-x-6 gap-y-1">
              <Link href="/prova" className="action-link">
                Guarda anche il lato del medico e dell&apos;amministrazione
              </Link>
              <ConfirmButton className="action-link" question="Le richieste tornano allo stato iniziale." yes="Sì, ricomincia" onConfirm={resetDemo}>
                Ricomincia la prova
              </ConfirmButton>
            </p>
          </div>
        </div>
      </div>
    </PatientPathsProvider>
  );
}

const ROLES = [
  { href: "/prova/paziente", icon: UserRound, title: "Paziente o familiare", text: "Mario Demo, Brescia. Chiede una visita a domicilio, un videoconsulto o un secondo parere, conferma e paga (simulato), entra in sala d'attesa." },
  { href: "/prova/medico", icon: Stethoscope, title: "Medico", text: "Tre profili dimostrativi verificati e una candidatura da verificare. Accetta, propone orari, chiede documenti, conclude, consegna la sintesi." },
  { href: "/prova/amministrazione", icon: ShieldCheck, title: "Amministrazione", text: "Apre e sospende i servizi, verifica e abilita i medici, gestisce fasce e assegnazioni. Vede la logistica, non i dati clinici." },
];

const CASI = [
  { t: "Listino e accessi", s: `Dalla home, «Visita a domicilio» e la pagina Servizi: ${prestazionePrice("domicilio")}, ${prestazionePrice("video")} e ${prestazionePrice("parere")} coincidono su schede, pagine e riepilogo prima della conferma.` },
  { t: "Avvio con un solo servizio", s: "Amministrazione → Servizi → «Avvio con un solo servizio». Poi Paziente: il domicilio risulta sospeso, il videoconsulto pure, il secondo parere aperto in Cardiologia." },
  { t: "Candidatura e assegnazione", s: "Medico → «Candidati come medico». Il nuovo profilo non riceve nulla finché l'amministrazione non lo verifica e lo abilita alla prestazione." },
  { t: "Domicilio", s: "Paziente → visita a domicilio (prova anche il CAP 20121, fuori zona). Medico (dott.ssa Bianchi) accetta. Paziente conferma il prezzo mostrato. Annullando, la fascia torna libera." },
  { t: "Video senza sovrapposizioni", s: "Dopo un domicilio confermato, la stessa dottoressa non ha più le fasce video vicine (conta il tragitto). Paziente → videoconsulto → sala d'attesa → il medico avvia → «Simula un problema di connessione» → riprogramma o ricollegati → il medico conclude." },
  { t: "Secondo parere", s: "Paziente → Cardiologia, quesito e referti di esempio. Medico (dott.ssa Conti) chiede un documento; il paziente lo integra; lo specialista accetta con orario e tempi della sintesi; conferma; video; sintesi consultabile. Prova anche il rifiuto: si chiude senza addebito." },
  { t: "Conflitti e pagamento", s: "Con una proposta da confermare: Amministrazione → Richieste → «fascia occupata nel frattempo», oppure Strumenti di prova → «Fai fallire il prossimo pagamento». Premi «Conferma» due volte: un solo appuntamento." },
  { t: "Accessi", s: "Apri una richiesta dal portale con un medico diverso da quello assegnato: non vedi nulla. L'amministrazione non vede quesiti, documenti, indirizzi né telefoni." },
];

export function ProvaHub() {
  return (
    <ProvaShell role={null}>
      <div className="space-y-10 sm:space-y-12">
        <header>
          <p className="eyebrow">Prova dimostrativa</p>
          <h1 className="display-lg mt-4 max-w-3xl">Una richiesta, tre punti di vista.</h1>
          <p className="lead mt-4 max-w-2xl">Paziente, medico e amministrazione lavorano sulla stessa richiesta: quello che fa uno lo vede subito l&apos;altro. Si prova bene anche da telefono.</p>
        </header>
        <ul className="grid gap-4 md:grid-cols-3 lg:gap-5">
          {ROLES.map(({ href, icon: Icon, title, text }) => (
            <li key={href}>
              <Link href={href} className="card card-lift flex h-full flex-col p-6 sm:p-7">
                <span aria-hidden className="tile-ico">
                  <Icon />
                </span>
                <span className="mt-5 text-[1.375rem] font-extrabold leading-tight tracking-tight text-ink">{title}</span>
                <span className="mt-2 text-[1.0625rem] leading-relaxed text-ink-soft">{text}</span>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[1.0625rem] font-bold text-teal-deep">
                  Entra <ArrowRight aria-hidden className="h-5 w-5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <DemoNotice>Lo stato resta al ricaricamento e tra un ruolo e l&apos;altro. «Ricomincia la prova», in alto, riporta tutto all&apos;inizio.</DemoNotice>
        <section aria-labelledby="casi-titolo">
          <h2 id="casi-titolo" className="area-h2">
            Casi da provare
          </h2>
          <p className="area-lead">Otto percorsi brevi, dal più semplice al più delicato. Ognuno si prova in un paio di minuti.</p>
          <ol className="mt-6 grid gap-4 md:grid-cols-2">
            {CASI.map((c, i) => (
              <li key={c.t} className="card flex gap-4 p-5 sm:p-6">
                <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-mist text-[1.0625rem] font-extrabold text-teal-deep">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="area-h3">
                    <span className="sr-only">{i + 1}. </span>
                    {c.t}
                  </p>
                  <p className="mt-1.5 text-[1.0625rem] leading-relaxed text-ink-soft">{c.s}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </ProvaShell>
  );
}
