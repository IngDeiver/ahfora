# Adding project roles and skills

AHFORA's four supplied roles are a starting point. Add capabilities when there is a
clear recurring responsibility, such as accessibility review or domain-specific
analysis. Use an approved local improvement so new instructions do not silently
change the team's workflow.

## Add a role

1. Propose the responsibility, trigger, inputs, allowed writes, output evidence and
   relationship to existing roles. Record the user's approval.
2. Copy `.ahfora/templates/role.md` to `.ahfora/agents/<role>.md` and complete the
   contract. Specify stop conditions, required skills and model needs if applicable.
3. Register its trigger and boundary in `AGENTS.md`. The main agent remains responsible
   for delegation and user decisions; the role returns the standard handoff result.
4. For each selected client, add a namespaced native `ahfora-<role>` adapter that
   reads the canonical contract. Use that client's documented fields, not another
   client's YAML. Sequential mode can use the canonical role directly.
5. Test successful invocation, missing inputs, permission limits, handoff and recovery.
   Save the approved decision and useful outcomes in Engram.

The CLI generates the four built-in adapters; it does not scan arbitrary role files
and infer new native configuration. Existing added roles/adapters are preserved on
reinstall. Adding a role does not grant extra tool permissions or remove lifecycle gates.

## Add a skill

1. Confirm that the workflow is reusable and not already covered by an existing skill.
2. Use `.ahfora/templates/skill.md` to create
   `.agents/skills/<unique-name>/SKILL.md`. Replace all placeholders. The name must
   match the directory and use lowercase letters/numbers/hyphens (up to 64 characters).
3. Keep the description specific about both purpose and trigger. Use local
   `references/` and `assets/` when useful; keep the main instructions concise.
4. Register the skill in `AGENTS.md` and relevant role contracts. The agent can read
   the file directly when its client does not expose native skill activation.
5. Add a native bridge for clients that need one, notably Claude's documented
   `.claude/skills/` discovery path. Preserve resource paths relative to the canonical
   skill directory. Do not copy a second independent rule set into the bridge.
6. Validate names, metadata, references, actual invocation and behavior. Record the
   approved local improvement. Attribute the actual author and respect source licenses.

Project-specific names should avoid colliding with built-in `ahfora-*` skills. A new
external skill installation requires permission and review of its source; it is not
automatically trusted because it uses the Agent Skills format.
