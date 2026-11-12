import { Plus } from "lucide-react";
import type { FaqItem } from "@/content/faq";

type FaqListItem = Pick<FaqItem, "q" | "a">;

export function FaqList({ items }: { items: FaqListItem[] }) {
  return (
    <div className="divide-y divide-line rounded-[var(--radius-lg)] border border-line bg-paper">
      {items.map((f) => (
        <details key={f.q} className="group px-5 sm:px-7">
          <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-5 text-[1.125rem] font-semibold text-ink [&::-webkit-details-marker]:hidden">
            {f.q}
            <Plus aria-hidden className="flex h-9 w-9 shrink-0 rounded-full bg-mist p-2 text-teal transition-transform duration-200 group-open:rotate-45" />
          </summary>
          <p className="max-w-3xl pb-6 text-lg text-ink-soft">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
