"use client";
import { Segmented } from "@/components/ui/fields";
import { useProject } from "@/hooks/use-project";
import { useT } from "@/i18n/provider";
import { CATEGORIES } from "@/lib/constants";
import { TEMPLATES, settingsForTemplate } from "@/templates/registry";
import type { PortfolioSettings } from "@/schemas/portfolio";
import type { TKey } from "@/i18n/config";
import { cn } from "@/lib/utils/cn";

const SWATCHES = ["#6C4CF1", "#2563EB", "#0EA5E9", "#059669", "#F59E0B", "#EA580C", "#F43F5E", "#111827"];
export function DesignPanel() {
  const { project, update } = useProject(); const t = useT();
  const s = project!.settings;
  const look = (patch: Partial<PortfolioSettings>) => update((p) => ({ ...p, settings: { ...p.settings, ...patch, customized: true } }), { history: true, coalesce: `design.${Object.keys(patch)[0]}` });
  const head = "mb-2 text-xs font-semibold uppercase tracking-wide text-muted";
  return (
    <div className="space-y-6">
      <section>
        <h3 className={head}>{t("design.template")}</h3>
        <div className="space-y-3">
          {CATEGORIES.map((c) => (
            <div key={c}>
              <p className="mb-1 text-xs text-muted">{t(`category.${c}` as TKey)}</p>
              <div className="grid gap-1.5">
                {TEMPLATES.filter((x) => x.category === c).map((x) => (
                  <button key={x.id} type="button" aria-pressed={s.template === x.id} onClick={() => update((p) => ({ ...p, settings: settingsForTemplate(p.settings, x.id) }), { history: true })}
                    className={cn("rounded-lg border px-3 py-2 text-start text-sm transition", s.template === x.id ? "border-brand bg-brand/5 font-medium text-brand" : "border-line hover:border-brand/50")}>
                    {t(`template.${x.id}.name` as TKey)}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h3 className={head}>{t("design.accent")}</h3>
        <div className="flex flex-wrap items-center gap-2">
          {SWATCHES.map((c) => <button key={c} type="button" aria-label={c} aria-pressed={s.accent.toLowerCase() === c.toLowerCase()} onClick={() => look({ accent: c })} className={cn("size-8 rounded-full ring-offset-2", s.accent.toLowerCase() === c.toLowerCase() && "ring-2 ring-brand")} style={{ background: c }} />)}
          <input type="color" aria-label={t("design.accent")} value={s.accent} onChange={(e) => look({ accent: e.target.value })} className="size-8 cursor-pointer rounded-full border border-line bg-white p-0.5" />
        </div>
      </section>
      <section><h3 className={head}>{t("design.fontLabel")}</h3>
        <Segmented value={s.font} onChange={(v) => look({ font: v })} options={[{ value: "sans", label: t("design.fonts.sans") }, { value: "serif", label: t("design.fonts.serif") }, { value: "mono", label: t("design.fonts.mono") }]} /></section>
      <section><h3 className={head}>{t("design.bgLabel")}</h3>
        <Segmented value={s.background} onChange={(v) => look({ background: v })} options={[{ value: "light", label: t("design.bgs.light") }, { value: "dark", label: t("design.bgs.dark") }, { value: "tint", label: t("design.bgs.tint") }]} /></section>
      <section><h3 className={head}>{t("design.widthLabel")}</h3>
        <Segmented value={s.width} onChange={(v) => update((p) => ({ ...p, settings: { ...p.settings, width: v } }), { history: true })} options={[{ value: "compact", label: t("design.widths.compact") }, { value: "wide", label: t("design.widths.wide") }]} /></section>
    </div>
  );
}
