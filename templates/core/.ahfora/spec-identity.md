# Short spec identity

## Format and authority

- Public spec IDs are four decimal digits stored as strings: `0001` through `9999`.
  `0000` is not issued. Preserve leading zeros in JSON, YAML, links and conversation.
- Directory: `specs/0001-task-manager/`; state: `.ahfora/state/specs/0001.json`.
  The number identifies the spec; the short lowercase slug describes it.
- Display: **SPEC 0001 — Task manager**. Include the exact artifact path and current
  phase when starting, resuming, switching specs or requesting approval.
- The main orchestrator allocates IDs. A spec-author receives an already reserved
  ID and must not guess a number or choose another independently.
- `.ahfora/state/spec-ids.json` is the shared allocation ledger, not a task database.
  `lastIssued` is a monotonic high-water mark. Each reservation records `id`,
  `specPath`, `reservedAt` (tool-obtained UTC), `reservedBy` (known owner/role), and
  `legacyIds` (normally empty). Keep reservations even for cancelled/deleted specs.

Example reservation (illustrative; not a preallocated spec):

```json
{
  "id": "0001",
  "specPath": "specs/0001-task-manager",
  "reservedAt": "<UTC ISO-8601>",
  "reservedBy": "<confirmed allocator>",
  "legacyIds": []
}
```

## Allocation protocol

This is an instruction protocol executed with the agent's tools, not an extra CLI
command or a background allocation service.

1. Identify the authoritative ledger and its designated writer. In one workspace,
   serialize allocation by exclusively creating
   `.ahfora/state/local/spec-id-allocation.lock/`. Creating its parent may be recursive;
   creating the lock itself MUST fail if it already exists. Record the owner/session.
   If tools cannot make an exclusive claim, have one coordinated writer allocate.
   Never remove another active owner's lock; interrupted claims require reconciliation.
2. While holding the claim, re-read the ledger, spec directories and lifecycle records.
   Validate unique IDs/paths and compare reserved IDs with existing four-digit spec
   prefixes and state IDs. Ignore README files and legacy timestamp IDs when computing
   the numeric maximum. Record existing short IDs missing from the ledger first.
   An absent ledger does not mean an existing project starts at `0001` again.
3. Compute `max(lastIssued, reserved numeric IDs, existing short spec/state IDs) + 1`,
   padded to four digits. Do not fill gaps, reuse retired IDs, or invent a random code.
   If the maximum is `9999`, stop and ask for an explicit namespace policy; do not
   wrap, silently expand the format, or recycle IDs.
4. Check the proposed number is unused for every slug. Persist its reservation and
   new high-water mark before creating the spec directory, using the tools' safe
   write/replace behavior. Create the new directory exclusively. A reservation left
   by an interrupted creation stays consumed until its owner reconciles it.
5. Create the lifecycle record, release only your own allocation claim, and announce
   the actual reserved ID/title/path/phase to the user before delegating spec-author.
   Only then begin drafting. Do not say a spec file exists until it has been written.

## Multiple branches and machines

Short sequential IDs require coordination. Reserve numbers through one designated
integration owner and authoritative checkout before parallel work branches. Share the
reservation records with workers. Separate checkout-local locks do NOT coordinate
independent machines or worktrees; never claim otherwise. If the shared authority is
unavailable, pause allocation instead of independently choosing the same next number.

On a merge with duplicate IDs, stop and let the integration owner reconcile the
collision with the user before further work. Do not overwrite a spec, silently
renumber it, or interpret two different contracts as the same one. Parallel work on
already reserved specs can continue within the usual disjoint file ownership rules.

## Existing long IDs and explicit migration

Do not rename existing work merely on reinstall. On an authorized migration, reserve
a short ID, move the active spec folder/state file, and update active metadata,
cross-references, handoffs and checkpoints together. Keep the old ID in the ledger's
`legacyIds` and record the mapping in relevant memory so old references remain
resolvable. Before trusting a historical memory path, consult this mapping.

For an unapproved draft, increment its document/state revisions and keep its current
approval state; identity migration does not approve its requirements. For previously
approved/completed work, preserve immutable approval snapshots and append history
with the mapping rather than rewriting past evidence. Never change functional
requirements, task meanings or user decisions as part of an identity migration.

Session, handoff and approval record IDs may still use UUIDs. Those internal IDs
are distinct from the short spec number shown to the user.
