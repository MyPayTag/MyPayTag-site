import { NextResponse } from "next/server";

const resolverBaseUrl = process.env.MYPAYTAG_RESOLVER_BASE_URL;

export async function GET(request: Request) {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) {
    return NextResponse.json({ status: "authorization_required" }, { status: 401 });
  }
  if (!resolverBaseUrl) {
    return NextResponse.json({ status: "backend_unavailable" }, { status: 503 });
  }

  const requestUrl = new URL(request.url);
  const backendUrl = new URL(`${resolverBaseUrl}/functions/v1/portal-history`);
  requestUrl.searchParams.forEach((value, key) => backendUrl.searchParams.set(key, value));

  try {
    const response = await fetch(backendUrl, {
      headers: { authorization },
      cache: "no-store",
    });
    const payload = await response.json().catch(() => ({ status: "backend_unavailable" }));
    return NextResponse.json(payload, { status: response.status });
  } catch {
    return NextResponse.json({ status: "backend_unavailable" }, { status: 503 });
  }
}
