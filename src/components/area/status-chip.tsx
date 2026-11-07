import { clsx } from "clsx";
import { ORDER_STATUS_LABEL, STATUS_LABEL } from "./api";

export function StatusChip({ status, kind = "document" }: { status: string; kind?: "document" | "order" }) {
  const s = (kind === "order" ? ORDER_STATUS_LABEL : STATUS_LABEL)[status] ?? { label: status, tone: "muted" as const };
  return (
    <span
      className={clsx(
        "chip",
        s.tone === "muted" && "bg-mist text-muted",
        s.tone === "teal" && "bg-mist text-teal-deep",
        s.tone === "sage" && "bg-sage/15 text-sage-deep",
        s.tone === "warn" && "bg-cream text-warn",
        s.tone === "danger" && "bg-danger/10 text-danger",
      )}
    >
      {(s.tone === "teal" || status === "queued") && status !== "verified" ? <span aria-hidden className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" /> : null}
      {s.label}
    </span>
  );
}
