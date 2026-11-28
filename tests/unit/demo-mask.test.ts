import { describe, expect, it } from "vitest";
import { maskEmail } from "@/lib/demo-mask";

describe("email mascherate per l'admin dimostrativo", () => {
  it("lascia solo la prima lettera di nome e dominio", () => {
    expect(maskEmail("mario.rossi@gmail.com")).toBe("m•••@g•••.com");
    expect(maskEmail("a@b.it")).toBe("a•••@b•••.it");
    expect(maskEmail("senza-chiocciola")).toBe("•••");
  });
});
