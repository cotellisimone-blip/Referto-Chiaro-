import { BadgeCheck, IdCard, ShieldCheck, UserRound } from "lucide-react";
import { PUBLIC_PROFESSIONALS } from "@/domain/offerta";

/**
 * «Chi si occupa del tuo caso». Mostra SOLO professionisti verificati (nome, specializzazione, iscrizione all'Albo,
 * foto con liberatoria). Finché l'elenco è vuoto dice la verità: quali dati vedrai e perché non ci sono ancora profili.
 * Niente nomi, numeri d'Albo, rating o badge di esempio.
 */
export function Professionals() {
  if (PUBLIC_PROFESSIONALS.length > 0) {
    return (
      <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3" aria-label="Professionisti di Cura Privata">
        {PUBLIC_PROFESSIONALS.map((p) => (
          <li key={p.registration} className="card flex gap-5 p-6">
            {p.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.photo.src} alt={p.photo.alt} width={96} height={96} loading="lazy" className="h-24 w-24 shrink-0 rounded-2xl object-cover object-top" />
            ) : (
              <span className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-mist">
                <UserRound aria-hidden className="h-10 w-10 text-teal" />
              </span>
            )}
            <div>
              <p className="text-xl font-bold text-ink">{p.fullName}</p>
              <p className="text-lg text-ink-soft">{p.specialty}</p>
              <p className="mt-2 flex items-center gap-1.5 text-[0.9375rem] text-muted">
                <BadgeCheck aria-hidden className="h-4 w-4 text-teal" /> {p.registration}, verificata il {p.verifiedOn}
              </p>
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
    <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
      <div>
        <p className="text-xl text-ink-soft">
          I profili dei medici compariranno qui <strong className="text-ink">solo dopo la verifica</strong>, con fotografia autorizzata. Non mostriamo profili di esempio, giudizi o numeri che non possiamo dimostrare.
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
