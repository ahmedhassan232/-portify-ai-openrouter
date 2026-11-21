/* eslint-disable @next/next/no-img-element */
import type { ReactNode } from "react";
import { Menu } from "lucide-react";
import { translate, type Lang, type TKey } from "@/i18n/config";
import { displayUrl, safeImg, safeUrl } from "@/lib/utils/url";
import { orderedKeys } from "@/lib/portfolio";
import type { PortfolioData, PortfolioSettings } from "@/schemas/portfolio";

export interface TemplateProps { data: PortfolioData; settings: PortfolioSettings; lang: Lang; mode?: "live" | "export"; alt?: { lang: Lang; href: string } }
export interface Ctx { data: PortfolioData; settings: PortfolioSettings; lang: Lang; mode: "live" | "export"; alt?: TemplateProps["alt"]; t: (k: TKey) => string }
export const makeCtx = (p: TemplateProps): Ctx => ({ data: p.data, settings: p.settings, lang: p.lang, mode: p.mode ?? "live", alt: p.alt, t: (k) => translate(p.lang, k) });
export const wrap = (s: PortfolioSettings, narrow: string, wide: string) => (s.width === "compact" ? narrow : wide);

export interface Variants { experience: "timeline" | "cards" | "rows" | "compact"; projects: "grid" | "list" | "feature" | "gallery" | "bento"; skills: "chips" | "columns" | "inline" | "grouped"; education: "list" | "cards" | "rows" }
export interface Style { section: string; h2: string }

// ---------- section bookkeeping
export const anchor = (k: string) => k.replace(":", "-");
export function hasContent(k: string, d: PortfolioData): boolean {
  switch (k) {
    case "summary": return !!d.professionalSummary.trim();
    case "skills": return d.skills.technical.length + d.skills.soft.length + d.skills.tools.length > 0;
    case "experience": return d.experience.length > 0;
    case "projects": return d.projects.length > 0;
    case "education": return d.education.length > 0;
    case "certifications": return d.certifications.length > 0;
    case "languages": return d.languages.length > 0;
    case "additional": return d.additionalInformation.length > 0;
    default: { const c = d.customSections.find((x) => `custom:${x.id}` === k); return !!c && !!(c.title || c.body); }
  }
}
export const visibleKeys = (d: PortfolioData, s: PortfolioSettings) => orderedKeys(d, s).filter((k) => !s.hidden.includes(k) && hasContent(k, d));
export const front = (keys: string[], first: string[]) => [...first.filter((k) => keys.includes(k)), ...keys.filter((k) => !first.includes(k))];
export function titleOf(k: string, c: Ctx): string {
  if (k.startsWith("custom:")) return c.data.customSections.find((x) => `custom:${x.id}` === k)?.title || c.t("portfolio.custom");
  return c.t(`portfolio.${k}` as TKey);
}

// ---------- small parts
const Bullets = ({ items, className = "" }: { items: string[]; className?: string }) =>
  items.length ? <ul className={`mt-2 list-disc space-y-1 ps-5 text-pf-muted ${className}`}>{items.map((x, i) => <li key={i} dir="auto">{x}</li>)}</ul> : null;
const Chips = ({ items }: { items: string[] }) =>
  items.length ? <ul className="flex flex-wrap gap-1.5">{items.map((x, i) => <li key={i} dir="auto" className="rounded-full bg-pf-accent/10 px-2.5 py-0.5 text-xs font-medium text-pf-accent">{x}</li>)}</ul> : null;
function Dates({ s, e, c }: { s: string; e: string; c: Ctx }) {
  if (!s && !e) return null;
  return <span className="text-sm text-pf-muted"><bdi>{s}</bdi>{s && " – "}<bdi>{e || c.t("portfolio.present")}</bdi></span>;
}
const initials = (n: string) => n.trim().split(/\s+/).slice(0, 2).map((w) => Array.from(w)[0] ?? "").join("").toUpperCase();
export function Avatar({ c, className = "" }: { c: Ctx; className?: string }) {
  const name = c.data.personalInfo.fullName, src = safeImg(c.data.personalInfo.profileImage);
  if (src) return <img src={src} alt={name} className={`object-cover ${className}`} />;
  return <div aria-hidden className={`grid place-items-center bg-pf-accent font-pfh font-bold text-pf-on ${className}`}>{initials(name) || "•"}</div>;
}
interface Item { key: string; text: string; href?: string; tech: boolean }
export function contactItems(c: Ctx): Item[] {
  const p = c.data.personalInfo, out: Item[] = [];
  if (p.email) out.push({ key: "email", text: p.email, href: `mailto:${p.email}`, tech: true });
  if (p.phone) out.push({ key: "phone", text: p.phone, href: `tel:${p.phone.replace(/[^\d+]/g, "")}`, tech: true });
  if (p.location) out.push({ key: "loc", text: p.location, tech: false });
  for (const [k, u] of [["web", p.website], ["in", p.linkedin], ["gh", p.github]] as const) { const h = safeUrl(u); if (h) out.push({ key: k, text: displayUrl(h), href: h, tech: true }); }
  for (const l of c.data.socialLinks) { const h = safeUrl(l.url); if (h) out.push({ key: l.id, text: l.label || displayUrl(h), href: h, tech: !l.label }); }
  return out;
}
export function ContactList({ c, className = "", itemClass = "" }: { c: Ctx; className?: string; itemClass?: string }) {
  const items = contactItems(c);
  if (!items.length) return null;
  return (
    <ul className={className}>
      {items.map((i) => {
        const inner = i.tech ? <bdi dir="ltr">{i.text}</bdi> : <span dir="auto">{i.text}</span>;
        return <li key={i.key} className={itemClass}>{i.href ? <a href={i.href} {...(i.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="hover:text-pf-accent">{inner}</a> : inner}</li>;
      })}
    </ul>
  );
}
export function ContactBlock({ c, className = "" }: { c: Ctx; className?: string }) {
  const email = c.data.personalInfo.email;
  return (
    <section id="contact" className={`scroll-mt-20 ${className}`}>
      <h2 className="font-pfh text-2xl font-semibold">{c.t("portfolio.getInTouch")}</h2>
      {email && <a href={`mailto:${email}`} className="mt-4 inline-flex rounded-xl bg-pf-accent px-5 py-2.5 font-medium text-pf-on">{c.t("portfolio.contact")}</a>}
      <ContactList c={c} className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-pf-muted" />
      <p className="mt-10 text-xs text-pf-muted"><bdi>© {new Date().getFullYear()}</bdi> <bdi dir="auto">{c.data.personalInfo.fullName}</bdi></p>
    </section>
  );
}
export function TopNav({ c, className = "" }: { c: Ctx; className?: string }) {
  const items = visibleKeys(c.data, c.settings).filter((k) => k !== "summary").slice(0, 5).map((k) => ({ href: `#${anchor(k)}`, label: titleOf(k, c) }));
  items.push({ href: "#contact", label: c.t("portfolio.contact") });
  return (
    <header className={`sticky top-0 z-40 border-b border-pf-line bg-pf-bg/90 backdrop-blur ${className}`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <a href="#top" dir="auto" className="truncate font-pfh font-semibold">{c.data.personalInfo.fullName}</a>
        <nav aria-label="Primary" className="hidden items-center gap-6 text-sm text-pf-muted md:flex">
          {items.map((i) => <a key={i.href} href={i.href} className="transition-colors hover:text-pf-fg aria-[current=true]:text-pf-accent">{i.label}</a>)}
        </nav>
        <div className="flex items-center gap-2">
          {c.alt && <a href={c.alt.href} lang={c.alt.lang} className="rounded-md border border-pf-line px-2.5 py-1 text-sm hover:border-pf-accent">{c.t("portfolio.switchLabel")}</a>}
          <details className="relative md:hidden" data-pf-menu>
            <summary aria-label={c.t("portfolio.menu")} className="grid size-9 cursor-pointer place-items-center rounded-md border border-pf-line"><Menu className="size-5" /></summary>
            <div className="absolute end-0 mt-2 w-56 rounded-xl border border-pf-line bg-pf-bg p-2 shadow-lg">
              {items.map((i) => <a key={i.href} href={i.href} className="block rounded-lg px-3 py-2 text-sm hover:bg-pf-card">{i.label}</a>)}
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}

// ---------- section bodies
function Experience({ c, v }: { c: Ctx; v: Variants["experience"] }) {
  const head = (e: PortfolioData["experience"][number]) => (
    <>
      <h3 className="font-pfh text-lg font-semibold" dir="auto">{e.position}{e.position && e.company && " · "}<span className="text-pf-accent">{e.company}</span></h3>
      <div className="flex flex-wrap items-center gap-x-3"><Dates s={e.startDate} e={e.endDate} c={c} />{e.location && <span dir="auto" className="text-sm text-pf-muted">{e.location}</span>}</div>
    </>
  );
  const extra = (e: PortfolioData["experience"][number]) => (
    <>
      <Bullets items={e.description} />
      {e.achievements.length > 0 && (
        <div className="mt-3 rounded-lg bg-pf-accent/10 p-3">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-pf-accent">{c.t("portfolio.highlights")}</p>
          <Bullets items={e.achievements} className="mt-0 text-pf-fg" />
        </div>
      )}
    </>
  );
  const items = c.data.experience;
  if (v === "timeline") return <ol className="ms-2 border-s border-pf-line">{items.map((e) => <li key={e.id} className="relative pb-8 ps-6 last:pb-0"><span className="absolute -start-[6px] top-2 size-3 rounded-full bg-pf-accent" />{head(e)}{extra(e)}</li>)}</ol>;
  if (v === "cards") return <div className="grid gap-4 md:grid-cols-2">{items.map((e) => <article key={e.id} className="rounded-2xl border border-pf-line bg-pf-card p-5">{head(e)}{extra(e)}</article>)}</div>;
  if (v === "rows") return <div className="divide-y divide-pf-line">{items.map((e) => <article key={e.id} className="grid gap-2 py-6 first:pt-0 md:grid-cols-[11rem_1fr] md:gap-8"><div><Dates s={e.startDate} e={e.endDate} c={c} /></div><div><h3 className="font-pfh text-lg font-semibold" dir="auto">{e.position}</h3><p dir="auto" className="text-pf-accent">{e.company}</p>{extra(e)}</div></article>)}</div>;
  return <div className="space-y-5">{items.map((e) => <article key={e.id}>{head(e)}<Bullets items={[...e.description, ...e.achievements]} /></article>)}</div>;
}

function ProjectLinks({ p, c }: { p: PortfolioData["projects"][number]; c: Ctx }) {
  const live = safeUrl(p.projectUrl), src = safeUrl(p.githubUrl);
  if (!live && !src) return null;
  const a = "text-sm font-medium text-pf-accent hover:underline";
  return <div className="mt-3 flex gap-4">{live && <a className={a} href={live} target="_blank" rel="noopener noreferrer">{c.t("portfolio.live")}</a>}{src && <a className={a} href={src} target="_blank" rel="noopener noreferrer">{c.t("portfolio.source")}</a>}</div>;
}
function Cover({ p, className = "" }: { p: PortfolioData["projects"][number]; className?: string }) {
  const src = safeImg(p.image);
  return src ? <img src={src} alt={p.name} loading="lazy" className={`w-full object-cover ${className}`} /> : <div aria-hidden className={`grid w-full place-items-center bg-pf-accent/15 font-pfh text-5xl font-bold text-pf-accent ${className}`}>{Array.from(p.name)[0] ?? "•"}</div>;
}
const BENTO = ["md:col-span-4", "md:col-span-2", "md:col-span-2", "md:col-span-4"];
function Projects({ c, v }: { c: Ctx; v: Variants["projects"] }) {
  const items = c.data.projects;
  const body = (p: (typeof items)[number]) => (<><h3 className="font-pfh text-lg font-semibold" dir="auto">{p.name}</h3><p dir="auto" className="mt-1 text-pf-muted">{p.description}</p><div className="mt-3"><Chips items={p.technologies} /></div><ProjectLinks p={p} c={c} /></>);
  if (v === "list") return <ol className="divide-y divide-pf-line">{items.map((p, i) => <li key={p.id} className="grid gap-3 py-5 first:pt-0 sm:grid-cols-[3rem_1fr]"><span className="font-pfm text-sm text-pf-accent">{String(i + 1).padStart(2, "0")}</span><div>{body(p)}</div></li>)}</ol>;
  if (v === "gallery") return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{items.map((p) => <article key={p.id} className="group relative overflow-hidden rounded-2xl"><Cover p={p} className="aspect-[4/3]" /><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-4 text-white"><h3 className="font-pfh font-semibold" dir="auto">{p.name}</h3><p dir="auto" className="line-clamp-2 text-sm text-white/80">{p.description}</p><div className="flex gap-3 text-sm"><ProjectLinks p={p} c={c} /></div></div></article>)}</div>;
  if (v === "bento") return <div className="grid gap-4 md:grid-cols-6">{items.map((p, i) => <article key={p.id} className={`overflow-hidden rounded-2xl border border-pf-line bg-pf-card ${BENTO[i % 4]}`}><Cover p={p} className="aspect-[16/7]" /><div className="p-5">{body(p)}</div></article>)}</div>;
  if (v === "feature") {
    const [first, ...rest] = items;
    return <div className="space-y-6"><article className="grid overflow-hidden rounded-2xl border border-pf-line bg-pf-card md:grid-cols-2"><Cover p={first} className="aspect-[4/3] h-full" /><div className="p-6">{body(first)}</div></article>{rest.length > 0 && <div className="grid gap-4 sm:grid-cols-2">{rest.map((p) => <article key={p.id} className="rounded-2xl border border-pf-line p-5">{body(p)}</article>)}</div>}</div>;
  }
  return <div className="grid gap-4 sm:grid-cols-2">{items.map((p) => <article key={p.id} className="overflow-hidden rounded-2xl border border-pf-line bg-pf-card"><Cover p={p} className="aspect-[16/9]" /><div className="p-5">{body(p)}</div></article>)}</div>;
}

function Skills({ c, v }: { c: Ctx; v: Variants["skills"] }) {
  const groups = ([["technical", c.data.skills.technical], ["tools", c.data.skills.tools], ["soft", c.data.skills.soft]] as const).filter(([, a]) => a.length);
  const label = (k: string) => c.t(`portfolio.${k}` as TKey);
  const sep = c.lang === "ar" ? "، " : ", ";
  if (v === "chips") return <Chips items={groups.flatMap(([, a]) => [...a])} />;
  if (v === "inline") return <div className="space-y-2">{groups.map(([k, a]) => <p key={k} dir="auto"><span className="font-pfm text-pf-accent">{label(k)}: </span>{a.join(sep)}</p>)}</div>;
  if (v === "columns") return <div className="grid gap-6 sm:grid-cols-3">{groups.map(([k, a]) => <div key={k}><h3 className="mb-2 font-pfh font-semibold">{label(k)}</h3><ul className="space-y-1 text-pf-muted">{a.map((x, i) => <li key={i} dir="auto">{x}</li>)}</ul></div>)}</div>;
  return <div className="space-y-4">{groups.map(([k, a]) => <div key={k}><h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-pf-muted">{label(k)}</h3><Chips items={[...a]} /></div>)}</div>;
}
function Education({ c, v }: { c: Ctx; v: Variants["education"] }) {
  const item = (e: PortfolioData["education"][number]) => (<><h3 className="font-pfh font-semibold" dir="auto">{e.degree}</h3><p dir="auto" className="text-pf-accent">{e.institution}</p><Dates s={e.startDate} e={e.endDate} c={c} />{e.description && <p dir="auto" className="mt-1 text-pf-muted">{e.description}</p>}</>);
  const items = c.data.education;
  if (v === "cards") return <div className="grid gap-4 sm:grid-cols-2">{items.map((e) => <article key={e.id} className="rounded-2xl border border-pf-line bg-pf-card p-5">{item(e)}</article>)}</div>;
  if (v === "rows") return <div className="divide-y divide-pf-line">{items.map((e) => <article key={e.id} className="grid gap-2 py-5 first:pt-0 md:grid-cols-[11rem_1fr] md:gap-8"><Dates s={e.startDate} e={e.endDate} c={c} /><div><h3 className="font-pfh font-semibold" dir="auto">{e.degree}</h3><p dir="auto" className="text-pf-accent">{e.institution}</p>{e.description && <p dir="auto" className="mt-1 text-pf-muted">{e.description}</p>}</div></article>)}</div>;
  return <div className="space-y-4">{items.map((e) => <article key={e.id}>{item(e)}</article>)}</div>;
}

export function sectionBody(k: string, c: Ctx, v: Variants): ReactNode {
  const d = c.data;
  switch (k) {
    case "summary": return <p dir="auto" className="max-w-prose text-lg">{d.professionalSummary}</p>;
    case "skills": return <Skills c={c} v={v.skills} />;
    case "experience": return <Experience c={c} v={v.experience} />;
    case "projects": return <Projects c={c} v={v.projects} />;
    case "education": return <Education c={c} v={v.education} />;
    case "certifications": case "additional": return <Bullets items={k === "certifications" ? d.certifications : d.additionalInformation} className="mt-0" />;
    case "languages": return <Chips items={d.languages} />;
    default: { const s = d.customSections.find((x) => `custom:${x.id}` === k); return s ? <div className="max-w-prose space-y-3 text-pf-muted">{s.body.split(/\n+/).filter(Boolean).map((l, i) => <p key={i} dir="auto">{l}</p>)}</div> : null; }
  }
}
export function renderSection(k: string, c: Ctx, v: Variants, S: Style, bare = false): ReactNode {
  const body = sectionBody(k, c, v);
  if (!body) return null;
  if (bare) return body;
  return <section key={k} id={anchor(k)} className={`scroll-mt-20 ${S.section}`}><h2 className={S.h2}>{titleOf(k, c)}</h2>{body}</section>;
}
