import OpenAI from "openai";
import { z } from "zod";

export type AiCode =
  | "not_configured"
  | "timeout"
  | "bad_output"
  | "rate_limited"
  | "generic";

export class AiError extends Error {
  constructor(public code: AiCode) {
    super(code);
  }
}

const apiKey =
  process.env.OPENROUTER_API_KEY ||
  process.env.OPENAI_API_KEY;

export const aiConfigured = () => Boolean(apiKey);

/** Structured AI call through OpenRouter. */
export async function structured<T extends z.ZodType>(
  schema: T,
  name: string,
  system: string,
  user: string
): Promise<z.output<T>> {
  if (!aiConfigured()) {
    throw new AiError("not_configured");
  }

  const client = new OpenAI({
    apiKey: apiKey!,
    baseURL:
      process.env.OPENROUTER_BASE_URL ||
      "https://openrouter.ai/api/v1",
    timeout: 45_000,
    maxRetries: 1,
    defaultHeaders: {
      "HTTP-Referer":
        process.env.OPENROUTER_SITE_URL ||
        "http://localhost:3000",
      "X-Title":
        process.env.OPENROUTER_APP_NAME ||
        "Portify AI",
    },
  });

  const { $schema: _s, ...jsonSchema } =
    z.toJSONSchema(schema) as Record<string, unknown>;

  try {
    const response = await client.chat.completions.create({
      model:
        process.env.OPENROUTER_MODEL ||
        process.env.OPENAI_MODEL ||
        "openai/gpt-4o-mini",

      temperature: 0.3,

      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],

      response_format: {
        type: "json_schema",
        json_schema: {
          name,
          strict: true,
          schema: jsonSchema,
        },
      },
    });

    const msg = response.choices[0]?.message;

    if (!msg?.content || msg.refusal) {
      throw new AiError("bad_output");
    }

    return schema.parse(JSON.parse(msg.content));

  } catch (e) {
    if (e instanceof AiError) throw e;

    if (e instanceof z.ZodError || e instanceof SyntaxError) {
      throw new AiError("bad_output");
    }

    if (e instanceof OpenAI.APIConnectionTimeoutError) {
      throw new AiError("timeout");
    }

    if (e instanceof OpenAI.RateLimitError) {
      throw new AiError("rate_limited");
    }

    console.error(
      "OpenRouter call failed:",
      e instanceof Error ? e.message : "unknown"
    );

    throw new AiError("generic");
  }
}