import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const client = readFileSync(join(root, "src/components/hosted-action/route-selection-client.tsx"), "utf8");
const loader = readFileSync(join(root, "src/components/hosted-action/protected-route-selection-page.tsx"), "utf8");
const mockActions = readFileSync(join(root, "src/lib/mock-actions.ts"), "utf8");
const hostedActions = readFileSync(join(root, "src/lib/hosted-actions.ts"), "utf8");

const requiredStates = [
  "ready",
  "denied",
  "selected_route",
  "expired",
  "invalid",
  "completed",
  "restart_required",
];

const requiredMockActions = [
  "mpt_act_route_demo",
  "mpt_act_expired",
  "mpt_act_invalid",
  "mpt_act_completed",
  "mpt_act_denied",
];

const requiredCopy = [
  "Choose receive defaults",
  "No default changed",
  "Default saved",
  "This link expired",
  "This link cannot be used",
  "This action is complete",
  "Restart required",
];

const findings = [];

for (const state of requiredStates) {
  if (!client.includes(`${state}:`)) {
    findings.push(`Route selection copy is missing state: ${state}`);
  }
}

for (const actionId of requiredMockActions) {
  if (!mockActions.includes(`"${actionId}"`)) {
    findings.push(`Mock action fixture is missing ${actionId}`);
  }
}

for (const copy of requiredCopy) {
  if (!client.includes(copy)) {
    findings.push(`Route selection UI copy is missing "${copy}"`);
  }
}

for (const decision of ["select_route", "leave_unchanged"]) {
  if (!client.includes(decision) || !hostedActions.includes(decision)) {
    findings.push(`Hosted action decision is not wired end-to-end: ${decision}`);
  }
}

if (!client.includes("selectedRouteId") || !hostedActions.includes("selectedRouteId")) {
  findings.push("Selected route submission is not wired through the client and backend helper.");
}

if (!loader.includes("Sign in to choose receive routes")) {
  findings.push("Route-selection loader does not require signed-in user context.");
}

if (!hostedActions.includes('maskedIdentifier: "Hidden"') || !hostedActions.includes("paths: []")) {
  findings.push("Non-ready hosted-action states are not sanitized before rendering.");
}

if (!hostedActions.includes("MYPAYTAG_HOSTED_ACTION_MOCK_MODE")) {
  findings.push("Hosted action mock fallback is not gated by an explicit local mock-mode environment variable.");
}

if (!hostedActions.includes("canUseMockHostedActions") || !hostedActions.includes("restartRequiredAction")) {
  findings.push("Hosted action backend failures must fail closed outside explicit local mock mode.");
}

if (!client.includes("Local mock mode is on")) {
  findings.push("Route selection UI does not visibly label local mock-mode fixtures.");
}

if (/CUBID_API_KEY|SUPABASE_SERVICE|PROVIDER_CALLBACK|DATABASE_URL/.test(`${client}\n${loader}\n${mockActions}\n${hostedActions}`)) {
  findings.push("Hosted action code references server-only secret names.");
}

if (!client.includes("Receive channels are hidden for this action state.")) {
  findings.push("Terminal action states need visible safe empty-state copy.");
}

if (findings.length > 0) {
  console.error("Hosted action acceptance check failed:");
  for (const finding of findings) console.error(`- ${finding}`);
  process.exit(1);
}

console.log("hosted_action_acceptance_ok");
