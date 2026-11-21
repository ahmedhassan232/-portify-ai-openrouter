"use client";
import type { ReactNode } from "react";
import { ChevronDown, ChevronUp, Eye, EyeOff, Plus, Sparkles, Trash2 } from "lucide-react";
import { AreaF, ImageF, ListF, TextF } from "./forms";
import { Button } from "@/components/ui/button";
import { useProject } from "@/hooks/use-project";
import { useT } from "@/i18n/provider";
import { orderedKeys } from "@/lib/portfolio";
import type { PortfolioData, PortfolioSettings } from "@/schemas/portfolio";
import type { TKey } from "@/i18n/config";

const uid = () => crypto.randomUUID();
const AI_KEY: Record<string, string> = { summary: "summary", experience: "experience", projects: "projects", skills: "skills" };
const Item = ({ onRemove, label, children }: { onRemove: () => void; label: string; children: ReactNode }) => (
  <div className="space-y-3 rounded-xl border border-line bg-canvas/50 p-3">
    {children}
    <button type="button" onClick={onRemove} className="inline-flex items-center gap-1.5 text-xs text-red-600 hover:underline"><Trash2 className="size-3.5" />{label}</button>
  </div>
);

export function ContentPanel() {
  const { project, update } = useProject(); const t = useT();
  const d = project!.data!, s = project!.settings, pi = d.personalInfo;
  const mut = (fn: (x: PortfolioData) => void, co?: string) => update((p) => { const nd = structuredClone(p.data!); fn(nd); return { ...p, data: nd }; }, { history: true, coalesce: co });
  const mutS = (fn: (x: PortfolioSettings) => void) => update((p) => { const ns = structuredClone(p.settings); fn(ns); return { ...p, settings: ns }; }, { history: true });
  const order = orderedKeys(d, s);
  const set = (path: string, fn: (x: PortfolioData, v: string) => void) => (v: string) => mut((x) => fn(x, v), path);
  const setList = (path: string, fn: (x: PortfolioData, v: string[]) => void) => (v: string[]) => mut((x) => fn(x, v), path);
  const move = (k: string, dir: -1 | 1) => mutS((x) => { const a = [...order], i = a.indexOf(k), j = i + dir; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; x.order = a; });
  const toggle = (k: string) => mutS((x) => { x.hidden = x.hidden.includes(k) ? x.hidden.filter((h) => h !== k) : [...x.hidden, k]; });
  const f = (k: TKey) => t(k);
  const rm = t("editor.actions.removeItem");
  const add = (label: string, fn: () => void) => <Button variant="secondary" size="sm" onClick={fn}><Plus className="size-4" />{label}</Button>;

  function body(k: string): ReactNode {
    switch (k) {
      case "summary": return <AreaF label={f("editor.fields.summary")} value={d.professionalSummary} rows={6} onChange={set("summary", (x, v) => { x.professionalSummary = v; })} />;
      case "skills": return (<div className="space-y-3">
        <ListF mode="csv" label={f("portfolio.technical")} hint={f("editor.fields.itemsHint")} value={d.skills.technical} onChange={setList("sk.t", (x, v) => { x.skills.technical = v; })} />
        <ListF mode="csv" label={f("portfolio.tools")} hint={f("editor.fields.itemsHint")} value={d.skills.tools} onChange={setList("sk.o", (x, v) => { x.skills.tools = v; })} />
        <ListF mode="csv" label={f("portfolio.soft")} hint={f("editor.fields.itemsHint")} value={d.skills.soft} onChange={setList("sk.s", (x, v) => { x.skills.soft = v; })} /></div>);
      case "experience": return (<div className="space-y-3">{d.experience.map((e, i) => (
        <Item key={e.id} label={rm} onRemove={() => mut((x) => { x.experience.splice(i, 1); })}>
          <TextF label={f("editor.fields.position")} value={e.position} onChange={set(`e${e.id}p`, (x, v) => { x.experience[i].position = v; })} />
          <TextF label={f("editor.fields.company")} value={e.company} onChange={set(`e${e.id}c`, (x, v) => { x.experience[i].company = v; })} />
          <TextF label={f("editor.fields.location")} value={e.location} onChange={set(`e${e.id}l`, (x, v) => { x.experience[i].location = v; })} />
          <div className="grid grid-cols-2 gap-2">
            <TextF label={f("editor.fields.start")} value={e.startDate} onChange={set(`e${e.id}s`, (x, v) => { x.experience[i].startDate = v; })} />
            <TextF label={f("editor.fields.end")} value={e.endDate} onChange={set(`e${e.id}e`, (x, v) => { x.experience[i].endDate = v; })} />
          </div>
          <ListF mode="lines" label={f("editor.fields.description")} hint={f("editor.fields.bullets")} value={e.description} onChange={setList(`e${e.id}d`, (x, v) => { x.experience[i].description = v; })} />
          <ListF mode="lines" label={f("editor.fields.achievements")} hint={f("editor.fields.bullets")} value={e.achievements} onChange={setList(`e${e.id}a`, (x, v) => { x.experience[i].achievements = v; })} />
        </Item>))}
        {add(f("editor.actions.addItem"), () => mut((x) => { x.experience.push({ id: uid(), position: "", company: "", location: "", startDate: "", endDate: "", description: [], achievements: [] }); }))}</div>);
      case "projects": return (<div className="space-y-3">{d.projects.map((p, i) => (
        <Item key={p.id} label={rm} onRemove={() => mut((x) => { x.projects.splice(i, 1); })}>
          <TextF label={f("editor.fields.projectName")} value={p.name} onChange={set(`p${p.id}n`, (x, v) => { x.projects[i].name = v; })} />
          <AreaF label={f("editor.fields.description")} rows={3} value={p.description} onChange={set(`p${p.id}d`, (x, v) => { x.projects[i].description = v; })} />
          <ListF mode="csv" label={f("editor.fields.technologies")} hint={f("editor.fields.itemsHint")} value={p.technologies} onChange={setList(`p${p.id}t`, (x, v) => { x.projects[i].technologies = v; })} />
          <TextF tech label={f("editor.fields.projectUrl")} value={p.projectUrl} onChange={set(`p${p.id}u`, (x, v) => { x.projects[i].projectUrl = v; })} />
          <TextF tech label={f("editor.fields.githubUrl")} value={p.githubUrl} onChange={set(`p${p.id}g`, (x, v) => { x.projects[i].githubUrl = v; })} />
          <ImageF label={f("editor.fields.projectImage")} value={p.image} onChange={(v) => mut((x) => { x.projects[i].image = v; })} />
        </Item>))}
        {add(f("editor.actions.addItem"), () => mut((x) => { x.projects.push({ id: uid(), name: "", description: "", technologies: [], projectUrl: "", githubUrl: "", image: "" }); }))}</div>);
      case "education": return (<div className="space-y-3">{d.education.map((e, i) => (
        <Item key={e.id} label={rm} onRemove={() => mut((x) => { x.education.splice(i, 1); })}>
          <TextF label={f("editor.fields.degree")} value={e.degree} onChange={set(`d${e.id}g`, (x, v) => { x.education[i].degree = v; })} />
          <TextF label={f("editor.fields.institution")} value={e.institution} onChange={set(`d${e.id}i`, (x, v) => { x.education[i].institution = v; })} />
          <div className="grid grid-cols-2 gap-2">
            <TextF label={f("editor.fields.start")} value={e.startDate} onChange={set(`d${e.id}s`, (x, v) => { x.education[i].startDate = v; })} />
            <TextF label={f("editor.fields.end")} value={e.endDate} onChange={set(`d${e.id}e`, (x, v) => { x.education[i].endDate = v; })} />
          </div>
          <AreaF label={f("editor.fields.description")} rows={2} value={e.description} onChange={set(`d${e.id}d`, (x, v) => { x.education[i].description = v; })} />
        </Item>))}
        {add(f("editor.actions.addItem"), () => mut((x) => { x.education.push({ id: uid(), degree: "", institution: "", startDate: "", endDate: "", description: "" }); }))}</div>);
      case "certifications": return <ListF mode="lines" label={f("portfolio.certifications")} hint={f("editor.fields.bullets")} value={d.certifications} onChange={setList("cert", (x, v) => { x.certifications = v; })} />;
      case "languages": return <ListF mode="lines" label={f("portfolio.languages")} hint={f("editor.fields.bullets")} value={d.languages} onChange={setList("lang", (x, v) => { x.languages = v; })} />;
      case "additional": return <ListF mode="lines" label={f("portfolio.additional")} hint={f("editor.fields.bullets")} value={d.additionalInformation} onChange={setList("add", (x, v) => { x.additionalInformation = v; })} />;
      default: {
        const i = d.customSections.findIndex((c) => `custom:${c.id}` === k), c = d.customSections[i];
        if (!c) return null;
        return (<div className="space-y-3">
          <TextF label={f("editor.fields.title")} value={c.title} onChange={set(`c${c.id}t`, (x, v) => { x.customSections[i].title = v; })} />
          <AreaF label={f("editor.fields.body")} rows={5} value={c.body} onChange={set(`c${c.id}b`, (x, v) => { x.customSections[i].body = v; })} /></div>);
      }
    }
  }
  const titleOf = (k: string) => k.startsWith("custom:") ? (d.customSections.find((c) => `custom:${c.id}` === k)?.title || t("editor.sections.custom")) : t(`portfolio.${k}` as TKey);

  return (
    <div className="space-y-3">
      <details open className="rounded-2xl border border-line bg-white">
        <summary className="flex cursor-pointer items-center justify-between px-4 py-3 font-semibold">{t("editor.sections.personal")}<ChevronDown className="size-4 text-muted" /></summary>
        <div className="space-y-3 border-t border-line p-4">
          <ImageF round label={f("editor.fields.photo")} value={pi.profileImage} onChange={(v) => mut((x) => { x.personalInfo.profileImage = v; })} />
          <TextF label={f("editor.fields.fullName")} value={pi.fullName} onChange={set("pi.n", (x, v) => { x.personalInfo.fullName = v; })} />
          <TextF label={f("editor.fields.jobTitle")} value={pi.jobTitle} onChange={set("pi.j", (x, v) => { x.personalInfo.jobTitle = v; })} />
          <TextF tech type="email" label={f("editor.fields.email")} value={pi.email} onChange={set("pi.e", (x, v) => { x.personalInfo.email = v; })} />
          <TextF tech type="tel" label={f("editor.fields.phone")} value={pi.phone} onChange={set("pi.p", (x, v) => { x.personalInfo.phone = v; })} />
          <TextF label={f("editor.fields.location")} value={pi.location} onChange={set("pi.l", (x, v) => { x.personalInfo.location = v; })} />
          <TextF tech label={f("editor.fields.website")} value={pi.website} onChange={set("pi.w", (x, v) => { x.personalInfo.website = v; })} />
          <TextF tech label={f("editor.fields.linkedin")} value={pi.linkedin} onChange={set("pi.li", (x, v) => { x.personalInfo.linkedin = v; })} />
          <TextF tech label={f("editor.fields.github")} value={pi.github} onChange={set("pi.g", (x, v) => { x.personalInfo.github = v; })} />
          <p className="pt-2 text-xs font-semibold text-muted">{t("editor.sections.links")}</p>
          {d.socialLinks.map((l, i) => (
            <Item key={l.id} label={rm} onRemove={() => mut((x) => { x.socialLinks.splice(i, 1); })}>
              <TextF label={f("editor.fields.label")} value={l.label} onChange={set(`s${l.id}l`, (x, v) => { x.socialLinks[i].label = v; })} />
              <TextF tech label={f("editor.fields.url")} value={l.url} onChange={set(`s${l.id}u`, (x, v) => { x.socialLinks[i].url = v; })} />
            </Item>))}
          {add(f("editor.actions.addLink"), () => mut((x) => { x.socialLinks.push({ id: uid(), label: "", url: "" }); }))}
        </div>
      </details>

      {order.map((k, idx) => {
        const hidden = s.hidden.includes(k), custom = k.startsWith("custom:");
        const ai = d.aiImproved.includes(AI_KEY[k] ?? "-");
        const ctl = "grid size-7 place-items-center rounded-md text-muted hover:bg-black/5 disabled:opacity-30";
        return (
          <details key={k} className={`rounded-2xl border border-line bg-white ${hidden ? "opacity-60" : ""}`}>
            <summary className="flex cursor-pointer items-center gap-2 px-4 py-3">
              <span dir="auto" className="min-w-0 flex-1 truncate font-semibold">{titleOf(k)}</span>
              {ai && <span title={t("editor.actions.aiBadge")} aria-label={t("editor.actions.aiBadge")}><Sparkles className="size-4 text-brand" /></span>}
              <span className="flex items-center" onClick={(e) => e.preventDefault()}>
                <button type="button" className={ctl} disabled={idx === 0} onClick={() => move(k, -1)} title={t("editor.actions.moveUp")} aria-label={t("editor.actions.moveUp")}><ChevronUp className="size-4" /></button>
                <button type="button" className={ctl} disabled={idx === order.length - 1} onClick={() => move(k, 1)} title={t("editor.actions.moveDown")} aria-label={t("editor.actions.moveDown")}><ChevronDown className="size-4" /></button>
                <button type="button" className={ctl} onClick={() => toggle(k)} title={hidden ? t("editor.actions.show") : t("editor.actions.hide")} aria-label={hidden ? t("editor.actions.show") : t("editor.actions.hide")}>{hidden ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button>
                {custom && <button type="button" className={ctl} title={t("common.delete")} aria-label={t("common.delete")} onClick={() => mut((x) => { x.customSections = x.customSections.filter((c) => `custom:${c.id}` !== k); }) }><Trash2 className="size-4 text-red-600" /></button>}
              </span>
            </summary>
            <div className="border-t border-line p-4">{body(k)}</div>
          </details>
        );
      })}
      <div className="pt-1">{add(t("editor.actions.addCustom"), () => { const id = uid(); update((p) => { const nd = structuredClone(p.data!); nd.customSections.push({ id, title: "", body: "" }); const ns = { ...p.settings, order: [...orderedKeys(p.data!, p.settings), `custom:${id}`] }; return { ...p, data: nd, settings: ns }; }, { history: true }); })}</div>
    </div>
  );
}
