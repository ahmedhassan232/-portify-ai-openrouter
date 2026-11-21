import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { TEMPLATES, TemplateRenderer, settingsForTemplate } from "@/templates/registry";
import { defaultSettings, emptyData } from "@/lib/portfolio";
import { demoData } from "@/lib/demo";

const render = (id: (typeof TEMPLATES)[number]["id"], lang: "en" | "ar", data = demoData(lang)) =>
  renderToStaticMarkup(createElement(TemplateRenderer, { id, data, settings: settingsForTemplate(defaultSettings(), id), lang, mode: "export" }));

describe.each(TEMPLATES.map((t) => t.id))("template %s", (id) => {
  it("renders English LTR", () => { const h = render(id, "en"); expect(h).toContain('dir="ltr"'); expect(h).toContain("Alex Morgan"); expect(h).toContain("Experience"); });
  it("renders Arabic RTL with Arabic labels", () => { const h = render(id, "ar"); expect(h).toContain('dir="rtl"'); expect(h).toContain("سارة الأحمد"); expect(h).toContain("الخبرات"); });
  it("does not crash on a nearly empty CV", () => expect(() => render(id, "en", emptyData())).not.toThrow());
  it("uses logical spacing only (no physical left/right utilities)", () => expect(render(id, "ar")).not.toMatch(/class="[^"]*(\b(ml|mr|pl|pr)-|\btext-(left|right)\b)/));
});
describe("settings", () => {
  it("template switch keeps customized colours", () => {
    const s = { ...defaultSettings(), customized: true, accent: "#123456" };
    expect(settingsForTemplate(s, "creative-coder").accent).toBe("#123456");
    expect(settingsForTemplate(defaultSettings(), "creative-coder").background).toBe("dark");
  });
});
