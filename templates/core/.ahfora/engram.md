# Required persistent memory: Engram

AHFORA uses [Gentleman-Programming/engram](https://github.com/Gentleman-Programming/engram).
This is a deliberate dependency while model and coding-client choice remain open.

## Readiness gate

At session start, discover tools by capability rather than assuming a fixed prefix.
Depending on the client, names can resemble `mem_context`, `engram_mem_context`,
or an MCP-qualified variant. Call an actual read operation such as current-project
detection/context/search. A listed binary, configured MCP entry, or previous session
success does not prove that memory tools work in this session.

Confirm the project identity using the working directory/repository. An empty new
project is normal. If detection is ambiguous, ask the user; never save to an invented
project or an unrelated existing one. Availability must include the capability to
save memory; the first real approved decision supplies a useful write, not test spam.

If tools are missing or fail:

1. Explain whether installation, MCP registration, client restart, permissions, or
   service recovery is needed. Inspect evidence before proposing a fix.
2. Ask permission before installing or changing client/global configuration. State
   the command/source, scope and affected files. Wait for the answer.
3. Follow current official Engram installation and client setup documentation for
   the user's platform. Do not copy an unverified OS-specific command or execute a
   remote installer without explicit authorization.
4. Reuse an existing working local or remote Engram connection. Do not install a
   second server merely because no local executable is present.
5. After setup, restart/reconnect the client if needed and perform a real read in
   the new active session. The workflow remains blocked until this succeeds.

The npm scaffold operation can prepare instructions before Engram is connected.
The AI-driven SDD lifecycle cannot start until this gate passes. The CLI does not
install Engram or mutate global client configuration behind the user's back.

## Lifecycle protocol

- Start: get project context; search relevant specs, architecture decisions, bugs
  and known constraints before repeating investigation.
- Delegate: give each role relevant observations and document paths. If subagents
  cannot access MCP, the orchestrator supplies context and persists returned learning.
- Save after approved decisions, non-obvious discoveries, completed bug fixes,
  architecture choices, explicit preferences, or authorized harness improvements.
- Summarize on pause, handoff, completion and before context loss when supported.
  After compaction, reload the canonical workflow and checkpoint instead of relying
  only on compressed conversation.

Useful operations, when exposed: current-project, context, search, get-observation,
save, session-summary, and conflict judgment. Do not call a tool that is unavailable;
use the client's actual schema. Do not invent stored IDs or successful saves.

Save observations in this format:

```text
Title: Short searchable description
Type: decision | architecture | bugfix | discovery | pattern | preference
Topic: stable topic key when updating an evolving subject
What: The verified fact or approved change.
Why: Reason and relevant requirement.
Where: Spec ID, project-relative paths and decision/approval reference.
Learned: Constraints, edge cases or consequences.
```

Memory is supporting context. Approved files define the current contract and shared
state defines current progress. When they disagree, investigate and report the
conflict. Never silently change an approved decision because of a retrieved memory.
If Engram surfaces conflicting observations, follow its available conflict-resolution
protocol; ask about contradictory architecture/policy decisions before superseding.

Do not store secrets, raw credentials, unnecessary personal information or entire
repositories. Keep memories compact and scoped. Every team member/session must have
working Engram access; cross-machine sharing of the memory database is a separately
configured Engram feature. Versioned artifacts let teammates resume even when their
individual Engram histories differ.

## Official setup references

- [Installation](https://github.com/Gentleman-Programming/engram#installation)
- [Agent setup](https://github.com/Gentleman-Programming/engram/blob/main/docs/AGENT-SETUP.md)

These links are installation references, not commands to execute automatically.
