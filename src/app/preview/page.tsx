"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { Logo } from "@/components/shared/SiteHeader";
import { LangSwitch } from "@/components/shared/LangSwitch";
import { Button, buttonClass } from "@/components/ui/button";
import { DeviceBar, PreviewPane, type Device } from "@/components/editor/PreviewPane";
import { ExportDialog } from "@/components/editor/ExportDialog";
import { useGuard } from "@/hooks/use-project";
import { useT } from "@/i18n/provider";

export default function PreviewPage() {
  const ok = useGuard("data");
  const t = useT();
  const [device, setDevice] = useState<Device>("desktop");
  const [exp, setExp] = useState(false);
  if (!ok) return null;
  return (
    <div className="flex h-dvh flex-col bg-canvas">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-white px-4 py-2">
        <div className="flex items-center gap-4"><Logo /><Link href="/editor" className={buttonClass("ghost", "sm")}><ArrowLeft className="size-4 rtl:-scale-x-100" aria-hidden />{t("preview.backToEditor")}</Link></div>
        <DeviceBar device={device} onChange={setDevice} />
        <div className="flex items-center gap-2"><LangSwitch className="hidden sm:inline-flex" /><Button size="sm" onClick={() => setExp(true)}><Download className="size-4" />{t("preview.export")}</Button></div>
      </header>
      <div className="min-h-0 flex-1 p-2 sm:p-4"><PreviewPane device={device} /></div>
      <ExportDialog open={exp} onClose={() => setExp(false)} />
    </div>
  );
}
