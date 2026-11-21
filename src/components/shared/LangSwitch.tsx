"use client";
import { Languages } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils/cn";

export function LangSwitch({ className }: { className?: string }) {
  const { lang, setLang, t } = useI18n();
  return (
    <div role="group" aria-label={t("nav.language")} className={cn("inline-flex items-center rounded-lg border border-line bg-white p-0.5 text-sm", className)}>
      <Languages className="mx-1.5 size-4 text-muted" aria-hidden />
      {([["en", "English"], ["ar", "العربية"]] as const).map(([code, label]) => (
        <button key={code} type="button" lang={code} aria-pressed={lang === code} onClick={() => setLang(code)}
          className={cn("rounded-md px-2.5 py-1 transition-colors", lang === code ? "bg-brand text-white" : "text-muted hover:text-ink")}>{label}</button>
      ))}
    </div>
  );
}
