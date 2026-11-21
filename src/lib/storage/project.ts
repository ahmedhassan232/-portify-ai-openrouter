import { projectSchema, type Project } from "@/schemas/portfolio";
import { idbDel, idbGet, idbSet } from "./idb";

const KEY = "project";
/** Small prefs also go to LocalStorage (spec); the full draft with images lives in IndexedDB. */
function mirrorPrefs(p: Project) {
  try {
    if (p.profession) localStorage.setItem("portify:profession", p.profession);
    localStorage.setItem("portify:template", p.settings.template);
  } catch { /* storage blocked */ }
}
export async function loadProject(): Promise<Project | null> {
  try {
    const raw = await idbGet<unknown>(KEY);
    const r = projectSchema.safeParse(raw);
    return r.success ? r.data : null;
  } catch { return null; }
}
export async function saveProject(p: Project) { await idbSet(KEY, p); mirrorPrefs(p); }
export async function clearProject() {
  await idbDel(KEY);
  try { localStorage.removeItem("portify:profession"); localStorage.removeItem("portify:template"); } catch { /* ignore */ }
}
export const makeBackup = (p: Project) => JSON.stringify({ app: "portify-ai", version: 1, exportedAt: new Date().toISOString(), project: p });
export function parseBackup(text: string): Project {
  try {
    const j = JSON.parse(text) as { app?: string; project?: unknown };
    if (j.app !== "portify-ai") throw new Error();
    return projectSchema.parse(j.project);
  } catch { throw new Error("invalid_backup"); }
}
