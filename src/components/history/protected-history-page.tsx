"use client";

import { useOptionalCubidAuth } from "@cubid/auth-react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  History,
  LoaderCircle,
  ReceiptText,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useEffectEvent, useMemo, useState } from "react";

import { SignedInOnly } from "@/components/cubid/signed-in-only";
import { BackButton } from "@/components/navigation/back-button";
import { useTypedTranslation } from "@/lib/i18n/use-typed-translation";
import {
  groupPortalHistoryItems,
  type PortalHistoryFilter,
  type PortalHistoryItem,
  type PortalHistoryResponse,
  type PortalHistoryType,
} from "@/lib/portal-history";

const groupLabels: Array<{
  id: PortalHistoryFilter;
  key: "groupPayingApp" | "groupPayToApp" | "groupToken" | "groupChain";
}> = [
  { id: "paying-app", key: "groupPayingApp" },
  { id: "payto-app", key: "groupPayToApp" },
  { id: "token", key: "groupToken" },
  { id: "chain", key: "groupChain" },
];

const typeLabels: Array<{
  id?: PortalHistoryType;
  key:
    | "typeQuestions"
    | "typeAnswers"
    | "typeQuotes"
    | "typeIntents"
    | "typeReceipts"
    | "typeAll";
}> = [
  { id: "questions", key: "typeQuestions" },
  { id: "answers", key: "typeAnswers" },
  { id: "quotes", key: "typeQuotes" },
  { id: "intents", key: "typeIntents" },
  { id: "receipts", key: "typeReceipts" },
  { key: "typeAll" },
];

type LoadState =
  | { status: "idle" | "loading" }
  | { status: "ready"; data: PortalHistoryResponse }
  | { status: "empty" }
  | { status: "error"; message: string };

type HistoryT = ReturnType<typeof useTypedTranslation<"history">>["t"];

interface ProtectedHistoryPageProps {
  type?: PortalHistoryType;
  view: PortalHistoryFilter;
}

export function ProtectedHistoryPage({ type, view }: ProtectedHistoryPageProps) {
  const { t } = useTypedTranslation("history");

  return (
    <SignedInOnly
      description={t("signInDescription")}
      title={t("signInTitle")}
    >
      <HistoryPanel type={type} view={view} />
    </SignedInOnly>
  );
}

function HistoryPanel({ type, view }: ProtectedHistoryPageProps) {
  const auth = useOptionalCubidAuth();
  const { t } = useTypedTranslation("history");
  const accessToken = auth?.session?.accessToken;
  const [state, setState] = useState<LoadState>({ status: "idle" });

  const fetchData = useEffectEvent((token: string) => fetchPortalHistory(token, type, t));
  const loadError = useEffectEvent((error: unknown) =>
    error instanceof Error ? error.message : t("errorGeneric")
  );

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;
    fetchData(accessToken)
      .then((data) => {
        if (cancelled) return;
        setState(data.items.length > 0 ? { status: "ready", data } : { status: "empty" });
      })
      .catch((error) => {
        if (cancelled) return;
        setState({
          status: "error",
          message: loadError(error),
        });
      });

    return () => {
      cancelled = true;
    };
  }, [accessToken, type]);

  const groups = useMemo(
    () =>
      state.status === "ready"
        ? groupPortalHistoryItems(state.data.items, view)
        : new Map<string, PortalHistoryItem[]>(),
    [state, view],
  );

  return (
    <main className="min-h-screen bg-[#f7f8f4] text-[#151713]">
      <BackButton />
      <section className="border-b border-[#d9dfd1] bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <Link
            className="text-sm font-semibold text-[#176b46] underline-offset-4 hover:underline"
            href="/"
          >
            MyPayTag
          </Link>
          <div className="mt-5 flex max-w-4xl items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[#e5eef8] text-[#245c8d]">
              <History size={23} aria-hidden="true" />
            </span>
            <div>
              <h1 className="text-4xl font-semibold leading-tight tracking-normal sm:text-5xl">
                {t("title")}
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[#586250]">
                {t("description")}
              </p>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap gap-4">
            <nav className="flex flex-wrap gap-2" aria-label={t("groupByLabel")}>
              {groupLabels.map((filter) => {
                const active = filter.id === view;

                return (
                  <Link
                    className={`inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-semibold transition ${
                      active
                        ? "border-[#176b46] bg-[#176b46] text-white"
                        : "border-[#cbd4c3] bg-white text-[#2c3429] hover:bg-[#f1f4ec]"
                    }`}
                    href={historyHref(filter.id, type)}
                    key={filter.id}
                  >
                    {t(filter.key)}
                  </Link>
                );
              })}
            </nav>
            <nav className="flex flex-wrap gap-2" aria-label={t("typeLabel")}>
              {typeLabels.map((filter) => {
                const active = filter.id === type || (!filter.id && !type);

                return (
                  <Link
                    className={`inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-semibold transition ${
                      active
                        ? "border-[#245c8d] bg-[#245c8d] text-white"
                        : "border-[#cbd4c3] bg-white text-[#2c3429] hover:bg-[#f1f4ec]"
                    }`}
                    href={historyHref(view, filter.id)}
                    key={filter.key}
                  >
                    {t(filter.key)}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-6 py-8 lg:px-8">
        {state.status === "idle" || state.status === "loading" ? (
          <StatusPanel loading message={t("loadingDescription")} title={t("loadingTitle")} />
        ) : null}
        {state.status === "empty" ? (
          <StatusPanel message={t("emptyDescription")} title={t("emptyTitle")} />
        ) : null}
        {state.status === "error" ? (
          <StatusPanel message={state.message} title={t("errorTitle")} tone="warning" />
        ) : null}
        {Array.from(groups.entries()).map(([label, items]) => (
          <section
            className="rounded-lg border border-[#d9dfd1] bg-white p-5 shadow-sm"
            key={label}
          >
            <h2 className="text-xl font-semibold text-[#151713]">{label}</h2>
            <div className="mt-4 grid gap-3">
              {items.map((item) => (
                <HistoryItemCard item={item} key={`${item.kind}:${item.id}`} />
              ))}
            </div>
          </section>
        ))}
      </section>
    </main>
  );
}

function HistoryItemCard({ item }: { item: PortalHistoryItem }) {
  const { t } = useTypedTranslation("history");

  return (
    <article className="rounded-md border border-[#dfe5d7] bg-[#fbfcf8] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="inline-flex rounded-md bg-[#e5eef8] px-2 py-1 text-xs font-semibold text-[#245c8d]">
            {kindLabel(item.kind, t)}
          </span>
          <p className="mt-3 text-sm font-semibold text-[#151713]">{primaryLine(item, t)}</p>
          <p className="mt-1 text-xs leading-5 text-[#586250]">{formatDate(timestampForItem(item))}</p>
        </div>
        <StatusBadge status={statusForItem(item)} />
      </div>
      <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
        {item.kind === "question" ? <QuestionDetails item={item} /> : null}
        {item.kind === "answer" ? <AnswerDetails item={item} /> : null}
        {item.kind === "quote" ? <QuoteDetails item={item} /> : null}
        {item.kind === "selected_quote" ? <SelectedQuoteDetails item={item} /> : null}
        {item.kind === "payment_intent" ? <PaymentIntentDetails item={item} /> : null}
        {item.kind === "receipt" ? <ReceiptDetails item={item} /> : null}
      </div>
    </article>
  );
}

function QuestionDetails({ item }: { item: Extract<PortalHistoryItem, { kind: "question" }> }) {
  const { t } = useTypedTranslation("history");
  return (
    <>
      <DetailRow label={t("payingDapp")} value={item.payingDapp.displayName} />
      <DetailRow label={t("paytag")} value={item.paytagMaskedDisplay ?? t("notProvided")} />
      <DetailRow label={t("amount")} value={`${item.amount.value} ${item.amount.currency}`} />
      <DetailRow label={t("purpose")} value={item.purpose} />
      <DetailRow label={t("reference")} value={item.payingDappReference} />
      <DetailRow
        label={t("requestedPaths")}
        value={item.requestedPaths.map((path) => `${path.chain}/${path.network}/${path.asset}`).join(", ") || t("notProvided")}
      />
    </>
  );
}

function AnswerDetails({ item }: { item: Extract<PortalHistoryItem, { kind: "answer" }> }) {
  const { t } = useTypedTranslation("history");
  return (
    <>
      <DetailRow label={t("questionId")} value={item.questionId} />
      <DetailRow label={t("answerStatus")} value={item.status} />
    </>
  );
}

function QuoteDetails({ item }: { item: Extract<PortalHistoryItem, { kind: "quote" }> }) {
  const { t } = useTypedTranslation("history");
  return (
    <>
      <DetailRow label={t("questionId")} value={item.questionId} />
      <DetailRow label={t("provider")} value={item.provider} />
      <DetailRow label={t("from")} value={assetAmount(item.from)} />
      <DetailRow label={t("to")} value={assetAmount(item.to)} />
      <DetailRow label={t("expiresAt")} value={formatDate(item.expiresAt)} />
      <DetailRow
        label={t("fees")}
        value={item.fees.map((fee) => `${fee.label}: ${fee.amount} ${fee.asset}`).join(", ") || t("noFees")}
      />
      <DetailRow
        label={t("routeSteps")}
        value={item.routeSteps.map((step) => `${step.label}: ${step.routeReference}`).join(", ") || t("notProvided")}
      />
    </>
  );
}

function SelectedQuoteDetails({ item }: { item: Extract<PortalHistoryItem, { kind: "selected_quote" }> }) {
  const { t } = useTypedTranslation("history");
  return (
    <>
      <DetailRow label={t("questionId")} value={item.questionId} />
      <DetailRow label={t("quoteId")} value={item.quoteId} />
      <DetailRow label={t("selectedAt")} value={formatDate(item.selectedAt)} />
      <DetailRow label={t("payableInstruction")} value={item.payableInstructionRef ?? t("notProvided")} />
    </>
  );
}

function PaymentIntentDetails({ item }: { item: Extract<PortalHistoryItem, { kind: "payment_intent" }> }) {
  const { t } = useTypedTranslation("history");
  return (
    <>
      <DetailRow label={t("questionId")} value={item.questionId} />
      <DetailRow label={t("payToDapp")} value={item.payToDapp.displayName} />
      <DetailRow label={t("amount")} value={assetAmount(item.amount)} />
      <DetailRow label={t("expiresAt")} value={formatDate(item.expiresAt)} />
    </>
  );
}

function ReceiptDetails({ item }: { item: Extract<PortalHistoryItem, { kind: "receipt" }> }) {
  const { t } = useTypedTranslation("history");
  return (
    <>
      <DetailRow label={t("questionId")} value={item.questionId} />
      <DetailRow label={t("paymentIntentId")} value={item.paymentIntentId ?? t("notProvided")} />
      <DetailRow label={t("selectedQuoteId")} value={item.selectedQuoteId ?? t("notProvided")} />
      <DetailRow label={t("transactionHash")} value={item.transactionHash ?? t("pendingReceipt")} />
      <DetailRow label={t("chain")} value={[item.chain, item.network].filter(Boolean).join(" / ") || t("notProvided")} />
      {item.explorerUrl ? <DetailRow label={t("explorer")} value={item.explorerUrl} /> : null}
    </>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 rounded-md border border-[#e7ece0] bg-white p-3">
      <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[#586250]">{label}</dt>
      <dd className="min-w-0 break-words text-[#151713]">{value}</dd>
    </div>
  );
}

function StatusPanel({
  loading,
  message,
  title,
  tone = "neutral",
}: {
  loading?: boolean;
  message: string;
  title: string;
  tone?: "neutral" | "warning";
}) {
  return (
    <div className="rounded-lg border border-[#d9dfd1] bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        {loading ? (
          <LoaderCircle className="mt-1 animate-spin text-[#176b46]" size={21} aria-hidden="true" />
        ) : (
          <AlertTriangle
            className={tone === "warning" ? "mt-1 text-[#9b6b0b]" : "mt-1 text-[#176b46]"}
            size={21}
            aria-hidden="true"
          />
        )}
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-[#586250]">{message}</p>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const icon = status === "completed" || status === "ready" || status === "available"
    ? <CheckCircle2 size={15} aria-hidden="true" />
    : status === "pending" || status === "unavailable"
      ? <Clock3 size={15} aria-hidden="true" />
      : <ReceiptText size={15} aria-hidden="true" />;

  return (
    <span className="inline-flex max-w-full items-center gap-1 rounded-md border border-[#cbd4c3] bg-white px-2 py-1 text-xs font-semibold text-[#2c3429]">
      {icon}
      <span className="min-w-0 break-words">{status}</span>
    </span>
  );
}

async function fetchPortalHistory(
  accessToken: string,
  type: PortalHistoryType | undefined,
  t: HistoryT,
): Promise<PortalHistoryResponse> {
  const params = new URLSearchParams();
  if (type) params.set("type", type);
  const response = await fetch(`/api/portal/history${params.size ? `?${params.toString()}` : ""}`, {
    headers: { authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(portalErrorMessage(response.status, t));
  return await response.json() as PortalHistoryResponse;
}

function portalErrorMessage(status: number, t: HistoryT): string {
  if (status === 401) return t("errorUnauthorized");
  if (status === 503) return t("errorUnavailable");
  return t("errorGeneric");
}

function historyHref(view: PortalHistoryFilter, type?: PortalHistoryType) {
  const params = new URLSearchParams({ view });
  if (type) params.set("type", type);
  return `/history?${params.toString()}`;
}

function kindLabel(kind: PortalHistoryItem["kind"], t: HistoryT): string {
  const labels = {
    question: t("kindQuestion"),
    answer: t("kindAnswer"),
    quote: t("kindQuote"),
    selected_quote: t("kindSelectedQuote"),
    payment_intent: t("kindPaymentIntent"),
    receipt: t("kindReceipt"),
  };
  return labels[kind];
}

function primaryLine(item: PortalHistoryItem, t: HistoryT): string {
  if (item.kind === "question") return item.purpose || t("questionFallback");
  if (item.kind === "answer") return `${t("answerFor")} ${item.questionId}`;
  if (item.kind === "quote") return `${item.provider}: ${assetAmount(item.from)} to ${assetAmount(item.to)}`;
  if (item.kind === "selected_quote") return `${t("selectedQuoteFor")} ${item.quoteId}`;
  if (item.kind === "payment_intent") return `${item.payToDapp.displayName}: ${assetAmount(item.amount)}`;
  return item.transactionHash ?? t("receiptFallback");
}

function timestampForItem(item: PortalHistoryItem): string {
  if (item.kind === "selected_quote") return item.selectedAt;
  return item.createdAt;
}

function statusForItem(item: PortalHistoryItem): string {
  if (item.kind === "question") return "asked";
  return "status" in item ? item.status : "available";
}

function assetAmount(amount: { amount?: string; asset?: string; chain?: string; network?: string }) {
  const value = [amount.amount, amount.asset].filter(Boolean).join(" ");
  const path = [amount.chain, amount.network].filter(Boolean).join(" / ");
  return [value, path].filter(Boolean).join(" on ");
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
