# MyPayTag Site TODO

This document tracks MVP implementation work for the public user-facing site and hosted action flows.

## Sprint 1: SDK And API Design Alignment

### GPTW-S1-T1 Finalize Hosted Action Page Contract

Status: Complete  
Feature branch: main  
Session log: agent-context/session-log/main.md  
Depends on: mypaytag-sdk:GPTS-S1-T1, mypaytag-sdk:GPTS-S1-T2, mypaytag-sdk:GPTS-S1-T3, mypaytag-sdk:GPTS-S1-T7

Define the browser-facing contract for hosted route-selection actions.

Acceptance notes:

- Page inputs use opaque action identifiers or short-lived action tokens.
- Page outputs cover user denied, selected route/default, expired action, invalid action, and restart-required states.
- Notification-triggered visits from Cubid comms use the same safe action identifier model.
- Contract does not require direct production Supabase access from the public site.

### GPTW-S1-T2 Define Browser-Safe Runtime Configuration

Status: Complete  
Feature branch: main  
Session log: agent-context/session-log/main.md  
Depends on: TBD

Define which environment variables and runtime settings are browser-safe for the public site.

Acceptance notes:

- Browser-safe values use `NEXT_PUBLIC_*`.
- Resolver secrets, Cubid dapp API keys, service-role keys, provider callback credentials, and database credentials stay out of browser env vars and client bundles.
- README setup guidance reflects the MyPayTag hosted-action role rather than only the Cubid starter baseline.

### GPTW-S1-T3 Define Public Copy For Resolver Statuses And Notifications

Status: Complete  
Feature branch: main  
Session log: agent-context/session-log/main.md  
Depends on: mypaytag-sdk:GPTS-S1-T1, mypaytag-sdk:GPTS-S1-T7

Define user-facing copy for resolver statuses and Cubid comms notifications that may appear in hosted action flows.

Acceptance notes:

- Copy explains route selection, expired/invalid links, authorization-required, no-route, and provider-unavailable states.
- Copy covers the MVP `payment_intent_created` notification event.
- Copy avoids exposing private diagnostic details.
- Copy avoids implying a wallet graph or public profile exists.
- Provider-reported receipt copy and Cubid-comms-driven user-action notification copy are deferred until those events have explicit trust and disclosure contracts.

## Sprint 2: App Design And Implementation

### GPTW-S2-T1 Design Send-To Channel Defaults

Status: Complete  
Feature branch: main  
Session log: agent-context/session-log/main.md  
Depends on: mypaytag-site:GPTW-S1-T1

Design the send-to channel model where requesting apps are enabled by default and users manage receive-route preferences.

Acceptance notes:

- Flow does not ask users to approve every requesting app.
- Flow keeps route-selection details unavailable until backend action validation and Cubid user authentication have succeeded.
- Flow leaves revocation and channel management to Cubid-owned or future management surfaces.

### GPTW-S2-T2 Remove Authorization And Setup Pages

Status: Complete  
Feature branch: main  
Session log: agent-context/session-log/main.md  
Depends on: mypaytag-site:GPTW-S2-T1

Remove hosted authorization/setup pages from the public site.

Acceptance notes:

- Public routes do not include `/actions/setup/[actionId]`.
- The homepage does not link to setup approval actions.
- Route-selection pages remain browser-safe and do not write directly to production Supabase.

### GPTW-S2-T3 Design Route Selection Flow

Status: Complete  
Feature branch: main  
Session log: agent-context/session-log/main.md  
Depends on: mypaytag-site:GPTW-S1-T1

Design the route-selection flow for choosing a default when multiple PayToDapps support the same route.

Acceptance notes:

- Flow shows the route, eligible PayToDapps, current default when one exists, and effect of choosing a default.
- Flow avoids showing unrelated routes, wallet addresses, provider internals, or broader payment graph details.
- Flow has clear handling for expired and invalid action links.
- Route options and defaults are fetched only after action-token validation and user authentication.
- Route/provider details are never embedded in the unauthenticated URL.

### GPTW-S2-T4 Implement Route Selection Pages

Status: Complete  
Feature branch: main  
Session log: agent-context/session-log/main.md  
Depends on: mypaytag-site:GPTW-S2-T3

Implement hosted route-selection pages in the public site.

Acceptance notes:

- Pages support selecting and submitting a route/default choice.
- Pages handle expired, invalid, denied, and completed states safely.
- Pages keep route details limited to the current user action.
- Sprint 3 save must post to the backend and re-check selected PayToDapp eligibility and default tuple state before showing `selected_route`.

### GPTW-S2-T5 Remove Starter-Only UI That Conflicts With MyPayTag MVP

Status: Complete  
Feature branch: main  
Session log: agent-context/session-log/main.md  
Depends on: mypaytag-site:GPTW-S2-T1

Remove, hide, or reframe starter UI that conflicts with the MyPayTag MVP product boundary.

Acceptance notes:

- Site no longer centers wallet-heavy examples, deprecated Cubid package usage, or normal Cubid transaction-signing examples.
- Retained Cubid starter behavior supports identity, consent, verification, or hosted action flows.
- Retained Cubid comms behavior supports notification-driven action links without adding an inbox or activity feed.
- Public UI does not imply a full dashboard, wallet manager, public activity history, profile directory, settlement tracker, or wallet graph features.

## Sprint 3: Backend Integration And Privacy Hardening

### GPTW-S3-T1 Wire Hosted Actions To Backend Action Endpoints

Status: Complete
Feature branch: main
Session log: agent-context/session-log/main.md
Depends on: mypaytag:GPTR-S3-T1, mypaytag:GPTR-S3-T4, mypaytag:GPTR-S3-T7

Wire hosted action pages to backend action endpoints for route selection.

Acceptance notes:

- Site submits user decisions through backend APIs rather than direct database writes.
- API responses are mapped to public status copy.
- Only route-selection actions are initiated from resolver responses.
- Cubid-comms-driven user-action links are deferred until that event contract is explicitly added.
- Integration preserves browser-safe configuration boundaries.

### GPTW-S3-T2 Handle Expired Or Invalid Action Links Safely

Status: Complete
Feature branch: main
Session log: agent-context/session-log/main.md
Depends on: mypaytag-site:GPTW-S2-T2, mypaytag-site:GPTW-S2-T4

Implement safe handling for expired, invalid, already-used, or denied action links.

Acceptance notes:

- Expired or invalid states do not reveal whether a recipient exists.
- Restart-required paths use public backend-provided guidance.
- Pages avoid leaking private diagnostics.
- Action-token pages set a restrictive `Referrer-Policy`.
- Action-token URLs avoid third-party analytics, redact tokens from logs, and exchange valid tokens into clean URLs after validation.

### GPTW-S3-T3 Verify Browser Bundle Contains No Resolver Secrets

Status: Complete
Feature branch: main
Session log: agent-context/session-log/main.md
Depends on: mypaytag-site:GPTW-S1-T2

Add verification that the browser bundle contains no resolver secrets or server-only credentials.

Acceptance notes:

- Checks cover resolver secrets, Cubid dapp API keys, service-role keys, provider callback credentials, and database credentials.
- Server-only values are never renamed to `NEXT_PUBLIC_*`.
- Checks include built assets, source maps, rendered HTML, route handlers, public runtime config, server-only environment names, and known secret prefixes.
- Build or test output makes failures actionable.

### GPTW-S3-T4 Confirm Route Selection Does Not Leak Wallet Graph Details

Status: Complete
Feature branch: main
Session log: agent-context/session-log/main.md
Depends on: mypaytag-site:GPTW-S2-T4

Review and test the route-selection UX for wallet graph and preference leakage.

Acceptance notes:

- Route selection shows only data needed for the current action.
- Route selection does not reveal unrelated routes, unrelated PayToDapps, wallet addresses, or provider internals.
- Notification-triggered route selection does not reveal more information than a normal hosted action link.
- Public copy avoids implying a broader searchable profile or directory exists.

## Sprint 4: Site Acceptance And Public Readiness

### GPTW-S4-T1 Add Browser Acceptance Coverage For Hosted Actions

Status: Complete
Feature branch: codex/mypaytag-mvp-realignment-20260628
Session log: agent-context/session-log/main.md#2026-06-28-gptw-s4-t1
Depends on: mypaytag-site:GPTW-S2-T2, mypaytag-site:GPTW-S2-T4

Add browser acceptance coverage for route-selection hosted actions.

Acceptance notes:

- Tests cover route selected, denial/no-change, expired, invalid, and completed states.
- Tests verify required UI content is visible and does not overlap at supported viewport sizes.
- Tests do not require production secrets.

### GPTW-S4-T2 Add Responsive And Accessibility Checks

Status: Complete
Feature branch: codex/mypaytag-mvp-realignment-20260628
Session log: agent-context/session-log/main.md#2026-06-28-gptw-s4-t2
Depends on: mypaytag-site:GPTW-S2-T2, mypaytag-site:GPTW-S2-T4

Add responsive and accessibility checks for hosted action pages.

Acceptance notes:

- Pages work on mobile and desktop viewports.
- Forms and choices are keyboard accessible.
- Text fits within controls and does not obscure adjacent content.

### GPTW-S4-T3 Update Public README And Setup Docs

Status: Complete
Feature branch: codex/mypaytag-mvp-realignment-20260628
Session log: agent-context/session-log/main.md#2026-06-28-gptw-s4-t3
Depends on: mypaytag-site:GPTW-S2-T2, mypaytag-site:GPTW-S2-T4

Update public README and setup docs to describe the MyPayTag hosted-action app rather than only the Cubid starter baseline.

Acceptance notes:

- Docs explain local setup, browser-safe env vars, and hosted action flows.
- Docs keep private resolver implementation and secrets out of the public repo.
- Docs link to public SDK docs where protocol details belong.

### GPTW-S4-T4 Validate Public Docs Do Not Link Into The Private Repo

Status: Complete
Feature branch: codex/mypaytag-mvp-realignment-20260628
Session log: agent-context/session-log/main.md#2026-06-28-gptw-s4-t4
Depends on: mypaytag-site:GPTW-S4-T3

Review public site docs for private-repo links and private implementation leakage.

Acceptance notes:

- Public docs do not link into private `mypaytag` files.
- Public docs avoid Supabase schema details, provider callback internals, audit internals, service-role usage, and admin processes.
- Cross-repo references point only to public SDK docs or stable dependency IDs.

## Sprint 5: Blog Post Writing And Publishing

### GPTW-S5-T1 Write And Publish Introducing MyPayTag: Pay Users, Not Wallet Addresses

Status: Complete  
Feature branch: main  
Session log: agent-context/session-log/main.md#2026-06-24-gptw-s5-t1  
Depends on: mypaytag-site:GPTW-S4-T3

Write and publish the core launch post introducing MyPayTag as a way to pay users by approved identity rather than wallet address.

Acceptance notes:

- Post explains the address-centric UX and privacy problem.
- Post introduces user-approved pay-to identifiers and consented payment intents.
- Post explains that MyPayTag is powered by Cubid but separate from Cubid.
- Post includes a CTA for early PayToDapp and PayingDapp integrations.

### GPTW-S5-T2 Write And Publish Why Crypto Needs A Pay-To Layer

Status: Complete  
Feature branch: main  
Session log: agent-context/session-log/main.md#2026-06-24-gptw-s5-t2  
Depends on: mypaytag-site:GPTW-S5-T1

Write and publish the ecosystem thesis post explaining why payment resolution is the missing layer between identity, wallets, chains, and apps.

Acceptance notes:

- Post explains why ENS-style names, wallet address books, and payment links are not enough.
- Post frames consent, preferences, route selection, and privacy as core pay-to layer requirements.
- Post keeps user control over receive paths as the main conclusion.

### GPTW-S5-T3 Write And Publish From Wallet Addresses To Payment Intents

Status: Complete  
Feature branch: main  
Session log: agent-context/session-log/main.md#2026-06-24-gptw-s5-t3  
Depends on: mypaytag-sdk:GPTS-S1-T5, mypaytag-site:GPTW-S5-T1

Write and publish the product abstraction post explaining why the resolver returns payment intents rather than static addresses.

Acceptance notes:

- Post contrasts static addresses with structured, scoped, expiring payment intents.
- Post covers memos, expiry, one-time routes, provider-specific logic, and auditability.
- Post aligns with the MyPayTag JSON intent schema and avoids external protocol promises beyond MVP.

### GPTW-S5-T4 Write And Publish How MyPayTag Works: The Five Roles

Status: Complete  
Feature branch: main  
Session log: agent-context/session-log/main.md#2026-06-24-gptw-s5-t4  
Depends on: mypaytag-site:GPTW-S5-T1

Write and publish a developer education post explaining the five MVP roles: User, MyPayTag, Cubid, PayToDapp, and PayingDapp.

Acceptance notes:

- Post clearly separates Cubid identity from resolver payment destination resolution.
- Post explains PayToDapps as receive-path providers and PayingDapps as intent requesters.
- Post emphasizes user consent and preferences.

### GPTW-S5-T5 Write And Publish PayToDapp Vs PayingDapp: Which One Are You?

Status: Complete  
Feature branch: main  
Session log: agent-context/session-log/main.md#2026-06-24-gptw-s5-t5  
Depends on: mypaytag-site:GPTW-S5-T4

Write and publish a practical integration post helping builders identify whether their app is a PayToDapp, PayingDapp, or both.

Acceptance notes:

- Post includes examples such as SmarTrust Wallet, ChainCrew payout flow, marketplace seller wallet, marketplace payout flow, and escrow release systems.
- Post explains that some apps can be both PayToDapp and PayingDapp.
- Post points readers to the relevant public SDK integration path.

### GPTW-S5-T6 Write And Publish Modality A Vs Modality B: Two Ways To Integrate Wallets

Status: Complete  
Feature branch: main  
Session log: agent-context/session-log/main.md#2026-06-24-gptw-s5-t6  
Depends on: mypaytag-sdk:GPTS-S1-T2, mypaytag-site:GPTW-S5-T3

Write and publish the wallet integration post comparing Modality A and Modality B while making clear that MVP implementation uses Modality B only.

Acceptance notes:

- Post explains Modality A as resolver-built intents from accounts/addresses.
- Post explains Modality B as route-only registration where the PayToDapp builds the payment intent.
- Post states that Modality B is the MVP path because it is more private and powerful.
- Post frames Modality A as simpler but out of MVP scope.

### GPTW-S5-T7 Write And Publish The Minimal API For Identity-Based Crypto Payments

Status: Complete  
Feature branch: main  
Session log: agent-context/session-log/main.md#2026-06-24-gptw-s5-t7  
Depends on: mypaytag-sdk:GPTS-S1-T3, mypaytag-site:GPTW-S5-T3

Write and publish a developer-facing API post with example resolve requests and a CTA to try the SDK.

Acceptance notes:

- Post shows a verified-stamp recipient and supported paths.
- Post explains amount, intent mode, and one-time payment intent behavior.
- Post keeps examples aligned with the public SDK/API contracts.

### GPTW-S5-T8 Write And Publish Building A PayToDapp Integration

Status: Complete  
Feature branch: main  
Session log: agent-context/session-log/main.md#2026-06-24-gptw-s5-t8  
Depends on: mypaytag-sdk:GPTS-S1-T2, mypaytag-sdk:GPTS-S1-T4, mypaytag-site:GPTW-S5-T5

Write and publish a wallet-focused integration walkthrough for PayToDapps.

Acceptance notes:

- Post covers app registration, user consent, receive capability registration, Modality B intent handling, path revocation, and mock resolver testing.
- Post avoids instructing MVP PayToDapps to submit wallet addresses.
- Post points to provider SDK helpers when available.

### GPTW-S5-T9 Write And Publish Building A PayingDapp Integration

Status: Complete  
Feature branch: main  
Session log: agent-context/session-log/main.md#2026-06-24-gptw-s5-t9  
Depends on: mypaytag-sdk:GPTS-S1-T1, mypaytag-sdk:GPTS-S1-T3, mypaytag-site:GPTW-S5-T5

Write and publish an app-focused integration walkthrough for PayingDapps.

Acceptance notes:

- Post covers collecting a recipient pay-to identifier, requesting resolver authorization, submitting supported paths, and receiving a payment intent.
- Post explains `no_route`, `user_action_required`, and `resolved`.
- Post explains how to present the returned payment intent to the payer.

### GPTW-S5-T10 Write And Publish Why We Don't Use A Universal CubidID

Status: Complete  
Feature branch: main  
Session log: agent-context/session-log/main.md#2026-06-24-gptw-s5-t10  
Depends on: mypaytag-site:GPTW-S5-T4

Write and publish the identity and privacy post explaining why MyPayTag does not rely on a universal CubidID.

Acceptance notes:

- Post explains why universal IDs are convenient but privacy-hostile.
- Post explains app-scoped `DappUserId` behavior and user-approved pay-to identifiers.
- Post makes cross-dapp tracking prevention feel intentional and mature.

### GPTW-S5-T11 Write And Publish Four Ways To Identify A User For Payment Resolution

Status: Complete  
Feature branch: main  
Session log: agent-context/session-log/main.md#2026-06-24-gptw-s5-t11  
Depends on: mypaytag-site:GPTW-S5-T10

Write and publish the identity model post explaining the main options for identifying a user for payment resolution.

Acceptance notes:

- Post covers verified stamps as pay-to identifiers, PublicCubidPayToID, Cubid-brokered DappUserId sharing, and manual fallback identifiers.
- Post recommends verified stamps as the likely MVP default.
- Post frames public IDs as useful but optional rather than required for payment resolution.

## Sprint 6: Solver Adapter Public Education

### GPTW-S6-T1 Maintain Solver Adapter Homepage Section

Status: Complete
Feature branch: feature/mypaytag-resolver-migration
Session log: agent-context/session-log/main.md#2026-06-26-gptw-s6-t1
Depends on: mypaytag-sdk:GPTS-S5-T2

Keep the homepage solver adapter section aligned with the public SDK solver ids and product positioning.

Acceptance notes:

- Homepage names NEAR Intents / 1Click, LI.FI, Squid, 0x Cross-Chain API, Across, and LayerZero / Stargate.
- Copy explains that MyPayTag resolves recipients first and execution adapters quote or route payment execution afterward.
- Copy avoids implying that solver adapters determine the recipient's preferred PayToDapp.
- Section remains responsive and does not introduce horizontal overflow on mobile.

### GPTW-S6-T2 Add Solver Adapter Developer Explainer

Status: Complete
Feature branch: feature/mypaytag-resolver-migration
Session log: agent-context/session-log/main.md#2026-06-26-gptw-s6-t2
Depends on: mypaytag-sdk:GPTS-S5-T1, mypaytag-sdk:GPTS-S5-T2

Add public developer-facing content that explains how payor-apps should think about solver/router adapters.

Acceptance notes:

- Content explains preferred-solver behavior versus quote fanout when no solver is selected.
- Content explains that solver adapters consume resolved receive requirements and do not expose recipient wallet graphs.
- Content links to public SDK docs when quote provider helpers are available.
- Content does not link into private `mypaytag` docs or expose backend provider credentials, private policy, or operational details.

### GPTW-S6-T3 Add Solver Adapter Content Checks

Status: Complete
Feature branch: feature/mypaytag-resolver-migration
Session log: agent-context/session-log/main.md#2026-06-26-gptw-s6-t3
Depends on: mypaytag-site:GPTW-S6-T1

Add lightweight checks for the public solver adapter content.

Acceptance notes:

- Checks verify all six solver names render on the homepage.
- Checks verify solver copy does not include private resolver env names, service-role references, provider credentials, or private repo links.
- Checks cover desktop and mobile layouts for the solver section.

## Sprint 7: MyPayTag MVP Messaging And Hosted Flow Realignment

### GPTW-S7-T1 Rename Public GlobalPayTo Site Surfaces To MyPayTag

Status: Done 2026-06-28
Feature branch: codex/mypaytag-mvp-realignment-20260628
Session log: agent-context/session-log/main.md#2026-06-28-gptw-s7-t1
Depends on: mypaytag-sdk:GPTS-S6-T1

Implement the site-facing rename requested in `agent-context/2026-06-28-mypaytag-mvp-realignment.md`.

Acceptance notes:

- Site copy, routes, links, examples, generated API artifacts, docs, metadata, browser-visible IDs, test names, and public repo links use `MyPayTag`, `mypaytag`, and `Paytag`.
- Stale GitHub org/repo URLs and old GlobalPayTo references are fixed or explicitly marked as compatibility history.
- User-facing "Paytag" branding lives primarily in MyPayTag copy.
- The other four realignment docs are checked before implementation.

### GPTW-S7-T2 Reframe Public Copy Around MVP Versus Future Capabilities

Status: Done 2026-06-28
Feature branch: codex/mypaytag-mvp-realignment-20260628
Session log: agent-context/session-log/main.md#2026-06-28-gptw-s7-t2
Depends on: mypaytag-site:GPTW-S6-T1, mypaytag-site:GPTW-S6-T2

Keep the broader MyPayTag story while preventing non-MVP solver/execution promises from becoming launch requirements.

Acceptance notes:

- Primary developer path teaches paytag to MyPayTag route selection to PayToDapp provider intent.
- Solver, bridge, swap, quote fanout, and preferred solver content is visibly labeled as future execution-adapter capability.
- Copy avoids implying settlement, payment execution, or solver readiness is part of the MVP core flow.
- Cubid is described as powering verified identity, consent, and aliases, not payment routing or wallets.

### GPTW-S7-T3 Sync Public API Docs From Corrected SDK Artifacts

Status: Done 2026-06-28
Feature branch: codex/mypaytag-mvp-realignment-20260628
Session log: agent-context/session-log/main.md#2026-06-28-gptw-s7-t3
Depends on: mypaytag-sdk:GPTS-S6-T2

Refresh public API documentation views from the corrected SDK contract.

Acceptance notes:

- `public/api/openapi.yaml` and Postman artifacts are synced from `mypaytag-sdk` through repo scripts.
- Generated API artifacts are not hand-edited.
- Examples show opaque/default paytags and raw-explicit paytags correctly.
- API docs do not show weak intent payloads or imply MyPayTag has already executed settlement.

### GPTW-S7-T4 Harden Hosted Route-Selection UX

Status: Done 2026-06-28
Feature branch: codex/mypaytag-mvp-realignment-20260628
Session log: agent-context/session-log/main.md#2026-06-28-gptw-s7-t4
Depends on: mypaytag:GPTR-S6-T2, mypaytag-site:GPTW-S3-T1, mypaytag-site:GPTW-S3-T2

Make hosted route selection browser-safe and aligned with the corrected backend action model.

Acceptance notes:

- Route-selection pages hydrate browser-safe action data only after action validation and user sign-in.
- Pages show only route options relevant to the current action and current user.
- Pages do not show wallet graph data, unrelated PayToDapps, raw Cubid identifiers, or provider internals.
- Expired, invalid, denied, completed, and already-used states preserve negative-disclosure guarantees.

### GPTW-S7-T5 Link Cubid-Owned Identity Work Out To Cubid

Status: Done 2026-06-28
Feature branch: codex/mypaytag-mvp-realignment-20260628
Session log: agent-context/session-log/main.md#2026-06-28-gptw-s7-t5
Depends on: cubid-monorepo:CUBID-PAYTAG-03, cubid-sdk-v2:S18.2

Ensure MyPayTag does not implement Cubid-owned paytag identity management.

Acceptance notes:

- Stamp elevation, opaque paytag creation, raw-stamp exposure, and Cubid grant/revoke flows link to Cubid-owned hosted flows.
- MyPayTag copy says Cubid owns identity and consent while MyPayTag owns payment route preference and provider intent orchestration.
- MyPayTag pages do not implement Cubid stamp/grant management directly.
- PayingDapp examples call MyPayTag rather than Cubid directly.

### GPTW-S7-T6 Harden Playground And Launch Smoke

Status: Done 2026-06-28
Feature branch: codex/mypaytag-mvp-realignment-20260628
Session log: agent-context/session-log/main.md#2026-06-28-gptw-s7-t6
Depends on: mypaytag-site:GPTW-S7-T3, mypaytag-site:GPTW-S7-T4, mypaytag:GPTR-S6-T8

Make the playground demonstrate the MVP accurately and document launch-readiness smoke.

Acceptance notes:

- MVP playground calls use real MyPayTag API contracts.
- Solver quote simulation remains clearly labeled as simulation or non-MVP extension.
- Playground copy does not imply Cubid receives wallet/payment details.
- Local lint/typecheck/test/build, browser secret scan, OpenAPI sync checks, and hosted staging smoke are documented before launch readiness is claimed.

## Sprint 8: NEAR 1Click MVP Site Correction

### GPTW-S8-T1 Reframe Execution Copy Around NEAR 1Click MVP

Status: Complete
Feature branch: codex/mypaytag-mvp-realignment-20260628
Session log: agent-context/session-log/main.md#2026-06-28-gptw-s8-t1
Depends on: mypaytag:GPTR-S7-T1, mypaytag-sdk:GPTS-S7-T1, smartrust-wallet:SMTW-S1-T1

Correct public execution messaging for the updated Phase 1 scope.

Acceptance notes:

- Homepage and marketing copy describe NEAR Intents / 1Click as the only MVP swap and bridge execution adapter.
- LI.FI, Squid, 0x, Across, LayerZero / Stargate, broad solver fanout, and generic external adapters remain clearly labeled as Phase 2 or future.
- Copy no longer says all solver, swap, bridge, or quote behavior is outside MVP.
- Same-chain same-token transfers are described as possible through MyPayTag, with the PayingDapp deciding whether to use MyPayTag or execute locally.
- SmarTrust is named as the initial PayingDapp and PayToDapp where the MVP launch path is described.

### GPTW-S8-T2 Add NEAR 1Click MVP Playground Flows

Status: Complete
Feature branch: codex/mypaytag-mvp-realignment-20260628
Session log: agent-context/session-log/main.md#2026-06-28-gptw-s8-t2
Depends on: mypaytag:GPTR-S7-T2, mypaytag-sdk:GPTS-S7-T2, mypaytag-site:GPTW-S8-T1

Make the playground demonstrate the revised happy paths instead of only simulating future quote fanout.

Acceptance notes:

- Playground includes an MVP quote request example for a PayingDapp paying a Paytag through NEAR 1Click.
- Playground includes an MVP selected-quote example that returns payable instructions through the corrected SDK/backend contract.
- SmarTrust examples cover the initial PayingDapp and PayToDapp roles.
- Broad solver fanout remains available only as a Phase 2 simulation or is removed until the public contract supports it.
- Playground warnings explain that Cubid receives identity and consent context only, not wallet routing, payment, quote, bridge, or swap details.

### GPTW-S8-T3 Update Public API Docs For Revised MVP Contracts

Status: Complete
Feature branch: codex/mypaytag-mvp-realignment-20260628
Session log: agent-context/session-log/main.md#2026-06-28-gptw-s8-t3
Depends on: mypaytag-sdk:GPTS-S7-T3, mypaytag:GPTR-S7-T3

Refresh public API docs after the SDK and backend contracts are corrected.

Acceptance notes:

- `public/api/openapi.yaml` and Postman artifacts are regenerated from `mypaytag-sdk`; generated artifacts are not hand-edited.
- API docs distinguish MVP NEAR 1Click quote and selected-quote payable-instruction paths from Phase 2 adapters.
- Notification examples use the canonical SDK schema and no longer show stale `event`, `recipientDisplay`, or `resolverRequestId` payloads if those fields are removed upstream.
- Route registration, resolve, provider callback, hosted action, quote, and selected-quote docs preserve negative-disclosure language.
- API docs do not imply MyPayTag stores raw wallets, executes settlement, or lets PayingDapps probe Cubid directly.

### GPTW-S8-T4 Harden Hosted Action Fallback Behavior

Status: Complete
Feature branch: codex/mypaytag-mvp-realignment-20260628
Session log: agent-context/session-log/main.md#2026-06-28-gptw-s8-t4
Depends on: mypaytag:GPTR-S7-T4, mypaytag-site:GPTW-S7-T4

Prevent static route-selection fixtures from masking staging and production failures.

Acceptance notes:

- Static hosted-action fallback is available only when an explicit local development mock mode is enabled.
- Staging and production fail closed when resolver backend action hydration or completion calls fail.
- Mock mode is visible in local UI and logs so it cannot be confused with hosted staging smoke.
- Existing negative-disclosure behavior for invalid, expired, completed, denied, and already-used action states is preserved.
- Browser-secret and route-selection privacy checks still pass after fallback changes.

### GPTW-S8-T5 Update Launch Smoke For SmarTrust And NEAR 1Click

Status: Complete
Feature branch: codex/mypaytag-mvp-realignment-20260628
Session log: agent-context/session-log/main.md#2026-06-28-gptw-s8-t5
Depends on: mypaytag-site:GPTW-S8-T2, mypaytag-site:GPTW-S8-T4, smartrust-wallet:SMTW-S1-T2

Revise launch-readiness guidance for the updated MVP.

Acceptance notes:

- Smoke checklist requires local lint, typecheck, build, browser secret scan, OpenAPI sync, route-selection privacy scan, and updated execution-content checks before hosted smoke.
- Hosted smoke covers Cubid identity/consent, MyPayTag paytag validation, route registration, resolve, provider callback, hosted action completion, and negative-disclosure states.
- Hosted smoke includes SmarTrust acting as the first PayingDapp and PayToDapp.
- Hosted smoke includes a NEAR 1Click swap or bridge quote, selected quote, and payable instruction path.
- Checklist clarifies that same-chain same-token transfer handling is a PayingDapp decision, not something MyPayTag should force.

### GPTW-S8-T6 Replace Broad Solver Content Guardrails

Status: Complete
Feature branch: codex/mypaytag-mvp-realignment-20260628
Session log: agent-context/session-log/main.md#2026-06-28-gptw-s8-t6
Depends on: mypaytag-site:GPTW-S8-T1

Update site validation scripts so they enforce the revised phase split.

Acceptance notes:

- `pnpm check:solver-content` no longer requires all six solver names to appear as equivalent homepage content.
- The check requires NEAR Intents / 1Click to appear as Phase 1/MVP execution-adapter content.
- The check requires LI.FI, Squid, 0x, Across, LayerZero / Stargate, broad fanout, and generic adapters to be labeled Phase 2 or future when they appear.
- The check fails if public content says NEAR 1Click is future-only or non-MVP.
- Existing private-boundary checks for service-role language, provider credentials, private resolver env names, and private repo links remain enforced.

## Sprint 9: Code-Verified MVP Playground And API Closure

### GPTW-S9-T1 Sync API Docs And Playground Payloads To Backend Paytag Contract

Status: Complete
Feature branch: codex/mypaytag-mvp-code-gap-todos-20260629
Session log: TBD
Depends on: mypaytag:GPTR-S8-T1, mypaytag-sdk:GPTS-S8-T1

Update site API examples and playground payloads after backend public
boundaries accept the canonical SDK `identifierType: "paytag"` contract.

Acceptance notes:

- API docs, playground examples, and generated artifacts validate against the
  same SDK schemas the backend accepts.
- Site checks fail if public examples use `identifierType: "verified_stamp"`.
- Playground resolve and route-registration calls no longer demonstrate a
  payload shape that the backend rejects.

### GPTW-S9-T2 Replace NEAR 1Click Simulations With Real Backend Calls When Configured

Status: Complete
Feature branch: codex/mypaytag-mvp-code-gap-todos-20260629
Session log: TBD
Depends on: mypaytag:GPTR-S8-T2, mypaytag-sdk:GPTS-S8-T2

Keep local mock mode available, but make the NEAR 1Click quote and selected
quote playground flows call the real backend endpoints whenever resolver
configuration is present.

Acceptance notes:

- Local simulation is enabled only through explicit development mock mode.
- Staging and production fail closed rather than silently returning simulated
  NEAR quote or payable-instruction responses.
- The UI visibly labels any local mock response as a development fixture.
- Hosted smoke instructions require the real backend NEAR quote and selected
  quote paths.

### GPTW-S9-T3 Keep Broad Solver Fanout As Phase 2 Demo Only

Status: Complete
Feature branch: codex/mypaytag-mvp-code-gap-todos-20260629
Session log: TBD
Depends on: mypaytag-site:GPTW-S9-T2

Prevent Phase 2 fanout simulation from being confused with MVP functionality.

Acceptance notes:

- LI.FI, Squid, 0x, Across, LayerZero/Stargate, broad fanout, and generic
  adapter examples are hidden behind Phase 2 or future labels.
- The playground cannot run broad fanout in staging/production as if it were an
  MVP backend feature.
- Site validation fails if Phase 2 simulation is presented as required for the
  core resolve, provider callback, or NEAR 1Click MVP flow.

## Sprint 10: Public Payment And Developer Directory Surfaces

### GPTW-S10-T1 Add Enter Paytag Wallet-Pay Page

Status: Complete
Feature branch: codex/mypaytag-mvp-code-gap-todos-20260629
Session log: TBD
Depends on: mypaytag:GPTR-S8-T1, mypaytag:GPTR-S8-T2, mypaytag-sdk:GPTS-S8-T2

Add a public "Enter Paytag" page where either an unauthenticated or
authenticated user can connect a third-party wallet, enter a destination
paytag, and specify either a dollar amount or a token plus token amount.

Acceptance notes:

- Page supports wallet connection before requiring a paytag or amount.
- Connected wallet network, token balances, and supported payment paths are
  used to present the best direct payment options that match the connected
  network and available balances.
- A separate quote section shows exchange/swap options based on available
  balances in the connected wallet.
- Same-chain same-token direct options are shown as payment options when
  available, but the user can still choose a MyPayTag-backed route when
  supported.
- Swap/bridge/exchange quotes use the MVP NEAR 1Click flow when configured and
  do not imply Phase 2 solvers are production-ready.
- Negative states do not reveal whether the paytag, Cubid user, route, or
  PayToDapp exists beyond the public resolver status.
- The page remains browser-safe: no resolver secrets, Cubid API keys,
  provider callback secrets, service-role keys, or private diagnostics in the
  bundle.

### GPTW-S10-T2 Require Developer App Metadata Before API Key Issuance

Status: Complete
Feature branch: codex/mypaytag-mvp-code-gap-todos-20260629
Session log: TBD
Depends on: mypaytag:GPTR-S8-T4

Update the developer API key flow so developers must register app metadata
before receiving keys.

Acceptance notes:

- API key provisioning requires a marketing name for the app, an environment
  selection of testnet or mainnet, and the app URL.
- The developer console validates the URL and makes the environment choice
  explicit before key creation or rotation.
- Marketing name, environment, and URL are displayed back to the developer in
  the app/account summary after provisioning.
- Browser-visible key handling remains safe: secrets are never exposed after
  initial issuance unless the backend explicitly supports a one-time reveal.
- The site does not claim mainnet approval just because a developer selected
  mainnet; any approval or activation state comes from backend policy.

### GPTW-S10-T3 Add Registered PayTo Wallet Directory Section

Status: Complete
Feature branch: codex/mypaytag-mvp-code-gap-todos-20260629
Session log: TBD
Depends on: mypaytag:GPTR-S8-T4

Add a public website section that lists registered PayTo wallets eligible for
display.

Acceptance notes:

- Directory shows only registered PayTo wallets filtered to mainnet.
- Directory includes only wallets with a registered-user-with-wallet count
  greater than zero.
- Each listed wallet shows its marketing name and a hyperlink to its registered
  app URL.
- Directory does not expose user identities, wallet addresses, balances,
  route preferences, private provider metadata, or testnet-only providers.
- Empty and loading states avoid implying whether any specific unlisted wallet
  is registered or rejected.

## Sprint 11: Typed UI Internationalization

### GPTW-S11-T1 Install And Configure i18next

Status: Complete
Feature branch: codex/mypaytag-site-i18n-sprint-20260708
Session log: TBD
Depends on: mypaytag-site:GPTW-S10-T1, mypaytag-site:GPTW-S10-T2, mypaytag-site:GPTW-S10-T3

Install `i18next` and the React/Next integration needed for the public
MyPayTag UI.

Acceptance notes:

- Runtime translation uses `i18next` with a Next-compatible initialization
  path for server and client UI.
- Translation loading works for English, Swedish, and the pseudo-locale without
  shipping resolver secrets or server-only configuration to the browser.
- Locale state is available to navigation, settings, onboarding, developer
  tools, playground, hosted-action, and payment-entry components.
- The setup does not introduce hydration mismatches between server-rendered and
  client-rendered copy.

### GPTW-S11-T2 Add Typed Translation Keys And Namespaces

Status: Complete
Feature branch: codex/mypaytag-site-i18n-sprint-20260708
Session log: TBD
Depends on: mypaytag-site:GPTW-S11-T1

Create typed translation resources and namespace boundaries for the public UI.

Acceptance notes:

- Translation keys are type-checked so removed or misspelled keys fail in local
  validation before runtime.
- Namespaces at minimum cover `common`, `navigation`, `buttons`, `settings`,
  `onboarding`, `developer`, `playground`, `hostedAction`, `pay`, and
  `marketing`.
- Namespace naming stays stable enough for product, design, and localization
  review without coupling every component to file paths.
- Shared labels such as loading, retry, continue, cancel, save, copy, rotate,
  connect, disconnect, and submit live in common/button namespaces instead of
  being duplicated.

### GPTW-S11-T3 Add English, Swedish, And Pseudo-Locale Resources

Status: Complete
Feature branch: codex/mypaytag-site-i18n-sprint-20260708
Session log: TBD
Depends on: mypaytag-site:GPTW-S11-T2

Add translation files for English, Swedish, and an expansion pseudo-locale.

Acceptance notes:

- English is the source locale and remains the default global language.
- Swedish translations are available for all first-pass UI namespaces.
- `en-XA` or equivalent pseudo-locale expands and brackets strings to expose
  layout overflow, clipped controls, hard-coded copy, and concatenated strings.
- Pseudo-locale resources are available in development and test fixtures but
  are not selected by default for production users.

### GPTW-S11-T4 Extract Visible UI Strings Into Translation Files

Status: Complete
Feature branch: codex/mypaytag-site-i18n-sprint-20260708
Session log: TBD
Depends on: mypaytag-site:GPTW-S11-T2, mypaytag-site:GPTW-S11-T3

Extract visible strings from the current Next UI entry points and components
into translation resources.

Acceptance notes:

- Visible strings from app pages, layout, and shared components are moved out
  of inline JSX into typed translation keys. This covers the Next app
  equivalents of a single `App.tsx` shell.
- Common navigation, buttons, settings, onboarding, developer-console,
  playground, hosted-action, marketing, and enter-paytag copy are covered.
- Dynamic copy uses interpolation, pluralization, and structured variables
  instead of string concatenation.
- API payload examples, code snippets, route paths, environment variable names,
  provider names, and product identifiers remain literal where translation
  would be incorrect.

### GPTW-S11-T5 Add Locale Selection And Developer Fixture Controls

Status: Complete
Feature branch: codex/mypaytag-site-i18n-sprint-20260708
Session log: TBD
Depends on: mypaytag-site:GPTW-S11-T1, mypaytag-site:GPTW-S11-T3

Add a browser-safe way to simulate and inspect locale behavior during local
development and review.

Acceptance notes:

- Developer tools include a fixture control for switching between English,
  Swedish, and pseudo-locale without changing production user settings.
- The fixture makes the active locale obvious in development so screenshots and
  smoke results are not confused with production behavior.
- Locale switching exercises navigation, settings, onboarding, developer
  console, hosted action, playground, and enter-paytag surfaces.
- Fixture state is isolated to local/dev tooling and does not leak private
  user, wallet, resolver, or Cubid state.

### GPTW-S11-T6 Implement Locale Detection Defaults

Status: Complete
Feature branch: codex/mypaytag-site-i18n-sprint-20260708
Session log: TBD
Depends on: mypaytag-site:GPTW-S11-T1, mypaytag-site:GPTW-S11-T3

Default the site to English globally, with Swedish selected for users in
Sweden.

Acceptance notes:

- English is used globally unless locale detection indicates Sweden or the user
  explicitly chooses another supported locale.
- Sweden detection uses safe browser/server signals such as accepted language,
  explicit locale preference, or deployment-supported geolocation headers when
  available.
- Locale detection avoids collecting or exposing precise location data.
- Users can override the detected locale in settings once a settings surface is
  available.
- Unsupported locales fall back to English.

### GPTW-S11-T7 Add Translation Completeness Checks To CI

Status: Complete
Feature branch: codex/mypaytag-site-i18n-sprint-20260708
Session log: TBD
Depends on: mypaytag-site:GPTW-S11-T2, mypaytag-site:GPTW-S11-T3, mypaytag-site:GPTW-S11-T4

Add validation that prevents missing or stale translation keys from landing.

Acceptance notes:

- CI fails when any supported locale is missing a required key from the source
  English namespace set.
- CI fails when resource files contain orphaned keys no longer referenced by
  typed key definitions, unless explicitly allowed.
- CI verifies pseudo-locale generation or resources stay in sync with English.
- CI or local checks catch inline visible strings in core UI areas after the
  extraction pass, while allowing intentional literals such as code examples,
  product names, route paths, and environment variable names.
- The validation command is documented in `package.json` scripts and included
  in the launch-readiness check list.
