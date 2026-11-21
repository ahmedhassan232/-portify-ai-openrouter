import type { ReactElement } from "react";
import type { Category, TemplateId } from "@/lib/constants";
import type { PortfolioSettings } from "@/schemas/portfolio";
import type { TemplateProps } from "@/components/portfolio/blocks";
import { MinimalDeveloper } from "./developer/MinimalDeveloper";
import { ModernTech } from "./developer/ModernTech";
import { CreativeCoder } from "./developer/CreativeCoder";
import { CreativeDesigner } from "./designer/CreativeDesigner";
import { MinimalistDesigner } from "./designer/MinimalistDesigner";
import { VisualShowcase } from "./designer/VisualShowcase";
import { CorporateMarketer } from "./marketing/CorporateMarketer";
import { GrowthSpecialist } from "./marketing/GrowthSpecialist";
import { PersonalBranding } from "./marketing/PersonalBranding";
import { ExecutivePortfolio } from "./business/ExecutivePortfolio";
import { ProfessionalCorporate } from "./business/ProfessionalCorporate";
import { ModernBusiness } from "./business/ModernBusiness";

type Defaults = Pick<PortfolioSettings, "accent" | "font" | "background">;
export interface TemplateMeta { id: TemplateId; category: Category; Component: (p: TemplateProps) => ReactElement; defaults: Defaults }
export const TEMPLATES: TemplateMeta[] = [
  { id: "minimal-developer", category: "developer", Component: MinimalDeveloper, defaults: { accent: "#059669", font: "mono", background: "light" } },
  { id: "modern-tech", category: "developer", Component: ModernTech, defaults: { accent: "#6C4CF1", font: "sans", background: "tint" } },
  { id: "creative-coder", category: "developer", Component: CreativeCoder, defaults: { accent: "#22D3EE", font: "mono", background: "dark" } },
  { id: "creative-designer", category: "designer", Component: CreativeDesigner, defaults: { accent: "#F43F5E", font: "sans", background: "light" } },
  { id: "minimalist-designer", category: "designer", Component: MinimalistDesigner, defaults: { accent: "#111827", font: "serif", background: "light" } },
  { id: "visual-showcase", category: "designer", Component: VisualShowcase, defaults: { accent: "#F59E0B", font: "sans", background: "dark" } },
  { id: "corporate-marketer", category: "marketing", Component: CorporateMarketer, defaults: { accent: "#0284C7", font: "sans", background: "light" } },
  { id: "growth-specialist", category: "marketing", Component: GrowthSpecialist, defaults: { accent: "#EA580C", font: "sans", background: "tint" } },
  { id: "personal-branding", category: "marketing", Component: PersonalBranding, defaults: { accent: "#8B5CF6", font: "serif", background: "tint" } },
  { id: "executive-portfolio", category: "business", Component: ExecutivePortfolio, defaults: { accent: "#1E3A8A", font: "serif", background: "light" } },
  { id: "professional-corporate", category: "business", Component: ProfessionalCorporate, defaults: { accent: "#0F766E", font: "sans", background: "light" } },
  { id: "modern-business", category: "business", Component: ModernBusiness, defaults: { accent: "#6C4CF1", font: "sans", background: "light" } },
];
export const getTemplate = (id: TemplateId) => TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[1];
export function TemplateRenderer({ id, ...props }: TemplateProps & { id: TemplateId }) {
  const { Component } = getTemplate(id);
  return <Component {...props} />;
}
/** Switching templates keeps content; look-and-feel defaults apply only until the user customizes colours/fonts. */
export function settingsForTemplate(s: PortfolioSettings, id: TemplateId): PortfolioSettings {
  return s.customized ? { ...s, template: id } : { ...s, template: id, ...getTemplate(id).defaults };
}
