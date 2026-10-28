# Requirement review

For each requirement, ask:

1. Is the actor/system and obligation explicit?
2. Are triggers, preconditions, inputs and observable outcomes defined?
3. Are terms and units consistent? Are thresholds approved rather than invented?
4. Is it in scope and consistent with other requirements and the constitution?
5. Can it be verified in a known environment? What distinguishes success from failure?
6. Are relevant errors, boundaries and side effects covered?
7. Does it have stable identity and traceable acceptance scenarios?

Consider authorization, invalid/empty input, missing dependencies, retries,
idempotency, concurrent operations, compatibility and recovery only where relevant.
For NFRs, name the method, workload, environment and threshold. For manual review,
define the rubric and responsible reviewer rather than "looks good".

Readiness requires no blocking unanswered questions. Keep a small section for explicit
limitations, approved assumptions and N/A rationales. Never use "implementation
detail" to conceal an unresolved business decision.
