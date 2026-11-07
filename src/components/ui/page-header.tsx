export function PageHeader({ eyebrow, title, lead, children }: { eyebrow?: string; title: string; lead?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div className="border-b border-line/70 bg-[linear-gradient(180deg,var(--color-mist),var(--color-canvas))]">
      <div className="container-rc py-14 sm:py-20">
        <div className="max-w-3xl">
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h1 className="display mt-3 text-[2.25rem] sm:text-[3.25rem]">{title}</h1>
          {lead ? <div className="mt-5 text-lg text-muted sm:text-xl">{lead}</div> : null}
          {children}
        </div>
      </div>
    </div>
  );
}
