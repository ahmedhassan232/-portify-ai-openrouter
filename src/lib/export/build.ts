import JSZip from "jszip";
import { createElement } from "react";
import { dirOf, type Lang } from "@/i18n/config";
import { fontsFor } from "@/components/portfolio/theme";
import { TemplateRenderer } from "@/templates/registry";
import type { PortfolioData, Project } from "@/schemas/portfolio";
import { PF_SCRIPT } from "./script";

export type ExportFiles = Record<string, string | Uint8Array>;
interface Version { lang: Lang; data: PortfolioData }

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function versionsOf(p: Project): Version[] {
  const primary: Version = { lang: p.outputLang, data: p.data! };
  const other: Lang = p.outputLang === "en" ? "ar" : "en";
  const o = p.translations[other];
  return o ? [primary, { lang: other, data: o }] : [primary];
}
export const fileName = (lang: Lang, primary: boolean) => (primary ? "index.html" : `index-${lang}.html`);

function decode(u: string): { bytes: Uint8Array; ext: string } | null {
  const m = /^data:image\/(png|jpe?g|webp|gif);base64,(.+)$/.exec(u);
  if (!m) return null;
  const bin = atob(m[2]);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return { bytes, ext: m[1] === "jpeg" ? "jpg" : m[1] };
}
/** Moves embedded images into assets/ and rewrites references to relative paths. */
function externalize(data: PortfolioData, files: ExportFiles, cache: Map<string, string>, counter: { n: number }): PortfolioData {
  const out = structuredClone(data);
  const put = (src: string, name: (ext: string) => string) => {
    if (!src) return "";
    const hit = cache.get(src); if (hit) return hit;
    const d = decode(src); if (!d) return src.startsWith("https://") ? src : "";
    const path = name(d.ext); files[path] = d.bytes; cache.set(src, path); return path;
  };
  out.personalInfo.profileImage = put(out.personalInfo.profileImage, (e) => `assets/profile-image.${e}`);
  out.projects.forEach((p) => { p.image = put(p.image, (e) => `assets/project-images/project-${++counter.n}.${e}`); });
  return out;
}

function html(o: { lang: Lang; title: string; desc: string; body: string; font: string; css?: string; js?: string }) {
  return `<!doctype html>
<html lang="${o.lang}" dir="${dirOf(o.lang)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(o.title)}</title>
<meta name="description" content="${esc(o.desc)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${o.font}">
${o.css ? `<style>${o.css}</style>` : `<link rel="stylesheet" href="styles.css">`}
</head>
<body>
${o.body}
${o.js ? `<script>${o.js}</script>` : `<script src="script.js" defer></script>`}
</body>
</html>
`;
}
const meta = (d: PortfolioData) => ({
  title: [d.personalInfo.fullName, d.personalInfo.jobTitle].filter(Boolean).join(" – ") || "Portfolio",
  desc: d.professionalSummary.slice(0, 160),
});
async function render(p: Project, v: Version, data: PortfolioData, alt?: { lang: Lang; href: string }) {
  const { renderToStaticMarkup } = await import("react-dom/server");
  return renderToStaticMarkup(createElement(TemplateRenderer, { id: p.settings.template, data, settings: p.settings, lang: v.lang, mode: "export", alt }));
}
const README = (langs: Lang[]) => `# Portfolio website

Built with Portify AI. This folder is a complete static website: it does not depend on Portify AI.

## Open it
Double-click \`index.html\`, or upload the whole folder to any static host (Netlify, Vercel, GitHub Pages, Cloudflare Pages...).

## Files
- \`index.html\`${langs.length > 1 ? `, \`index-${langs[1]}.html\` (language versions with a toggle)` : ""}
- \`styles.css\`, \`script.js\`
- \`assets/\`: your images

Fonts load from Google Fonts when online and fall back to system fonts offline.

---

# موقع معرض الأعمال

أُنشئ بواسطة Portify AI. هذا المجلد موقع ثابت كامل ولا يعتمد على Portify AI.

افتح \`index.html\` مباشرة أو ارفع المجلد كاملًا إلى أي استضافة ثابتة. تُحمَّل الخطوط من Google Fonts عند الاتصال، وتُستخدم خطوط النظام دون اتصال.
`;

/** All files of the standalone site (testable without JSZip/Blob). */
export async function buildPortfolioFiles(project: Project, css: string): Promise<ExportFiles> {
  if (!project.data) throw new Error("no_data");
  const files: ExportFiles = {};
  const cache = new Map<string, string>(), counter = { n: 0 };
  const vs = versionsOf(project);
  for (let i = 0; i < vs.length; i++) {
    const v = vs[i], other = vs[1 - i];
    const data = externalize(v.data, files, cache, counter);
    const alt = other ? { lang: other.lang, href: fileName(other.lang, i === 1) } : undefined;
    const m = meta(v.data);
    files[fileName(v.lang, i === 0)] = html({ lang: v.lang, ...m, body: await render(project, v, data, alt), font: fontsFor(v.lang, project.settings.font).href });
  }
  files["styles.css"] = css; files["script.js"] = PF_SCRIPT; files["README.md"] = README(vs.map((v) => v.lang));
  return files;
}
export async function buildPortfolioZip(project: Project, css: string): Promise<Blob> {
  const files = await buildPortfolioFiles(project, css);
  const zip = new JSZip(), root = zip.folder("portfolio")!;
  for (const [path, content] of Object.entries(files)) root.file(path, content);
  return zip.generateAsync({ type: "blob", compression: "DEFLATE" });
}
/** One self-contained file: CSS, JS and images inlined. */
export async function buildSingleHtml(project: Project, css: string): Promise<Blob> {
  if (!project.data) throw new Error("no_data");
  const v = versionsOf(project)[0];
  const body = await render(project, v, v.data);
  return new Blob([html({ lang: v.lang, ...meta(v.data), body, font: fontsFor(v.lang, project.settings.font).href, css, js: PF_SCRIPT })], { type: "text/html" });
}
export async function loadExportCss(): Promise<string> {
  const r = await fetch("/export/portfolio.css").catch(() => null);
  const css = r && r.ok ? await r.text() : "";
  if (css.length < 500) throw new Error("css_missing");
  return css;
}
