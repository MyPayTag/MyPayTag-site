# Main Session Log

agent: Codex
branch: codex/5-user-portal-site
head: pending commit for MyPayTag-site#10 PR smoke fix
summary: Addressed protected-preview smoke feedback by surfacing Cubid sign-in launch failures in the shared session control instead of silently returning to the logged-out state.
validation: Ran pnpm check:i18n, pnpm typecheck, pnpm lint, pnpm build, and pnpm scan:browser-secrets successfully.
follow-ups: Re-smoke the PR preview in Chrome after Vercel redeploys, then merge only after PR review and green checks.

---

agent: Codex
branch: codex/5-user-portal-site
head: pending commit for MyPayTag-site#9
summary: Implemented MyPayTag-site#9 by replacing the static /history fixture flow with a Cubid-authenticated backend history fetch, a server-side /api/portal/history proxy, typed portal history contracts, grouped question/answer/quote/selected-quote/intent/receipt rendering, exact quote details, pending/unavailable receipt handling, and localized history copy.
validation: Ran pnpm check:i18n, pnpm typecheck, pnpm lint, pnpm build, and pnpm scan:browser-secrets. Restarted the stale local next start process after it held old Turbopack chunks from the previous build, then confirmed /history returned 200 and captured production-server Playwright screenshots for the missing-config state at desktop and mobile widths under output/playwright/site-9-*.png. Real authenticated history/filter/detail smoke requires real Cubid OIDC config plus a deployed backend portal-history API and is deferred to the staging env/smoke issues.
follow-ups: Promote Site#9 and Site#8 after validation comments, then continue the sprint dependency tree with staging/Vercel/Supabase env and smoke tasks.

---

agent: Codex
branch: codex/5-user-portal-site
head: pending commit for MyPayTag-site#11
summary: Implemented MyPayTag-site#11 by adding a protected /settings receive-path priority surface, a server-side /api/portal/preferences proxy to the backend portal-preferences function, typed portal preference contracts, settings navigation, and localized settings copy for loading, empty, failure, reorder, and save states.
validation: Ran pnpm check:i18n, pnpm typecheck, pnpm lint, pnpm build, and pnpm scan:browser-secrets. Captured production-server Playwright screenshots for /settings missing-config state at desktop and mobile widths under output/playwright/site-11-*.png. Real view/reorder/save browser smoke requires real Cubid OIDC config plus a deployed backend portal-preferences API and is deferred to the staging env/smoke issues.
follow-ups: Implement backend-backed history UI in Site#9, then run staged real-auth smoke after env is configured.

---

agent: Codex
branch: codex/5-user-portal-site
head: pending commit for MyPayTag-site#10
summary: Replaced production protected-route gating and header session controls with real Cubid/OIDC auth state, removed the mock localStorage session provider from app layout and source, localized Cubid missing-config/checking/callback states, and kept developer tooling behind Cubid sign-in while still using local fixture data for unfinished developer backend surfaces.
validation: Ran pnpm check:i18n, pnpm typecheck, pnpm lint, pnpm build, and pnpm scan:browser-secrets. Captured production-server Playwright screenshots for /history and /auth/callback missing-config states at desktop and mobile widths under output/playwright/site-10-*.png.
follow-ups: Implement backend-backed receive-path settings and history UI in Site#11 and Site#9.

---

agent: Codex
branch: main
head: 91003ef
summary: Added and README-linked a public hosted user-actions architecture doc for authorization, setup, and route-selection pages while keeping private resolver implementation out of the site boundary.
validation: Reviewed the MVP PRD split and confirmed the site doc references only public architecture docs.
follow-ups: Replace starter content with MyPayTag app/site behavior and make dependency setup portable for CI.

---

agent: Codex
branch: main
head: dd0aa50
summary: Completed GPTW-S1-T1 by finalizing the browser-safe hosted action page contract.
validation: Confirmed hosted actions use opaque short-lived identifiers and cover approval, denial, route selection, expired, invalid, completed, and restart-required outcomes.
follow-ups: Continue site Sprint 1 with browser-safe runtime configuration and public copy for statuses and notifications.

---

agent: Codex
branch: main
head: 5bddca5
summary: Completed GPTW-S1-T2 by documenting browser-safe runtime configuration boundaries for hosted action pages.
validation: Confirmed resolver secrets, Cubid dapp API keys, service-role keys, provider callback credentials, and production database credentials stay out of browser env vars and bundles.
follow-ups: Finish site Sprint 1 with public copy for resolver statuses and Cubid comms notifications.

---

agent: Codex
branch: main
head: c414106
summary: Completed GPTW-S1-T3 by defining public copy requirements for resolver statuses and Cubid comms notifications.
validation: Confirmed copy coverage for setup, route selection, authorization, provider unavailable, expired/invalid links, payment intent created, payment received, and user action required without private diagnostics or wallet graph claims.
follow-ups: Site Sprint 2 can begin hosted action app design after SDK contract dependencies remain complete.

---

agent: Codex
branch: main
head: 1e6857f
summary: Tightened site architecture, TODO requirements, and blog roadmap notes to match the MVP PRD trust-boundary updates, including opaque action URLs, post-validation hydration, intent-created-only notification copy, and broader browser leak checks.
validation: Confirmed site architecture, TODO, and blog authoring docs no longer contain raw REVIEW notes or payment_received/payment received MVP requirements, and removed the local sibling-checkout architecture link from public docs.
follow-ups: Align SDK public docs/TODOs with the tightened MVP notification and action-token boundaries before implementation continues.

---

agent: Codex
branch: main
head: 1b7217b
summary: Completed GPTW-S2-T1 by documenting the authorization/setup hosted action flow, safe action-token hydration model, visible outcome states, and Sprint 2 mock-data boundary.
validation: Confirmed the flow design keeps URLs opaque, avoids raw identifiers and wallet graph disclosure, and leaves live backend wiring for Sprint 3.
follow-ups: Implement authorization/setup pages with mock action state.

---

agent: Codex
branch: main
head: 827c237
summary: Completed GPTW-S2-T2 by implementing the setup/authorization hosted action page with local mock action hydration, safe approved/denied/expired/invalid/completed/restart states, and no production Supabase access.
validation: Ran pnpm typecheck, pnpm lint, and pnpm build; Next built the new dynamic setup action route successfully.
follow-ups: Design route selection flow details before implementing route-selection hosted action pages.

---

agent: Codex
branch: main
head: 0b14c01
summary: Completed GPTW-S2-T3 by tightening route-selection flow design around explicit user selection, current-default behavior, disabled non-ready states, safe hydration, and route/provider disclosure limits.
validation: Reviewed hosted-action design and contract docs to confirm route options/defaults render only after action validation and do not expose unrelated routes, PayToDapps, wallet addresses, route counts, or provider internals.
follow-ups: Implement route-selection hosted action pages with mock action state.

---

agent: Codex
branch: main
head: cb38fcd
summary: Completed GPTW-S2-T4 by implementing the route-selection hosted action page with mock action hydration, explicit route choice, current-default display, safe non-ready states, and local selected/denied outcomes.
validation: Ran pnpm typecheck, pnpm lint, and pnpm build; Next built both dynamic hosted action route families successfully.
follow-ups: Remove or reframe starter-only UI that conflicts with the MyPayTag MVP boundary.

---

agent: Codex
branch: main
head: a11b194
summary: Completed GPTW-S2-T5 by replacing the Cubid starter-centered homepage with a MyPayTag hosted-action entry screen and updating app metadata to the MyPayTag product boundary.
validation: Ran pnpm typecheck, pnpm lint, and pnpm build. Browser-smoked the homepage plus setup and route-selection action routes on desktop, and checked route-selection at mobile width for non-overlap.
follow-ups: Site Sprint 3 can wire hosted action pages to backend action endpoints and add privacy hardening checks.

---

agent: Codex
branch: main
head: 6312d66
summary: Addressed site inline review comments by clarifying hosted-action backend exchange boundaries, mock-only completion states, crawler/referrer controls, and Sprint 3 server-confirmation requirements.
validation: Ran git diff --check, scanned the touched site docs and hosted-action code for inline-review markers, and ran pnpm typecheck, pnpm lint, and pnpm build.
follow-ups: In Sprint 3, replace mock action hydration and local completion with backend action-token exchange, Cubid-authenticated validation, audit-event creation, token invalidation, and server-side route revalidation.

---

agent: Codex
branch: main
head: a2fc502
summary: Completed GPTW-S3-T1 by wiring hosted setup and route-selection pages through server-side resolver action helpers and API submit routes, with local mock fallback only when no resolver backend URL is configured.
validation: Ran pnpm typecheck, pnpm lint, and pnpm build; Next built the hosted action pages plus new /api/actions setup and route-selection routes.
follow-ups: Continue site Sprint 3 with safe expired/invalid action-link handling, noindex/noarchive metadata, strict referrer policy, and token-leak controls.

---

agent: Codex
branch: main
head: fed0d0c
summary: Completed GPTW-S3-T2 by adding no-store, no-referrer, noindex/noarchive hosted-action route headers, page-level robots metadata, and action URL redaction support while preserving generic expired/invalid states.
validation: Ran pnpm typecheck, pnpm lint, and pnpm build; Next built hosted action routes with the safety headers configured.
follow-ups: Continue site Sprint 3 with browser bundle and rendered-output secret scanning.

---

agent: Codex
branch: main
head: 0b7ada4
summary: Completed GPTW-S3-T3 by adding a browser secret scanner covering built browser assets, public files, server route output, and source for resolver/Cubid/database/provider secret exposure and NEXT_PUBLIC secret misuse.
validation: Ran pnpm build, pnpm scan:browser-secrets, pnpm typecheck, and pnpm lint. The scanner initially caught server-only Cubid env names in server chunks, then was refined to fail browser assets on server-only env names while checking source/server output for public secret misuse and literal secret values.
follow-ups: Finish site Sprint 3 with route-selection privacy checks for wallet graph and provider-detail leakage.

---

agent: Codex
branch: main
head: 5e6abab
summary: Completed GPTW-S3-T4 by adding a route-selection privacy check for wallet addresses, route counts, provider internals, private diagnostics, wallet-graph language, and profile-directory claims, then cleaning fixture copy that mentioned wallet graph details.
validation: Ran pnpm privacy:route-selection, pnpm typecheck, pnpm lint, pnpm build, and pnpm scan:browser-secrets.
follow-ups: Site Sprint 3 is complete; keep using privacy and browser-secret scans before public hosted-action releases.

---

agent: Codex
branch: main
head: 7e63f74
summary: Completed GPTW-S5-T1 by adding the public blog publishing surface and publishing the launch post, "Introducing MyPayTag: Pay Users, Not Wallet Addresses."
validation: Added typed blog content, index/detail routes, homepage blog navigation, and confirmed the post explains address-centric UX, approved pay-to identifiers, Cubid separation, consented payment intents, and early integration CTAs.
follow-ups: Continue Sprint 5 with the pay-to layer ecosystem thesis post.

---

agent: Codex
branch: main
head: aa1dfd5
summary: Completed GPTW-S5-T2 by publishing "Why Crypto Needs a Pay-To Layer" as the ecosystem thesis post for identity, wallet, chain, and app fragmentation.
validation: Confirmed the post contrasts names, address books, and payment links with consent, route preference, privacy, and user-controlled payment resolution.
follow-ups: Continue Sprint 5 with the payment-intents abstraction post.

---

agent: Codex
branch: main
head: a6bd97c
summary: Completed GPTW-S5-T3 by publishing "From Wallet Addresses to Payment Intents" as the resolver-output abstraction post.
validation: Confirmed the post contrasts static addresses with scoped expiring intents, covers references, expiry, one-time behavior, provider-specific instructions, and frames the MyPayTag response as a normalized resolver envelope.
follow-ups: Continue Sprint 5 with the five-roles developer education post.

---

agent: Codex
branch: main
head: 4427389
summary: Completed GPTW-S5-T4 by publishing "How MyPayTag Works: The Five Roles."
validation: Confirmed the post separates User, Cubid, MyPayTag, PayToDapp, and PayingDapp responsibilities while emphasizing user consent and receive-route preferences.
follow-ups: Continue Sprint 5 with the PayToDapp versus PayingDapp practical integration post.

---

agent: Codex
branch: main
head: 2d60620
summary: Completed GPTW-S5-T5 by publishing "PayToDapp vs PayingDapp: Which One Are You?"
validation: Confirmed the post includes wallet, payout, marketplace, and escrow examples; explains dual-role apps; and points readers to the relevant SDK integration path.
follow-ups: Continue Sprint 5 with the Modality A versus Modality B integration post.

---

agent: Codex
branch: main
head: 1844e4f
summary: Completed GPTW-S5-T6 by publishing "Modality A vs Modality B: Two Ways to Integrate Wallets."
validation: Confirmed the post explains Modality A as resolver-built intent context, Modality B as route registration plus provider-built intents, and states that MVP integrations should use Modality B.
follow-ups: Continue Sprint 5 with the minimal API developer post.

---

agent: Codex
branch: main
head: f39da0b
summary: Completed GPTW-S5-T7 by publishing "The Minimal API for Identity-Based Crypto Payments."
validation: Confirmed the post includes a verified-stamp resolve request with supported paths, amount, purpose, one-time intent mode, PayingDapp reference, and public status handling aligned to the SDK/API contract.
follow-ups: Continue Sprint 5 with the PayToDapp integration walkthrough.

---

agent: Codex
branch: main
head: eb711e6
summary: Completed GPTW-S5-T8 by publishing "Building a PayToDapp Integration."
validation: Confirmed the post covers app registration, user consent, route capability registration, Modality B callbacks, revocation, provider SDK helpers, and mock resolver testing without telling PayToDapps to submit wallet addresses.
follow-ups: Continue Sprint 5 with the PayingDapp integration walkthrough.

---

agent: Codex
branch: main
head: 9215a8e
summary: Completed GPTW-S5-T9 by publishing "Building a PayingDapp Integration."
validation: Confirmed the post covers collecting an approved pay-to identifier, resolver authorization, supported paths, resolved/no_route/user_action_required/authorization_required handling, and payment intent presentation.
follow-ups: Continue Sprint 5 with the universal CubidID privacy post.

---

agent: Codex
branch: main
head: d2b5ab2
summary: Completed GPTW-S5-T10 by publishing "Why We Don't Use a Universal CubidID."
validation: Confirmed the post explains app-scoped DappUserId behavior, user-approved pay-to identifiers, cross-dapp tracking prevention, and enumeration-aware privacy boundaries.
follow-ups: Continue Sprint 5 with the four identity options post.

---

agent: Codex
branch: main
head: 20006c3
summary: Completed GPTW-S5-T11 by publishing "Four Ways to Identify a User for Payment Resolution."
validation: Confirmed the post covers verified stamps, PublicCubidPayToID, Cubid-brokered DappUserId sharing, and manual fallback identifiers while recommending verified stamps as the likely MVP default and public IDs as optional.
follow-ups: Sprint 5 blog publishing todos are complete; run full site validation before pushing or release review.

---

agent: Codex
branch: main
head: 30fd971
summary: Removed the hosted setup/requesting-app approval flow from the public site and kept route selection as the only hosted action surface.
validation: Ran pnpm typecheck, pnpm lint, pnpm build, pnpm scan:browser-secrets, and pnpm privacy:route-selection; Next no longer builds /actions/setup or /api/actions/setup routes.
follow-ups: Update any future site acceptance work to cover route selection only, with send-to channels enabled by default for requesting apps.

---

## 2026-06-26-gptw-s6-t1

agent: Codex
branch: feature/mypaytag-resolver-migration
todo: mypaytag-site:GPTW-S6-T1
summary: Kept the homepage solver-adapter section aligned with the public six-solver set and added a stable solver-adapters anchor/test hook for ongoing content checks.
validation: Ran pnpm typecheck, pnpm lint, and pnpm build.
follow-ups: Add a public developer explainer for preferred-solver behavior, quote fanout, and receive-requirement boundaries.

---

## 2026-06-26-gptw-s6-t2

agent: Codex
branch: feature/mypaytag-resolver-migration
todo: mypaytag-site:GPTW-S6-T2
summary: Added a public solver adapter developer explainer covering payor-app flow layering, preferred-solver behavior, quote fanout, resolved receive requirements, and privacy boundaries, then linked it from the site README.
validation: Ran a public-content scan on docs/engineering/solver-adapter-developer-explainer.md for private repo links and private credential terms, plus pnpm typecheck and pnpm lint.
follow-ups: Add a lightweight solver-content check for homepage solver names, private-term leakage, and responsive solver-section rendering.

---

## 2026-06-26-gptw-s6-t3

agent: Codex
branch: feature/mypaytag-resolver-migration
todo: mypaytag-site:GPTW-S6-T3
summary: Added a solver-content validation script and package command that checks the homepage for all six public solver names, private-boundary leakage, and responsive solver-section layout markers.
validation: Ran pnpm check:solver-content, pnpm typecheck, pnpm lint, and pnpm build.
follow-ups: Continue with SmarTrust Wallet adapter migration work against the generic MyPayTag SDK and backend boundaries.

---

## 2026-06-28-gptw-s7-t1

agent: Codex
branch: codex/mypaytag-mvp-realignment-20260628
todo: mypaytag-site:GPTW-S7-T1
summary: Renamed remaining browser-visible GlobalPayTo-era demo identifiers from gptr to mpt, updated the mock developer key prefix, and replaced the stale public GitHub org link with the MyPayTag org link after checking the sibling realignment docs.
validation: Ran pnpm typecheck, pnpm lint, pnpm privacy:route-selection, and an rg scan for stale public GlobalPayTo/gptr/globalpayto terms.
follow-ups: Continue Sprint 7 with MVP-versus-future public copy framing.

---

## 2026-06-28-gptw-s7-t2

agent: Codex
branch: codex/mypaytag-mvp-realignment-20260628
todo: mypaytag-site:GPTW-S7-T2
summary: Reframed homepage, track, API docs, and playground copy so the MVP path is Paytag to MyPayTag route selection to PayToDapp provider intent, with Cubid described as identity/consent only and solver/bridge/swap quote material labeled as future execution-adapter capability.
validation: Ran pnpm typecheck, pnpm lint, pnpm check:solver-content, and a targeted rg scan for stale pay-to-tag/sending-app/receiving-app and MVP execution-implying phrases on edited surfaces.
follow-ups: Sync public API docs from the corrected SDK artifacts.

---

## 2026-06-28-gptw-s7-t3

agent: Codex
branch: codex/mypaytag-mvp-realignment-20260628
todo: mypaytag-site:GPTW-S7-T3
summary: Synced public OpenAPI and Postman artifacts from the corrected mypaytag-sdk output through pnpm api:postman, then updated the hand-authored API docs examples to show opaque/default and raw-explicit paytags plus the full MyPayTag intent/provider_json schema.
validation: Ran pnpm api:postman, pnpm api:validate, pnpm check:openapi-sync, pnpm scan:browser-secrets, pnpm typecheck, pnpm lint, a targeted stale-example rg scan, and SHA-256 comparison confirming site OpenAPI/Postman artifacts match the SDK files.
follow-ups: Harden hosted route-selection UX against the corrected backend action model.

---

## 2026-06-28-gptw-s7-t4

agent: Codex
branch: codex/mypaytag-mvp-realignment-20260628
todo: mypaytag-site:GPTW-S7-T4
summary: Hardened hosted route selection by accepting the corrected opaque mpt_act action shape, encoding action IDs before client fetch/submit URLs, removing prior transaction/account fixture details from hydrated route options, adding safe mock terminal states, and stripping identifiers/routes from non-ready action responses.
validation: Ran pnpm privacy:route-selection, pnpm typecheck, pnpm lint, targeted rg scans for prior transaction/account/provider-internal/wallet-graph leakage in route-selection files, and pnpm build.
follow-ups: Link Cubid-owned Paytag identity work out to Cubid.

---

## 2026-06-28-gptw-s7-t5

agent: Codex
branch: codex/mypaytag-mvp-realignment-20260628
todo: mypaytag-site:GPTW-S7-T5
summary: Added homepage, API docs, playground, and README guidance that sends stamp elevation, opaque Paytag creation/selection, raw-stamp exposure, and Paytag grant/revoke ceremonies to Cubid Passport hosted actions instead of implementing identity management in MyPayTag.
validation: Ran pnpm typecheck, pnpm lint, targeted rg scans for direct-management wording and Cubid Passport hosted-action links, and pnpm build.
follow-ups: Harden playground wording and document launch-readiness smoke.

---

## 2026-06-28-gptw-s7-t6

agent: Codex
branch: codex/mypaytag-mvp-realignment-20260628
todo: mypaytag-site:GPTW-S7-T6
summary: Hardened the playground around real MyPayTag MVP contracts by removing the non-public Cubid validation call, updating route registration and resolve payloads to Paytag/authorizationToken shapes, keeping solver quotes labeled as future SDK simulation, and adding a launch-readiness smoke checklist.
validation: Ran pnpm lint, pnpm typecheck, pnpm scan:browser-secrets, pnpm check:openapi-sync, pnpm api:validate, pnpm privacy:route-selection, pnpm check:solver-content, pnpm build, targeted playground stale-field rg scans, and confirmed package.json has no pnpm test script.
follow-ups: Sprint 7 site realignment todos are complete; hosted staging smoke still must be run before launch readiness is claimed.

---

## 2026-06-28-gptw-s4-t1

agent: Codex
branch: codex/mypaytag-mvp-realignment-20260628
todo: mypaytag-site:GPTW-S4-T1
summary: Added a hosted-action acceptance check covering route selected, leave-unchanged/denied, expired, invalid, completed, and restart-required states, signed-in loading, safe terminal-state copy, sanitized hidden-state details, and constrained route-selection decisions.
validation: Ran pnpm check:hosted-actions, pnpm privacy:route-selection, pnpm typecheck, and pnpm lint.
follow-ups: Close Sprint 4 responsive and accessibility coverage for hosted action pages.

---

## 2026-06-28-gptw-s4-t2

agent: Codex
branch: codex/mypaytag-mvp-realignment-20260628
todo: mypaytag-site:GPTW-S4-T2
summary: Added a hosted-action accessibility and responsive-layout check for mobile/desktop classes, semantic button controls, disabled submit states, icon aria-hidden flags, readable line heights, and visible loading/unavailable states.
validation: Ran pnpm check:hosted-action-a11y, pnpm typecheck, pnpm lint, and pnpm build.
follow-ups: Close Sprint 4 public README and setup documentation.

---

## 2026-06-28-gptw-s4-t3

agent: Codex
branch: codex/mypaytag-mvp-realignment-20260628
todo: mypaytag-site:GPTW-S4-T3
summary: Updated README validation and setup guidance to document hosted-action checks, route-selection privacy checks, browser-secret scanning, local mock-action boundaries, and the split between public site UX, SDK protocol docs, and private resolver/backend operations.
validation: Ran pnpm check:hosted-actions, pnpm check:hosted-action-a11y, pnpm scan:browser-secrets, pnpm typecheck, and pnpm lint.
follow-ups: Close Sprint 4 public-doc private-link and implementation-leakage validation.

---

## 2026-06-28-gptw-s4-t4

agent: Codex
branch: codex/mypaytag-mvp-realignment-20260628
todo: mypaytag-site:GPTW-S4-T4
summary: Added a public-doc scanner that blocks private backend paths, backend repo references, SQL/RLS snippets, service-role env names, provider callback secret details, database credentials, private audit details, and admin tool details while allowing explicit public boundary guidance.
validation: Ran pnpm scan:public-docs, pnpm scan:browser-secrets, pnpm lint, and pnpm typecheck.
follow-ups: Sprint 4 is complete; continue with Sprint 8 NEAR 1Click MVP site correction.

---

## 2026-06-28-gptw-s8-t1

agent: Codex
branch: codex/mypaytag-mvp-realignment-20260628
todo: mypaytag-site:GPTW-S8-T1
summary: Reframed homepage, marketing track, and solver explainer copy so NEAR Intents / 1Click is the Phase 1 MVP swap and bridge adapter for the initial SmarTrust path, while LI.FI, Squid, 0x, Across, LayerZero/Stargate, broad fanout, and generic adapters remain Phase 2.
validation: Ran pnpm check:solver-content, pnpm typecheck, and pnpm lint.
follow-ups: Add NEAR 1Click MVP playground quote and selected-quote flows.

---

## 2026-06-28-gptw-s8-t2

agent: Codex
branch: codex/mypaytag-mvp-realignment-20260628
todo: mypaytag-site:GPTW-S8-T2
summary: Added playground examples and local simulated responses for an MVP NEAR 1Click quote request and selected-quote payable instruction, using SmarTrust as the initial PayingDapp/PayToDapp while keeping broad solver fanout labeled Phase 2.
validation: Ran pnpm typecheck, pnpm lint, pnpm build, and a targeted rg scan to ensure old future-only quote wording was removed from playground surfaces.
follow-ups: Update public API docs for revised MVP quote and selected-quote paths.

---

## 2026-06-28-gptw-s8-t3

agent: Codex
branch: codex/mypaytag-mvp-realignment-20260628
todo: mypaytag-site:GPTW-S8-T3
summary: Synced public OpenAPI/Postman artifacts from the SDK, updated hand-authored API docs with the canonical notification example, and added a NEAR 1Click selected-quote provider_json example that separates the Phase 1 SmarTrust path from Phase 2 adapter fanout.
validation: Ran pnpm check:openapi-sync, pnpm api:validate, pnpm scan:public-docs, pnpm typecheck, pnpm lint, pnpm build, and a targeted stale-field scan on src/app/api-docs/page.tsx. Generated public/api artifacts still match the SDK source and retain SDK-owned notification OpenAPI fields until the upstream contract removes them.
follow-ups: Harden hosted action fallback behavior so static fixtures cannot mask staging or production failures.

---

## 2026-06-28-gptw-s8-t4

agent: Codex
branch: codex/mypaytag-mvp-realignment-20260628
todo: mypaytag-site:GPTW-S8-T4
summary: Gated hosted route-selection fixtures behind explicit local/test mock mode, made backend hydration and completion failures fail closed outside that mode, added visible mock-mode UI copy, and documented the mock-mode boundary.
validation: Ran pnpm check:hosted-actions, pnpm privacy:route-selection, pnpm scan:browser-secrets, pnpm typecheck, pnpm lint, pnpm scan:public-docs, and pnpm build.
follow-ups: Update launch smoke guidance for the SmarTrust and NEAR 1Click MVP path.

---

## 2026-06-28-gptw-s8-t5

agent: Codex
branch: codex/mypaytag-mvp-realignment-20260628
todo: mypaytag-site:GPTW-S8-T5
summary: Revised launch-readiness smoke guidance so local gates include hosted-action, public-doc, and solver-content checks, and hosted staging smoke covers SmarTrust as the first PayingDapp/PayToDapp plus NEAR 1Click quote, selected-quote, and payable-instruction paths.
validation: Ran pnpm scan:public-docs, pnpm check:solver-content, pnpm typecheck, and pnpm lint.
follow-ups: Replace broad solver content guardrails with the revised Phase 1/Phase 2 enforcement.

---

## 2026-06-28-gptw-s8-t6

agent: Codex
branch: codex/mypaytag-mvp-realignment-20260628
todo: mypaytag-site:GPTW-S8-T6
summary: Replaced broad solver homepage-name assertions with guardrails that require NEAR Intents / 1Click as Phase 1 MVP execution content, require Phase 2 labeling for LI.FI, Squid, 0x, Across, LayerZero/Stargate, broad fanout, and generic adapters, and fail if public copy frames NEAR as future-only or non-MVP.
validation: Ran pnpm check:solver-content, pnpm typecheck, pnpm lint, and pnpm build.
follow-ups: Hosted staging smoke is still required before launch readiness can be claimed.

---

## 2026-07-08-gptw-s11-i18n

agent: Codex
branch: codex/mypaytag-site-i18n-sprint-20260708
todo: mypaytag-site:GPTW-S11-T1 through mypaytag-site:GPTW-S11-T7
summary: Implemented the typed UI internationalization sprint with i18next/react-i18next runtime wiring, typed namespaces and keys, English and Swedish resources, generated en-XA pseudo-locale resources, first-pass shell UI string extraction, a developer-console locale fixture, Sweden-aware locale defaults, and a CI-safe translation completeness check.
validation: Ran pnpm lint, pnpm typecheck, pnpm check:i18n, and pnpm build. The i18n check validates English/Swedish resource completeness, orphaned translation keys, pseudo-locale export presence, and extracted shell UI strings staying out of inline JSX.
follow-ups: Continue extracting deeper long-form marketing, playground, hosted-action, and developer-console copy into the typed namespace resources as those pages receive UI work.

---

## 2026-07-13-vercel-workspace-dependency-fix

agent: Codex
branch: codex/mypaytag-site-i18n-sprint-20260708
todo: deployment follow-up for PR 4
summary: Diagnosed the failing Vercel deployment as an isolated-checkout dependency resolution issue: production cloned only MyPayTag-site and could not resolve Cubid packages from `../../cubid/...`. Switched deployable Cubid dependencies to published npm versions, removed sibling workspace package entries, added a pnpm override for the published auth-react workspace dependency leak, and replaced the unpublished `@cubid/comms` demo import with a deploy-safe placeholder.
validation: Used `vercel inspect dpl_4SCw8fWE8WvDhQna4aJMBFBF2HYn --logs` to confirm the failing imports, then ran pnpm lint, pnpm typecheck, and pnpm build locally.
follow-ups: Re-enable live Cubid comms preference loading after `@cubid/comms` is published as a standalone npm package.

---

## 2026-07-13-pr4-review-fixes

agent: Codex
branch: codex/mypaytag-site-i18n-sprint-20260708
todo: PR 4 code review follow-up
summary: Addressed PR 4 review feedback by preserving i18next interpolation placeholders in pseudo-locale output, initializing the client i18n instance from the stored developer fixture locale to avoid a language flash, keeping the developer fixture out of the long-lived server locale cookie, and moving the translated homepage body into a client component while restoring `src/app/page.tsx` as a server component wrapper.
validation: Ran pnpm check:i18n, pnpm lint, pnpm typecheck, and pnpm build.
follow-ups: Add a real user-facing locale setting before writing `mypaytag.locale` cookies from the UI.

---

## 2026-07-13-vercel-preview-smoke-and-env

agent: Codex
branch: codex/mypaytag-site-i18n-sprint-20260708
todo: Vercel PR 4 deployment smoke and env audit
summary: Redeployed the successful PR 4 Vercel preview after correcting the branch preview `NEXT_PUBLIC_CUBID_REDIRECT_URI`, smoke-tested protected preview routes through `vercel curl`, audited preview and production Vercel environment variables with redacted output, and corrected the production redirect URI placeholder. Left missing server-only Cubid/API playground secrets unset because no real values are present in Vercel and the candidate backend Supabase project did not have the required functions deployed.
validation: Vercel redeploy `dpl_1CLfx1du9hDWRWG3zbcWjdvRS9L4` reached Ready. Smoke-tested `/`, `/api-docs`, `/api-playground`, `/developer`, `/enter-paytag`, `/history`, `/auth/callback`, and `/actions/route-selection/demo-action` with authenticated Vercel CLI bypass; all returned 200 MyPayTag HTML with no app error. Verified API playground returns the expected disabled response while live backend secrets remain unset.
follow-ups: Add real `CUBID_API_KEY`, `CUBID_DAPP_ID`, `MYPAYTAG_RESOLVER_BASE_URL`, and `MYPAYTAG_PLAYGROUND_DAPP_SECRETS_JSON` only after the Cubid dapp credentials and deployed MyPayTag backend function base are available.
