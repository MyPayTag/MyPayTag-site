import assert from "node:assert/strict";
import { test } from "node:test";
import { handleEarlyAccessSignup, waitlistBaseUrl } from "../src/lib/early-access-server.ts";
const valid = { email: " Reader@Example.COM ", audience: "user", locale: "sv", consent: true, website: "" };
const request = (body, origin = "https://mypaytag.example") => new Request("https://mypaytag.example/api/early-access", { method: "POST", headers: { origin, "content-type": "application/json", "x-real-ip": "192.0.2.1" }, body: JSON.stringify(body) });
const options = { baseUrl: "https://backend.example", token: "test-only-waitlist-token-with-32-characters" };
test("signup normalizes input and sends only bounded server-owned fields", async () => {
  let sent;
  const response = await handleEarlyAccessSignup(request(valid), { ...options, fetcher: async (url, init) => { sent = JSON.parse(init.body); assert.equal(url, "https://backend.example/functions/v1/early-access"); return new Response(null,{status:202}); } });
  assert.equal(response.status,202); assert.equal(sent.email,"reader@example.com"); assert.equal(sent.locale,"sv"); assert.match(sent.rateKey,/^[a-f0-9]{64}$/); assert.equal(JSON.stringify(sent).includes("192.0.2.1"),false);
  assert.deepEqual(Object.keys(sent).sort(),["audience","consent","email","locale","rateKey"]);
});
test("signup rejects cross-origin, invalid consent and oversized input before upstream", async () => {
  let calls=0; const config={...options,fetcher:async()=>{calls++;throw new Error("unexpected");}};
  assert.equal((await handleEarlyAccessSignup(request(valid,"https://other.example"),config)).status,403);
  for(const body of [{...valid,consent:false},{...valid,email:"invalid"},{...valid,email:"x".repeat(2200)},null]) assert.equal((await handleEarlyAccessSignup(request(body),config)).status,400);
  assert.equal(calls,0);
});
test("honeypot does not call backend; absent configuration never pretends to save", async () => {
  assert.equal((await handleEarlyAccessSignup(request({...valid,website:"bot"}),{})).status,202);
  assert.equal((await handleEarlyAccessSignup(request(valid),{})).status,503);
});
test("upstream rate/error data is reduced to a private-safe generic response", async () => {
  const rate=await handleEarlyAccessSignup(request(valid),{...options,fetcher:async()=>new Response("private",{status:429})});
  assert.equal(rate.status,429);assert.equal(rate.headers.get("retry-after"),"900");
  const error=await handleEarlyAccessSignup(request(valid),{...options,fetcher:async()=>{throw new Error("private");}});
  assert.equal(error.status,503);assert.deepEqual(await error.json(),{status:"unavailable"});
});

test("same-origin survives a framework internal URL while Host remains public", async () => {
  const req = new Request("http://localhost:3074/api/early-access",{method:"POST",headers:{host:"127.0.0.1:3074",origin:"http://127.0.0.1:3074","content-type":"application/json"},body:JSON.stringify(valid)});
  assert.equal((await handleEarlyAccessSignup(req,{})).status,503);
});

test("optional waitlist URL uses resolver fallback for blank environment values", () => {
  for (const value of [undefined, "", "   "]) assert.equal(waitlistBaseUrl(value, "https://resolver.example"), "https://resolver.example");
  assert.equal(waitlistBaseUrl(" https://waitlist.example ", "https://resolver.example"), "https://waitlist.example");
  assert.equal(waitlistBaseUrl("", ""), undefined);
});
