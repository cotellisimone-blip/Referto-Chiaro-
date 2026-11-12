/** Transizione leggera a ogni cambio pagina (disattivata da prefers-reduced-motion in globals.css). */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
