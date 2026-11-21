import en from "./translations/en.json";
import ar from "./translations/ar.json";

export type Lang = "en" | "ar";
export const LANGS: Lang[] = ["en", "ar"];
export const DEFAULT_LANG: Lang = "en";
export const LANG_KEY = "portify:lang";
export const isLang = (x: unknown): x is Lang => x === "en" || x === "ar";
export const dirOf = (l: Lang) => (l === "ar" ? "rtl" : "ltr");

type Flatten<T, P extends string = ""> = {
  [K in keyof T & string]: T[K] extends string ? `${P}${K}` : Flatten<T[K], `${P}${K}.`>;
}[keyof T & string];
/** Every dictionary key, derived from en.json: a typo or missing key is a compile error. */
export type TKey = Flatten<typeof en>;

const dict: Record<Lang, unknown> = { en, ar };

/** Works on server and client. Portfolio templates call this with the PORTFOLIO language, not the UI language. */
export function translate(lang: Lang, key: TKey, params?: Record<string, string | number>): string {
  let v: unknown = dict[lang];
  for (const part of key.split(".")) v = (v as Record<string, unknown> | undefined)?.[part];
  let s = typeof v === "string" ? v : key;
  if (params) s = s.replace(/\{(\w+)\}/g, (_, k: string) => String(params[k] ?? `{${k}}`));
  return s;
}
