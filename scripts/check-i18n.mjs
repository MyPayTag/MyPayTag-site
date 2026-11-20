import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const namespacePath = path.join(repoRoot, "src/lib/i18n/namespaces.ts");
const resourcePath = path.join(repoRoot, "src/lib/i18n/resources.ts");

const namespaceSource = fs.readFileSync(namespacePath, "utf8");
const resourceSource = fs.readFileSync(resourcePath, "utf8");

const expectedKeys = collectNamespaceKeys(namespaceSource);
const locales = ["en", "sv"];
const failures = [];

for (const locale of locales) {
  const actualKeys = collectResourceKeys(resourceSource, locale);

  for (const [namespace, keys] of expectedKeys.entries()) {
    const actualNamespaceKeys = actualKeys.get(namespace) ?? new Set();

    for (const key of keys) {
      if (!actualNamespaceKeys.has(key)) {
        failures.push(`${locale}.${namespace}.${key} is missing`);
      }
    }

    for (const key of actualNamespaceKeys) {
      if (!keys.has(key)) {
        failures.push(`${locale}.${namespace}.${key} is orphaned`);
      }
    }
  }
}

if (!resourceSource.includes('"en-XA": enXA')) {
  failures.push("en-XA pseudo-locale export is missing");
}

for (const inlineFailure of findInlineShellStrings()) {
  failures.push(inlineFailure);
}

if (failures.length > 0) {
  console.error("i18n validation failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("i18n validation passed.");

function collectNamespaceKeys(source) {
  const keysBlock = extractBetween(
    source,
    "export const translationKeys = {",
    "} as const satisfies",
  );
  const namespaces = new Map();
  let currentNamespace = null;

  for (const line of keysBlock.split("\n")) {
    const namespaceMatch = line.match(/^  ([A-Za-z][A-Za-z0-9]*): \[/);

    if (namespaceMatch) {
      currentNamespace = namespaceMatch[1];
      namespaces.set(currentNamespace, new Set());
      continue;
    }

    const keyMatch = line.match(/^    "([^"]+)",/);

    if (keyMatch && currentNamespace) {
      namespaces.get(currentNamespace).add(keyMatch[1]);
    }
  }

  return namespaces;
}

function collectResourceKeys(source, locale) {
  const localeBlock = extractBetween(
    source,
    `const ${locale} = {`,
    "} satisfies TranslationResources;",
  );
  const resources = new Map();
  let currentNamespace = null;

  for (const line of localeBlock.split("\n")) {
    const namespaceMatch = line.match(/^  ([A-Za-z][A-Za-z0-9]*): \{/);

    if (namespaceMatch) {
      currentNamespace = namespaceMatch[1];
      resources.set(currentNamespace, new Set());
      continue;
    }

    const keyMatch = line.match(/^    ([A-Za-z][A-Za-z0-9]*):/);

    if (keyMatch && currentNamespace) {
      resources.get(currentNamespace).add(keyMatch[1]);
    }
  }

  return resources;
}

function extractBetween(source, start, end) {
  const startIndex = source.indexOf(start);

  if (startIndex === -1) {
    throw new Error(`Could not find start marker: ${start}`);
  }

  const endIndex = source.indexOf(end, startIndex);

  if (endIndex === -1) {
    throw new Error(`Could not find end marker: ${end}`);
  }

  return source.slice(startIndex + start.length, endIndex);
}

function findInlineShellStrings() {
  const checks = [
    {
      file: "src/components/navigation/site-header.tsx",
      forbidden: [
        "Tracks",
        "Enter Paytag",
        "API Docs",
        "Playground",
        "Sign in",
        "Sign out",
        "Log in as user",
        "Log in as developer",
      ],
    },
    {
      file: "src/components/navigation/back-button.tsx",
      forbidden: ["Back", "Go back"],
    },
    {
      file: "src/app/page.tsx",
      forbidden: [
        "Pay users, not wallet addresses",
        "A Paytag layer for crypto apps.",
        "Choose your track",
        "Read API docs",
        "Registered PayTo wallets",
        "No public mainnet PayTo wallet entries are available yet.",
      ],
    },
  ];

  const inlineFailures = [];

  for (const check of checks) {
    const source = fs.readFileSync(path.join(repoRoot, check.file), "utf8");

    for (const forbidden of check.forbidden) {
      if (
        source.includes(`"${forbidden}"`) ||
        source.includes(`'${forbidden}'`) ||
        source.includes(`>${forbidden}<`)
      ) {
        inlineFailures.push(`${check.file} still contains inline text: ${forbidden}`);
      }
    }
  }

  return inlineFailures;
}
