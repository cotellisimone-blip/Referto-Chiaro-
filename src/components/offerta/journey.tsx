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
      <div className="relative mt-14">
        {/* Linea orizzontale (md+) con un punto che la percorre */}
        <svg aria-hidden viewBox="0 0 1000 80" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-[8%] top-3 hidden h-16 w-[84%] md:block">
          <path d={PATH} fill="none" stroke="var(--color-marker-soft)" strokeWidth="10" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          <path className="journey-draw" pathLength={1} d={PATH} fill="none" stroke="var(--color-marker)" strokeWidth="4" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          <ellipse className="journey-dot" rx="7" ry="9" fill="var(--color-teal)">
            <animateMotion dur="7s" repeatCount="indefinite" path={PATH} />
          </ellipse>
        </svg>
        {/* Linea verticale (mobile) */}
        <span aria-hidden className="absolute bottom-10 left-10 top-10 w-1 rounded-full bg-[linear-gradient(180deg,var(--color-marker),var(--color-marker-soft))] md:hidden" />
        <ol className="relative grid gap-7 md:grid-cols-5 md:gap-4" aria-labelledby="journey-titolo">
          {NODES.map(({ icon: Icon, title: t, text }, i) => (
            <li key={t} className="bubble-node flex items-center gap-5 md:flex-col md:items-center md:text-center">
              <span className="bubble-ic relative z-10 shrink-0">
                <Icon aria-hidden className="h-9 w-9" strokeWidth={1.7} />
                <span aria-hidden className="absolute -right-1.5 -top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-strong text-sm font-extrabold text-on-strong">
                  {i + 1}
                </span>
              </span>
              <span className="md:pt-2">
                <span className="block text-xl font-bold text-ink">
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

const PATH = "M0 40 C 120 0, 180 80, 250 40 S 380 0, 500 40 S 630 80, 750 40 S 880 0, 1000 40";

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
