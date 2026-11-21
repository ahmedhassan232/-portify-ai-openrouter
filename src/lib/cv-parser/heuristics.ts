import { PROFESSIONS, type ProfessionId } from "@/lib/constants";
import type { Lang } from "@/i18n/config";

export function detectLanguage(text: string): Lang {
  const ar = (text.match(/[\u0600-\u06FF]/g) ?? []).length;
  const latin = (text.match(/[A-Za-z]/g) ?? []).length;
  return ar > 0 && ar / (ar + latin) > 0.3 ? "ar" : "en";
}
export const wordCount = (t: string) => t.split(/\s+/).filter(Boolean).length;

const KW: Record<ProfessionId, string[]> = {
  frontend: ["react", "vue", "angular", "css", "html", "tailwind", "frontend", "front-end", "next.js", "واجهات"],
  backend: ["node.js", "django", "spring", "sql", "backend", "back-end", "postgres", "microservices", "rest api", "خلفية"],
  fullstack: ["full stack", "full-stack", "fullstack", "mern", "شامل"],
  software: ["software", "developer", "programmer", "github", "java", "python", "c++", "مطور", "برمج"],
  uiux: ["figma", "ux", "wireframe", "prototype", "user research", "تجربة المستخدم", "واجهة المستخدم"],
  graphic: ["photoshop", "illustrator", "indesign", "branding", "logo", "graphic", "جرافيك", "هوية بصرية"],
  product: ["product design", "design system", "product designer", "مصمم منتجات"],
  marketer: ["seo", "campaign", "google ads", "facebook ads", "analytics", "marketing", "تسويق", "حملات"],
  creator: ["content creator", "youtube", "tiktok", "instagram", "podcast", "copywriting", "محتوى"],
  accountant: ["accounting", "audit", "ifrs", "bookkeeping", "tax", "محاسب", "مراجعة", "ضرائب"],
  engineer: ["engineer", "autocad", "mechanical", "civil", "electrical", "solidworks", "مهندس", "هندسة"],
  student: ["student", "graduate", "gpa", "internship", "طالب", "خريج", "تدريب"],
  business: ["management", "strategy", "operations", "stakeholder", "sales", "إدارة", "مبيعات"],
  other: [],
};
const count = (hay: string, needle: string) => hay.split(needle).length - 1;

/** Cheap keyword suggestion; the user always makes the final choice. */
export function suggestProfession(text: string): ProfessionId | null {
  const low = text.toLowerCase();
  const score = Object.fromEntries(PROFESSIONS.map((p) => [p, KW[p].reduce((n, k) => n + count(low, k), 0)])) as Record<ProfessionId, number>;
  if (score.frontend >= 2 && score.backend >= 2) return "fullstack";
  const best = PROFESSIONS.filter((p) => p !== "other").sort((a, b) => score[b] - score[a])[0];
  return score[best] >= 2 ? best : null;
}
