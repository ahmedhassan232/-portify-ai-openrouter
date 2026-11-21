import { NextResponse } from "next/server";
import { ExtractError, extractCvText } from "@/lib/cv-parser/extract";
import { detectLanguage, suggestProfession, wordCount } from "@/lib/cv-parser/heuristics";
import { fail, limited } from "@/lib/api";

export const runtime = "nodejs";
// OCR can take longer than plain text extraction, especially on multi-page scans.
export const maxDuration = 60;

export async function POST(req: Request) {
  if (limited(req, "extract", 20)) return fail(429, "rate_limited");
  let file: File | null = null;
  try { const f = (await req.formData()).get("file"); file = f instanceof File ? f : null; } catch { return fail(400, "generic"); }
  if (!file) return fail(400, "generic");
  try {
    const { text } = await extractCvText(file); // the file object goes out of scope after this: nothing persisted
    return NextResponse.json({ text, words: wordCount(text), detectedLang: detectLanguage(text), suggestedProfession: suggestProfession(text) });
  } catch (e) {
    if (e instanceof ExtractError) return fail(e.code === "too_large" ? 413 : e.code === "unsupported" ? 415 : 422, e.code);
    console.error("extract failed:", e instanceof Error ? e.name : "unknown");
    return fail(500, "generic");
  }
}
