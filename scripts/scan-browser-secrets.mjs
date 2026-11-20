import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const browserRoots = [".next/static", "public"];
const sourceAndServerRoots = [
  ".next/server/app",
  ".next/server/chunks",
  "src/app",
  "src/components",
  "src/lib",
];

const browserForbiddenPatterns = [
  /SUPABASE_SERVICE_ROLE_KEY/i,
  /SERVICE_ROLE_KEY/i,
  /CUBID_API_KEY/i,
  /CUBID_DAPP_API_KEY/i,
  /PROVIDER_CALLBACK_SECRET/i,
  /MYPAYTAG_DAPP_SECRETS_JSON/i,
  /MYPAYTAG_PROVIDER_CALLBACK_SECRET/i,
  /DATABASE_URL/i,
  /POSTGRES(?:_PASSWORD|_URL)?/i,
  /NEXT_PUBLIC_.*(?:SECRET|SERVICE_ROLE|DATABASE|POSTGRES|PROVIDER_CALLBACK|CUBID_API_KEY)/i,
];

const sourceForbiddenPatterns = [
  /NEXT_PUBLIC_.*(?:SECRET|SERVICE_ROLE|DATABASE|POSTGRES|PROVIDER_CALLBACK|CUBID_API_KEY)/i,
  /sb_secret_[a-z0-9_-]+/i,
  /service_role_[a-z0-9_-]+/i,
  /postgres:\/\/[^"'\s]+/i,
  /-----BEGIN PRIVATE KEY-----/,
];

const findings = [];

for (const scanRoot of browserRoots) {
  await scanPath(path.join(root, scanRoot), browserForbiddenPatterns);
}

for (const scanRoot of sourceAndServerRoots) {
  await scanPath(path.join(root, scanRoot), sourceForbiddenPatterns);
}

if (findings.length > 0) {
  console.error("Browser secret scan failed:");
  for (const finding of findings) {
    console.error(`- ${path.relative(root, finding.file)} matched ${finding.pattern}`);
  }
  process.exit(1);
}

console.log("Browser secret scan passed.");

async function scanPath(target, patterns) {
  let info;
  try {
    info = await stat(target);
  } catch {
    return;
  }

  if (info.isDirectory()) {
    for (const entry of await readdir(target)) {
      await scanPath(path.join(target, entry), patterns);
    }
    return;
  }

  if (!isTextFile(target)) return;

  const text = await readFile(target, "utf8");
  for (const pattern of patterns) {
    if (pattern.test(text)) {
      findings.push({ file: target, pattern });
    }
  }
}

function isTextFile(file) {
  return /\.(js|mjs|cjs|jsx|ts|tsx|json|html|css|map|txt|md)$/.test(file);
}
