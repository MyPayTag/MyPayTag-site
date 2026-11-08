export interface PortalPreferencesResponse {
  schema: "mypaytag.portal.preferences.v1";
  user: {
    maskedDisplay?: string;
  };
  groups: PortalPreferenceGroup[];
}

export interface PortalPreferenceGroup {
  paytagRef: string;
  maskedDisplay?: string;
  chain: string;
  network: string;
  asset: string;
  payingDapp?: PortalDappSummary;
  routes: PortalReceiveRoute[];
}

export interface PortalDappSummary {
  id: string;
  displayName: string;
  appUrl?: string;
}

export interface PortalReceiveRoute {
  routeId: string;
  payToDappId: string;
  payToDappName: string;
  appUrl?: string;
  priority: number;
  isDefault: boolean;
  state: "active" | "disabled" | "revoked";
}

export interface PortalPreferencesUpdateRequest {
  schema: "mypaytag.portal.preferences.update.v1";
  group: {
    paytagRef: string;
    chain: string;
    network: string;
    asset: string;
    payingDappId?: string;
  };
  orderedRouteIds: string[];
}

export type PortalPreferencesState =
  | { status: "ready"; data: PortalPreferencesResponse }
  | { status: "unauthorized" | "unavailable" | "invalid_request" };
