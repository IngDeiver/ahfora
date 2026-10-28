# State, changes and upgrades

## One authoritative location per concern

| Concern | Authority |
| --- | --- |
| Current intended behavior | Capability `spec.md` |
| A particular implementation/change design | Its `plan.md` |
| Task definitions and progress | Its `tasks.md` |
| Actual validation evidence | Its `verification.md` |
| Lifecycle, owner and gate references | `.ahfora/state/specs/<id>.json` |
| Reviewed baselines and user decisions | `.ahfora/state/approvals/` |
| Architectural policy | `docs/constitution.md` |
| Supporting context and learning | Engram |
| Temporary navigation/checkpoint | `.ahfora/state/local/` |

Commit shared files if the project uses Git. Local checkpoints are ignored. Engram
must be accessible to each working session, but its database is not automatically
shared by the AHFORA installer. Configure Engram's own sharing separately if desired.

## Evolving a completed spec

1. Find the affected current contract and reproduce the problem.
2. Create a new linked fix/change spec with a unique timestamp+UUID ID.
3. Approve its behavior and plan, implement, and verify the integrated result.
4. Apply the approved contract delta to the original spec when intended behavior
   changes. Preserve prior approval snapshots. Original plans/tasks remain history.
5. Append `history.md` with responsible human, executor if known, actual UTC timestamp,
   what/why, related change spec and evidence. Code-only fixes may leave the contract
   revision unchanged while still recording the maintenance event.
6. Obtain final acceptance and reconcile shared state and memory.

During active changes, temporary drift must be explicit and cannot pass the completion
gate. A user edit outside the process triggers reconciliation, not automatic overwrite.

## Reinstalling and adding adapters

Rerun the same version with the desired `--clients` selection. Identical files remain
unchanged; different existing files are preserved and reported. Shared entry points
receive a marked block only if none exists. Review preserved files because AHFORA
does not silently replace them with its preferred contents.

The manifest records requested adapters, not proof that a client loaded them. Validate
actual discovery after restarting the client. A changed native adapter is preserved
just like a changed skill. An installation interrupted by I/O failure may leave a
partial set of files; fix the cause and rerun. The installer is not an all-project
transaction, but new files use exclusive creation and customized files are retained.

If `.ahfora-install.lock/` remains after a killed process, confirm no installer is
running before removing that directory. Do not remove someone else's active lock.

## Upgrading to another framework version

Version `0.1.0` deliberately refuses a different manifest version instead of guessing
how to merge changed workflow rules. There is no automatic `update` command.

1. Preserve the current project state and local improvement history.
2. Generate the requested new version into a separate temporary directory.
3. Compare canonical rules, skills, templates and native bridges with local changes.
4. Propose a scoped local improvement/migration, including active-spec impacts,
   validation and rollback; get the project owner's approval.
5. Merge only approved differences. Keep user instructions, project settings,
   existing specs, approvals and histories. Update manifest version only after the
   migration is applied and verified.
6. Restart the client, verify Engram/discovery and record the outcome in memory.

Use an exact npm version for this comparison. A framework update is not permission
to replace project architecture or revise approved product requirements.
