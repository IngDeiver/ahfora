# Client integration

AHFORA separates canonical behavior from native discovery. Client capabilities and
names can change; check the installed version rather than inferring them from a model.

## Adapter map

| Client selection | Instruction entry point | Native roles | Skills |
| --- | --- | --- | --- |
| `generic` | Automatically discovered `AGENTS.md` in a compatible client | Sequential contracts in `.ahfora/agents/` | Read `.agents/skills/` directly |
| `opencode` | `AGENTS.md` | `.opencode/agents/ahfora-*.md` | Shared `.agents/skills/` discovery |
| `claude` | `CLAUDE.md` → `AGENTS.md` | `.claude/agents/ahfora-*.md` | `.claude/skills/` bridges → shared canonical skills |
| `gemini` | `GEMINI.md` → `AGENTS.md` | `.gemini/agents/ahfora-*.md` | Shared `.agents/skills/` discovery |

Claude's `CLAUDE.md` uses the documented `@AGENTS.md` import; Gemini's `GEMINI.md`
uses `@./AGENTS.md`. The native context loader includes the canonical instructions
when opening the project. OpenCode discovers `AGENTS.md` directly. The user simply
requests development; the orchestrator performs readiness checks automatically and
does not require a bootstrap prompt, a framework name or a manual role selection.

The generic mode requires a client that automatically discovers `AGENTS.md`. Select
the matching native adapter when the client uses a different context entry point.
AHFORA cannot override a client's disabled project-instruction loader or trust policy.

Role and skill bridges instruct the agent to read canonical files when invoked;
these are distinct from the startup context imports. They return blocked if their
canonical files cannot be read. Skill resources resolve against the original canonical
skill directory. No symbolic links are required.

Restart/reload the client after installation, especially when its first agents/skills
directory was created during a running session. In OpenCode, restart after changing
agent/config files. Verify discovery and permissions in a new session.

## Planner interaction

The planner asks the user about design decisions and waits for answers. OpenCode's
planner definition enables `permission.question: allow`; direct questioning still
depends on the tools actually exposed in the running subagent. Other clients may
not expose a user-question tool to subagents (Claude documents that restriction).

When direct interaction is unavailable, the planner returns `needs-input` with its
question IDs, options/tradeoffs, recommendation and resume context. The main agent
shows those questions to the user and passes the actual answers back to the same
planner; it does not decide or silently redesign. Blocking decisions are asked
immediately, independent confirmations at the end of the draft, and all required
answers precede final plan readiness. See the installed planning-dialogue protocol.

## User-selected models for all subagents

`.ahfora/project.json` holds exact model IDs per client in `modelProfiles` and maps
each role to a profile through `roleModelProfiles`. By default spec-author, developer
and QA use `user-selected`; planner uses the user-confirmed `high-reasoning` profile.
They may all use the same model. These labels are not provider model IDs.

Before invoking any role, the orchestrator resolves the user's choice from explicit
project settings or observable user-selected client configuration. If unknown, it
asks and waits before delegation. A stronger planning option can be proposed, but
the user's choice and limits control the decision; no automatic provider/cost switch.

The installer sets `model` in newly generated native adapters when the existing
project profile specifies it. Fresh unknown selections remain null, and their
adapters have a model gate rather than an invented default. Existing native files
are preserved: the orchestrator must reconcile any profile/configuration mismatch
before work. Changing the JSON alone is not proof of a changed running session.

Configure or confirm native routing for each role and pass effective-model evidence
in every handoff. Inheritance alone is not proof: client overrides or fallbacks can
select something else. If the chosen model is unavailable or routing cannot be
confirmed, explain the blocker and ask before an alternative. The installed
`.ahfora/models.md` defines this process, including reusing confirmed selections.

## Permissions and orchestration

- The main agent must invoke the role responsible for each work category when
  available; a developer requests QA through that agent. This works even where nested
  subagents are unavailable. The main agent coordinates rather than silently authoring
  a spec, design, implementation or QA result in place of the assigned native role.
- QA can request `next_role: developer` for corrections. The main orchestrator invokes
  developer and then QA again, keeping the same finding IDs and checking the integrated
  result. This portable loop works without nested subagent support and ends only with
  passing required checks or an explicitly reported blocker/budget decision.
- OpenCode adapters explicitly set `permission.edit: allow` for every role, covering
  write/edit/apply_patch. There is no blanket edit denial with a fragile relative-path
  exception. Nested `task` calls are denied; spec/planner shell operations still ask.
- Claude adapters use `permissionMode: acceptEdits` and deny nested `Agent`
  delegation. File writes/edits are enabled without using bypass-permissions mode;
  remaining tools and MCP access follow the client's permissions.
- Gemini's custom-agent behavior and recursion restrictions are client-defined.
  The adapter generates project `.gemini/settings.json` with
  `general.defaultApprovalMode: auto_edit`, enabling normal edit operations rather
  than YOLO. It preserves an existing settings file; reconcile a conflicting mode
  with the user. Workspace policy TOML is not used: current official documentation
  marks that discovery tier disabled. Nested delegation remains prohibited.
- A parent can proxy relevant Engram context and persistence for subagents without
  MCP tools. The parent still needs working Engram access.
- In generic mode, roles are executed sequentially by one agent. Record the lack of
  isolated review context in verification; explain this limitation and obtain the
  user's scoped fallback decision before using it. Never pretend a separate agent ran.

When a role fails to load, cannot select its required model, or is denied a tool/write,
report the actual failure and affected spec to the user. Offer a scoped configuration
fix/retry, another suitable available client, approved transcription of returned text,
or approved sequential mode as appropriate. Do not silently broaden permissions or
write the role's artifact yourself. Record intended versus actual execution and the
user's decision in the handoff. See the installed workflow's required-role failure
protocol; the ordinary SDD approval and evidence gates remain in effect.

Editing capability is distinct from task responsibility: spec-author edits its spec,
planner its plan/tasks, developer implementation, and QA tests/evidence. Permission
to edit files does not authorize a role to cross those boundaries or bypass approvals.
Keep existing client configs, hooks, credentials and MCP definitions under the user's
control. No global configuration or blanket shell permission is generated. Explicit
organization/client restrictions still require reconciliation; do not claim they were
overridden. Reload the client after updating native permission definitions.

## Compatibility evidence

The native file layouts and shared skill conventions were reviewed against official
documentation on 2026-10-28. Automated tests check generated artifacts and actual npm
installation. Native client sessions, account-specific model routing and Engram
connections require the [behavioral evaluation](behavioral-evaluation.md) in that
environment. These are different kinds of evidence.

References: [Claude agents](https://code.claude.com/docs/en/sub-agents),
[Claude instruction imports](https://code.claude.com/docs/en/memory),
[Claude skills](https://code.claude.com/docs/en/skills),
[OpenCode agents](https://opencode.ai/docs/agents/),
[OpenCode project rules](https://opencode.ai/docs/rules/),
[OpenCode skills](https://opencode.ai/docs/skills/),
[Gemini agents](https://geminicli.com/docs/core/subagents/),
[Gemini context imports](https://geminicli.com/docs/reference/memport/),
[Gemini skills](https://geminicli.com/docs/cli/skills/),
[Gemini approval mode](https://geminicli.com/docs/cli/settings/),
[shared skill discovery](https://agentskills.io/integrate-skills).
