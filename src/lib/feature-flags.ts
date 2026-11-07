/**
 * Feature gate lato server. Ogni endpoint sensibile DEVE chiamare requireCapability:
 * nascondere un pulsante non basta.
 *
 * Fail-closed: qualsiasi valore diverso dalla stringa esatta "true" vale false.
 */

export type Feature = "realUploads" | "aiProcessing" | "livePayments" | "medicalSecondOpinion" | "publicSignup";

export interface Flags {
  demoMode: boolean;
  productionComplianceApproved: boolean;
  realUploads: boolean;
  aiProcessing: boolean;
  livePayments: boolean;
  medicalSecondOpinion: boolean;
  publicSignup: boolean;
}

type Env = Record<string, string | undefined>;

const strictTrue = (v: string | undefined) => v === "true";

export function readFlags(env: Env = process.env): Flags {
  return {
    // La demo è attiva salvo esplicito "false".
    demoMode: env.DEMO_MODE !== "false",
    productionComplianceApproved: strictTrue(env.PRODUCTION_COMPLIANCE_APPROVED),
    realUploads: strictTrue(env.ENABLE_REAL_UPLOADS),
    aiProcessing: strictTrue(env.ENABLE_AI_PROCESSING),
    livePayments: strictTrue(env.ENABLE_LIVE_PAYMENTS),
    medicalSecondOpinion: strictTrue(env.ENABLE_MEDICAL_SECOND_OPINION),
    publicSignup: strictTrue(env.ENABLE_PUBLIC_SIGNUP),
  };
}

/** Funzioni che toccano dati sanitari reali, soldi o prestazioni mediche. */
const COMPLIANCE_GATED: Feature[] = ["realUploads", "aiProcessing", "livePayments", "medicalSecondOpinion"];

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
    capabilities: {
      realUploads: isCapabilityEnabled("realUploads", flags),
      aiProcessing: isCapabilityEnabled("aiProcessing", flags),
      livePayments: isCapabilityEnabled("livePayments", flags),
      medicalSecondOpinion: isCapabilityEnabled("medicalSecondOpinion", flags),
      publicSignup: isCapabilityEnabled("publicSignup", flags),
    },
  } as const;
}
