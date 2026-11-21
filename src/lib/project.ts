import type { Project, Stage } from "@/schemas/portfolio";
import { defaultSettings } from "@/lib/portfolio";
import type { Lang } from "@/i18n/config";

export const newProject = (lang: Lang = "en"): Project => ({
  version: 1, stage: "upload", profession: null, outputLang: lang, detectedLang: lang, suggestedProfession: null,
  demo: false, data: null, original: null, translations: {}, settings: defaultSettings(), updatedAt: Date.now(),
});
export const STAGE_ROUTE: Record<Stage, string> = {
  upload: "/upload", profession: "/profession", processing: "/processing", templates: "/templates", editor: "/editor",
};
