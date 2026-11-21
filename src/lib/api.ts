import { NextResponse } from "next/server";

export const fail = (status: number, code: string) => NextResponse.json({ error: { code } }, { status });
const hits = new Map<string, number[]>();
/** Per-instance limiter. Swap for Upstash/Redis if you run several instances: these routes cost money. */
export function limited(req: Request, bucket: string, max: number, windowMs = 10 * 60_000) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const k = `${bucket}:${ip}`, now = Date.now();
  const recent = (hits.get(k) ?? []).filter((t) => now - t < windowMs);
  recent.push(now); hits.set(k, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > max;
}
export async function readJson(req: Request, maxBytes = 400_000): Promise<unknown> {
  const raw = await req.text();
  if (raw.length > maxBytes) throw new Error("too_large");
  return JSON.parse(raw);
}
