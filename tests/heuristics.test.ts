import { describe, expect, it } from "vitest";
import { detectLanguage, suggestProfession, wordCount } from "@/lib/cv-parser/heuristics";
import { safeImg, safeUrl } from "@/lib/utils/url";

describe("cv heuristics", () => {
  it("detects Arabic, English and mixed text", () => {
    expect(detectLanguage("مهندس برمجيات لديه خبرة في تطوير الواجهات")).toBe("ar");
    expect(detectLanguage("Software engineer with five years of experience")).toBe("en");
    expect(detectLanguage("Senior engineer React TypeScript Node.js AWS مهندس")).toBe("en");
  });
  it("suggests a profession from keywords (EN + AR)", () => {
    expect(suggestProfession("React, Tailwind, CSS, HTML, Next.js frontend work")).toBe("frontend");
    expect(suggestProfession("React CSS frontend and Node.js SQL backend Postgres")).toBe("fullstack");
    expect(suggestProfession("خبرة في التسويق وإدارة حملات وتحليلات")).toBe("marketer");
    expect(suggestProfession("hello world")).toBeNull();
  });
  it("counts words", () => expect(wordCount(" a  b\nc ")).toBe(3));
});
describe("url safety", () => {
  it("blocks script and data URLs", () => {
    expect(safeUrl("javascript:alert(1)")).toBe("");
    expect(safeUrl("github.com/x")).toBe("https://github.com/x");
    expect(safeImg("javascript:alert(1)")).toBe("");
    expect(safeImg("data:image/png;base64,AAAA")).toContain("data:image/png");
  });
});
