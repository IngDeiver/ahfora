# References and provenance

AHFORA's text and templates are original project guidance, informed by the following
public documentation. External projects retain their own licenses. AHFORA does not
vendor their agents, skills or implementation and is not affiliated with them.

- [Spec Kit](https://github.com/github/spec-kit): specification-first workflow,
  constitution, clarification, plan, tasks and implementation separation.
- [EARS — Alistair Mavin](https://alistairmavin.com/ears/): structured natural-language
  requirement patterns. AHFORA combines EARS obligations with user stories and
  Given/When/Then scenarios; these are complementary artifacts.
- [Agent Skills specification](https://agentskills.io/specification): `SKILL.md`,
  metadata and progressive disclosure.
- [Skill integration](https://agentskills.io/integrate-skills): `.agents/skills/`
  interoperability convention; directory discovery remains client-dependent.
- [AGENTS.md](https://agents.md/): portable project instructions for coding agents.
- [Claude project instructions](https://code.claude.com/docs/en/memory),
  [Gemini context imports](https://geminicli.com/docs/reference/memport/), and
  [OpenCode project rules](https://opencode.ai/docs/rules/): automatic project context
  loading. Native context imports connect Claude/Gemini entry points to `AGENTS.md`.
- [Claude Code agents](https://code.claude.com/docs/en/sub-agents) and
  [skills](https://code.claude.com/docs/en/skills): native registration and discovery.
- [OpenCode agents](https://opencode.ai/docs/agents/) and
  [skills](https://opencode.ai/docs/skills/): native adapters and shared skill discovery.
- [Gemini CLI subagents](https://geminicli.com/docs/core/subagents/) and
  [skills](https://geminicli.com/docs/cli/skills/): native adapters and delegation limits.
- [Engram](https://github.com/Gentleman-Programming/engram): persistent project memory.

Compatibility documentation was reviewed on 2026-10-28. Provider behavior can change;
verify the user's installed client before relying on a capability. Native adapter
registration is distinct from an independent permission sandbox. The canonical
workflow remains the same when a client needs sequential role execution.
