import { NextResponse } from "next/server";
import { z } from "zod";
import { AiError, aiConfigured, structured } from "@/lib/ai/openai";
import { changedSections, mergeImproved, mergeTranslated } from "@/lib/ai/merge";
import { dataUser, improveSystem, translateSystem } from "@/lib/ai/prompts";
import { fail, limited, readJson } from "@/lib/api";
import { CATEGORY_OF, PROFESSIONS } from "@/lib/constants";
import { toAiShape, toPortfolioData } from "@/lib/portfolio";
import { aiPortfolioSchema, portfolioDataSchema } from "@/schemas/portfolio";

export const runtime = "nodejs";
export const maxDuration = 60;
const body = z.object({
  task: z.enum(["improve", "translate"]), data: portfolioDataSchema,
  profession: z.enum(PROFESSIONS).nullable(), language: z.enum(["en", "ar"]),
});

export async function POST(req: Request) {
  if (limited(req, "ai", 8)) return fail(429, "rate_limited");
  let input: z.infer<typeof body>;
  try { const p = body.safeParse(await readJson(req, 350_000)); if (!p.success) return fail(422, "generic"); input = p.data; } catch { return fail(400, "generic"); }
  if (!aiConfigured()) return fail(503, "not_configured");
  try {
    const orig = toAiShape(input.data);
    const cat = CATEGORY_OF[input.profession ?? "other"];
    if (input.task === "improve") {
      const out = await structured(aiPortfolioSchema, "portfolio", improveSystem(input.language, cat), dataUser(orig));
      const merged = mergeImproved(orig, out);
      const changed = changedSections(orig, merged);
      return NextResponse.json({ data: { ...toPortfolioData(merged, input.data), aiImproved: changed } });
    }
    const out = await structured(aiPortfolioSchema, "portfolio", translateSystem(input.language), dataUser(orig));
    return NextResponse.json({ data: { ...toPortfolioData(mergeTranslated(orig, out), input.data), aiImproved: [] } });
  } catch (e) {
    if (e instanceof AiError) return fail(e.code === "rate_limited" ? 429 : e.code === "timeout" ? 504 : 502, e.code);
    return fail(500, "generic");
  }
}
