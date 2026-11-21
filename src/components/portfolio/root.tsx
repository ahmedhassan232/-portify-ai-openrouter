import type { ReactNode } from "react";
import { dirOf, type Lang } from "@/i18n/config";
import type { PortfolioSettings } from "@/schemas/portfolio";
import { fontsFor, portfolioVars } from "./theme";

/** Sets language, direction, fonts and colours for a portfolio. Pure: renders the same in the app and in the exported site. */
export function PortfolioRoot({ lang, settings, mode = "live", children }: { lang: Lang; settings: PortfolioSettings; mode?: "live" | "export"; children: ReactNode }) {
  return (
    <div id="top" data-pf-root lang={lang} dir={dirOf(lang)} style={portfolioVars(settings, lang)}
      className={`min-h-screen bg-pf-bg font-pf text-pf-fg antialiased ${lang === "ar" ? "leading-[1.85]" : "leading-relaxed"}`}>
      {mode === "live" && <link rel="stylesheet" href={fontsFor(lang, settings.font).href} precedence="default" />}
      {children}
    </div>
  );
}
