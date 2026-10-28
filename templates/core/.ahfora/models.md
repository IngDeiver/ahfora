# User-selected models for every role

All subagents use a model chosen by the user, never a vendor/model guessed by AHFORA.
This gate applies to spec-author, planner, developer and qa-engineer, including retries.

## Resolve before invoking

1. Read `.ahfora/project.json`: `roleModelProfiles` maps a role to a profile;
   `modelProfiles[profile][client]` stores the exact user-selected model identifier.
   Defaults are `user-selected` for spec-author/developer/QA and `high-reasoning`
   for planner. Profiles are labels, not model IDs to send to a provider.
2. If the user has selected a model explicitly, use that choice. A directly observable
   user-selected model in the current client's configuration/session can supply the
   default; record the evidence. Do not infer it from a model's own prose or assume
   different clients use the same identifier. Reuse known confirmed choices.
3. If the choice is missing, ambiguous or cannot be observed, ask which model to use
   BEFORE invoking the role and wait for the answer. Offer available options only
   when verified. Do not launch the role on an unknown default merely to ask it.
4. For planning, discuss the most capable option available within the user's limits.
   The user chooses it; the planner can use the same model as the other roles. Never
   upgrade cost, switch provider or replace the user's choice without approval.
5. Persist the selected per-client profile and the decision. Configure each affected
   native role's `model` field or a supported per-invocation override. This is project
   configuration; do not silently change global client/account settings.
6. Before each delegation, check the effective routing against the chosen model and
   pass requested model, configuration/effective-model evidence and any explicit
   fallback reference in the handoff. Inheritance is acceptable only when the actual
   inherited selection is confirmed to satisfy the user's choice.
7. If unavailable, denied or silently substituted by the client, stop and explain
   the issue. Offer a viable available alternative and ask before using it. Keep
   the assigned role and its artifact boundaries. Never claim routing was verified
   when the client cannot expose enough evidence.

## Installer behavior

Fresh projects contain null model selections so no provider is hardcoded. When
`.ahfora/project.json` already contains per-role selections, newly generated native
adapters receive those exact model strings. Existing customized adapters are preserved;
reinstall does not silently replace their model. The orchestrator reconciles any
mismatch between requested and effective configuration before delegation.

Restart/reload the client when native definitions change. Each role repeats the
model gate on entry and reports missing confirmation rather than proceeding blindly.
The agent keeps the original feature request while resolving this prerequisite.
