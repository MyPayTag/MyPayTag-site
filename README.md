# MyPayTag Site

Public marketing app/site for MyPayTag.

This repo owns the developer-led marketing homepage for MyPayTag plus the
browser-safe hosted pages used for signed-in route-selection links, signed-in
incoming history, and notification landing targets. Private resolver
implementation, production Supabase schema, provider callbacks, audit logging,
and admin tooling belong outside this public repo.

## Architecture

- [Hosted user actions architecture](docs/engineering/hosted-user-actions-architecture.md)
- [Solver adapter developer explainer](docs/engineering/solver-adapter-developer-explainer.md)
- [Launch readiness smoke checklist](docs/engineering/launch-readiness-smoke.md)
- Public protocol and SDK architecture lives in the sibling `mypaytag-sdk`
  repo.

This repo is forked from [`Cubid-Me/cubid-starter-v3`](https://github.com/Cubid-Me/cubid-starter-v3) so it can continue to receive useful upstream starter updates while the MyPayTag experience is built out.

The current codebase is still the canonical full-stack Next.js starter for the
modern Cubid public SDK package family from
[`Cubid-Me/cubid-sdk`](https://github.com/Cubid-Me/cubid-sdk).

This app demonstrates Cubid as an identity stack first: identity aggregation,
proof of personhood and sybil-defense signals, Login with Cubid, ClearPass
Verify, user notification preferences, and passkey-first wallet recovery.

Deprecated archive references:

- [`Cubid-Me/cubid-starter-v1`](https://github.com/Cubid-Me/cubid-starter-v1)
- `/Users/botmaster/src/cubid/cubid-starter-v2`

Do not copy wallet-heavy examples, old `cubid-sdk` usage, deprecated
`@cubid/web2` / `@cubid/web2-react` imports, Cubid-generated wallet creation,
or normal Cubid transaction-signing examples from those projects.

## What This Starter Shows

- MyPayTag landing page with a persistent mock Sign In / Sign Out header
  until SIWC is connected.
- Three marketing tracks for users, PayingDapp developers, and PayToDapp
  wallet developers.
- Public `/api-docs` page for PayingDapp and PayToDapp developers,
  including endpoint summaries, request examples, statuses, hosted actions,
  notifications, and solver quote ids.
- Public `/api-playground` page with server-signed local demo calls for
  receiving-app route registration and sending-app resolve flows.
- Public OpenAPI 3.1 YAML at `/api/openapi.yaml`, copied from the canonical
  `mypaytag-sdk/api/openapi.yaml` contract source.
- Interactive Scalar API reference at `/reference`, rendered from
  `/api/openapi.yaml`.
- Signed-in `/actions/route-selection/[actionId]` route-selection flow.
- Signed-in `/history` view grouped by PayingDapp, PayToDapp, token, or chain,
  with quick filters for queries, intents, transactions, and all activity.
- `@cubid/core` in a server-only Next.js API route for dapp API-key calls.
- `@cubid/auth` and `@cubid/auth-react` for Login with Cubid / OIDC PKCE.
- `@cubid/browser` and `@cubid/react` for hosted ClearPass Verify launchers.
- Notification channel and preference metadata are represented as a
  deploy-safe placeholder until `@cubid/comms` is published on npm.
- `@cubid/wallet-recovery` and `@cubid/wallet-recovery-react` for hosted,
  user-authorized recoverable-wallet recovery launchers.

Cubid dapp API keys, service-role keys, and recovery bundle material must stay
out of browser env vars and client bundles.

`/actions/*`, `/history`, and `/developer` are protected by Login with Cubid /
OIDC when the browser-safe Cubid config is present. Missing Cubid config shows a
safe setup state instead of silently falling back to a production mock session.
Developer tooling still uses local fixture data for API provisioning, key
rotation, team invites, and recent app history until those backend surfaces are
connected.

`/api-docs`, `/reference`, `/blog`, and the homepage are public
developer-facing surfaces. They should describe only public protocol behavior
and should link developers toward the SDK contracts rather than private resolver
implementation details.

Paytag identity management belongs to Cubid Passport, not this site. Stamp
elevation, opaque Paytag creation or selection, explicit raw-stamp exposure, and
Paytag grant/revoke ceremonies are launched through Cubid-owned hosted action
links such as `https://passport.cubid.me/pay-to/actions/complete?action_token=...`.
MyPayTag pages should link users toward Cubid Passport for those ceremonies and
should not implement stamp or grant management directly.

## Copy-Paste Local Setup

```sh
cd /Users/botmaster/src/myPayTag/mypaytag-site
cp .env.example .env.local
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). If port 3000 is busy,
Next.js will print the alternate local URL. Update
`NEXT_PUBLIC_CUBID_REDIRECT_URI` and the Cubid OIDC client redirect URI to
match that alternate port before testing Login with Cubid.

## Environment Variables

Browser-safe values use `NEXT_PUBLIC_*` and can appear in the client bundle:

```sh
NEXT_PUBLIC_CUBID_ISSUER_URL=https://id.cubid.me
NEXT_PUBLIC_CUBID_OIDC_CLIENT_ID=your-oidc-client-id
NEXT_PUBLIC_CUBID_REDIRECT_URI=http://localhost:3000/auth/callback
NEXT_PUBLIC_CUBID_PASSPORT_BASE_URL=https://passport.cubid.me
NEXT_PUBLIC_CUBID_CLEARPASS_PAGE_ID=your-clearpass-page-id
```

Server-only values are read only by `src/app/api/cubid/server-demo/route.ts`:

```sh
CUBID_API_BASE_URL=https://passport.cubid.me
CUBID_API_KEY=your-dapp-api-key
CUBID_DAPP_ID=your-dapp-id
```

Never rename server credentials to `NEXT_PUBLIC_*`. The starter intentionally
fails the server demo with a safe setup response when `CUBID_API_BASE_URL` or
`CUBID_API_KEY` is missing.

Local MyPayTag API playground values are server-only and used by
`src/app/api/playground/call/route.ts`:

```sh
MYPAYTAG_PLAYGROUND_ENABLED=true
MYPAYTAG_RESOLVER_BASE_URL=http://127.0.0.1:54321
MYPAYTAG_HOSTED_ACTION_MOCK_MODE=false
MYPAYTAG_PLAYGROUND_MOCK_MODE=false
MYPAYTAG_PLAYGROUND_PHASE2_DEMO_MODE=false
MYPAYTAG_PLAYGROUND_DAPP_SECRETS_JSON='{"chaincrew":{"id":"chaincrew","role":"paying_dapp","status":"active","secret":"local-chaincrew-secret"},"smartrust-wallet":{"id":"smartrust-wallet","role":"both","status":"active","secret":"local-smartrust-secret"}}'
```

The playground signs demo MyPayTag requests on the server. Do not expose these
demo secrets through `NEXT_PUBLIC_*` variables. Start local Supabase from the
private backend repo before running live playground calls. NEAR 1Click
playground examples call the backend when `MYPAYTAG_RESOLVER_BASE_URL` is set;
they return local development fixtures only when
`MYPAYTAG_PLAYGROUND_MOCK_MODE=true`. Broad solver fanout is a Phase 2 fixture
and requires `MYPAYTAG_PLAYGROUND_PHASE2_DEMO_MODE=true`.

Authenticated portal settings and history also use server-only
`MYPAYTAG_RESOLVER_BASE_URL` through `/api/portal/preferences` and
`/api/portal/history`. The browser sends the Cubid bearer session to the site
API route, and the site forwards it to the backend `portal-preferences` or
`portal-history` function without exposing backend service config in client
bundles.

## Cubid Console Setup

Create or configure an OIDC client in Cubid with:

- Issuer URL: the Cubid issuer, for example `https://id.cubid.me`.
- Client id: copied into `NEXT_PUBLIC_CUBID_OIDC_CLIENT_ID`.
- Redirect URI: `http://localhost:3000/auth/callback` for local dev.
- Post-logout redirect URI: `http://localhost:3000` for local dev.

Create or configure your dapp API credentials with:

- Cubid API base URL: copied into `CUBID_API_BASE_URL`.
- Dapp API key: copied into `CUBID_API_KEY`.
- Dapp id: copied into `CUBID_DAPP_ID` when your Cubid environment requires it.
- ClearPass page id: copied into `NEXT_PUBLIC_CUBID_CLEARPASS_PAGE_ID`.

## Package Source

The deployable site depends on published `@cubid/*` packages from npm. Keep
local sibling package links out of `pnpm-workspace.yaml`; Vercel clones this
repository in isolation and cannot resolve `../../cubid/...` workspace paths.

## Validation

```sh
pnpm lint
pnpm typecheck
pnpm api:validate
pnpm check:hosted-actions
pnpm check:hosted-action-a11y
pnpm privacy:route-selection
pnpm scan:browser-secrets
pnpm check:solver-content
pnpm check:i18n
pnpm build
```

`pnpm check:i18n` verifies that English and Swedish translation resources match
the typed namespace registry, the pseudo-locale export is present, and the
extracted shell UI strings stay out of inline JSX.

The browser demo can render without server credentials. The server demo returns
a non-secret setup message until server-only Cubid credentials are present in
`.env.local`.

Hosted route-selection pages use signed-in user context and backend-provided
action data. Local mock actions are for development and acceptance checks only;
set `MYPAYTAG_HOSTED_ACTION_MOCK_MODE=true` only for local fixture work. Staging
smoke must use real MyPayTag backend action hydration, completion, NEAR 1Click
quote, and selected-quote calls.

The public site owns browser-safe hosted action UX, public API docs, marketing
copy, and the local playground. Protocol details live in `../mypaytag-sdk`, and
private resolver storage, service-role access, provider callbacks, and admin
operations stay out of this repo.

API documentation workflow:

- Edit the canonical OpenAPI source in `../mypaytag-sdk/api/openapi.yaml`.
- Copy the spec into this repo as `public/api/openapi.yaml` when publishing site docs.
- Run `pnpm api:validate` to confirm the site copy still matches the SDK source.
- Run `pnpm api:postman` to regenerate and copy the public API artifacts from the SDK repo.
- Run `pnpm dev` or `pnpm api:docs` and open `/reference` for the Scalar docs.
- The Postman collection is generated in the SDK repo at
  `api/postman_collection.json` from `api/openapi.yaml` and served by this site
  at `/api/postman_collection.json`; do not edit the collection by hand.
