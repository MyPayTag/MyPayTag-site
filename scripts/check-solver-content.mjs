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

const phaseTwoAdapters = [
  "LI.FI",
  "Squid",
  "0x Cross-Chain API",
  "Across",
  "LayerZero / Stargate",
];

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

if (!homepage.includes("NEAR Intents / 1Click")) {
  throw new Error("Homepage solver section is missing NEAR Intents / 1Click");
}

if (!homepage.includes("Phase 1 MVP adapter") && !homepage.includes("Phase 1 execution adapter")) {
  throw new Error("Homepage does not label NEAR 1Click as Phase 1/MVP execution content");
}

if (!/NEAR 1Click[^.]{0,140}MVP swap and bridge execution adapter/i.test(homepage)) {
  throw new Error("Homepage does not describe NEAR 1Click as the MVP swap and bridge adapter");
}

const nearFutureOnlyPatterns = [
  /NEAR(?:\s+Intents|\s+1Click)?[^.]{0,160}(future-only|future only|non-MVP|not part of the MVP|outside the MVP)/i,
  /(future-only|future only|non-MVP|not part of the MVP|outside the MVP)[^.]{0,160}NEAR(?:\s+Intents|\s+1Click)?/i,
];

for (const pattern of nearFutureOnlyPatterns) {
  if (pattern.test(publicContent)) {
    throw new Error("Public solver content incorrectly frames NEAR 1Click as future-only or non-MVP");
  }
}

for (const adapter of phaseTwoAdapters) {
  if (homepage.includes(adapter) && !hasPhaseTwoHomepageCard(adapter)) {
    throw new Error(`Homepage mentions ${adapter} without a Phase 2 adapter label`);
  }
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

if (!homepage.includes('id="solver-adapters"')) {
  throw new Error("Homepage solver section is missing the solver-adapters anchor");
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

if (!homepage.includes("grid gap-4 md:grid-cols-2")) {
  throw new Error("Homepage solver card grid is missing the responsive mobile-to-desktop layout class");
}

if (!homepage.includes("max-w-7xl px-6")) {
  throw new Error("Homepage solver section is missing constrained responsive page padding");
}

console.log("solver_content_ok");

function hasPhaseTwoHomepageCard(adapterName) {
  const escaped = escapeRegExp(adapterName);
  const cardPattern = new RegExp(
    `phase:\\s*"Phase 2 adapter"[\\s\\S]{0,260}name:\\s*"${escaped}"|name:\\s*"${escaped}"[\\s\\S]{0,260}phase:\\s*"Phase 2 adapter"`,
  );

  return cardPattern.test(homepage);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
