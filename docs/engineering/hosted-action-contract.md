# Hosted Action Contract

Date: 2026-06-24  
Status: Sprint 1 finalized design  
Repo: `mypaytag-site`

## Scope

This public site repo implements browser-safe hosted actions for MyPayTag route selection and Cubid comms notification landing targets. It consumes the public contracts finalized in `mypaytag-sdk/docs/engineering/mvp-api-contracts.md` and does not own private resolver behavior.

Per-request setup and authorization approval pages are out of scope. Send-to
channels are pre-authorized for requesting apps by default; users manage where
funds land by selecting or changing receive-route preferences.

The app also includes signed-in access for `/actions/*`, `/history`, and
`/developer`. This is currently a temporary mock header session until SIWC is
connected.
Route-selection action details and history rows are not rendered for signed-out
users.

## Hosted Action Inputs

Hosted action pages receive opaque, short-lived action identifiers. They must not receive raw backend records or production database credentials.

Common page inputs:

- action id,
- short-lived action token,
- dapp display metadata,
- masked pay-to identifier display when safe,
- route options only for the current action.

Public URLs must carry only opaque action identifiers or short-lived tokens. Display metadata, masked identifiers, and route options must be hydrated after action-token validation so they do not leak through referrers, browser history, CDN logs, or analytics.

The route-selection page fetches action details only after the auth gate has
reached a signed-in state. The incoming history page is also gated and is scoped
to the signed-in user's resolver activity.

Notification-triggered visits from Cubid comms use the same action identifier model.

## Hosted Action Outcomes

Pages map user and resolver outcomes to a small browser-safe state model:

| Page outcome | Meaning |
| --- | --- |
| `denied` | User declined the requested action. |
| `selected_route` | User selected a route/default. |
| `expired` | Action token expired. |
| `invalid` | Action token or action id is invalid. |
| `completed` | Action was already completed. |
| `restart_required` | User must restart the route-selection action. |

The site renders friendly copy for these outcomes and does not expose private backend diagnostics.

## Browser-Safe Runtime Configuration

Browser-safe values may use `NEXT_PUBLIC_*`, including Cubid issuer/client/display configuration required for public flows.

Server-only or private values must not appear in browser env vars or bundles:

- resolver secrets,
- Cubid dapp API keys,
- service-role keys,
- provider callback credentials,
- production database credentials.

Any server route added in this repo must be reviewed against this public/private split before it is used.

## User-Facing Copy

Copy must cover:

- route selection required,
- authorization required,
- provider temporarily unavailable,
- expired or invalid action links,
- payment intent created.

Copy for provider-reported receipt events or Cubid-comms-driven user-action notifications is outside MVP until those events have explicit trust, disclosure, and callback contracts.

Copy must not imply that MyPayTag exposes a wallet graph, profile directory,
dashboard, inbox, settlement tracker, or public activity feed. The signed-in
history page may describe resolver activity types: route availability queries,
option-producing intents, initiated transactions, and all activity.

## Privacy Rules

Hosted action pages must show only data needed for the current action:

- show masked identifiers rather than raw private identifiers when possible,
- show only route options relevant to the current route-selection action,
- do not show unrelated PayToDapps, unrelated routes, route preferences, wallet addresses, provider internals, or private diagnostics.

Route-selection pages must validate the action state before rendering eligible PayToDapps or defaults. Expired, invalid, completed, denied, and restart-required states must not reveal whether the hidden recipient has other routes.

History pages must show only the signed-in user's MyPayTag activity. Query
rows mean a PayingDapp checked available routes only. Intent rows mean a request
like "send USDT from Base to this recipient" produced a set of options.
Transaction rows mean an option was selected and a transfer was initiated; they
must not imply provider-confirmed settlement.

Cubid comms notification links may land on hosted actions, but the site is not the notification delivery system.

## Acceptance

Sprint 1 site alignment is complete when:

- hosted action inputs and outputs are defined,
- browser-safe configuration boundaries are documented,
- public copy requirements cover statuses and Cubid comms notifications,
- site docs reference only public SDK contracts and stable dependency IDs, not private backend files.
