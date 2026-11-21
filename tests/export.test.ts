import { describe, expect, it } from "vitest";
import { buildPortfolioFiles, buildSingleHtml } from "@/lib/export/build";
import { newProject } from "@/lib/project";
import { demoData } from "@/lib/demo";
import { defaultSettings } from "@/lib/portfolio";

const GIF = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
const PNG = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
const base = (lang: "en" | "ar") => { const d = demoData(lang); d.projects[0].image = GIF; d.personalInfo.profileImage = PNG; return { ...newProject(lang), outputLang: lang, data: d, settings: defaultSettings("modern-business") }; };
const CSS = "/* tailwind */".repeat(50);

describe("standalone export", () => {
  it("produces a complete static site with correct lang/dir and UTF-8", async () => {
    const f = await buildPortfolioFiles(base("ar"), CSS);
    expect(Object.keys(f).sort()).toEqual(["README.md", "assets/profile-image.png", "assets/project-images/project-1.gif", "index.html", "script.js", "styles.css"]);
    const html = f["index.html"] as string;
    expect(html).toContain('<html lang="ar" dir="rtl">'); expect(html).toContain('<meta charset="utf-8">');
    expect(html).toContain("IBM+Plex+Sans+Arabic"); expect(html).toContain('href="styles.css"'); expect(html).toContain('src="script.js"');
    expect(html).toContain("assets/profile-image.png"); expect(html).not.toContain("data:image");
    expect(html).not.toContain('href="index-en.html"'); // no toggle without a second version
  });
  it("adds a language toggle only when both versions exist", async () => {
    const p = base("en"); p.translations = { ar: demoData("ar") };
    const f = await buildPortfolioFiles(p, CSS);
    expect(f["index.html"] as string).toContain('href="index-ar.html"');
    expect(f["index-ar.html"] as string).toContain('<html lang="ar" dir="rtl">');
    expect(f["index-ar.html"] as string).toContain('href="index.html"');
  });
  it("contains no API keys or app dependencies", async () => {
    const all = Object.values(await buildPortfolioFiles(base("en"), CSS)).filter((v): v is string => typeof v === "string").join("\n");
    expect(all).not.toMatch(/OPENAI|sk-[A-Za-z0-9]{10}|\/_next\//);
  });
  it("single-file HTML inlines css, js and images", async () => {
    const h = await (await buildSingleHtml(base("en"), CSS)).text();
    expect(h).toContain("<style>"); expect(h).toContain("<script>"); expect(h).toContain("data:image/png");
  });
});
