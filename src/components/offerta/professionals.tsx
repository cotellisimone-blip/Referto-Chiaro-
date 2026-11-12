import { BadgeCheck, IdCard, ShieldCheck, UserRound } from "lucide-react";
import { PUBLIC_PROFESSIONALS } from "@/domain/offerta";

/** Federazione nazionale degli Ordini dei medici: chiunque può controllare l'iscrizione all'Albo. */
const FNOMCEO_URL = "https://portale.fnomceo.it/";

/**
 * «Chi si occupa del tuo caso». Mostra SOLO professionisti verificati (nome, specializzazione, iscrizione all'Albo,
 * mai fotografie). Finché l'elenco è vuoto dice la verità: quali dati vedrai e perché non ci sono ancora profili.
 * Niente nomi, numeri d'Albo, rating o badge di esempio.
 */
export function Professionals() {
  if (PUBLIC_PROFESSIONALS.length > 0) {
    return (
      <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3" aria-label="Professionisti di Cura Privata">
        {PUBLIC_PROFESSIONALS.map((p) => (
          <li key={p.registration} className="card flex gap-5 p-6">
            {/* Mai fotografie di medici (scelta del titolare): solo nome, specialità e iscrizione verificabile */}
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-mist">
              <UserRound aria-hidden className="h-8 w-8 text-teal" />
            </span>
            <div>
              <p className="text-xl font-bold text-ink">{p.fullName}</p>
              <p className="text-lg text-ink-soft">{p.specialty}</p>
              <p className="mt-2 flex items-center gap-1.5 text-[0.9375rem] text-muted">
                <BadgeCheck aria-hidden className="h-4 w-4 text-teal" /> {p.registration}, verificata il {p.verifiedOn}
              </p>
              <a href={FNOMCEO_URL} className="link mt-1 inline-flex min-h-11 items-center text-[0.9375rem] font-semibold" rel="noopener noreferrer" target="_blank">
                Verificala anche tu sul portale FNOMCeO
              </a>
            </div>
          </li>
        ))}
      </ul>
    );
  }
  const items = [
    { icon: IdCard, title: "Nome e specializzazione", text: "Sai sempre chi legge i tuoi documenti e chi firma il parere." },
    { icon: BadgeCheck, title: "Iscrizione all'Albo verificata", text: "Controlliamo l'iscrizione all'Ordine prima di attivare ogni medico." },
    { icon: ShieldCheck, title: "Accesso solo al tuo caso", text: "Il medico vede soltanto i documenti che scegli, e ogni accesso è registrato." },
  ];
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
      <div>
        {/* Come sarà un profilo: solo etichette dei campi, nessun dato inventato */}
        <div aria-hidden className="relative mx-auto max-w-md px-2 pt-3 sm:px-0">
          <div className="absolute inset-0 -z-10 rounded-[2rem] bg-[radial-gradient(closest-side,var(--color-marker-soft),transparent)]" />
          <div className="card -rotate-1 p-6 shadow-[var(--shadow-float)]">
            <div className="flex items-center gap-5">
              <span className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl border-2 border-dashed border-teal/40 bg-mist">
                <UserRound className="h-11 w-11 text-teal" />
              </span>
              <div className="min-w-0 flex-1 space-y-2.5">
                <p className="text-[0.9375rem] font-bold uppercase tracking-wide text-muted">Nome e cognome</p>
                <span className="block h-3 w-4/5 rounded-full bg-line" />
                <p className="text-[0.9375rem] font-bold uppercase tracking-wide text-muted">Specializzazione</p>
                <span className="block h-3 w-3/5 rounded-full bg-line" />
              </div>
            </div>
            <div className="mt-5 flex items-center gap-3 rounded-2xl bg-mist px-4 py-3">
              <BadgeCheck className="h-6 w-6 shrink-0 text-teal" />
              <span className="text-[1.0625rem] font-semibold text-ink">Iscrizione all&apos;Albo: la controlliamo noi</span>
            </div>
          </div>
          <span className="float-chip absolute -top-1 right-0 rounded-full bg-strong px-3.5 py-1.5 text-sm font-bold text-on-strong shadow-[var(--shadow-lift)]">Così sarà ogni profilo</span>
        </div>
        <p className="mt-8 text-xl text-ink-soft">
          I profili dei medici compariranno qui <strong className="text-ink">solo dopo la verifica</strong>: nome, specializzazione e iscrizione all&apos;Albo, che potrai controllare anche tu. Non mostriamo profili di esempio, giudizi o numeri che non possiamo dimostrare.
        </p>
      </div>
      <ul className="grid gap-4 sm:grid-cols-3">
        {items.map(({ icon: Icon, title, text }) => (
          <li key={title} className="card p-5">
            <Icon aria-hidden className="h-7 w-7 text-teal" />
            <p className="mt-3 text-lg font-bold leading-snug text-ink">{title}</p>
            <p className="mt-1 text-[1.0625rem] text-ink-soft">{text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
