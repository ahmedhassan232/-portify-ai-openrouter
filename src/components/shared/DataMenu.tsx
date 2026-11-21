"use client";
import { useRef, useState } from "react";
import { Database, Download, Trash2, Upload } from "lucide-react";
import { useT } from "@/i18n/provider";
import { useProject } from "@/hooks/use-project";
import { Button } from "@/components/ui/button";
import { Dialog, useToast } from "@/components/ui/overlay";
import { makeBackup, parseBackup } from "@/lib/storage/project";
import { downloadBlob } from "@/lib/utils/image";
import { errorKey } from "@/lib/client/api";
import { useRouter } from "next/navigation";
import { STAGE_ROUTE } from "@/lib/project";

export function ImportButton({ className, children }: { className?: string; children: React.ReactNode }) {
  const { replace } = useProject(); const t = useT(); const toast = useToast(); const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  async function onFile(f: File) {
    try { const p = parseBackup(await f.text()); replace(p); toast(t("toast.imported")); router.push(STAGE_ROUTE[p.stage]); }
    catch (e) { toast(t(errorKey(e instanceof Error ? e.message : "invalid_backup")), "error"); }
  }
  return (
    <>
      <button type="button" className={className} onClick={() => input.current?.click()}>{children}</button>
      <input ref={input} type="file" accept="application/json,.json" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) void onFile(f); e.target.value = ""; }} />
    </>
  );
}
export function DataMenu() {
  const { project, clearAll } = useProject(); const t = useT(); const toast = useToast(); const router = useRouter();
  const [confirm, setConfirm] = useState(false);
  if (!project) return null;
  return (
    <>
      <details className="relative">
        <summary className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-xl px-3 text-sm hover:bg-black/5"><Database className="size-4" aria-hidden />{t("data.menu")}</summary>
        <div className="absolute end-0 z-30 mt-2 w-64 rounded-xl border border-line bg-white p-2 text-sm shadow-lg">
          <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 hover:bg-black/5" onClick={() => { downloadBlob(new Blob([makeBackup(project)], { type: "application/json" }), "portify-backup.json"); toast(t("toast.exported")); }}><Download className="size-4" />{t("data.backup")}</button>
          <ImportButton className="flex w-full items-center gap-2 rounded-lg px-3 py-2 hover:bg-black/5"><Upload className="size-4" />{t("data.import")}</ImportButton>
          <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-red-600 hover:bg-red-50" onClick={() => setConfirm(true)}><Trash2 className="size-4" />{t("data.clear")}</button>
          <p className="px-3 py-2 text-xs text-muted">{t("data.note")}</p>
        </div>
      </details>
      <Dialog open={confirm} onClose={() => setConfirm(false)} title={t("data.clear")}>
        <p className="text-sm text-muted">{t("data.clearConfirm")}</p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setConfirm(false)}>{t("common.cancel")}</Button>
          <Button variant="danger" onClick={async () => { await clearAll(); setConfirm(false); toast(t("toast.cleared")); router.push("/upload"); }}>{t("common.delete")}</Button>
        </div>
      </Dialog>
    </>
  );
}
