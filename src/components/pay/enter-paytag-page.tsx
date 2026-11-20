"use client";

import {
  ArrowRight,
  CheckCircle2,
  CircleDollarSign,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { useMemo, useState } from "react";

import { quoteAmountValue } from "@/lib/quote-amount";

type AmountMode = "usd" | "token";

interface EthereumProvider {
  request<T = unknown>(input: { method: string; params?: unknown[] }): Promise<T>;
}

interface WalletState {
  address: string;
  chainId: string;
  networkName: string;
  balances: WalletBalance[];
}

interface WalletBalance {
  symbol: string;
  asset: string;
  amount: number;
  decimals: number;
  network: string;
  chainId: string;
  tokenAddress?: string;
}

interface PlaygroundResult {
  response?: {
    ok: boolean;
    status: number;
    body: unknown;
  };
  status?: string;
  message?: string;
}

const networks: Record<string, { name: string; native: string; assets: TokenConfig[] }> = {
  "0x1": {
    name: "Ethereum mainnet",
    native: "ETH",
    assets: [
      {
        symbol: "USDC",
        asset: "eip155:1/erc20:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        decimals: 6,
      },
    ],
  },
  "0x2105": {
    name: "Base mainnet",
    native: "ETH",
    assets: [
      {
        symbol: "USDC",
        asset: "eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        decimals: 6,
      },
    ],
  },
};

interface TokenConfig {
  symbol: string;
  asset: string;
  address: string;
  decimals: number;
}

export function EnterPaytagPage() {
  const [wallet, setWallet] = useState<WalletState | null>(null);
  const [connectError, setConnectError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [paytag, setPaytag] = useState("abd123@cubid.mypaytag");
  const [amountMode, setAmountMode] = useState<AmountMode>("usd");
  const [usdAmount, setUsdAmount] = useState("25.00");
  const [tokenSymbol, setTokenSymbol] = useState("USDC");
  const [tokenAmount, setTokenAmount] = useState("25.00");
  const [quoteResult, setQuoteResult] = useState<PlaygroundResult | null>(null);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [isQuoting, setIsQuoting] = useState(false);

  const requestedAmount = Number(amountMode === "usd" ? usdAmount : tokenAmount);
  const requestedSymbol = amountMode === "usd" ? "USDC" : tokenSymbol.trim().toUpperCase();
  const matchingBalances = useMemo(
    () => wallet?.balances.filter((balance) => {
      return balance.symbol === requestedSymbol && balance.amount >= requestedAmount;
    }) ?? [],
    [requestedAmount, requestedSymbol, wallet],
  );
  const quoteSource = wallet?.balances.find((balance) => balance.amount > 0);

  async function connectWallet() {
    setIsConnecting(true);
    setConnectError(null);
    setQuoteResult(null);
    setQuoteError(null);

    try {
      const provider = getEthereumProvider();
      if (!provider) {
        setConnectError("No injected wallet was found in this browser.");
        return;
      }

      const accounts = await provider.request<string[]>({ method: "eth_requestAccounts" });
      const address = accounts[0];
      if (!address) {
        setConnectError("The wallet did not return an account.");
        return;
      }

      const chainId = await provider.request<string>({ method: "eth_chainId" });
      const network = networks[chainId] ?? { name: `Chain ${chainId}`, native: "ETH", assets: [] };
      const balances = await loadBalances(provider, address, chainId, network);

      setWallet({
        address,
        chainId,
        networkName: network.name,
        balances,
      });
    } catch (caught) {
      setConnectError(caught instanceof Error ? caught.message : "Unable to connect the wallet.");
    } finally {
      setIsConnecting(false);
    }
  }

  async function requestQuote() {
    if (!wallet || !quoteSource || !paytag.trim() || !Number.isFinite(requestedAmount) || requestedAmount <= 0) {
      return;
    }

    setIsQuoting(true);
    setQuoteError(null);
    setQuoteResult(null);

    try {
      const response = await fetch("/api/playground/call", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          operation: "nearOneClickQuote",
          body: {
            paytag: paytag.trim(),
            payingDappId: "third-party-wallet",
            payToDappId: "smartrust-wallet",
            resolverReference: `mpt_pay_${Date.now()}`,
            sourceAsset: quoteSource.asset,
            destinationAsset: "eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
            amount: {
              value: quoteAmountValue(amountMode === "usd" ? usdAmount : tokenAmount, amountMode),
              currency: requestedSymbol,
            },
            preferredSolverId: "near_intents_1click",
          },
        }),
      });
      const payload = await response.json() as PlaygroundResult;
      if (!response.ok) {
        setQuoteError(payload.message ?? "The MyPayTag quote path is not available.");
        return;
      }
      setQuoteResult(payload);
    } catch (caught) {
      setQuoteError(caught instanceof Error ? caught.message : "Unable to request a quote.");
    } finally {
      setIsQuoting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f7f2] text-[#121612]">
      <section className="border-b border-[#d9dfd1] bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#176b46]">
              Enter Paytag
            </p>
            <h1 className="mt-4 max-w-3xl text-5xl font-semibold leading-tight tracking-normal">
              Connect a wallet and preview how to pay a Paytag.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#586250]">
              This page is for a payor using any browser wallet. MyPayTag can
              resolve the Paytag and route; same-chain same-token transfers
              remain a PayingDapp choice, and swap or bridge quotes use the
              MVP NEAR 1Click path when configured.
            </p>
          </div>
          <div className="grid gap-3 rounded-md border border-[#d9dfd1] bg-[#fbfcf8] p-5">
            {[
              "Wallet connection happens before Paytag or amount validation.",
              "Direct options use the connected network and visible balances.",
              "Quote options are requested through the server-side MyPayTag path.",
            ].map((item) => (
              <div className="flex gap-3 text-sm leading-6 text-[#3f493a]" key={item}>
                <CheckCircle2 className="mt-1 shrink-0 text-[#176b46]" size={17} aria-hidden="true" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-6 py-8 lg:grid-cols-[24rem_1fr] lg:px-8">
        <aside className="grid gap-5 self-start">
          <div className="rounded-md border border-[#d9dfd1] bg-white p-5">
            <div className="flex items-center gap-3">
              <Wallet className="text-[#176b46]" size={22} aria-hidden="true" />
              <h2 className="text-xl font-semibold">Wallet</h2>
            </div>
            {wallet ? (
              <div className="mt-4 grid gap-3">
                <p className="break-all rounded-md border border-[#dfe5d7] bg-[#fbfcf8] p-3 font-mono text-xs text-[#33402f]">
                  {wallet.address}
                </p>
                <p className="text-sm font-semibold text-[#176b46]">{wallet.networkName}</p>
                <button
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#cbd4c3] bg-white px-4 text-sm font-semibold text-[#33402f] transition hover:bg-[#eef3eb]"
                  onClick={connectWallet}
                  type="button"
                >
                  <RefreshCw size={16} aria-hidden="true" />
                  Refresh balances
                </button>
              </div>
            ) : (
              <button
                className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#176b46] px-5 text-sm font-semibold text-white transition hover:bg-[#12583a] disabled:bg-[#9aac99]"
                disabled={isConnecting}
                onClick={connectWallet}
                type="button"
              >
                {isConnecting ? <Loader2 className="animate-spin" size={17} aria-hidden="true" /> : <Wallet size={17} aria-hidden="true" />}
                Connect wallet
              </button>
            )}
            {connectError ? <p className="mt-3 text-sm font-semibold text-[#9b3326]">{connectError}</p> : null}
          </div>

          <div className="rounded-md border border-[#d9dfd1] bg-white p-5">
            <div className="flex items-center gap-3">
              <CircleDollarSign className="text-[#245c8d]" size={22} aria-hidden="true" />
              <h2 className="text-xl font-semibold">Payment</h2>
            </div>
            <label className="mt-5 block text-sm font-semibold text-[#33402f]" htmlFor="paytag-input">
              Paytag
            </label>
            <input
              className="mt-2 h-10 w-full rounded-md border border-[#cbd4c3] bg-white px-3 text-sm outline-none focus:border-[#176b46] focus:ring-2 focus:ring-[#dcebdd]"
              id="paytag-input"
              onChange={(event) => setPaytag(event.target.value)}
              value={paytag}
            />

            <div className="mt-5 grid grid-cols-2 rounded-md border border-[#cbd4c3] bg-[#fbfcf8] p-1">
              {[
                ["usd", "Dollar amount"],
                ["token", "Token amount"],
              ].map(([mode, label]) => (
                <button
                  className={`h-9 rounded-sm text-sm font-semibold transition ${
                    amountMode === mode ? "bg-[#176b46] text-white" : "text-[#33402f] hover:bg-white"
                  }`}
                  key={mode}
                  onClick={() => setAmountMode(mode as AmountMode)}
                  type="button"
                >
                  {label}
                </button>
              ))}
            </div>

            {amountMode === "usd" ? (
              <label className="mt-4 block text-sm font-semibold text-[#33402f]" htmlFor="usd-amount">
                Dollar amount
                <input
                  className="mt-2 h-10 w-full rounded-md border border-[#cbd4c3] bg-white px-3 text-sm outline-none focus:border-[#176b46] focus:ring-2 focus:ring-[#dcebdd]"
                  id="usd-amount"
                  inputMode="decimal"
                  onChange={(event) => setUsdAmount(event.target.value)}
                  value={usdAmount}
                />
              </label>
            ) : (
              <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr] lg:grid-cols-1">
                <label className="block text-sm font-semibold text-[#33402f]" htmlFor="token-symbol">
                  Token
                  <input
                    className="mt-2 h-10 w-full rounded-md border border-[#cbd4c3] bg-white px-3 text-sm outline-none focus:border-[#176b46] focus:ring-2 focus:ring-[#dcebdd]"
                    id="token-symbol"
                    onChange={(event) => setTokenSymbol(event.target.value)}
                    value={tokenSymbol}
                  />
                </label>
                <label className="block text-sm font-semibold text-[#33402f]" htmlFor="token-amount">
                  Amount
                  <input
                    className="mt-2 h-10 w-full rounded-md border border-[#cbd4c3] bg-white px-3 text-sm outline-none focus:border-[#176b46] focus:ring-2 focus:ring-[#dcebdd]"
                    id="token-amount"
                    inputMode="decimal"
                    onChange={(event) => setTokenAmount(event.target.value)}
                    value={tokenAmount}
                  />
                </label>
              </div>
            )}
          </div>
        </aside>

        <div className="grid gap-5">
          <section className="rounded-md border border-[#d9dfd1] bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#176b46]">
                  Direct payment options
                </p>
                <h2 className="mt-2 text-2xl font-semibold">Connected-network matches</h2>
              </div>
              <ShieldCheck className="text-[#245c8d]" size={24} aria-hidden="true" />
            </div>
            {!wallet ? (
              <p className="mt-5 rounded-md border border-[#dfe5d7] bg-[#fbfcf8] p-4 text-sm leading-6 text-[#586250]">
                Connect a wallet to inspect the current network and available balances.
              </p>
            ) : matchingBalances.length > 0 ? (
              <div className="mt-5 grid gap-3">
                {matchingBalances.map((balance) => (
                  <article className="rounded-md border border-[#dfe5d7] bg-[#fbfcf8] p-4" key={balance.asset}>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="text-base font-semibold">
                          {balance.symbol} on {balance.network}
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-[#586250]">
                          Available balance: {formatAmount(balance.amount)} {balance.symbol}
                        </p>
                      </div>
                      <span className="rounded-md border border-[#c8d4bf] bg-white px-3 py-2 text-xs font-semibold uppercase tracking-normal text-[#176b46]">
                        Same network
                      </span>
                    </div>
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <Option title="Pay locally from wallet" text="The PayingDapp can execute a same-chain same-token transfer itself." />
                      <Option title="Resolve through MyPayTag" text="The PayingDapp can still use MyPayTag for Paytag resolution and provider intent handling." />
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="mt-5 rounded-md border border-[#dfe5d7] bg-[#fbfcf8] p-4 text-sm leading-6 text-[#586250]">
                No connected balance currently matches the requested token and amount.
              </p>
            )}
          </section>

          <section className="rounded-md border border-[#d9dfd1] bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#176b46]">
                  Exchange and bridge quotes
                </p>
                <h2 className="mt-2 text-2xl font-semibold">NEAR 1Click via MyPayTag</h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-[#586250]">
                  Quote requests go through the site server route so app
                  credentials stay off the browser. Cubid is not sent wallet,
                  quote, swap, bridge, or payment details.
                </p>
              </div>
              <button
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#176b46] px-4 text-sm font-semibold text-white transition hover:bg-[#12583a] disabled:bg-[#9aac99]"
                disabled={!wallet || !quoteSource || isQuoting}
                onClick={requestQuote}
                type="button"
              >
                {isQuoting ? <Loader2 className="animate-spin" size={16} aria-hidden="true" /> : <ArrowRight size={16} aria-hidden="true" />}
                Get quote
              </button>
            </div>
            {quoteSource ? (
              <p className="mt-4 text-sm leading-6 text-[#586250]">
                Quote source: {formatAmount(quoteSource.amount)} {quoteSource.symbol} on {quoteSource.network}
              </p>
            ) : (
              <p className="mt-4 text-sm leading-6 text-[#586250]">
                Connect a wallet with a visible balance to request a quote.
              </p>
            )}
            {quoteError ? <p className="mt-4 text-sm font-semibold text-[#9b3326]">{quoteError}</p> : null}
            {quoteResult ? (
              <pre className="mt-4 max-h-[30rem] overflow-auto rounded-md border border-[#d9dfd1] bg-[#101710] p-4 text-xs leading-6 text-[#dce8d7]">
                {JSON.stringify(quoteResult.response?.body ?? quoteResult, null, 2)}
              </pre>
            ) : null}
          </section>
        </div>
      </section>
    </main>
  );
}

function Option({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-md border border-[#d9dfd1] bg-white p-4">
      <h4 className="text-sm font-semibold text-[#151713]">{title}</h4>
      <p className="mt-2 text-sm leading-6 text-[#586250]">{text}</p>
    </div>
  );
}

function getEthereumProvider(): EthereumProvider | null {
  if (typeof window === "undefined") return null;
  const maybeWindow = window as Window & { ethereum?: EthereumProvider };
  return maybeWindow.ethereum ?? null;
}

async function loadBalances(
  provider: EthereumProvider,
  address: string,
  chainId: string,
  network: { name: string; native: string; assets: TokenConfig[] },
): Promise<WalletBalance[]> {
  const nativeHex = await provider.request<string>({
    method: "eth_getBalance",
    params: [address, "latest"],
  });
  const balances: WalletBalance[] = [
    {
      symbol: network.native,
      asset: `eip155:${Number.parseInt(chainId, 16)}/native`,
      amount: Number(formatUnits(BigInt(nativeHex), 18)),
      decimals: 18,
      network: network.name,
      chainId,
    },
  ];

  for (const token of network.assets) {
    try {
      const balanceHex = await provider.request<string>({
        method: "eth_call",
        params: [
          {
            to: token.address,
            data: `0x70a08231${encodeAbiAddress(address)}`,
          },
          "latest",
        ],
      });
      balances.push({
        symbol: token.symbol,
        asset: token.asset,
        amount: Number(formatUnits(BigInt(balanceHex), token.decimals)),
        decimals: token.decimals,
        network: network.name,
        chainId,
        tokenAddress: token.address,
      });
    } catch {
      balances.push({
        symbol: token.symbol,
        asset: token.asset,
        amount: 0,
        decimals: token.decimals,
        network: network.name,
        chainId,
        tokenAddress: token.address,
      });
    }
  }

  return balances;
}

function encodeAbiAddress(address: string): string {
  const normalized = address.replace(/^0x/, "").toLowerCase();
  if (!/^[0-9a-f]{40}$/.test(normalized)) throw new Error("invalid_wallet_address");
  return normalized.padStart(64, "0");
}

function formatUnits(value: bigint, decimals: number): string {
  const divisor = BigInt(10) ** BigInt(decimals);
  const whole = value / divisor;
  const fraction = value % divisor;
  const fractionText = fraction.toString().padStart(decimals, "0").slice(0, 6).replace(/0+$/, "");
  return fractionText ? `${whole}.${fractionText}` : whole.toString();
}

function formatAmount(value: number): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 6,
    minimumFractionDigits: value > 0 && value < 1 ? 2 : 0,
  }).format(value);
}
