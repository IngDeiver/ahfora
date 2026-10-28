# Contributing to AHFORA

AHFORA is an English-language, MIT-licensed framework. Contributions should improve
portable instructions, reliable scaffolding or documented compatibility.

## Local setup

Use Node.js 22+ and npm:

```sh
npm ci
npm test
npm run check:package
```

There are no runtime dependencies and no build step. Keep changes proportionate;
prefer built-in Node.js APIs for this small scaffolder.

## Try the CLI locally

From this source checkout, generate a disposable project outside the repository:

```sh
node bin/ahfora.js init ../my-project --clients all
```

To exercise the packaged executable before publication:

```sh
npm pack --ignore-scripts
npm exec --offline --yes --package ./ahfora-0.1.0.tgz -- ahfora init ../my-project --clients all
```

Replace the version when testing a newer release. The second command uses npm's
execution cache and does not publish anything.

## Verification and publication

The tests cover CLI usage, installation, preservation/idempotency, path conflicts,
concurrent installers, skill contracts/links and packing then executing the tarball
through offline npm exec.

CI is configured for Linux and Windows on Node.js 22 and 24. Actual client behavior
requires the [behavioral evaluation checklist](docs/behavioral-evaluation.md);
structural tests cannot prove that an LLM follows every instruction.

Follow the [publishing guide](docs/publishing.md) for GitHub and npm releases. Keep
the main README focused on end-user installation and usage; contributor setup,
local CLI testing and release procedures belong in this guide and contributor docs.

## Repository map

- `bin/ahfora.js`: npm executable entry point.
- `src/cli.js`: argument handling and output.
- `src/scaffold.js`: template loading, preservation, preflight and installation.
- `src/adapters.js`: small client-native role/skill bridges.
- `templates/core/`: generated canonical framework, including hidden directories.
- `test/`: installer, contract and actual npm-package integration tests.
- `docs/`: integration, maintenance, evaluation and release guidance.
- `assets/`: original SVG identity assets.

## Change guidelines

- Preserve user files and customized framework artifacts. Test new merge behavior
  against an existing project, repeated installation and paths with spaces.
- Never assume all clients discover the same directories or allow nested agents.
- Keep native adapters thin; canonical role/skill changes belong in templates.
- Document template/schema compatibility and migration implications.
- Skills use unique `ahfora-` names, standard frontmatter, MIT licensing and Deiver
  as project author. Reference local canonical guidance rather than duplicating it.
- Ground architectural/SDD instructions in concepts and observable criteria. Do not
  promise that a prompt provides deterministic model behavior or permission isolation.
- Use meaningful tests for behavior and package integrity. Provider behavior also
  needs recorded manual evaluation in the affected client/version.
- Write concise conventional commit messages. Do not add AI attribution trailers.

Changes to the framework itself are ordinary contributor work. Installing AHFORA
into a consumer project establishes its SDD workflow; this repository does not
automatically bootstrap itself or require its unimplemented future rules to build it.
