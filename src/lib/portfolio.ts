import type { AiPortfolio, PortfolioData, PortfolioSettings } from "@/schemas/portfolio";
import { TEMPLATE_IDS, type TemplateId } from "@/lib/constants";

const uid = () => crypto.randomUUID();
export const DEFAULT_ORDER = ["summary", "skills", "experience", "projects", "education", "certifications", "languages", "additional"] as const;

export function toPortfolioData(ai: AiPortfolio, prev?: PortfolioData): PortfolioData {
  const keep = <T extends { id: string }>(arr: T[] | undefined, i: number) => arr?.[i]?.id ?? uid();
  return {
    personalInfo: { ...ai.personalInfo, profileImage: prev?.personalInfo.profileImage ?? "" },
    professionalSummary: ai.professionalSummary,
    skills: ai.skills,
    experience: ai.experience.map((e, i) => ({ ...e, id: keep(prev?.experience, i) })),
    projects: ai.projects.map((p, i) => ({ ...p, id: keep(prev?.projects, i), image: prev?.projects[i]?.image ?? "" })),
    education: ai.education.map((e, i) => ({ ...e, id: keep(prev?.education, i) })),
    certifications: ai.certifications, languages: ai.languages,
    socialLinks: ai.socialLinks.map((l, i) => ({ ...l, id: keep(prev?.socialLinks, i) })),
    additionalInformation: ai.additionalInformation,
    customSections: ai.customSections.map((c, i) => ({ ...c, id: keep(prev?.customSections, i) })),
    aiImproved: prev?.aiImproved ?? [],
  };
}
/** What we send to the model: no ids, no images (they never leave the browser). */
export function toAiShape(d: PortfolioData): AiPortfolio {
  const { profileImage: _p, ...personalInfo } = d.personalInfo;
  return {
    personalInfo, professionalSummary: d.professionalSummary, skills: d.skills,
    experience: d.experience.map(({ id: _i, ...e }) => e),
    projects: d.projects.map(({ id: _i, image: _m, ...p }) => p),
    education: d.education.map(({ id: _i, ...e }) => e),
    certifications: d.certifications, languages: d.languages,
    socialLinks: d.socialLinks.map(({ id: _i, ...l }) => l),
    additionalInformation: d.additionalInformation,
    customSections: d.customSections.map(({ id: _i, ...c }) => c),
  };
}
export const skillCount = (d: PortfolioData) => d.skills.technical.length + d.skills.soft.length + d.skills.tools.length;
export function warningsOf(d: PortfolioData): string[] {
  const w: string[] = [];
  if (!d.experience.length) w.push("noExperience");
  if (!d.personalInfo.email && !d.personalInfo.phone) w.push("noContact");
  if (!skillCount(d)) w.push("noSkills");
  if (!d.projects.length) w.push("noProjects");
  return w;
}
export function emptyData(): PortfolioData {
  return toPortfolioData({
    personalInfo: { fullName: "", jobTitle: "", email: "", phone: "", location: "", website: "", linkedin: "", github: "" },
    professionalSummary: "", skills: { technical: [], soft: [], tools: [] }, experience: [], projects: [], education: [],
    certifications: [], languages: [], socialLinks: [], additionalInformation: [], customSections: [],
  });
}

export type FontStyle = PortfolioSettings["font"];
export type Background = PortfolioSettings["background"];
export function defaultSettings(template: TemplateId = "modern-tech"): PortfolioSettings {
  return { template, accent: "#6C4CF1", font: "sans", background: "light", width: "wide", order: [...DEFAULT_ORDER], hidden: [], customized: false };
}
export const isTemplateId = (x: unknown): x is TemplateId => (TEMPLATE_IDS as readonly string[]).includes(x as string);

/** Full ordered key list incl. custom sections; tolerates stale/missing keys from older backups. */
export function orderedKeys(d: PortfolioData, s: PortfolioSettings): string[] {
  const custom = d.customSections.map((c) => `custom:${c.id}`);
  const valid = new Set<string>([...DEFAULT_ORDER, ...custom]);
  const out = s.order.filter((k) => valid.has(k));
  for (const k of [...DEFAULT_ORDER, ...custom]) if (!out.includes(k)) out.push(k);
  return out;
}
