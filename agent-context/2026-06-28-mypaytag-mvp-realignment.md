# MyPayTag MVP Realignment Instruction

Date: 2026-06-28
Repo: `mypaytag-site`
Status: implementation instruction

## Cross-Repo Instruction Set

This is one of five coordinated instruction docs:

- `mypaytag-backend`: `/Users/botmaster/src/myPayTag/mypaytag-backend/agent-context/2026-06-28-mypaytag-mvp-realignment.md`
- `mypaytag-sdk`: `/Users/botmaster/src/myPayTag/mypaytag-sdk/agent-context/2026-06-28-mypaytag-mvp-realignment.md`
- `mypaytag-site`: `/Users/botmaster/src/myPayTag/mypaytag-site/agent-context/2026-06-28-mypaytag-mvp-realignment.md`
- `cubid-monorepo`: `/Users/botmaster/src/cubid/cubid-monorepo/agent-context/2026-06-28-mypaytag-mvp-realignment.md`
- `cubid-sdk-v2`: `/Users/botmaster/src/cubid/cubid-sdk-v2/agent-context/2026-06-28-mypaytag-mvp-realignment.md`

When touching this repo, read the other four docs first and preserve the ownership split.

## Naming Requirement

Request and implement the rename from `GlobalPayTo` / `globalpayto` / `gptr` language to `MyPayTag` / `mypaytag` / `mpt` in site copy, routes, links, examples, generated API artifacts, docs, metadata, browser-visible IDs, test names, and public repo links. Fix stale links such as GitHub org/repo URLs that still point at the old name.

## Product Boundary

Do not back out broader MyPayTag messaging merely because some content promises more than the MVP. Keep the future-facing story, but prevent the app from implying that non-MVP solver/execution behavior is required or already available in production.

This repo owns:

- Public MyPayTag site and developer education.
- Browser-safe hosted MyPayTag route-selection views.
- Signed-in MyPayTag incoming history.
- API documentation views generated from `mypaytag-sdk` artifacts.
- Playground UX that can demonstrate MVP flows and clearly mark future simulations.

This repo does not own:

- Private resolver logic, provider credentials, Supabase schema, service-role writes, provider callbacks, or wallet/payment execution.
- Cubid paytag identity management, stamp elevation, opaque paytag creation, or Cubid grant UX except as links/redirects to Cubid-owned flows.

## Product Decisions To Preserve

- A paytag is a MyPayTag-branded payment identity powered by Cubid identity and consent primitives.
- Paytags should feel universal and global to PayingDapps. PayingDapps pay a paytag through MyPayTag, not a Cubid identity or wallet address.
- Implementation may initially default to PayToDapp-scoped identifiers behind the scenes.
- Opaque paytags are the default, for example `abd123@cubid.mypaytag`.
- Raw stamp-based paytags, for example `+1234569999@phone.cubid.mypaytag`, are allowed only when the user explicitly chooses that exposure.
- MyPayTag validates paytag uniqueness and availability before issuance so future non-Cubid identity providers can fit the model.
- MVP supports multiple paytags per user, each initially mapped to one Cubid stamp or opaque Cubid-backed alias.
- Signed-in history is useful but secondary to route registration, resolve, provider callback, consent, and negative-disclosure hardening.
- Launch readiness requires local tests first, then hosted staging smoke across Cubid, MyPayTag, one test PayingDapp, and one test PayToDapp.

## Site Work Required

1. Keep the broader story but label MVP vs future.
   - Solver, bridge, swap, quote fanout, and preferred solver content may remain.
   - Mark those sections as execution-adapter/future capability where they appear.
   - Ensure the primary developer path teaches the MVP: paytag -> MyPayTag route selection -> PayToDapp provider intent.
   - Present solver and bridge material as future positioning, not part of core MVP flow.

2. Align API docs with the corrected SDK contract.
   - Sync `public/api/openapi.yaml` and Postman artifacts from `mypaytag-sdk`.
   - Do not hand-edit generated API artifacts.
   - Remove or rewrite examples that show weak payment intent payloads or imply MyPayTag has already executed settlement.

3. Fix hosted route-selection UX.
   - Hosted route-selection pages should only hydrate browser-safe action data after action validation and user sign-in.
   - They should show only route options relevant to the current action and current user.
   - They must not show wallet graph data, unrelated PayToDapps, or Cubid identifiers.

4. Link to Cubid for Cubid-owned identity work.
   - If the user must elevate a stamp to a paytag or create an opaque paytag, send them to a Cubid-owned flow.
   - Do not implement Cubid grant/stamp management inside MyPayTag.
   - MyPayTag copy should say Cubid owns identity and consent; MyPayTag owns payment route preference and provider intent orchestration.
   - Keep user-facing "Paytag" branding primarily in MyPayTag. Describe Cubid as powering verified identity, consent, and aliases.

5. Harden playground wording.
   - MVP calls should use real MyPayTag API contracts.
   - Solver quote simulation may remain, but it must be visibly a simulation/non-MVP extension.
   - Do not imply Cubid receives wallet/payment details.
   - Ensure PayingDapp examples call MyPayTag rather than Cubid directly.

6. Validation target.
   - Run lint/typecheck/test/build as available.
   - Run the existing browser secret scan and OpenAPI sync checks after API artifact changes.

## Done Means

This repo is realigned when a developer can understand and test the MVP flow without being misled about Cubid ownership, wallet execution, settlement, or solver readiness, while still seeing the future execution-adapter direction as optional and non-MVP.
