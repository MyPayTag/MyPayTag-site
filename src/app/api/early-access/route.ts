import { handleEarlyAccessSignup } from "@/lib/early-access-server";

export const runtime = "nodejs";
export async function POST(request: Request) {
  return handleEarlyAccessSignup(request, {
    baseUrl: process.env.MYPAYTAG_WAITLIST_BASE_URL ?? process.env.MYPAYTAG_RESOLVER_BASE_URL,
    token: process.env.MYPAYTAG_WAITLIST_TOKEN,
  });
}
