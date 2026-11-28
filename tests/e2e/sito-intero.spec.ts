import { provaSitoIntero } from "./_lib/sito-intero";

/** Stato di lancio, medici «In arrivo». Lo stesso controllo con i medici accesi: tests/e2e-medici/sito-intero.spec.ts. */
provaSitoIntero({ medici: false });
