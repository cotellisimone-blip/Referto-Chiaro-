import { clsx } from "clsx";

export function Section({
  id,
  eyebrow,
  title,
  lead,
  children,
  className,
  tone = "canvas",
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  lead?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  tone?: "canvas" | "paper" | "mist";
}) {
  const headingId = id ? `${id}-titolo` : undefined;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={clsx("py-16 sm:py-24", tone === "paper" && "bg-paper", tone === "mist" && "bg-mist", className)}
    >
      <div className="container-rc">
        <div className="max-w-2xl">
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h2 id={headingId} className="display mt-3 text-[2rem] sm:text-[2.75rem]">
            {title}
          </h2>
          {lead ? <div className="mt-4 text-lg text-muted">{lead}</div> : null}
        </div>
        {children ? <div className="mt-10 sm:mt-14">{children}</div> : null}
      </div>
    </section>
  );
}
