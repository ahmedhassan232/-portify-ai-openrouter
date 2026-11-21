"use client";
import Link from "next/link";
import { ArrowRight, Download, Eye, FileText, LayoutTemplate, Lock, Pencil, Sparkles, Wand2, type LucideIcon } from "lucide-react";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { ButtonLink } from "@/components/ui/button";
import { ThumbFrame } from "@/components/templates/ThumbFrame";
import { useI18n } from "@/i18n/provider";
import type { TKey } from "@/i18n/config";
import type { TemplateId } from "@/lib/constants";

const FEATURES: [string, LucideIcon][] = [["ai", Wand2], ["templates", LayoutTemplate], ["content", Sparkles], ["editor", Pencil], ["preview", Eye], ["download", Download], ["noAccount", Lock]];
const SHOWCASE: TemplateId[] = ["modern-tech", "creative-designer", "growth-specialist", "executive-portfolio"];
const EXAMPLES = ["developer", "designer", "marketing", "business"] as const;

function HeroVisual() {
  const { t } = useI18n();
  return (
    <div aria-hidden className="mx-auto flex w-full max-w-xl items-center gap-3 sm:gap-5">
      <div className="w-32 shrink-0 -rotate-3 rounded-xl border border-line bg-white p-3 shadow-md sm:w-40 sm:p-4">
        <p className="flex items-center gap-1 text-[10px] font-semibold text-muted"><FileText className="size-3" />{t("hero.cvLabel")}</p>
        <div className="mt-3 space-y-2">{[90, 65, 80, 50, 85, 60, 75].map((w, i) => <div key={i} className="h-1.5 rounded bg-line" style={{ width: `${w}%` }} />)}</div>
      </div>
      <ArrowRight className="size-6 shrink-0 text-brand rtl:-scale-x-100" />
      <div className="min-w-0 flex-1 overflow-hidden rounded-xl border border-line bg-white shadow-xl">
        <div className="flex items-center gap-1 border-b border-line px-3 py-2"><i className="size-2 rounded-full bg-line" /><i className="size-2 rounded-full bg-line" /><i className="size-2 rounded-full bg-line" /><span className="ms-2 truncate text-[10px] text-muted">{t("hero.siteLabel")}</span></div>
        <div className="bg-gradient-to-br from-brand to-brand-soft p-4"><div className="size-9 rounded-full bg-white/80" /><div className="mt-3 h-2.5 w-2/3 rounded bg-white/90" /><div className="mt-2 h-1.5 w-1/2 rounded bg-white/60" /></div>
        <div className="grid grid-cols-2 gap-2 p-3">{[0, 1, 2, 3].map((i) => <div key={i} className="h-12 rounded-lg bg-canvas ring-1 ring-line" />)}</div>
      </div>
    </div>
  );
}

export function Landing() {
  const { t, lang } = useI18n();
  const contact = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  return (
    <>
      <SiteHeader landing />
      <main id="main">
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 lg:grid-cols-[1.05fr_1fr] lg:py-24">
          <div>
            <p className="mb-4 inline-block rounded-full bg-brand/10 px-3 py-1 text-sm font-medium text-brand">{t("hero.tagline")}</p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">{t("hero.title")}</h1>
            <p className="mt-5 max-w-xl text-lg text-muted">{t("hero.sub")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/upload" size="lg">{t("hero.cta")}<ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden /></ButtonLink>
              <ButtonLink href="#templates" variant="secondary" size="lg">{t("hero.ctaSecondary")}</ButtonLink>
            </div>
            <p className="mt-6 max-w-xl text-sm text-muted">{t("hero.value")}</p>
          </div>
          <HeroVisual />
        </section>

        <section id="how" className="scroll-mt-20 bg-white py-16">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="text-center text-3xl font-bold">{t("how.title")}</h2>
            <ol className="mt-10 grid gap-6 md:grid-cols-3">
              {(["s1", "s2", "s3"] as const).map((s, i) => (
                <li key={s} className="rounded-2xl border border-line bg-canvas p-6">
                  <span className="grid size-9 place-items-center rounded-full bg-brand font-semibold text-white">{i + 1}</span>
                  <h3 className="mt-4 text-lg font-semibold">{t(`how.${s}.title` as TKey)}</h3>
                  <p className="mt-2 text-muted">{t(`how.${s}.desc` as TKey)}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16">
          <h2 className="text-center text-3xl font-bold">{t("features.title")}</h2>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(([k, Icon]) => (
              <li key={k} className="rounded-2xl border border-line bg-white p-6">
                <span className="grid size-10 place-items-center rounded-xl bg-brand/10 text-brand"><Icon className="size-5" aria-hidden /></span>
                <h3 className="mt-4 font-semibold">{t(`features.items.${k}.title` as TKey)}</h3>
                <p className="mt-1 text-sm text-muted">{t(`features.items.${k}.desc` as TKey)}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="templates" className="scroll-mt-20 bg-ink py-16 text-white">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="text-center text-3xl font-bold">{t("showcase.title")}</h2>
            <p className="mt-2 text-center text-white/70">{t("showcase.sub")}</p>
            <ul className="mt-10 grid gap-6 sm:grid-cols-2">
              {SHOWCASE.map((id) => (
                <li key={id}>
                  <ThumbFrame id={id} demoLang={lang} className="border-white/10" />
                  <p className="mt-3 font-medium">{t(`template.${id}.name` as TKey)}</p>
                  <p className="text-sm text-white/60">{t(`template.${id}.desc` as TKey)}</p>
                </li>
              ))}
            </ul>
            <div className="mt-10 text-center"><ButtonLink href="/upload" variant="secondary">{t("showcase.cta")}</ButtonLink></div>
          </div>
        </section>

        <section id="examples" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16">
          <h2 className="text-center text-3xl font-bold">{t("examples.title")}</h2>
          <p className="mt-2 text-center text-muted">{t("examples.sub")}</p>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {EXAMPLES.map((k) => (
              <li key={k} className="rounded-2xl border border-line bg-white p-6">
                <h3 className="font-semibold">{t(`examples.${k}.title` as TKey)}</h3>
                <p className="mt-2 text-sm text-muted">{t(`examples.${k}.desc` as TKey)}</p>
                <Link href="/upload" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand">{t("examples.use")}<ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden /></Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="px-5 pb-20">
          <div className="mx-auto max-w-4xl rounded-3xl bg-brand px-6 py-14 text-center text-white">
            <h2 className="text-2xl font-bold sm:text-4xl">{t("finalCta.title")}</h2>
            <ButtonLink href="/upload" size="lg" variant="secondary" className="mt-8">{t("finalCta.button")}</ButtonLink>
          </div>
        </section>
      </main>
      <footer className="border-t border-line bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 text-sm text-muted sm:flex-row">
          <p><bdi dir="ltr">© {new Date().getFullYear()} Portify AI.</bdi> {t("footer.rights")}</p>
          <nav className="flex flex-wrap justify-center gap-5">
            <a href="#how" className="hover:text-ink">{t("footer.about")}</a>
            <a href="#features" className="hover:text-ink">{t("footer.features")}</a>
            <a href="#templates" className="hover:text-ink">{t("footer.templates")}</a>
            <Link href="/privacy" className="hover:text-ink">{t("footer.privacy")}</Link>
            {contact && <a href={`mailto:${contact}`} className="hover:text-ink">{t("footer.contact")}</a>}
          </nav>
        </div>
      </footer>
    </>
  );
}
