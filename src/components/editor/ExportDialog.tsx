"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Download, ExternalLink, FileCode2, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/overlay";
import { useProject } from "@/hooks/use-project";
import { useT } from "@/i18n/provider";
import { ApiError, errorKey, generateContent } from "@/lib/client/api";
import { downloadBlob } from "@/lib/utils/image";
import type { TKey } from "@/i18n/config";

type Phase = "idle" | "translating" | "building" | "done" | "error";
export function ExportDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useT(); const router = useRouter();
  const { project, update, clearAll } = useProject();
  const [include, setInclude] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [err, setErr] = useState<TKey>("errors.generic");
  const [out, setOut] = useState<{ zip: Blob; html: Blob } | null>(null);
  if (!project?.data) return null;
  const other = project.outputLang === "en" ? "ar" : "en";
  const otherName = t(other === "ar" ? "profession.lang.nameAr" : "profession.lang.nameEn");

  async function run() {
    setPhase("building");
    try {
      let proj = { ...project!, translations: include ? project!.translations : {} };
      if (include && !proj.translations[other]) {
        setPhase("translating");
        const r = await generateContent("translate", project!.data!, project!.profession, other);
        update((p) => ({ ...p, translations: { ...p.translations, [other]: r.data } }));
        proj = { ...proj, translations: { ...proj.translations, [other]: r.data } };
        setPhase("building");
      }
      const { buildPortfolioZip, buildSingleHtml, loadExportCss } = await import("@/lib/export/build");
      const css = await loadExportCss();
      setOut({ zip: await buildPortfolioZip(proj, css), html: await buildSingleHtml(proj, css) });
      setPhase("done");
    } catch (e) {
      setErr(e instanceof Error && e.message === "css_missing" ? "export.cssMissing" : errorKey(e instanceof ApiError ? e.code : "generic"));
      setPhase("error");
    }
  }
  const busy = phase === "building" || phase === "translating";
  return (
    <Dialog open={open} onClose={onClose} title={phase === "done" ? t("export.success.title") : t("export.title")}>
      {phase === "done" && out ? (
        <div>
          <p className="flex items-start gap-2 text-sm text-muted"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-600" />{t("export.success.desc")}</p>
          <div className="mt-5 grid gap-2">
            <Button onClick={() => downloadBlob(out.zip, "portfolio.zip")}><Download className="size-4" />{t("export.downloadZip")}</Button>
            <Button variant="secondary" onClick={() => downloadBlob(out.html, "portfolio.html")}><FileCode2 className="size-4" />{t("export.downloadHtml")}</Button>
            <Button variant="secondary" onClick={() => window.open(URL.createObjectURL(out.html), "_blank", "noopener")}><ExternalLink className="size-4" />{t("export.previewSite")}</Button>
            <Button variant="ghost" onClick={async () => { if (confirm(t("data.clearConfirm"))) { await clearAll(); router.push("/upload"); } }}><RotateCcw className="size-4" />{t("export.startAgain")}</Button>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-sm text-muted">{t("export.desc")}</p>
          <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-line p-3">
            <input type="checkbox" className="mt-1 size-4 accent-[#6C4CF1]" checked={include} disabled={busy} onChange={(e) => setInclude(e.target.checked)} />
            <span><span className="block text-sm font-medium">{t("export.includeOther", { lang: otherName })}</span><span className="block text-xs text-muted">{t("export.includeOtherHint")}</span></span>
          </label>
          {phase === "error" && <p role="alert" className="mt-4 flex items-start gap-2 text-sm text-red-700"><AlertCircle className="mt-0.5 size-4 shrink-0" />{t(err)}</p>}
          <Button className="mt-5 w-full" disabled={busy} onClick={run}>
            {busy ? <><Loader2 className="size-4 animate-spin" />{t(phase === "translating" ? "export.translating" : "export.building")}</> : t("export.start")}
          </Button>
        </div>
      )}
    </Dialog>
  );
}
