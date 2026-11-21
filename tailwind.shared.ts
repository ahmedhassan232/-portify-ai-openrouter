import type { Config } from "tailwindcss";

// Shared by the app build and the standalone-export stylesheet build.
// Logical utilities (ms-/me-/ps-/pe-/start-/end-/text-start) are used everywhere so RTL needs no overrides.
const pf = (n: string) => `rgb(var(--pf-${n}) / <alpha-value>)`;
export const sharedTheme: NonNullable<Config["theme"]> = {
  extend: {
    colors: {
      brand: "#6C4CF1", "brand-soft": "#A78BFA", canvas: "#FAFAFC", ink: "#171625", muted: "#73738A", line: "#E9E7F0",
      pf: { bg: pf("bg"), fg: pf("fg"), muted: pf("muted"), card: pf("card"), line: pf("line"), accent: pf("accent"), on: pf("on") },
    },
    fontFamily: {
      pf: ["var(--pf-font)"], pfh: ["var(--pf-heading)"], pfm: ["var(--pf-mono)"],
    },
  },
};
