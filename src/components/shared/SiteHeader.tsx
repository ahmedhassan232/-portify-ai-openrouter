"use client";
import Link from "next/link";
import { ArrowRight, Menu, Sparkles } from "lucide-react";
import { useT } from "@/i18n/provider";
import { LangSwitch } from "./LangSwitch";
import { buttonClass } from "@/components/ui/button";
import type { TKey } from "@/i18n/config";

const LINKS: [string, TKey][] = [["#features", "nav.features"], ["#how", "nav.how"], ["#templates", "nav.templates"], ["#examples", "nav.examples"]];

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 font-semibold">
      <span className="grid size-8 place-items-center rounded-lg bg-brand text-white"><Sparkles className="size-4" aria-hidden /></span>
      <span dir="ltr">Portify AI</span>
    </Link>
  );
}
export function SiteHeader({ landing = false }: { landing?: boolean }) {
  const t = useT();
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/85 backdrop-blur">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:start-2 focus:top-2 focus:rounded focus:bg-white focus:p-2">{t("common.skip")}</a>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <Logo />
        {landing && (
          <nav className="hidden items-center gap-7 text-sm text-muted md:flex">
            {LINKS.map(([h, k]) => <a key={h} href={h} className="hover:text-ink">{t(k)}</a>)}
          </nav>
        )}
        <div className="flex items-center gap-2">
          <LangSwitch className="hidden sm:inline-flex" />
          <Link href="/upload" className={buttonClass("primary", "sm", "hidden sm:inline-flex")}>{t("nav.getStarted")}<ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden /></Link>
          <details className="relative md:hidden">
            <summary aria-label={t("nav.menu")} className="grid size-9 cursor-pointer place-items-center rounded-lg border border-line bg-white"><Menu className="size-5" /></summary>
            <div className="absolute end-0 mt-2 w-60 space-y-1 rounded-xl border border-line bg-white p-3 shadow-lg">
              {landing && LINKS.map(([h, k]) => <a key={h} href={h} className="block rounded-lg px-3 py-2 text-sm hover:bg-black/5">{t(k)}</a>)}
              <Link href="/upload" className="block rounded-lg px-3 py-2 text-sm font-medium text-brand hover:bg-black/5">{t("nav.getStarted")}</Link>
              <LangSwitch className="mt-2 w-full justify-center" />
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
export function FlowShell({ children, wide = false }: { children: React.ReactNode; wide?: boolean }) {
  return (
    <>
      <SiteHeader />
      <main id="main" className={`mx-auto px-5 py-10 sm:py-14 ${wide ? "max-w-6xl" : "max-w-3xl"}`}>{children}</main>
    </>
  );
}
