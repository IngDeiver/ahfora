# Publishing AHFORA

Target repository: `https://github.com/IngDeiver/ahfora`.
Package name: `ahfora`. Author: Deiver. License: MIT.

The source is prepared for npm distribution; publication requires the owner's GitHub
and npm access. The CLI itself never publishes or deploys a user's application.

## Before the first release

1. Create the public repository under `IngDeiver` and push the reviewed source using
   your normal authenticated Git/GitHub workflow.
2. Run the Linux/Windows CI matrix and review the native-client behavioral evaluation
   results. Report unexecuted compatibility checks honestly.
3. Confirm control/availability of the npm package name. A registry 404 is not a
   reservation; npm applies its name and account policies at publication time.
4. Confirm `package.json` repository, homepage, bugs, author, license and version.
5. Update the changelog and check the README's end-user installation examples for
   the version being published.

## Package verification

```sh
npm ci
npm test
npm run check:package
```

`npm test` includes an actual tarball + offline `npm exec` smoke test. The package
allowlist includes the CLI, runtime source, all hidden template directories, docs,
brand assets and the npm-included README/license. Application artifacts are generated
from those templates; repository tests and CI configuration are not shipped.

There is no build/transpile step. The `prepublishOnly` hook runs the tests.

## Publish interactively

```sh
npm login
npm whoami
npm publish --access public
```

Use the package owner's account and satisfy npm's current authentication/2FA
requirements. Do not commit tokens, add them to templates, or disable the prepublish
tests to bypass a failure. For future automated releases, configure npm's supported
trusted-publishing flow separately instead of embedding a long-lived token here.

After publication, verify the exact version in a disposable directory:

```sh
npx ahfora@0.1.0 --version
npx ahfora@0.1.0 init ahfora-smoke-project --clients all
```

Inspect the output and exercise the bootstrap in a supported client. Replace the
example version when releasing a newer version. A previously published npm version
cannot be overwritten; publish a corrected new version when necessary.
