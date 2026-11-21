import "fake-indexeddb/auto";
import { describe, expect, it } from "vitest";
import { clearProject, loadProject, makeBackup, parseBackup, saveProject } from "@/lib/storage/project";
import { newProject } from "@/lib/project";
import { demoData } from "@/lib/demo";

describe("local persistence", () => {
  it("saves, restores and clears a draft", async () => {
    const p = { ...newProject("ar"), data: demoData("ar"), stage: "editor" as const };
    await saveProject(p);
    const back = await loadProject();
    expect(back?.data?.personalInfo.fullName).toBe(p.data.personalInfo.fullName);
    expect(back?.outputLang).toBe("ar");
    await clearProject();
    expect(await loadProject()).toBeNull();
  });
  it("JSON backup round-trips and rejects junk", () => {
    const p = { ...newProject(), data: demoData("en") };
    expect(parseBackup(makeBackup(p)).data?.projects.length).toBe(3);
    expect(() => parseBackup("{}")).toThrow("invalid_backup");
    expect(() => parseBackup("not json")).toThrow("invalid_backup");
  });
});
