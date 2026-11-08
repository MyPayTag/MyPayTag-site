
## 2026-11-08

The Cubid staging issuer returned discovery metadata without CORS permission
for the MyPayTag preview origin. Routed the SDK's four staging OIDC fetches
through the MyPayTag site. The token proxy accepts only the configured client's
authorization code exchange for the registered callback. Cubid still handles
browser sign-in, PKCE, and token issuance.

Verified in Chromium that the Settings sign-in button opens Cubid staging.
Discovery and JWKS loaded through the proxy. The token endpoint relayed the
issuer's invalid-code response and rejected an unexpected client and origin.
Typecheck, lint, and browser secret scanning passed.

Added a flag language selector to the shared header. Explicit choices are
saved in a cookie so both server rendering and hydration use the same
language. Browser language priority now takes precedence over the Sweden
fallback. Reused the per-render i18n setup from the translation work.

Verified English-first requests with Swedish as a lower preference,
Swedish-first requests, and explicit preference cookies. Chromium switched
between English and Swedish and restored both choices after reload.
Translation validation, lint, and typecheck passed.

The authenticated staging smoke exposed a receive-path draft reset. The typed
translation hook returned a new function on every render, causing effects in
Settings and History to refetch continuously. Stabilized the function between
translation changes so reordering can remain in local state until save.

The first memoization alone did not stop the staging refetch loop. Removed
translation from the request effects' dependencies entirely. The effects
now run for a changed session token or history filter and read current
translations only when making or reporting a request.

Kept the paying app display label after saving a priority. The write result
has the same app ID but does not embed its display name.
