# AHFORA workflow — version 1

These are normative instructions for the orchestrator and roles. MUST means a
required gate; SHOULD means a default that can be changed with a recorded reason.
The installer does not enforce semantic compliance or run this workflow.

## 1. Bootstrap

Bootstrap is an internal readiness check triggered by an ordinary development
request, not a command the user must issue. Start it automatically from the loaded
project instructions, preserve the user's goal, and continue into the appropriate
phase when its gates are satisfied. Reuse confirmed settings instead of repeating
setup questions. Ask only for missing decisions, permissions and required approvals;
never require the user to activate AHFORA or name the next role.

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
7. Resolve the user's chosen model for EVERY role using `.ahfora/models.md` and
   `.ahfora/project.json`. Reuse a confirmed explicit/session selection; if it is
   unknown, ask before invoking the subagent. Configure native per-role routing
   and confirm the effective model. Planner uses a user-confirmed `high-reasoning`
   choice within the user's limits; the other roles use `user-selected` by default.
   These may all be the same model. Profile labels are not provider IDs. Missing or
   unavailable routing requires an informed user decision, never a guessed fallback.

## 2. Identity and artifact ownership

- Spec ID: a four-digit string, `0001`, `0002`, and so on through `9999`;
  directory: `specs/0001-task-manager/`. Never use a timestamp or UUID as a new spec ID.
- Follow `.ahfora/spec-identity.md`: coordinate through the shared
  `.ahfora/state/spec-ids.json` ledger, reserve the next number exclusively, never
  reuse an issued number, and stop on exhaustion or an unresolved collision.
- The orchestrator reserves the ID, creates its lifecycle record from
  `.ahfora/templates/spec-state.json`, and announces **SPEC 0001 — <title>**, its
  destination path and phase before delegation. The spec author writes only `spec.md`.
- Before the first clarification question, the spec author identifies the same spec
  to the user. Include its ID/title in later question batches and approval requests.
  If subagent messages are not visible, return `user_message` and have the main
  orchestrator relay it; an internal handoff alone does not inform the user.
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

Planner decision dialogue follows `.ahfora/planning-dialogue.md`. Blocking choices
are asked before dependent design; independent confirmations can be grouped at the
end of a draft. Direct questions are used only when the client supports them. Otherwise
the planner returns `needs-input`; the main agent faithfully presents its questions,
waits, and resumes the same responsible planner with the user's answers. It must not
answer in the user's place. Pending required decisions prevent `ready` and plan approval.

Only the main orchestrator delegates roles. Native subagents do not invoke each
other. Use the role responsible for the work: spec-author for specs, planner for
design/task definitions, developer for implementation/production fixes, qa-engineer
for test design, test work and independent verification. Developer may run its
assigned checks; that does not replace QA's review. Role assignments are explicit
in the approved tasks. The main agent owns coordination, ID allocation, shared state,
user communication and gate assessment, not silent substitution for a specialist.

### Required-role failure protocol

1. Before delegation, check that the responsible native role is registered and has
   the needed tools, artifact scope and confirmed model when required. If available,
   invoke it with a concrete handoff. Do not choose the main agent merely because
   the task seems small or the native invocation would be less convenient.
2. If it cannot run or returns a capability failure, keep the work incomplete and
   tell the user which **SPEC**, role and action are blocked, with the actual error
   or known missing capability. A failed write is not a successfully created artifact.
3. Offer concrete alternatives appropriate to the observed failure, for example:
   - Reload/restart a client whose installed native role has not been discovered.
   - With permission, correct the role's scoped configuration, tools or model routing,
     then retry that SAME role after verifying the fix.
   - Use another available client or confirmed suitable model with the same role
     contract and write boundary, subject to user approval and project constraints.
   - If a specialist can produce a draft but cannot persist it, ask permission for
     the orchestrator to save the exact returned content and record that split.
   - If native delegation is genuinely unsupported, offer **sequential role mode**
     with its lack of isolated reviewer context clearly stated.
4. State the recommended option and tradeoff, then wait for the user's choice before
   switching executor/mode or modifying permissions. Do not ask the user to bypass
   system/organization restrictions. If no alternative satisfies the required gates,
   remain blocked and explain what is needed. Approval is not proof of capability.
5. Record required role, attempted execution, error, alternatives, user decision,
   scope, actual executor/mode and remaining limitations in the handoff/shared state.
   A prior explicit fallback approval can be reused only if this failure and scope
   are covered; tell the user it is being reused. Never infer approval from silence.
6. Retry only after a specific permitted correction or a genuinely transient failure;
   avoid blind loops. If the targeted retry fails, return to the user with the new
   evidence. The separate QA correction budget does not authorize silent role swaps.

In approved sequential mode, load each canonical role contract before its work and
retain all gates. Generic installation does not imply that a separate subagent ran.
Likewise, saving a specialist's text through the orchestrator must not be presented
as a native write. After restoring capability, return to the responsible native role.

Before parallel execution, assign each task an owner, dependencies and write scope.
One writer owns a spec's shared state and task table at a time. Parallelize disjoint
files; for overlapping work, serialize or agree on worktrees and an integration
owner. On concurrent edits, re-read and reconcile; never overwrite another agent's
work. An existing claim is not abandoned merely because a new session starts. Ask
before takeover. ID allocation uses the shared reservation authority; separate local
locks cannot prevent two independent branches from choosing the same short number.

## 6. Developer / QA correction loop

1. QA derives tests from approved requirements, including success, failure, boundary
   and relevant non-functional scenarios. Record the planned methods during planning.
2. Developer implements assigned tasks and runs applicable confirmed checks.
3. QA independently reviews the mapping and runs checks against the integrated code.
4. For each implementation failure, QA returns `next_role: developer` with finding
   IDs, reproduction, expected/actual, affected requirements/tasks, allowed correction
   scope, environment and evidence. The orchestrator automatically invokes the
   responsible developer for in-scope corrections using the user's selected model;
   a new approval is needed only for a changed scope, capability fallback or budget.
   After developer returns, the orchestrator MUST invoke QA again on the integrated
   code. QA owns re-verification; a developer's self-report cannot close its finding.
5. Track the same underlying failure across rounds. Default budget: three developer
   correction rounds, each followed by re-verification. Do not reset the counter by
   renaming the issue. Stop earlier for missing decisions, unsafe scope or no progress.
6. After the budget, mark blocked and ask the user with diagnosis and alternatives.
   An extension must be explicit and bounded. Never loop indefinitely.

Repeat this QA → developer → QA loop until every required check passes, or leave
the work explicitly blocked for the user's decision. A loop limit, skipped check or
missing capability never turns a failure into success. Final user acceptance follows
only after QA's evidence satisfies the completion gate. QA initiates the correction
request; the main orchestrator performs cross-role invocation for client portability.

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
