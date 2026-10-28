---
name: ahfora-requirements
description: "Authors unambiguous, testable requirements using user stories, EARS obligations and acceptance scenarios. Use when drafting or reviewing a specification or changing an existing behavior contract."
license: MIT
metadata:
  author: Deiver
  version: "1.0.0"
---

# Requirement authoring

## Critical patterns

- User stories explain value; requirements define obligations; scenarios demonstrate
  observable acceptance. One cannot replace the others.
- Separate current observations from intended behavior. Ask about missing rules.
- Before questions, identify **SPEC 0001 — <title>**, its destination path and phase
  using the orchestrator's reserved ID. Repeat ID/title in question batches and at
  review. Return `user_message` for the orchestrator to relay when subagent output
  is hidden. Never guess an ID or leave the active spec unidentified to the user.
- Assign stable FR/NFR/AC IDs and connect every requirement to verification.
- Ask focused questions and STOP for their answers. Record only explicitly approved
  assumptions. Avoid choosing an implementation in the behavior contract.

## Procedure

1. Identify the problem, actors, terminology, constraints and outcomes.
2. Establish in/out scope, dependencies and relevant existing contracts.
3. Describe user value with concise stories; infrastructure requirements may identify
   maintainers/operators as actors instead of inventing an end-user story.
4. Use the appropriate [EARS pattern](references/ears.md) for each obligation.
5. Turn subjective NFRs into measurable outcomes with a workload and method. If the
   user cannot choose a threshold, mark the decision unresolved rather than inventing it.
6. Write Given/When/Then scenarios for success, failure and relevant boundaries.
   Include expected errors, state preservation, side effects and recovery where needed.
7. Check [quality criteria](references/quality.md), traceability and contradictions.
8. Fill the [spec template](../../../.ahfora/templates/spec.md) and return for approval.

## Example

Story: As a maintainer, I want an existing instruction file preserved so that adopting
the framework does not erase my project rules.

FR-001: When initializing a project containing user-authored instructions, the
installer shall preserve those instructions.

AC-001: Given a project with existing instructions, when initialization finishes,
then the original user-authored content is still present and the framework entry
point can be found.

AC-002: Given an incompatible path at the intended destination, when initialization
is requested, then the installer reports the conflict and does not overwrite it.

Keep examples separate from actual requirements; do not import them automatically.

## Commands

Use file-reading/search tools to inspect actual contracts and code. No application
command is prescribed. Verification commands are agreed during planning.

## Resources

- [EARS patterns](references/ears.md)
- [Requirement review](references/quality.md)
- [Spec template](../../../.ahfora/templates/spec.md)
- [Short spec identity and allocation](../../../.ahfora/spec-identity.md)
