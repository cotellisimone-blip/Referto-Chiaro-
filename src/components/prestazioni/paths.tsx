"use client";

import { createContext, useContext } from "react";
import type { PrestazioneKind } from "@/domain/prestazioni/listino";

/**
 * Il percorso del paziente esiste in due cornici con gli stessi componenti:
 * - pubblica (/richiedi, /richieste): quella a cui portano home e pagine servizio, senza la barra dei ruoli;
 * - prova a tre ruoli (/prova/paziente): con il cambio di ruolo verso medico e amministrazione.
 */
const SLUG: Record<PrestazioneKind, string> = { domicilio: "domicilio", video: "videoconsulto", parere: "secondo-parere" };

export interface PatientPaths {
  home: string;
  start: (kind: PrestazioneKind) => string;
  request: (id: string) => string;
  /** Vero nella prova a tre ruoli: mostra le scorciatoie «Apri come medico». */
  roles: boolean;
}

export const PUBLIC_PATHS: PatientPaths = { home: "/richieste", start: (k) => `/richiedi/${SLUG[k]}`, request: (id) => `/richieste/${id}`, roles: false };
export const PROVA_PATHS: PatientPaths = { home: "/prova/paziente", start: (k) => `/prova/paziente/${SLUG[k]}`, request: (id) => `/prova/paziente/richieste/${id}`, roles: true };

const Ctx = createContext<PatientPaths>(PUBLIC_PATHS);

export function PatientPathsProvider({ mode, children }: { mode: "public" | "prova"; children: React.ReactNode }) {
  return <Ctx.Provider value={mode === "prova" ? PROVA_PATHS : PUBLIC_PATHS}>{children}</Ctx.Provider>;
}

export const usePatientPaths = () => useContext(Ctx);
