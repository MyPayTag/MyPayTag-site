# Hosted Action Flow Design

Date: 2026-06-24  
Status: Sprint 2 design  
Repo: `mypaytag-site`

## Setup And Authorization Flow

The public site no longer hosts per-request setup or authorization approval pages.
Send-to is modeled as pre-authorized incoming payment channels: requesting apps
are enabled by default, while users retain control over which receive route or
PayToDapp should be preferred for a supported path.

Deleted route family:

- `/actions/setup/[actionId]`

The resolver must not emit setup or authorization action URLs for ordinary
requesting-app access. Status-only outcomes such as `no_route` and
`authorization_required` may still exist for API handling, revocation, invalid
state, or future management flows, but they do not route to this site for
per-request approval.

## Route Selection Flow

Route family: `/actions/route-selection/[actionId]`

Purpose:

- let an authenticated user choose a default PayToDapp for a single route preference tuple,
- show only route options for the current action,
- keep the current default and eligible PayToDapps unavailable until action validation succeeds.

The page is protected by the persistent header sign-in state. This is currently
a mock user/developer session until SIWC is connected. The action id is present
in the URL, but route details are fetched from the action API only after the
browser reaches the signed-in state.

Preference tuple:

- user,
- pay-to alias,
- chain,
- network,
- asset,
- PayingDapp,
- selected PayToDapp.

Visible states:

- `ready`: show masked identifier, PayingDapp, route, eligible PayToDapps, and current default,
- `selected_route`: confirm the selected default,
- `denied`: confirm the user made no change,
- `expired`: show restart-safe copy,
- `invalid`: show restart-safe copy,
- `completed`: show already-completed copy,
- `restart_required`: show generic restart/setup-needed copy.

Interaction behavior:

- the first eligible option is never auto-submitted by the site,
- the current default is visually selected when the action loads,
- the user must explicitly choose an option and submit,
- submitting stores only local Sprint 2 UI state and shows `selected_route`,
- declining stores only local Sprint 2 UI state and shows `denied`,
- expired, invalid, completed, and restart-required states disable route controls.

Production transition criteria:

- save and leave-unchanged states are shown only after backend confirmation,
- the backend must complete or invalidate the action token before the site renders success,
- the backend must create the required audit event before the site renders success,
- expired, replayed, or unauthorized submissions render safe restart-required or expired states without private diagnostics.

Displayed route details:

- route label may show chain, network, and asset,
- PayToDapp names may be shown only for eligible options in this action,
- no unrelated routes, unrelated PayToDapps, wallet addresses, route counts, private diagnostics, or provider internals are shown.

## Incoming History Flow

Route family: `/history`

Purpose:

- let a signed-in user review incoming MyPayTag resolver activity,
- group activity by PayingDapp, PayToDapp, token, or chain,
- quick-filter by queries, intents, transactions, or all activity.

Activity types:

- queries: a PayingDapp checked available routes only,
- intents: a request such as "send USDT from Base to this recipient" produced a set of options,
- transactions: an option was selected and a transfer was initiated.

The All filter clears the activity-type filter and shows the same result as if
all activity types were selected. History rows must not expose wallet addresses,
unrelated routes, provider internals, or settlement claims.

## Developer Console Flow

Route family: `/developer`

Purpose:

- let a developer-mode signed-in session see provisioned API access,
- rotate mock API keys,
- invite other developers to the same app account,
- review recent app history.

This is a mock surface until SIWC and real developer account provisioning are
connected. User-mode login must not unlock developer controls.

## Mock Data Boundary

Local development uses mock action state only when
`MYPAYTAG_HOSTED_ACTION_MOCK_MODE=true` in a local or test runtime. Missing or
failed backend hydration otherwise fails closed with a safe restart-required
state. Mock state must preserve the privacy contract:

- action IDs are opaque,
- hydrated details are fixture-only,
- expired and invalid states do not reveal recipient existence,
- no production Supabase access or resolver secrets are introduced.

Before real action links are distributed, hosted action routes must set
`noindex`/`noarchive` robot behavior and a strict referrer policy so opaque
action URLs are not indexed or leaked through outbound navigation.
