import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { DraftNotice, Prose } from "@/components/ui/draft-notice";

export const metadata: Metadata = { title: "Informativa privacy", description: "Come Cura Privata tratta i dati personali e sanitari: finalità, basi giuridiche, conservazione, diritti e come esercitarli." };

/*
 * Bozza di informativa (art. 13 GDPR). Descrive ciò che il software fa davvero oggi;
 * i campi fra parentesi quadre vanno compilati dal titolare prima di qualsiasi apertura al pubblico.
 */
const DATA = [
  ["Indirizzo email", "Creare l'account, inviare il link di accesso, rispondere alle richieste", "Finché l'account esiste; anonimizzato alla cancellazione"],
  ["Consensi (tipo, versione, data)", "Dimostrare che cosa è stato accettato e quando", "Finché l'account esiste"],
  ["Referti, valori confermati, spiegazioni, dossier", "Spiegare i referti con parole semplici (dati relativi alla salute)", "Finché li tieni; cancellati subito se revochi il consenso o elimini l'account"],
  ["Richieste di secondo parere e risposte", "Far rispondere un medico alla tua domanda (dati relativi alla salute)", "Come sopra"],
  ["Ordini (servizio, importo, stato)", "Erogare il servizio acquistato e rispettare gli obblighi contabili", "[10 anni per obblighi fiscali]; senza contenuti sanitari"],
  ["Registro delle attività (azione, data)", "Sicurezza e tracciabilità degli accessi", "[12 mesi]"],
  ["Sessioni di accesso (identificativo cifrato)", "Tenerti collegato in sicurezza", "14 giorni; 12 ore per medici e amministratori"],
  ["Lista d'attesa (email, interesse, nota)", "Avvisarti quando il servizio parte", "12 mesi, poi cancellata"],
];

export default function Page() {
  return (
    <>
      <PageHeader art="shield" eyebrow="Note legali" title="Informativa privacy" lead="Che cosa raccogliamo, perché, per quanto tempo e che cosa puoi chiedere." />
      <div className="container-rc page-body">
        <DraftNotice />
        <div className="mt-8 sm:mt-10">
          <Prose>
            <h2>Chi tratta i dati</h2>
            <p>Titolare del trattamento: [nome e indirizzo del titolare, da compilare]. Contatto per la privacy: [email dedicata]. Responsabile della protezione dei dati, se nominato: [nome e contatto].</p>

            <h2>Oggi, nella versione dimostrativa</h2>
            <p>Il sito pubblico non richiede registrazione e usa solo referti inventati. L&apos;area personale è una dimostrazione: accetta soltanto referti di esempio, mai file reali. Se crei un account con la tua email, conserviamo l&apos;indirizzo e i consensi come descritto qui sotto. Ti chiediamo di non inserire dati di persone reali.</p>

            <h2>Quali dati, per quale scopo, per quanto tempo</h2>
            <div role="region" aria-label="Dati trattati, scopo e conservazione" tabIndex={0} className="overflow-x-auto rounded-xl border border-line">
              <table className="w-full text-left text-[0.9375rem]">
                <thead className="bg-mist text-ink">
                  <tr>
                    <th scope="col" className="px-4 py-3">Dato</th>
                    <th scope="col" className="px-4 py-3">Scopo</th>
                    <th scope="col" className="px-4 py-3">Conservazione</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {DATA.map(([d, s, c]) => (
                    <tr key={d}>
                      <td className="px-4 py-3 font-semibold text-ink">{d}</td>
                      <td className="px-4 py-3 text-ink-soft">{s}</td>
                      <td className="px-4 py-3 text-ink-soft">{c}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2>Basi giuridiche</h2>
            <ul>
              <li>Account, accesso e ordini: esecuzione del contratto (art. 6.1.b).</li>
              <li>Referti e spiegazioni, richieste di secondo parere: consenso esplicito per i dati relativi alla salute (art. 9.2.a), che puoi revocare in ogni momento dalle impostazioni. La revoca cancella subito i contenuti sanitari.</li>
              <li>Registro delle attività e sicurezza: legittimo interesse a proteggere il servizio (art. 6.1.f).</li>
              <li>Novità via email: consenso facoltativo, revocabile dalle impostazioni.</li>
            </ul>

            <h2>Chi vede i dati</h2>
            <p>Solo tu vedi i tuoi referti. Un medico vede un referto soltanto se gli hai inviato una richiesta di secondo parere con un consenso specifico, e solo quel referto. Gli amministratori vedono ordini, lista d&apos;attesa e registro, non il contenuto dei referti. Fornitori tecnici: [hosting, servizio email, pagamenti; nomi e paese, da compilare]. Nessun dato viene venduto o usato per pubblicità.</p>

            <h2>Cookie e memoria del browser</h2>
            <p>Un solo cookie tecnico di sessione (rc_session), necessario per restare collegato. Le preferenze di tema e dimensione del testo restano nel tuo browser (localStorage) e non vengono inviate a nessuno. La demo usa la memoria della scheda (sessionStorage) per ricordare a che punto sei. Nessun cookie di profilazione o di terze parti.</p>

            <h2>I tuoi diritti</h2>
            <p>Puoi accedere ai tuoi dati, correggerli, scaricarli in formato leggibile, revocare i consensi, limitare o opporti al trattamento e chiedere la cancellazione. Dalle impostazioni puoi esportare tutto in un file, revocare il consenso ai dati sanitari ed eliminare l&apos;account da solo, senza chiedere a nessuno. Per il resto scrivi a [email dedicata]. Puoi anche rivolgerti al Garante per la protezione dei dati personali.</p>

            <h2>Sicurezza</h2>
            <p>Ogni persona vede solo le proprie righe grazie a regole applicate direttamente dal database. I link di accesso sono monouso e scadono in 15 minuti. Medici e amministratori usano una seconda verifica (codice a tempo). Le azioni importanti vengono registrate.</p>
          </Prose>
        </div>
      </div>
    </>
  );
}
