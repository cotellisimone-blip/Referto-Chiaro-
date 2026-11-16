import { clsx } from "clsx";
import {
  chartGeometry,
  fmtDate,
  positionText,
  type Series,
} from "@/domain/famiglia/nel-tempo";

const isOut = (p: Series["points"][number]) =>
  p.position === "above-range" || p.position === "below-range";

/**
 * Un esame nel tempo: fascia dell'intervallo stampato (se è lo stesso in tutti i referti), linea, un punto per referto.
 * Il grafico è un disegno; i numeri veri sono scritti sopra i punti e nell'elenco sotto, che legge anche il lettore di schermo.
 */
export function TrendChart({
  series,
  compact = false,
}: {
  series: Series;
  compact?: boolean;
}) {
  const g = chartGeometry(series);
  const last = series.points[series.points.length - 1];
  const first = series.points[0];
  const u = series.unit ? ` ${series.unit}` : "";
  const summary = `${series.name}: ${series.points.map((p) => `${p.valueRaw}${u} il ${fmtDate(p.date)}`).join(", ")}.`;
  return (
    <figure className="m-0">
      <div className="trend-plot" role="img" aria-label={summary}>
        {g.band ? (
          <span
            aria-hidden
            className={clsx(
              "trend-band",
              series.band?.high == null && "is-open-top",
              series.band?.low == null && "is-open-bottom",
            )}
            style={{
              top: `${Math.max(0, g.band.top)}%`,
              bottom: `${Math.max(0, 100 - g.band.bottom)}%`,
            }}
          />
        ) : null}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
          focusable="false"
        >
          <polyline
            className="trend-line"
            points={g.points.map((p) => `${p.x},${p.y}`).join(" ")}
          />
        </svg>
        {g.points.map(({ x, y, p }, i) => (
          <span key={`${p.documentId}-${i}`} aria-hidden>
            <span
              className={clsx(
                "trend-dot",
                isOut(p) && "is-out",
                i === g.points.length - 1 && "is-last",
              )}
              style={{ left: `${x}%`, top: `${y}%` }}
            />
            {!compact || i === 0 || i === g.points.length - 1 ? (
              <span
                className={clsx(
                  "trend-val",
                  y < 24 && "is-below",
                  isOut(p) && "is-out",
                )}
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                {p.valueRaw}
              </span>
            ) : null}
          </span>
        ))}
      </div>
      <div aria-hidden className="trend-axis">
        <span>{fmtDate(first.date)}</span>
        <span>{fmtDate(last.date)}</span>
      </div>
    </figure>
  );
}

/** Scheda di un esame: ultimo numero, grafico, che cosa è cambiato, elenco dei referti. */
export function TrendCard({
  series,
  compact = false,
}: {
  series: Series;
  /** Home: solo numero, grafico e intervallo; il resto è a un tocco. */
  compact?: boolean;
}) {
  const last = series.points[series.points.length - 1];
  const out = isOut(last);
  return (
    <article
      className={clsx("trend-card", out && "is-out")}
      data-testid="serie"
      aria-labelledby={`serie-${series.key.replace(/[^a-z0-9]/gi, "-")}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <h3
          id={`serie-${series.key.replace(/[^a-z0-9]/gi, "-")}`}
          className="trend-name"
        >
          {series.name}
        </h3>
        <span
          className={clsx(
            "chip shrink-0",
            out ? "bg-cream text-warn" : "bg-mist text-teal-deep",
          )}
        >
          {series.points.length} referti
        </span>
      </div>
      <p className="trend-last">
        <span className="trend-last-num">{last.valueRaw}</span>
        <span className="text-[1.0625rem] font-semibold text-ink-soft">
          {series.unit}
        </span>
        <span className="text-[1rem] text-muted">il {fmtDate(last.date)}</span>
      </p>
      <p
        className={clsx(
          "mt-1 text-[1rem] font-bold",
          out ? "text-warn" : "text-teal-deep",
        )}
      >
        {series.lastPositionText}
      </p>
      <TrendChart series={series} />
      <div className="trend-legend mt-2">
        {series.band ? (
          <span>
            <span aria-hidden className="trend-legend-band" /> Intervallo
            stampato: {series.band.raw}
          </span>
        ) : (
          <span>Intervallo stampato diverso tra i referti</span>
        )}
        {series.outsideCount ? (
          <span>
            <span aria-hidden className="trend-legend-dot is-out" /> Fuori
            dall&apos;intervallo stampato
          </span>
        ) : null}
      </div>
      {!compact && series.changeText ? (
        <p className="mt-3 text-[1.0625rem] leading-relaxed text-ink">
          {series.changeText}
        </p>
      ) : null}
      {!compact && series.lastStepText ? (
        <p className="text-[1rem] text-ink-soft">{series.lastStepText}</p>
      ) : null}
      {compact ? null : (
        <details className="mt-3">
          <summary className="inline-flex min-h-11 cursor-pointer items-center text-[1rem] font-bold text-teal-deep">
            Tutti i numeri, referto per referto
          </summary>
          <ul className="trend-points">
            {[...series.points].reverse().map((p, i) => (
              <li key={`${p.documentId}-${i}`}>
                <span className="tabular font-semibold text-ink">
                  {fmtDate(p.date)}
                </span>
                <span className="tabular text-ink">
                  <strong>{p.valueRaw}</strong> {series.unit}
                  <span
                    className={clsx(
                      "ml-2",
                      isOut(p) ? "text-warn" : "text-muted",
                    )}
                  >
                    · {positionText(p.position)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </details>
      )}
    </article>
  );
}
