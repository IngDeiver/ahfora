# Client integration

AHFORA separates canonical behavior from native discovery. Client capabilities and
names can change; check the installed version rather than inferring them from a model.

## Adapter map

| Client selection | Instruction entry point | Native roles | Skills |
| --- | --- | --- | --- |
| `generic` | User tells the agent to read `AGENTS.md` | Sequential contracts in `.ahfora/agents/` | Read `.agents/skills/` directly |
| `opencode` | `AGENTS.md` | `.opencode/agents/ahfora-*.md` | Shared `.agents/skills/` discovery |
| `claude` | `CLAUDE.md` → `AGENTS.md` | `.claude/agents/ahfora-*.md` | `.claude/skills/` bridges → shared canonical skills |
| `gemini` | `GEMINI.md` → `AGENTS.md` | `.gemini/agents/ahfora-*.md` | Shared `.agents/skills/` discovery |

Bridges instruct the client to read canonical files; they are not undocumented include
syntax. They return blocked if those files cannot be read. Skill resources resolve
against the original canonical skill directory. No symbolic links are required.

Restart/reload the client after installation, especially when its first agents/skills
directory was created during a running session. In OpenCode, restart after changing
agent/config files. Verify discovery and permissions in a new session.

## Model profile is an explicit decision

`.ahfora/project.json` holds the user-approved `high-reasoning` mapping. It is not an
OpenCode/Claude/Gemini configuration file, and AHFORA never passes `high-reasoning`
as if it were a provider model ID.

At bootstrap:

1. Ask which client/models the user actually has and what budget constraints apply.
2. Agree on the most capable available planning model for this project.
3. Store that exact model identifier in the client key of the profile.
4. With permission, set the native planner's `model` frontmatter or use the client's
   supported per-invocation model routing. Consult current client docs for accepted IDs.
5. Confirm the actual selected model from client configuration/status, and pass that
   evidence in the planner handoff. If the client silently falls back or cannot expose
   the effective model, ask for an explicit fallback decision before planning.

Generated adapters intentionally omit a fixed `model`. Most clients inherit a default
in that situation. **Inheritance alone does not satisfy the planning model gate.**
No worldwide "best model" or automatic subscription discovery is claimed.

## Permissions and orchestration

- The main agent invokes roles; a developer requests QA through that agent. This
  works even where nested subagents are unavailable.
- OpenCode adapters deny nested `task` calls and restrict spec/planner edit-tool
  access to `specs/**`. Shell access still follows client approval policy; this is
  not a full filesystem security boundary.
- Claude adapters deny `Agent` delegation. Other tool permissions inherit project
  policy so document-writing and MCP access remain available.
- Gemini's custom-agent behavior and recursion restrictions are client-defined.
  AHFORA additionally prohibits nested delegation in every canonical contract.
- A parent can proxy relevant Engram context and persistence for subagents without
  MCP tools. The parent still needs working Engram access.
- In generic mode, roles are executed sequentially by one agent. Record the lack of
  isolated review context in verification; never pretend a separate agent ran.

Keep existing client configs, hooks, credentials and MCP definitions under the user's
control. AHFORA generates no global configuration and does not grant blanket shell
permissions. If client policy conflicts with required capabilities, report the blocker.

## Compatibility evidence

The native file layouts and shared skill conventions were reviewed against official
documentation on 2026-10-28. Automated tests check generated artifacts and actual npm
installation. Native client sessions, account-specific model routing and Engram
connections require the [behavioral evaluation](behavioral-evaluation.md) in that
environment. These are different kinds of evidence.

References: [Claude agents](https://code.claude.com/docs/en/sub-agents),
[Claude skills](https://code.claude.com/docs/en/skills),
[OpenCode agents](https://opencode.ai/docs/agents/),
[OpenCode skills](https://opencode.ai/docs/skills/),
[Gemini agents](https://geminicli.com/docs/core/subagents/),
[Gemini skills](https://geminicli.com/docs/cli/skills/),
[shared skill discovery](https://agentskills.io/integrate-skills).
