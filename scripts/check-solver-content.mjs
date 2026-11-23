import { readFileSync } from "node:fs";
import { join } from "node:path";

const repoRoot = process.cwd();
const homepage = readFileSync(join(repoRoot, "src/components/home/home-page.tsx"), "utf8");
const playgroundRoute = readFileSync(join(repoRoot, "src/app/api/playground/call/route.ts"), "utf8");
const playgroundExamples = readFileSync(join(repoRoot, "src/lib/playground/examples.ts"), "utf8");
const explainer = readFileSync(
  join(repoRoot, "docs/engineering/solver-adapter-developer-explainer.md"),
  "utf8",
);

const forbiddenPatterns = [
  /mypaytag\/docs/i,
  /service[- ]role/i,
  /SUPABASE_SERVICE/i,
  /PROVIDER_CALLBACK/i,
  /DATABASE_URL/i,
  /provider credential/i,
  /private resolver env/i,
];

const publicContent = `${homepage}\n${explainer}`;
for (const pattern of forbiddenPatterns) {
  if (pattern.test(publicContent)) {
    throw new Error(`Solver public content contains forbidden private-boundary term: ${pattern}`);
  }
}

// The role-marketing brief moves execution detail out of the shared homepage.
if (homepage.includes("solverCards") || homepage.includes("registeredPayToWallets")) {
  throw new Error("Shared homepage must not include developer catalogs or example adoption claims");
}
if (!/NEAR 1Click[\s\S]{0,400}MVP/i.test(explainer)) {
  throw new Error("Developer explainer must retain the NEAR 1Click MVP boundary");
}

const phaseTwoExplainerRequirements = [
  "LI.FI",
  "Squid",
  "0x Cross-Chain API",
  "Across",
  "LayerZero / Stargate",
  "broad solver fanout",
  "generic external adapters",
];

for (const term of phaseTwoExplainerRequirements) {
  if (!new RegExp(`Phase 2:[\\s\\S]{0,220}${escapeRegExp(term)}`, "i").test(explainer)) {
    throw new Error(`Solver explainer does not label ${term} as Phase 2`);
  }
}

if (!playgroundRoute.includes("MYPAYTAG_PLAYGROUND_PHASE2_DEMO_MODE")) {
  throw new Error("Playground broad solver fanout is missing an explicit Phase 2 demo gate");
}

if (!/simulateQuotes[\s\S]{0,600}Phase 2/i.test(playgroundExamples)) {
  throw new Error("Playground broad solver fanout example is not visibly labeled Phase 2");
}

if (/simulateQuotes[\s\S]{0,600}\bis (?:an? )?MVP backend path\b/i.test(playgroundExamples)) {
  throw new Error("Playground broad solver fanout example must not be described as an MVP backend path");
}

console.log("solver_content_ok");

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
