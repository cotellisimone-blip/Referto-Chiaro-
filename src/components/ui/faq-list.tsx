import { Plus } from "lucide-react";
import type { FaqItem } from "@/content/faq";

type FaqListItem = Pick<FaqItem, "q" | "a">;

/** Domande e risposte a fisarmonica: elementi nativi (details/summary), righe alte e un «+» che ruota. */
export function FaqList({ items }: { items: FaqListItem[] }) {
  return (
    <div className="faq-list">
      {items.map((f) => (
        <details key={f.q}>
          <summary>
            {f.q}
            <span aria-hidden className="faq-plus">
              <Plus className="h-5 w-5" />
            </span>
          </summary>
          <p className="faq-answer">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
