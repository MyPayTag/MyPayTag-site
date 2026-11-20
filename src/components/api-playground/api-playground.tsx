"use client";

import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  Play,
  RefreshCw,
  Server,
  TerminalSquare,
} from "lucide-react";
import { useMemo, useState } from "react";

import {
  prettyJson,
  receivingExamples,
  sendingExamples,
  type PlaygroundExample,
} from "@/lib/playground/examples";

type PlaygroundTab = "receiving" | "sending";

interface PlaygroundResult {
  request?: unknown;
  response?: {
    ok: boolean;
    status: number;
    body: unknown;
  };
  status?: string;
  message?: string;
}

export function ApiPlayground() {
  const [tab, setTab] = useState<PlaygroundTab>("receiving");
  const examples = tab === "receiving" ? receivingExamples : sendingExamples;
  const [selectedLabel, setSelectedLabel] = useState(examples[0]?.label ?? "");

  const selected = useMemo(
    () => examples.find((example) => example.label === selectedLabel) ?? examples[0],
    [examples, selectedLabel],
  );

  return (
    <main className="min-h-screen bg-[#f6f7f2] text-[#121612]">
      <section className="border-b border-[#d9dfd1] bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#176b46]">
              API playground
            </p>
            <h1 className="mt-4 max-w-3xl text-5xl font-semibold leading-tight tracking-normal">
              Try the local MyPayTag API with real signed demo calls.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#586250]">
              Edit seed-compatible payloads, send them through the server-side
              demo proxy, and inspect the request shape a production integration
              should build. Demo secrets stay server-only.
            </p>
          </div>
          <div className="grid gap-3 rounded-md border border-[#d9dfd1] bg-[#fbfcf8] p-5">
            {[
              "PayToDapps call /payto-routes with supported paths, never wallet addresses.",
              "PayingDapps call /resolve with a Paytag and receive a safe status or one-time provider intent.",
              "NEAR 1Click is the MVP swap and bridge adapter; broad solver fanout is Phase 2 simulation.",
            ].map((item) => (
              <div className="flex gap-3 text-sm leading-6 text-[#3f493a]" key={item}>
                <CheckCircle2 className="mt-1 shrink-0 text-[#176b46]" size={17} aria-hidden="true" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Playground mode">
          {[
            ["receiving", "Pay-to apps"],
            ["sending", "Paying apps"],
          ].map(([id, label]) => (
            <button
              aria-selected={tab === id}
              className={`inline-flex h-10 items-center gap-2 rounded-md border px-4 text-sm font-semibold transition ${
                tab === id
                  ? "border-[#176b46] bg-[#176b46] text-white"
                  : "border-[#cbd4c3] bg-white text-[#33402f] hover:bg-[#eef3eb]"
              }`}
              key={id}
              onClick={() => {
                const nextTab = id as PlaygroundTab;
                setTab(nextTab);
                setSelectedLabel((nextTab === "receiving" ? receivingExamples : sendingExamples)[0]?.label ?? "");
              }}
              role="tab"
              type="button"
            >
              {tab === id ? <CheckCircle2 size={16} aria-hidden="true" /> : null}
              {label}
            </button>
          ))}
        </div>

        {selected ? (
          <div className="mt-5 grid gap-5 lg:grid-cols-[22rem_1fr]">
            <aside className="grid gap-3 self-start">
              {examples.map((example) => (
                <button
                  className={`rounded-md border p-4 text-left transition ${
                    example.label === selected.label
                      ? "border-[#176b46] bg-white shadow-sm"
                      : "border-[#d9dfd1] bg-white/70 hover:bg-white"
                  }`}
                  key={example.label}
                  onClick={() => setSelectedLabel(example.label)}
                  type="button"
                >
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#176b46]">
                    {example.eyebrow}
                  </span>
                  <span className="mt-2 block text-base font-semibold text-[#151713]">
                    {example.label}
                  </span>
                  <span className="mt-2 block text-sm leading-6 text-[#586250]">
                    {example.method} {example.endpoint}
                  </span>
                </button>
              ))}
            </aside>

            <PlaygroundCall key={selected.label} example={selected} />
          </div>
        ) : null}
      </section>
    </main>
  );
}

function PlaygroundCall({ example }: { example: PlaygroundExample }) {
  const [bodyText, setBodyText] = useState(prettyJson(example.body));
  const [result, setResult] = useState<PlaygroundResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runCall() {
    setIsRunning(true);
    setError(null);
    setResult(null);

    try {
      const body = JSON.parse(bodyText) as unknown;
      const response = await fetch("/api/playground/call", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          operation: example.operation,
          body,
        }),
      });
      const payload = await response.json() as PlaygroundResult;
      setResult(payload);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to run the playground call.");
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <section className="rounded-md border border-[#d9dfd1] bg-white">
      <div className="border-b border-[#d9dfd1] p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#176b46]">
              {example.eyebrow}
            </p>
            <h2 className="mt-2 text-2xl font-semibold">{example.label}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#586250]">{example.description}</p>
          </div>
          <div className="rounded-md border border-[#d9dfd1] bg-[#fbfcf8] px-3 py-2 font-mono text-xs text-[#33402f]">
            {example.method} {example.endpoint}
          </div>
        </div>
        <div className="mt-4 grid gap-2">
          {example.notes.map((note) => (
            <div className="flex gap-2 text-sm leading-6 text-[#4f5a49]" key={note}>
              <ArrowRight className="mt-1 shrink-0 text-[#245c8d]" size={15} aria-hidden="true" />
              <span>{note}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-2">
        <div className="border-b border-[#d9dfd1] p-5 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 text-base font-semibold">
              <TerminalSquare size={18} aria-hidden="true" />
              Request body
            </h3>
            <button
              className="inline-flex h-9 items-center gap-2 rounded-md border border-[#cbd4c3] bg-white px-3 text-sm font-semibold text-[#33402f] transition hover:bg-[#eef3eb]"
              onClick={() => {
                setBodyText(prettyJson(example.body));
                setResult(null);
                setError(null);
              }}
              type="button"
            >
              <RefreshCw size={15} aria-hidden="true" />
              Reset
            </button>
          </div>
          <textarea
            className="mt-4 min-h-[28rem] w-full resize-y rounded-md border border-[#cbd4c3] bg-[#101710] p-4 font-mono text-xs leading-6 text-[#dce8d7] outline-none focus:border-[#176b46] focus:ring-2 focus:ring-[#dcebdd]"
            onChange={(event) => setBodyText(event.target.value)}
            spellCheck={false}
            value={bodyText}
          />
          <button
            className="mt-4 inline-flex h-11 items-center gap-2 rounded-md bg-[#176b46] px-5 text-sm font-semibold text-white transition hover:bg-[#12583a] disabled:bg-[#9aac99]"
            disabled={isRunning}
            onClick={runCall}
            type="button"
          >
            {isRunning ? <Loader2 className="animate-spin" size={17} aria-hidden="true" /> : <Play size={17} aria-hidden="true" />}
            Run call
          </button>
          {error ? <p className="mt-3 text-sm font-semibold text-[#9b3326]">{error}</p> : null}
        </div>

        <div className="p-5">
          <h3 className="flex items-center gap-2 text-base font-semibold">
            <Server size={18} aria-hidden="true" />
            Request and response
          </h3>
          <pre className="mt-4 min-h-[28rem] overflow-x-auto rounded-md border border-[#d9dfd1] bg-[#f7f8f4] p-4 text-xs leading-6 text-[#172015]">
            <code>
              {result
                ? prettyJson(result)
                : "Run the call to see the server-signed request preview and local Supabase response."}
            </code>
          </pre>
        </div>
      </div>
    </section>
  );
}
