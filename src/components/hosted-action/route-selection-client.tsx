"use client";

import { CheckCircle2, Circle, GitBranch, XCircle } from "lucide-react";
import { useMemo, useState } from "react";

import { BackButton } from "@/components/navigation/back-button";
import type {
  HostedActionState,
  ReceivePath,
  RouteOption,
  RouteSelectionAction,
} from "@/lib/mock-actions";

interface RouteSelectionClientProps {
  action: RouteSelectionAction;
  submitUrl: string;
}

const stateCopy: Record<HostedActionState, { title: string; body: string }> = {
  ready: {
    title: "Choose receive defaults",
    body: "Review each chain and token channel. Channels with one PayToDapp are ready; channels with multiple PayToDapps need a default.",
  },
  denied: {
    title: "No default changed",
    body: "Your existing receive preferences were not changed.",
  },
  selected_route: {
    title: "Default saved",
    body: "This receive channel can now use the selected PayToDapp by default.",
  },
  expired: {
    title: "This link expired",
    body: "Restart from the app that sent you here.",
  },
  invalid: {
    title: "This link cannot be used",
    body: "Restart from the app that sent you here.",
  },
  completed: {
    title: "This action is complete",
    body: "There is nothing else to do here.",
  },
  restart_required: {
    title: "Restart required",
    body: "Open a fresh route-selection link.",
  },
};

export function RouteSelectionClient({ action, submitUrl }: RouteSelectionClientProps) {
  const [state, setState] = useState<HostedActionState>(action.state);
  const paths = useMemo(() => action.paths ?? [], [action.paths]);
  const [selectedPathId, setSelectedPathId] = useState(() => paths[0]?.id ?? "");
  const [selectedOptionByPath, setSelectedOptionByPath] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      paths.map((path) => [
        path.id,
        path.options.some((option) => option.id === path.currentDefaultId)
          ? path.currentDefaultId
          : path.options[0]?.id ?? "",
      ]),
    )
  );
  const [pending, setPending] = useState(false);

  const copy = stateCopy[state];
  const isReady = state === "ready";
  const selectedPath = paths.find((path) => path.id === selectedPathId) ?? paths[0];
  const selectedOption = selectedPath
    ? selectedPath.options.find((option) => option.id === selectedOptionByPath[selectedPath.id]) ??
      selectedPath.options[0]
    : undefined;
  const needsDefault = Boolean(selectedPath && selectedPath.options.length > 1);

  const totalChoices = useMemo(
    () => paths.reduce((sum, path) => sum + path.options.length, 0),
    [paths],
  );

  async function submit(decision: "select_route" | "leave_unchanged") {
    if (decision === "select_route" && (!selectedPath || !selectedOption || !needsDefault)) {
      setState("restart_required");
      return;
    }

    setPending(true);
    try {
      const response = await fetch(submitUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          decision,
          selectedRouteId: decision === "select_route" ? selectedOption?.id : undefined,
        }),
      });
      const result = await response.json() as {
        state?: HostedActionState;
        selectedRouteId?: string;
      };
      setState(result.state ?? "restart_required");
    } catch {
      setState("restart_required");
    } finally {
      setPending(false);
    }
  }

  function selectOption(path: ReceivePath, option: RouteOption) {
    setSelectedOptionByPath((current) => ({
      ...current,
      [path.id]: option.id,
    }));
  }

  return (
    <main className="min-h-screen bg-[#f7f8f4] px-5 py-8 text-[#151713] sm:px-8">
      <BackButton desktopPadding="0rem" maxWidth="72rem" mobilePadding="1.25rem" />
      <section className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.82fr_1.18fr]">
        <div className="rounded-lg border border-[#d9dfd1] bg-white p-5 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[#e5eef8] text-[#245c8d]">
            <GitBranch size={24} aria-hidden="true" />
          </div>
          <h1 className="mt-5 text-3xl font-semibold leading-tight text-[#111611] sm:text-4xl">
            {copy.title}
          </h1>
          <p className="mt-3 text-base leading-7 text-[#586250]">{copy.body}</p>

          {action.mockMode ? (
            <div className="mt-5 rounded-md border border-[#d7b45a] bg-[#fff8e3] p-3 text-sm font-semibold leading-6 text-[#6d4a00]">
              Local mock mode is on. This route-selection data is a development fixture, not hosted staging data.
            </div>
          ) : null}

          <div className="mt-6 rounded-md border border-[#dfe5d7] bg-[#fbfcf8] p-4 text-sm leading-6 text-[#586250]">
            <span className="font-semibold text-[#151713]">{action.maskedIdentifier}</span>
            <span className="mx-2 text-[#9aa493]">/</span>
            <span>{paths.length} channels</span>
            <span className="mx-2 text-[#9aa493]">/</span>
            <span>{totalChoices} PayToDapp options</span>
          </div>

          <div className="mt-5 grid gap-3">
            {isReady && paths.length > 0 ? (
              paths.map((path) => {
                const active = selectedPath?.id === path.id;
                const optionCount = path.options.length;
                const status = optionCount === 1 ? "Single option" : `${optionCount} options`;

                return (
                  <button
                    className={`rounded-md border p-4 text-left transition ${
                      active
                        ? "border-[#176b46] bg-[#eef7ef]"
                        : "border-[#dfe5d7] bg-white hover:border-[#b9c7ad]"
                    }`}
                    key={path.id}
                    onClick={() => setSelectedPathId(path.id)}
                    type="button"
                  >
                    <span className="block text-base font-semibold text-[#151713]">
                      {path.label}
                    </span>
                    <span className="mt-1 block text-sm leading-6 text-[#586250]">
                      {path.chain} · {path.token}
                    </span>
                    <span
                      className={`mt-3 inline-flex rounded-md px-2 py-1 text-xs font-semibold ${
                        optionCount === 1
                          ? "bg-[#e5eef8] text-[#245c8d]"
                          : "bg-[#e4f2e6] text-[#176b46]"
                      }`}
                    >
                      {status}
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="rounded-md border border-[#dfe5d7] bg-white p-5">
                <p className="text-sm leading-6 text-[#586250]">
                  Receive channels are hidden for this action state.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-[#d9dfd1] bg-[#fbfcf8] p-5 shadow-sm">
          {selectedPath && selectedOption ? (
            <div className="grid gap-5">
              <div className="rounded-md border border-[#dfe5d7] bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-normal text-[#245c8d]">
                  {selectedPath.label}
                </p>
                <h2 className="mt-2 text-2xl font-semibold leading-snug text-[#151713]">
                  {needsDefault ? "Select the default PayToDapp" : selectedOption.name}
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#586250]">
                  {needsDefault
                    ? "More than one PayToDapp can receive this channel. Choose the default MyPayTag should use."
                    : "This channel has one active PayToDapp. No default selection is needed."}
                </p>
              </div>

              {needsDefault ? (
                <div className="grid gap-3">
                  {selectedPath.options.map((option) => {
                    const selected = selectedOption.id === option.id;

                    return (
                      <button
                        className="grid grid-cols-[auto_1fr] gap-4 rounded-md border border-[#dfe5d7] bg-white p-4 text-left transition hover:border-[#b9c7ad] disabled:opacity-70"
                        key={option.id}
                        onClick={() => selectOption(selectedPath, option)}
                        type="button"
                      >
                        <span className="mt-1 text-[#176b46]">
                          {selected ? (
                            <CheckCircle2 size={20} aria-hidden="true" />
                          ) : (
                            <Circle size={20} aria-hidden="true" />
                          )}
                        </span>
                        <span>
                          <span className="block text-base font-semibold text-[#151713]">
                            {option.name}
                          </span>
                          <span className="mt-1 block text-sm leading-6 text-[#586250]">
                            {option.detail}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : null}

              <PayToAppDetails option={selectedOption} />

              {needsDefault ? (
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#176b46] px-5 text-sm font-semibold text-white transition hover:bg-[#12583a] disabled:bg-[#aeb8a6]"
                    disabled={!isReady || pending}
                    onClick={() => void submit("select_route")}
                    type="button"
                  >
                    <CheckCircle2 size={18} aria-hidden="true" />
                    Save default
                  </button>
                  <button
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-[#cbd4c3] bg-white px-5 text-sm font-semibold text-[#2c3429] transition hover:bg-[#f1f4ec] disabled:text-[#9aa493]"
                    disabled={!isReady || pending}
                    onClick={() => void submit("leave_unchanged")}
                    type="button"
                  >
                    <XCircle size={18} aria-hidden="true" />
                    Leave unchanged
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="rounded-md border border-[#dfe5d7] bg-white p-5">
              <p className="text-sm leading-6 text-[#586250]">
                Receive channel details are unavailable for this action state.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function PayToAppDetails({ option }: { option: RouteOption }) {
  return (
    <div className="rounded-md border border-[#dfe5d7] bg-white p-5">
      <h3 className="text-lg font-semibold text-[#151713]">{option.name}</h3>
      <p className="mt-2 text-sm leading-6 text-[#586250]">{option.detail}</p>
      <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="font-semibold text-[#151713]">Added</dt>
          <dd className="mt-1 text-[#586250]">{option.addedAt}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="font-semibold text-[#151713]">Visible scope</dt>
          <dd className="mt-1 text-[#586250]">
            Eligible only for this action&apos;s chain, token, Paytag, and signed-in user context.
          </dd>
        </div>
      </dl>
    </div>
  );
}
