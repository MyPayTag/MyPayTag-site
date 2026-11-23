# Role-specific marketing pages

- agent: codex:01a1b2b4-bbc6-7b90-bebd-f37fd0620f6f
- branch: codex/marketing-role-pages-20261120
- base head: e6ff7596336e7d2d3e7758d7cbd2f2f7c54c4a71
- authority: Noak requested the four-pass marketing refactor and selected a dedicated MyPayTag Supabase waitlist.
- summary: Rebuilt homepage around shared value, role selection and email signup. Added three audience pages under one header dropdown, distinct examples/process/CTAs, English/Swedish typed copy, 2560px local photos in three alternating panels, 42s slow motion, reduced-motion handling and pause control. Preserved portal/docs navigation. Added same-origin bounded signup proxy and honest availability/errors; backend work tracked at backend#46. No secret/browser database access.
- validation: production build, typecheck, lint, i18n, solver content/public docs/route privacy/browser secret guards passed. Five signup regression tests and three existing release regressions passed. Chrome verified all four page navigation and distinct headings; homepage/payor/payee/user at 320px without horizontal overflow, receiving/user at 768px without overflow, homepage at normal1360px without overflow, mobile EN/SV switching, pause computed styles and unavailable form state. Earlier375px header99px/no overflow. Exact12-case matrix was interrupted and is not claimed. Native hosted/backend storage acceptance remains separate.
- fixes during validation: match browser Origin against public Host when Next uses an internal route URL; regression added. Prevent LastPass DOM injection in signup field through ignore attributes. Pause only background images so entry content cannot be frozen invisible.
- evidence: /Volumes/MiniBot/scratch/mypaytag-marketing-evidence-20261120/home-desktop.jpg. Local production preview http://127.0.0.1:3074/ .
- follow-ups: independent acceptance/review; backend#46 migration/function and private shared token configuration on the explicitly selected target, then hosted end-to-end signup readback under site#18. No push, merge or hosted deployment in this task. Preserve existing translation and PR branches. Waitlist currently returns503 without configuration, never fake success.

## 2026-11-23 authorized delivery
Noak requested landing/deployment and hosted signup persistence. Add separate server-only waitlist base URL so marketing publication can use the selected dedicated MyPayTag Supabase target without enabling production portal/payment resolver configuration. Existing staging resolver fallback retained. Final checks and hosted evidence follow.
