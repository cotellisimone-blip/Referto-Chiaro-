import Link from "next/link";
import { BookOpenCheck, FileSearch, PenLine, UserCog } from "lucide-react";

const POINTS = [
  { icon: FileSearch, title: "Ogni numero ha la sua riga", text: "Ogni spiegazione rimanda alla riga del referto da cui viene." },
  { icon: BookOpenCheck, title: "Fonti dichiarate", text: "Istituto Superiore di Sanità, MedlinePlus, NHS: fonti pubbliche e verificabili." },
  { icon: PenLine, title: "Solo un medico valuta", text: "Pareri scritti da un medico abilitato, firmati e non modificabili." },
  { icon: UserCog, title: "Un responsabile medico", text: "Con nome e iscrizione all'Albo, indicati qui. Oggi è in nomina." },
];

/**
 * «Il nostro metodo», detto a un medico: l'autorevolezza con fatti verificabili, senza nomi o numeri inventati.
 * Quattro riquadri di vetro su fondo petrolio. Va dentro una sezione `.scope-strong`.
 */
export function Method() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-9 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16">
      <div>
        <p className="eyebrow">Il nostro metodo</p>
        <h2 id="metodo-titolo" className="display-lg mt-4 text-ink">
          Chiaro per il paziente. Rigoroso per te.
        </h2>
        <p className="lead mt-4">Spiegare non è diagnosticare. Il metodo è scritto e si può verificare.</p>
        <p className="mt-6">
          <Link href="/come-funziona#limiti" className="link inline-flex min-h-11 items-center text-lg font-semibold">
            Che cosa fa, e non fa, la spiegazione automatica
          </Link>
        </p>
      </div>
      <ul className="fact-grid">
        {POINTS.map(({ icon: Icon, title, text }) => (
          <li key={title} className="fact">
            <h3 className="fact-title">
              <Icon aria-hidden strokeWidth={1.8} />
              {title}
            </h3>
            <p className="fact-text">{text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
