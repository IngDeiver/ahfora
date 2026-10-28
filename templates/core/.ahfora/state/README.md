# Project state and resumption

The orchestrator creates records as work starts. This folder initially contains no
active spec and no fabricated completed work.

| Location | Responsibility | Version control |
| --- | --- | --- |
| `specs/<id>.json` | Canonical lifecycle, revision, owner, blockers and approval references | Shared |
| `approvals/<id>/<approval-uuid>/` | Approval record and immutable copies of reviewed artifacts | Shared |
| `handoffs/<handoff-uuid>.md` | Role assignment/result, ownership and dependencies | Shared |
| `local/<session-uuid>.md` | Temporary session checkpoint and navigation hints | Ignored |

Task progress lives only in each spec's `tasks.md`. A local checkpoint or a summary
in Engram is a pointer to that truth, not a second task database. A global dashboard,
if the project adds one, must be clearly marked as derived and rebuildable.

## Resume algorithm

1. Verify Engram and the project constitution.
2. Read relevant shared lifecycle records, then their current spec/plan/tasks and
   approval snapshots. Search by requirement/affected path for a bug, not just title.
3. Use a local checkpoint or memory to narrow the search. Confirm the current files,
   code revision and ownership before trusting any old progress claim.
4. If multiple active specs or conflicting owners make the next task ambiguous,
   ask the user. Never select a destructive resolution or overwrite another session.
5. Report completed, in-progress, pending and blocked work. Continue only a task
   whose approvals, dependencies and write scope are satisfied.

## Coordination

One integration owner updates a spec's lifecycle/task progress at a time. Workers
return updates to that owner. Use task-specific handoffs for disjoint parallel work.
Read the lifecycle revision before editing, reconcile concurrent changes, and
increment it. For independent branches, retain unique IDs and resolve shared-file
conflicts through review; a timestamp does not prevent write conflicts.

The protocol is cooperative, not a lock service. If a client cannot coordinate
writers safely, serialize the work. Stale owners are reassigned only after confirming
the original work has stopped. Never let a local checkpoint overwrite shared truth.
