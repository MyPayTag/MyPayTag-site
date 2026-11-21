# Role-specific marketing refactor

## Visual thesis
A calm, expansive travel-like visual language: cinematic coastal routes, warm paper surfaces, forest-green typography and restrained movement make value moving to the right destination feel effortless.

## Content plan and ownership
- Home: the shared promise (one Paytag, recipient preferences, routing/swap/bridge, supported arrival notifications), role choice and early-access signup only.
- Payor-app developers: simpler sending, integration surface, payment journey and execution adapters. Primary CTA: start building via API documentation. Secondary: inspect the example flow.
- Payee-app developers: recipient intent, capability registration, private provider-built instructions, inbound distribution and callback lifecycle. Primary CTA: add receiving via the integration reference.
- Users: one shareable tag, preferred asset/network/wallet, preference control and supported push notifications. Primary CTA: join early access; no premature account ceremony.
- Move the developer network explanation to both developer pages. Move the solver catalog out of the homepage to technical documentation (retain existing API/docs and Phase 1/Phase 2 boundaries). Remove example wallet/user-count directory entirely. Move Cubid identity setup explanation to user-specific process and developer boundary explanation, without adding hosted identity UI.

## Interaction thesis
1. Slow 42-second photographic pan/scale on three of six sections per page; stop for reduced motion or user pause.
2. Quiet section entrance reveals, progressively enhanced without hiding content from no-JS/reduced-motion readers.
3. Role dropdown, large destination links and deliberate CTA hover/focus movement clarify the next action.

## Early access
User selected a dedicated MyPayTag Supabase waitlist. Site POST is a same-origin server proxy to a backend-owned Edge Function; no direct site database access. Collect email, audience, locale and explicit signup consent only. Duplicate-safe insert, generic success, bounded payloads/rate control and no raw email/IP in logs. Deployment/configuration/readback are separate from local implementation evidence.

## Images
Locally vendored Unsplash photographs at 2560px, used as decorative backgrounds with semantic content in HTML. Source images (retrieved 2026-11-20):
- Home: Xavier Coiffic, https://unsplash.com/photos/rNS604XxKqw — images.unsplash.com/photo-1513414653395-3bb68df4b2b3
- Payor: https://images.unsplash.com/photo-1504203328729-b937e8e102f2 (coastline photo collection source https://unsplash.com/s/photos/coastline)
- Payee: Gontran Isnard, https://unsplash.com/photos/aTGu56zPu-w — photo-1618226695380-77a018c6fdcf
- Users: Scott Taylor, https://unsplash.com/photos/02a4DSekRVg — photo-1537402639622-3d8e35abe1ab

## Scope
Implements the user's four-pass brief under site#15/#16/#17. No deployment, production configuration, authentication ceremony, wallet interaction or payment. Content describes the target experience as requested; avoid fabricated partners, adoption or universal guarantees.
