/**
 * Validazione dei file caricati, PRIMA di qualsiasi salvataggio o lettura.
 * - Solo PDF, JPEG, PNG, WEBP, riconosciuti dalla FIRMA dei byte (il tipo dichiarato dal browser non basta).
 * - Dimensione massima 4 MB (limite del corpo delle richieste su Vercel: 4,5 MB).
 * - PDF con JavaScript, azioni automatiche o file incorporati vengono rifiutati.
 */
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

export type AllowedMime = "application/pdf" | "image/jpeg" | "image/png" | "image/webp";

export type UploadCheck = { ok: true; mimeType: AllowedMime } | { ok: false; code: "empty" | "too-large" | "unsupported-type" | "unsafe-pdf"; message: string };

export function sniffMime(b: Uint8Array): AllowedMime | null {
  const starts = (sig: number[], at = 0) => sig.every((v, i) => b[at + i] === v);
  if (starts([0x25, 0x50, 0x44, 0x46, 0x2d])) return "application/pdf"; // %PDF-
  if (starts([0xff, 0xd8, 0xff])) return "image/jpeg";
  if (starts([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "image/png";
  if (starts([0x52, 0x49, 0x46, 0x46]) && starts([0x57, 0x45, 0x42, 0x50], 8)) return "image/webp"; // RIFF....WEBP
  return null;
}

const UNSAFE_PDF = [/\/JavaScript\b/, /\/JS\s*[(<]/, /\/Launch\b/, /\/EmbeddedFile\b/, /\/OpenAction\b[^>]*\/JS/, /\/RichMedia\b/, /\/XFA\b/];

export function checkUpload(bytes: Uint8Array): UploadCheck {
  if (bytes.length === 0) return { ok: false, code: "empty", message: "Il file è vuoto." };
  if (bytes.length > MAX_UPLOAD_BYTES) return { ok: false, code: "too-large", message: "Il file supera i 4 MB. Prova con una foto meno pesante o un PDF più piccolo." };
  const mime = sniffMime(bytes);
  if (!mime) return { ok: false, code: "unsupported-type", message: "Formato non supportato: carica un PDF oppure una foto (JPG, PNG o WEBP)." };
  if (mime === "application/pdf") {
    const latin = Buffer.from(bytes).toString("latin1");
    if (UNSAFE_PDF.some((re) => re.test(latin))) return { ok: false, code: "unsafe-pdf", message: "Questo PDF contiene elementi attivi (script o allegati) e non può essere accettato." };
  }
  return { ok: true, mimeType: mime };
}

/** Nome mostrato all'utente: niente percorsi, niente caratteri di controllo, lunghezza limitata. */
export function safeTitle(fileName: string): string {
  const base = fileName.split(/[\\/]/).pop() ?? "";
  const clean = base.replace(/\.[a-z0-9]{1,5}$/i, "").replace(/[\u0000-\u001f<>"]/g, "").replace(/\s+/g, " ").trim().slice(0, 80);
  return clean || "Referto caricato";
}
