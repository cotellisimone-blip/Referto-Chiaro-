import { clsx } from "clsx";

/**
 * Simbolo originale di Cura Privata (8/11/2026), disegnato per questo progetto:
 * una «C» aperta (chi si prende cura) che accoglie una curva rivolta verso l'interno (lo spazio riservato)
 * attorno a un punto di menta (la persona). Niente cuori o croci generiche.
 * Prima del deposito serve una verifica di anteriorità grafica (vedi docs/cura-privata/BLOCCHI_LEGALI_CLINICI.md).
 */
export const MARK_PATHS = {
  outer: "M49.09 16.61A23 23 0 1 0 49.09 47.39",
  inner: "M31 20C39.5 20 44 26 44 32C44 38 39.5 44 31 44",
  dot: { cx: 31, cy: 32, r: 3.6 },
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
  const outer = variant === "color" ? "var(--color-brand)" : variant === "mono" ? "currentColor" : "#ffffff";
  const inner = variant === "color" ? "var(--color-sage)" : variant === "mono" ? "currentColor" : "#7be0d2";
  const dot = variant === "mono" ? "currentColor" : "#7be0d2";
  return (
    <svg viewBox="4 4 56 56" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title ? <title>{title}</title> : null}
      <path d={MARK_PATHS.outer} fill="none" stroke={outer} strokeWidth={8} strokeLinecap="round" className="logo-outer" />
      <path d={MARK_PATHS.inner} fill="none" stroke={inner} strokeWidth={7} strokeLinecap="round" />
      <circle {...MARK_PATHS.dot} fill={dot} />
    </svg>
  );
}

export function Logo({ className, withTld = false, inverse = false }: { className?: string; withTld?: boolean; inverse?: boolean }) {
  return (
    <span className={clsx("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="h-8 w-8 shrink-0 xl:h-9 xl:w-9" variant={inverse ? "inverse" : "color"} />
      <span
        className={clsx(
          "whitespace-nowrap font-sans text-[1.3125rem] font-extrabold xl:text-[1.4375rem] leading-none tracking-[-0.025em]",
          inverse ? "text-white" : "text-brand",
        )}
      >
        Cura <span className={inverse ? "text-marker" : "text-teal"}>Privata</span>
        {withTld ? <span className={clsx("text-base font-semibold", inverse ? "text-white/70" : "text-muted")}>.it</span> : null}
      </span>
    </span>
  );
}
