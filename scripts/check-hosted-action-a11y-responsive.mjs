import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const client = readFileSync(join(root, "src/components/hosted-action/route-selection-client.tsx"), "utf8");
const loader = readFileSync(join(root, "src/components/hosted-action/protected-route-selection-page.tsx"), "utf8");

const findings = [];

const requiredResponsiveClasses = [
  "sm:px-8",
  "lg:grid-cols",
  "sm:text-4xl",
  "sm:grid-cols-2",
  "sm:flex-row",
  "max-w-6xl",
  "max-w-lg",
];

for (const className of requiredResponsiveClasses) {
  if (!`${client}\n${loader}`.includes(className)) {
    findings.push(`Missing responsive layout class: ${className}`);
  }
}

const buttonCount = (client.match(/<button/g) ?? []).length;
const buttonTypeCount = (client.match(/type="button"/g) ?? []).length;
if (buttonCount === 0 || buttonCount !== buttonTypeCount) {
  findings.push("All interactive hosted-action buttons must declare type=\"button\".");
}

for (const icon of ["GitBranch", "CheckCircle2", "XCircle", "Circle", "LoaderCircle"]) {
  const iconPattern = new RegExp(`<${icon}[^>]+aria-hidden="true"`);
  if (!iconPattern.test(`${client}\n${loader}`)) {
    findings.push(`${icon} icon is missing aria-hidden="true".`);
  }
}

if (!client.includes("disabled={!isReady || pending}")) {
  findings.push("Submit buttons must be disabled when action state is not ready or submission is pending.");
}

if (!loader.includes("Loading route selection") || !loader.includes("Route selection unavailable")) {
  findings.push("Loading and unavailable states need visible text.");
}

if (/tracking-\[[^\]]*-\d/.test(client)) {
  findings.push("Negative letter spacing is not allowed in hosted action UI.");
}

if (!client.includes("leading-6") || !client.includes("leading-7")) {
  findings.push("Hosted action text should use explicit line height for readable wrapping.");
}

if (!client.includes("min-h-screen")) {
  findings.push("Hosted action page should reserve full viewport height.");
}

if (findings.length > 0) {
  console.error("Hosted action accessibility/responsive check failed:");
  for (const finding of findings) console.error(`- ${finding}`);
  process.exit(1);
}

console.log("hosted_action_a11y_responsive_ok");
