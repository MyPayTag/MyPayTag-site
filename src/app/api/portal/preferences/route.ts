import { NextResponse } from "next/server";

const resolverBaseUrl = process.env.MYPAYTAG_RESOLVER_BASE_URL;

export async function GET(request: Request) {
  return proxyPortalPreferences(request);
}

export async function PUT(request: Request) {
  return proxyPortalPreferences(request, await request.text());
}

async function proxyPortalPreferences(request: Request, bodyText?: string) {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) {
    return NextResponse.json({ status: "authorization_required" }, { status: 401 });
  }
  if (!resolverBaseUrl) {
    return NextResponse.json({ status: "backend_unavailable" }, { status: 503 });
  }

  try {
    const response = await fetch(`${resolverBaseUrl}/functions/v1/portal-preferences`, {
      method: request.method,
      headers: {
        authorization,
        "content-type": "application/json",
      },
      body: bodyText,
      cache: "no-store",
    });
    const payload = await response.json().catch(() => ({ status: "backend_unavailable" }));
    return NextResponse.json(payload, { status: response.status });
  } catch {
    return NextResponse.json({ status: "backend_unavailable" }, { status: 503 });
  }
}
