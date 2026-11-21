import type { Config } from "tailwindcss";
import { sharedTheme } from "./tailwind.shared";
const config: Config = { content: ["./src/**/*.{ts,tsx}"], theme: sharedTheme };
export default config;
