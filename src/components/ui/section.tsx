import { clsx } from "clsx";

/**
 * Sezione di una pagina interna, grafica «Luce»: stesso ritmo ovunque (classe .section), titolo grande, testo guida.
 * `tone="mist"` e `tone="strong"` sono pannelli arrotondati staccati dai bordi; `paper` e `canvas` stanno sul fondo.
 */
export function Section({
  id,
  eyebrow,
  title,
  lead,
  children,
  className,
  tone = "canvas",
  size = "lg",
  center = false,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  lead?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  tone?: "canvas" | "paper" | "mist" | "strong";
  size?: "md" | "lg";
  center?: boolean;
}) {
  const headingId = id ? `${id}-titolo` : undefined;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={clsx("section scroll-mt-24", tone === "mist" && "panel-section grain bg-mist", tone === "strong" && "panel-section scope-strong bg-petrol", className)}
    >
      <div className="container-rc">
        <div className={clsx("max-w-3xl", center && "mx-auto text-center")}>
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h2 id={headingId} className={clsx(size === "lg" ? "display-lg" : "display-md", eyebrow && "mt-3")}>
            {title}
          </h2>
          {lead ? <div className="lead mt-4">{lead}</div> : null}
        </div>
        {children ? <div className="mt-7 sm:mt-10">{children}</div> : null}
      </div>
    </section>
  );
}
