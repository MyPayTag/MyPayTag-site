import type { CubidAuthFetch } from "@cubid/auth";

export const cubidStagingIssuer = "https://staging-id.cubid.me";

export const cubidOidcPaths = {
  discovery: "/.well-known/openid-configuration",
  jwks: "/jwks",
  token: "/token",
  userinfo: "/userinfo",
} as const;

export const fetchStagingCubidOidc: CubidAuthFetch = (input, init) => {
  const url = new URL(input instanceof Request ? input.url : input);
  const endpoint = Object.entries(cubidOidcPaths).find(([, path]) => path === url.pathname)?.[0];
  if (url.origin !== cubidStagingIssuer || url.search || !endpoint) {
    return Promise.reject(new Error("Unexpected Cubid staging OIDC endpoint"));
  }
  const target = `/api/cubid/oidc/${endpoint}`;
  return fetch(input instanceof Request ? new Request(target, input) : target, init);
};
