---
spec_id: "<four-digit-id>"
spec_revision: 1
revision: 1
planner_model: "<confirmed effective model or explicitly approved fallback>"
model_confirmation: "<source and user decision reference>"
---

# Plan — SPEC <four-digit-id> — <title>

## Inputs and gates

- Approved spec snapshot/reference: TODO
- Constitution and architecture decision: TODO
- Existing code baseline and relevant observations: TODO
- Remaining blockers: none, or STOP with questions

## Alternatives and decision

| Option | Benefits | Costs / complexity | Risks | Decision and reason |
| --- | --- | --- | --- | --- |
| Simplest viable approach | TODO | TODO | TODO | TODO |
| Relevant alternative | TODO | TODO | TODO | TODO |

For prices/platform behavior, include source, date and assumptions. Distinguish
estimates from measured values. Ask the user about material tradeoffs.

## Decisions and user questions

Follow `.ahfora/planning-dialogue.md`. Ask dependent/high-impact choices immediately;
group independent confirmations at the end of the draft. Once asked, stop and wait.
Reuse approved answers; do not mark a recommendation as the user's choice.

| ID | Question / choice | Timing | Options and recommendation | Status | Actual answer / delegation and reference | Affected sections/tasks |
| --- | --- | --- | --- | --- | --- | --- |
| D-001 | TODO | ask-now or end-of-draft | TODO | pending | Awaiting user | TODO |

Statuses: `pending`, `answered`, `delegated` (explicit user-granted scope only).
If no new decisions are needed, state that and reference the confirmed choices.
Unresolved required decisions, including final confirmations, block readiness.

## Architecture and responsibilities

Describe selected style, boundaries, dependency directions and responsibilities.
Explain proportional use of SOLID and why proposed abstractions are warranted.

## Interfaces, data and behavior

- Interfaces and contracts: TODO
- Data flow and state changes: TODO
- Persistence/migrations and compatibility: TODO or N/A with reason
- Errors, recovery and observability: TODO
- Relevant security/privacy/accessibility constraints: TODO or N/A
- Dependencies and integration points: TODO

## Verification design

| Requirement / scenario | Test level / method | Environment / data | Expected evidence |
| --- | --- | --- | --- |
| FR-001 / AC-001 | TODO | TODO | TODO |

- E2E decision: **pending user answer** (record yes/no, reason and approval reference)
- Approved commands and working directories: TODO (reference constitution)
- Non-functional measurement plan: TODO or N/A
- Regression scope and exclusions: TODO with rationale
- Required versus optional checks: TODO

## Execution and ownership

- Task graph and ordering: see `tasks.md`
- Disjoint parallel work and serialized boundaries: TODO
- Integration owner and shared-artifact writer: TODO
- Required environments, costs and permissions: TODO
- Risks, mitigations and recovery/rollback approach: TODO

## Design readiness

- [ ] Architecture and effective planning model are confirmed.
- [ ] Spec coverage, alternatives and key decisions are explicit.
- [ ] Tasks have verifiable outcomes and file ownership.
- [ ] E2E decision and feasible test environments are recorded.
- [ ] No blocking ambiguity; plan/tasks are ready for user approval.
- [ ] Required user decisions, including deferred questions, are answered or explicitly delegated.
