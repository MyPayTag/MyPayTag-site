# Solver Adapter Developer Explainer

Date: 2026-06-26  
Status: Public MVP guidance  
Repo: `mypaytag-site`

## Purpose

MyPayTag resolves who should receive a payment before execution adapters quote or route the payment. Solver and router adapters are execution tools, not recipient preference engines. For Phase 1, NEAR Intents / 1Click is the MVP swap and bridge adapter; broader solver fanout is Phase 2.

For public protocol details, use the public SDK repository:

- `mypaytag-sdk/docs/engineering/protocol-and-sdk-architecture.md`
- `mypaytag-sdk/docs/engineering/mvp-api-contracts.md`
- `mypaytag-sdk/docs/integration/paying-dapps.md`

## Payor-App Flow

Payor-apps should think about the flow in three layers:

1. Build a resolver request from sender-side state: recipient pay-to tag, amount, supported source paths, and a payor-app reference.
2. Let MyPayTag resolve the recipient's approved receive requirement.
3. Ask NEAR 1Click for MVP swap or bridge quotes when the selected path needs execution beyond a same-chain same-token transfer.

The receive requirement is the boundary between resolution and execution. A typical resolved execution input looks like:

```json
{
  "destinationAsset": "eip155:8453/erc20:0x...",
  "recipient": "eip155:8453:0x...",
  "amount": "25000000",
  "expiresAt": "2026-06-26T20:00:00Z"
}
```

NEAR 1Click may quote bridges, swaps, transaction requests, or intent-based execution for the Phase 1 path. Phase 2 adapters may broaden this later. Adapters must not choose which PayToDapp the recipient prefers and must not expose the recipient's wallet graph.

## Phase 1 NEAR 1Click Vs Phase 2 Fanout

In Phase 1, SmarTrust is the initial PayingDapp and PayToDapp, and NEAR Intents / 1Click is the only MVP swap and bridge execution adapter.

If a payor-app selects a preferred solver, only that solver should be asked for a quote. During the MVP that preferred solver should be NEAR 1Click for swap or bridge paths. Same-chain same-token transfers can still go through MyPayTag, but the PayingDapp decides whether to use MyPayTag or execute locally.

Broad quote fanout is Phase 2. In Phase 2, SDK helpers may request quotes from every configured provider and return successful quote results so the payor-app can compare viable execution paths without making MyPayTag responsible for choosing the final transaction.

The public phase split is:

- Phase 1 MVP: NEAR Intents / 1Click.
- Phase 2: LI.FI, Squid, 0x Cross-Chain API, Across, LayerZero / Stargate, broad solver fanout, and generic external adapters.

## Privacy Boundary

Solver adapters consume a resolved receive requirement. They should not receive:

- unrelated PayToDapps,
- route preference history,
- raw verified identifiers,
- wallet inventory,
- private resolver diagnostics,
- server-only write credentials,
- private execution configuration.

Public pages may explain adapter behavior, tradeoffs, and examples. Private provider policy, credentials, operational routing configuration, and backend storage details stay outside this repo.
