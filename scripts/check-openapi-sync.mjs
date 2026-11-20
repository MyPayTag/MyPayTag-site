import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const siteSpec = readFileSync(resolve("public/api/openapi.yaml"), "utf8");
const sdkSpec = readFileSync(resolve("../mypaytag-sdk/api/openapi.yaml"), "utf8");

if (siteSpec !== sdkSpec) {
  throw new Error(
    "public/api/openapi.yaml is out of sync with ../mypaytag-sdk/api/openapi.yaml",
  );
}

console.log("openapi_sync_ok");
