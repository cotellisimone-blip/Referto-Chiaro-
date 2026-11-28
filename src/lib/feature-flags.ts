/**
 * Feature gate lato server. Ogni endpoint sensibile DEVE chiamare requireCapability:
 * nascondere un pulsante non basta.
 *
 * Fail-closed: qualsiasi valore diverso dalla stringa esatta "true" vale false.
 */

export type Feature = "realUploads" | "aiProcessing" | "livePayments" | "medicalSecondOpinion" | "medicalVideoConsult" | "publicSignup" | "puntoDiPartenza" | "puntoDiPartenzaSave";

export interface Flags {
  demoMode: boolean;
  productionComplianceApproved: boolean;
  realUploads: boolean;
  aiProcessing: boolean;
  livePayments: boolean;
  medicalSecondOpinion: boolean;
  medicalVideoConsult: boolean;
  publicSignup: boolean;
  /**
   * Punto di Partenza (V3): strumento gratuito, tutto nel browser, nessun dato salvato. Acceso di base (come il listino
   * pubblico, le pagine sono statiche e leggono la variabile alla build); ENABLE_PUNTO_DI_PARTENZA="false" lo spegne
   * ovunque: pagina, ingresso in home, fondo pagina, ricerca, sitemap. Il lancio reale resta legato al gate di revisione
   * medica in docs/PRODUCTION_GATES.md.
   */
  puntoDiPartenza: boolean;
  /** Salvataggio delle risposte nell'area personale: predisposto, resta spento fino al gate privacy/clinico. */
  puntoDiPartenzaSave: boolean;
  /**
   * Profilo «vetrina» (ciclo 1, SITE_PROFILE="vetrina"): il sito può andare online prima della conformità.
   * Forza la modalità dimostrativa e spegne tutto ciò che tocca dati sanitari reali, soldi veri o medici,
   * anche se un interruttore fosse acceso per errore. Restano aperti pagine informative, strumenti gratuiti,
   * referto di esempio e liste d'attesa. Vedi docs/cura-privata/LANCIO_VETRINA.md.
   */
  vetrina: boolean;
}

type Env = Record<string, string | undefined>;

const strictTrue = (v: string | undefined) => v === "true";

export function readFlags(env: Env = process.env): Flags {
  const flags: Flags = {
    // Demo: "true" esplicito; senza variabile è attiva solo fuori produzione (in produzione resta spenta).
    demoMode: env.DEMO_MODE === "true" || (env.DEMO_MODE === undefined && env.NODE_ENV !== "production"),
    productionComplianceApproved: strictTrue(env.PRODUCTION_COMPLIANCE_APPROVED),
    realUploads: strictTrue(env.ENABLE_REAL_UPLOADS),
    aiProcessing: strictTrue(env.ENABLE_AI_PROCESSING),
    livePayments: strictTrue(env.ENABLE_LIVE_PAYMENTS),
    medicalSecondOpinion: strictTrue(env.ENABLE_MEDICAL_SECOND_OPINION),
    medicalVideoConsult: strictTrue(env.ENABLE_MEDICAL_VIDEO_CONSULT),
    publicSignup: strictTrue(env.ENABLE_PUBLIC_SIGNUP),
    puntoDiPartenza: env.ENABLE_PUNTO_DI_PARTENZA !== "false",
    puntoDiPartenzaSave: strictTrue(env.ENABLE_PUNTO_DI_PARTENZA_SAVE),
    vetrina: env.SITE_PROFILE?.trim().toLowerCase() === "vetrina",
  };
  if (flags.vetrina) {
    return {
      ...flags,
      demoMode: true,
      productionComplianceApproved: false,
      realUploads: false,
      aiProcessing: false,
      livePayments: false,
      medicalSecondOpinion: false,
      medicalVideoConsult: false,
      publicSignup: false,
      puntoDiPartenzaSave: false,
    };
  }
  return flags;
}

/** Funzioni che toccano dati sanitari reali, soldi o prestazioni mediche. */
const COMPLIANCE_GATED: Feature[] = ["realUploads", "aiProcessing", "livePayments", "medicalSecondOpinion", "medicalVideoConsult", "puntoDiPartenzaSave"];

export class CapabilityDisabledError extends Error {
  readonly status = 403;
  constructor(
    readonly feature: Feature,
    readonly reason: "feature-disabled" | "compliance-not-approved" | "demo-mode",
  ) {
    super(`Capability "${feature}" non disponibile: ${reason}`);
  }
}

export function isCapabilityEnabled(feature: Feature, flags: Flags = readFlags()): boolean {
  try {
    requireCapability(feature, flags);
    return true;
  } catch {
    return false;
  }
}

export function requireCapability(feature: Feature, flags: Flags = readFlags()): void {
  if (!flags[feature]) throw new CapabilityDisabledError(feature, "feature-disabled");
  if (COMPLIANCE_GATED.includes(feature)) {
    if (flags.demoMode) throw new CapabilityDisabledError(feature, "demo-mode");
    if (!flags.productionComplianceApproved) throw new CapabilityDisabledError(feature, "compliance-not-approved");
  }
}

/** Configurazione pubblica non sensibile, esposta al client. */
export function publicConfig(flags: Flags = readFlags()) {
  return {
    mode: flags.demoMode ? "demo" : flags.productionComplianceApproved ? "production" : "sandbox",
    profile: flags.vetrina ? "vetrina" : "standard",
    capabilities: {
      realUploads: isCapabilityEnabled("realUploads", flags),
      aiProcessing: isCapabilityEnabled("aiProcessing", flags),
      livePayments: isCapabilityEnabled("livePayments", flags),
      medicalSecondOpinion: isCapabilityEnabled("medicalSecondOpinion", flags),
      medicalVideoConsult: isCapabilityEnabled("medicalVideoConsult", flags),
      publicSignup: isCapabilityEnabled("publicSignup", flags),
    },
  } as const;
}

/** Punto di Partenza visibile (pagina, ingresso in home, fondo pagina, ricerca). */
export function puntoDiPartenzaEnabled(env: Env = process.env): boolean {
  return readFlags(env).puntoDiPartenza;
}
