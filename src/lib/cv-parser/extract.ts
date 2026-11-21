import { extractText, getDocumentProxy } from "unpdf";
import mammoth from "mammoth";
import { MAX_FILE_BYTES, MAX_TEXT_CHARS, MIN_TEXT_CHARS } from "@/lib/constants";

export type ExtractCode = "too_large" | "unsupported" | "empty" | "scanned" | "corrupt";
export class ExtractError extends Error { constructor(public code: ExtractCode) { super(code); } }
export type Kind = "pdf" | "docx";

/** Detect by magic bytes: filename and MIME type are user-controlled. */
export function sniffKind(b: Uint8Array): Kind | null {
  if (b.length > 4 && b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46) return "pdf";
  if (b.length > 4 && b[0] === 0x50 && b[1] === 0x4b && b[2] === 0x03 && b[3] === 0x04) return "docx";
  return null;
}

/** Entirely in memory: nothing is written to disk. */
export async function extractCvText(file: File): Promise<{ text: string; kind: Kind }> {
  if (file.size > MAX_FILE_BYTES) throw new ExtractError("too_large");
  if (file.size === 0) throw new ExtractError("empty");
  const bytes = new Uint8Array(await file.arrayBuffer());
  const kind = sniffKind(bytes);
  if (!kind) throw new ExtractError("unsupported");
  let text = "";
  try {
    if (kind === "pdf") text = (await extractText(await getDocumentProxy(bytes), { mergePages: true })).text;
    else text = (await mammoth.extractRawText({ buffer: Buffer.from(bytes) })).value;
  } catch { throw new ExtractError("corrupt"); }
  text = text.replace(/\u0000/g, "").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  if (text.length < MIN_TEXT_CHARS) throw new ExtractError(kind === "pdf" ? "scanned" : "empty");
  return { text: text.slice(0, MAX_TEXT_CHARS), kind };
}
