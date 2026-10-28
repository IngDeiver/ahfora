# Specifications

Each feature, baseline, fix, or change gets a short numbered folder such as
`specs/0001-task-manager/`, followed by `0002-<slug>/` and so on. The orchestrator
reserves the four-digit ID in `.ahfora/state/spec-ids.json` using
[the identity protocol](../.ahfora/spec-identity.md); the spec author starts with
`spec.md` only and tells the user which **SPEC 0001 — <title>** is being prepared.
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
