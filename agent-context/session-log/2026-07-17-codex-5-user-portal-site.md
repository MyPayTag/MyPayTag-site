
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
