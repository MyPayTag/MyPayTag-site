import { cubidPublicConfig } from "@/lib/cubid/public-config";
import { cubidOidcPaths, cubidStagingIssuer } from "@/lib/cubid/staging-oidc";

type Context = RouteContext<"/api/cubid/oidc/[endpoint]">;
const noStore = { "cache-control": "no-store" };

export async function GET(request: Request, context: Context) {
  const { endpoint } = await context.params;
  if (cubidPublicConfig.issuer !== cubidStagingIssuer) return error(404, "not_found");

  switch (endpoint) {
    case "discovery":
    case "jwks":
      return forward(cubidOidcPaths[endpoint]);
    case "userinfo": {
      const authorization = request.headers.get("authorization");
      if (!authorization?.startsWith("Bearer ")) return error(401, "invalid_token");
      return forward(cubidOidcPaths.userinfo, { headers: { authorization } });
    }
    default:
      return error(404, "not_found");
  }
}

export async function POST(request: Request, context: Context) {
  const { endpoint } = await context.params;
  if (cubidPublicConfig.issuer !== cubidStagingIssuer || endpoint !== "token") {
    return error(404, "not_found");
  }
  const origin = request.headers.get("origin");
  if (origin && origin !== URL.parse(cubidPublicConfig.redirectUri)?.origin) {
    return error(403, "invalid_request");
  }
  if (!request.headers.get("content-type")?.startsWith("application/x-www-form-urlencoded")) {
    return error(415, "invalid_request");
  }

  const form = new URLSearchParams(await request.text());
  const code = form.get("code");
  const verifier = form.get("code_verifier");
  if (
    form.get("grant_type") !== "authorization_code" ||
    form.get("client_id") !== cubidPublicConfig.clientId ||
    form.get("redirect_uri") !== cubidPublicConfig.redirectUri ||
    !code || !verifier
  ) {
    return error(400, "invalid_request");
  }

  return forward(cubidOidcPaths.token, {
    method: "POST",
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: cubidPublicConfig.clientId,
      redirect_uri: cubidPublicConfig.redirectUri,
      code,
      code_verifier: verifier,
    }),
  });
}

async function forward(path: string, init?: RequestInit) {
  try {
    const upstream = await fetch(new URL(path, cubidStagingIssuer), {
      ...init,
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(10000),
    });
    return new Response(upstream.body, {
      status: upstream.status,
      headers: {
        ...noStore,
        "content-type": upstream.headers.get("content-type") ?? "application/json",
      },
    });
  } catch {
    return error(502, "temporarily_unavailable");
  }
}

function error(status: number, code: string) {
  return Response.json({ error: code }, { status, headers: noStore });
}
