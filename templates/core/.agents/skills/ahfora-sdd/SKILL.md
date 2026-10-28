---
name: ahfora-sdd
description: "Orchestrates AHFORA's spec-driven lifecycle with explicit gates, handoffs and resumable state. Use during bootstrap, specification transitions, planning, implementation, verification, closure or session recovery."
license: MIT
metadata:
  author: Deiver
  version: "1.0.0"
---

# AHFORA Spec-Driven Development

## Critical rules

Read the [canonical workflow](../../../.ahfora/workflow.md) and follow its transition
table; this skill does not define a competing state machine. Check Engram before
starting. Use actual artifacts and recorded approvals, not conversational confidence,
to determine the next phase. A completed checklist alone is not proof of behavior.

Determinism here means explicit inputs, outputs, transitions and evidence. It does
not mean identical model responses or an automatic proof that code matches prose.

## Procedure

1. Resolve project context and active spec from [shared state](../../../.ahfora/state/README.md).
   If ambiguous, ask and stop. Recover relevant Engram observations and inspect current
   artifact revisions, code baseline, task ownership and outstanding questions.
2. Check the current phase's preconditions. Missing Engram, approvals, model routing,
   required inputs or verification environment is a blocker, not a reason to skip.
3. Select exactly the next responsible role. Provide the
   [handoff contract](../../../.ahfora/templates/handoff.md), references and explicit
   write scope. Use native delegation when supported; otherwise declare sequential
   role mode and load the same canonical contract.
4. Assess the result's evidence against the exit criteria. `ready` means ready for
   the next gate, not approved. `needs-input` means ask the user and wait.
5. Record user decisions with [approval records](../../../.ahfora/templates/approval.md)
   and reviewed snapshots. Changed requirements/design invalidate affected downstream
   approvals and evidence; routine progress does not authorize changed task definitions.
6. Update canonical state and task progress through the designated writer, then save
   relevant learning to Engram. On interruption, preserve a checkpoint with the exact
   next action and blockers. Do not load every spec into context to resume one change.
7. Apply the workflow completion gate and ask for final acceptance. For changes,
   reconcile current contracts/history before closure. Never mark skipped checks passed.

## Proportionality

Small work can have a short spec and plan, but the same clarity and approval rules.
Use N/A with reasons rather than manufacturing requirements or layers. A bug gets a
linked fix spec; a newly discovered improvement gets a separate proposal when outside
scope. Do not turn a typo fix into a new architecture.

## Commands

No universal application command exists. Read the project's constitution for approved
commands. AHFORA installs instructions; AI clients perform the workflow with their
own tools. Ask when a required command or capability is missing.

## Resources

- [Workflow and gates](../../../.ahfora/workflow.md)
- [Engram protocol](../../../.ahfora/engram.md)
- [Source references and design rationale](../../../.ahfora/references.md)
