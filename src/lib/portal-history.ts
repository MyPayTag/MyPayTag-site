export type PortalHistoryFilter = "paying-app" | "payto-app" | "token" | "chain";
export type PortalHistoryType = "questions" | "answers" | "quotes" | "intents" | "receipts";

export interface PortalHistoryResponse {
  schema: "mypaytag.portal.history.v1";
  items: PortalHistoryItem[];
  nextCursor?: string;
}

export type PortalHistoryItem =
  | PortalQuestionSummary
  | PortalAnswerSummary
  | PortalQuoteSummary
  | PortalSelectedQuoteSummary
  | PortalPaymentIntentSummary
  | PortalReceiptSummary;

export interface PortalQuestionSummary {
  kind: "question";
  id: string;
  createdAt: string;
  payingDapp: PortalDappSummary;
  paytagMaskedDisplay?: string;
  requestedPaths: PortalRequestedPathSummary[];
  amount: {
    value: string;
    currency: string;
  };
  purpose: string;
  payingDappReference: string;
}

export interface PortalAnswerSummary {
  kind: "answer";
  id: string;
  questionId: string;
  createdAt: string;
  status: string;
}

export interface PortalAssetAmount {
  chain: string;
  network: string;
  asset: string;
  amount: string;
}

export interface PortalFeeSummary {
  label: string;
  amount: string;
  asset: string;
  chargedTo?: "sender";
  source?: string;
}

export interface PortalRouteStep {
  label: string;
  routeReference: string;
}

export interface PortalQuoteSummary {
  kind: "quote";
  id: string;
  questionId: string;
  createdAt: string;
  provider: string;
  from: PortalAssetAmount;
  to: PortalAssetAmount;
  fees: PortalFeeSummary[];
  expiresAt: string;
  routeSteps: PortalRouteStep[];
  status: "available" | "selected" | "expired" | "failed";
}

export interface PortalSelectedQuoteSummary {
  kind: "selected_quote";
  id: string;
  questionId: string;
  quoteId: string;
  selectedAt: string;
  status: "ready" | "expired" | "failed";
  payableInstructionRef?: string;
}

export interface PortalPaymentIntentSummary {
  kind: "payment_intent";
  id: string;
  questionId: string;
  createdAt: string;
  status: "ready" | "expired" | "used" | "failed";
  payToDapp: PortalDappSummary;
  amount: PortalAssetAmount;
  expiresAt: string;
}

export interface PortalReceiptSummary {
  kind: "receipt";
  id: string;
  questionId: string;
  createdAt: string;
  status: "pending" | "completed" | "failed" | "unavailable";
  paymentIntentId?: string;
  selectedQuoteId?: string;
  transactionHash?: string;
  chain?: string;
  network?: string;
  explorerUrl?: string;
}

export interface PortalRequestedPathSummary {
  chain: string;
  network: string;
  asset: string;
}

export interface PortalDappSummary {
  id: string;
  displayName: string;
  appUrl?: string;
}

export function groupPortalHistoryItems(
  items: PortalHistoryItem[],
  filter: PortalHistoryFilter,
  type?: PortalHistoryType,
): Map<string, PortalHistoryItem[]> {
  const questions = new Map(
    items
      .filter((item): item is PortalQuestionSummary => item.kind === "question")
      .map((item) => [item.id, item]),
  );

  const kinds: Record<PortalHistoryType, PortalHistoryItem["kind"][]> = {
    questions: ["question"],
    answers: ["answer"],
    quotes: ["quote", "selected_quote"],
    intents: ["payment_intent"],
    receipts: ["receipt"],
  };
  const visibleItems = type ? items.filter((item) => kinds[type].includes(item.kind)) : items;
  return Map.groupBy(visibleItems, (item) => historyGroupLabel(item, filter, questions));
}

function historyGroupLabel(
  item: PortalHistoryItem,
  filter: PortalHistoryFilter,
  questions: Map<string, PortalQuestionSummary>,
): string {
  const question = item.kind === "question" ? item : questions.get("questionId" in item ? item.questionId : "");

  if (filter === "paying-app") {
    return question?.payingDapp.displayName ?? "Unknown PayingDapp";
  }
  if (filter === "payto-app") {
    return item.kind === "payment_intent"
      ? item.payToDapp.displayName
      : "No PayToDapp selected";
  }

  const amount = itemAmount(item, question);
  if (filter === "token") return amount?.asset || "Unknown token";
  return amount ? `${amount.chain || "Unknown chain"} / ${amount.network || "Unknown network"}` : "Unknown chain";
}

function itemAmount(
  item: PortalHistoryItem,
  question: PortalQuestionSummary | undefined,
): Partial<PortalAssetAmount> | undefined {
  if (item.kind === "quote") return item.to.asset ? item.to : item.from;
  if (item.kind === "payment_intent") return item.amount;
  if (item.kind === "receipt") {
    return item.chain || item.network
      ? { chain: item.chain ?? "", network: item.network ?? "", asset: "", amount: "" }
      : undefined;
  }
  if (question?.requestedPaths[0]) return question.requestedPaths[0];
  if (question?.amount.currency) return { asset: question.amount.currency };
  return undefined;
}
