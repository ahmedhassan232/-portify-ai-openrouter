import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

const field = "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-muted/70 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20";
export function Label({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("mb-1 block text-xs font-medium text-muted", className)}>{children}</span>;
}
export function Input({ className, ...p }: InputHTMLAttributes<HTMLInputElement>) { return <input className={cn(field, className)} {...p} />; }
export function Textarea({ className, ...p }: TextareaHTMLAttributes<HTMLTextAreaElement>) { return <textarea className={cn(field, "min-h-20 resize-y", className)} {...p} />; }

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} title={label} onClick={() => onChange(!checked)}
      className={cn("relative h-6 w-10 shrink-0 rounded-full transition-colors", checked ? "bg-brand" : "bg-line")}>
      <span className={cn("absolute top-0.5 size-5 rounded-full bg-white shadow transition-all", checked ? "start-[18px]" : "start-0.5")} />
    </button>
  );
}
export function Segmented<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: { value: T; label: string }[] }) {
  return (
    <div className="flex rounded-lg border border-line bg-white p-0.5" role="group">
      {options.map((o) => (
        <button key={o.value} type="button" aria-pressed={value === o.value} onClick={() => onChange(o.value)}
          className={cn("flex-1 rounded-md px-3 py-1.5 text-sm transition-colors", value === o.value ? "bg-brand text-white" : "text-muted hover:text-ink")}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
