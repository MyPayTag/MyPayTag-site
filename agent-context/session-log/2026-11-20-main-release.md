# MyPayTag site dev-to-main release

- Agent: codex:01a1b2b4-bbc6-7b90-bebd-f37fd0620f6f
- Source branch: dev; detached evidence worktree at d020d3379044c246a5e5cf67df558f642bbd35cb
- Authority: Noak explicitly requested merge dev to main on 2026-11-20.
- Release: PR13, 67 commits ahead and zero behind main. No source or translation candidate changes added. Preserve dev.
- Validation: six fresh local static guards passed (i18n, hosted actions, responsive/a11y, route privacy, browser secret, public docs). Solver guard reads stale page.tsx path; expected content present in HomePage. GitHub PR translations passed; prior exact-head Vercel preview READY.
- Vercel: project my-pay-tag-site, productionBranch main. Prior production target ERROR. Production resolver URL absent; preview dev has dedicated resolver entry. No environment changes performed.
- Follow-up: automatic Codex review, explicit-user-authorized merge after gates, production build readback. #31 real-account acceptance remains separate.

## Release review repair

Automatic review on PR13 found token rounding and selected receiving-app grouping defects, plus a preferences envelope mismatch. Backend source actually returns a bare group while OpenAPI specifies an envelope; normalized both forms with exact group scope and a safe missing-group error. Preserved raw validated decimal strings for token quote amounts and selectedPayToDapp for resolved-answer grouping. Fixed obsolete solver checker path. Added three focused behavioral regression tests covering both preference shapes/scope mismatch, precision/invalid decimals, and answer-only grouping. Node tests pass; solver guard passes. All changes go through a separate feature PR into dev, preserving dev/main PR-only history. No translation candidate or production settings included.
