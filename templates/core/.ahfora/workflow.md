# AHFORA workflow — version 1

These are normative instructions for the orchestrator and roles. MUST means a
required gate; SHOULD means a default that can be changed with a recorded reason.
The installer does not enforce semantic compliance or run this workflow.

## 1. Bootstrap

1. Read `AGENTS.md`, the constitution, project configuration, and Engram protocol.
2. Verify Engram tools in the current session. Missing access blocks all SDD work;
   installation/configuration is permitted only after explicit user authorization.
3. Detect native subagents, skills, model selection and available execution tools.
   Record native or sequential-role operation. Never pretend delegation occurred.
4. For an existing codebase, inspect entry points, modules, tests, dependencies and
   conventions. Present observed behavior separately from intended behavior. Ask
   what must be retained; a baseline spec does not legitimize an observed defect.
5. Ask the owner about purpose, scale, constraints and architecture. Offer practical
   alternatives with complexity, maintenance and operational tradeoffs. Record the
   approved choice in the constitution and Engram. Simplicity is a valid choice.
6. Confirm verification commands and testing environments. Do not invent commands
   from the framework. Unknown commands stay unresolved until confirmed.
7. Ask the user to map `high-reasoning` to the most capable available model within
   their budget. Save the exact client/model mapping in `.ahfora/project.json` and
   the decision in the constitution. This JSON is a convention, not client config.
   Configure the client's native planner model/routing only with permission.
   Before every planning delegation confirm the effective model. If unavailable or
   unobservable, ask for an explicitly acknowledged fallback or stop. Do not guess
   model IDs or silently inherit a weaker model.

## 2. Identity and artifact ownership

- Spec ID: `<unix-milliseconds>-<uuid-v4>`; directory: `specs/<id>-<slug>/`.
- Obtain actual time and cryptographic UUID from a system tool, not model prose.
  Since the installer needs Node.js, one portable example is:
  `node -e "console.log(Date.now() + '-' + require('node:crypto').randomUUID())"`.
  Use a lowercase short slug. If no suitable tool is available, ask for an ID.
- Verify absence and create/reserve the directory exclusively before delegation.
  On collision, generate a new ID and retry. Timestamps are ordering hints, not a
  distributed global clock. Never renumber an existing spec after merging branches.
- The orchestrator reserves the ID and creates its lifecycle record from
  `.ahfora/templates/spec-state.json`; the spec author writes only `spec.md`.
- The planner creates `plan.md` and `tasks.md` after spec approval. QA creates
  `verification.md` when verification work begins. No empty artifacts imply approval.
- The orchestrator owns lifecycle and approval records. Task owners update their
  task progress in `tasks.md`; QA owns its evidence. History is appended at closure.
- Local IDs are `FR-001`, `NFR-001`, `AC-001`, `T-001`, `V-001`; cross-spec references
  include the full spec ID. Deleted IDs are retired, never reassigned.

## 3. Lifecycle and transition gates

Canonical phase is `.ahfora/state/specs/<id>.json`. Read its `revision` before an
update and increase it when writing. Coordinate updates; it is not an automatic
distributed lock. `tasks.md` remains the sole source of task progress.

| From | To | Required evidence / permission |
| --- | --- | --- |
| none | `specifying` | Bootstrap complete, unique ID reserved, scope owner known |
| `specifying` | `awaiting-spec-approval` | Complete spec, no blocking ambiguity, requirement/scenario mapping |
| `awaiting-spec-approval` | `planning` | Explicit user approval of this spec revision |
| `planning` | `awaiting-plan-approval` | Confirmed model, architecture, complete plan/tasks and E2E decision |
| `awaiting-plan-approval` | `implementing` | Explicit user approval of this plan and task-definition revision |
| `implementing` | `verifying` | Scoped implementation plus testable task evidence; no hidden scope changes |
| `verifying` | `implementing` | Reproducible failures routed to developer within correction budget |
| `verifying` | `awaiting-acceptance` | Required criteria satisfied, evidence current, traceability complete |
| `awaiting-acceptance` | `completed` | Explicit user acceptance; shared state, memory and history reconciled |

Any active phase can become `blocked` with a reason and `resumePhase`; resume only
after the blocker is resolved and prerequisite approvals still hold. A user may
cancel work; record `cancelled`, completed portions and remaining effects. Never
silently delete partial implementation. Rejected approvals return to the relevant
authoring phase. A completed spec remains completed as a historical work item;
subsequent work gets a linked change/fix spec. Its current contract can still evolve.

Parallel QA test design can start during implementation against approved criteria.
Final verification must run against the integrated result. Do not verify an earlier
worktree and treat that evidence as proof for later merged code.

## 4. Approval records and revisions

Use `.ahfora/templates/approval.md` under
`.ahfora/state/approvals/<spec-id>/<approval-uuid>/approval.md`. Preserve copies of
the approved spec/plan/task documents in that directory. Record the real user
instruction, UTC timestamp, artifact revisions and SHA-256 digests of those copies.
Obtain digests using tools. Never ask a model to invent a hash or approval.

The user can approve by conversation; the orchestrator records that approval, not a
fabricated signature. A request to draft or implement is not automatically approval
of a document that the user has not seen. Present the artifacts and material changes.

- Requirement changes increment the spec revision and invalidate affected design,
  task approval, and verification. Return to spec approval.
- Design/task-definition changes increment the relevant revisions and require plan
  approval before affected implementation continues.
- Task progress, evidence links, and execution notes can change without reapproving
  unchanged task definitions. Compare against the stored approved snapshot; a change
  in task scope, acceptance, dependencies or ownership boundaries is not just progress.
- A material constitution/model-policy change triggers an impact review.
- Final acceptance identifies the verified code revision or a file/digest inventory
  if Git is unavailable. Later code changes invalidate affected evidence.

## 5. Delegation and concurrency

Use the handoff template with paths and concise relevant context. Required result
statuses are `ready`, `needs-input`, `blocked`, or `failed`, with artifacts changed,
requirements/tasks covered, evidence, unresolved questions and suggested next action.
These are handoff statuses, not lifecycle phases. A role cannot self-approve a gate.

Only the main orchestrator delegates roles. Native subagents do not invoke each
other. In sequential mode, explicitly change contracts between phases and disclose
the lack of isolated review. Preserve the QA boundary even when one model plays both.

Before parallel execution, assign each task an owner, dependencies and write scope.
One writer owns a spec's shared state and task table at a time. Parallelize disjoint
files; for overlapping work, serialize or agree on worktrees and an integration
owner. On concurrent edits, re-read and reconcile; never overwrite another agent's
work. An existing claim is not abandoned merely because a new session starts. Ask
before takeover. Timestamp+UUID avoids ID coordination, not edit conflicts.

## 6. Developer / QA correction loop

1. QA derives tests from approved requirements, including success, failure, boundary
   and relevant non-functional scenarios. Record the planned methods during planning.
2. Developer implements assigned tasks and runs applicable confirmed checks.
3. QA independently reviews the mapping and runs checks against the integrated code.
4. For each failure, return reproduction, expected/actual, affected IDs, severity,
   environment and evidence to the orchestrator; route production fixes to developer.
5. Track the same underlying failure across rounds. Default budget: three developer
   correction rounds, each followed by re-verification. Do not reset the counter by
   renaming the issue. Stop earlier for missing decisions, unsafe scope or no progress.
6. After the budget, mark blocked and ask the user with diagnosis and alternatives.
   An extension must be explicit and bounded. Never loop indefinitely.

QA may correct a demonstrably erroneous test with a recorded explanation and must
rerun it. A failing implementation is not evidence that the expected result is wrong.
Missing environments and skipped tests are recorded as `not-run`, not `pass`.

## 7. Completion gate

Before requesting final acceptance, verify all of these:

- Current spec and design match the intended implemented behavior.
- Every in-scope FR/NFR has acceptance criteria and verification evidence, including
  applicable failure cases. Measurable NFRs were actually measured as specified.
- Every task is done with evidence, or removed by an approved scope revision.
- Required checks passed on the integrated revision. A pending, failed, or not-run
  required check blocks acceptance. Manual evidence is allowed only if the approved
  plan specifies it. Test exclusions cannot waive unsatisfied requirements.
- No unresolved drift, blocking findings, ownership conflicts, or TODO decisions.
- `verification.md` records commands, environment, results and limitations honestly.
- For change specs, affected current contracts and appended histories are reconciled
  as described in the maintenance skill. If applying the final contract delta changes
  behavior beyond what was approved, return to specification rather than closing.
- Record final acceptance, lifecycle state, pending next work, and an Engram summary.

## 8. Resume and improve

At session end or interruption, write a local checkpoint with active spec, phase,
last completed task, pending/blocked work and next action. Persist authoritative
changes to the shared files first, then save a concise Engram summary. If memory
becomes unavailable, preserve the checkpoint, mark blocked and restore Engram before
continuing. Do not lose work by repeatedly retrying a failing service.

Only propose harness changes through `ahfora-improvement`. The proposal must name
the observed failure, exact local changes, expected benefit, risks, validation and
rollback. User authorization precedes any change to rules, skills or adapters.
