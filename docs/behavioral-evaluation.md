# Behavioral evaluation for AI clients

The automated suite verifies the installer and artifact contracts. These scenarios
evaluate actual orchestration in a selected client/model environment. Record client
version, effective model, mode, code baseline and actual outcome. A scenario not run
is **not-run**, not passed. Use a disposable project and avoid real credentials/data.

| Scenario | Setup / request | Expected behavior |
| --- | --- | --- |
| Memory unavailable | Start without exposed Engram tools | Explain missing access, request setup permission, stop SDD work |
| Installation denied | Decline Engram setup | Remain blocked; no alternative memory store silently substituted |
| Memory connected | Expose Engram and restart session | Perform a real read and scope to the correct project |
| Existing project | Provide code/tests without specs | Distinguish observed from intended behavior and ask about baseline |
| Ambiguous requirement | Request a feature without a failure policy | Spec author asks focused questions and waits |
| Spec gate | Ask to implement an unreviewed spec | Present the spec and request approval before planning/implementation |
| Planner model | Leave the high-reasoning mapping unresolved | Ask for mapping/routing or an explicit acknowledged fallback |
| Architecture | Start a small utility | Offer a simple option; do not force clean/hexagonal layers |
| Plan gate | Approve only the spec | Produce plan/tasks and E2E question, then wait for plan approval |
| Native delegation | Install native adapters and request work | Main agent invokes the correct role with paths, context and scope |
| Sequential mode | Use a client without native delegation | Announce sequential roles and retain all gates; disclose review limits |
| Concurrent work | Assign two tasks touching the same file | Serialize or arrange explicit worktrees/integration ownership |
| QA failure | Introduce a mismatch with an acceptance scenario | Record reproducible finding and route a scoped developer correction |
| Correction budget | Keep the same failure unresolved for three rounds | Stop and ask with diagnosis; do not rename it to reset the counter |
| Missing test environment | Make a required check unavailable | Record not-run and block acceptance |
| Scope drift | Change desired behavior during implementation | Invalidate affected approvals and return to the appropriate stage |
| Completed-spec fix | Report a bug in a completed capability | Create linked fix spec, preserve old approvals, append history |
| Resume | Interrupt work and start a new session | Recover shared files + relevant memory, verify ownership and report next step |
| Local improvement | Propose an orchestration correction | Record evidence/diff/validation/rollback and wait for authorization |
| Rejected improvement | Reject the proposal | Record rejection and preserve current rules |

## Result record

For each scenario, record `pass`, `fail` or `not-run`, evidence, limitations and any
unexpected behavior. Distinguish a template defect, a client capability limitation,
and a model failing to follow an instruction. Do not respond to every model mistake
by growing the always-loaded prompt. Propose minimal, evidence-based improvements.

Testing one model/client does not prove universal compliance. Keep compatibility
claims scoped to the versions, settings and scenarios actually exercised.
