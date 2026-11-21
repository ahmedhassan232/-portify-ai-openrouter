"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { FlowShell } from "@/components/shared/SiteHeader";
import { Button } from "@/components/ui/button";
import { Dialog, useToast } from "@/components/ui/overlay";
import { Segmented } from "@/components/ui/fields";
import { ThumbFrame } from "@/components/templates/ThumbFrame";
import { DeviceBar, PreviewPane, type Device } from "@/components/editor/PreviewPane";
import { useGuard, useProject } from "@/hooks/use-project";
import { useT } from "@/i18n/provider";
import { ApiError, errorKey, generateContent } from "@/lib/client/api";
import { CATEGORIES, CATEGORY_OF, type Category, type TemplateId } from "@/lib/constants";
import { TEMPLATES, settingsForTemplate } from "@/templates/registry";
import type { TKey } from "@/i18n/config";
import { cn } from "@/lib/utils/cn";

export default function TemplatesPage() {
  const ok = useGuard("data");
  const t = useT(); const router = useRouter(); const toast = useToast();
  const { project, update } = useProject();
  const [filter, setFilter] = useState<Category | "all" | null>(null);
  const [thumb, setThumb] = useState<"desktop" | "mobile">("desktop");
  const [preview, setPreview] = useState<TemplateId | null>(null);
  const [pDevice, setPDevice] = useState<Device>("desktop");
  const [busy, setBusy] = useState(false);
  const cancelled = useRef(false);
  if (!ok || !project) return null;

  const recommended = CATEGORY_OF[project.profession ?? "other"];
  const active = filter ?? recommended;
  const list = TEMPLATES.filter((x) => active === "all" || x.category === active);

  async function choose(id: TemplateId) {
    update((p) => ({ ...p, settings: settingsForTemplate(p.settings, id), stage: "editor" }));
    const p = project!;
    if (p.demo || p.data!.aiImproved.length > 0) return router.push("/editor"); // sample data / already polished: no AI call
    cancelled.current = false; setBusy(true);
    try {
      const r = await generateContent("improve", p.data!, p.profession, p.outputLang);
      if (!cancelled.current) update((x) => ({ ...x, data: r.data, original: r.data }));
    } catch (e) {
      const code = e instanceof ApiError ? e.code : "generic";
      if (code !== "not_configured" && !cancelled.current) toast(t(errorKey(code)), "error");
    }
    if (!cancelled.current) { setBusy(false); router.push("/editor"); }
  }
  const skip = () => { cancelled.current = true; setBusy(false); router.push("/editor"); };

  return (
    <FlowShell wide>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="text-3xl font-bold">{t("gallery.title")}</h1><p className="mt-2 text-muted">{t("gallery.sub")}</p></div>
        <div className="w-56"><Segmented value={thumb} onChange={setThumb} options={[{ value: "desktop", label: t("gallery.desktop") }, { value: "mobile", label: t("gallery.mobile") }]} /></div>
      </div>
      <div className="mt-6 flex flex-wrap gap-2" role="group">
        {(["all", ...CATEGORIES] as const).map((c) => (
          <button key={c} type="button" aria-pressed={active === c} onClick={() => setFilter(c)}
            className={cn("rounded-full border px-4 py-1.5 text-sm transition", active === c ? "border-brand bg-brand text-white" : "border-line bg-white hover:border-brand/50")}>
            {c === "all" ? t("gallery.all") : t(`category.${c}` as TKey)}
          </button>
        ))}
      </div>
      <ul className={cn("mt-8 grid gap-6", thumb === "mobile" ? "sm:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-2 lg:grid-cols-3")}>
        {list.map((tp) => (
          <li key={tp.id} className="rounded-2xl border border-line bg-white p-3">
            <ThumbFrame id={tp.id} device={thumb} />
            <div className="mt-3 flex items-start justify-between gap-2 px-1">
              <div><p className="font-semibold">{t(`template.${tp.id}.name` as TKey)}</p><p className="mt-0.5 text-sm text-muted">{t(`template.${tp.id}.desc` as TKey)}</p></div>
              {tp.category === recommended && <span className="shrink-0 rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-medium text-brand">{t("gallery.recommended")}</span>}
            </div>
            <div className="mt-3 flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => setPreview(tp.id)}>{t("gallery.preview")}</Button>
              <Button size="sm" className="flex-1" disabled={busy} onClick={() => choose(tp.id)}>{t("gallery.select")}</Button>
            </div>
          </li>
        ))}
      </ul>

      <Dialog open={!!preview} onClose={() => setPreview(null)} title={preview ? t(`template.${preview}.name` as TKey) : ""} className="max-w-5xl">
        <div className="mb-3"><DeviceBar device={pDevice} onChange={setPDevice} /></div>
        <div className="h-[68vh]">{preview && <PreviewPane device={pDevice} template={preview} />}</div>
        <div className="mt-4 flex justify-end"><Button onClick={() => { const id = preview!; setPreview(null); void choose(id); }}>{t("gallery.select")}</Button></div>
      </Dialog>
      <Dialog open={busy} onClose={skip} title={t("gallery.generating.title")}>
        <div className="flex items-center gap-3 text-sm text-muted"><Loader2 className="size-5 animate-spin text-brand" />{t("gallery.generating.desc")}</div>
        <div className="mt-6"><Button variant="secondary" onClick={skip}>{t("gallery.generating.skip")}</Button></div>
      </Dialog>
    </FlowShell>
  );
}
