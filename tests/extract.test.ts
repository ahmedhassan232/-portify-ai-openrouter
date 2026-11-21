import { describe, expect, it } from "vitest";
import { ExtractError, extractCvText, sniffKind } from "@/lib/cv-parser/extract";

const file = (bytes: number[] | string, name = "cv.pdf") => new File([typeof bytes === "string" ? bytes : new Uint8Array(bytes)], name);
const code = async (f: File) => { try { await extractCvText(f); return "ok"; } catch (e) { return e instanceof ExtractError ? e.code : "other"; } };

describe("CV extraction guards", () => {
  it("detects file type by magic bytes, not by name", () => {
    expect(sniffKind(new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d]))).toBe("pdf");
    expect(sniffKind(new Uint8Array([0x50, 0x4b, 0x03, 0x04, 0x14]))).toBe("docx");
    expect(sniffKind(new TextEncoder().encode("hello world"))).toBeNull();
  });
  it("rejects empty, unsupported and oversized files", async () => {
    expect(await code(file(""))).toBe("empty");
    expect(await code(file("just text", "cv.pdf"))).toBe("unsupported");
    expect(await code(new File([new Uint8Array(5 * 1024 * 1024 + 1)], "big.pdf"))).toBe("too_large");
  });
  it("reports corrupt PDFs instead of crashing", async () => expect(await code(file([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34, 1, 2, 3]))).toBe("corrupt"));
});
