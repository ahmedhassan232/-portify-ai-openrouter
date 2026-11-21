import type { AiPortfolio } from "@/schemas/portfolio";

const sameLen = <T,>(a: T[], b: T[] | undefined) => !!b && a.length === b.length;
const pickStrs = (orig: string[], next: string[] | undefined) => (sameLen(orig, next) ? next! : orig);
const str = (orig: string, next: string | undefined) => (next && next.trim() ? next : orig);

/** The model may only reword. Anything structural or factual is taken from the original. */
export function mergeImproved(orig: AiPortfolio, imp: AiPortfolio): AiPortfolio {
  const out = structuredClone(orig);
  out.professionalSummary = str(orig.professionalSummary, imp.professionalSummary);
  out.experience = orig.experience.map((e, i) => ({
    ...e, description: pickStrs(e.description, imp.experience[i]?.description), achievements: pickStrs(e.achievements, imp.experience[i]?.achievements),
  }));
  out.projects = orig.projects.map((p, i) => ({ ...p, description: str(p.description, imp.projects[i]?.description) }));
  // Re-grouping skills is allowed only if no skill was added.
  const known = new Set([...orig.skills.technical, ...orig.skills.soft, ...orig.skills.tools].map((x) => x.toLowerCase()));
  const all = [...imp.skills.technical, ...imp.skills.soft, ...imp.skills.tools];
  if (all.length && all.every((x) => known.has(x.toLowerCase()))) out.skills = imp.skills;
  return out;
}
/** Translation: take translated prose, keep names, tech, dates and URLs from the original. */
export function mergeTranslated(orig: AiPortfolio, tr: AiPortfolio): AiPortfolio {
  const out = structuredClone(orig);
  out.personalInfo.jobTitle = str(orig.personalInfo.jobTitle, tr.personalInfo.jobTitle);
  out.personalInfo.location = str(orig.personalInfo.location, tr.personalInfo.location);
  out.professionalSummary = str(orig.professionalSummary, tr.professionalSummary);
  out.skills = { technical: orig.skills.technical, tools: orig.skills.tools, soft: pickStrs(orig.skills.soft, tr.skills.soft) };
  out.experience = orig.experience.map((e, i) => ({
    ...e, position: str(e.position, tr.experience[i]?.position), location: str(e.location, tr.experience[i]?.location),
    description: pickStrs(e.description, tr.experience[i]?.description), achievements: pickStrs(e.achievements, tr.experience[i]?.achievements),
  }));
  out.projects = orig.projects.map((p, i) => ({ ...p, description: str(p.description, tr.projects[i]?.description) }));
  out.education = orig.education.map((e, i) => ({ ...e, degree: str(e.degree, tr.education[i]?.degree), description: str(e.description, tr.education[i]?.description) }));
  out.languages = pickStrs(orig.languages, tr.languages);
  out.additionalInformation = pickStrs(orig.additionalInformation, tr.additionalInformation);
  out.customSections = orig.customSections.map((c, i) => ({ title: str(c.title, tr.customSections[i]?.title), body: str(c.body, tr.customSections[i]?.body) }));
  return out;
}
export function changedSections(a: AiPortfolio, b: AiPortfolio): string[] {
  const j = JSON.stringify;
  const out: string[] = [];
  if (a.professionalSummary !== b.professionalSummary) out.push("summary");
  if (j(a.experience) !== j(b.experience)) out.push("experience");
  if (j(a.projects) !== j(b.projects)) out.push("projects");
  if (j(a.skills) !== j(b.skills)) out.push("skills");
  return out;
}
