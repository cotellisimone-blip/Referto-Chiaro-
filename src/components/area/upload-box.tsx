"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Loader2, ShieldCheck, Upload } from "lucide-react";

const MAX = 4 * 1024 * 1024;
const ACCEPT = "application/pdf,image/jpeg,image/png,image/webp";

/** Caricamento di un referto reale. Visibile solo quando il server ha il gate realUploads aperto. */
export function UploadBox({
  profileId = null,
}: { profileId?: string | null } = {}) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);

  async function send(file: File) {
    setError(null);
    if (file.size > MAX)
      return setError(
        "Il file supera i 4 MB. Prova con una foto meno pesante o un PDF più piccolo.",
      );
    if (!ACCEPT.split(",").includes(file.type))
      return setError(
        "Formato non supportato: carica un PDF oppure una foto (JPG, PNG o WEBP).",
      );
    setBusy(true);
    setName(file.name);
    try {
      const fd = new FormData();
      fd.append("file", file);
      if (profileId) fd.append("profileId", profileId);
      const res = await fetch("/api/v1/area/documents/upload", {
        method: "POST",
        body: fd,
        credentials: "same-origin",
        cache: "no-store",
      });
      const data = (await res.json().catch(() => ({}))) as {
        id?: string;
        message?: string;
      };
      if (!res.ok || !data.id)
        throw new Error(data.message ?? "Caricamento non riuscito. Riprova.");
      router.push(`/area-personale/documenti/${data.id}`);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Caricamento non riuscito. Riprova.",
      );
      setBusy(false);
    }
  }

  return (
    <div className="rounded-[var(--radius-lg)] border-2 border-dashed border-teal/50 bg-paper p-6 sm:p-7">
      <div className="flex items-center gap-3">
        <span aria-hidden className="tile-ico tile-ico-sm">
          <Upload />
        </span>
        <h2 id="upload-titolo" className="side-card-title text-xl">
          Carica un tuo referto
        </h2>
      </div>
      <p className="mt-4 text-base text-ink-soft">
        Il PDF del laboratorio è la scelta migliore. Va bene anche una foto:
        dritta, nitida, con tutta la pagina visibile. Massimo 4 MB.
      </p>
      <input
        ref={input}
        type="file"
        accept={ACCEPT}
        className="sr-only"
        id="file-upload"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void send(f);
          e.target.value = "";
        }}
      />
      <label
        htmlFor="file-upload"
        className={`btn btn-primary btn-lg mt-5 w-full max-sm:px-4 ${busy ? "pointer-events-none opacity-70" : ""}`}
        aria-disabled={busy}
      >
        {busy ? (
          <Loader2 aria-hidden className="h-5 w-5 shrink-0 animate-spin" />
        ) : (
          <Camera aria-hidden className="h-5 w-5 shrink-0" />
        )}
        {busy ? `Caricamento di «${name}»…` : "Scegli il PDF o scatta una foto"}
      </label>
      {error ? (
        <p role="alert" className="field-error mt-4">
          {error}
        </p>
      ) : null}
      <p className="mt-4 flex gap-2.5 text-base text-muted">
        <ShieldCheck
          aria-hidden
          className="mt-0.5 h-5 w-5 shrink-0 text-sage-deep"
        />
        Il file viene cifrato e lo puoi cancellare quando vuoi. Prima di
        qualsiasi spiegazione ti chiediamo di controllare ogni valore letto.
      </p>
    </div>
  );
}
