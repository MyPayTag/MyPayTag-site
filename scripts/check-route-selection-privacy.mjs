import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const files = [
  "src/components/hosted-action/route-selection-client.tsx",
  "src/app/actions/route-selection/[actionId]/page.tsx",
  "src/app/api/actions/route-selection/[actionId]/route.ts",
  "src/lib/mock-actions.ts",
  "src/lib/hosted-actions.ts",
];

const forbidden = [
  { name: "wallet address", pattern: /0x[a-fA-F0-9]{6,}/ },
  { name: "route count", pattern: /route\s*count|routeCount/i },
  { name: "provider internals", pattern: /provider\s+internal|providerInternals|callback secret/i },
  { name: "private diagnostics", pattern: /private\s+diagnostic|stack trace|sqlstate/i },
  { name: "wallet graph claim", pattern: /wallet\s+graph/i },
  { name: "profile directory claim", pattern: /profile\s+directory|searchable\s+profile/i },
  { name: "prior account or transaction details", pattern: /fromAccount|lastTransaction|Last facilitated/i },
];

const findings = [];

for (const file of files) {
  const absolute = path.join(root, file);
  const text = await readFile(absolute, "utf8");
  for (const rule of forbidden) {
    if (rule.pattern.test(text)) {
      findings.push(`${file}: ${rule.name}`);
    }
  }
}

if (findings.length > 0) {
  console.error("Route-selection privacy check failed:");
  for (const finding of findings) console.error(`- ${finding}`);
  process.exit(1);
}

console.log("Route-selection privacy check passed.");
