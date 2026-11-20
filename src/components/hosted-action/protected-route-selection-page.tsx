"use client";

import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";

import { SignedInOnly } from "@/components/cubid/signed-in-only";
import { RouteSelectionClient } from "@/components/hosted-action/route-selection-client";
import type { RouteSelectionAction } from "@/lib/mock-actions";

interface ProtectedRouteSelectionPageProps {
  actionId: string;
}

export function ProtectedRouteSelectionPage({
  actionId,
}: ProtectedRouteSelectionPageProps) {
  return (
    <SignedInOnly
      description="Receive-route selection is available after Cubid sign-in."
      title="Sign in to choose receive routes"
    >
      <RouteSelectionLoader actionId={actionId} />
    </SignedInOnly>
  );
}

function RouteSelectionLoader({ actionId }: ProtectedRouteSelectionPageProps) {
  const encodedActionId = encodeURIComponent(actionId);
  const [action, setAction] = useState<RouteSelectionAction | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    async function loadAction() {
      setStatus("loading");
      try {
        const response = await fetch(`/api/actions/route-selection/${encodedActionId}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Unable to load this route-selection action.");
        }

        const nextAction = await response.json() as RouteSelectionAction;
        if (!cancelled) {
          setAction(nextAction);
          setStatus("ready");
        }
      } catch {
        if (!cancelled) {
          setAction(null);
          setStatus("error");
        }
      }
    }

    void loadAction();

    return () => {
      cancelled = true;
    };
  }, [encodedActionId]);

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-[#f7f8f4] px-6 py-12 text-[#151713]">
        <section className="mx-auto max-w-lg rounded-lg border border-[#d9dfd1] bg-white p-6 shadow-sm">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#586250]">
            <LoaderCircle className="animate-spin" size={17} aria-hidden="true" />
            Loading route selection
          </span>
        </section>
      </main>
    );
  }

  if (!action) {
    return (
      <main className="min-h-screen bg-[#f7f8f4] px-6 py-12 text-[#151713]">
        <section className="mx-auto max-w-lg rounded-lg border border-[#d9dfd1] bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold">Route selection unavailable</h1>
          <p className="mt-3 text-sm leading-6 text-[#586250]">
            Restart from the app that sent you here.
          </p>
        </section>
      </main>
    );
  }

  return (
    <RouteSelectionClient
      action={action}
      submitUrl={`/api/actions/route-selection/${encodedActionId}`}
    />
  );
}
