<p align="center">
  <img src="assets/ahfora-logo.svg" alt="AHFORA — Agnostic Harness for Agents" width="820">
</p>

<p align="center"><strong>Give your AI a development process it can resume, explain, and verify.</strong></p>

# AHFORA

**Agnostic Harness for Agents** is a portable Spec-Driven Development framework for
AI-assisted software development. A small npm CLI installs instructions, specialist
roles, skills, templates, and local project state conventions into your repository.
Your coding agent then follows the process with you.

**Specify → approve → plan → approve → implement ↔ verify → accept.**

AHFORA is model- and application-stack-agnostic. It deliberately requires
[Engram](https://github.com/Gentleman-Programming/engram) for persistent memory.
It supports native adapters for Claude Code, OpenCode and Gemini CLI, plus a generic
sequential-role mode for other capable coding agents.

## Why AHFORA?

- **Specifications that can be tested:** user stories, EARS requirements, measurable
  non-functional constraints, and success/failure acceptance scenarios.
- **Defined responsibilities:** a spec author, planner, developer, and QA engineer
  coordinated by the user's main agent.
- **Traceable change:** requirements connect to tasks, implementation and evidence.
  Fixes and evolutions get linked specs; completed contracts retain an appended history.
- **Recoverable work:** shared lifecycle records, authoritative task progress,
  local checkpoints and Engram context.
- **Proportionate architecture:** discuss and record the right architecture once;
  apply SOLID without forcing a framework or unnecessary layers.
- **User-controlled improvement:** agents may propose better local rules, but must
  explain the change and obtain approval before applying it.
- **Portable installation:** Node.js, no runtime dependencies, no compilation step,
  and no application source or package.json injected into the destination.

AHFORA makes the workflow explicit and reviewable. Markdown instructions are not a
permission sandbox or a proof of semantic correctness; actual tests, review and user
decisions are still required. The CLI scaffolds the framework; it does not run models.

## Requirements

- **Node.js 22 or later** and npm/npx for installation.
- **Linux or Windows** as initial platform targets.
- A coding agent with project file access and suitable execution capabilities.
- Working **Engram access in the active AI session** before starting the SDD workflow.

The generator can install the instructions before Engram is connected. At first use,
the orchestrator checks a real memory operation. If Engram is missing or inaccessible,
it asks permission to install/configure it, then waits. There is no silent global
installation, automatic provider setup, or model API key requirement in the CLI.

## Install into a project

```sh
# Existing repository, with all three native adapters
npx ahfora@latest init . --clients all

# New directory, OpenCode adapter
npx ahfora@latest init my-project --clients opencode

# Selected adapters
npx ahfora@latest init . --clients claude,gemini

# Generic instructions and skills only (also the default)
npx ahfora@latest init .

# Inspect the operation without changing files
npx ahfora@latest init . --clients all --dry-run
```

With no arguments, `npx ahfora@latest` initializes the current directory in generic
mode. Quote paths containing spaces. These commands work in Linux shells and Windows
PowerShell. For reproducible installations, replace `@latest` with an exact release.

### Choose your mode

- **Generic (default):** installs the shared instructions, roles, skills and templates
  without client-specific registration files. Tell your agent to read `AGENTS.md`;
  it can perform the roles sequentially. Separate subagent contexts are not required.
- **Native adapters:** select `claude`, `opencode`, `gemini`, or `all` to also register
  specialist subagents in those clients' own directories. The main agent delegates
  work to them while following the same canonical rules.

For Claude Code, OpenCode or Gemini CLI, select the matching adapter. Both modes
require Engram and follow the same specification, approval and verification process.

## Start working with your AI

Open or restart your client so it can discover the generated files. Then ask:

> Read AGENTS.md and bootstrap AHFORA for this project. Verify Engram access, inspect
> the existing project if there is one, and ask me to confirm the architecture,
> verification commands and high-reasoning model profile.

AHFORA leaves application commands and architecture choices to the project owner.
Complete them through that conversation in `docs/constitution.md`. Map the planner's
`high-reasoning` profile to a model you actually have available; the profile does not
magically configure your client. See [client integration](docs/clients.md).

Then work conversationally:

1. **Specify:** “Help me define a spec for password recovery, including failure cases.”
2. **Review:** read the resulting `spec.md`, answer questions, and explicitly approve it.
3. **Plan:** the planner compares approaches and prepares `plan.md` and `tasks.md`.
   Confirm the E2E decision and approve the design/task definitions.
4. **Implement and verify:** developer and QA work within that scope. QA reports
   evidence; failures return to developer through the orchestrator.
5. **Accept:** review the integrated result and verification report, then accept it.
6. **Resume:** “Recover the current AHFORA work and show me pending tasks and blockers.”
7. **Maintain:** “Investigate this bug, locate its spec, and propose a linked fix spec.”

The default correction budget is three rounds for the same underlying failure.
Unresolved failures then require your decision. There are no mandatory slash commands.

## What gets generated?

```text
your-project/
├── AGENTS.md                         # Orchestration + owner-editable instructions
├── docs/constitution.md              # Architecture, commands, constraints, decisions
├── specs/README.md
├── .agents/skills/                   # Seven canonical portable skills
└── .ahfora/
    ├── manifest.json                # Installed version and requested adapters
    ├── project.json                 # Model/test preferences; no credentials
    ├── workflow.md                  # Explicit lifecycle and approval gates
    ├── engram.md                    # Memory readiness and recovery protocol
    ├── agents/                      # Four canonical role contracts
    ├── templates/                   # Specs, plans, tasks, evidence, history, state
    ├── state/                       # Shared progress/approvals; local/ is ignored
    ├── improvements/                # Proposed, authorized and verified local changes
    ├── references.md
    └── LICENSE                      # Framework's MIT license; not your app's license
```

Selected adapters add `.claude/agents/`, `.opencode/agents/`, or `.gemini/agents/`.
Claude also gets thin skill bridges and `CLAUDE.md`; Gemini gets `GEMINI.md`.
The main instruction entry points direct the client to the canonical `AGENTS.md`.

Agents create each spec progressively:

```text
specs/<unix-milliseconds>-<uuid-v4>-<short-name>/
├── spec.md
├── plan.md
├── tasks.md
├── verification.md
└── history.md                       # Added/appended when completed work evolves
```

IDs are generated using real time and a cryptographic UUID, rather than a shared
incrementing counter. This supports independent branches; coordinating edits still
requires task ownership and an integration owner.

## Roles and skills

| Role | Responsibility |
| --- | --- |
| Main agent / orchestrator | Bootstrap, clarify, delegate, manage gates/state and user decisions |
| `ahfora-spec-author` | Write a complete, unambiguous, verifiable spec |
| `ahfora-planner` | Design the approved spec and create its plan/tasks |
| `ahfora-developer` | Implement assigned, approved tasks |
| `ahfora-qa-engineer` | Create meaningful tests, verify requirements, report evidence |

Canonical skills: `ahfora-sdd`, `ahfora-requirements`, `ahfora-architecture`,
`ahfora-solid`, `ahfora-verification`, `ahfora-maintenance`, `ahfora-improvement`.
They use the [Agent Skills format](https://agentskills.io/specification). The shared
`.agents/skills/` discovery convention and native subagent registration are distinct.
See the [compatibility details](docs/clients.md).

## Existing projects and repeated installation

- Existing user instructions are preserved; a clearly delimited AHFORA entry block
  is appended to shared instruction files when absent.
- Different existing constitution, role, skill and template files are **preserved**
  and listed for review. Local improvements are not overwritten on reinstall.
- Same-version reinstall is idempotent. You can add adapters by rerunning with
  `--clients`; previous adapter choices are retained in the manifest.
- Local session checkpoints and the temporary installer lock are added to `.gitignore`.
  Specs, shared state and approvals remain versionable.
- Conflicting file types, malformed markers and symbolic links at generated paths
  stop installation during preflight. Concurrent installers coordinate with a lock.
- Different manifest versions are rejected for manual migration review. See
  [maintenance and upgrades](docs/maintenance.md).

For a codebase without specs, the agent first investigates actual behavior and asks
you which behavior should become the baseline. It does not canonize existing bugs.

## Documentation

- [Client integration and model routing](docs/clients.md)
- [State, maintenance and upgrades](docs/maintenance.md)
- [Adding project roles and skills](docs/extending.md)
- [Behavioral evaluation](docs/behavioral-evaluation.md)
- [Brand assets](docs/brand.md)
- [Changelog](CHANGELOG.md)

## License and author

Created by **Deiver** — [IngDeiver](https://github.com/IngDeiver).
Distributed under the [MIT license](LICENSE). Framework artifacts carry their own
license; installing them does not change the license of your application.
