---
spec_id: "<id>"
spec_revision: 1
plan_revision: 1
revision: 1
---

# Tasks — <title>

Task definitions are approved with the plan. Scope/dependency/acceptance changes
require a revision and reapproval. Progress and evidence updates do not authorize
new scope. The orchestrator compares definitions against the approved snapshot.

## Task definitions

### T-001 — <small, verifiable outcome>

- Role and assigned owner: TODO
- Requirements / scenarios: FR-001 / AC-001, AC-002
- Depends on: none, or task IDs
- Write scope (files/modules): TODO
- Work: TODO
- Acceptance: TODO (observable outcome)
- Verification obligation: TODO
- Parallelization: disjoint with TODO, or serialized because TODO

### T-002 — Verify <outcome>

- Role and assigned owner: qa-engineer / TODO
- Requirements / scenarios: TODO
- Depends on: T-001
- Write scope: TODO (tests and verification report)
- Work: TODO
- Acceptance: all required scenarios checked on integrated code
- Verification obligation: actual commands/results and traceability
- Parallelization: test design may overlap only in disjoint files

Add necessary tasks, including final contract/history reconciliation for changes.
Never mark example tasks complete or treat this template as an approved plan.

## Progress — canonical task status

Allowed states: `pending`, `in-progress`, `blocked`, `done`, `cancelled`.
Only the designated shared-artifact writer updates this table during parallel work.
`done` requires the task's acceptance and evidence, not just edited files.

| Task | State | Current owner | Evidence / blocker | Updated at (UTC) |
| --- | --- | --- | --- | --- |
| T-001 | pending | TODO | Not started | TODO |
| T-002 | pending | TODO | Not started | TODO |

## Execution notes

Record handoffs, owner changes, unexpected findings and approved cancellations.
Unfinished in-scope tasks prevent completion. Cancelled scope must link its approval.
