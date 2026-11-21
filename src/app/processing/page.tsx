"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle2, Circle, Loader2 } from "lucide-react";
import { FlowShell } from "@/components/shared/SiteHeader";
import { Button } from "@/components/ui/button";
import { useGuard, useProject } from "@/hooks/use-project";
import { useT } from "@/i18n/provider";
import { ApiError, analyzeCv, errorKey } from "@/lib/client/api";
import { demoData } from "@/lib/demo";
import { skillCount } from "@/lib/portfolio";
import type { TKey } from "@/i18n/config";

type Status = "running" | "done" | "error" | "not_configured";
const STEPS: TKey[] = ["processing.steps.prepare", "processing.steps.analyze", "processing.steps.validate"];

export default function ProcessingPage() {
  const ok = useGuard("cv");
  const t = useT(); const router = useRouter();
  const { project, ready, cvText, setCvText, update } = useProject();
  const [status, setStatus] = useState<Status>("running");
  const [step, setStep] = useState(0);
  const [err, setErr] = useState<TKey>("errors.generic");
  const [warnings, setWarnings] = useState<string[]>([]);
  const started = useRef(false);
  const pr = useRef(project); pr.current = project;

  const run = useCallback(async () => {
    const p = pr.current; if (!p || !cvText) return;
    setStatus("running"); setStep(1);
    try {
      const r = await analyzeCv(cvText, p.profession ?? "other", p.outputLang);
      setStep(2);
      update((x) => ({ ...x, data: r.data, original: r.data, demo: false, stage: "processing" }));
      setWarnings(r.warnings); setCvText(null); // the CV text is dropped from memory once it has been used
      setStep(3); setStatus("done");
    } catch (e) {
      const code = e instanceof ApiError ? e.code : "generic";
      if (code === "not_configured") return setStatus("not_configured");
      setErr(errorKey(code)); setStatus("error");
    }
  }, [cvText, update, setCvText]);

  useEffect(() => {
    if (!ready || started.current) return;
    if (!cvText) { if (project?.data) router.replace("/templates"); return; }
    started.current = true; void run();
  }, [ready, cvText, project?.data, router, run]);

  if (!ok || !project) return null;
  const d = project.data;
  const go = () => { update((p) => ({ ...p, stage: "templates" })); router.push("/templates"); };
  const useSample = () => { const s = demoData(project.outputLang); update((p) => ({ ...p, data: s, original: s, demo: true, stage: "templates" })); router.push("/templates"); };

  return (
    <FlowShell>
      {status === "not_configured" ? (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-6">
          <h1 className="flex items-center gap-2 text-xl font-semibold"><AlertTriangle className="size-5 text-amber-600" />{t("processing.notConfigured.title")}</h1>
          <p className="mt-2 text-sm text-muted">{t("processing.notConfigured.desc")}</p>
          <code dir="ltr" className="mt-3 block rounded-lg bg-white p-3 text-xs">OPENAI_API_KEY=sk-…</code>
          <Button className="mt-5" onClick={useSample}>{t("processing.notConfigured.dev")}</Button>
        </div>
      ) : status === "error" ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6" role="alert">
          <h1 className="text-xl font-semibold">{t(err)}</h1>
          <div className="mt-5 flex flex-wrap gap-2">
            {cvText ? <Button onClick={run}>{t("common.retry")}</Button> : <Button onClick={() => router.push("/upload")}>{t("processing.reupload")}</Button>}
            <Button variant="secondary" onClick={() => router.push("/profession")}>{t("common.back")}</Button>
          </div>
        </div>
      ) : status === "done" && d ? (
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold"><CheckCircle2 className="size-7 text-green-600" />{t("processing.done.title")}</h1>
          <p className="mt-2 text-muted">{t("processing.done.sub")}</p>
          <p dir="auto" className="mt-6 text-xl font-semibold">{d.personalInfo.fullName}</p>
          <p dir="auto" className="text-muted">{d.personalInfo.jobTitle}</p>
          <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {([["processing.done.roles", d.experience.length], ["processing.done.projects", d.projects.length], ["processing.done.skills", skillCount(d)], ["processing.done.education", d.education.length]] as const).map(([k, n]) => (
              <li key={k} className="rounded-xl border border-line bg-white p-4 text-sm font-medium">{t(k, { count: n })}</li>
            ))}
          </ul>
          {warnings.length > 0 && <ul className="mt-5 space-y-1 text-sm text-amber-800">{warnings.map((w) => <li key={w} className="flex items-center gap-2"><AlertTriangle className="size-4" />{t(`processing.warnings.${w}` as TKey)}</li>)}</ul>}
          <Button size="lg" className="mt-8" onClick={go}>{t("common.continue")}</Button>
        </div>
      ) : (
        <div>
          <h1 className="text-3xl font-bold">{t("processing.title")}</h1>
          <p className="mt-2 text-muted">{t("processing.sub")}</p>
          <ol className="mt-8 space-y-3" aria-live="polite">
            {STEPS.map((k, i) => (
              <li key={k} className="flex items-center gap-3 rounded-xl border border-line bg-white p-4">
                {i < step ? <CheckCircle2 className="size-5 text-green-600" /> : i === step ? <Loader2 className="size-5 animate-spin text-brand" /> : <Circle className="size-5 text-line" />}
                <span className={i > step ? "text-muted" : ""}>{t(k)}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </FlowShell>
  );
}
