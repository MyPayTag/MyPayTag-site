"use client";

import {
  Clock3,
  Copy,
  KeyRound,
  MailPlus,
  RefreshCw,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import type { FormEvent } from "react";
import { useMemo, useState } from "react";

import { SignedInOnly } from "@/components/cubid/signed-in-only";
import { LocaleFixtureControl } from "@/components/i18n/locale-fixture-control";

type DeveloperEnvironment = "testnet" | "mainnet";

interface ProvisionedApp {
  marketingName: string;
  environment: DeveloperEnvironment;
  appUrl: string;
  status: "active" | "pending_mainnet_review";
}

const appHistory = [
  {
    event: "Resolve request",
    detail: "Base USDC route returned two receive options",
    time: "2026-06-24 15:02 UTC",
  },
  {
    event: "Intent created",
    detail: "TreasuryDesk created a 125.00 USDT intent",
    time: "2026-06-24 14:50 UTC",
  },
  {
    event: "Route selected",
    detail: "SmarTrust Wallet set as default for Base USDC",
    time: "2026-06-23 18:43 UTC",
  },
];

export function DeveloperConsole() {
  const [apiKeyVersion, setApiKeyVersion] = useState(1);
  const [provisionedApp, setProvisionedApp] = useState<ProvisionedApp | null>(null);
  const [marketingName, setMarketingName] = useState("SmarTrust Wallet");
  const [environment, setEnvironment] = useState<DeveloperEnvironment>("testnet");
  const [appUrl, setAppUrl] = useState("https://smartrust.example");
  const [metadataError, setMetadataError] = useState<string | null>(null);
  const [showOneTimeKey, setShowOneTimeKey] = useState(false);
  const [invites, setInvites] = useState(["maya@example.test"]);
  const [email, setEmail] = useState("");

  const apiKey = useMemo(() => (
    provisionedApp ? `mpt_${provisionedApp.environment}_${String(apiKeyVersion).padStart(2, "0")}_mock_one_time_key` : null
  ),
    [apiKeyVersion, provisionedApp],
  );

  function provisionApi(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextName = marketingName.trim();
    const nextUrl = appUrl.trim();
    const parsedUrl = parseAppUrl(nextUrl);

    if (!nextName) {
      setMetadataError("Enter the app marketing name developers and users will recognize.");
      return;
    }
    if (!parsedUrl) {
      setMetadataError("Enter a valid http or https app URL.");
      return;
    }

    setProvisionedApp({
      marketingName: nextName,
      environment,
      appUrl: parsedUrl.toString(),
      status: environment === "mainnet" ? "pending_mainnet_review" : "active",
    });
    setMetadataError(null);
    setShowOneTimeKey(true);
  }

  function rotateKey() {
    if (!provisionedApp) return;
    setApiKeyVersion((version) => version + 1);
    setShowOneTimeKey(true);
  }

  function inviteDeveloper() {
    const nextEmail = email.trim();
    if (!nextEmail) return;
    setInvites((current) => [nextEmail, ...current]);
    setEmail("");
  }

  return (
    <SignedInOnly
      description="Developer tools are available after Cubid sign-in."
      title="Sign in with Cubid"
    >
      <main className="min-h-screen bg-[#f7f8f4] text-[#151713]">
        <section className="border-b border-[#d9dfd1] bg-white">
          <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#176b46]">
              Developer console
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-normal sm:text-5xl">
              API access for PayingDapps and PayToDapps
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-[#586250]">
              Developer account controls for app metadata, API provisioning,
              key rotation, team access, and recent app history.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-5 px-6 py-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="lg:col-span-2">
            <LocaleFixtureControl />
          </div>
          <div className="rounded-lg border border-[#d9dfd1] bg-white p-5">
            <div className="flex items-center gap-3">
              <KeyRound className="text-[#176b46]" size={22} aria-hidden="true" />
              <h2 className="text-xl font-semibold">Provisioned API</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-[#586250]">
              Register the app identity that will appear in developer and
              policy surfaces before a key is issued. Mainnet selection records
              intent; backend policy still controls activation.
            </p>
            <form className="mt-5 grid gap-4" onSubmit={provisionApi}>
              <label className="grid gap-2 text-sm font-semibold text-[#33402f]" htmlFor="marketing-name">
                Marketing name
                <input
                  className="h-10 rounded-md border border-[#cbd4c3] bg-white px-3 text-sm font-normal outline-none focus:border-[#176b46] focus:ring-2 focus:ring-[#dcebdd]"
                  id="marketing-name"
                  onChange={(event) => setMarketingName(event.target.value)}
                  value={marketingName}
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-[#33402f]" htmlFor="app-url">
                App URL
                <input
                  className="h-10 rounded-md border border-[#cbd4c3] bg-white px-3 text-sm font-normal outline-none focus:border-[#176b46] focus:ring-2 focus:ring-[#dcebdd]"
                  id="app-url"
                  onChange={(event) => setAppUrl(event.target.value)}
                  type="url"
                  value={appUrl}
                />
              </label>
              <fieldset className="grid gap-2">
                <legend className="text-sm font-semibold text-[#33402f]">Environment</legend>
                <div className="grid grid-cols-2 rounded-md border border-[#cbd4c3] bg-[#fbfcf8] p-1">
                  {[
                    ["testnet", "Testnet"],
                    ["mainnet", "Mainnet"],
                  ].map(([value, label]) => (
                    <button
                      className={`h-9 rounded-sm text-sm font-semibold transition ${
                        environment === value ? "bg-[#176b46] text-white" : "text-[#33402f] hover:bg-white"
                      }`}
                      key={value}
                      onClick={() => setEnvironment(value as DeveloperEnvironment)}
                      type="button"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </fieldset>
              {metadataError ? <p className="text-sm font-semibold text-[#9b3326]">{metadataError}</p> : null}
              <button
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#176b46] px-4 text-sm font-semibold text-white transition hover:bg-[#12583a]"
                type="submit"
              >
                <KeyRound size={16} aria-hidden="true" />
                Provision API access
              </button>
            </form>

            {provisionedApp ? (
              <div className="mt-5 grid gap-3 rounded-md border border-[#dfe5d7] bg-[#fbfcf8] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#586250]">
                  Registered app
                </p>
                <div>
                  <p className="text-sm font-semibold text-[#151713]">{provisionedApp.marketingName}</p>
                  <a
                    className="mt-1 block break-all text-sm font-semibold text-[#176b46] hover:underline"
                    href={provisionedApp.appUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {provisionedApp.appUrl}
                  </a>
                  <p className="mt-2 text-sm leading-6 text-[#586250]">
                    {provisionedApp.environment} · {provisionedApp.status === "active" ? "Active for testnet use" : "Mainnet review pending"}
                  </p>
                </div>
                <div className="rounded-md border border-[#d9dfd1] bg-white p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#586250]">
                    One-time key reveal
                  </p>
                  <p className="mt-2 break-words font-mono text-sm text-[#151713]">
                    {showOneTimeKey && apiKey ? apiKey : "Hidden after initial issuance or rotation"}
                  </p>
                </div>
              </div>
            ) : null}
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                className="inline-flex h-10 items-center gap-2 rounded-md bg-[#176b46] px-4 text-sm font-semibold text-white transition hover:bg-[#12583a] disabled:bg-[#9aac99]"
                disabled={!provisionedApp}
                onClick={rotateKey}
                type="button"
              >
                <RefreshCw size={16} aria-hidden="true" />
                Rotate key
              </button>
              <button
                className="inline-flex h-10 items-center gap-2 rounded-md border border-[#cbd4c3] bg-white px-4 text-sm font-semibold text-[#2c3429] transition hover:bg-[#f1f4ec] disabled:text-[#8a9383]"
                disabled={!showOneTimeKey || !apiKey}
                onClick={() => {
                  if (apiKey) void navigator.clipboard?.writeText(apiKey);
                  setShowOneTimeKey(false);
                }}
                type="button"
              >
                <Copy size={16} aria-hidden="true" />
                Copy key
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-[#d9dfd1] bg-white p-5">
            <div className="flex items-center gap-3">
              <UsersRound className="text-[#245c8d]" size={22} aria-hidden="true" />
              <h2 className="text-xl font-semibold">Developer team</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-[#586250]">
              Invite other developers to the same app account.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <input
                className="h-10 min-w-0 flex-1 rounded-md border border-[#cbd4c3] bg-white px-3 text-sm outline-none focus:border-[#176b46] focus:ring-2 focus:ring-[#dcebdd]"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="developer@example.com"
                type="email"
                value={email}
              />
              <button
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#176b46] px-4 text-sm font-semibold text-white transition hover:bg-[#12583a]"
                onClick={inviteDeveloper}
                type="button"
              >
                <MailPlus size={16} aria-hidden="true" />
                Invite
              </button>
            </div>
            <ul className="mt-5 grid gap-2">
              {invites.map((invite) => (
                <li
                  className="flex items-center gap-2 rounded-md border border-[#dfe5d7] bg-[#fbfcf8] px-3 py-2 text-sm text-[#3f493a]"
                  key={invite}
                >
                  <ShieldCheck size={15} aria-hidden="true" className="text-[#176b46]" />
                  {invite}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-10 lg:px-8">
          <div className="rounded-lg border border-[#d9dfd1] bg-white p-5">
            <div className="flex items-center gap-3">
              <Clock3 className="text-[#6a5c1f]" size={22} aria-hidden="true" />
              <h2 className="text-xl font-semibold">Recent app history</h2>
            </div>
            <div className="mt-5 grid gap-3">
              {appHistory.map((item) => (
                <article
                  className="grid gap-2 rounded-md border border-[#dfe5d7] bg-[#fbfcf8] p-4 md:grid-cols-[12rem_1fr]"
                  key={`${item.event}-${item.time}`}
                >
                  <time className="text-sm font-semibold text-[#586250]">{item.time}</time>
                  <div>
                    <h3 className="text-base font-semibold text-[#151713]">{item.event}</h3>
                    <p className="mt-1 text-sm leading-6 text-[#586250]">{item.detail}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </SignedInOnly>
  );
}

function parseAppUrl(value: string): URL | null {
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    return parsed;
  } catch {
    return null;
  }
}
