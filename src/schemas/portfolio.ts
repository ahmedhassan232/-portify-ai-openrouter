import { z } from "zod";
import { PROFESSIONS, TEMPLATE_IDS } from "@/lib/constants";

const s = z.string();
const strs = z.array(s);

/** What the model returns. Every field is required (OpenAI strict mode); empty string / [] mean "not in the CV". */
export const aiPortfolioSchema = z.object({
  personalInfo: z.object({ fullName: s, jobTitle: s, email: s, phone: s, location: s, website: s, linkedin: s, github: s }),
  professionalSummary: s,
  skills: z.object({ technical: strs, soft: strs, tools: strs }),
  experience: z.array(z.object({ position: s, company: s, location: s, startDate: s, endDate: s, description: strs, achievements: strs })),
  projects: z.array(z.object({ name: s, description: s, technologies: strs, projectUrl: s, githubUrl: s })),
  education: z.array(z.object({ degree: s, institution: s, startDate: s, endDate: s, description: s })),
  certifications: strs,
  languages: strs,
  socialLinks: z.array(z.object({ label: s, url: s })),
  additionalInformation: strs,
  customSections: z.array(z.object({ title: s, body: s })),
});
export type AiPortfolio = z.infer<typeof aiPortfolioSchema>;

const id = z.string().min(1).max(64);
/** What we store and render: AI shape + stable ids + user-added images. */
export const portfolioDataSchema = z.object({
  personalInfo: aiPortfolioSchema.shape.personalInfo.extend({ profileImage: s.max(1_500_000) }),
  professionalSummary: s,
  skills: aiPortfolioSchema.shape.skills,
  experience: z.array(aiPortfolioSchema.shape.experience.element.extend({ id })).max(40),
  projects: z.array(aiPortfolioSchema.shape.projects.element.extend({ id, image: s.max(1_500_000) })).max(40),
  education: z.array(aiPortfolioSchema.shape.education.element.extend({ id })).max(20),
  certifications: strs,
  languages: strs,
  socialLinks: z.array(aiPortfolioSchema.shape.socialLinks.element.extend({ id })).max(20),
  additionalInformation: strs,
  customSections: z.array(aiPortfolioSchema.shape.customSections.element.extend({ id })).max(20),
  aiImproved: z.array(s).default([]),
});
export type PortfolioData = z.infer<typeof portfolioDataSchema>;

export const settingsSchema = z.object({
  template: z.enum(TEMPLATE_IDS),
  accent: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  font: z.enum(["sans", "serif", "mono"]),
  background: z.enum(["light", "dark", "tint"]),
  width: z.enum(["compact", "wide"]),
  order: z.array(s),
  hidden: z.array(s),
  customized: z.boolean(),
});
export type PortfolioSettings = z.infer<typeof settingsSchema>;

export const STAGES = ["upload", "profession", "processing", "templates", "editor"] as const;
export const projectSchema = z.object({
  version: z.literal(1),
  stage: z.enum(STAGES),
  profession: z.enum(PROFESSIONS).nullable(),
  outputLang: z.enum(["en", "ar"]),
  detectedLang: z.enum(["en", "ar"]),
  suggestedProfession: z.enum(PROFESSIONS).nullable(),
  demo: z.boolean(),
  data: portfolioDataSchema.nullable(),
  original: portfolioDataSchema.nullable(),
  translations: z.object({ en: portfolioDataSchema.optional(), ar: portfolioDataSchema.optional() }),
  settings: settingsSchema,
  updatedAt: z.number(),
});
export type Project = z.infer<typeof projectSchema>;
export type Stage = (typeof STAGES)[number];
