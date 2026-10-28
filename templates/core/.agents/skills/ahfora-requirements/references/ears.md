# EARS pattern guide

EARS (Easy Approach to Requirements Syntax) constrains natural-language obligations.
Use an explicit system, condition/trigger and observable response. The following
patterns are brief summaries; attribution is in the project's reference document.

| Pattern | Form | When to use |
| --- | --- | --- |
| Ubiquitous | The system shall <response>. | Always applicable obligation |
| Event-driven | When <trigger>, the system shall <response>. | Response to an event |
| State-driven | While <state>, the system shall <response>. | Obligation during a state |
| Optional feature | Where <feature is included>, the system shall <response>. | Conditional product capability |
| Unwanted behavior | If <unwanted condition>, then the system shall <response>. | Error/recovery behavior |
| Combined | While <state>, when <trigger>, the system shall <response>. | Both state and trigger matter |

Use one coherent obligation per ID, defined terms and concrete outcomes. Do not pack
unrelated behaviors into one sentence. EARS does not automatically remove ambiguity:
"shall respond quickly" still needs a threshold and measurement conditions.

Keep product obligations distinct from implementation decisions. A technology can
appear as a requirement only when it is a confirmed external constraint.
