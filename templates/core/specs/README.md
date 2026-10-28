# Specifications

Each feature, baseline, fix, or change gets `specs/<unix-ms>-<uuid>-<slug>/`.
The orchestrator reserves the ID; the spec author starts with `spec.md` only.
Planning adds `plan.md` and `tasks.md`; QA adds `verification.md`. Completed-spec
amendments add or append `history.md` on the affected spec.

Read `AGENTS.md` and `.ahfora/workflow.md` before creating a spec. Templates live
in `.ahfora/templates/`. Do not treat a filled template as approved work.

## Finding the right contract

Search requirements, affected modules, interfaces and `related_specs`, not only the
directory name. A bug report should identify the current intended behavior and
relevant acceptance scenario. If there is no spec, first agree on a baseline rather
than deriving intended behavior from broken code.

Current behavior remains documented in the original capability spec. A linked change
spec describes a particular change to that contract. Its closure updates affected
current contracts when behavior changes and appends their history. Existing IDs and
approved snapshots remain stable. See the maintenance skill for the full procedure.
