import type { PortfolioData } from "@/schemas/portfolio";
import type { ProfessionId } from "@/lib/constants";
import type { Lang, TKey } from "@/i18n/config";

export class ApiError extends Error { constructor(public code: string) { super(code); } }
const KNOWN = ["not_configured","rate_limited","too_large","unsupported","empty","scanned","corrupt","timeout","bad_output","network","generic","invalid_backup","too_short"];
export const errorKey = (code: string): TKey => (KNOWN.includes(code) ? (`errors.${code}` as TKey) : "errors.generic");

async function handle<T>(res: Response): Promise<T> {
  const j = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(j?.error?.code ?? "generic");
  return j as T;
}
const post = <T,>(url: string, body: unknown) =>
  fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then((r) => handle<T>(r), () => { throw new ApiError("network"); });

export interface Extracted { text: string; words: number; detectedLang: Lang; suggestedProfession: ProfessionId | null }
/** XHR so the upload progress bar is real. */
export function extractCv(file: File, onProgress: (pct: number) => void): Promise<Extracted> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/extract-cv");
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100));
    xhr.onerror = () => reject(new ApiError("network"));
    xhr.onload = () => {
      let j: { error?: { code: string } } & Partial<Extracted> = {};
      try { j = JSON.parse(xhr.responseText); } catch { /* fallthrough */ }
      if (xhr.status >= 200 && xhr.status < 300) resolve(j as Extracted); else reject(new ApiError(j.error?.code ?? "generic"));
    };
    const fd = new FormData(); fd.append("file", file); xhr.send(fd);
  });
}
export const analyzeCv = (text: string, profession: ProfessionId, language: Lang) =>
  post<{ data: PortfolioData; warnings: string[] }>("/api/analyze-cv", { text, profession, language });
export const generateContent = (task: "improve" | "translate", data: PortfolioData, profession: ProfessionId | null, language: Lang) =>
  post<{ data: PortfolioData }>("/api/generate-content", { task, data, profession, language });
