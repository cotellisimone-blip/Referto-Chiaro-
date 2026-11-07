/** Adattatore per i file caricati dagli utenti. Nessuna implementazione reale è attiva in demo. */
export interface StoredFile {
  id: string;
  sha256: string;
  mimeType: string;
  sizeBytes: number;
}

export interface UploadProvider {
  readonly id: string;
  /** Verifica (tipo, dimensione, firma, antivirus) e salva in storage cifrato. */
  store(file: { bytes: Uint8Array; mimeType: string; fileName: string }): Promise<StoredFile>;
  delete(fileId: string): Promise<void>;
}
