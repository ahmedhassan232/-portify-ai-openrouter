"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, FileText, Loader2, ShieldCheck, UploadCloud, X } from "lucide-react";
import { FlowShell } from "@/components/shared/SiteHeader";
import { ImportButton } from "@/components/shared/DataMenu";
import { Button } from "@/components/ui/button";
import { useProject } from "@/hooks/use-project";
import { useT } from "@/i18n/provider";
import { ApiError, errorKey, extractCv } from "@/lib/client/api";
import { MAX_FILE_BYTES } from "@/lib/constants";
import { STAGE_ROUTE } from "@/lib/project";
import { cn } from "@/lib/utils/cn";
import type { TKey } from "@/i18n/config";

type S = { s: "idle" } | { s: "busy"; name: string; pct: number } | { s: "ready"; name: string; size: number; words: number } | { s: "error"; key: TKey };

export default function UploadPage() {
  const t = useT(); const router = useRouter();
  const { project, ready, update, setCvText, clearAll } = useProject();
  const [st, setSt] = useState<S>({ s: "idle" });
  const [drag, setDrag] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const hasDraft = ready && !!project?.data;
  const busy = st.s === "busy";

  async function handle(file: File) {
    if (!/\.(pdf|docx)$/i.test(file.name)) return setSt({ s: "error", key: "errors.unsupported" });
    if (file.size > MAX_FILE_BYTES) return setSt({ s: "error", key: "errors.too_large" });
    setSt({ s: "busy", name: file.name, pct: 0 });
    try {
      const r = await extractCv(file, (pct) => setSt({ s: "busy", name: file.name, pct }));
      setCvText(r.text);
      update((p) => ({ ...p, detectedLang: r.detectedLang, outputLang: r.detectedLang, suggestedProfession: r.suggestedProfession, profession: r.suggestedProfession ?? p.profession, stage: "profession" }));
      setSt({ s: "ready", name: file.name, size: file.size, words: r.words });
    } catch (e) { setSt({ s: "error", key: errorKey(e instanceof ApiError ? e.code : "generic") }); }
  }
  const remove = () => { setCvText(null); setSt({ s: "idle" }); };

  return (
    <FlowShell>
      <h1 className="text-3xl font-bold">{t("upload.title")}</h1>
      <p className="mt-2 text-muted">{t("upload.sub")}</p>

      {hasDraft && st.s === "idle" && (
        <div className="mt-6 rounded-2xl border border-brand/30 bg-brand/5 p-5">
          <p className="font-semibold">{t("upload.resume.title")}</p>
          <p className="mt-1 text-sm text-muted">{t("upload.resume.desc")}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={() => router.push(STAGE_ROUTE[project!.stage === "upload" ? "templates" : project!.stage])}>{t("upload.resume.continue")}</Button>
            <Button variant="secondary" onClick={() => clearAll()}>{t("upload.resume.fresh")}</Button>
          </div>
        </div>
      )}

      <div className="mt-6">
        {st.s === "ready" || busy ? (
          <div className="rounded-2xl border border-line bg-white p-5">
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand"><FileText className="size-5" /></span>
              <div className="min-w-0 flex-1">
                <p dir="auto" className="truncate font-medium">{st.name}</p>
                {st.s === "ready" ? (
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-green-700"><CheckCircle2 className="size-4" />{t("upload.ready")} · {(st.size / 1024).toFixed(0)} KB · {t("upload.words", { count: st.words })}</p>
                ) : (
                  <>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-muted"><Loader2 className="size-4 animate-spin" />{st.pct >= 100 ? t("upload.reading") : t("upload.uploading")}</p>
                    <div role="progressbar" aria-valuenow={st.pct} aria-valuemin={0} aria-valuemax={100} className="mt-3 h-2 overflow-hidden rounded-full bg-line"><div className="h-full bg-brand transition-all" style={{ width: `${st.pct}%` }} /></div>
                  </>
                )}
              </div>
              {st.s === "ready" && <button onClick={remove} aria-label={t("upload.remove")} title={t("upload.remove")} className="rounded-lg p-1.5 text-muted hover:bg-black/5"><X className="size-5" /></button>}
            </div>
            {st.s === "ready" && (
              <div className="mt-5 flex flex-wrap gap-2">
                <Button onClick={() => router.push("/profession")}>{t("common.continue")}</Button>
                <Button variant="secondary" onClick={() => { remove(); input.current?.click(); }}>{t("upload.another")}</Button>
              </div>
            )}
          </div>
        ) : (
          <div role="button" tabIndex={0} onClick={() => input.current?.click()} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && input.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files?.[0]; if (f) void handle(f); }}
            className={cn("flex min-h-72 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-white p-8 text-center transition-colors", drag ? "border-brand bg-brand/5" : "border-line hover:border-brand/60")}>
            <UploadCloud className="size-10 text-brand" aria-hidden />
            <p className="mt-4 text-lg font-medium">{t("upload.drop")}</p>
            <p className="my-2 text-sm text-muted">{t("upload.or")}</p>
            <span className="rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-white">{t("upload.browse")}</span>
          </div>
        )}
        <input ref={input} type="file" hidden accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(e) => { const f = e.target.files?.[0]; if (f) void handle(f); e.target.value = ""; }} />
        {st.s === "error" && <p role="alert" className="mt-3 flex items-start gap-2 text-sm text-red-700"><AlertCircle className="mt-0.5 size-4 shrink-0" />{t(st.key)}</p>}
      </div>

      <div className="mt-6 space-y-2 rounded-2xl border border-line bg-white p-5 text-sm text-muted">
        <p className="flex items-start gap-2"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-brand" />{t("upload.privacy")}</p>
        <p className="ps-6">{t("upload.privacyAi")}</p>
        <p className="ps-6">{t("upload.localNote")}</p>
      </div>
      <div className="mt-4"><ImportButton className="text-sm font-medium text-brand hover:underline">{t("upload.import")}</ImportButton></div>
    </FlowShell>
  );
}
