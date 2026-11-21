"use client";
import { useEffect, useRef, useState } from "react";
import { Monitor, Smartphone, Tablet } from "lucide-react";
import { useProject } from "@/hooks/use-project";
import { useT } from "@/i18n/provider";
import { cn } from "@/lib/utils/cn";
import type { TemplateId } from "@/lib/constants";

export type Device = "desktop" | "tablet" | "mobile";
export function DeviceBar({ device, onChange }: { device: Device; onChange: (d: Device) => void }) {
  const t = useT();
  const items = [["desktop", Monitor, "gallery.desktop"], ["tablet", Tablet, "gallery.tablet"], ["mobile", Smartphone, "gallery.mobile"]] as const;
  return (
    <div role="group" className="inline-flex rounded-lg border border-line bg-white p-0.5">
      {items.map(([d, Icon, k]) => (
        <button key={d} type="button" aria-pressed={device === d} title={t(k)} aria-label={t(k)} onClick={() => onChange(d)}
          className={cn("grid size-8 place-items-center rounded-md", device === d ? "bg-brand text-white" : "text-muted hover:text-ink")}><Icon className="size-4" /></button>
      ))}
    </div>
  );
}
const WIDTH: Record<Device, string> = { desktop: "100%", tablet: "768px", mobile: "390px" };

/** Renders the real template in an iframe and streams edits to it instantly (no screenshots, no mockups). */
export function PreviewPane({ device, template }: { device: Device; template?: TemplateId }) {
  const { project } = useProject();
  const ref = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const on = (e: MessageEvent) => { if (e.origin === location.origin && e.source === ref.current?.contentWindow && e.data?.type === "pf:ready") setReady(true); };
    window.addEventListener("message", on); return () => window.removeEventListener("message", on);
  }, []);
  const data = project?.data, settings = project?.settings;
  useEffect(() => {
    if (!ready || !data || !settings) return;
    ref.current?.contentWindow?.postMessage({ type: "pf:state", data, settings }, location.origin);
  }, [ready, data, settings]);
  return (
    <div className="flex h-full justify-center overflow-auto rounded-xl bg-[#ECEAF3] p-2 sm:p-4">
      <iframe ref={ref} title="Portfolio preview" src={`/frame${template ? `?template=${template}` : ""}`} style={{ width: WIDTH[device], maxWidth: "100%" }}
        className="h-full min-h-[480px] rounded-lg border border-line bg-white shadow-sm" />
    </div>
  );
}
