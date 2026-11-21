"use client";
import { FlowShell } from "@/components/shared/SiteHeader";
import { useT } from "@/i18n/provider";
import type { TKey } from "@/i18n/config";

export default function Privacy() {
  const t = useT();
  return (
    <FlowShell>
      <h1 className="text-3xl font-bold">{t("privacy.title")}</h1>
      <div className="mt-6 space-y-4 text-muted">{(["p1", "p2", "p3", "p4", "p5"] as const).map((k) => <p key={k}>{t(`privacy.${k}` as TKey)}</p>)}</div>
    </FlowShell>
  );
}
