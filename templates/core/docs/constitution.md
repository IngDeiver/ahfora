# Project constitution

Status: **unconfigured**. The orchestrator must discuss and confirm this document
before the first implementation. On an existing project, inspect actual conventions
first and propose a baseline; do not replace the architecture merely to fit a template.

## Project and actors

- Purpose and intended outcomes: TODO
- Users, maintainers, and decision owner: TODO
- Product boundaries and supported environments: TODO
- Existing behavior that must be preserved: TODO or N/A with reason
- Artifact language: English. User conversations follow the user's language.

## Application layout

- Status: pending user answer
- Language/toolchain and relevant layout constraints: TODO
- Approved source root(s), relative to the project root, and purpose of each: TODO
- Related test/configuration paths and generated-output boundaries: TODO
- Existing layout to preserve, if applicable: TODO or N/A with reason
- Decision owner and explicit confirmation reference: TODO

Ask the owner where application code should live before assigning application paths
or running a project generator. Folder names are user decisions informed by the
language/toolchain, not AHFORA defaults. A custom folder, `.` or multiple source roots
can be valid choices. Confirm discovered paths in existing projects; do not move
code without approval. Keep unanswered choices pending and reuse confirmed paths on
resumption. Pass this decision to every role that plans or writes application files.
AHFORA instructions, specs and state keep their own framework locations.

## Architecture decision

- Status: undecided
- Selected style: TODO (simple modular, modular monolith, clean, hexagonal, or other)
- Evidence and scale: TODO
- Alternatives, advantages, costs and rejected tradeoffs: TODO
- Boundaries, allowed dependency directions, and module ownership: TODO
- Decision owner and approval reference: TODO
- Review triggers: TODO

Choose the smallest architecture that meets the actual requirements. SDD is a
development process; SOLID and clean code are design guidance, not substitutes for
an architecture decision. Apply the chosen style consistently and revisit it only
through an approved decision. Domain-driven design is optional and justified by
domain complexity, not required by AHFORA.

## Engineering principles

- Requirements and code remain traceable. No completed work with unresolved drift.
- Clear responsibilities, explicit dependencies, stable public contracts.
- Prefer understandable, testable changes over speculative abstraction.
- Document functional and measurable non-functional requirements.
- Respect project language/paradigm conventions when applying SOLID.
- Failure handling, observability, accessibility and security are considered when
  relevant; unsupported promises or invented compliance claims are prohibited.

## Approved commands — supplied by the project owner

AHFORA does not select the application's toolchain or execute placeholders.
Specify working directory, command, prerequisites, and expected result.

| Purpose | Working directory | Command | Prerequisites / limits |
| --- | --- | --- | --- |
| Dependencies / environment | TODO | TODO | TODO |
| Unit tests | TODO | TODO | TODO |
| Integration tests | TODO | TODO | TODO |
| E2E tests, when approved | TODO | TODO | TODO |
| Static analysis / formatting | TODO | TODO | TODO |
| Build, if project policy requires it | TODO | TODO | TODO |

Missing or unavailable commands are blockers for the corresponding evidence, not
permission to invent commands or mark a check passed. Confirm discovered commands
with the owner before recording them as approved.

## Test policy and environments

- Unit/integration scope is risk-driven and specified per change.
- Ask about E2E during each spec's planning; record yes/no and the reason.
- Default maximum correction rounds for the same failure: 3.
- Test data, isolation, cleanup, external-service cost constraints: TODO
- Performance targets and measurement environment: TODO or N/A
- Required checks and permitted manual evidence: TODO
- Any accepted exclusion names the owner, reason, affected requirement and limits.
  Unsatisfied acceptance criteria require an approved scope change, not a QA waiver.

## Models and skills

- Confirm `.ahfora/project.json` model profiles and role mappings during bootstrap;
  follow `.ahfora/models.md` before every subagent invocation.
- Record the selected model per client, routing method, budget constraints and
  approval. Every role uses the user's choice; ask before invocation if unknown.
  The planner's `high-reasoning` choice may match the other roles' `user-selected`
  model. Native routing must reflect these selections; names are client-specific.
- Additional project skills and when to use them: TODO

## Collaboration and maintenance

- Task ownership and integration owner: TODO
- Branch/worktree policy, if applicable: TODO (AHFORA does not require Git)
- Version specs, shared state, approval evidence, and local harness improvements.
- Keep transient checkpoints in `.ahfora/state/local/`.
- Completed contracts evolve through linked change/fix specs and appended history.
- Human approvals are recorded faithfully; never fabricate an identity or signature.

## Amendments

Record date (UTC), owner, reason, affected specs, and approval reference for each
substantial amendment. Save the approved decision to Engram and invalidate affected
plans when necessary. Project owners can extend this constitution.
