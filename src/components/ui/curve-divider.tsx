/** Raccordo tra due sezioni: la curva del simbolo, grande e appena visibile, che porta da un fondo all'altro. */
export function CurveDivider({ from = "canvas", to = "paper" }: { from?: "canvas" | "paper" | "mist"; to?: "canvas" | "paper" | "mist" }) {
  const color = (t: string) => `var(--color-${t})`;
  return (
    <div aria-hidden className="curve-divider" style={{ background: color(from) }}>
      <svg viewBox="0 0 1440 56" preserveAspectRatio="none" fill="none">
        <path d="M0 56C360 56 480 0 720 0S1080 56 1440 56V56H0Z" fill={color(to)} />
        <path d="M0 40C360 40 480 -8 720 -8S1080 40 1440 40" stroke="var(--color-marker)" strokeOpacity="0.55" strokeWidth="2" />
      </svg>
    </div>
  );
}
