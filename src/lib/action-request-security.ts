const routeActionPattern = /^mpt_act_[a-z0-9_-]{3,80}$/;

export function isValidHostedActionId(actionId: string): boolean {
  return routeActionPattern.test(actionId);
}

export function isSameOriginActionPost(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") ?? "http";
  if (!host) return false;

  return origin === `${protocol}://${host}`;
}

export function invalidActionResponse() {
  return Response.json(
    { state: "restart_required" },
    {
      status: 400,
      headers: {
        "cache-control": "no-store",
      },
    },
  );
}
