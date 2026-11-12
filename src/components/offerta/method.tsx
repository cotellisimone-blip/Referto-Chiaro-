import Link from "next/link";
import { ArrowRight, BookOpenCheck, FileSearch, PenLine, UserCog } from "lucide-react";

const POINTS = [
  { icon: FileSearch, title: "Ogni numero ha la sua riga", text: "Ogni spiegazione rimanda alla riga del referto da cui viene." },
  { icon: BookOpenCheck, title: "Fonti dichiarate", text: "Istituto Superiore di Sanità, MedlinePlus, NHS: fonti pubbliche e verificabili." },
  { icon: PenLine, title: "Solo un medico valuta", text: "Pareri scritti da un medico abilitato, firmati e non modificabili." },
  { icon: UserCog, title: "Un responsabile medico", text: "Con nome e iscrizione all'Albo, indicati qui. Oggi è in nomina." },
];

/** «Il nostro metodo»: l'autorevolezza detta con fatti verificabili, senza nomi o numeri inventati. */
export function Method() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
      <div>
        <p className="eyebrow text-[#7be0d2]">Il nostro metodo</p>
        <h2 id="metodo-titolo" className="display-lg mt-4 text-on-strong">
          Chiaro per te. Rigoroso per il tuo medico.
        </h2>
        <p className="mt-5 text-xl text-on-strong-soft">Spiegare non è diagnosticare. Il metodo è scritto e verificabile.</p>
        <Link href="/per-i-medici" className="btn btn-lg mt-8 bg-paper text-ink hover:bg-mist">
          Sei un medico? Scopri come lavoriamo <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
        </Link>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2">
        {POINTS.map(({ icon: Icon, title, text }) => (
          <li key={title} className="rounded-3xl border border-white/12 bg-white/[0.06] p-6">
            <Icon aria-hidden className="h-8 w-8 text-[#7be0d2]" strokeWidth={1.7} />
            <h3 className="mt-4 text-xl font-bold text-on-strong">{title}</h3>
            <p className="mt-2 text-lg text-on-strong-soft">{text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
