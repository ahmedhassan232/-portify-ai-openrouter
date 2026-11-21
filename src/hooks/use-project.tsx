"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { clearProject, loadProject, saveProject } from "@/lib/storage/project";
import { newProject } from "@/lib/project";
import type { PortfolioData, PortfolioSettings, Project } from "@/schemas/portfolio";

interface Snap { data: PortfolioData | null; settings: PortfolioSettings }
interface UpdateOpts { history?: boolean; coalesce?: string }
interface Ctx {
  project: Project | null; ready: boolean; saving: boolean; rev: number;
  cvText: string | null; setCvText: (t: string | null) => void;
  update: (fn: (p: Project) => Project, o?: UpdateOpts) => void;
  replace: (p: Project) => void; clearAll: () => Promise<void>;
  undo: () => void; redo: () => void; canUndo: boolean; canRedo: boolean;
}
const ProjectCtx = createContext<Ctx | null>(null);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const readOnly = usePathname() === "/frame"; // the preview iframe must never overwrite the editor's draft
  const [project, setProject] = useState<Project | null>(null);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [cvText, setCvText] = useState<string | null>(null);
  const [rev, setRev] = useState(0);
  const ref = useRef<Project | null>(null);
  const past = useRef<Snap[]>([]); const future = useRef<Snap[]>([]);
  const last = useRef({ key: "", t: 0 });

  const commit = useCallback((p: Project) => { ref.current = p; setProject(p); }, []);
  useEffect(() => { loadProject().then((p) => { commit(p ?? newProject()); setReady(true); }); }, [commit]);
  useEffect(() => {
    if (!ready || !project || readOnly) return;
    setSaving(true);
    const h = setTimeout(() => { saveProject(project).catch(() => {}).finally(() => setSaving(false)); }, 500);
    return () => clearTimeout(h);
  }, [project, ready, readOnly]);

  const update = useCallback((fn: (p: Project) => Project, o?: UpdateOpts) => {
    const prev = ref.current; if (!prev) return;
    if (o?.history) {
      const now = Date.now(), key = o.coalesce ?? "";
      if (!(key && last.current.key === key && now - last.current.t < 900)) {
        past.current.push({ data: prev.data, settings: prev.settings });
        if (past.current.length > 60) past.current.shift();
      }
      last.current = { key, t: now }; future.current = [];
    }
    commit({ ...fn(prev), updatedAt: Date.now() });
  }, [commit]);
  const swap = (from: Snap[], to: Snap[]) => {
    const prev = ref.current, snap = from.pop(); if (!prev || !snap) return;
    to.push({ data: prev.data, settings: prev.settings });
    commit({ ...prev, ...snap, updatedAt: Date.now() }); setRev((r) => r + 1);
  };
  const undo = useCallback(() => swap(past.current, future.current), []); // eslint-disable-line react-hooks/exhaustive-deps
  const redo = useCallback(() => swap(future.current, past.current), []); // eslint-disable-line react-hooks/exhaustive-deps
  const replace = useCallback((p: Project) => { past.current = []; future.current = []; commit(p); setRev((r) => r + 1); }, [commit]);
  const clearAll = useCallback(async () => { await clearProject(); setCvText(null); replace(newProject()); }, [replace]);

  const value = useMemo<Ctx>(() => ({
    project, ready, saving, rev, cvText, setCvText, update, replace, clearAll, undo, redo,
    canUndo: past.current.length > 0, canRedo: future.current.length > 0,
  }), [project, ready, saving, rev, cvText, update, replace, clearAll, undo, redo]);
  return <ProjectCtx.Provider value={value}>{children}</ProjectCtx.Provider>;
}
export function useProject() {
  const c = useContext(ProjectCtx);
  if (!c) throw new Error("useProject outside ProjectProvider");
  return c;
}
/** Redirects to /upload when the page's prerequisites are missing. Returns true when it is safe to render. */
export function useGuard(need: "cv" | "data") {
  const { project, ready, cvText } = useProject();
  const router = useRouter();
  const ok = need === "data" ? !!project?.data : !!(cvText || project?.data);
  useEffect(() => { if (ready && !ok) router.replace("/upload"); }, [ready, ok, router]);
  return ready && ok;
}
