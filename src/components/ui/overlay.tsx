"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { useT } from "@/i18n/provider";
import { cn } from "@/lib/utils/cn";

export function Dialog({ open, onClose, title, children, className }: { open: boolean; onClose: () => void; title?: string; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  const t = useT();
  useEffect(() => {
    const d = ref.current; if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} onClose={onClose} onClick={(e) => e.target === ref.current && onClose()}
      className={cn("m-auto w-[calc(100%-2rem)] max-w-lg rounded-2xl bg-white p-0 text-ink shadow-2xl", className)}>
      {open && (
        <div className="p-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            {title ? <h2 className="text-lg font-semibold">{title}</h2> : <span />}
            <button onClick={onClose} aria-label={t("common.close")} className="-m-1 rounded-lg p-1 text-muted hover:bg-black/5"><X className="size-5" /></button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  );
}

export function Skeleton({ className }: { className?: string }) { return <div aria-hidden className={cn("animate-pulse rounded-lg bg-line/70", className)} />; }

type Toast = { id: number; text: string; tone: "ok" | "error" };
const ToastCtx = createContext<(text: string, tone?: Toast["tone"]) => void>(() => {});
export const useToast = () => useContext(ToastCtx);
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);
  const push = useCallback((text: string, tone: Toast["tone"] = "ok") => {
    const id = Date.now() + Math.random();
    setItems((l) => [...l, { id, text, tone }]);
    setTimeout(() => setItems((l) => l.filter((x) => x.id !== id)), 4000);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex flex-col items-center gap-2 sm:inset-x-auto sm:end-4 sm:items-end">
        {items.map((i) => (
          <div key={i.id} className={cn("pointer-events-auto max-w-sm rounded-xl px-4 py-3 text-sm text-white shadow-lg", i.tone === "ok" ? "bg-ink" : "bg-red-600")}>{i.text}</div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
