# Handoff <uuid>

## Assignment — written by orchestrator

- Spec ID (four-digit string), title, directory and revision: TODO
- User-visible announcement: SPEC <four-digit-id> — <title>; destination and phase
- Phase and requested role: TODO
- Native adapter or sequential role mode: TODO
- Required role and capability/model checks: TODO
- Fallback authorization reference and scope, if any: none
- Approved spec/plan/task references: TODO
- Assigned tasks, dependencies and write scope: TODO
- Owner, shared-artifact writer and integration owner: TODO
- Relevant constitution decisions and confirmed commands: TODO
- Confirmed application source roots and Application layout decision reference: TODO
- Required skill paths: TODO
- Relevant memory observations / concise context: TODO
- Requested user-selected model and profile (required for every role): TODO
- Native model configuration / effective-routing evidence: TODO
- Code baseline and expected result: TODO
- Open questions / blockers / correction-round budget: TODO or none
- Planner question channel: direct if actually available, otherwise via orchestrator
- Planner continuation reference, if supported: TODO or unavailable

## Result — written by role

- Status: ready | needs-input | blocked | failed
- user_message: <message for the user with SPEC <four-digit-id>, title and current
  phase; include the exact path when starting, resuming or requesting approval>
- Changed artifacts and revisions: TODO
- Covered requirement/scenario/task IDs: TODO
- Evidence and actual checks: TODO
- Findings, limitations and questions for user: TODO or none
- Planner decision questions: decision ID, SPEC/title, ask-now or end-of-draft,
  concrete question, options/tradeoffs, recommendation and dependent sections/tasks
- User answers for planner continuation: actual answers/delegations with references,
  or pending; never fill these on behalf of the user
- Learning for Engram: TODO or none
- Suggested next action / role request: TODO
- next_role: developer | qa-engineer | planner | spec-author | none
- Correction request (when QA requests developer): stable finding IDs, expected vs
  actual, reproduction, requirements/tasks, allowed write scope and checks to rerun

An in-scope QA request with `next_role: developer` is routed by the orchestrator to
developer, then back to QA for re-verification; it does not permit nested delegation
or bypass model, approval, capability or correction-budget gates.

## Capability failure and alternative — when applicable

- Responsible role and attempted action: TODO
- Actual missing capability / error: TODO
- Artifacts actually persisted versus returned only as text: TODO
- User-visible explanation identifying the spec: TODO
- Viable alternatives and tradeoffs: TODO
- User's decision / existing explicit authorization reference: pending
- Approved scope and actual executor/mode: pending
- Remaining limitations and condition for returning to the native role: TODO

If not applicable, record N/A. Do not populate a successful fallback decision without
an actual user choice. The orchestrator relays the explanation and waits before
switching modes or writing on behalf of a role whose write was denied.

A result is not user approval. Subagents return delegation requests to the main
orchestrator rather than spawning other roles. Planner questions use the verified
direct or mediated channel from the planning-dialogue protocol.
The orchestrator relays `user_message` when direct questioning is unavailable and
waits for the user's actual answers before resuming the same responsible planner.
Recording questions only in this handoff does not satisfy user-visible progress.
