# MyPayTag Hosted User Actions Architecture

Date: 2026-06-24  
Status: MVP architecture  
Repo: `mypaytag-site`

## Scope

This public repo owns the user-facing MyPayTag site and the minimal hosted action pages needed by the MVP. It should stay focused on browser-safe user experiences and must not contain private resolver implementation details.

The MVP site surfaces are:

- Persistent app header with temporary mock Sign In / Sign Out until SIWC is connected.
- route-selection links for choosing a default when multiple PayToDapps support the same route.
- signed-in incoming history for resolver activity grouped by PayingDapp, PayToDapp, token, or chain, with quick filters for queries, intents, transactions, and all activity.
- mock developer console for API provisioning, key rotation, developer invites, and recent app history.
- landing targets for Cubid comms `payment_intent_created` notifications when the notification links back to the current intent context.

The site does not own production Supabase schema, Edge Functions, provider callbacks, audit logging, private admin tools, or operational resolver logic.

For public protocol contracts and integration examples, see the MyPayTag SDK repository docs, especially `docs/engineering/protocol-and-sdk-architecture.md` and `docs/engineering/mvp-api-contracts.md`.

## Product Boundary

The site is not a full dashboard in the MVP. It should not include:

- wallet manager pages,
- public searchable profiles,
- directory pages,
- payment status tracking beyond the action being completed,
- notification inboxes or activity feeds,
- direct wallet graph display,
- arbitrary wallet connection,
- private admin or provider operation views.

The site exists to help a user safely complete receive-route selection that an
API flow could not finish without user involvement and to let a signed-in user
review MyPayTag resolver activity without exposing wallet graphs. The history
view is intentionally narrow: it distinguishes route availability queries,
option-producing intents, and initiated transactions, but it is not a wallet
manager, payment settlement tracker, inbox, or admin console.

MVP notifications are limited to `payment_intent_created` through Cubid comms. Payment-received landing behavior belongs to a future provider-reported receipt phase with its own trust and disclosure rules. The site may render a linked intent-created landing target, but it should not become the notification delivery system.

## User Actions

### Send-To Channel Defaults

Send-to channels are pre-authorized for requesting apps by default. The public
site should not ask users to approve each requesting app before it can request a
payment intent.

Users should instead control receive behavior through route preferences,
revocation paths, and future channel-management surfaces.

### Select Route Priority

When more than one PayToDapp supports the same route for a user, the site presents a route-priority/default choice.

The page should show:

- the route, such as Base USDC,
- the eligible PayToDapps,
- the current default when one exists,
- the effect of choosing a default.

The hosted action must validate the action token and authenticate the user before route options, eligible PayToDapps, or current defaults are rendered. Route details should be fetched for that action after validation rather than embedded in an unauthenticated URL. In the current site, the route-selection page is gated by a temporary mock header session and fetches action details from the action API only after the user reaches the signed-in state. Replace this mock gate with SIWC once connected.

It should not reveal unrelated routes, wallet addresses, provider internals, or a user's broader payment graph.

## Runtime Boundaries

Browser-safe values can use `NEXT_PUBLIC_*`. Resolver secrets, Cubid dapp API keys, service-role keys, provider callback credentials, and database credentials must never be exposed in browser env vars or client bundles.

The site may call public backend action endpoints when a user submits an authorization or route selection. It should not write directly to production Supabase.

Any server route added to this app must be reviewed against the public/private split:

- Browser-safe UI orchestration belongs here.
- Private resolver decisions and durable writes belong behind backend APIs.
- Provider callback handling belongs outside this repo.

## Dependencies

This repo is forked from `Cubid-Me/cubid-starter-v3` and currently demonstrates Cubid identity primitives. The MyPayTag site should reuse those Cubid patterns where they fit:

- Login with Cubid / OIDC PKCE for user identity.
- Hosted Cubid verification or consent launchers where needed.
- Server-only Cubid calls only when secrets remain server-side.
- Cubid comms links or preferences where needed for notification-driven user actions.

Keep deprecated wallet-heavy Cubid starter patterns out of this app.

## API Expectations

The hosted action pages should receive opaque action identifiers or tokens, not private backend state. `/actions/*`, `/history`, and `/developer` are signed-in app surfaces; unauthenticated users see the mock header sign-in path until SIWC replaces it.

Sprint 1 hosted action contract details live in [`hosted-action-contract.md`](./hosted-action-contract.md).

Sprint 2 flow design details live in [`hosted-action-flow-design.md`](./hosted-action-flow-design.md).

Expected page inputs:

- action id,
- short-lived action token,
- dapp display metadata,
- masked pay-to identifier display when safe,
- route options for route selection.

Public URLs carry only opaque action identifiers or short-lived tokens. Dapp metadata, masked identifiers, and route options are hydrated from backend action endpoints after validation.

Expected page outputs:

- user denied,
- selected route/default,
- expired or invalid action,
- restart-required state.

The public SDK docs should define any response status names that integrators need to handle. The site should present user-friendly copy for those statuses without exposing private diagnostic details.

Notification-triggered visits should use the same opaque action identifiers or short-lived tokens as other hosted action pages.

History page inputs:

- signed-in Cubid browser session,
- grouping mode: PayingDapp, PayToDapp, token, or chain,
- optional activity type filter: queries, intents, transactions, or all.

History rows show only the current user's resolver activity. Transactions show
sent timestamp, PayingDapp, sent value, token, and chain, plus received
timestamp, PayToDapp, received value, token, and chain. Queries and intents use
the same row shape but must not imply settlement or payment receipt.

## Privacy Requirements

The site must:

- show only the data needed for the current user action,
- avoid revealing other PayToDapps or routes unless required for the current selection,
- avoid displaying raw wallet addresses in MVP route registration flows,
- avoid storing secrets in local storage,
- handle expired links without leaking whether a recipient exists,
- avoid displaying notification content that exposes wallet graphs, unrelated PayToDapps, route preferences, provider internals, or raw identifiers,
- keep `/actions/*` and `/history` behind Cubid sign-in,
- keep history scoped to the current signed-in user and avoid exposing wallet addresses, unrelated routes, or settlement claims,
- use masked identifier displays when a stamp value is shown.

## Acceptance Targets

The site architecture is MVP-complete when:

- a user can choose a route default when overlapping PayToDapp routes exist,
- a user can sign in before viewing route-selection or history pages,
- a developer can sign in before viewing API keys, team invites, and app history,
- a user can review incoming resolver activity by group and activity type without wallet graph disclosure,
- expired or invalid links fail safely,
- the browser bundle contains no resolver secrets,
- the site calls backend APIs rather than writing directly to production data stores,
- Cubid comms `payment_intent_created` notification links land on safe hosted action states,
- public copy avoids wallet graph disclosure.
