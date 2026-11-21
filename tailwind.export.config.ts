import type { Config } from "tailwindcss";
import { sharedTheme } from "./tailwind.shared";
// Only portfolio code is scanned, so the exported styles.css stays small and app-independent.
const config: Config = {
  content: ["./src/templates/**/*.{ts,tsx}", "./src/components/portfolio/**/*.{ts,tsx}"],
  theme: sharedTheme,
};
export default config;
