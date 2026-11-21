import { describe, expect, it } from "vitest";
import en from "@/i18n/translations/en.json";
import ar from "@/i18n/translations/ar.json";
import { translate } from "@/i18n/config";

const flat = (o: Record<string, unknown>, p = ""): Record<string, string> =>
  Object.entries(o).reduce((acc, [k, v]) => (typeof v === "string" ? { ...acc, [p + k]: v } : { ...acc, ...flat(v as Record<string, unknown>, `${p}${k}.`) }), {});
const E = flat(en), A = flat(ar);

describe("translations", () => {
  it("EN and AR define exactly the same keys", () => expect(Object.keys(A).sort()).toEqual(Object.keys(E).sort()));
  it("no empty strings", () => { for (const d of [E, A]) for (const [k, v] of Object.entries(d)) expect(v.trim(), k).not.toBe(""); });
  it("placeholders match", () => {
    const ph = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort();
    for (const k of Object.keys(E)) expect(ph(A[k]), k).toEqual(ph(E[k]));
  });
  it("Arabic strings really are Arabic where expected", () => expect(A["hero.cta"]).toMatch(/[\u0600-\u06FF]/));
  it("translate() interpolates and falls back to the key", () => {
    expect(translate("en", "upload.words", { count: 5 })).toBe("Words detected: 5");
    expect(translate("ar", "upload.words", { count: 5 })).toContain("5");
    expect(translate("en", "nope.key" as never)).toBe("nope.key");
  });
});
