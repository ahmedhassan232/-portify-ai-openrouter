import { describe, expect, it } from "vitest";
import { aiPortfolioSchema } from "@/schemas/portfolio";
import { emptyData, orderedKeys, toAiShape, toPortfolioData, warningsOf, defaultSettings } from "@/lib/portfolio";
import { mergeImproved, mergeTranslated, changedSections } from "@/lib/ai/merge";
import { demoData } from "@/lib/demo";

describe("AI output validation", () => {
  it("accepts a CV with almost nothing in it", () => {
    const ai = toAiShape(emptyData());
    expect(aiPortfolioSchema.safeParse(ai).success).toBe(true);
    expect(warningsOf(emptyData())).toEqual(["noExperience", "noContact", "noSkills", "noProjects"]);
  });
  it("rejects malformed model output", () => expect(aiPortfolioSchema.safeParse({ personalInfo: {} }).success).toBe(false));
  it("adds stable ids and keeps them when re-applying AI output", () => {
    const d = demoData("en"), again = toPortfolioData(toAiShape(d), d);
    expect(again.experience.map((e) => e.id)).toEqual(d.experience.map((e) => e.id));
  });
});
describe("fact-preservation guard", () => {
  const orig = toAiShape(demoData("en"));
  it("ignores changed companies, dates and new skills from the model", () => {
    const bad = structuredClone(orig);
    bad.experience[0].company = "Evil Corp"; bad.experience[0].startDate = "1999";
    bad.skills.technical.push("Quantum Basket Weaving"); bad.professionalSummary = "A better summary.";
    const m = mergeImproved(orig, bad);
    expect(m.experience[0].company).toBe(orig.experience[0].company);
    expect(m.experience[0].startDate).toBe(orig.experience[0].startDate);
    expect(m.skills).toEqual(orig.skills);
    expect(m.professionalSummary).toBe("A better summary.");
    expect(changedSections(orig, m)).toEqual(["summary"]);
  });
  it("falls back to the original when the model changes the number of bullets", () => {
    const bad = structuredClone(orig); bad.experience[0].description = ["only one"];
    expect(mergeImproved(orig, bad).experience[0].description).toEqual(orig.experience[0].description);
  });
  it("translation keeps names, tech, dates and URLs", () => {
    const ar = toAiShape(demoData("ar")), m = mergeTranslated(orig, ar);
    expect(m.experience[0].company).toBe(orig.experience[0].company);
    expect(m.skills.technical).toEqual(orig.skills.technical);
    expect(m.personalInfo.email).toBe(orig.personalInfo.email);
    expect(m.professionalSummary).toBe(ar.professionalSummary);
  });
});
describe("section ordering", () => {
  it("tolerates stale keys and appends custom sections", () => {
    const d = demoData("en"); d.customSections.push({ id: "x", title: "T", body: "B" });
    const s = { ...defaultSettings(), order: ["projects", "ghost"] };
    const k = orderedKeys(d, s);
    expect(k[0]).toBe("projects"); expect(k).not.toContain("ghost"); expect(k).toContain("custom:x");
  });
});
