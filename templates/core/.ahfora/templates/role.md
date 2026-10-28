# Role: <lowercase-role-name>

## Mission and trigger

State one cohesive responsibility and precise invocation conditions. Explain how it
differs from existing roles. Do not invent a role merely to add another approval layer.

## Required input and gates

- Assigned spec/revision, task/scope and approval references: TODO
- Required project context and skill paths: TODO
- Required capabilities and confirmed model profile, if any: TODO
- Missing input behavior: return needs-input or blocked to the orchestrator and stop
- Missing capability behavior: report the actual error and a user-facing alternative;
  do not silently switch executor or assume approval for main-agent substitution

## Procedure

1. Read the canonical project instructions and assigned context.
2. TODO: role-specific steps with observable outcomes.
3. Return a handoff result and evidence to the main orchestrator.

## Write boundary

- May read: TODO
- May create/update: TODO (exact artifact categories and assigned scope)
- Must not modify: TODO
- Questions, extra permissions and role requests go to the main orchestrator.
- Never spawn nested roles, self-approve a gate, or expand scope silently.

## Exit criteria and result

Define verifiable completion criteria: TODO.
Return `ready`, `needs-input`, `blocked`, or `failed` with changed artifacts,
requirement/task coverage, actual evidence, unresolved questions and next action.
Contribute relevant learning through the Engram protocol. A result is not approval.
