"use client";
import { useEffect, useRef, useState } from "react";
import type { TemplateId } from "@/lib/constants";
import type { Lang } from "@/i18n/config";
import { cn } from "@/lib/utils/cn";

/** A scaled, non-interactive, REAL render of a template (iframe, so responsive breakpoints are genuine). */
export function ThumbFrame({ id, device = "desktop", demoLang, className }: { id: TemplateId; device?: "desktop" | "mobile"; demoLang?: Lang; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = box.current; if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width)); ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const full = device === "mobile" ? 390 : 1280, h = device === "mobile" ? 700 : 800;
  return (
    <div ref={box} className={cn("relative w-full overflow-hidden rounded-xl border border-line bg-white", className)} style={{ aspectRatio: device === "mobile" ? "390/560" : "1280/800" }}>
      {w > 0 && (
        <iframe title={id} loading="lazy" tabIndex={-1} aria-hidden src={`/frame?template=${id}${demoLang ? `&demo=${demoLang}` : ""}`}
          style={{ position: "absolute", top: 0, left: 0, width: full, height: h, border: 0, pointerEvents: "none", transform: `scale(${w / full})`, transformOrigin: "top left" }} />
      )}
    </div>
  );
}
