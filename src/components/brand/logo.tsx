import { clsx } from "clsx";

/**
 * Proposta di logo originale (non recuperata da materiali precedenti):
 * un foglio con l'angolo piegato che diventa una bolla di dialogo, con un segno di spunta.
 * Il documento "parla" in modo comprensibile.
 */
export const MARK_PATHS = {
  bubble: "M12 10h30l12 12v22a8 8 0 0 1-8 8H30l-12 9v-9h-6a8 8 0 0 1-8-8V18a8 8 0 0 1 8-8z",
  fold: "M42 10v8a4 4 0 0 0 4 4h8z",
  check: "M19 31l7 7 13-14",
};

export function LogoMark({
  className,
  variant = "color",
  title,
}: {
  className?: string;
  variant?: "color" | "mono" | "inverse";
  title?: string;
}) {
  const body = variant === "color" ? "var(--color-teal)" : variant === "mono" ? "currentColor" : "#ffffff";
  const fold = variant === "color" ? "var(--color-sage)" : variant === "mono" ? "currentColor" : "rgb(255 255 255 / 0.65)";
  const check = variant === "inverse" ? "var(--color-ink)" : "#ffffff";
  return (
    <svg viewBox="2 6 56 58" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title ? <title>{title}</title> : null}
      <path d={MARK_PATHS.bubble} fill={body} />
      <path d={MARK_PATHS.fold} fill={fold} opacity={variant === "mono" ? 0.55 : 1} />
      <path d={MARK_PATHS.check} fill="none" stroke={check} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({ className, withTld = false, inverse = false }: { className?: string; withTld?: boolean; inverse?: boolean }) {
  return (
    <span className={clsx("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="h-8 w-8 shrink-0" variant={inverse ? "inverse" : "color"} />
      <span className={clsx("font-serif text-[1.375rem] leading-none tracking-[-0.01em]", inverse ? "text-white" : "text-ink")}>
        Referto<span className={inverse ? "text-mist" : "text-teal"}>Chiaro</span>
        {withTld ? <span className={clsx("text-base", inverse ? "text-white/70" : "text-muted")}>.it</span> : null}
      </span>
    </span>
  );
}
