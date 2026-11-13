"use client";

import { useCallback, useEffect, useState } from "react";
import { clsx } from "clsx";
import { api } from "@/components/area/api";
import {
  initials,
  personaSubtitle,
  type Persona,
} from "@/domain/famiglia/persone";
import type { TipoPromemoria } from "@/domain/famiglia/promemoria";

export interface PersonaView extends Persona {
  documentCount: number;
  nextReminder: {
    id: string;
    title: string;
    dueDate: string;
    kind: TipoPromemoria;
  } | null;
}

/** Le persone della famiglia, il titolare per primo. `reload` dopo un'aggiunta o un'eliminazione. */
export function usePersone() {
  const [persone, setPersone] = useState<PersonaView[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const reload = useCallback(async () => {
    try {
      const r = await api<{ persone: PersonaView[] }>("/api/v1/area/famiglia");
      setPersone(r.persone);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore");
    }
  }, []);
  useEffect(() => {
    let alive = true;
    api<{ persone: PersonaView[] }>("/api/v1/area/famiglia")
      .then((r) => alive && setPersone(r.persone))
      .catch(
        (e) => alive && setError(e instanceof Error ? e.message : "Errore"),
      );
    return () => {
      alive = false;
    };
  }, []);
  return { persone, error, reload };
}

/** L'account è quello dimostrativo? Serve a offrire «Carica lo storico di esempio». */
export function useIsDemo() {
  const [demo, setDemo] = useState(false);
  useEffect(() => {
    api<{ user: { isDemo: boolean } | null }>("/api/v1/auth/me")
      .then((r) => setDemo(Boolean(r.user?.isDemo)))
      .catch(() => setDemo(false));
  }, []);
  return demo;
}

/** Cerchio con le iniziali: il titolare in petrolio, i familiari in tinte diverse ma calme. */
const TONES = [
  "persona-tone-0",
  "persona-tone-1",
  "persona-tone-2",
  "persona-tone-3",
  "persona-tone-4",
  "persona-tone-5",
];
export function PersonaAvatar({
  persona,
  index = 0,
  size = "md",
}: {
  persona: Pick<Persona, "name" | "relation">;
  index?: number;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <span
      aria-hidden
      className={clsx(
        "persona-avatar",
        `persona-avatar-${size}`,
        persona.relation === "io"
          ? "persona-tone-io"
          : TONES[index % TONES.length],
      )}
    >
      {persona.relation === "io" ? "Tu" : initials(persona.name)}
    </span>
  );
}

/** Scelta della persona: pillole grandi, una per familiare. */
export function PersonaSwitcher({
  persone,
  current,
  onChange,
  label = "Di chi vuoi vedere i numeri?",
}: {
  persone: PersonaView[];
  current: string;
  onChange: (id: string) => void;
  label?: string;
}) {
  if (persone.length < 2) return null;
  return (
    <div
      role="group"
      aria-label={label}
      className="persona-switch"
      data-testid="persona-switch"
    >
      {persone.map((p, i) => (
        <button
          key={p.id}
          type="button"
          aria-pressed={p.id === current}
          onClick={() => onChange(p.id)}
          className={clsx(
            "persona-pill",
            p.id === current && "persona-pill-on",
          )}
        >
          <PersonaAvatar persona={p} index={i} size="sm" />
          <span className="min-w-0 text-left">
            <span className="block truncate font-bold">
              {p.relation === "io" ? "Tu" : p.name}
            </span>
            <span className="block truncate text-[0.9375rem] font-semibold text-muted">
              {personaSubtitle(p)}
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}

export function personaName(
  persone: PersonaView[] | null,
  profileId: string | null,
): string {
  if (!profileId) return "Tu";
  return persone?.find((p) => p.id === profileId)?.name ?? "Familiare";
}
