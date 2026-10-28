# Authorized local improvements

Use the `ahfora-improvement` skill and the improvement template to propose a change
under `<unix-ms>-<uuid>-<slug>.md`. Record the failure evidence, affected files,
proposed diff, validation, rollback and explicit user decision.

States: `proposed`, `approved`, `rejected`, `applied`, `verified`, `rolled-back`.
An approved proposal is not yet applied; an applied proposal is not yet verified.
Do not alter the proposal's scope after approval without asking again.

Scope is this project's installed instructions, skills, templates and adapters.
No automatic changes to the public AHFORA package, other repositories, global client
settings, or other users' rules. Never grant yourself approval or remove a gate to
make a task easier. Preserve the previous version/diff and the user's decision.
