---
name: ahfora-verification
description: "Designs and records meaningful requirement-driven testing and acceptance evidence. Use during planning, QA, regression analysis, correction loops and final acceptance checks."
license: MIT
metadata:
  author: Deiver
  version: "1.0.0"
---

# Verification strategy and evidence

## Critical patterns

Derive expected results from the spec, not the implementation. Every in-scope
requirement needs a method and evidence. A green test suite can still miss a
requirement. A not-run or skipped required check is a blocker, never a pass.

## Select the right level

| Method | Proves | Typical use |
| --- | --- | --- |
| Unit | Local policy/algorithm behavior in controlled conditions | Business rules, parsing, boundaries |
| Integration | Real collaboration across a boundary | Persistence, filesystem, protocol adapters |
| E2E | A user/system journey through an integrated application | Critical cross-component flows, when user-approved |
| Measurement | A non-functional threshold in a specified environment | Performance, resource usage, reliability targets |
| Manual review | Criteria defined in an approved rubric | Usability, visual/accessibility checks not adequately automated |

Choose coverage by risk and requirements, not a fixed percentage. Avoid redundant
implementation-mirroring tests. Ask about E2E per spec during planning and record
the answer and tradeoffs. Tools/frameworks come from the project, not AHFORA.

## Procedure

1. Build requirement → scenario → task → implementation → evidence mapping.
2. Include relevant happy paths, invalid/boundary input, authorization, dependency
   failures, recovery and concurrency. Explain inapplicable categories.
3. Agree on commands, environment, test data and cleanup. Ask before adding new
   dependencies or executing unapproved external/costly tests.
4. Run actual checks on the integrated revision, recording command, directory,
   environment, exit result and concise sanitized evidence.
5. Report stable finding IDs with reproduction, expected/actual and severity.
   Request `next_role: developer` through the orchestrator for implementation fixes,
   with reproduction, allowed scope and checks to rerun. After each developer result,
   the orchestrator invokes QA again. Reverify each correction on integrated code;
   continue until required checks pass or a real blocker requires the user's decision.
6. Follow the [correction budget](../../../.ahfora/workflow.md): three rounds for the
   same underlying failure by default, then stop and ask for a bounded next step.
7. Recheck affected acceptance and regression criteria after changes. Invalidate
   evidence for code changed after verification.
8. Fill the [verification report](../../../.ahfora/templates/verification.md), disclose
   remaining limitations and request final acceptance only when all gates are met.

## Commands

Execute only the commands/procedures confirmed in the constitution and plan. Missing
tools or environments are recorded as blockers. Never claim platform coverage from
source inspection alone or fabricate test output.

## Resources

- [QA role](../../../.ahfora/agents/qa-engineer.md)
- [Verification template](../../../.ahfora/templates/verification.md)
