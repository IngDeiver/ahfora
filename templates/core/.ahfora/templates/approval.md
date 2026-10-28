# Approval record <uuid>

- Spec ID: TODO
- Gate: spec | plan-and-tasks | final-acceptance | architecture | model-fallback
- Decision: approved | rejected
- User/decision owner: TODO (do not invent)
- Timestamp (UTC): TODO (from a tool)
- User instruction or faithful quotation: TODO
- Conversation/reference, when available: TODO (never invent a message ID)
- Artifact revisions and code baseline when applicable: TODO
- Snapshot file names and SHA-256 digests: TODO (computed by a tool)
- Scope, conditions and exclusions: TODO or none

Preserve approved artifact copies alongside this record. Treat the record and copies
as immutable after recording; later changes get a new record. Task progress can
advance, but changed task definitions need a new plan/task approval. This is a
traceability record of a real user decision, not a cryptographic human signature.
