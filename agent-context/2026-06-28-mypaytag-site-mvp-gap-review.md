# MyPayTag Site MVP Gap Review

Date: 2026-06-28
Repo: `mypaytag-site`
Branch: `codex/mypaytag-mvp-realignment-20260628`
Status: gap review and required changes

## Review Baseline

The site branch is aligned with the earlier MyPayTag MVP realignment that treated all solver, swap, bridge, and quote behavior as future positioning. The MVP scope has since changed:

- Phase 1 includes core MyPayTag identity, route registration, resolve, provider callback, and hosted action flows.
- Phase 1 includes SmarTrust as the initial PayingDapp and PayToDapp.
- Phase 1 includes NEAR Intents / 1Click as the only MVP swap and bridge execution adapter.
- Phase 2 keeps LI.FI, Squid, 0x, Across, LayerZero / Stargate, broad solver fanout, and generic external adapter support.
- Same-chain same-token transfers can still go through MyPayTag, but PayingDapps decide whether to use MyPayTag or execute those transfers locally.

## What Is Aligned

- Public copy now uses MyPayTag and Paytag branding rather than GlobalPayTo.
- Cubid is framed as identity, consent, verified stamps, and aliases rather than wallets or payment routing.
- The primary identity and route story is MyPayTag-branded and powered by Cubid primitives.
- Hosted route-selection pages are signed-in, noindexed, and avoid unauthenticated route disclosure.
- Route-selection UI avoids exposing raw wallet addresses, provider credentials, or unrelated wallet graph data.
- API docs and public artifacts are generated from the SDK rather than hand-edited.

## Gaps

1. NEAR Intents / 1Click is still treated as future content.
   - The homepage groups NEAR 1Click with LI.FI, Squid, 0x, Across, and LayerZero / Stargate under future execution adapters.
   - Marketing copy says solver, bridge, swap, and quote support are outside the MVP core path.
   - This is now incorrect because NEAR 1Click is the only MVP execution adapter for SmarTrust swap and bridge operations.

2. The playground does not demonstrate MVP quote or quote-selection paths.
   - The only quote path is `simulateQuotes`.
   - The simulation fans out across all solver IDs, including Phase 2 adapters.
   - The copy says no public quote Edge Function exists yet and describes quote handling as non-MVP.
   - The site therefore cannot demonstrate the happy paths where a PayingDapp receives NEAR 1Click quotes, chooses one, and receives payable instructions.

3. Launch-readiness smoke omits the revised SmarTrust plus NEAR 1Click MVP.
   - The smoke doc still treats solver quote fanout as future simulation.
   - It does not require a hosted staging smoke across Cubid, MyPayTag, SmarTrust as PayingDapp, SmarTrust as PayToDapp, and NEAR 1Click quote selection.

4. Public API docs still describe quote readiness as future-only.
   - The docs need to distinguish the MVP NEAR 1Click path from Phase 2 execution adapters.
   - The docs should show the MVP route from paytag resolve to NEAR 1Click quote selection to payable instruction once the SDK and backend contracts are corrected.

5. Notification docs still publish an older payload shape.
   - The site currently republishes SDK artifacts containing `event`, `recipientDisplay`, and `resolverRequestId` examples.
   - After the SDK contract is corrected, the site should resync to the canonical notification schema instead of preserving the stale examples.

6. Hosted route-selection mocks can mask staging failures.
   - Local fallback mock actions are useful for development.
   - Staging and production should fail closed or visibly enter mock mode when resolver backend calls fail, so launch smoke cannot pass against static fixture data.

7. The site solver-content check enforces the old broad-solver framing.
   - The check currently requires all six solver names on the homepage.
   - It should instead require NEAR 1Click as Phase 1/MVP and all other adapters as Phase 2/future.

## Required Changes

1. Reframe execution content around the revised phase split.
   - Present NEAR Intents / 1Click as the only MVP swap and bridge adapter.
   - Keep LI.FI, Squid, 0x, Across, LayerZero / Stargate, broad fanout, and generic adapters in Phase 2 sections.
   - Avoid language that implies all swaps, bridges, or solver support are future-only.

2. Add MVP NEAR 1Click playground coverage.
   - Add examples for quote request, quote selection, and payable instruction flows.
   - Use SmarTrust as the first PayingDapp and PayToDapp example where relevant.
   - Keep any broad solver fanout simulation explicitly labeled as Phase 2.

3. Update launch smoke documentation.
   - Require local validation first.
   - Require staged Cubid identity and consent validation.
   - Require MyPayTag route registration, resolve, provider callback, hosted action, and negative-disclosure checks.
   - Require one SmarTrust same-chain direct-transfer decision point and one SmarTrust swap or bridge path through NEAR 1Click.

4. Resync API docs after SDK and backend contract updates.
   - Keep generated artifacts generated.
   - Remove stale notification examples once upstream artifacts are corrected.
   - Add public documentation for the MVP NEAR 1Click quote and selected-quote payable-instruction path when available.

5. Harden environment behavior for hosted actions.
   - Allow static mock fallback only in explicit local development mode.
   - Fail closed in staging and production when resolver backend calls fail.
   - Make mock mode visually and operationally obvious when enabled.

6. Update site validation scripts.
   - Replace the broad solver-name requirement with checks that enforce the new MVP/Phase 2 split.
   - Add checks that prevent NEAR 1Click from being described as future-only.
   - Preserve existing checks that block private backend terms, service-role language, and provider credentials from public content.

## Validation Run

The following commands passed on 2026-06-28:

```sh
pnpm lint
pnpm typecheck
pnpm build
pnpm scan:browser-secrets
pnpm check:openapi-sync
pnpm api:validate
pnpm privacy:route-selection
pnpm check:solver-content
```

Passing validation confirms build health, not MVP alignment. The current checks still encode the old broad-solver framing and need to be updated.
