---
name: ahfora-maintenance
description: "Maintains traceability between current contracts and code using linked fix/change specs and append-only history. Use for bugs, discovered drift, or changes to completed specifications."
license: MIT
metadata:
  author: Deiver
  version: "1.0.0"
---

# Contract maintenance and change history

## Critical patterns

The original capability spec expresses the current intended contract. A fix/change
spec documents a particular transition. Preserve IDs and approved snapshots. Never
change a requirement just to rationalize a code defect or weaken a failing test.

## Classify before changing

| Observation | Action |
| --- | --- |
| Code violates an approved requirement | Linked fix spec, reproduction and regression test; repair code |
| User wants different behavior | Linked change spec, approve new behavior, update affected current contracts at closure |
| Spec wording is ambiguous or wrong | Ask the owner; propose a documented clarification with impact review |
| Existing code has no approved spec | Create an agreed baseline before assuming observed behavior is correct |
| Manual code edit bypassed the workflow | Record drift, inspect the diff and ask whether to restore intended behavior or approve a change |

## Procedure

1. Reproduce/inspect the issue and locate affected specs by requirement, interface
   and paths. Read histories, related changes and relevant Engram observations.
2. Identify expected versus actual behavior and affected downstream contracts.
3. Reserve the next four-digit fix/change spec ID through the shared ledger and
   [identity protocol](../../../.ahfora/spec-identity.md). Reference original spec/revision and
   affected requirement/scenario IDs; state the intended delta and regression scope.
4. Follow the normal spec and plan approvals. Add implementation, verification and
   contract/history reconciliation tasks. Do not silently reopen completed work.
5. During implementation mark the delta as active and the work as incomplete. The
   approved change spec governs that work; it does not retroactively alter the old
   approval. Code and documentation can temporarily differ only as tracked work.
6. Verify the integrated result against the approved delta and unaffected original
   behavior. Review dependent specs and compatibility obligations.
7. Before final acceptance, the orchestrator coordinates a contract amendment with
   spec-author if intended behavior changed: update the original current `spec.md`,
   increment its revision and preserve the prior approved snapshot. Apply only the
   already-approved delta. A new substantive choice requires another approval.
8. Append the affected spec's [history](../../../.ahfora/templates/history.md), naming
   who (known responsible human and executor separately), when (tool-obtained UTC),
   what, why, related change and verification. A code-only fix can record contract
   revision unchanged. Keep prior entries; never rewrite history to hide a mistake.
9. Record final acceptance, complete the change spec, reconcile state and save the
   root cause/decision to Engram. The original work item stays historically completed;
   its current contract now reflects the accepted evolution.

Original plan/tasks remain execution history; do not rewrite them to pretend the
new implementation was the old plan. The history entry and change spec identify the
new design/tasks. Current requirements remain in the capability's `spec.md`.

## Commands

Use approved reproduction and regression commands. A diff is evidence of a change,
not proof of intended behavior. Ask when reproduction or the acceptance contract is
unknown. Do not automatically revert unrelated user work.

## Resources

- [History template](../../../.ahfora/templates/history.md)
- [Workflow gates](../../../.ahfora/workflow.md)
