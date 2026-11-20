import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const docRoots = [
  "README.md",
  "docs",
  "src/app/api-docs/page.tsx",
  "src/app/page.tsx",
  "src/lib/blog-posts.ts",
  "src/lib/playground/examples.ts",
  "public/api/openapi.yaml",
  "public/api/postman_collection.json",
];

const forbidden = [
  { name: "private backend path", pattern: /\/Users\/botmaster\/src\/myPayTag\/mypaytag-backend/i },
  { name: "private backend repo link", pattern: /mypaytag-backend/i },
  { name: "SQL schema detail", pattern: /\b(create table|alter table|row level security|rls policy)\b/i },
  { name: "service-role env name", pattern: /SUPABASE_SERVICE|SERVICE_ROLE_KEY/i },
  { name: "provider callback secret detail", pattern: /PROVIDER_CALLBACK|callback secret/i },
  { name: "database credential", pattern: /DATABASE_URL/i },
  { name: "private audit detail", pattern: /audit_(log|event|trail)|private audit table/i },
  { name: "admin tool detail", pattern: /admin cli|admin token|admin secret/i },
  { name: "legacy public identifier contract", pattern: /identifierType["']?\s*:\s*["']verified_stamp["']/i },
];

const allowlistedInstructionFiles = new Set([
  "docs/engineering/hosted-user-actions-architecture.md",
]);

const files = [];
for (const entry of docRoots) {
  collectFiles(join(root, entry));
}

const findings = [];
for (const file of files) {
  const rel = relative(root, file);
  const text = readFileSync(file, "utf8");

  for (const rule of forbidden) {
    if (rule.pattern.test(text) && !allowlistedInstructionFiles.has(rel)) {
      findings.push(`${rel}: ${rule.name}`);
    }
  }
}

function collectFiles(path) {
  const stat = statSync(path);
  if (stat.isFile()) {
    if (/\.(md|mdx|tsx?)$/.test(path)) files.push(path);
    return;
  }

  for (const child of readdirSync(path)) {
    collectFiles(join(path, child));
  }
}

if (findings.length > 0) {
  console.error("Public docs scan failed:");
  for (const finding of findings) console.error(`- ${finding}`);
  process.exit(1);
}

console.log("public_docs_scan_ok");
