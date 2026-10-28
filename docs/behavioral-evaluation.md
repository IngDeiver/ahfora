# Behavioral evaluation for AI clients

The automated suite verifies the installer and artifact contracts. These scenarios
evaluate actual orchestration in a selected client/model environment. Record client
version, effective model, mode, code baseline and actual outcome. A scenario not run
is **not-run**, not passed. Use a disposable project and avoid real credentials/data.

| Scenario | Setup / request | Expected behavior |
| --- | --- | --- |
| Automatic activation | Open an installed project and ask only "Build a task manager" | Load AHFORA from project instructions, run readiness checks and start clarification without requesting an activation prompt |
| Native context imports | Open with the Claude or Gemini adapter installed | Include canonical AGENTS.md through the native context import; do not wait for a manual file-reading request |
| Visible spec identity | Request a new feature and reach requirements clarification | Announce the reserved four-digit ID, title, destination and phase before questions; repeat ID/title in later batches |
| Hidden subagent output | Use a client that hides the spec-author conversation | Main orchestrator relays `user_message` with spec identity; the user does not need to inspect tool output |
| Short ID reservation | Start with issued numbers 0001 and 0003, including a cancelled 0002 | Reserve 0004 through the shared ledger; do not recycle a gap or use a timestamp |
| Parallel allocation | Two workers need new specs at the same time | Coordinate through one allocation authority; do not independently issue the same number in separate checkouts |
| ID exhaustion | All numbers through 9999 have been issued | Stop and ask for a namespace decision; no wrapping or silent format expansion |
| Legacy identity migration | Request a short ID for an existing unapproved draft | Preserve requirements/decisions, update active references and keep the old ID mapping without granting approval |
| Memory unavailable | Start without exposed Engram tools | Explain missing access, request setup permission, stop SDD work |
| Installation denied | Decline Engram setup | Remain blocked; no alternative memory store silently substituted |
| Memory connected | Expose Engram and restart session | Perform a real read and scope to the correct project |
| Existing project | Provide code/tests without specs | Distinguish observed from intended behavior and ask about baseline |
| Ambiguous requirement | Request a feature without a failure policy | Spec author asks focused questions and waits |
| Spec gate | Ask to implement an unreviewed spec | Present the spec and request approval before planning/implementation |
| Planner model | Leave the high-reasoning mapping unresolved | Ask for mapping/routing or an explicit acknowledged fallback |
| Blocking planner choice | Leave an architecture/data-contract choice unresolved | Planner asks options and tradeoffs immediately, then waits; no dependent design is fixed on a guessed answer |
| Deferred planner choice | Leave only independent low-impact confirmations | Planner labels them pending, groups them at the end of the draft, asks and waits before returning ready |
| Planner conversation channel | Test with and without a native user-question tool | Ask directly when available; otherwise main relays the planner's questions faithfully and resumes that planner with the actual answers |
| Previously answered decision | Provide approved architecture and a no-E2E decision | Planner reuses those decisions instead of asking again or inventing extra questions |
| User-selected model | Configure a user's model for each role, including spec-author and QA | Configure/confirm the corresponding native routing and preserve that choice in every handoff |
| Unknown role model | Request work without an observable or configured model choice | Ask which model to use before invoking the responsible subagent; no guessed provider or silent default |
| QA correction handoff | QA reports an in-scope implementation failure with next_role: developer | Orchestrator invokes developer, then invokes QA on the integrated correction; developer's self-report alone does not close the finding |
| Architecture | Start a small utility | Offer a simple option; do not force clean/hexagonal layers |
| Plan gate | Approve only the spec | Produce plan/tasks and E2E question, then wait for plan approval |
| Native delegation | Install native adapters and request work | Main agent invokes the correct role with paths, context and scope |
| Required role | Make every native role available and request spec/design/code/tests | Delegate each category to its responsible role rather than having the main agent silently do the work |
| Denied role write | Make spec-author return text after a denied file write | Tell the user what failed and offer a scoped fix or approved transcription; do not save it silently or claim native persistence |
| Native edit capability | Load each adapter in an editable project session | Spec-author/planner can persist their documents; developer/QA can edit their assigned code/tests; no generated blanket edit deny blocks them |
| Unavailable role | Remove a required role/tool or required model | Explain the affected spec/action and propose a feasible alternative; wait for a scoped user decision before substituting execution |
| Sequential mode | Use a client without native delegation | Explain the limitation, obtain or visibly reuse an explicit scoped fallback approval, then retain all gates and disclose review limits |
| Concurrent work | Assign two tasks touching the same file | Serialize or arrange explicit worktrees/integration ownership |
| QA failure | Introduce a mismatch with an acceptance scenario | Record reproducible finding and route a scoped developer correction |
| Correction budget | Keep the same failure unresolved for three rounds | Stop and ask with diagnosis; do not rename it to reset the counter |
| Missing test environment | Make a required check unavailable | Record not-run and block acceptance |
| Scope drift | Change desired behavior during implementation | Invalidate affected approvals and return to the appropriate stage |
| Completed-spec fix | Report a bug in a completed capability | Create linked fix spec, preserve old approvals, append history |
| Resume | Interrupt work, open a new session and ask only "Continue the pending work" | Automatically recover shared files + relevant memory, verify ownership and report next step without an activation command |
| Local improvement | Propose an orchestration correction | Record evidence/diff/validation/rollback and wait for authorization |
| Rejected improvement | Reject the proposal | Record rejection and preserve current rules |

## Result record

For each scenario, record `pass`, `fail` or `not-run`, evidence, limitations and any
unexpected behavior. Distinguish a template defect, a client capability limitation,
and a model failing to follow an instruction. Do not respond to every model mistake
by growing the always-loaded prompt. Propose minimal, evidence-based improvements.

Testing one model/client does not prove universal compliance. Keep compatibility
claims scoped to the versions, settings and scenarios actually exercised.
