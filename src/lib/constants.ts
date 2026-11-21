export const PROFESSIONS = ["software","frontend","backend","fullstack","uiux","graphic","product","marketer","creator","business","accountant","engineer","student","other"] as const;
export type ProfessionId = (typeof PROFESSIONS)[number];
export const CATEGORIES = ["developer", "designer", "marketing", "business"] as const;
export type Category = (typeof CATEGORIES)[number];
export const CATEGORY_OF: Record<ProfessionId, Category> = {
  software: "developer", frontend: "developer", backend: "developer", fullstack: "developer",
  uiux: "designer", graphic: "designer", product: "designer",
  marketer: "marketing", creator: "marketing",
  business: "business", accountant: "business", engineer: "business", student: "business", other: "business",
};
export const TEMPLATE_IDS = ["minimal-developer","modern-tech","creative-coder","dashboard-developer","student-portfolio","creative-designer","minimalist-designer","visual-showcase","corporate-marketer","growth-specialist","personal-branding","executive-portfolio","professional-corporate","modern-business"] as const;
export type TemplateId = (typeof TEMPLATE_IDS)[number];
export const MAX_FILE_BYTES = 5 * 1024 * 1024;
export const MAX_TEXT_CHARS = 60_000;
export const MIN_TEXT_CHARS = 150;
