import { FileText, FolderHeart, ScanSearch, Stethoscope, Video } from "lucide-react";

const NODES = [
  { icon: FileText, title: "Il referto", text: "Lo carichi una volta sola." },
  { icon: ScanSearch, title: "Lo capisci", text: "Valori e sigle in parole semplici." },
  { icon: Stethoscope, title: "Secondo parere", text: "Se serve, un medico lo valuta." },
  { icon: Video, title: "Parli con un medico", text: "Con i documenti già davanti." },
  { icon: FolderHeart, title: "Resta tutto tuo", text: "Nella tua area personale." },
];

/**
 * «Cura Privata Journey»: il motivo grafico ricorrente. Una linea fluida unisce i passi.
 * Desktop/tablet: orizzontale. Mobile: verticale, come uno stepper. È una lista ordinata vera (lettori di schermo).
 */
export function Journey({ title = "Un percorso solo, dal referto al medico." }: { title?: string }) {
  return (
    <div>
      <h2 id="journey-titolo" className="display-lg max-w-3xl">
        {title}
      </h2>
      <div className="relative mt-12">
        {/* Linea orizzontale (md+) */}
        <svg aria-hidden viewBox="0 0 1000 80" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-[6%] top-0 hidden h-14 w-[88%] md:block">
          <path
            className="journey-draw"
            pathLength={1}
            d="M0 40 C 120 0, 180 80, 250 40 S 380 0, 500 40 S 630 80, 750 40 S 880 0, 1000 40"
            fill="none"
            stroke="var(--color-marker)"
            strokeWidth="4"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        {/* Linea verticale (mobile) */}
        <span aria-hidden className="absolute bottom-7 left-7 top-7 w-1 rounded-full bg-[linear-gradient(180deg,var(--color-marker),var(--color-marker-soft))] md:hidden" />
        <ol className="relative grid gap-6 md:grid-cols-5 md:gap-4" aria-labelledby="journey-titolo">
          {NODES.map(({ icon: Icon, title: t, text }, i) => (
            <li key={t} className="flex items-start gap-4 md:flex-col md:items-center md:text-center">
              <span className="journey-node relative z-10 shrink-0">
                <Icon aria-hidden className="h-6 w-6" strokeWidth={1.9} />
              </span>
              <span className="pt-2 md:pt-3">
                <span className="block text-lg font-bold text-ink">
                  <span className="sr-only">Passo {i + 1}: </span>
                  {t}
                </span>
                <span className="block text-[1.0625rem] text-ink-soft">{text}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/** La linea del Journey come semplice filo decorativo (separatori, hero, banner). */
export function JourneyThread({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 600 120" fill="none" className={className}>
      <path className="journey-draw" pathLength={1} d="M-10 90 C 90 20, 160 120, 260 70 S 420 10, 520 60 S 600 90, 640 40" stroke="var(--color-marker)" strokeWidth="5" strokeLinecap="round" />
      <circle cx="260" cy="70" r="7" fill="var(--color-teal)" />
      <circle cx="520" cy="60" r="7" fill="var(--color-teal)" />
    </svg>
  );
}
