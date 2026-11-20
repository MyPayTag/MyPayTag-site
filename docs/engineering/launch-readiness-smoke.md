# Launch Readiness Smoke Checklist

Date: 2026-06-28
Status: staging smoke required before launch readiness is claimed

This checklist documents the validation gate for the MyPayTag public site. Do
not mark the site launch-ready until both local checks and hosted staging smoke
are complete against Cubid, MyPayTag, one test PayingDapp, and one test
PayToDapp. For the MVP smoke, SmarTrust is the first PayingDapp and PayToDapp,
and NEAR Intents / 1Click is the Phase 1 swap and bridge execution adapter.

## Local Checks

Run from `/Users/botmaster/src/myPayTag/mypaytag-site`:

```sh
pnpm lint
pnpm typecheck
pnpm build
pnpm scan:browser-secrets
pnpm check:openapi-sync
pnpm api:validate
pnpm check:hosted-actions
pnpm check:hosted-action-a11y
pnpm privacy:route-selection
pnpm scan:public-docs
pnpm check:solver-content
pnpm check:i18n
```

This repo currently has no `pnpm test` script. If a test script is added, it
must be included in this local gate before launch readiness is claimed.

## Hosted Staging Smoke

Use staging environments only:

1. Cubid Passport can create or complete a Cubid-owned Paytag hosted action for
   stamp elevation, opaque Paytag creation or selection, explicit raw-stamp
   exposure, and Paytag grant/revoke.
2. MyPayTag can validate an authorized Paytag through Cubid without sending
   wallet, route, provider, payment intent, settlement, solver, bridge, or swap
   details to Cubid.
3. SmarTrust can act as the first PayToDapp and register supported route
   capabilities through
   `/payto-routes` without submitting wallet addresses, memos, account ids,
   payment links, or payment instructions.
4. SmarTrust can act as the first PayingDapp and call `/resolve` with a Paytag,
   supported paths, amount, purpose, and reference, then receive either a
   one-time provider intent, a safe public status, or an opaque route-selection
   action URL.
5. A hosted MyPayTag route-selection URL requires sign-in before details
   hydrate, shows only eligible PayToDapps for the current action/user, and
   strips route details for expired, invalid, denied, completed, or already-used
   states.
6. SmarTrust can request a NEAR 1Click swap or bridge quote after MyPayTag has
   resolved the Paytag and selected route.
7. SmarTrust can select the NEAR 1Click quote and receive a payable instruction
   inside the MyPayTag provider-json envelope without exposing raw wallet,
   bridge, swap, or quote details to Cubid.
8. Same-chain same-token transfer handling is a PayingDapp decision. MyPayTag
   should not force that path through NEAR 1Click or through a local transfer.
9. The playground demonstrates real MyPayTag MVP API calls for route
   registration, resolve, hosted action hydration, route-selection completion,
   NEAR 1Click MVP quote, and selected-quote payable-instruction examples.
   Broad solver quote fanout remains visibly labeled as Phase 2 simulation.
10. Notification copy says `payment_intent_created` only and does not claim
   payment receipt or settlement.

Record the staging environment URLs, test dapp ids, action ids, and command
outputs in the session log before claiming launch readiness.
