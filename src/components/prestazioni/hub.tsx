"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Stethoscope, UserRound } from "lucide-react";
import { prestazionePrice } from "@/domain/prestazioni/listino";
import { DemoNotice, RoleBar } from "./ui";

export function ProvaShell({ role, children }: { role: "paziente" | "medico" | "amministrazione" | null; children: React.ReactNode }) {
  return (
    <>
      <RoleBar active={role} />
      <div className="container-rc py-8 pb-28 sm:py-12" data-prova={role ?? "hub"}>
        {children}
      </div>
    </>
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
      <div className="space-y-10">
        <div>
          <p className="eyebrow">Prova dimostrativa</p>
          <h1 className="display-lg mt-4 max-w-3xl">Una richiesta, tre punti di vista.</h1>
          <p className="mt-4 max-w-2xl text-xl text-ink-soft">Paziente, medico e amministrazione lavorano sulla stessa richiesta: quello che fa uno lo vede subito l&apos;altro. Si prova bene anche da telefono.</p>
        </div>
        <DemoNotice>Lo stato resta al ricaricamento e tra un ruolo e l&apos;altro. «Ricomincia la prova», in alto, riporta tutto all&apos;inizio.</DemoNotice>
        <ul className="grid gap-4 md:grid-cols-3">
          {ROLES.map(({ href, icon: Icon, title, text }) => (
            <li key={href}>
              <Link href={href} className="card card-lift flex h-full flex-col p-6">
                <Icon aria-hidden className="h-8 w-8 text-teal" />
                <span className="mt-4 text-xl font-bold text-ink">{title}</span>
                <span className="mt-2 text-[1.0625rem] text-ink-soft">{text}</span>
                <span className="mt-auto inline-flex items-center gap-1 pt-4 font-semibold text-teal-deep">
                  Entra <ArrowRight aria-hidden className="h-4 w-4" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <section aria-labelledby="casi-titolo">
          <h2 id="casi-titolo" className="text-2xl font-bold text-ink">Casi da provare</h2>
          <ol className="mt-4 grid gap-3 md:grid-cols-2">
            {CASI.map((c, i) => (
              <li key={c.t} className="card p-5">
                <p className="font-semibold text-ink">{i + 1}. {c.t}</p>
                <p className="mt-1 text-[1.0625rem] text-ink-soft">{c.s}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </ProvaShell>
  );
}
