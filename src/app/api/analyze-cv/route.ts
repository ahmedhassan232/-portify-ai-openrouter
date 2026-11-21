import { NextResponse } from "next/server";
import { z } from "zod";
import { AiError, aiConfigured, structured } from "@/lib/ai/openai";
import { analyzeSystem, analyzeUser } from "@/lib/ai/prompts";
import { fail, limited, readJson } from "@/lib/api";
import { CATEGORY_OF, MAX_TEXT_CHARS, MIN_TEXT_CHARS, PROFESSIONS } from "@/lib/constants";
import { toPortfolioData, warningsOf } from "@/lib/portfolio";
import { aiPortfolioSchema } from "@/schemas/portfolio";

export const runtime = "nodejs";
export const maxDuration = 60;
const body = z.object({ text: z.string().min(MIN_TEXT_CHARS).max(MAX_TEXT_CHARS), profession: z.enum(PROFESSIONS), language: z.enum(["en", "ar"]) });

export async function POST(req: Request) {
  if (limited(req, "ai", 8)) return fail(429, "rate_limited");
  let input: z.infer<typeof body>;
  try { const p = body.safeParse(await readJson(req, 200_000)); if (!p.success) return fail(422, "too_short"); input = p.data; } catch { return fail(400, "generic"); }
  if (!aiConfigured()) return fail(503, "not_configured");
  try {
    const ai = await structured(aiPortfolioSchema, "portfolio", analyzeSystem(input.language, CATEGORY_OF[input.profession]), analyzeUser(input.text));
    const data = toPortfolioData(ai);
    return NextResponse.json({ data, warnings: warningsOf(data) });
  } catch (e) {
    if (e instanceof AiError) return fail(e.code === "rate_limited" ? 429 : e.code === "timeout" ? 504 : 502, e.code);
    return fail(500, "generic");
  }
}
