"use client";

import { useSyncExternalStore } from "react";
import { DEMO_STORAGE_VERSION, isSameDay, seedState, sweepExpired, type PrestazioniState } from "@/domain/prestazioni/engine";

/**
 * Stato della prova delle prestazioni, condiviso da paziente, medico e amministrazione nello stesso browser.
 * Resta al ricaricamento e tra un ruolo e l'altro (localStorage); si ripristina con «Ricomincia la prova».
 * Nessun dato esce dal browser: video, pagamenti, documenti e comunicazioni sono simulati.
 * Se il browser non consente il salvataggio (navigazione privata, anteprime) lo stato resta in memoria.
 */
const KEY = "cp-prestazioni-demo";
const DOCTOR_KEY = "cp-prestazioni-demo-medico";
const EVENT = "cp-prestazioni-demo-change";

let memory: PrestazioniState | null = null;
let memoryDoctor: string | null = null;

function read(): PrestazioniState | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as PrestazioniState;
    return s && s.version === DEMO_STORAGE_VERSION && Array.isArray(s.requests) ? s : null;
  } catch {
    return null;
  }
}

function persist(s: PrestazioniState) {
  memory = s;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* resta in memoria */
  }
}

function write(s: PrestazioniState) {
  persist(s);
  window.dispatchEvent(new Event(EVENT));
}

/**
 * Lettura (anche durante il render): mai eventi qui, solo salvataggio silenzioso.
 * Le fasce sono relative al giorno della prova: un nuovo giorno riparte con fasce nuove.
 */
function current(): PrestazioniState {
  const now = new Date();
  let s = memory ?? read();
  if (!s || !isSameDay(new Date(s.seededAt), now)) s = seedState(now);
  const swept = sweepExpired(s, now);
  if (swept !== memory) persist(swept);
  return swept;
}

function subscribe(cb: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY || e.key === DOCTOR_KEY) {
      memory = null;
      memoryDoctor = null;
      cb();
    }
  };
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", onStorage);
  };
}

/** null finché non c'è il browser (prima idratazione): i componenti mostrano un'attesa. */
export function usePrestazioni(): PrestazioniState | null {
  return useSyncExternalStore(subscribe, current, () => null);
}

export function update(fn: (s: PrestazioniState, now: Date) => PrestazioniState) {
  const next = fn(current(), new Date());
  if (next !== memory) write(next);
}

/** Esegue un'azione del motore che può fallire: salva sempre lo stato restituito e passa l'esito al chiamante. */
export function act<R extends { state: PrestazioniState }>(fn: (s: PrestazioniState, now: Date) => R): R {
  const r = fn(current(), new Date());
  if (r.state !== memory) write(r.state);
  return r;
}

export function resetDemo() {
  write(seedState(new Date()));
  setDoctor(null);
}

function readDoctor(): string | null {
  if (memoryDoctor !== null) return memoryDoctor || null;
  try {
    memoryDoctor = window.localStorage.getItem(DOCTOR_KEY) ?? "";
  } catch {
    memoryDoctor = "";
  }
  return memoryDoctor || null;
}

export function useDemoDoctor(): string | null {
  return useSyncExternalStore(subscribe, readDoctor, () => null);
}

export function setDoctor(id: string | null) {
  memoryDoctor = id ?? "";
  try {
    if (id) window.localStorage.setItem(DOCTOR_KEY, id);
    else window.localStorage.removeItem(DOCTOR_KEY);
  } catch {
    /* in memoria */
  }
  window.dispatchEvent(new Event(EVENT));
}
