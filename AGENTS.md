<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# MyPayTag Site Agent Notes

## Repository Role

`mypaytag-site` is the public user-facing MyPayTag app/site repo. It is a GitHub fork of `Cubid-Me/cubid-starter-v3` so upstream starter updates can still be pulled when useful.

Keep private resolver implementation, Supabase schema, provider callbacks, and admin tooling out of this repo. Those belong in the private `mypaytag` repo. Public protocol contracts and SDK examples belong in `mypaytag-sdk`.

## Development Notes

This checkout still uses the Cubid starter's local `workspace:*` package setup. In this workspace, `pnpm-workspace.yaml` points back to `/Users/botmaster/src/cubid/cubid-sdk-v2/packages/*` through a relative path. Re-check that path after moving the repo or before adding portable CI.

Current-state engineering docs belong in `docs/engineering/`. Target-state plans belong in `docs/engineering/target-state/`.

## Supabase

The Supabase direct-access rule does not apply to this public site by default. Do not add production Supabase reads or writes here unless a future architecture doc explicitly changes that boundary.

## Agent Context

Use `agent-context/session-log/` as the canonical session log location. Update the current branch log before committing. Keep `agent-context/todo.md` for active follow-ups only, not completed history. Keep deferred ideas in `agent-context/future-ideas.md`.
