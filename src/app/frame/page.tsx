"use client";
import { useEffect, useMemo, useState } from "react";
import { useProject } from "@/hooks/use-project";
import { TemplateRenderer, settingsForTemplate } from "@/templates/registry";
import { demoData } from "@/lib/demo";
import { defaultSettings, isTemplateId } from "@/lib/portfolio";
import { dirOf, isLang, type Lang } from "@/i18n/config";
import type { PortfolioData, PortfolioSettings } from "@/schemas/portfolio";

/** Internal: the portfolio rendered alone, in the PORTFOLIO language. Used by every preview and thumbnail. */
export default function Frame() {
  const { project, ready } = useProject();
  const [q, setQ] = useState<{ template: string | null; demo: string | null }>({ template: null, demo: null });
  const [ov, setOv] = useState<{ data: PortfolioData; settings: PortfolioSettings } | null>(null);
  useEffect(() => {
    const sp = new URLSearchParams(location.search);
    setQ({ template: sp.get("template"), demo: sp.get("demo") });
    const on = (e: MessageEvent) => { if (e.origin === location.origin && e.data?.type === "pf:state") setOv({ data: e.data.data, settings: e.data.settings }); };
    window.addEventListener("message", on);
    if (parent !== window) parent.postMessage({ type: "pf:ready" }, location.origin);
    return () => window.removeEventListener("message", on);
  }, []);
  const demoLang: Lang | null = isLang(q.demo) ? q.demo : null;
  const lang: Lang = demoLang ?? project?.outputLang ?? "en";
  const useDemo = !!demoLang || (!ov && !project?.data);
  const demo = useMemo(() => demoData(lang), [lang]);
  useEffect(() => { document.documentElement.lang = lang; document.documentElement.dir = dirOf(lang); }, [lang]);
  if (!ready) return null;
  const data = useDemo ? demo : (ov?.data ?? project!.data!);
  let settings = ov?.settings ?? project?.settings ?? defaultSettings();
  if (q.template && isTemplateId(q.template)) settings = settingsForTemplate(settings, q.template);
  return <TemplateRenderer id={settings.template} data={data} settings={settings} lang={lang} />;
}
