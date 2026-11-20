export type HostedActionState =
  | "ready"
  | "denied"
  | "selected_route"
  | "expired"
  | "invalid"
  | "completed"
  | "restart_required";

export interface RouteOption {
  id: string;
  name: string;
  detail: string;
  addedAt: string;
}

export interface ReceivePath {
  id: string;
  label: string;
  chain: string;
  token: string;
  currentDefaultId: string;
  options: RouteOption[];
}

export interface RouteSelectionAction {
  id: string;
  state: HostedActionState;
  maskedIdentifier: string;
  paths: ReceivePath[];
  expiresAt: string;
  mockMode?: boolean;
}

export const routeSelectionActions: Record<string, RouteSelectionAction> = {
  "mpt_act_route_demo": {
    id: "mpt_act_route_demo",
    state: "ready",
    maskedIdentifier: "u***@example.test",
    paths: [
      {
        id: "base-usdc",
        label: "Base mainnet USDC",
        chain: "Base mainnet",
        token: "USDC",
        currentDefaultId: "smartrust",
        options: [
          {
            id: "smartrust",
            name: "SmarTrust Wallet",
            detail: "Current default for this channel.",
            addedAt: "2026-06-18",
          },
          {
            id: "vaultpay",
            name: "VaultPay Wallet",
            detail: "Also supports this channel.",
            addedAt: "2026-06-21",
          },
        ],
      },
      {
        id: "solana-usdc",
        label: "Solana USDC",
        chain: "Solana",
        token: "USDC",
        currentDefaultId: "solflare-pay",
        options: [
          {
            id: "solflare-pay",
            name: "Solflare Pay",
            detail: "Only active receive app for this channel.",
            addedAt: "2026-06-19",
          },
        ],
      },
      {
        id: "ethereum-eth",
        label: "Ethereum ETH",
        chain: "Ethereum mainnet",
        token: "ETH",
        currentDefaultId: "smartrust",
        options: [
          {
            id: "smartrust-eth",
            name: "SmarTrust Wallet",
            detail: "Primary ETH receive app.",
            addedAt: "2026-06-20",
          },
          {
            id: "embedded-safe",
            name: "Embedded Safe",
            detail: "Secondary ETH receive app.",
            addedAt: "2026-06-22",
          },
        ],
      },
    ],
    expiresAt: "2026-06-24T20:00:00Z",
  },
  "mpt_act_expired": {
    id: "mpt_act_expired",
    state: "expired",
    maskedIdentifier: "Hidden",
    paths: [],
    expiresAt: "Expired",
  },
  "mpt_act_invalid": {
    id: "mpt_act_invalid",
    state: "invalid",
    maskedIdentifier: "Hidden",
    paths: [],
    expiresAt: "Unavailable",
  },
  "mpt_act_completed": {
    id: "mpt_act_completed",
    state: "completed",
    maskedIdentifier: "Hidden",
    paths: [],
    expiresAt: "Completed",
  },
  "mpt_act_denied": {
    id: "mpt_act_denied",
    state: "denied",
    maskedIdentifier: "Hidden",
    paths: [],
    expiresAt: "Unavailable",
  },
};

export function getRouteSelectionAction(actionId: string): RouteSelectionAction {
  return (
    routeSelectionActions[actionId] ?? {
      id: actionId,
      state: "invalid",
      maskedIdentifier: "Hidden",
      paths: [],
      expiresAt: "Unavailable",
    }
  );
}
