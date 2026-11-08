import { ProtectedHistoryPage } from "@/components/history/protected-history-page";
import type {
  IncomingHistoryFilter,
  IncomingHistoryType,
} from "@/lib/incoming-transactions";

interface HistoryPageProps {
  searchParams: Promise<{
    type?: string;
    view?: string;
    cursor?: string;
  }>;
}

export const metadata = {
  title: "Incoming Transaction History",
  description:
    "Backend-backed incoming transaction history grouped by paying app, PayToDapp, token, or chain.",
};

export default async function HistoryPage({ searchParams }: HistoryPageProps) {
  const params = await searchParams;
  const type = normalizeType(params.type);
  const view = normalizeFilter(params.view);

  const cursor = typeof params.cursor === "string" ? params.cursor : undefined;
  return <ProtectedHistoryPage cursor={cursor} type={type} view={view} />;
}

function normalizeFilter(value: string | undefined): IncomingHistoryFilter {
  if (
    value === "paying-app" ||
    value === "payto-app" ||
    value === "token" ||
    value === "chain"
  ) {
    return value;
  }

  return "paying-app";
}

function normalizeType(value: string | undefined): IncomingHistoryType | undefined {
  if (
    value === "questions" ||
    value === "answers" ||
    value === "quotes" ||
    value === "intents" ||
    value === "receipts"
  ) {
    return value;
  }

  return undefined;
}
