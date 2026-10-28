---
name: ahfora-improvement
description: "Proposes evidence-based local harness improvements with explicit user approval, validation and rollback. Use when AHFORA instructions, skills or orchestration caused an observed problem or can be improved."
license: MIT
metadata:
  author: Deiver
  version: "1.0.0"
---

# Authorized local improvement

## Critical boundaries

Scope is this project's installed AHFORA only. Detecting an opportunity grants
permission to propose, not to apply. Do not edit rules to conceal a failure, remove
approval/Engram gates, grant yourself capabilities or rewrite the user's constraints.

## Procedure

1. Identify concrete failure/inefficiency evidence. Distinguish a model execution
   error from an instruction defect; not every mistake needs another rule.
2. Read existing guidance and recent decisions. Prefer a focused correction over
   duplicating or expanding the always-loaded prompt.
3. Create an [improvement proposal](../../../.ahfora/templates/improvement.md) under
   `.ahfora/improvements/` with exact affected files/diff, benefit, tradeoffs,
   alternatives, active-work impact, validation and rollback.
4. Explain the proposal to the user and STOP for explicit authorization. Rejection
   is recorded, not worked around. A materially changed proposal requires new approval.
5. Preserve the original version/diff. Apply only the authorized local change to
   canonical sources; update native bridges only if their routing actually changes.
6. Validate representative behavior and regression scenarios, including approval
   gates, model fallback, Engram readiness and interrupted-session recovery when
   affected. Check references and role boundaries. Record actual outcomes.
7. If validation fails, report it and use the approved rollback plan. Do not claim
   success because a prompt is longer or appears more strict.
8. Record `verified` or `rolled-back`, then save the learning and user decision in
   Engram. Inform the user of changes and client reload/restart requirements.

## Commands

Use project-approved validation tools. No automatic publication, external installation,
global client mutation or change to the public AHFORA package is included in a local
improvement approval.

## Resources

- [Improvement records](../../../.ahfora/improvements/README.md)
- [Proposal template](../../../.ahfora/templates/improvement.md)
