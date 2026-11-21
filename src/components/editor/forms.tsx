"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import { Input, Label, Textarea } from "@/components/ui/fields";
import { useToast } from "@/components/ui/overlay";
import { useT } from "@/i18n/provider";
import { fileToDataUrl } from "@/lib/utils/image";

export function F({ label, children }: { label: string; children: ReactNode }) { return <label className="block"><Label>{label}</Label>{children}</label>; }
/** `tech` = emails, phones, URLs: always LTR so they never get scrambled inside Arabic UI. Everything else is dir=auto. */
export function TextF({ label, value, onChange, tech, type = "text" }: { label: string; value: string; onChange: (v: string) => void; tech?: boolean; type?: string }) {
  return <F label={label}><Input type={type} value={value} dir={tech ? "ltr" : "auto"} onChange={(e) => onChange(e.target.value)} /></F>;
}
export function AreaF({ label, value, onChange, rows = 4 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return <F label={label}><Textarea rows={rows} dir="auto" value={value} onChange={(e) => onChange(e.target.value)} /></F>;
}
const parse = (s: string, mode: "csv" | "lines") => (mode === "csv" ? s.split(/[,،]/) : s.split("\n")).map((x) => x.trim()).filter(Boolean);
const fmt = (v: string[], mode: "csv" | "lines") => v.join(mode === "csv" ? ", " : "\n");
/** Keeps raw text while typing (trailing commas/newlines survive) but resyncs on undo/redo/reset. */
export function ListF({ label, hint, value, onChange, mode }: { label: string; hint?: string; value: string[]; onChange: (v: string[]) => void; mode: "csv" | "lines" }) {
  const [raw, setRaw] = useState(fmt(value, mode));
  useEffect(() => { if (JSON.stringify(parse(raw, mode)) !== JSON.stringify(value)) setRaw(fmt(value, mode)); }, [value]); // eslint-disable-line react-hooks/exhaustive-deps
  const on = (s: string) => { setRaw(s); onChange(parse(s, mode)); };
  return (
    <F label={hint ? `${label} · ${hint}` : label}>
      {mode === "csv" ? <Input dir="auto" value={raw} onChange={(e) => on(e.target.value)} /> : <Textarea rows={4} dir="auto" value={raw} onChange={(e) => on(e.target.value)} />}
    </F>
  );
}
export function ImageF({ label, value, onChange, round }: { label: string; value: string; onChange: (v: string) => void; round?: boolean }) {
  const t = useT(); const toast = useToast(); const input = useRef<HTMLInputElement>(null);
  return (
    <div>
      <Label>{label}</Label>
      <div className="flex items-center gap-3">
        {value ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={value} alt="" className={`size-14 object-cover ${round ? "rounded-full" : "rounded-lg"}`} /> : <span className={`grid size-14 place-items-center bg-canvas text-muted ring-1 ring-line ${round ? "rounded-full" : "rounded-lg"}`}><ImagePlus className="size-5" /></span>}
        <button type="button" className="rounded-lg border border-line px-3 py-1.5 text-sm hover:border-brand/50" onClick={() => input.current?.click()}>{t("editor.fields.uploadPhoto")}</button>
        {value && <button type="button" aria-label={t("common.remove")} title={t("common.remove")} className="rounded-lg p-2 text-muted hover:bg-black/5" onClick={() => onChange("")}><Trash2 className="size-4" /></button>}
        <input ref={input} type="file" hidden accept="image/png,image/jpeg,image/webp,image/gif" onChange={async (e) => { const f = e.target.files?.[0]; e.target.value = ""; if (!f) return; try { onChange(await fileToDataUrl(f)); } catch { toast(t("toast.imageError"), "error"); } }} />
      </div>
    </div>
  );
}
