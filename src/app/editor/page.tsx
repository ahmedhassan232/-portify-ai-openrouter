"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Eye, Loader2, Paintbrush, PencilLine, Redo2, RotateCcw, Undo2 } from "lucide-react";
import { Logo } from "@/components/shared/SiteHeader";
import { LangSwitch } from "@/components/shared/LangSwitch";
import { DataMenu } from "@/components/shared/DataMenu";
import { Button, buttonClass } from "@/components/ui/button";
import { Dialog } from "@/components/ui/overlay";
import { ContentPanel } from "@/components/editor/ContentPanel";
import { DesignPanel } from "@/components/editor/DesignPanel";
import { DeviceBar, PreviewPane, type Device } from "@/components/editor/PreviewPane";
import { useGuard, useProject } from "@/hooks/use-project";
import { useT } from "@/i18n/provider";
import { cn } from "@/lib/utils/cn";

type Tab = "content" | "preview" | "design";
export default function EditorPage() {
  const ok = useGuard("data");
  const t = useT();
  const { project, saving, undo, redo, canUndo, canRedo, update } = useProject();
  const [tab, setTab] = useState<Tab>("content");
  const [device, setDevice] = useState<Device>("desktop");
  const [reset, setReset] = useState(false);

  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest("input, textarea, [contenteditable]")) return; // native undo wins inside fields
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") { e.preventDefault(); e.shiftKey ? redo() : undo(); }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") { e.preventDefault(); redo(); }
    };
    window.addEventListener("keydown", on); return () => window.removeEventListener("keydown", on);
  }, [undo, redo]);
  if (!ok || !project) return null;

  const tabs: [Tab, typeof Eye, "editor.tabs.content" | "editor.tabs.preview" | "editor.tabs.design"][] = [["content", PencilLine, "editor.tabs.content"], ["preview", Eye, "editor.tabs.preview"], ["design", Paintbrush, "editor.tabs.design"]];
  const panel = "h-full overflow-y-auto bg-white p-4";
  return (
    <div className="flex h-dvh flex-col bg-canvas">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-white px-3 py-2">
        <div className="flex items-center gap-3">
          <Logo />
          <Link href="/templates" className={buttonClass("ghost", "sm")}><ArrowLeft className="size-4 rtl:-scale-x-100" aria-hidden /><span className="hidden sm:inline">{t("common.back")}</span></Link>
          <p aria-live="polite" className="hidden items-center gap-1.5 text-xs text-muted md:flex">{saving ? <><Loader2 className="size-3.5 animate-spin" />{t("editor.actions.saving")}</> : <><Check className="size-3.5 text-green-600" />{t("editor.actions.saved")}</>}</p>
        </div>
        <div className="flex items-center gap-1">
          <button type="button" onClick={undo} disabled={!canUndo} title={t("common.undo")} aria-label={t("common.undo")} className="grid size-9 place-items-center rounded-lg hover:bg-black/5 disabled:opacity-30"><Undo2 className="size-4 rtl:-scale-x-100" /></button>
          <button type="button" onClick={redo} disabled={!canRedo} title={t("common.redo")} aria-label={t("common.redo")} className="grid size-9 place-items-center rounded-lg hover:bg-black/5 disabled:opacity-30"><Redo2 className="size-4 rtl:-scale-x-100" /></button>
          <button type="button" onClick={() => setReset(true)} title={t("editor.actions.reset")} aria-label={t("editor.actions.reset")} className="grid size-9 place-items-center rounded-lg hover:bg-black/5"><RotateCcw className="size-4" /></button>
          <DataMenu />
        </div>
        <div className="flex items-center gap-2"><LangSwitch className="hidden md:inline-flex" /><Link href="/preview" className={buttonClass("primary", "sm")}>{t("editor.actions.toPreview")}</Link></div>
      </header>
      {project.demo && <p className="bg-amber-100 px-4 py-1.5 text-center text-sm text-amber-900">{t("editor.actions.demoBanner")}</p>}

      <div className="min-h-0 flex-1 lg:grid lg:grid-cols-[340px_minmax(0,1fr)_300px]">
        <aside className={cn(panel, "border-line lg:block lg:border-e", tab === "content" ? "block" : "hidden")}><ContentPanel /></aside>
        <section className={cn("h-full flex-col p-2 lg:flex lg:p-3", tab === "preview" ? "flex" : "hidden")}>
          <div className="mb-2 flex justify-center lg:justify-start"><DeviceBar device={device} onChange={setDevice} /></div>
          <div className="min-h-0 flex-1"><PreviewPane device={device} /></div>
        </section>
        <aside className={cn(panel, "border-line lg:block lg:border-s", tab === "design" ? "block" : "hidden")}><DesignPanel /></aside>
      </div>

      <nav className="grid grid-cols-3 border-t border-line bg-white lg:hidden">
        {tabs.map(([id, Icon, k]) => <button key={id} type="button" aria-pressed={tab === id} onClick={() => setTab(id)} className={cn("flex flex-col items-center gap-0.5 py-2 text-xs", tab === id ? "text-brand" : "text-muted")}><Icon className="size-5" aria-hidden />{t(k)}</button>)}
      </nav>

      <Dialog open={reset} onClose={() => setReset(false)} title={t("editor.actions.resetTitle")}>
        <p className="text-sm text-muted">{t("editor.actions.resetDesc")}</p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setReset(false)}>{t("common.cancel")}</Button>
          <Button variant="danger" onClick={() => { update((p) => ({ ...p, data: p.original ? structuredClone(p.original) : p.data }), { history: true }); setReset(false); }}>{t("editor.actions.reset")}</Button>
        </div>
      </Dialog>
    </div>
  );
}
