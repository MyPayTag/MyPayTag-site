"use client";

import { useOptionalCubidAuth } from "@cubid/auth-react";
import { AlertTriangle, ArrowDown, ArrowUp, LoaderCircle, Save } from "lucide-react";
import { useEffect, useEffectEvent, useMemo, useState } from "react";

import { SignedInOnly } from "@/components/cubid/signed-in-only";
import { useTypedTranslation } from "@/lib/i18n/use-typed-translation";
import type {
  PortalPreferenceGroup,
  PortalPreferencesResponse,
  PortalPreferencesUpdateRequest,
  PortalReceiveRoute,
} from "@/lib/portal-preferences";

type LoadState =
  | { status: "idle" | "loading" | "saving" }
  | { status: "ready"; data: PortalPreferencesResponse }
  | { status: "empty" }
  | { status: "error"; message: string };

type SettingsT = ReturnType<typeof useTypedTranslation<"settings">>["t"];

export function ReceivePathSettingsPage() {
  const { t } = useTypedTranslation("settings");

  return (
    <SignedInOnly
      description={t("receivePathsSignInDescription")}
      title={t("receivePathsSignInTitle")}
    >
      <ReceivePathSettingsPanel />
    </SignedInOnly>
  );
}

function ReceivePathSettingsPanel() {
  const auth = useOptionalCubidAuth();
  const { t } = useTypedTranslation("settings");
  const accessToken = auth?.session?.accessToken;
  const [state, setState] = useState<LoadState>({ status: "idle" });
  const [groups, setGroups] = useState<PortalPreferenceGroup[]>([]);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const fetchData = useEffectEvent((token: string) => fetchPortalPreferences(token, t));
  const loadError = useEffectEvent((error: unknown) =>
    error instanceof Error ? error.message : t("errorGeneric")
  );

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;
    fetchData(accessToken)
      .then((data) => {
        if (cancelled) return;
        setGroups(data.groups);
        setState(data.groups.length > 0 ? { status: "ready", data } : { status: "empty" });
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
  }, [accessToken]);

  const hasGroups = groups.length > 0;

  async function saveGroup(group: PortalPreferenceGroup) {
    if (!accessToken) return;
    setState({ status: "saving" });
    setSaveMessage(null);
    try {
      const updated = await updatePortalPreferenceGroup(accessToken, group, t);
      const nextGroups = groups.map((candidate) =>
        groupKey(candidate) === groupKey(group)
          ? { ...updated, payingDapp: candidate.payingDapp }
          : candidate
      );
      setGroups(nextGroups);
      setSaveMessage(t("saveSuccess"));
      setState({
        status: "ready",
        data: { schema: "mypaytag.portal.preferences.v1", user: {}, groups: nextGroups },
      });
    } catch (error) {
      setState({
        status: "error",
        message: error instanceof Error ? error.message : t("errorGeneric"),
      });
    }
  }

  function moveRoute(group: PortalPreferenceGroup, routeId: string, direction: -1 | 1) {
    setGroups((current) =>
      current.map((candidate) => {
        if (groupKey(candidate) !== groupKey(group)) return candidate;
        const index = candidate.routes.findIndex((route) => route.routeId === routeId);
        const nextIndex = index + direction;
        if (index < 0 || nextIndex < 0 || nextIndex >= candidate.routes.length) return candidate;
        const routes = [...candidate.routes];
        const [route] = routes.splice(index, 1);
        routes.splice(nextIndex, 0, route);
        return {
          ...candidate,
          routes: routes.map((item, routeIndex) => ({
            ...item,
            priority: routeIndex + 1,
            isDefault: routeIndex === 0 && item.state === "active",
          })),
        };
      })
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f8f4] text-[#151713]">
      <section className="border-b border-[#d9dfd1] bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#176b46]">
            {t("receivePathsEyebrow")}
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-normal sm:text-5xl">
            {t("receivePathsTitle")}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[#586250]">
            {t("receivePathsDescription")}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {state.status === "loading" || state.status === "idle" || state.status === "saving" ? (
          <StatusPanel
            title={state.status === "saving" ? t("savingTitle") : t("loadingTitle")}
            message={t("loadingDescription")}
            loading
          />
        ) : null}
        {state.status === "empty" ? (
          <StatusPanel
            title={t("emptyTitle")}
            message={t("emptyDescription")}
          />
        ) : null}
        {state.status === "error" ? (
          <StatusPanel title={t("errorTitle")} message={state.message} tone="warning" />
        ) : null}
        {saveMessage ? (
          <p className="mb-4 rounded-md border border-[#bad4bc] bg-[#eef7ef] px-4 py-3 text-sm font-semibold text-[#176b46]">
            {saveMessage}
          </p>
        ) : null}
        {hasGroups ? (
          <div className="grid gap-5">
            {groups.map((group) => (
              <PreferenceGroupCard
                group={group}
                key={groupKey(group)}
                onMove={moveRoute}
                onSave={saveGroup}
              />
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}

function PreferenceGroupCard({
  group,
  onMove,
  onSave,
}: {
  group: PortalPreferenceGroup;
  onMove: (group: PortalPreferenceGroup, routeId: string, direction: -1 | 1) => void;
  onSave: (group: PortalPreferenceGroup) => void;
}) {
  const { t } = useTypedTranslation("settings");
  const activeRoutes = useMemo(
    () => group.routes.filter((route) => route.state === "active"),
    [group.routes],
  );

  return (
    <article className="rounded-lg border border-[#d9dfd1] bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#176b46]">
            {group.maskedDisplay ?? group.paytagRef}
          </p>
          <h2 className="mt-2 text-xl font-semibold">
            {group.chain} / {group.network} / {group.asset}
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#586250]">
            {t("payingDappLabel", {
              name: group.payingDapp?.displayName ?? t("anyPayingApp"),
            })}
          </p>
        </div>
        <button
          className="inline-flex h-10 items-center gap-2 rounded-md bg-[#176b46] px-4 text-sm font-semibold text-white transition hover:bg-[#12583a] disabled:bg-[#aeb8a6]"
          disabled={activeRoutes.length === 0}
          onClick={() => onSave(group)}
          type="button"
        >
          <Save size={16} aria-hidden="true" />
          {t("savePriority")}
        </button>
      </div>

      <div className="mt-5 grid gap-3">
        {group.routes.map((route, index) => (
          <RoutePriorityRow
            canMoveDown={index < group.routes.length - 1}
            canMoveUp={index > 0}
            group={group}
            key={route.routeId}
            onMove={onMove}
            route={route}
          />
        ))}
      </div>
    </article>
  );
}

function RoutePriorityRow({
  canMoveDown,
  canMoveUp,
  group,
  onMove,
  route,
}: {
  canMoveDown: boolean;
  canMoveUp: boolean;
  group: PortalPreferenceGroup;
  onMove: (group: PortalPreferenceGroup, routeId: string, direction: -1 | 1) => void;
  route: PortalReceiveRoute;
}) {
  const { t } = useTypedTranslation("settings");
  return (
    <div className="grid gap-3 rounded-md border border-[#dfe5d7] bg-[#fbfcf8] p-4 md:grid-cols-[4rem_1fr_auto] md:items-center">
      <span className="text-sm font-semibold text-[#586250]">#{route.priority}</span>
      <div>
        <h3 className="text-base font-semibold text-[#151713]">{route.payToDappName}</h3>
        <p className="mt-1 text-sm leading-6 text-[#586250]">
          {route.payToDappId} · {route.state}
          {route.isDefault ? ` · ${t("defaultRoute")}` : ""}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          aria-label={t("moveUp", { name: route.payToDappName })}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#cbd4c3] bg-white text-[#2c3429] transition hover:bg-[#f1f4ec] disabled:opacity-40"
          disabled={!canMoveUp || route.state !== "active"}
          onClick={() => onMove(group, route.routeId, -1)}
          type="button"
        >
          <ArrowUp size={16} aria-hidden="true" />
        </button>
        <button
          aria-label={t("moveDown", { name: route.payToDappName })}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#cbd4c3] bg-white text-[#2c3429] transition hover:bg-[#f1f4ec] disabled:opacity-40"
          disabled={!canMoveDown || route.state !== "active"}
          onClick={() => onMove(group, route.routeId, 1)}
          type="button"
        >
          <ArrowDown size={16} aria-hidden="true" />
        </button>
      </div>
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

async function fetchPortalPreferences(
  accessToken: string,
  t: SettingsT,
): Promise<PortalPreferencesResponse> {
  const response = await fetch("/api/portal/preferences", {
    headers: { authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(portalErrorMessage(response.status, t));
  return await response.json() as PortalPreferencesResponse;
}

async function updatePortalPreferenceGroup(
  accessToken: string,
  group: PortalPreferenceGroup,
  t: SettingsT,
): Promise<PortalPreferenceGroup> {
  const request: PortalPreferencesUpdateRequest = {
    schema: "mypaytag.portal.preferences.update.v1",
    group: {
      paytagRef: group.paytagRef,
      chain: group.chain,
      network: group.network,
      asset: group.asset,
      payingDappId: group.payingDapp?.id,
    },
    orderedRouteIds: group.routes
      .filter((route) => route.state === "active")
      .map((route) => route.routeId),
  };
  const response = await fetch("/api/portal/preferences", {
    method: "PUT",
    headers: {
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(request),
  });
  if (!response.ok) throw new Error(portalErrorMessage(response.status, t));
  return await response.json() as PortalPreferenceGroup;
}

function portalErrorMessage(status: number, t: SettingsT): string {
  if (status === 401) return t("errorUnauthorized");
  if (status === 503) return t("errorUnavailable");
  return t("errorGeneric");
}

function groupKey(group: PortalPreferenceGroup): string {
  return [
    group.paytagRef,
    group.chain,
    group.network,
    group.asset,
    group.payingDapp?.id ?? "",
  ].join(":");
}
