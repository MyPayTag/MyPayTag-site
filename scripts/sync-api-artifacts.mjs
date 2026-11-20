import { copyFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";

const sdkRoot = resolve("../mypaytag-sdk");
const siteApiDir = resolve("public/api");

execFileSync("pnpm", ["api:postman"], { cwd: sdkRoot, stdio: "inherit" });

mkdirSync(siteApiDir, { recursive: true });
copyFileSync(resolve(sdkRoot, "api/openapi.yaml"), resolve(siteApiDir, "openapi.yaml"));
copyFileSync(
  resolve(sdkRoot, "api/postman_collection.json"),
  resolve(siteApiDir, "postman_collection.json"),
);

console.log("api_artifacts_synced");
