---
name: shared-supabase-impact-check
description: Check sibling client projects for breaking changes after Supabase database updates in this shared-template ecosystem. Use when tables, columns, types, policies, views, triggers, or functions change in the shared Supabase project and you need to verify all listed repos still work, patch only broken projects, and skip additive non-breaking changes.
---

# Shared Supabase Impact Check

This template and the sibling repos listed in `references/projects.json` share one Supabase project.
Each client site maps to one row in `public.clients`, keyed by `CLIENT_ID`.

## Load First

- `references/projects.json` for the source-of-truth project list.
- The live schema or logs through the Supabase MCP.
- Local SQL in `sql/` if the current change is defined in-repo.

## Treat As Breaking

- Deleted or renamed tables, columns, views, RPCs, triggers, or functions that code still references.
- Type changes, nullability changes, or policy changes that invalidate existing queries or auth flows.
- Behavior changes in shared logic around `public.clients`, `client_id`, `allowed_editor_ids`, or `auth.users`.

## Treat As Non-Breaking

- Additive-only fields that existing code does not read or validate exactly.
- New tables or optional data that current queries ignore.

Do not make code changes for additive schema changes unless the project actually breaks.

## Workflow

1. Identify the changed database surface precisely.
   - Prefer a concrete list of affected tables, columns, functions, policies, and triggers.
   - Ignore unrelated schema noise.
2. Load `references/projects.json`.
3. For each listed project:
   - Search with `rg` for the affected table, column, function, trigger, or policy names.
   - Inspect Supabase query code first: `src/lib/supabase`, `src/lib/auth`, `src/pages/api`, `src/components`, and any local SQL helpers.
   - Decide whether the project is actually broken.
4. Patch only the broken projects.
   - Keep fixes minimal and preserve the existing behavior.
   - Remove dead references to deleted columns.
   - Swap to replacement fields or guards when the schema changed.
   - Prefer server-side fixes for server-side breakage.
5. Validate only the projects you touched.
   - Run targeted checks first.
   - Use `yarn test` when practical.
   - Re-verify changed queries against the live Supabase schema.
6. Report:
   - which projects were checked
   - which projects were unaffected
   - which projects required fixes
   - which projects could not be checked because the path was missing or inaccessible

## Manifest Rules

- `references/projects.json` is the canonical list for this skill.
- Add a project only after confirming its `.env.local` points at the same `NEXT_PUBLIC_SUPABASE_URL` and defines `CLIENT_ID`.
- Keep absolute local paths in the manifest so sibling repos can be checked directly.
- If a listed repo is outside the current workspace, request approval before editing it.

## Useful Search Patterns

- `.from("clients")`
- `.select("`
- `.contains("allowed_editor_ids"`
- `client_id`
- `CLIENT_ID`
- specific removed or renamed column names
- specific changed RPC, trigger, or function names

## Current Shared Setup

- Shared Supabase URL and project list live in `references/projects.json`
- Shared client table: `public.clients`
- Project key env var: `CLIENT_ID`
