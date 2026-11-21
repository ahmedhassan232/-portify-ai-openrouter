import type { CSSProperties } from "react";
import type { Lang } from "@/i18n/config";
import type { PortfolioSettings } from "@/schemas/portfolio";

type Pair = { heading: string; body: string; serif?: boolean };
const EN: Record<PortfolioSettings["font"], Pair> = {
  sans: { heading: "Inter", body: "Inter" },
  serif: { heading: "Newsreader", body: "Inter", serif: true },
  mono: { heading: "JetBrains Mono", body: "Inter" },
};
const AR: Record<PortfolioSettings["font"], Pair> = {
  sans: { heading: "IBM Plex Sans Arabic", body: "IBM Plex Sans Arabic" },
  serif: { heading: "Noto Naskh Arabic", body: "IBM Plex Sans Arabic", serif: true },
  mono: { heading: "Cairo", body: "IBM Plex Sans Arabic" },
};
export function fontsFor(lang: Lang, style: PortfolioSettings["font"]) {
  const p = (lang === "ar" ? AR : EN)[style];
  const fams = [...new Set([p.heading, p.body, "JetBrains Mono"])];
  const q = fams.map((n) => `family=${n.replace(/ /g, "+")}:wght@400;500;600;700`).join("&");
  return {
    heading: `"${p.heading}", ${p.serif ? "serif" : "system-ui, sans-serif"}`,
    body: `"${p.body}", system-ui, sans-serif`,
    mono: `"JetBrains Mono", ui-monospace, monospace`,
    href: `https://fonts.googleapis.com/css2?${q}&display=swap`,
  };
}
const PALETTE = {
  light: { bg: "255 255 255", fg: "17 24 39", muted: "107 114 128", card: "249 250 251", line: "229 231 235" },
  dark: { bg: "12 12 18", fg: "245 245 250", muted: "160 160 175", card: "24 24 34", line: "44 44 58" },
  tint: { bg: "250 248 255", fg: "23 22 37", muted: "115 115 138", card: "255 255 255", line: "233 231 240" },
};
const rgb = (hex: string) => { const n = parseInt(hex.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const onAccent = (hex: string) => { const [r, g, b] = rgb(hex); return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.62 ? "14 23 38" : "255 255 255"; };

export function portfolioVars(s: PortfolioSettings, lang: Lang): CSSProperties {
  const f = fontsFor(lang, s.font), p = PALETTE[s.background];
  return {
    "--pf-bg": p.bg, "--pf-fg": p.fg, "--pf-muted": p.muted, "--pf-card": p.card, "--pf-line": p.line,
    "--pf-accent": rgb(s.accent).join(" "), "--pf-on": onAccent(s.accent),
    "--pf-font": f.body, "--pf-heading": f.heading, "--pf-mono": f.mono,
  } as CSSProperties;
}
