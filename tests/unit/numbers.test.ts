import { describe, expect, it } from "vitest";
import { parseLocaleNumber, formatItalianNumber } from "@/domain/extraction/numbers";
import { parseReferenceRange, positionInPrintedRange } from "@/domain/extraction/reference";

describe("parseLocaleNumber", () => {
  it("legge la virgola decimale italiana", () => expect(parseLocaleNumber("4,5")).toEqual({ ok: true, value: 4.5, decimals: 1 }));
  it("legge il punto decimale", () => expect(parseLocaleNumber("4.5")).toEqual({ ok: true, value: 4.5, decimals: 1 }));
  it("4,5 e 4.5 danno lo stesso numero", () => {
    const a = parseLocaleNumber("4,5");
    const b = parseLocaleNumber("4.5");
    expect(a.ok && b.ok && a.value === b.value).toBe(true);
  });
  it("gestisce migliaia con punto e decimali con virgola", () =>
    expect(parseLocaleNumber("1.234,5")).toEqual({ ok: true, value: 1234.5, decimals: 1 }));
  it("non indovina un separatore ambiguo", () => {
    expect(parseLocaleNumber("1.234")).toEqual({ ok: false, reason: "ambiguous-separator" });
    expect(parseLocaleNumber("12.345.678")).toEqual({ ok: false, reason: "ambiguous-separator" });
  });
  it("rifiuta valori vuoti o non numerici (OCR ambiguo)", () => {
    expect(parseLocaleNumber("")).toEqual({ ok: false, reason: "empty" });
    expect(parseLocaleNumber(null)).toEqual({ ok: false, reason: "empty" });
    expect(parseLocaleNumber("1▒8")).toEqual({ ok: false, reason: "not-numeric" });
    expect(parseLocaleNumber("l2")).toEqual({ ok: false, reason: "not-numeric" });
  });
  it("conserva le cifre decimali nel formato italiano", () => expect(formatItalianNumber(0.89, 2)).toBe("0,89"));
});

describe("intervalli stampati", () => {
  it("legge intervalli standard e con virgole", () => {
    expect(parseReferenceRange("70 - 99")).toEqual({ kind: "between", low: 70, high: 99 });
    expect(parseReferenceRange("4,0 - 5,6")).toEqual({ kind: "between", low: 4, high: 5.6 });
    expect(parseReferenceRange("[0,70 – 1,20]")).toEqual({ kind: "between", low: 0.7, high: 1.2 });
  });
  it("legge limiti superiori/inferiori", () => {
    expect(parseReferenceRange("< 200")).toEqual({ kind: "below", high: 200, inclusive: false });
    expect(parseReferenceRange(">= 40")).toEqual({ kind: "above", low: 40, inclusive: true });
  });
  it("non interpreta intervalli non standard", () => {
    expect(parseReferenceRange("vedi nota").kind).toBe("unparsed");
    expect(parseReferenceRange("99 - 70").kind).toBe("unparsed");
    expect(parseReferenceRange(null).kind).toBe("unparsed");
  });
  it("calcola la posizione numerica senza giudizi clinici", () => {
    expect(positionInPrintedRange(92, parseReferenceRange("70 - 99"))).toBe("inside");
    expect(positionInPrintedRange(134, parseReferenceRange("< 115"))).toBe("above-range");
    expect(positionInPrintedRange(200, parseReferenceRange("< 200"))).toBe("above-range");
    expect(positionInPrintedRange(60, parseReferenceRange("70 - 99"))).toBe("below-range");
    expect(positionInPrintedRange(null, parseReferenceRange("70 - 99"))).toBe("not-comparable");
    expect(positionInPrintedRange(5, parseReferenceRange("vedi nota"))).toBe("not-comparable");
  });
});
