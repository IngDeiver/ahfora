---
id: "<four-digit-id>"
title: "<capability or change>"
kind: "feature"
revision: 1
created_at: "<UTC ISO-8601>"
owner: "<confirmed decision owner>"
related_specs: []
affected_paths: []
---

# SPEC <four-digit-id> — <Title>

## Problem and intended outcome

Describe the problem, evidence, business value and observable outcome. Distinguish
current behavior from intended behavior. For a baseline, explain how intended
behavior was confirmed; for a fix/change, link the original requirement and delta.

## Actors, terminology and context

| Actor / term | Meaning, permissions and responsibilities |
| --- | --- |
| TODO | TODO |

## User stories

### US-001 — <value>

As a <actor>, I want <capability>, so that <outcome>.

## Scope

- In scope: TODO
- Out of scope: TODO
- Dependencies and external systems: TODO
- Constraints and compatibility obligations: TODO
- Limitations: TODO
- Approved assumptions (decision reference): TODO or none

## Functional requirements

Use EARS-style obligations with explicit actors, triggers/states, response and
failure behavior. Keep IDs stable. Each requirement must have acceptance coverage.

| ID | Requirement | Story | Acceptance IDs |
| --- | --- | --- | --- |
| FR-001 | When <event>, the system shall <observable response>. | US-001 | AC-001, AC-002 |

## Non-functional requirements

Specify threshold, workload/environment and measurement method. Consider performance,
reliability, security/privacy, accessibility, operability and compatibility as relevant.
Mark omitted categories N/A with a rationale; never promise vague "high performance".

| ID | Measurable obligation | Conditions / method | Acceptance IDs |
| --- | --- | --- | --- |
| NFR-001 | TODO | TODO | TODO |

## Acceptance scenarios

### AC-001 — Successful <behavior>

- Requirements: FR-001
- Given: TODO
- When: TODO
- Then: TODO (observable result and relevant side effects)
- Verification method and required data: TODO

### AC-002 — Unsuccessful <behavior>

- Requirements: FR-001
- Given: TODO
- When: TODO
- Then: TODO (error response, preserved state, retry/cleanup when relevant)
- Verification method and required data: TODO

Add boundary, authorization, dependency-failure, concurrency and NFR scenarios where
applicable. State N/A reasons rather than inventing requirements to fill a template.

## Impact and current-contract delta

Affected specs, interfaces and consumers: TODO or N/A.
For a change/fix, name what must change in the current contract and what remains
valid. A code bug may require no change to intended behavior. Identify regression
scenarios and backward-compatibility constraints without prescribing architecture.

## Open questions

List unresolved decisions with an owner and impact. This must contain no blocking
question before requesting approval. Do not convert unanswered questions to facts.

## Specification readiness

- [ ] Scope, actors, terminology, constraints and limitations are explicit.
- [ ] FR/NFR obligations are unambiguous and have success/failure coverage.
- [ ] Every requirement is verifiable; relevant NFRs have actual metrics.
- [ ] Dependencies, approved assumptions and affected contracts are recorded.
- [ ] Blocking questions are resolved and user approval is requested separately.
