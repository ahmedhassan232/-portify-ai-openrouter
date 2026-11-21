"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Briefcase, Calculator, Cog, Code2, Ellipsis, GraduationCap, Layers, LayoutTemplate, Megaphone, Palette, PenTool, Server, Video, type LucideIcon } from "lucide-react";
import { FlowShell } from "@/components/shared/SiteHeader";
import { Button } from "@/components/ui/button";
import { useGuard, useProject } from "@/hooks/use-project";
import { useT } from "@/i18n/provider";
import { PROFESSIONS, type ProfessionId } from "@/lib/constants";
import type { Lang, TKey } from "@/i18n/config";
import { cn } from "@/lib/utils/cn";

const ICON: Record<ProfessionId, LucideIcon> = { software: Code2, frontend: LayoutTemplate, backend: Server, fullstack: Layers, uiux: PenTool, graphic: Palette, product: Box, marketer: Megaphone, creator: Video, business: Briefcase, accountant: Calculator, engineer: Cog, student: GraduationCap, other: Ellipsis };

export default function ProfessionPage() {
  const ok = useGuard("cv");
  const t = useT(); const router = useRouter();
  const { project, ready, update, cvText } = useProject();
  const [prof, setProf] = useState<ProfessionId | null>(project?.profession ?? null);
  const [lang, setLang] = useState<Lang>(project?.outputLang ?? "en");
  const loaded = ready && !!project;
  useEffect(() => { if (project) { setProf((c) => c ?? project.profession); setLang(project.outputLang); } }, [loaded]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!ok || !project) return null;

  function next() {
    const reanalyze = !!cvText;
    update((p) => ({ ...p, profession: prof, outputLang: lang, stage: reanalyze ? "processing" : "templates", ...(reanalyze ? { data: null, original: null, demo: false } : {}) }));
    router.push(reanalyze ? "/processing" : "/templates");
  }
  const detected = t(project.detectedLang === "ar" ? "profession.lang.nameAr" : "profession.lang.nameEn");
  return (
    <FlowShell wide>
      <h1 className="text-3xl font-bold">{t("profession.title")}</h1>
      <p className="mt-2 text-muted">{t("profession.sub")}</p>
      <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {PROFESSIONS.map((id) => {
          const Icon = ICON[id], on = prof === id;
          return (
            <li key={id}>
              <button type="button" aria-pressed={on} onClick={() => setProf(id)}
                className={cn("relative flex h-full w-full flex-col items-start gap-3 rounded-2xl border bg-white p-4 text-start transition", on ? "border-brand ring-2 ring-brand/30" : "border-line hover:border-brand/50")}>
                <span className={cn("grid size-10 place-items-center rounded-xl", on ? "bg-brand text-white" : "bg-brand/10 text-brand")}><Icon className="size-5" aria-hidden /></span>
                <span className="font-medium">{t(`profession.items.${id}` as TKey)}</span>
                {project.suggestedProfession === id && <span className="absolute end-3 top-3 rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-medium text-brand">{t("profession.suggested")}</span>}
              </button>
            </li>
          );
        })}
      </ul>

      <h2 className="mt-12 text-xl font-semibold">{t("profession.lang.title")}</h2>
      <p className="mt-1 text-sm text-muted">{t("profession.lang.sub")}</p>
      <p className="mt-1 text-sm text-muted">{t("profession.lang.detected", { lang: detected })}</p>
      <div className="mt-4 grid max-w-xl gap-3 sm:grid-cols-2" role="group">
        {(["en", "ar"] as const).map((l) => (
          <button key={l} type="button" aria-pressed={lang === l} onClick={() => setLang(l)} lang={l}
            className={cn("rounded-2xl border bg-white p-4 text-start font-medium transition", lang === l ? "border-brand ring-2 ring-brand/30" : "border-line hover:border-brand/50")}>
            {t(`profession.lang.${l}` as TKey)}
          </button>
        ))}
      </div>
      <div className="mt-10"><Button size="lg" disabled={!prof} onClick={next}>{t("common.continue")}</Button></div>
    </FlowShell>
  );
}
