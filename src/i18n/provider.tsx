"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { DEFAULT_LANG, LANG_KEY, dirOf, isLang, translate, type Lang, type TKey } from "./config";

interface I18n { lang: Lang; dir: "ltr" | "rtl"; setLang: (l: Lang) => void; t: (k: TKey, p?: Record<string, string | number>) => string }
const Ctx = createContext<I18n | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);
  const pathname = usePathname();

  useEffect(() => {
    try { const s = localStorage.getItem(LANG_KEY); if (isLang(s)) setLangState(s); } catch { /* storage blocked */ }
    document.documentElement.setAttribute("data-lang-ready", "");
  }, []);

  useEffect(() => {
    if (pathname === "/frame") return; // the preview frame sets the PORTFOLIO language itself
    document.documentElement.lang = lang;
    document.documentElement.dir = dirOf(lang);
  }, [lang, pathname]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(LANG_KEY, l); } catch { /* ignore */ }
  }, []);

  const value = useMemo<I18n>(() => ({ lang, dir: dirOf(lang), setLang, t: (k, p) => translate(lang, k, p) }), [lang, setLang]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useI18n outside I18nProvider");
  return c;
}
export const useT = () => useI18n().t;
