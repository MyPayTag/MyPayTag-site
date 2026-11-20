export type PlaygroundOperation =
  | "registerRoutes"
  | "resolvePayment"
  | "hydrateRouteSelection"
  | "completeRouteSelection"
  | "nearOneClickQuote"
  | "nearOneClickSelectedQuote"
  | "simulateQuotes";

export interface PlaygroundExample {
  operation: PlaygroundOperation;
  label: string;
  eyebrow: string;
  description: string;
  method: "GET" | "POST";
  endpoint: string;
  appId?: "chaincrew" | "smartrust-wallet";
  body: unknown;
  notes: string[];
}

export const receivingExamples: PlaygroundExample[] = [
  {
    operation: "registerRoutes",
    label: "Register the Paytag receive paths",
    eyebrow: "MyPayTag route registration",
    description:
      "A PayToDapp registers supported chain/token paths for the user. It must not submit wallet addresses, memos, account ids, or payment instructions.",
    method: "POST",
    endpoint: "/payto-routes",
    appId: "smartrust-wallet",
    body: {
      recipient: {
        identifierType: "paytag",
        identifier: "abd123@cubid.mypaytag",
      },
      payToDappId: "smartrust-wallet",
      supportedRoutes: [
        {
          chain: "base",
          network: "mainnet",
          asset: "USDC",
        },
        {
          chain: "base",
          network: "mainnet",
          asset: "EURC",
        },
        {
          chain: "solana",
          network: "mainnet-beta",
          asset: "USDC",
        },
      ],
      authorizationToken: "mpt_auth_fixture_primary",
    },
    notes: [
      "The server signs this request as the local SmarTrust Wallet demo app.",
      "Add an address-like field to see the backend reject unsafe route registration.",
      "Stamp elevation, opaque Paytag creation, raw-stamp exposure, and grant/revoke ceremonies belong in Cubid Passport hosted actions.",
    ],
  },
];

export const sendingExamples: PlaygroundExample[] = [
  {
    operation: "resolvePayment",
    label: "Resolve routes for a Paytag",
    eyebrow: "MyPayTag resolve",
    description:
      "A PayingDapp asks MyPayTag for a user-approved receive path. The current local resolver returns a normalized one-time provider intent or a safe public status.",
    method: "POST",
    endpoint: "/resolve",
    appId: "chaincrew",
    body: {
      recipient: {
        identifierType: "paytag",
        identifier: "abd123@cubid.mypaytag",
      },
      supportedPaths: [
        {
          chain: "base",
          network: "mainnet",
          asset: "USDC",
        },
      ],
      amount: {
        value: "25.00",
        currency: "USDC",
      },
      purpose: "payout",
      intentMode: "one_time",
      payingDappReference: "chaincrew:payout_playground_001",
    },
    notes: [
      "Change the identifier to include no-route or overlap to see safe no-route or route-selection behavior.",
      "The response must not expose unrelated PayToDapps or a wallet graph.",
      "PayingDapps call MyPayTag resolve; they should not call Cubid directly for Paytag state.",
    ],
  },
  {
    operation: "hydrateRouteSelection",
    label: "Hydrate a route-selection action",
    eyebrow: "Hosted action",
    description:
      "When multiple receive apps can handle a route, the site hydrates an opaque route-selection action without putting route details in the URL.",
    method: "GET",
    endpoint: "/hosted-actions?actionId=mpt_act_route_demo",
    body: {
      actionId: "mpt_act_route_demo",
    },
    notes: [
      "This call is browser-safe and does not require a paying-app signature.",
      "Try mpt_act_expired, mpt_act_completed, or mpt_act_invalid to see safe action states.",
    ],
  },
  {
    operation: "completeRouteSelection",
    label: "Select a default receive app",
    eyebrow: "Hosted action completion",
    description:
      "The user chooses a default PayToDapp for a chain/token channel. This is the current API shape closest to setting the pay-to route preference.",
    method: "POST",
    endpoint: "/route-selection",
    body: {
      actionId: "mpt_act_route_demo",
      kind: "route_selection",
      decision: "select_route",
      selectedRouteId: "smartrust",
    },
    notes: [
      "This is not a NEAR call; it is the MyPayTag route preference action.",
      "If the selected payment requires a swap or bridge, the MVP execution quote step is shown below through NEAR 1Click.",
    ],
  },
  {
    operation: "nearOneClickQuote",
    label: "Request a NEAR 1Click MVP quote",
    eyebrow: "MVP execution adapter",
    description:
      "SmarTrust can request a NEAR 1Click quote after MyPayTag resolves the Paytag and selected route. This models the Phase 1 swap or bridge path without sending wallet routing details to Cubid.",
    method: "POST",
    endpoint: "NEAR 1Click quote request",
    appId: "smartrust-wallet",
    body: {
      paytag: "abd123@cubid.mypaytag",
      payingDappId: "smartrust-wallet",
      payToDappId: "smartrust-wallet",
      resolverReference: "mpt_req_smartrust_001",
      sourceAsset: "near:mainnet/wrap.near",
      destinationAsset: "eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      amount: {
        value: "25.00",
        currency: "USDC",
      },
      preferredSolverId: "near_intents_1click",
    },
    notes: [
      "NEAR 1Click is the only MVP swap and bridge execution adapter.",
      "SmarTrust is modeled as both the initial PayingDapp and PayToDapp.",
      "Cubid receives identity and consent context only, not quote, bridge, swap, wallet, or payment details.",
    ],
  },
  {
    operation: "nearOneClickSelectedQuote",
    label: "Select NEAR quote for payable instructions",
    eyebrow: "MVP payable instruction",
    description:
      "After a NEAR 1Click quote is selected, MyPayTag can return payable instructions inside the corrected provider_json intent shape.",
    method: "POST",
    endpoint: "NEAR selected quote",
    appId: "smartrust-wallet",
    body: {
      quoteId: "near_1click_quote_mvp_001",
      resolverReference: "mpt_req_smartrust_001",
      payToDappId: "smartrust-wallet",
      payingDappReference: "smartrust:send_001",
    },
    notes: [
      "The response is shaped as a MyPayTag provider_json instruction, not a Cubid wallet-routing response.",
      "Same-chain same-token transfers remain a PayingDapp decision: use MyPayTag or execute locally.",
    ],
  },
  {
    operation: "simulateQuotes",
    label: "Simulate Phase 2 quote fanout",
    eyebrow: "Phase 2 SDK simulation",
    description:
      "Broad solver fanout is Phase 2. This panel simulates a future execution-adapter helper across the broader adapter set after the MVP NEAR 1Click path.",
    method: "POST",
    endpoint: "SDK quote simulation",
    body: {
      amount: {
        value: "25.00",
        currency: "USDC",
      },
      sourceAsset: "eip155:1/erc20:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      destinationAsset: "eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      recipient: "eip155:8453:0x0000000000000000000000000000000000000001",
      reference: "chaincrew:payout_playground_001",
      preferredSolverId: "near_intents_1click",
    },
    notes: [
      "This local fixture requires MYPAYTAG_PLAYGROUND_PHASE2_DEMO_MODE=true and is not part of the MVP backend path.",
      "Phase 2 fanout happens after MyPayTag route selection and provider-intent creation; remove preferredSolverId only for future adapter exploration.",
    ],
  },
];

export function prettyJson(value: unknown): string {
  return JSON.stringify(value, null, 2);
}
