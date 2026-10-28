# Planner decision dialogue

The planner owns the technical decision conversation with the user. Planning is not
a one-way document dump: present real choices, explain their consequences, ask and
wait. Keep **Planner · SPEC 0001 — <title>** visible and use the user's language.

## Decide when to ask

| Decision | Timing | Behavior |
| --- | --- | --- |
| Changes architecture, stack, data ownership, public contracts, migration, permissions, material cost or dependent tasks | Ask now | Present options before committing the dependent design; stop for the answer |
| Independent, low-impact preference or confirmation that does not determine other design choices | Group at end of draft | Explore only independent work, leave the choice visibly pending, then ask the grouped questions and stop |
| Already answered in the current approved spec, constitution or relevant decision record | Reuse | Cite the decision; do not ask again unless requirements changed or evidence conflicts |
| Choice explicitly delegated to the planner within defined limits | Decide within those limits | Record the delegation and rationale; ask if the choice exceeds the granted scope |

If unsure whether a choice affects other work, treat it as blocking and ask now.
Do not defer an architectural choice until after designing around an unapproved
assumption. A recommendation is not an answer. "At the end" means the end of a
planning draft, before readiness/approval and before implementation.

## Question format

Give each needed decision a stable local ID such as `D-001`, scoped to the spec:

- SPEC ID/title and decision ID.
- The concrete question and why the answer matters.
- Viable options with relevant tradeoffs, costs/estimates and constraints.
- A clearly labeled recommendation and its reasoning, not a preselected answer.
- Which plan sections/tasks depend on it and whether it is blocking or deferred.

Keep questions focused; group related independent questions when helpful. Allow the
user to propose another option. Never invent alternatives merely to fill a menu.
Once any question has been presented, STOP and wait; do not continue design or
writing while treating the recommendation, silence or an unrelated answer as consent.

## Direct or mediated delivery

1. If the running subagent exposes a supported user-question tool and the user can
   actually receive/respond through it, ask directly and wait for its answer.
2. If direct interaction is unavailable, return `needs-input` with `user_message`,
   the structured decision questions and a resume reference when the client exposes
   one. Stop the planner's work; do not launch another role to answer for the user.
3. The main orchestrator shows those planner questions faithfully, retaining the
   SPEC/decision IDs, options, recommendation and impact. It must not answer them
   itself, hide them in tool output or replace the planner's decision with its own.
4. The orchestrator waits for the user, records the actual answers, then resumes the
   SAME responsible planner with those answers and the current artifacts. Reuse its
   child-session/task reference when supported; otherwise invoke the same native
   role with a complete continuation handoff. Model and permission gates still apply.

Mediation is delivery of the planner's questions, not sequential replacement of its
design responsibility. Do not demand an extra fallback approval merely to relay a
question. Do not use shell prompts or unsupported tools to bypass client limits.

## Record and close decisions

Keep a decision table in `plan.md`: ID, question, timing, options/recommendation,
status (`pending`, `answered`, `delegated`), actual answer/delegation and reference,
and affected plan/tasks. Preserve this context when returning `needs-input`.
After an answer, update affected design/tasks and explain material consequences.
Ambiguous answers require clarification; changed product behavior returns to the
specification gate rather than being hidden inside technical design.

Before returning `ready`, resolve every decision necessary for this plan, including
deferred confirmations, or record the user's explicit bounded delegation. If no new
decision is needed, say so and summarize the confirmed choices instead of inventing
questions. Present remaining questions explicitly at the end of a draft; do not
hide them in TODOs and call the plan finished. Final plan/task approval remains an
explicit user decision recorded by the orchestrator; answering one technical question
does not automatically approve the entire plan.
