"use client";

import { CubidAuthProvider } from "@cubid/auth-react";
import type { ReactNode } from "react";

import {
  cubidPublicConfig,
  missingCubidPublicConfig,
} from "@/lib/cubid/public-config";

import { cubidStagingIssuer, fetchStagingCubidOidc } from "@/lib/cubid/staging-oidc";

export function AppAuthProvider({ children }: { children: ReactNode }) {
  if (missingCubidPublicConfig().length > 0) {
    return <>{children}</>;
  }

  return (
    <CubidAuthProvider
      autoUserInfo
      fetch={cubidPublicConfig.issuer === cubidStagingIssuer ? fetchStagingCubidOidc : undefined}
      clientId={cubidPublicConfig.clientId}
      issuer={cubidPublicConfig.issuer}
      postLogoutRedirectUri={
        typeof window === "undefined" ? undefined : window.location.origin
      }
      redirectUri={cubidPublicConfig.redirectUri}
      scope={["openid", "profile", "email"]}
    >
      {children}
    </CubidAuthProvider>
  );
}
