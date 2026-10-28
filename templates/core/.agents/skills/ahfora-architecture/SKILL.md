---
name: ahfora-architecture
description: "Selects and records proportionate architecture, boundaries and design tradeoffs. Use during first project planning, technical design, or an explicitly proposed architecture change."
license: MIT
metadata:
  author: Deiver
  version: "1.0.0"
---

# Architecture and planning

## Critical patterns

Architecture organizes responsibilities and change boundaries. SDD organizes the
development workflow. SOLID guides design decisions. Do not conflate them.

Ask for the first architecture choice, explain tradeoffs, and preserve the decision
in the constitution and Engram. Existing conventions are evidence; evaluate them
before proposing replacement. Choose the least complexity that meets the requirements.

## Procedure

1. Read the approved spec, current code, constitution and relevant memory.
2. Identify drivers: domain complexity, team size, integration boundaries, change
   frequency, runtime constraints, reliability, and testability.
3. Compare plausible [architecture profiles](references/profiles.md), including a
   simple option. Explain costs of boundaries and abstractions as well as benefits.
4. Ask the user to confirm a first choice or material change. Stop for the answer.
   Request the orchestrator to record the approved decision and its review triggers.
5. Define modules, responsibilities, interfaces, dependency arrows and data ownership.
   Separate business policies from volatile I/O where that separation has value.
6. Apply `ahfora-solid` proportionally. Do not write production code in planning.
7. Design error/compatibility/migration behavior and verification strategy for the
   actual requirements. Unknown provider behavior requires current documentation.
8. Produce the [plan](../../../.ahfora/templates/plan.md) and
   [tasks](../../../.ahfora/templates/tasks.md) with ownership and acceptance evidence.

## Decision record

Record context, options, selected choice, why, consequences, owner, approval reference
and reconsideration triggers. Estimates are labeled; vendor costs include source/date.
Changes to architecture invalidate affected plans and require explicit review.

## Commands

Inspect through approved project tools. This skill selects neither a framework nor
a build/test command. Ask before installing tools or changing configuration.

## Resources

- [Architecture profiles](references/profiles.md)
- [Project constitution](../../../docs/constitution.md)
- [Plan template](../../../.ahfora/templates/plan.md)
