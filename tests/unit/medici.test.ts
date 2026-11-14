import { afterEach, describe, expect, it, vi } from "vitest";
import { CON_UN_MEDICO_HREF, DOCTOR_API, DOCTOR_PATHS, isDoctorApi, isDoctorPath, mediciEnabled, withoutDoctors } from "@/lib/medici";

/**
 * L'interruttore dei servizi con un medico (decisione del titolare del 13/11/2026: si parte senza).
 * Spento di suo; acceso solo con ENABLE_MEDICI="true", in ogni profilo (vetrina compresa).
 */
describe("interruttore dei servizi con un medico", () => {
  afterEach(() => vi.unstubAllEnvs());

  function env(vars: Record<string, string>) {
    for (const k of ["ENABLE_MEDICI", "NEXT_PUBLIC_ENABLE_MEDICI", "SITE_PROFILE"]) vi.stubEnv(k, vars[k] ?? "");
  }

  it("senza nulla di scritto è spento: il sito parte senza medici", () => {
    env({});
    expect(mediciEnabled()).toBe(false);
  });

  it("si accende solo con il valore esatto \"true\"", () => {
    env({ ENABLE_MEDICI: "true" });
    expect(mediciEnabled()).toBe(true);
    for (const v of ["1", "si", "TRUE", "yes", " true"]) {
      env({ ENABLE_MEDICI: v });
      expect(mediciEnabled(), v).toBe(false);
    }
  });

  it("il valore fissato alla build vince su quello letto dopo: pagine e server restano d'accordo", () => {
    env({ NEXT_PUBLIC_ENABLE_MEDICI: "false", ENABLE_MEDICI: "true" });
    expect(mediciEnabled()).toBe(false);
    env({ NEXT_PUBLIC_ENABLE_MEDICI: "true" });
    expect(mediciEnabled()).toBe(true);
  });

  it("il profilo vetrina segue lo stesso interruttore: spento di suo, riacceso torna com'era", () => {
    env({ SITE_PROFILE: "vetrina" });
    expect(mediciEnabled()).toBe(false);
    env({ SITE_PROFILE: "vetrina", ENABLE_MEDICI: "true" });
    expect(mediciEnabled()).toBe(true);
    env({ SITE_PROFILE: "vetrina", NEXT_PUBLIC_ENABLE_MEDICI: "false", ENABLE_MEDICI: "true" });
    expect(mediciEnabled()).toBe(false);
  });
});

describe("pagine e API dei servizi con un medico", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("riconosce le pagine e tutto quello che sta sotto, non gli indirizzi che ci somigliano", () => {
    for (const p of DOCTOR_PATHS) {
      expect(isDoctorPath(p), p).toBe(true);
      expect(isDoctorPath(`${p}/qualcosa`), p).toBe(true);
    }
    for (const p of ["/", "/referti", "/servizi", "/servizi/prevenzione", "/prezzi", "/famiglia", "/admin/medici", "/medicina", "/richieste-speciali", "/area-personale", "/area-personale/promemoria", "/strumenti/domande-per-il-medico", CON_UN_MEDICO_HREF]) {
      expect(isDoctorPath(p), p).toBe(false);
    }
  });

  it("riconosce le API dei medici; quelle dell'amministrazione restano fuori, per preparare i medici prima di accendere", () => {
    for (const p of DOCTOR_API) {
      expect(isDoctorApi(p), p).toBe(true);
      expect(isDoctorApi(`${p}/123`), p).toBe(true);
    }
    for (const p of ["/api/v1/area/documents", "/api/v1/area/orders", "/api/v1/admin/medici", "/api/v1/admin/medici/1", "/api/v1/medicina", "/api/v1/waitlist"]) {
      expect(isDoctorApi(p), p).toBe(false);
    }
  });

  it("toglie le voci dei medici da un elenco solo quando l'interruttore è spento", () => {
    const voci = [{ href: "/referti" }, { href: "/servizi/secondo-parere" }, { href: "/richiedi/domicilio" }, { href: "/prezzi" }];
    vi.stubEnv("NEXT_PUBLIC_ENABLE_MEDICI", "");
    vi.stubEnv("SITE_PROFILE", "");
    vi.stubEnv("ENABLE_MEDICI", "");
    expect(withoutDoctors(voci).map((v) => v.href)).toEqual(["/referti", "/prezzi"]);
    vi.stubEnv("ENABLE_MEDICI", "true");
    expect(withoutDoctors(voci).map((v) => v.href)).toEqual(voci.map((v) => v.href));
  });
});
