---
spec_id: "<id>"
spec_revision: 1
plan_revision: 1
verified_code_revision: "<commit or file/digest inventory>"
execution_mode: "<native-subagent or sequential-role>"
---

# Verification — <title>

## Environment and scope

- Verifier identity/role (only what is actually known): TODO
- UTC date and relevant tool versions: TODO
- Environment, services and test data: TODO
- Approved verification strategy / E2E decision: TODO
- Integrated code baseline: TODO
- Isolation/independence limitations: TODO or none

## Requirement traceability

| Requirement | Scenario | Task | Implementation reference | Check / evidence | Result |
| --- | --- | --- | --- | --- | --- |
| FR-001 | AC-001 | T-001 | TODO | V-001 | not-run |

Cover every in-scope FR/NFR and acceptance scenario. Results: `pass`, `fail`,
`not-run`, `not-applicable` (only with a justified approved applicability decision).

## Executed checks

### V-001 — <check>

- Command / manual procedure and working directory: TODO
- Start/end (UTC), exit code or observed result: TODO
- Expected and actual outcome: TODO
- Sanitized evidence path or concise output: TODO
- Result: not-run

## Findings and correction rounds

| Finding ID | Requirement / scenario | Expected vs actual / reproduction | Severity | Round | State |
| --- | --- | --- | --- | --- | --- |
| TODO | TODO | TODO | TODO | 0 | open |

Use stable finding IDs; do not reset the three-round budget by renaming a failure.
Record test corrections separately from production fixes and explain their basis.

## Drift and regression review

- Spec / design / implementation consistency: TODO
- Relevant regression results: TODO
- Required checks not executed and blockers: TODO or none
- Limitations and approved exclusions: TODO or none
- Current-contract/history reconciliation for linked changes: TODO or N/A

## Verdict

**pending** — replace with `ready-for-user-acceptance` or `blocked` and the evidence.
A required failure, not-run check, unmet criterion or unresolved drift blocks closure.
The verifier does not grant final user acceptance.
