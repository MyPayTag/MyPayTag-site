import {
  getRouteSelectionAction,
  type HostedActionState,
  type RouteSelectionAction,
} from "@/lib/mock-actions";

type HostedActionKind = "route_selection";
type HostedActionDecision = "select_route" | "leave_unchanged";

interface HostedActionCompletion {
  state: HostedActionState;
  selectedRouteId?: string;
}

const resolverBaseUrl = process.env.MYPAYTAG_RESOLVER_BASE_URL;
const devCubidUserId = process.env.MYPAYTAG_DEV_CUBID_USER_ID;
const hostedActionMockMode = process.env.MYPAYTAG_HOSTED_ACTION_MOCK_MODE === "true";

export async function getHostedRouteSelectionAction(actionId: string): Promise<RouteSelectionAction> {
  const action = await getHostedAction(actionId, "route_selection", () =>
    getRouteSelectionAction(actionId),
  );

  return sanitizeRouteSelectionAction(action);
}

export async function submitHostedAction(input: {
  actionId: string;
  kind: HostedActionKind;
  decision: HostedActionDecision;
  selectedRouteId?: string;
}): Promise<HostedActionCompletion> {
  if (!resolverBaseUrl) {
    return completeMockHostedAction(input);
  }

  try {
    const response = await fetch(`${resolverBaseUrl}/functions/v1/route-selection`, {
      method: "POST",
      headers: backendHeaders(),
      body: JSON.stringify(input),
      cache: "no-store",
    });

    if (!response.ok) return completeMockHostedAction(input);
    return await response.json() as HostedActionCompletion;
  } catch {
    return completeMockHostedAction(input);
  }
}

export function redactActionUrlForLogs(url: string): string {
  return url.replace(/\/actions\/route-selection\/[^/?#]+/g, "/actions/route-selection/[redacted]");
}

async function getHostedAction<T>(
  actionId: string,
  kind: HostedActionKind,
  fallback: () => T,
): Promise<T> {
  if (!resolverBaseUrl) return getMockHostedAction(actionId, kind, fallback);

  const url = new URL(`${resolverBaseUrl}/functions/v1/hosted-actions`);
  url.searchParams.set("actionId", actionId);
  url.searchParams.set("kind", kind);

  try {
    const response = await fetch(url, {
      headers: backendHeaders(),
      cache: "no-store",
    });

    if (!response.ok) return getMockHostedAction(actionId, kind, fallback);
    return await response.json() as T;
  } catch {
    return getMockHostedAction(actionId, kind, fallback);
  }
}

function backendHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    "content-type": "application/json",
  };

  if (devCubidUserId && isLocalOrTestRuntime()) {
    headers["x-mypaytag-dev-cubid-user-id"] = devCubidUserId;
  }

  return headers;
}

function isLocalOrTestRuntime(): boolean {
  return process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test";
}

function canUseMockHostedActions(): boolean {
  return hostedActionMockMode && isLocalOrTestRuntime();
}

function getMockHostedAction<T>(
  actionId: string,
  kind: HostedActionKind,
  fallback: () => T,
): T {
  if (!canUseMockHostedActions()) {
    return restartRequiredAction(actionId) as T;
  }

  console.warn(
    `[mypaytag] MYPAYTAG_HOSTED_ACTION_MOCK_MODE=true; using local ${kind} fixture for ${actionId}.`,
  );
  return {
    ...fallback(),
    mockMode: true,
  };
}

function completeMockHostedAction(input: {
  actionId: string;
  kind: HostedActionKind;
  decision: HostedActionDecision;
  selectedRouteId?: string;
}): HostedActionCompletion {
  if (!canUseMockHostedActions()) return { state: "restart_required" };

  console.warn(
    `[mypaytag] MYPAYTAG_HOSTED_ACTION_MOCK_MODE=true; completing local ${input.kind} fixture for ${input.actionId}.`,
  );
  const action = getRouteSelectionAction(input.actionId);
  if (action.state !== "ready") return { state: "restart_required" };
  const options = action.paths.flatMap((path) => path.options);
  if (
    input.decision === "select_route" &&
    !options.some((option) => option.id === input.selectedRouteId)
  ) {
    return { state: "restart_required" };
  }

  return {
    state: input.decision === "select_route" ? "selected_route" : "denied",
    selectedRouteId: input.selectedRouteId,
  };
}

function restartRequiredAction(actionId: string): RouteSelectionAction {
  return {
    id: actionId,
    state: "restart_required",
    maskedIdentifier: "Hidden",
    paths: [],
    expiresAt: "Unavailable",
  };
}

function sanitizeRouteSelectionAction(action: RouteSelectionAction): RouteSelectionAction {
  if (action.state === "ready") return action;

  return {
    ...action,
    maskedIdentifier: "Hidden",
    paths: [],
  };
}
