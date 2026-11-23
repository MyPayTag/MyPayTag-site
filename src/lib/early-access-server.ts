import { createHmac } from "node:crypto";

export function waitlistBaseUrl(waitlist?: string, resolver?: string): string | undefined {
  return waitlist?.trim() || resolver?.trim() || undefined;
}

interface WaitlistOptions { baseUrl?: string; token?: string; fetcher?: typeof fetch }
const reply = (status: number) => Response.json({ status: status === 202 ? "accepted" : status === 429 ? "rate_limited" : "unavailable" }, { status, headers: { "cache-control": "no-store", ...(status === 429 ? { "retry-after": "900" } : {}) } });

async function readSignup(request: Request): Promise<unknown> {
  if (!request.body || Number(request.headers.get("content-length")) > 2048) throw new Error("size");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > 2048) { await reader.cancel(); throw new Error("size"); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return JSON.parse(new TextDecoder().decode(bytes));
}

export async function handleEarlyAccessSignup(request: Request, options: WaitlistOptions): Promise<Response> {
  if (request.method !== "POST") return reply(405);
  const origin = request.headers.get("origin");
  try {
    const parsed = new URL(origin ?? "");
    // Next may expose an internal route URL; Host retains the browser-facing origin.
    const host = request.headers.get("host") ?? new URL(request.url).host;
    if (parsed.origin !== origin || parsed.host !== host || !["https:", "http:"].includes(parsed.protocol)) return reply(403);
  } catch { return reply(403); }
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return reply(400);
  let input;
  try { input = await readSignup(request); } catch { return reply(400); }
  if (!input || typeof input !== "object" || Array.isArray(input)) return reply(400);
  const fields = input as Record<string, unknown>;
  // Hidden field absorbs automated submissions without storing them or exposing the trap.
  if (typeof fields.website === "string" && fields.website.length > 0) return reply(202);
  const email = typeof fields.email === "string" ? fields.email.trim().toLowerCase() : "";
  if (fields.consent !== true || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !["general", "user", "payor", "payee"].includes(String(fields.audience)) ||
    !["en", "sv", "en-XA"].includes(String(fields.locale))) return reply(400);
  const { baseUrl, token } = options;
  if (!baseUrl || !token || token.length < 32) return reply(503);
  // Hosting proxy headers are a rate-limit hint, never an authorization identity.
  const ip = request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unattributed";
  const rateKey = createHmac("sha256", token).update(ip).digest("hex");
  try {
    const response = await (options.fetcher ?? fetch)(`${baseUrl.replace(/\/$/, "")}/functions/v1/early-access`, {
      method: "POST", headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify({ email, audience: fields.audience, locale: fields.locale === "sv" ? "sv" : "en", rateKey, consent: true }),
      signal: AbortSignal.timeout(10000), cache: "no-store",
    });
    return reply(response.status === 202 ? 202 : response.status === 429 ? 429 : 503);
  } catch { return reply(503); }
}
